from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from app.core.auth import get_current_user
from app.core.supabase import get_supabase
from app.core.config import get_settings
from app.core.logging import logger
from app.services.ai_analysis import analyze_fabric_image
import uuid

router = APIRouter(prefix="/uploads", tags=["Uploads"])

ALLOWED_TYPES = {"image/jpeg", "image/jpg", "image/png"}


@router.post("/")
async def upload_fabric(
    file: UploadFile = File(...),
    user: dict = Depends(get_current_user),
):
    settings = get_settings()

    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Only JPG, JPEG, and PNG files are allowed")

    content = await file.read()
    file_size_kb = len(content) // 1024

    if file_size_kb > settings.max_upload_size_mb * 1024:
        raise HTTPException(status_code=400, detail=f"File size exceeds {settings.max_upload_size_mb}MB limit")

    supabase = get_supabase()
    file_size_mb = file_size_kb / 1024
    used_mb = 0
    if supabase:
        profile_res = supabase.table("profiles").select("storage_used_mb, storage_limit_mb").eq("id", user["id"]).single().execute()
        if profile_res.data:
            used_mb = profile_res.data.get("storage_used_mb", 0) or 0
            limit_mb = profile_res.data.get("storage_limit_mb", 100) or 100
            if used_mb + file_size_mb > limit_mb:
                raise HTTPException(status_code=400, detail="Storage limit exceeded. Please upgrade your plan.")

    upload_id = str(uuid.uuid4())
    file_path = f"{user['id']}/{upload_id}/{file.filename}"

    file_url = f"/api/uploads/mock/{upload_id}"

    if supabase:
        try:
            supabase.storage.from_("fabric-images").upload(file_path, content, {"content-type": file.content_type})
            file_url = supabase.storage.from_("fabric-images").get_public_url(file_path)
        except Exception as e:
            logger.error("Storage upload failed", error=str(e))
            raise HTTPException(status_code=500, detail="Failed to upload file to storage")

        upload_data = {
            "id": upload_id,
            "user_id": user["id"],
            "file_name": file.filename,
            "file_url": file_url,
            "file_size_kb": file_size_kb,
            "mime_type": file.content_type,
            "status": "processing",
        }
        result = supabase.table("uploads").insert(upload_data).execute()
        upload_record = result.data[0] if result.data else upload_data
    else:
        upload_record = {
            "id": upload_id,
            "user_id": user["id"],
            "file_name": file.filename,
            "file_url": file_url,
            "file_size_kb": file_size_kb,
            "mime_type": file.content_type,
            "status": "processing",
        }

    analysis = analyze_fabric_image(file.filename or "fabric", file_size_kb)

    report_id = str(uuid.uuid4())
    report_data = {
        "id": report_id,
        "upload_id": upload_id,
        "user_id": user["id"],
        **analysis,
    }

    if supabase:
        supabase.table("reports").insert(report_data).execute()
        supabase.table("uploads").update({"status": "completed"}).eq("id", upload_id).execute()
        supabase.table("notifications").insert({
            "user_id": user["id"],
            "title": "Analysis Complete",
            "message": f"Your fabric analysis for {file.filename} is ready.",
            "type": "success",
        }).execute()
        supabase.table("activity_logs").insert({
            "user_id": user["id"],
            "action": "upload_analyzed",
            "details": {"upload_id": upload_id, "report_id": report_id},
        }).execute()
        supabase.table("profiles").update({"storage_used_mb": used_mb + file_size_mb}).eq("id", user["id"]).execute()

    return {
        "upload": {**upload_record, "status": "completed"},
        "report": report_data,
    }


@router.get("/")
async def list_uploads(user: dict = Depends(get_current_user)):
    supabase = get_supabase()
    if not supabase:
        return {"uploads": []}

    result = supabase.table("uploads").select("*").eq("user_id", user["id"]).order("created_at", desc=True).execute()
    return {"uploads": result.data or []}


@router.delete("/{upload_id}")
async def delete_upload(upload_id: str, user: dict = Depends(get_current_user)):
    supabase = get_supabase()
    if not supabase:
        return {"message": "Upload deleted"}

    upload_res = supabase.table("uploads").select("file_size_kb").eq("id", upload_id).eq("user_id", user["id"]).single().execute()
    
    supabase.table("reports").delete().eq("upload_id", upload_id).execute()
    supabase.table("uploads").delete().eq("id", upload_id).eq("user_id", user["id"]).execute()
    
    if upload_res.data:
        file_size_mb = (upload_res.data.get("file_size_kb") or 0) / 1024
        profile_res = supabase.table("profiles").select("storage_used_mb").eq("id", user["id"]).single().execute()
        if profile_res.data:
            used_mb = profile_res.data.get("storage_used_mb", 0) or 0
            new_storage_mb = max(0, used_mb - file_size_mb)
            supabase.table("profiles").update({"storage_used_mb": new_storage_mb}).eq("id", user["id"]).execute()

    return {"message": "Upload and associated reports deleted"}

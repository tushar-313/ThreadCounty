from __future__ import annotations

# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends, HTTPException
from app.core.auth import require_admin
from app.core.supabase import get_supabase

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/stats")
async def admin_stats(admin: dict = Depends(require_admin)):
    supabase = get_supabase()
    if not supabase:
        return {
            "total_users": 0,
            "total_uploads": 0,
            "total_reports": 0,
            "total_messages": 0,
            "plan_distribution": {},
        }

    users = supabase.table("profiles").select("id", count="exact").execute()
    uploads = supabase.table("uploads").select("id", count="exact").execute()
    reports = supabase.table("reports").select("id", count="exact").execute()
    messages = supabase.table("contact_messages").select("id", count="exact").execute()
    plans = supabase.table("profiles").select("subscription_plan").execute()

    plan_counts: dict[str, int] = {}
    for p in plans.data or []:
        plan = p.get("subscription_plan", "free")
        plan_counts[plan] = plan_counts.get(plan, 0) + 1

    return {
        "total_users": users.count or 0,
        "total_uploads": uploads.count or 0,
        "total_reports": reports.count or 0,
        "total_messages": messages.count or 0,
        "plan_distribution": plan_counts,
    }


@router.get("/users")
async def list_users(admin: dict = Depends(require_admin)):
    supabase = get_supabase()
    if not supabase:
        return {"users": []}

    result = supabase.table("profiles").select("*").order("created_at", desc=True).execute()
    return {"users": result.data or []}


@router.patch("/users/{user_id}/role")
async def update_user_role(user_id: str, role: str, admin: dict = Depends(require_admin)):
    if role not in ("user", "admin"):
        raise HTTPException(status_code=400, detail="Invalid role")

    supabase = get_supabase()
    if supabase:
        supabase.table("profiles").update({"role": role}).eq("id", user_id).execute()
    return {"message": f"User role updated to {role}"}


@router.get("/users/{user_id}")
async def get_user_details(user_id: str, admin: dict = Depends(require_admin)):
    supabase = get_supabase()
    if not supabase:
        raise HTTPException(status_code=500, detail="Database not configured")
        
    result = supabase.table("profiles").select("*").eq("id", user_id).single().execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="User not found")
    return {"user": result.data}


@router.patch("/users/{user_id}/plan")
async def update_user_plan(user_id: str, plan: str, admin: dict = Depends(require_admin)):
    valid_plans = {"free": 100, "student": 500, "professional": 5000, "enterprise": 999999}
    if plan not in valid_plans:
        raise HTTPException(status_code=400, detail="Invalid plan")

    supabase = get_supabase()
    if supabase:
        supabase.table("profiles").update({
            "subscription_plan": plan,
            "storage_limit_mb": valid_plans[plan]
        }).eq("id", user_id).execute()
    return {"message": f"User plan updated to {plan}"}


@router.get("/users/{user_id}/uploads")
async def get_user_uploads(user_id: str, admin: dict = Depends(require_admin)):
    supabase = get_supabase()
    if not supabase:
        return {"uploads": []}

    result = supabase.table("uploads").select("*, profiles(full_name, email)").eq("user_id", user_id).order("created_at", desc=True).execute()
    return {"uploads": result.data or []}



@router.get("/uploads")
async def list_all_uploads(admin: dict = Depends(require_admin)):
    supabase = get_supabase()
    if not supabase:
        return {"uploads": []}

    result = supabase.table("uploads").select("*, profiles(full_name, email)").order("created_at", desc=True).limit(50).execute()
    return {"uploads": result.data or []}


@router.delete("/uploads/{upload_id}")
async def admin_delete_upload(upload_id: str, admin: dict = Depends(require_admin)):
    supabase = get_supabase()
    if supabase:
        supabase.table("reports").delete().eq("upload_id", upload_id).execute()
        supabase.table("uploads").delete().eq("id", upload_id).execute()
    return {"message": "Upload deleted"}


@router.get("/messages")
async def list_messages(admin: dict = Depends(require_admin)):
    supabase = get_supabase()
    if not supabase:
        return {"messages": []}

    result = supabase.table("contact_messages").select("*").order("created_at", desc=True).execute()
    return {"messages": result.data or []}

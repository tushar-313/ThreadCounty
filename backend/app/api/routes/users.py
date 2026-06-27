from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.core.auth import get_current_user
from app.core.supabase import get_supabase

router = APIRouter(prefix="/users", tags=["Users"])


class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None


@router.get("/me")
async def get_profile(user: dict = Depends(get_current_user)):
    supabase = get_supabase()
    if not supabase:
        return {
            "profile": {
                "id": user["id"],
                "email": user.get("email"),
                "full_name": "Demo User",
                "role": "user",
                "subscription_plan": "free",
                "storage_used_mb": 0,
                "storage_limit_mb": 100,
            }
        }

    result = supabase.table("profiles").select("*").eq("id", user["id"]).single().execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Profile not found")
    return {"profile": result.data}


@router.patch("/me")
async def update_profile(data: ProfileUpdate, user: dict = Depends(get_current_user)):
    supabase = get_supabase()
    if not supabase:
        return {"profile": {"id": user["id"], **data.model_dump(exclude_none=True)}}

    update_data = data.model_dump(exclude_none=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")

    result = supabase.table("profiles").update(update_data).eq("id", user["id"]).execute()
    return {"profile": result.data[0] if result.data else update_data}


@router.get("/me/activity")
async def get_activity(user: dict = Depends(get_current_user)):
    supabase = get_supabase()
    if not supabase:
        return {"activity": []}

    result = supabase.table("activity_logs").select("*").eq("user_id", user["id"]).order("created_at", desc=True).limit(20).execute()
    return {"activity": result.data or []}


@router.get("/me/notifications")
async def get_notifications(user: dict = Depends(get_current_user)):
    supabase = get_supabase()
    if not supabase:
        return {"notifications": []}

    result = supabase.table("notifications").select("*").eq("user_id", user["id"]).order("created_at", desc=True).limit(20).execute()
    return {"notifications": result.data or []}


@router.patch("/me/notifications/{notification_id}/read")
async def mark_notification_read(notification_id: str, user: dict = Depends(get_current_user)):
    supabase = get_supabase()
    if supabase:
        supabase.table("notifications").update({"read": True}).eq("id", notification_id).eq("user_id", user["id"]).execute()
    return {"message": "Notification marked as read"}

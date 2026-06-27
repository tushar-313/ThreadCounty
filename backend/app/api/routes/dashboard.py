from fastapi import APIRouter, Depends
from app.core.auth import get_current_user, require_admin
from app.core.supabase import get_supabase

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/stats")
async def get_dashboard_stats(user: dict = Depends(get_current_user)):
    supabase = get_supabase()
    if not supabase:
        return {
            "total_uploads": 0,
            "total_reports": 0,
            "storage_used_mb": 0,
            "storage_limit_mb": 100,
            "recent_reports": [],
            "subscription_plan": "free",
        }

    uploads = supabase.table("uploads").select("id", count="exact").eq("user_id", user["id"]).execute()
    reports = supabase.table("reports").select("*").eq("user_id", user["id"]).order("created_at", desc=True).limit(5).execute()
    profile = supabase.table("profiles").select("storage_used_mb, storage_limit_mb, subscription_plan").eq("id", user["id"]).single().execute()

    profile_data = profile.data or {}
    return {
        "total_uploads": uploads.count or 0,
        "total_reports": len(reports.data or []),
        "storage_used_mb": float(profile_data.get("storage_used_mb", 0)),
        "storage_limit_mb": float(profile_data.get("storage_limit_mb", 100)),
        "recent_reports": reports.data or [],
        "subscription_plan": profile_data.get("subscription_plan", "free"),
    }

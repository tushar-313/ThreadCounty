from __future__ import annotations

from fastapi import APIRouter
from pydantic import BaseModel, EmailStr
from app.core.supabase import get_supabase

router = APIRouter(prefix="/contact", tags=["Contact"])


class ContactMessage(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str


@router.post("/")
async def submit_contact(data: ContactMessage):
    """Public endpoint — no authentication required."""
    supabase = get_supabase()
    if supabase:
        supabase.table("contact_messages").insert(data.model_dump()).execute()
    return {"message": "Message sent successfully"}

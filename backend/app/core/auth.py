from __future__ import annotations

from typing import Optional

from fastapi import HTTPException, Depends, Header
from app.core.config import get_settings
from app.core.logging import logger

import jwt
import httpx
import time
from jwt import PyJWKClient


# Cache the JWKS client to avoid refetching on every request
_jwks_client: Optional[PyJWKClient] = None
_jwks_client_init_time: float = 0
JWKS_CACHE_TTL = 3600  # Re-create client every hour


def _get_jwks_client() -> PyJWKClient:
    """Get or create a cached PyJWKClient for the Supabase project's JWKS endpoint."""
    global _jwks_client, _jwks_client_init_time

    settings = get_settings()
    now = time.time()

    if _jwks_client is None or (now - _jwks_client_init_time) > JWKS_CACHE_TTL:
        jwks_url = f"{settings.supabase_url}/auth/v1/.well-known/jwks.json"
        _jwks_client = PyJWKClient(jwks_url, cache_jwk_set=True, lifespan=JWKS_CACHE_TTL)
        _jwks_client_init_time = now
        logger.info("JWKS client initialized", url=jwks_url)

    return _jwks_client


async def get_current_user(authorization: Optional[str] = Header(None)) -> dict:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization header")

    token = authorization.split(" ")[1]
    settings = get_settings()

    # Try JWKS-based verification (works with both HS256 and ES256)
    if settings.supabase_url:
        try:
            jwks_client = _get_jwks_client()
            signing_key = jwks_client.get_signing_key_from_jwt(token)
            payload = jwt.decode(
                token,
                signing_key.key,
                algorithms=["ES256", "HS256"],
                audience="authenticated",
            )
            return {
                "id": payload.get("sub"),
                "email": payload.get("email"),
                "role": payload.get("role", "user"),
            }
        except jwt.ExpiredSignatureError:
            raise HTTPException(status_code=401, detail="Token has expired")
        except jwt.InvalidTokenError as e:
            logger.warning("JWT validation via JWKS failed", error=str(e))
            raise HTTPException(status_code=401, detail="Invalid or expired token")
        except Exception as e:
            # JWKS fetch failed — fall back to unverified claims (dev convenience)
            logger.warning("JWKS verification unavailable, using unverified claims", error=str(e))
            try:
                payload = jwt.decode(token, options={"verify_signature": False})
                return {
                    "id": payload.get("sub"),
                    "email": payload.get("email"),
                    "role": payload.get("role", "user"),
                }
            except Exception:
                raise HTTPException(status_code=401, detail="Invalid token")

    # No Supabase URL configured — decode without verification (dev only)
    try:
        payload = jwt.decode(token, options={"verify_signature": False})
        return {
            "id": payload.get("sub"),
            "email": payload.get("email"),
            "role": payload.get("role", "user"),
        }
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")


async def require_admin(user: dict = Depends(get_current_user)) -> dict:
    from app.core.supabase import get_supabase

    supabase = get_supabase()
    if supabase:
        result = supabase.table("profiles").select("role").eq("id", user["id"]).single().execute()
        if result.data and result.data.get("role") == "admin":
            return user

    if user.get("role") == "admin":
        return user

    raise HTTPException(status_code=403, detail="Admin access required")

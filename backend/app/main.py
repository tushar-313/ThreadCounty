# pyrefly: ignore [missing-import]
from fastapi import FastAPI
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import get_settings
# pyrefly: ignore [missing-import]
from app.core.logging import setup_logging, logger
# pyrefly: ignore [missing-import]
from app.api.routes import uploads, reports, users, dashboard, admin, contact

setup_logging()
settings = get_settings()

app = FastAPI(
    title="ThreadCounty API",
    description="AI-powered textile analysis platform backend",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(uploads.router, prefix="/api")
app.include_router(reports.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(dashboard.router, prefix="/api")
app.include_router(admin.router, prefix="/api")
app.include_router(contact.router, prefix="/api")


@app.get("/")
async def root():
    return {"message": "ThreadCounty API", "version": "1.0.0", "status": "running"}


@app.get("/health")
async def health():
    return {"status": "healthy"}

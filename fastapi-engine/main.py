"""
TwinLink AI Engine — FastAPI Service

This service handles all AI/ML operations for the TwinLink platform:
- Digital Twin generation from user profiles
- Twin-to-twin conversation simulation
- Compatibility analysis from conversation transcripts

The NestJS backend orchestrates calls to this service.
NestJS contains zero AI logic — this is the single source of truth.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.routers import twin_router, conversation_router, compatibility_router


@asynccontextmanager
async def lifespan(application: FastAPI):
    """Application lifespan: startup and shutdown events."""
    print(f"[START] TwinLink AI Engine starting on {settings.HOST}:{settings.PORT}")
    print(f"[CONFIG] Environment: {settings.ENVIRONMENT}")
    yield
    print("[STOP] TwinLink AI Engine shutting down")


app = FastAPI(
    title="TwinLink AI Engine",
    description="AI service for Digital Twin generation, conversation simulation, and compatibility analysis.",
    version="1.0.0",
    lifespan=lifespan,
)

# ── CORS ──────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────
app.include_router(twin_router.router, prefix="/generate-twin", tags=["Twin Generation"])
app.include_router(conversation_router.router, prefix="/conversation", tags=["Conversation"])
app.include_router(compatibility_router.router, prefix="/compatibility", tags=["Compatibility"])


@app.get("/", tags=["Health"])
async def root():
    """Health check endpoint."""
    return {
        "service": "TwinLink AI Engine",
        "status": "healthy",
        "version": "1.0.0",
    }


@app.get("/health", tags=["Health"])
async def health():
    """Detailed health check."""
    return {
        "status": "healthy",
        "environment": settings.ENVIRONMENT,
        "ai_provider": settings.AI_PROVIDER,
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.ENVIRONMENT == "development",
    )

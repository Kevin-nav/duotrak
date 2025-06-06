from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routers import auth, users
from app.core.config import settings

# In a real app, you'd pull origins from settings/environment variables
# For now, allowing all for local development is fine.
# This should be locked down in production.
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    # Add other origins if your frontend runs on a different port/domain
]

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend for the DuoTrak AI-Assisted Accountability Partner App.",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set all CORS enabled origins
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

@app.get("/api/v1", tags=["Root"])
async def read_root():
    """
    Root endpoint to check if the API is running.
    """
    return {"message": "Welcome to the DuoTrak API!"}

# Include the authentication router
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/v1/users", tags=["users"])

# Placeholder for future routers
# from .api.routers import goals, etc.
# app.include_router(goals.router, prefix="/api/v1/goals", tags=["goals"])

app.include_router(api_router, prefix=settings.API_V1_STR) 
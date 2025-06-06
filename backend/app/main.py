from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routers import auth, users, goals, systems, partnerships, ai_planner
from app.core.config import settings

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

@app.get("/", tags=["Root"])
async def read_root():
    """
    Root endpoint to check if the API is running.
    """
    return {"message": "Welcome to the DuoTrak API!"}

# Include the authentication router
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/v1/users", tags=["users"])
app.include_router(goals.router, prefix="/api/v1/goals", tags=["goals"])
app.include_router(systems.router, prefix="/api/v1/systems", tags=["systems"])
app.include_router(partnerships.router, prefix="/api/v1/partnerships", tags=["partnerships"])
app.include_router(ai_planner.router, prefix="/api/v1/planner", tags=["ai_planner"]) 
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routers import auth, users, goals, systems, partnerships, ai_planner
from app.core.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set up CORS using the configurable origins
if settings.CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
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

# Include all the individual routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/v1/users", tags=["users"])
app.include_router(goals.router, prefix="/api/v1/goals", tags=["goals"])
app.include_router(systems.router, prefix="/api/v1/systems", tags=["systems"])
app.include_router(partnerships.router, prefix="/api/v1/partnerships", tags=["partnerships"])
app.include_router(ai_planner.router, prefix="/api/v1/planner", tags=["ai_planner"]) 
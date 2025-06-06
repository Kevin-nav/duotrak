from fastapi import APIRouter

from app.api.api_v1.endpoints import (
    auth, 
    users, 
    goals, 
    systems, 
    checkins, 
    reflections, 
    partnerships,
    direct_messages,
    reactions,
    comments
)

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(goals.router, prefix="/goals", tags=["goals"])
api_router.include_router(systems.router, prefix="/systems", tags=["systems"])
api_router.include_router(checkins.router, prefix="/checkins", tags=["checkins"])
api_router.include_router(reflections.router, prefix="/reflections", tags=["reflections"])
api_router.include_router(partnerships.router, prefix="/partnerships", tags=["partnerships"])
api_router.include_router(direct_messages.router, prefix="/direct_messages", tags=["direct_messages"])
api_router.include_router(reactions.router, prefix="/reactions", tags=["reactions"])
api_router.include_router(comments.router, prefix="/comments", tags=["comments"]) 
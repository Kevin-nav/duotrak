from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import deps
from app.schemas.user_schemas import User, UserCreate
from app.services.auth_service import auth_service

router = APIRouter()

@router.post("/signup", response_model=User, status_code=201)
async def create_user_signup(
    *,
    db: AsyncSession = Depends(deps.get_db),
    user_in: UserCreate,
) -> User:
    """
    Create new user profile.
    This endpoint is called after the user is created in Supabase Auth.
    The frontend provides the Supabase user ID, email, and chosen username.
    """
    try:
        user = await auth_service.create_user_profile(db=db, user_in=user_in)
        return user
    except HTTPException as e:
        # Re-raise the HTTP exception from the service layer
        raise e
    except Exception as e:
        # Catch any other unexpected errors
        raise HTTPException(
            status_code=500,
            detail=f"An unexpected error occurred during user creation: {e}",
        ) 
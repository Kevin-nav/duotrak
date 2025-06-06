from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import deps
from app.schemas.user_schemas import User, UserUpdate
from app.db.models.user import User as UserModel
from app.services.user_service import user_service

router = APIRouter()

@router.get("/me", response_model=User)
async def read_users_me(
    current_user: UserModel = Depends(deps.get_current_user),
) -> User:
    """
    Get current user's profile.
    """
    return current_user 

@router.put("/me", response_model=User)
async def update_user_me(
    *,
    db: AsyncSession = Depends(deps.get_db),
    user_in: UserUpdate,
    current_user: UserModel = Depends(deps.get_current_user),
) -> User:
    """
    Update own user profile.
    """
    try:
        updated_user = await user_service.update_user_profile(
            db=db, current_user=current_user, user_in=user_in
        )
        return updated_user
    except HTTPException as e:
        # Propagate exceptions from the service layer
        raise e
    except Exception as e:
        # Handle unexpected errors gracefully
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred while updating the profile.",
        ) 
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, timedelta
from fastapi.security import OAuth2PasswordRequestForm
from jose import jwt

from app.api import deps
from app.schemas.user_schemas import User, UserCreate
from app.services.auth_service import auth_service
from app.schemas.token_schemas import Token
from app.crud.crud_user import user as crud_user
from app.core.config import settings

router = APIRouter()

@router.post("/token", response_model=Token)
async def login_for_access_token(
    db: AsyncSession = Depends(deps.get_db), form_data: OAuth2PasswordRequestForm = Depends()
):
    """
    OAuth2 compatible token login, get an access token for future requests.
    **For development only:** authenticates user based on email without password.
    """
    user = await crud_user.get_by_email(db, email=form_data.username)
    if not user:
        raise HTTPException(
            status_code=400, detail="No user with that email found"
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {
        "sub": str(user.id),
        "exp": datetime.utcnow() + access_token_expires,
    }
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.ALGORITHM)
    return {
        "access_token": encoded_jwt,
        "token_type": "bearer",
    }

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
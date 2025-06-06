from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status

from app.crud.crud_user import user as crud_user
from app.schemas.user_schemas import UserCreate
from app.db.models.user import User

class AuthService:
    async def create_user_profile(self, db: AsyncSession, *, user_in: UserCreate) -> User:
        """
        Orchestrates the creation of a new user profile.
        This includes checking for existing users to prevent duplicates.
        """
        # Business logic: Check if a user with that email already exists
        existing_user_email = await crud_user.get_by_email(db, email=user_in.email)
        if existing_user_email:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="A user with this email address already exists.",
            )

        # Business logic: Check if a user with that username already exists
        existing_user_username = await crud_user.get_by_username(db, username=user_in.username)
        if existing_user_username:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="A user with this username already exists.",
            )

        # If checks pass, proceed to create the user profile in the database
        user = await crud_user.create(db, obj_in=user_in)

        return user

auth_service = AuthService() 
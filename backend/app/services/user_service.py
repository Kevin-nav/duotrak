from sqlalchemy.ext.asyncio import AsyncSession
import uuid
from fastapi import HTTPException, status

from app.crud.crud_user import user as crud_user
from app.db.models.user import User
from app.schemas.user_schemas import UserUpdate

class UserService:
    async def get_user_by_id(self, db: AsyncSession, *, user_id: uuid.UUID) -> User | None:
        """
        Get a user by their ID.
        """
        return await crud_user.get(db, id=user_id)

    async def update_user_profile(
        self, db: AsyncSession, *, current_user: User, user_in: UserUpdate
    ) -> User:
        """
        Update a user's profile with validation.
        """
        # Business logic: Check if the new username is already taken by another user.
        if user_in.username and user_in.username != current_user.username:
            existing_user = await crud_user.get_by_username(db, username=user_in.username)
            if existing_user:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="This username is already taken. Please choose another one.",
                )
        
        # If checks pass, proceed to update the user in the database
        updated_user = await crud_user.update(db, db_obj=current_user, obj_in=user_in)
        return updated_user

user_service = UserService() 
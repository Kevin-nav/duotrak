from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import Optional, Type, Any, Dict
import uuid

from app.db.models.user import User
from app.schemas.user_schemas import UserCreate, UserUpdate

class CRUDUser:
    def __init__(self, model: Type[User]):
        self.model = model

    async def get(self, db: AsyncSession, id: uuid.UUID) -> Optional[User]:
        """
        Get a user by ID.
        """
        statement = select(self.model).where(self.model.id == id)
        result = await db.execute(statement)
        return result.scalars().first()

    async def get_by_email(self, db: AsyncSession, *, email: str) -> Optional[User]:
        """
        Get a user by email.
        """
        statement = select(self.model).where(self.model.email == email)
        result = await db.execute(statement)
        return result.scalars().first()

    async def get_by_username(self, db: AsyncSession, *, username: str) -> Optional[User]:
        """
        Get a user by username.
        """
        statement = select(self.model).where(self.model.username == username)
        result = await db.execute(statement)
        return result.scalars().first()

    async def create(self, db: AsyncSession, *, obj_in: UserCreate) -> User:
        """
        Create a new user profile.
        Note: This assumes the auth user has already been created in Supabase.
        The obj_in.id should match the Supabase auth.users.id.
        """
        db_obj = self.model(**obj_in.dict())
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def update(
        self, 
        db: AsyncSession, 
        *, 
        db_obj: User, 
        obj_in: UserUpdate | Dict[str, Any]
    ) -> User:
        """
        Update a user's profile.
        """
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.dict(exclude_unset=True)
        
        for field in update_data:
            if hasattr(db_obj, field):
                setattr(db_obj, field, update_data[field])
        
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

user = CRUDUser(User) 
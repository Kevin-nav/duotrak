import uuid
from typing import List, Optional, Type
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.db.models.reflection import Reflection
from app.schemas.reflection_schemas import ReflectionCreate, ReflectionUpdate

class CRUDReflection:
    def __init__(self, model: Type[Reflection]):
        self.model = model

    async def create(self, db: AsyncSession, *, obj_in: ReflectionCreate) -> Reflection:
        """
        Create a new reflection.
        """
        db_obj = self.model(**obj_in.dict())
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def get(self, db: AsyncSession, id: uuid.UUID) -> Optional[Reflection]:
        """
        Get a single reflection by its ID.
        """
        statement = select(self.model).where(self.model.id == id)
        result = await db.execute(statement)
        return result.scalars().first()

    async def get_multi_by_goal(
        self, db: AsyncSession, *, goal_id: uuid.UUID, skip: int = 0, limit: int = 100
    ) -> List[Reflection]:
        """
        Get multiple reflections for a specific goal with pagination.
        """
        statement = (
            select(self.model)
            .where(self.model.goal_id == goal_id)
            .offset(skip)
            .limit(limit)
            .order_by(self.model.created_at.desc())
        )
        result = await db.execute(statement)
        return result.scalars().all()

    async def update(
        self, db: AsyncSession, *, db_obj: Reflection, obj_in: ReflectionUpdate
    ) -> Reflection:
        """
        Update an existing reflection.
        """
        update_data = obj_in.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def remove(self, db: AsyncSession, *, id: uuid.UUID) -> Optional[Reflection]:
        """
        Remove a reflection by its ID.
        """
        statement = select(self.model).where(self.model.id == id)
        result = await db.execute(statement)
        db_obj = result.scalars().first()
        if db_obj:
            await db.delete(db_obj)
            await db.commit()
        return db_obj

reflection = CRUDReflection(Reflection) 
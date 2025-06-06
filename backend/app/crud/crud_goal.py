import uuid
from typing import List, Optional, Type
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.db.models.goal import Goal
from app.schemas.goal_schemas import GoalCreate, GoalUpdate

class CRUDGoal:
    def __init__(self, model: Type[Goal]):
        self.model = model

    async def create_with_owner(
        self, db: AsyncSession, *, obj_in: GoalCreate, user_id: uuid.UUID
    ) -> Goal:
        """
        Create a new goal for a specific user.
        """
        db_obj = self.model(**obj_in.dict(), user_id=user_id)
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def get(self, db: AsyncSession, id: uuid.UUID) -> Optional[Goal]:
        """
        Get a single goal by its ID.
        """
        statement = select(self.model).where(self.model.id == id)
        result = await db.execute(statement)
        return result.scalars().first()

    async def get_multi_by_owner(
        self, db: AsyncSession, *, user_id: uuid.UUID, skip: int = 0, limit: int = 100
    ) -> List[Goal]:
        """
        Get multiple goals for a specific user with pagination.
        """
        statement = (
            select(self.model)
            .where(self.model.user_id == user_id)
            .offset(skip)
            .limit(limit)
            .order_by(self.model.created_at.desc())
        )
        result = await db.execute(statement)
        return result.scalars().all()

    async def update(
        self, db: AsyncSession, *, db_obj: Goal, obj_in: GoalUpdate
    ) -> Goal:
        """
        Update an existing goal.
        """
        update_data = obj_in.dict(exclude_unset=True)
        for field in update_data:
            if hasattr(db_obj, field):
                setattr(db_obj, field, update_data[field])
        
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def remove(self, db: AsyncSession, *, id: uuid.UUID) -> Optional[Goal]:
        """
        Remove a goal by its ID.
        """
        statement = select(self.model).where(self.model.id == id)
        result = await db.execute(statement)
        db_obj = result.scalars().first()
        if db_obj:
            await db.delete(db_obj)
            await db.commit()
        return db_obj

goal = CRUDGoal(Goal) 
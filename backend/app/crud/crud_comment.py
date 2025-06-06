import uuid
from typing import List, Optional, Type
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import joinedload

from app.db.models.comment import Comment
from app.schemas.comment_schemas import CommentCreate, CommentUpdate

class CRUDComment:
    def __init__(self, model: Type[Comment]):
        self.model = model

    async def create(self, db: AsyncSession, *, obj_in: CommentCreate, user_id: uuid.UUID) -> Comment:
        """
        Create a new comment.
        """
        db_obj = self.model(
            **obj_in.dict(),
            user_id=user_id
        )
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def get(self, db: AsyncSession, id: uuid.UUID) -> Optional[Comment]:
        """
        Get a single comment by ID, with user details loaded.
        """
        statement = select(self.model).where(self.model.id == id).options(joinedload(self.model.user))
        result = await db.execute(statement)
        return result.scalars().first()

    async def get_multi_by_goal(self, db: AsyncSession, *, goal_id: uuid.UUID, skip: int = 0, limit: int = 100) -> List[Comment]:
        """
        Get multiple comments for a specific goal with pagination.
        """
        statement = (
            select(self.model)
            .where(self.model.goal_id == goal_id)
            .options(joinedload(self.model.user))
            .order_by(self.model.created_at.asc())
            .offset(skip)
            .limit(limit)
        )
        result = await db.execute(statement)
        return result.scalars().all()

    async def get_multi_by_checkin(self, db: AsyncSession, *, checkin_id: uuid.UUID, skip: int = 0, limit: int = 100) -> List[Comment]:
        """
        Get multiple comments for a specific checkin with pagination.
        """
        statement = (
            select(self.model)
            .where(self.model.checkin_id == checkin_id)
            .options(joinedload(self.model.user))
            .order_by(self.model.created_at.asc())
            .offset(skip)
            .limit(limit)
        )
        result = await db.execute(statement)
        return result.scalars().all()

    async def update(self, db: AsyncSession, *, db_obj: Comment, obj_in: CommentUpdate) -> Comment:
        """
        Update an existing comment.
        """
        update_data = obj_in.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def remove(self, db: AsyncSession, *, id: uuid.UUID) -> Optional[Comment]:
        """
        Remove a comment by its ID.
        """
        db_obj = await self.get(db, id=id)
        if db_obj:
            await db.delete(db_obj)
            await db.commit()
        return db_obj

comment = CRUDComment(Comment) 
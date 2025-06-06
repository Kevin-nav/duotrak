import uuid
from typing import List, Optional, Type
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import joinedload

from app.db.models.reaction import Reaction
from app.schemas.reaction_schemas import ReactionCreate

class CRUDReaction:
    def __init__(self, model: Type[Reaction]):
        self.model = model

    async def create(self, db: AsyncSession, *, obj_in: ReactionCreate, user_id: uuid.UUID) -> Reaction:
        """
        Create a new reaction for a message by a user.
        """
        db_obj = self.model(
            **obj_in.dict(),
            user_id=user_id
        )
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj, attribute_names=['user'])
        return db_obj

    async def get_by_user_and_message(self, db: AsyncSession, *, user_id: uuid.UUID, message_id: uuid.UUID, emoji: str) -> Optional[Reaction]:
        """
        Find a specific reaction by a user on a specific message with a specific emoji.
        Useful for preventing duplicate reactions or for finding a reaction to delete.
        """
        statement = select(self.model).where(
            self.model.user_id == user_id,
            self.model.message_id == message_id,
            self.model.emoji == emoji
        ).options(joinedload(self.model.user))
        result = await db.execute(statement)
        return result.scalars().first()
    
    async def get_multi_by_message(
        self, db: AsyncSession, *, message_id: uuid.UUID, skip: int = 0, limit: int = 100
    ) -> List[Reaction]:
        """
        Get all reactions for a specific message.
        """
        statement = (
            select(self.model)
            .where(self.model.message_id == message_id)
            .options(joinedload(self.model.user))
            .offset(skip)
            .limit(limit)
        )
        result = await db.execute(statement)
        return result.scalars().all()

    async def remove(self, db: AsyncSession, *, id: uuid.UUID) -> Optional[Reaction]:
        """
        Remove a reaction by its ID.
        """
        statement = select(self.model).where(self.model.id == id)
        result = await db.execute(statement)
        db_obj = result.scalars().first()
        if db_obj:
            await db.delete(db_obj)
            await db.commit()
        return db_obj

reaction = CRUDReaction(Reaction) 
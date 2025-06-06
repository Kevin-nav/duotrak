import uuid
from typing import List, Optional, Type
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload, joinedload

from app.db.models.direct_message import DirectMessage
from app.db.models.reaction import Reaction # Import Reaction for relationship loading
from app.schemas.direct_message_schemas import DirectMessageCreate

class CRUDDirectMessage:
    def __init__(self, model: Type[DirectMessage]):
        self.model = model

    async def create(self, db: AsyncSession, *, obj_in: DirectMessageCreate, sender_id: uuid.UUID) -> DirectMessage:
        """
        Create a new direct message.
        """
        db_obj = self.model(
            **obj_in.dict(),
            sender_id=sender_id
        )
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def get(self, db: AsyncSession, id: uuid.UUID) -> Optional[DirectMessage]:
        """
        Get a single direct message by its ID.
        """
        statement = select(self.model).where(self.model.id == id)
        result = await db.execute(statement)
        return result.scalars().first()

    async def get_multi_by_partnership(
        self, db: AsyncSession, *, partnership_id: uuid.UUID, skip: int = 0, limit: int = 100
    ) -> List[DirectMessage]:
        """
        Get the message history for a specific partnership, ordered from oldest to newest.
        Eagerly loads reactions and the reaction authors to prevent N+1 queries.
        """
        statement = (
            select(self.model)
            .where(self.model.partnership_id == partnership_id)
            .options(
                selectinload(self.model.reactions).joinedload(Reaction.user)
            )
            .order_by(self.model.created_at.asc()) # Ascending for chat history
            .offset(skip)
            .limit(limit)
        )
        result = await db.execute(statement)
        return result.scalars().unique().all()
    
    async def mark_as_read(self, db: AsyncSession, *, message: DirectMessage) -> DirectMessage:
        """
        Mark a message as read.
        """
        message.is_read = True
        db.add(message)
        await db.commit()
        await db.refresh(message)
        return message


direct_message = CRUDDirectMessage(DirectMessage) 
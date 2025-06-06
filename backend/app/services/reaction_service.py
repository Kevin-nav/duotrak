import uuid
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status

from app.crud import crud_reaction, crud_direct_message
from app.db.models.user import User as UserModel
from app.db.models.reaction import Reaction
from app.schemas.reaction_schemas import ReactionCreate
from app.services.partnership_service import partnership_service

class ReactionService:
    async def add_reaction_to_message(
        self, db: AsyncSession, *, reaction_in: ReactionCreate, user: UserModel
    ) -> Reaction:
        """
        Add a reaction to a direct message, with validation.
        """
        # 1. Get the message to react to
        message = await crud_direct_message.get(db, id=reaction_in.message_id)
        if not message:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Message not found."
            )

        # 2. Verify the user is part of the message's partnership
        active_partnership = await partnership_service.get_active_partnership(db, user=user)
        if not active_partnership or active_partnership.id != message.partnership_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only react to messages in your active partnership."
            )
        
        # 3. Check for existing identical reaction from the same user
        existing_reaction = await crud_reaction.get_by_user_and_message(
            db, user_id=user.id, message_id=message.id, emoji=reaction_in.emoji
        )
        if existing_reaction:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You have already reacted with this emoji."
            )

        # 4. Create the reaction
        return await crud_reaction.create(db, obj_in=reaction_in, user_id=user.id)

    async def remove_reaction_from_message(
        self, db: AsyncSession, *, reaction_id: uuid.UUID, user: UserModel
    ) -> Reaction:
        """
        Remove a reaction from a direct message.
        """
        statement = select(Reaction).where(Reaction.id == reaction_id)
        result = await db.execute(statement)
        reaction_to_delete = result.scalars().first()

        if not reaction_to_delete:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Reaction not found."
            )
        
        if reaction_to_delete.user_id != user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You are not authorized to remove this reaction."
            )

        return await crud_reaction.remove(db, id=reaction_id)

    async def get_reactions_for_message(
        self, db: AsyncSession, *, message_id: uuid.UUID, user: UserModel
    ) -> List[Reaction]:
        """
        Get all reactions for a specific message, ensuring user has access.
        """
        # 1. Get the message
        message = await crud_direct_message.get(db, id=message_id)
        if not message:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Message not found."
            )

        # 2. Verify the user is part of the message's partnership
        active_partnership = await partnership_service.get_active_partnership(db, user=user)
        if not active_partnership or active_partnership.id != message.partnership_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You cannot view reactions for this message."
            )
        
        # 3. Fetch reactions
        return await crud_reaction.get_multi_by_message(db, message_id=message_id)


reaction_service = ReactionService() 
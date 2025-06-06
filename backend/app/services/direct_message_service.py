 import uuid
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status

from app.crud import crud_direct_message
from app.db.models.user import User as UserModel
from app.schemas.direct_message_schemas import DirectMessageCreate, DirectMessage
from app.services.partnership_service import partnership_service

class DirectMessageService:
    async def send_message(
        self, db: AsyncSession, *, message_in: DirectMessageCreate, sender: UserModel
    ) -> DirectMessage:
        """
        Send a direct message to a partner.
        Verifies that an active partnership exists and the message is valid.
        """
        # 1. Get the sender's active partnership
        active_partnership = await partnership_service.get_active_partnership(db, user=sender)
        if not active_partnership:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have an active partnership."
            )

        # 2. Verify the message's partnership_id matches the active one
        if message_in.partnership_id != active_partnership.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only send messages within your active partnership."
            )

        # 3. Verify the recipient is the sender's partner
        partner_id = (
            active_partnership.approver_id
            if sender.id == active_partnership.requester_id
            else active_partnership.requester_id
        )
        if message_in.recipient_id != partner_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only send messages to your partner."
            )

        # 4. If all checks pass, create the message
        return await crud_direct_message.create(db, obj_in=message_in, sender_id=sender.id)


    async def get_conversation(
        self, db: AsyncSession, *, partnership_id: uuid.UUID, user: UserModel
    ) -> List[DirectMessage]:
        """
        Get the conversation history for a partnership.
        Verifies the user is part of the partnership.
        """
        # 1. Get the user's active partnership
        active_partnership = await partnership_service.get_active_partnership(db, user=user)
        if not active_partnership or active_partnership.id != partnership_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You are not authorized to view this conversation."
            )
        
        # 2. Fetch messages
        return await crud_direct_message.get_multi_by_partnership(db, partnership_id=partnership_id)


direct_message_service = DirectMessageService()

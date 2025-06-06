import uuid
from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import deps
from app.db.models.user import User as UserModel
from app.schemas.direct_message_schemas import DirectMessage, DirectMessageCreate
from app.services.direct_message_service import direct_message_service

router = APIRouter()

@router.post("/", response_model=DirectMessage, status_code=status.HTTP_201_CREATED)
async def send_direct_message(
    *,
    db: AsyncSession = Depends(deps.get_db),
    message_in: DirectMessageCreate,
    current_user: UserModel = Depends(deps.get_current_user),
) -> DirectMessage:
    """
    Send a direct message to the user's partner.
    The service layer will validate the user's active partnership.
    """
    return await direct_message_service.send_message(db=db, message_in=message_in, sender=current_user)

@router.get("/{partnership_id}", response_model=List[DirectMessage])
async def get_direct_message_conversation(
    *,
    db: AsyncSession = Depends(deps.get_db),
    partnership_id: uuid.UUID,
    current_user: UserModel = Depends(deps.get_current_user),
) -> List[DirectMessage]:
    """
    Get the conversation history for a specific partnership.
    The service layer will validate that the user is part of this partnership.
    """
    return await direct_message_service.get_conversation(db=db, partnership_id=partnership_id, user=current_user) 
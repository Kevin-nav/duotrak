import uuid
from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import deps
from app.db.models.user import User as UserModel
from app.schemas.reaction_schemas import Reaction, ReactionCreate
from app.services.reaction_service import reaction_service

router = APIRouter()

@router.post("/", response_model=Reaction, status_code=status.HTTP_201_CREATED)
async def add_reaction(
    *,
    db: AsyncSession = Depends(deps.get_db),
    reaction_in: ReactionCreate,
    current_user: UserModel = Depends(deps.get_current_user),
) -> Reaction:
    """
    Add a reaction to a direct message.
    """
    return await reaction_service.add_reaction_to_message(db=db, reaction_in=reaction_in, user=current_user)

@router.delete("/{reaction_id}", response_model=Reaction)
async def remove_reaction(
    *,
    db: AsyncSession = Depends(deps.get_db),
    reaction_id: uuid.UUID,
    current_user: UserModel = Depends(deps.get_current_user),
) -> Reaction:
    """
    Remove a reaction from a direct message.
    """
    return await reaction_service.remove_reaction_from_message(db=db, reaction_id=reaction_id, user=current_user)

@router.get("/by_message/{message_id}", response_model=List[Reaction])
async def get_reactions_by_message(
    *,
    db: AsyncSession = Depends(deps.get_db),
    message_id: uuid.UUID,
    current_user: UserModel = Depends(deps.get_current_user),
) -> List[Reaction]:
    """
    Get all reactions for a specific message.
    """
    return await reaction_service.get_reactions_for_message(db=db, message_id=message_id, user=current_user) 
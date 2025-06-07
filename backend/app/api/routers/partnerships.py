import uuid
from typing import List
from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import deps
from app.db.models.user import User as UserModel
from app.db.models.partnership import PartnershipStatus
from app.schemas.partnership_schemas import Partnership, PartnershipCreate, PartnershipUpdate
from app.services.partnership_service import partnership_service

router = APIRouter()

@router.post("/request", response_model=Partnership, status_code=status.HTTP_201_CREATED)
async def send_partnership_request(
    *,
    db: AsyncSession = Depends(deps.get_db),
    request_in: PartnershipCreate,
    current_user: UserModel = Depends(deps.get_current_user),
) -> Partnership:
    """
    Send a partnership request to another user.
    """
    return await partnership_service.send_request(db=db, request_in=request_in, requester=current_user)

@router.get("/requests/pending", response_model=List[Partnership])
async def get_pending_requests(
    db: AsyncSession = Depends(deps.get_db),
    current_user: UserModel = Depends(deps.get_current_user),
) -> List[Partnership]:
    """
    Get all incoming partnership requests that are pending for the current user.
    """
    return await partnership_service.get_pending_requests(db=db, user=current_user)

@router.get("/current", response_model=Partnership)
async def get_current_partnership(
    db: AsyncSession = Depends(deps.get_db),
    current_user: UserModel = Depends(deps.get_current_user),
) -> Partnership:
    """
    Get the current user's active partnership.
    """
    partnership = await partnership_service.get_active_partnership(db=db, user=current_user)
    if not partnership:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No active partnership found.")
    return partnership

@router.put("/requests/{partnership_id}/respond", response_model=Partnership)
async def respond_to_partnership_request(
    *,
    db: AsyncSession = Depends(deps.get_db),
    partnership_id: uuid.UUID,
    response_in: PartnershipUpdate,
    current_user: UserModel = Depends(deps.get_current_user),
) -> Partnership:
    """
    Respond to a partnership request (Accept or Decline).
    This is for an existing user responding from within the app UI.
    """
    # Simple validation to ensure only valid status updates are sent
    if response_in.status not in [PartnershipStatus.ACTIVE, PartnershipStatus.DISSOLVED]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid response status.")

    return await partnership_service.respond_to_request(
        db=db, partnership_id=partnership_id, response=response_in, approver=current_user
    )

@router.get("/accept-invite/{token}", response_model=Partnership)
async def accept_partnership_invite(
    *,
    db: AsyncSession = Depends(deps.get_db),
    token: str,
    current_user: UserModel = Depends(deps.get_current_user),
) -> Partnership:
    """
    Accept a partnership invitation using a token from an email link.
    The user must be logged in to accept the invitation.
    """
    return await partnership_service.accept_invite_with_token(
        db=db, token=token, accepting_user=current_user
    )

@router.delete("/{partnership_id}", response_model=Partnership)
async def terminate_partnership(
    *,
    db: AsyncSession = Depends(deps.get_db),
    partnership_id: uuid.UUID,
    current_user: UserModel = Depends(deps.get_current_user),
) -> Partnership:
    """
    Terminate an active partnership.
    """
    return await partnership_service.terminate_partnership(
        db=db, partnership_id=partnership_id, current_user=current_user
    )

import uuid
from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import deps
from app.db.models.user import User as UserModel
from app.schemas.checkin_schemas import Checkin, CheckinCreate, CheckinUpdate
from app.services.checkin_service import checkin_service

router = APIRouter()

@router.post("/", response_model=Checkin, status_code=status.HTTP_201_CREATED)
async def create_checkin(
    *,
    db: AsyncSession = Depends(deps.get_db),
    checkin_in: CheckinCreate,
    current_user: UserModel = Depends(deps.get_current_user),
) -> Checkin:
    """
    Create a new checkin for one of the user's systems.
    The system_id must be provided in the request body.
    """
    return await checkin_service.create_checkin_for_system(db=db, checkin_in=checkin_in, user=current_user)

@router.get("/{checkin_id}", response_model=Checkin)
async def read_checkin(
    *,
    db: AsyncSession = Depends(deps.get_db),
    checkin_id: uuid.UUID,
    current_user: UserModel = Depends(deps.get_current_user),
) -> Checkin:
    """
    Get a specific checkin by ID.
    """
    return await checkin_service.get_checkin_by_id(db=db, checkin_id=checkin_id, user=current_user)

@router.get("/by_system/{system_id}", response_model=List[Checkin])
async def read_checkins_by_system(
    *,
    db: AsyncSession = Depends(deps.get_db),
    system_id: uuid.UUID,
    current_user: UserModel = Depends(deps.get_current_user),
) -> List[Checkin]:
    """
    Get all checkins belonging to a specific system.
    """
    return await checkin_service.get_checkins_for_system(db=db, system_id=system_id, user=current_user)

@router.put("/{checkin_id}", response_model=Checkin)
async def update_checkin(
    *,
    db: AsyncSession = Depends(deps.get_db),
    checkin_id: uuid.UUID,
    checkin_in: CheckinUpdate,
    current_user: UserModel = Depends(deps.get_current_user),
) -> Checkin:
    """
    Update a checkin.
    """
    return await checkin_service.update_user_checkin(
        db=db, checkin_id=checkin_id, checkin_in=checkin_in, user=current_user
    )

@router.delete("/{checkin_id}", response_model=Checkin)
async def delete_checkin(
    *,
    db: AsyncSession = Depends(deps.get_db),
    checkin_id: uuid.UUID,
    current_user: UserModel = Depends(deps.get_current_user),
) -> Checkin:
    """
    Delete a checkin.
    """
    return await checkin_service.delete_user_checkin(db=db, checkin_id=checkin_id, user=current_user) 
 import uuid
from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import deps
from app.db.models.user import User as UserModel
from app.schemas.system_schemas import System, SystemCreate, SystemUpdate
from app.services.system_service import system_service

router = APIRouter()

@router.post("/", response_model=System, status_code=status.HTTP_201_CREATED)
async def create_system(
    *,
    db: AsyncSession = Depends(deps.get_db),
    system_in: SystemCreate,
    current_user: UserModel = Depends(deps.get_current_user),
) -> System:
    """
    Create a new system for one of the user's goals.
    The goal_id must be provided in the request body.
    """
    return await system_service.create_system_for_goal(db=db, system_in=system_in, user=current_user)

@router.get("/{system_id}", response_model=System)
async def read_system(
    *,
    db: AsyncSession = Depends(deps.get_db),
    system_id: uuid.UUID,
    current_user: UserModel = Depends(deps.get_current_user),
) -> System:
    """
    Get a specific system by ID.
    """
    return await system_service.get_system_by_id(db=db, system_id=system_id, user=current_user)

@router.get("/by_goal/{goal_id}", response_model=List[System])
async def read_systems_by_goal(
    *,
    db: AsyncSession = Depends(deps.get_db),
    goal_id: uuid.UUID,
    current_user: UserModel = Depends(deps.get_current_user),
) -> List[System]:
    """
    Get all systems belonging to a specific goal.
    """
    return await system_service.get_systems_for_goal(db=db, goal_id=goal_id, user=current_user)

@router.put("/{system_id}", response_model=System)
async def update_system(
    *,
    db: AsyncSession = Depends(deps.get_db),
    system_id: uuid.UUID,
    system_in: SystemUpdate,
    current_user: UserModel = Depends(deps.get_current_user),
) -> System:
    """
    Update a system.
    """
    return await system_service.update_user_system(
        db=db, system_id=system_id, system_in=system_in, user=current_user
    )

@router.delete("/{system_id}", response_model=System)
async def delete_system(
    *,
    db: AsyncSession = Depends(deps.get_db),
    system_id: uuid.UUID,
    current_user: UserModel = Depends(deps.get_current_user),
) -> System:
    """
    Delete a system.
    """
    return await system_service.delete_user_system(db=db, system_id=system_id, user=current_user)

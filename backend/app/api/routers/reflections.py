 import uuid
from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import deps
from app.db.models.user import User as UserModel
from app.schemas.reflection_schemas import Reflection, ReflectionCreate, ReflectionUpdate
from app.services.reflection_service import reflection_service

router = APIRouter()

@router.post("/", response_model=Reflection, status_code=status.HTTP_201_CREATED)
async def create_reflection(
    *,
    db: AsyncSession = Depends(deps.get_db),
    reflection_in: ReflectionCreate,
    current_user: UserModel = Depends(deps.get_current_user),
) -> Reflection:
    """
    Create a new reflection for one of the user's goals.
    The goal_id must be provided in the request body.
    """
    return await reflection_service.create_reflection_for_goal(db=db, reflection_in=reflection_in, user=current_user)

@router.get("/{reflection_id}", response_model=Reflection)
async def read_reflection(
    *,
    db: AsyncSession = Depends(deps.get_db),
    reflection_id: uuid.UUID,
    current_user: UserModel = Depends(deps.get_current_user),
) -> Reflection:
    """
    Get a specific reflection by ID.
    """
    return await reflection_service.get_reflection_by_id(db=db, reflection_id=reflection_id, user=current_user)

@router.get("/by_goal/{goal_id}", response_model=List[Reflection])
async def read_reflections_by_goal(
    *,
    db: AsyncSession = Depends(deps.get_db),
    goal_id: uuid.UUID,
    current_user: UserModel = Depends(deps.get_current_user),
) -> List[Reflection]:
    """
    Get all reflections belonging to a specific goal.
    """
    return await reflection_service.get_reflections_for_goal(db=db, goal_id=goal_id, user=current_user)

@router.put("/{reflection_id}", response_model=Reflection)
async def update_reflection(
    *,
    db: AsyncSession = Depends(deps.get_db),
    reflection_id: uuid.UUID,
    reflection_in: ReflectionUpdate,
    current_user: UserModel = Depends(deps.get_current_user),
) -> Reflection:
    """
    Update a reflection.
    """
    return await reflection_service.update_user_reflection(
        db=db, reflection_id=reflection_id, reflection_in=reflection_in, user=current_user
    )

@router.delete("/{reflection_id}", response_model=Reflection)
async def delete_reflection(
    *,
    db: AsyncSession = Depends(deps.get_db),
    reflection_id: uuid.UUID,
    current_user: UserModel = Depends(deps.get_current_user),
) -> Reflection:
    """
    Delete a reflection.
    """
    return await reflection_service.delete_user_reflection(db=db, reflection_id=reflection_id, user=current_user)

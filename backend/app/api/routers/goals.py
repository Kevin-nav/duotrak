import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import deps
from app.db.models.user import User as UserModel
from app.schemas.goal_schemas import Goal, GoalCreate, GoalUpdate
from app.services.goal_service import goal_service

router = APIRouter()

@router.get("/", response_model=List[Goal])
async def read_goals(
    db: AsyncSession = Depends(deps.get_db),
    current_user: UserModel = Depends(deps.get_current_user),
) -> List[Goal]:
    """
    Retrieve all goals for the current user.
    """
    return await goal_service.get_user_goals(db=db, user=current_user)

@router.post("/", response_model=Goal, status_code=status.HTTP_201_CREATED)
async def create_goal(
    *,
    db: AsyncSession = Depends(deps.get_db),
    goal_in: GoalCreate,
    current_user: UserModel = Depends(deps.get_current_user),
) -> Goal:
    """
    Create a new goal for the current user.
    """
    return await goal_service.create_user_goal(db=db, goal_in=goal_in, user=current_user)

@router.get("/{goal_id}", response_model=Goal)
async def read_goal(
    *,
    db: AsyncSession = Depends(deps.get_db),
    goal_id: uuid.UUID,
    current_user: UserModel = Depends(deps.get_current_user),
) -> Goal:
    """
    Get a specific goal by ID.
    """
    goal = await goal_service.get_goal_by_id(db=db, goal_id=goal_id, user=current_user)
    # The service layer handles the 404 Not Found case.
    return goal

@router.put("/{goal_id}", response_model=Goal)
async def update_goal(
    *,
    db: AsyncSession = Depends(deps.get_db),
    goal_id: uuid.UUID,
    goal_in: GoalUpdate,
    current_user: UserModel = Depends(deps.get_current_user),
) -> Goal:
    """
    Update a goal.
    """
    return await goal_service.update_user_goal(db=db, goal_id=goal_id, goal_in=goal_in, user=current_user)

@router.delete("/{goal_id}", response_model=Goal)
async def delete_goal(
    *,
    db: AsyncSession = Depends(deps.get_db),
    goal_id: uuid.UUID,
    current_user: UserModel = Depends(deps.get_current_user),
) -> Goal:
    """
    Delete a goal.
    """
    return await goal_service.delete_user_goal(db=db, goal_id=goal_id, user=current_user) 
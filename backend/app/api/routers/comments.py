import uuid
from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import deps
from app.db.models.user import User as UserModel
from app.schemas.comment_schemas import Comment, CommentCreate, CommentUpdate
from app.services.comment_service import comment_service

router = APIRouter()

@router.post("/", response_model=Comment, status_code=status.HTTP_201_CREATED)
async def create_comment(
    *,
    db: AsyncSession = Depends(deps.get_db),
    comment_in: CommentCreate,
    current_user: UserModel = Depends(deps.get_current_user),
) -> Comment:
    """
    Create a new comment on a goal or check-in.
    The service layer will validate access to the parent item.
    """
    return await comment_service.create_comment(db=db, comment_in=comment_in, user=current_user)

@router.get("/by_goal/{goal_id}", response_model=List[Comment])
async def read_comments_by_goal(
    *,
    db: AsyncSession = Depends(deps.get_db),
    goal_id: uuid.UUID,
    current_user: UserModel = Depends(deps.get_current_user),
) -> List[Comment]:
    """
    Get all comments for a specific goal.
    """
    return await comment_service.get_comments_for_goal(db=db, goal_id=goal_id, user=current_user)

@router.get("/by_checkin/{checkin_id}", response_model=List[Comment])
async def read_comments_by_checkin(
    *,
    db: AsyncSession = Depends(deps.get_db),
    checkin_id: uuid.UUID,
    current_user: UserModel = Depends(deps.get_current_user),
) -> List[Comment]:
    """
    Get all comments for a specific checkin.
    """
    return await comment_service.get_comments_for_checkin(db=db, checkin_id=checkin_id, user=current_user)

@router.put("/{comment_id}", response_model=Comment)
async def update_comment(
    *,
    db: AsyncSession = Depends(deps.get_db),
    comment_id: uuid.UUID,
    comment_in: CommentUpdate,
    current_user: UserModel = Depends(deps.get_current_user),
) -> Comment:
    """
    Update a comment. Only the author can update their comment.
    """
    return await comment_service.update_comment(
        db=db, comment_id=comment_id, comment_in=comment_in, user=current_user
    )

@router.delete("/{comment_id}", response_model=Comment)
async def delete_comment(
    *,
    db: AsyncSession = Depends(deps.get_db),
    comment_id: uuid.UUID,
    current_user: UserModel = Depends(deps.get_current_user),
) -> Comment:
    """
    Delete a comment. Only the author can delete their comment.
    """
    return await comment_service.delete_comment(db=db, comment_id=comment_id, user=current_user) 
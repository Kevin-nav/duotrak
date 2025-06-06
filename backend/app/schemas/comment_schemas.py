import uuid
from pydantic import BaseModel, Field, root_validator
from typing import Optional
from datetime import datetime

from app.schemas.user_schemas import UserInfo

# --- Base Schema ---
class CommentBase(BaseModel):
    content: str = Field(..., min_length=1, max_length=1000)

    class Config:
        orm_mode = True

# --- Create Schema ---
class CommentCreate(CommentBase):
    goal_id: Optional[uuid.UUID] = None
    checkin_id: Optional[uuid.UUID] = None

    @root_validator
    def validate_one_parent_id(cls, values):
        """Ensure exactly one parent ID is provided."""
        goal_id, checkin_id = values.get('goal_id'), values.get('checkin_id')
        if (goal_id is None and checkin_id is None):
            raise ValueError('Either goal_id or checkin_id must be provided.')
        if (goal_id is not None and checkin_id is not None):
            raise ValueError('Only one of goal_id or checkin_id can be provided.')
        return values

# --- Update Schema ---
class CommentUpdate(BaseModel):
    content: str = Field(..., min_length=1, max_length=1000)

# --- API Response Schema ---
class Comment(CommentBase):
    id: uuid.UUID
    user_id: uuid.UUID
    goal_id: Optional[uuid.UUID]
    checkin_id: Optional[uuid.UUID]
    created_at: datetime
    updated_at: datetime
    user: UserInfo # Include author details in the response 
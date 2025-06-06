import uuid
from pydantic import BaseModel, Field
from typing import Optional
from datetime import date, datetime

from app.db.models.goal import GoalStatus, GoalPriority

# --- Base Schema ---
# Shared properties for all goal-related schemas
class GoalBase(BaseModel):
    title: Optional[str] = Field(None, min_length=3, max_length=100)
    description: Optional[str] = None
    category: Optional[str] = None
    priority: Optional[GoalPriority] = GoalPriority.MEDIUM
    status: Optional[GoalStatus] = GoalStatus.NOT_STARTED
    start_date: Optional[date] = None
    target_date: Optional[date] = None

    class Config:
        orm_mode = True
        use_enum_values = True # Important for sending enum values as strings

# --- Create Schema ---
# Properties to receive via API on creation
class GoalCreate(GoalBase):
    title: str = Field(..., min_length=3, max_length=100) # Title is required on creation

# --- Update Schema ---
# Properties to receive via API on update
class GoalUpdate(GoalBase):
    pass # All fields are optional, so GoalBase is sufficient

# --- Database Schema ---
# Properties shared by models stored in DB
class GoalInDBBase(GoalBase):
    id: uuid.UUID
    user_id: uuid.UUID
    created_at: datetime
    updated_at: datetime

# --- API Response Schema ---
# Properties to return to client
class Goal(GoalInDBBase):
    pass 
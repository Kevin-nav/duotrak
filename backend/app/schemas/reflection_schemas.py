import uuid
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class ReflectionBase(BaseModel):
    title: Optional[str] = Field(None, min_length=3, max_length=100)
    content: str = Field(..., description="The main content of the reflection entry.")

    class Config:
        orm_mode = True

class ReflectionCreate(ReflectionBase):
    goal_id: uuid.UUID
    title: str = Field(..., min_length=3, max_length=100)


class ReflectionUpdate(ReflectionBase):
    # All fields are optional for an update
    title: Optional[str] = Field(None, min_length=3, max_length=100)
    content: Optional[str] = None


class ReflectionInDBBase(ReflectionBase):
    id: uuid.UUID
    goal_id: uuid.UUID
    created_at: datetime
    updated_at: datetime

class Reflection(ReflectionInDBBase):
    pass 
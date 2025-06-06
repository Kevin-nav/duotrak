 import uuid
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class SystemBase(BaseModel):
    name: Optional[str] = Field(None, min_length=3, max_length=100)
    description: Optional[str] = None
    
    class Config:
        orm_mode = True

class SystemCreate(SystemBase):
    name: str = Field(..., min_length=3, max_length=100)
    goal_id: uuid.UUID

class SystemUpdate(SystemBase):
    pass

class SystemInDBBase(SystemBase):
    id: uuid.UUID
    goal_id: uuid.UUID
    created_at: datetime
    updated_at: datetime

class System(SystemInDBBase):
    pass

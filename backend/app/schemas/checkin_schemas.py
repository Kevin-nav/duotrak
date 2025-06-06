import uuid
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class CheckinBase(BaseModel):
    notes: Optional[str] = None
    progress: int = Field(..., ge=0, le=100, description="Progress percentage from 0 to 100")

    class Config:
        orm_mode = True

class CheckinCreate(CheckinBase):
    system_id: uuid.UUID

class CheckinUpdate(CheckinBase):
    # Allow updating notes or progress independently
    notes: Optional[str] = None
    progress: Optional[int] = Field(None, ge=0, le=100)


class CheckinInDBBase(CheckinBase):
    id: uuid.UUID
    system_id: uuid.UUID
    created_at: datetime
    updated_at: datetime

class Checkin(CheckinInDBBase):
    pass 
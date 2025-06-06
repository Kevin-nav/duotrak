import uuid
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from app.db.models.partnership import PartnershipStatus
from app.schemas.user_schemas import UserInfo

# --- Base Schema ---
class PartnershipBase(BaseModel):
    status: Optional[PartnershipStatus] = PartnershipStatus.PENDING
    
    class Config:
        orm_mode = True
        use_enum_values = True

# --- Create Schema ---
class PartnershipCreate(BaseModel):
    # To create a request, you only need to know who you're sending it to.
    # The requester is the current_user.
    approver_id: uuid.UUID


# --- Update Schema ---
# For accepting/declining, we only need to update the status.
class PartnershipUpdate(BaseModel):
    status: PartnershipStatus


# --- API Response Schema ---
# This is what we'll return from the API.
# It includes the full user objects for both requester and approver.
class Partnership(PartnershipBase):
    id: uuid.UUID
    requester_id: uuid.UUID
    approver_id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    
    # Nested user information for rich API responses
    requester: UserInfo
    approver: UserInfo 
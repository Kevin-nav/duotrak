import uuid
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from app.schemas.reaction_schemas import Reaction

# --- Base Schema ---
class DirectMessageBase(BaseModel):
    content: str = Field(..., min_length=1, max_length=1000)

    class Config:
        orm_mode = True

# --- Create Schema ---
class DirectMessageCreate(DirectMessageBase):
    # When creating a message, the sender is the current user.
    # We only need to know the recipient and the partnership it belongs to.
    recipient_id: uuid.UUID
    partnership_id: uuid.UUID


# --- Update Schema ---
# We will assume messages are immutable and cannot be updated.

# --- API Response Schema ---
class DirectMessage(DirectMessageBase):
    id: uuid.UUID
    sender_id: uuid.UUID
    recipient_id: uuid.UUID
    partnership_id: uuid.UUID
    created_at: datetime
    is_read: bool
    reactions: List[Reaction] = [] 
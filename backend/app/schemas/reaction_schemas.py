import uuid
from pydantic import BaseModel, Field
from datetime import datetime
from app.schemas.user_schemas import UserInfo

# --- Base Schema ---
class ReactionBase(BaseModel):
    emoji: str = Field(..., description="The emoji character for the reaction.")

    class Config:
        orm_mode = True

# --- Create Schema ---
class ReactionCreate(ReactionBase):
    # To create a reaction, we need to know which message it's for.
    # The user adding the reaction is the current_user.
    message_id: uuid.UUID

# --- API Response Schema ---
class Reaction(ReactionBase):
    id: uuid.UUID
    user_id: uuid.UUID
    message_id: uuid.UUID
    created_at: datetime
    user: UserInfo # Include author details in the response 
import uuid
from pydantic import BaseModel, EmailStr, constr, Field
from typing import Optional
from datetime import datetime

# A minimal User schema to expose only necessary, public-facing info
# for nesting in other models (e.g., comments, reactions, partnerships).
class UserInfo(BaseModel):
    id: uuid.UUID
    username: str
    avatar_url: Optional[str] = None

    class Config:
        orm_mode = True

# --- Base Schema ---
# Shared properties for all user-related schemas
class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[constr(strip_whitespace=True, min_length=3, max_length=50)] = None
    name: Optional[str] = None
    profile_image_url: Optional[str] = None
    bio: Optional[str] = None
    timezone: Optional[str] = "UTC"
    is_active: bool = True

    class Config:
        orm_mode = True

# --- Create Schema ---
# Properties to receive via API on creation
# This schema is important because it defines what the frontend must send to create a user.
# In our case, Supabase handles the initial user creation via its own endpoint.
# This schema will be used when creating the user profile in our public.users table
# after the auth.users entry is created.
class UserCreate(BaseModel):
    id: uuid.UUID  # This ID comes from Supabase Auth (auth.users.id)
    email: EmailStr
    username: constr(strip_whitespace=True, min_length=3, max_length=50)
    name: Optional[str] = None
    timezone: str = "UTC"

# --- Update Schema ---
# Properties to receive via API on update
class UserUpdate(BaseModel):
    username: Optional[constr(strip_whitespace=True, min_length=3, max_length=50)] = None
    name: Optional[str] = None
    profile_image_url: Optional[str] = None
    bio: Optional[str] = None
    timezone: Optional[str] = None
    theme_preference: Optional[str] = None
    # notification_preferences can be its own complex schema if needed
    notification_preferences: Optional[list] = None


# --- Database Schema ---
# Properties shared by models stored in DB
class UserInDBBase(UserBase):
    id: uuid.UUID
    is_email_verified: bool = False
    created_at: datetime
    updated_at: datetime
    
    class Config:
        orm_mode = True

# --- API Response Schema ---
# Properties to return to client
# This is the main schema that will be used to send user data to the frontend
class User(UserInDBBase):
    pass

# --- Full Database Schema ---
# Additional properties stored in DB but not necessarily sent to client
class UserInDB(UserInDBBase):
    # If we were storing hashed passwords, it would go here.
    # Supabase handles this, so it's not needed in our model.
    pass 
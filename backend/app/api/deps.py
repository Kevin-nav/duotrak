from collections.abc import AsyncGenerator
import uuid
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from jose import jwt, JWTError

from app.db.session import SessionLocal
from app.core.config import settings
from app.db.models.user import User
from app.schemas.token_schemas import TokenPayload
from app.crud.crud_user import user as crud_user

# Placeholder for User model and schemas
# from app.models.user import User
# from app.schemas.token import TokenPayload
# from app.core import security

reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/token"
)

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Dependency that provides a database session for a single request.
    """
    async with SessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

# Placeholder for the authentication dependency
# This will be fully implemented once User models and security functions are ready.
async def get_current_user(
    db: AsyncSession = Depends(get_db), token: str = Depends(reusable_oauth2)
) -> User:
    """
    Dependency to get the current authenticated user from a JWT token.
    """
    try:
        payload = jwt.decode(
            token, settings.JWT_SECRET, algorithms=[settings.ALGORITHM]
        )
        token_data = TokenPayload(**payload)
    except (JWTError, Exception):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials.",
        )
    
    user = await crud_user.get(db, id=token_data.sub)
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user.")
        
    return user 
import uuid
from datetime import datetime
from enum import Enum as PyEnum

from sqlalchemy import Column, DateTime, ForeignKey, String, func, Enum as SQLAlchemyEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.schema import UniqueConstraint

from app.db.base_class import Base

class ReactionTargetType(PyEnum):
    CHECKIN = "checkin"
    DIRECT_MESSAGE = "direct_message"
    REFLECTION = "reflection"
    FEED_ITEM = "feed_item"

class Reaction(Base):
    __tablename__ = "reactions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    emoji = Column(String, nullable=False)
    
    target_type = Column(SQLAlchemyEnum(ReactionTargetType), nullable=False, index=True)
    target_id = Column(UUID(as_uuid=True), nullable=False, index=True)

    # For direct messages, we can have a specific FK for a more direct relationship
    direct_message_id = Column(UUID(as_uuid=True), ForeignKey("direct_messages.id", ondelete="CASCADE"), nullable=True, index=True)

    # Relationships
    user = relationship("User") # No back_populates needed if not listing reactions on the user model directly
    direct_message = relationship("DirectMessage", back_populates="reactions")
    
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    __table_args__ = (
        UniqueConstraint('user_id', 'target_type', 'target_id', 'emoji', name='_user_target_emoji_uc'),
    ) 
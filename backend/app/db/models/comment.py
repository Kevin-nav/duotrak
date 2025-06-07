import uuid
from datetime import datetime
from enum import Enum as PyEnum

from sqlalchemy import Column, Text, DateTime, ForeignKey, String, func, Enum as SQLAlchemyEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.base_class import Base

class CommentTargetType(PyEnum):
    CHECKIN = "checkin"
    REFLECTION = "reflection"
    FEED_ITEM = "feed_item"

class Comment(Base):
    __tablename__ = "comments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    target_type = Column(SQLAlchemyEnum(CommentTargetType), nullable=False, index=True)
    target_id = Column(UUID(as_uuid=True), nullable=False, index=True)

    parent_comment_id = Column(UUID(as_uuid=True), ForeignKey("comments.id", ondelete="CASCADE"), nullable=True, index=True)

    content = Column(Text, nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="comments")
    parent = relationship("Comment", remote_side=[id], back_populates="replies", lazy="selectin")
    replies = relationship("Comment", back_populates="parent", lazy="selectin", cascade="all, delete-orphan")

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
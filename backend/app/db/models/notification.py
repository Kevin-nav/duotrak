import uuid
from datetime import datetime

from sqlalchemy import Column, Text, DateTime, ForeignKey, String, Boolean, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.base_class import Base

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    recipient_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    actor_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True, index=True)

    type = Column(String, index=True, nullable=False)
    title = Column(String, nullable=True)
    message = Column(Text, nullable=True)
    link_to = Column(String, nullable=True)
    
    is_read = Column(Boolean, default=False, index=True, nullable=False)
    read_at_utc = Column(DateTime(timezone=True), nullable=True)

    icon_identifier = Column(String, nullable=True)
    target_type = Column(String, index=True, nullable=True)
    target_id = Column(String, index=True, nullable=True)
    target_name = Column(String, nullable=True)

    # Relationships
    recipient = relationship("User", foreign_keys=[recipient_id], back_populates="notifications_received")
    actor = relationship("User", foreign_keys=[actor_user_id], back_populates="notifications_acted")

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False, index=True)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False) 
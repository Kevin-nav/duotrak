import uuid
from datetime import datetime

from sqlalchemy import Column, Text, DateTime, ForeignKey, String, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.base_class import Base

class DirectMessage(Base):
    __tablename__ = "direct_messages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    partnership_id = Column(UUID(as_uuid=True), ForeignKey("partnerships.id", ondelete="CASCADE"), nullable=False, index=True)
    sender_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    text_content = Column(Text, nullable=True)
    emoji_content = Column(String, nullable=True)
    image_url = Column(String, nullable=True)
    
    sent_at_utc = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    read_at_utc = Column(DateTime(timezone=True), nullable=True, index=True)
    
    reply_to_activity_id = Column(String, nullable=True)
    reply_to_activity_summary = Column(String, nullable=True)

    # Relationships
    partnership = relationship("Partnership", back_populates="direct_messages")
    sender = relationship("User", back_populates="messages_sent")
    reactions = relationship("Reaction", back_populates="direct_message", cascade="all, delete-orphan", lazy="selectin")

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False) 
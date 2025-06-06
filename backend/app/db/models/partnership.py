import uuid
from datetime import datetime
from enum import Enum as PyEnum

from sqlalchemy import Column, String, DateTime, ForeignKey, Enum as SQLAlchemyEnum, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.base_class import Base

class PartnershipStatus(PyEnum):
    PENDING_INVITE = "pending_invite"
    ACTIVE = "active"
    DISSOLVED = "dissolved"
    EXPIRED_INVITE = "expired_invite"

class Partnership(Base):
    __tablename__ = "partnerships"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=True)

    user1_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    user2_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=True, index=True)

    status = Column(SQLAlchemyEnum(PartnershipStatus), default=PartnershipStatus.PENDING_INVITE, nullable=False, index=True)

    invite_token = Column(String, unique=True, index=True, nullable=True)
    invite_token_expires_at = Column(DateTime(timezone=True), nullable=True)
    invite_email = Column(String, nullable=True)

    # Relationships
    user1 = relationship("User", foreign_keys=[user1_id], back_populates="partnerships_as_user1")
    user2 = relationship("User", foreign_keys=[user2_id], back_populates="partnerships_as_user2")

    direct_messages = relationship("DirectMessage", back_populates="partnership", cascade="all, delete-orphan", lazy="selectin")

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    activated_at = Column(DateTime(timezone=True), nullable=True)
    dissolved_at = Column(DateTime(timezone=True), nullable=True) 
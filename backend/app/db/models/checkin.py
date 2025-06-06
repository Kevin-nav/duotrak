import uuid
from datetime import datetime
from enum import Enum as PyEnum

from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Enum as SQLAlchemyEnum, Float, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.base_class import Base

class CheckinStatus(PyEnum):
    COMPLETED = "completed"
    SKIPPED = "skipped"
    PENDING_VERIFICATION = "pending_verification"
    VERIFIED_COMPLETED = "verified_completed"
    QUERIED_BY_PARTNER = "queried_by_partner"

class Checkin(Base):
    __tablename__ = "checkins"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    system_id = Column(UUID(as_uuid=True), ForeignKey("systems.id", ondelete="CASCADE"), nullable=False, index=True)
    partnership_id = Column(UUID(as_uuid=True), ForeignKey("partnerships.id", ondelete="SET NULL"), nullable=True, index=True)
    
    checkin_timestamp_utc = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    original_local_timestamp_str = Column(String, nullable=True)

    status = Column(SQLAlchemyEnum(CheckinStatus), default=CheckinStatus.COMPLETED, nullable=False, index=True)
    
    metric_value_logged = Column(Float, nullable=True)
    notes = Column(Text, nullable=True)
    photo_url = Column(String, nullable=True)
    
    verified_by_partner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True, index=True)
    verified_at_utc = Column(DateTime(timezone=True), nullable=True)
    verifier_query = Column(Text, nullable=True)

    # Relationships
    user = relationship("User", foreign_keys=[user_id], back_populates="checkins_made")
    system = relationship("System", back_populates="checkins")
    verifier = relationship("User", foreign_keys=[verified_by_partner_id], back_populates="verified_checkins")
    # partnership relationship can be added if needed, but the ID is there for querying.

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False) 
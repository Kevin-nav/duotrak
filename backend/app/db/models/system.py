import uuid
from datetime import datetime
from enum import Enum as PyEnum

from sqlalchemy import Column, String, Text, Boolean, DateTime, ForeignKey, Enum as SQLAlchemyEnum, Time, Float, func
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship

from app.db.base_class import Base

class SystemFrequency(PyEnum):
    DAILY = "daily"
    WEEKLY = "weekly"

class SystemMetricType(PyEnum):
    BINARY = "binary"
    COUNTER = "counter"
    DURATION = "duration"
    PAGES = "pages"

class SystemStatus(PyEnum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    PAUSED = "paused"

class System(Base):
    __tablename__ = "systems"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    goal_id = Column(UUID(as_uuid=True), ForeignKey("goals.id", ondelete="CASCADE"), nullable=True, index=True)

    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)

    status = Column(SQLAlchemyEnum(SystemStatus), default=SystemStatus.ACTIVE, nullable=False, index=True)

    frequency = Column(SQLAlchemyEnum(SystemFrequency), nullable=False)
    frequency_details = Column(JSONB, nullable=True)
    
    metric_type = Column(SQLAlchemyEnum(SystemMetricType), nullable=False)
    target_value = Column(Float, nullable=True)
    target_unit = Column(String, nullable=True)
    
    target_time_local = Column(Time, nullable=True)

    verification_required = Column(Boolean, default=False, nullable=False)
    
    checkin_reminder = Column(Boolean, default=False, nullable=True)
    reminder_time_local = Column(Time, nullable=True)

    ai_assistance_used = Column(Boolean, default=False, nullable=True)

    # Relationships
    user = relationship("User", back_populates="systems_created")
    goal = relationship("Goal", back_populates="systems")
    checkins = relationship("Checkin", back_populates="system", cascade="all, delete-orphan", lazy="selectin")

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False) 
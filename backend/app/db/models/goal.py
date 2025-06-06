import uuid
from datetime import datetime
from enum import Enum as PyEnum

from sqlalchemy import Column, String, Text, Boolean, DateTime, ForeignKey, Date, Enum as SQLAlchemyEnum, func
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship

from app.db.base_class import Base

class GoalStatus(PyEnum):
    NOT_STARTED = "not_started"
    IN_PROGRESS = "in_progress"
    ACHIEVED = "achieved"
    ON_HOLD = "on_hold"
    ABANDONED = "abandoned"

class GoalPriority(PyEnum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"

class Goal(Base):
    __tablename__ = "goals"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    
    category = Column(String, nullable=True, index=True)
    priority = Column(SQLAlchemyEnum(GoalPriority), default=GoalPriority.MEDIUM, nullable=True)
    status = Column(SQLAlchemyEnum(GoalStatus), default=GoalStatus.NOT_STARTED, nullable=False, index=True)
    
    start_date = Column(Date, nullable=True)
    target_date = Column(Date, nullable=True, index=True)
    
    ai_assistance_inputs = Column(JSONB, nullable=True)
    ai_generated_plan_details = Column(Text, nullable=True)

    is_archived = Column(Boolean, default=False, nullable=False, index=True)

    # Relationships
    user = relationship("User", back_populates="goals")
    systems = relationship("System", back_populates="goal", cascade="all, delete-orphan", lazy="selectin")

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False) 
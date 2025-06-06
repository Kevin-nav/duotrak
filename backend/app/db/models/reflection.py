import uuid
from datetime import datetime

from sqlalchemy import Column, Text, DateTime, ForeignKey, Date, func, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.schema import UniqueConstraint

from app.db.base_class import Base

class Reflection(Base):
    __tablename__ = "reflections"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    partnership_id = Column(UUID(as_uuid=True), ForeignKey("partnerships.id", ondelete="SET NULL"), nullable=True, index=True)
    
    reflection_date_local = Column(Date, index=True, nullable=False)
    content = Column(Text, nullable=True)
    
    prompt_id = Column(String, nullable=True)
    prompt_text = Column(Text, nullable=True)

    # Relationships
    user = relationship("User", back_populates="reflections")
    # partnership = relationship("Partnership") # Can be added if needed

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    __table_args__ = (
        UniqueConstraint('user_id', 'reflection_date_local', name='_user_reflection_date_uc'),
    ) 
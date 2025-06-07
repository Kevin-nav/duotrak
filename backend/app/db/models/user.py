import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Text, Date, func
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship

from app.db.base_class import Base

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=True)
    name = Column(String, nullable=True)
    
    profile_image_url = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    timezone = Column(String, nullable=False, default="UTC")

    is_active = Column(Boolean, default=True, nullable=False)
    is_email_verified = Column(Boolean, default=False, nullable=False)

    current_partnership_id = Column(UUID(as_uuid=True), ForeignKey("partnerships.id", ondelete="SET NULL"), nullable=True, index=True)
    
    # Relationships
    current_partnership = relationship("Partnership", foreign_keys=[current_partnership_id], backref="active_partners_via_current_id", lazy="selectin")
    partnerships_as_user1 = relationship("Partnership", foreign_keys="Partnership.user1_id", back_populates="user1", lazy="selectin")
    partnerships_as_user2 = relationship("Partnership", foreign_keys="Partnership.user2_id", back_populates="user2", lazy="selectin")

    goals = relationship("Goal", back_populates="user", cascade="all, delete-orphan", lazy="selectin")
    systems_created = relationship("System", back_populates="user", cascade="all, delete-orphan", lazy="selectin")
    checkins = relationship("Checkin", back_populates="user", cascade="all, delete-orphan")
    
    verified_checkins = relationship("Checkin", foreign_keys="Checkin.verified_by_partner_id", back_populates="verifier", lazy="selectin")

    reflections = relationship("Reflection", back_populates="user", cascade="all, delete-orphan", lazy="selectin")
    comments = relationship("Comment", back_populates="user", cascade="all, delete-orphan", lazy="selectin")
    
    messages_sent = relationship("DirectMessage", foreign_keys="DirectMessage.sender_id", back_populates="sender", lazy="selectin")

    notifications_received = relationship("Notification", foreign_keys="Notification.recipient_id", back_populates="recipient", cascade="all, delete-orphan", lazy="selectin")
    notifications_acted = relationship("Notification", foreign_keys="Notification.actor_user_id", back_populates="actor", lazy="selectin")

    theme_preference = Column(String, nullable=True, default="system")
    
    notification_preferences = Column(JSONB, nullable=False, server_default='[{"id": "systemUpdates", "label": "System Updates", "enabled": true}, {"id": "goalProgress", "label": "Goal Progress & Streaks", "enabled": true}]')

    last_daily_summary_sent_at = Column(DateTime(timezone=True), nullable=True)
    last_daily_summary_local_date = Column(Date, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    partnerships_as_requester = relationship(
        "Partnership",
        foreign_keys="[Partnership.requester_id]",
        back_populates="requester",
        cascade="all, delete-orphan",
    )
    
    partnerships_as_approver = relationship(
        "Partnership",
        foreign_keys="[Partnership.approver_id]",
        back_populates="approver",
        cascade="all, delete-orphan",
    ) 
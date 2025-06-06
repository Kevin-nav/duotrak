 import uuid
from typing import List, Optional, Type
from sqlalchemy import or_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import joinedload

from app.db.models.partnership import Partnership, PartnershipStatus
from app.schemas.partnership_schemas import PartnershipCreate, PartnershipUpdate

class CRUDPartnership:
    def __init__(self, model: Type[Partnership]):
        self.model = model

    async def create(self, db: AsyncSession, *, obj_in: PartnershipCreate, requester_id: uuid.UUID) -> Partnership:
        """
        Create a new partnership request.
        """
        db_obj = self.model(
            requester_id=requester_id,
            approver_id=obj_in.approver_id,
            status=PartnershipStatus.PENDING
        )
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def get(self, db: AsyncSession, id: uuid.UUID) -> Optional[Partnership]:
        """
        Get a single partnership by its ID, with user details loaded.
        """
        statement = (
            select(self.model)
            .where(self.model.id == id)
            .options(joinedload(self.model.requester), joinedload(self.model.approver))
        )
        result = await db.execute(statement)
        return result.scalars().first()

    async def get_by_users(self, db: AsyncSession, *, user1_id: uuid.UUID, user2_id: uuid.UUID) -> Optional[Partnership]:
        """
        Find if a partnership of any status already exists between two users.
        """
        statement = select(self.model).where(
            or_(
                (self.model.requester_id == user1_id) & (self.model.approver_id == user2_id),
                (self.model.requester_id == user2_id) & (self.model.approver_id == user1_id)
            )
        )
        result = await db.execute(statement)
        return result.scalars().first()
    
    async def get_pending_requests_for_user(self, db: AsyncSession, *, user_id: uuid.UUID) -> List[Partnership]:
        """
        Get all PENDING partnership requests where the user is the approver.
        """
        statement = (
            select(self.model)
            .where(self.model.approver_id == user_id, self.model.status == PartnershipStatus.PENDING)
            .options(joinedload(self.model.requester), joinedload(self.model.approver))
            .order_by(self.model.created_at.desc())
        )
        result = await db.execute(statement)
        return result.scalars().all()

    async def get_active_partnership_for_user(self, db: AsyncSession, *, user_id: uuid.UUID) -> Optional[Partnership]:
        """
        Get the ACCEPTED partnership for a user, regardless of role.
        """
        statement = (
            select(self.model)
            .where(
                (or_(self.model.requester_id == user_id, self.model.approver_id == user_id)),
                self.model.status == PartnershipStatus.ACCEPTED
            )
            .options(joinedload(self.model.requester), joinedload(self.model.approver))
        )
        result = await db.execute(statement)
        return result.scalars().first()


    async def update(self, db: AsyncSession, *, db_obj: Partnership, obj_in: PartnershipUpdate) -> Partnership:
        """
        Update a partnership (e.g., to change status).
        """
        update_data = obj_in.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def remove(self, db: AsyncSession, *, id: uuid.UUID) -> Optional[Partnership]:
        """
        Remove a partnership by its ID.
        """
        db_obj = await self.get(db, id=id)
        if db_obj:
            await db.delete(db_obj)
            await db.commit()
        return db_obj

partnership = CRUDPartnership(Partnership)

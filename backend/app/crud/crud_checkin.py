import uuid
from typing import List, Optional, Type
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.db.models.checkin import Checkin
from app.schemas.checkin_schemas import CheckinCreate, CheckinUpdate

class CRUDCheckin:
    def __init__(self, model: Type[Checkin]):
        self.model = model

    async def create(self, db: AsyncSession, *, obj_in: CheckinCreate) -> Checkin:
        """
        Create a new check-in.
        """
        db_obj = self.model(**obj_in.dict())
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def get(self, db: AsyncSession, id: uuid.UUID) -> Optional[Checkin]:
        """
        Get a single check-in by its ID.
        """
        statement = select(self.model).where(self.model.id == id)
        result = await db.execute(statement)
        return result.scalars().first()

    async def get_multi_by_system(
        self, db: AsyncSession, *, system_id: uuid.UUID, skip: int = 0, limit: int = 100
    ) -> List[Checkin]:
        """
        Get multiple check-ins for a specific system with pagination.
        """
        statement = (
            select(self.model)
            .where(self.model.system_id == system_id)
            .offset(skip)
            .limit(limit)
            .order_by(self.model.created_at.desc())
        )
        result = await db.execute(statement)
        return result.scalars().all()

    async def update(
        self, db: AsyncSession, *, db_obj: Checkin, obj_in: CheckinUpdate
    ) -> Checkin:
        """
        Update an existing check-in.
        """
        update_data = obj_in.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def remove(self, db: AsyncSession, *, id: uuid.UUID) -> Optional[Checkin]:
        """
        Remove a check-in by its ID.
        """
        statement = select(self.model).where(self.model.id == id)
        result = await db.execute(statement)
        db_obj = result.scalars().first()
        if db_obj:
            await db.delete(db_obj)
            await db.commit()
        return db_obj

checkin = CRUDCheckin(Checkin) 
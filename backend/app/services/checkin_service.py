import uuid
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status

from app.crud import crud_checkin, crud_system
from app.db.models.checkin import Checkin
from app.db.models.user import User as UserModel
from app.schemas.checkin_schemas import CheckinCreate, CheckinUpdate
from app.services.system_service import system_service # We can reuse the ownership check

class CheckinService:
    async def get_checkins_for_system(
        self, db: AsyncSession, *, system_id: uuid.UUID, user: UserModel
    ) -> List[Checkin]:
        """
        Retrieve all check-ins for a specific system, ensuring the user owns the system.
        """
        # This check implicitly verifies goal ownership as well
        await system_service.get_system_by_id(db, system_id=system_id, user=user)
        return await crud_checkin.get_multi_by_system(db, system_id=system_id)

    async def create_checkin_for_system(
        self, db: AsyncSession, *, checkin_in: CheckinCreate, user: UserModel
    ) -> Checkin:
        """
        Create a new check-in for a specific system, ensuring the user owns the system.
        """
        # Verify ownership of the parent system
        await system_service.get_system_by_id(db, system_id=checkin_in.system_id, user=user)
        return await crud_checkin.create(db, obj_in=checkin_in)

    async def get_checkin_by_id(
        self, db: AsyncSession, *, checkin_id: uuid.UUID, user: UserModel
    ) -> Optional[Checkin]:
        """
        Retrieve a specific check-in by ID, ensuring ownership via the parent system/goal.
        """
        checkin = await crud_checkin.get(db, id=checkin_id)
        if not checkin:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Check-in not found."
            )
        # Verify ownership of the parent system
        await system_service.get_system_by_id(db, system_id=checkin.system_id, user=user)
        return checkin

    async def update_user_checkin(
        self, db: AsyncSession, *, checkin_id: uuid.UUID, checkin_in: CheckinUpdate, user: UserModel
    ) -> Checkin:
        """
        Update a check-in, ensuring ownership.
        """
        checkin = await self.get_checkin_by_id(db, checkin_id=checkin_id, user=user)
        # get_checkin_by_id handles all ownership checks
        return await crud_checkin.update(db, db_obj=checkin, obj_in=checkin_in)

    async def delete_user_checkin(
        self, db: AsyncSession, *, checkin_id: uuid.UUID, user: UserModel
    ) -> Checkin:
        """
        Delete a check-in, ensuring ownership.
        """
        checkin = await self.get_checkin_by_id(db, checkin_id=checkin_id, user=user)
        # get_checkin_by_id handles all ownership checks
        return await crud_checkin.remove(db, id=checkin.id)

checkin_service = CheckinService() 
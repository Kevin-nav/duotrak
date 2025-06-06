import uuid
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status

from app.crud import crud_system, crud_goal
from app.db.models.system import System
from app.db.models.user import User as UserModel
from app.schemas.system_schemas import SystemCreate, SystemUpdate

class SystemService:
    async def _verify_goal_ownership(self, db: AsyncSession, *, goal_id: uuid.UUID, user_id: uuid.UUID):
        """
        Private helper to verify that the goal exists and belongs to the user.
        """
        goal = await crud_goal.get(db, id=goal_id)
        if not goal:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Parent goal not found."
            )
        if goal.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User does not have permission to access this goal's systems."
            )
        return goal

    async def get_systems_for_goal(
        self, db: AsyncSession, *, goal_id: uuid.UUID, user: UserModel
    ) -> List[System]:
        """
        Retrieve all systems for a specific goal, ensuring the user owns the goal.
        """
        await self._verify_goal_ownership(db, goal_id=goal_id, user_id=user.id)
        return await crud_system.get_multi_by_goal(db, goal_id=goal_id)

    async def create_system_for_goal(
        self, db: AsyncSession, *, system_in: SystemCreate, user: UserModel
    ) -> System:
        """
        Create a new system under a specific goal, ensuring the user owns the goal.
        """
        await self._verify_goal_ownership(db, goal_id=system_in.goal_id, user_id=user.id)
        return await crud_system.create(db, obj_in=system_in)

    async def get_system_by_id(
        self, db: AsyncSession, *, system_id: uuid.UUID, user: UserModel
    ) -> Optional[System]:
        """
        Retrieve a specific system by ID, ensuring ownership via the parent goal.
        """
        system = await crud_system.get(db, id=system_id)
        if not system:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="System not found."
            )
        await self._verify_goal_ownership(db, goal_id=system.goal_id, user_id=user.id)
        return system

    async def update_user_system(
        self, db: AsyncSession, *, system_id: uuid.UUID, system_in: SystemUpdate, user: UserModel
    ) -> System:
        """
        Update a system, ensuring ownership via the parent goal.
        """
        system = await self.get_system_by_id(db, system_id=system_id, user=user)
        # get_system_by_id handles all ownership checks
        return await crud_system.update(db, db_obj=system, obj_in=system_in)

    async def delete_user_system(
        self, db: AsyncSession, *, system_id: uuid.UUID, user: UserModel
    ) -> System:
        """
        Delete a system, ensuring ownership via the parent goal.
        """
        system = await self.get_system_by_id(db, system_id=system_id, user=user)
        # get_system_by_id handles all ownership checks
        return await crud_system.remove(db, id=system.id)

system_service = SystemService() 
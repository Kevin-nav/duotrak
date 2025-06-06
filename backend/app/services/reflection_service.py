import uuid
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status

from app.crud import crud_reflection
from app.db.models.reflection import Reflection
from app.db.models.user import User as UserModel
from app.schemas.reflection_schemas import ReflectionCreate, ReflectionUpdate
from app.services.goal_service import goal_service # Reusing for ownership check

class ReflectionService:
    async def get_reflections_for_goal(
        self, db: AsyncSession, *, goal_id: uuid.UUID, user: UserModel
    ) -> List[Reflection]:
        """
        Retrieve all reflections for a specific goal, ensuring the user owns the goal.
        """
        # This check verifies goal ownership.
        await goal_service.get_goal_by_id(db, goal_id=goal_id, user=user)
        return await crud_reflection.get_multi_by_goal(db, goal_id=goal_id)

    async def create_reflection_for_goal(
        self, db: AsyncSession, *, reflection_in: ReflectionCreate, user: UserModel
    ) -> Reflection:
        """
        Create a new reflection for a specific goal, ensuring the user owns the goal.
        """
        await goal_service.get_goal_by_id(db, goal_id=reflection_in.goal_id, user=user)
        return await crud_reflection.create(db, obj_in=reflection_in)

    async def get_reflection_by_id(
        self, db: AsyncSession, *, reflection_id: uuid.UUID, user: UserModel
    ) -> Optional[Reflection]:
        """
        Retrieve a specific reflection by ID, ensuring ownership via the parent goal.
        """
        reflection = await crud_reflection.get(db, id=reflection_id)
        if not reflection:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Reflection not found."
            )
        # Verify ownership of the parent goal
        await goal_service.get_goal_by_id(db, goal_id=reflection.goal_id, user=user)
        return reflection

    async def update_user_reflection(
        self, db: AsyncSession, *, reflection_id: uuid.UUID, reflection_in: ReflectionUpdate, user: UserModel
    ) -> Reflection:
        """
        Update a reflection, ensuring ownership.
        """
        reflection = await self.get_reflection_by_id(db, reflection_id=reflection_id, user=user)
        return await crud_reflection.update(db, db_obj=reflection, obj_in=reflection_in)

    async def delete_user_reflection(
        self, db: AsyncSession, *, reflection_id: uuid.UUID, user: UserModel
    ) -> Reflection:
        """
        Delete a reflection, ensuring ownership.
        """
        reflection = await self.get_reflection_by_id(db, reflection_id=reflection_id, user=user)
        return await crud_reflection.remove(db, id=reflection.id)

reflection_service = ReflectionService() 
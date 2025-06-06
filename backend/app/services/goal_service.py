import uuid
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status

from app.crud.crud_goal import goal as crud_goal
from app.db.models.goal import Goal
from app.db.models.user import User as UserModel
from app.schemas.goal_schemas import GoalCreate, GoalUpdate

class GoalService:
    async def get_user_goals(
        self, db: AsyncSession, *, user: UserModel
    ) -> List[Goal]:
        """
        Retrieve all goals for the current user.
        """
        return await crud_goal.get_multi_by_owner(db, user_id=user.id)

    async def create_user_goal(
        self, db: AsyncSession, *, goal_in: GoalCreate, user: UserModel
    ) -> Goal:
        """
        Create a new goal for the current user.
        """
        return await crud_goal.create_with_owner(db, obj_in=goal_in, user_id=user.id)

    async def get_goal_by_id(
        self, db: AsyncSession, *, goal_id: uuid.UUID, user: UserModel
    ) -> Optional[Goal]:
        """
        Retrieve a specific goal by its ID, ensuring it belongs to the current user.
        """
        goal = await crud_goal.get(db, id=goal_id)
        if not goal or goal.user_id != user.id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Goal not found."
            )
        return goal

    async def update_user_goal(
        self, db: AsyncSession, *, goal_id: uuid.UUID, goal_in: GoalUpdate, user: UserModel
    ) -> Goal:
        """
        Update a user's goal, ensuring ownership.
        """
        goal = await self.get_goal_by_id(db, goal_id=goal_id, user=user)
        # get_goal_by_id already handles the 404 case for us.
        return await crud_goal.update(db, db_obj=goal, obj_in=goal_in)

    async def delete_user_goal(
        self, db: AsyncSession, *, goal_id: uuid.UUID, user: UserModel
    ) -> Goal:
        """
        Delete a user's goal, ensuring ownership.
        """
        goal = await self.get_goal_by_id(db, goal_id=goal_id, user=user)
        # get_goal_by_id already handles the 404 case for us.
        return await crud_goal.remove(db, id=goal.id)

goal_service = GoalService() 
import uuid
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status

from app.crud import crud_comment, crud_goal, crud_checkin, crud_system
from app.db.models.user import User as UserModel
from app.db.models.comment import Comment
from app.schemas.comment_schemas import CommentCreate, CommentUpdate
from app.services.partnership_service import partnership_service

class CommentService:
    async def _get_item_owner_id(self, db: AsyncSession, *, goal_id: uuid.UUID = None, checkin_id: uuid.UUID = None) -> uuid.UUID:
        """Private helper to get the ultimate owner of the item being commented on."""
        if goal_id:
            goal = await crud_goal.get(db, id=goal_id)
            if not goal:
                raise HTTPException(status.HTTP_404_NOT_FOUND, "Goal not found.")
            return goal.user_id
        if checkin_id:
            checkin = await crud_checkin.get(db, id=checkin_id)
            if not checkin:
                raise HTTPException(status.HTTP_404_NOT_FOUND, "Checkin not found.")
            
            # To get the owner, we must traverse up from the checkin -> system -> goal
            system = await crud_system.get(db, id=checkin.system_id)
            if not system:
                raise HTTPException(status.HTTP_404_NOT_FOUND, "Parent system not found.")
            
            goal = await crud_goal.get(db, id=system.goal_id)
            if not goal:
                raise HTTPException(status.HTTP_404_NOT_FOUND, "Parent goal not found.")

            return goal.user_id
        
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "No item specified for comment.")

    async def _verify_item_access(self, db: AsyncSession, *, owner_id: uuid.UUID, current_user: UserModel):
        """Private helper to verify if the current user can access an item."""
        if owner_id == current_user.id:
            return  # User owns the item

        active_partnership = await partnership_service.get_active_partnership(db, user=current_user)
        if not active_partnership:
            raise HTTPException(status.HTTP_403_FORBIDDEN, "You do not have access to this item.")

        partner_id = (
            active_partnership.approver_id
            if current_user.id == active_partnership.requester_id
            else active_partnership.requester_id
        )

        if owner_id != partner_id:
            raise HTTPException(status.HTTP_403_FORBIDDEN, "You do not have access to this item.")

    async def create_comment(self, db: AsyncSession, *, comment_in: CommentCreate, user: UserModel) -> Comment:
        owner_id = await self._get_item_owner_id(db, goal_id=comment_in.goal_id, checkin_id=comment_in.checkin_id)
        await self._verify_item_access(db, owner_id=owner_id, current_user=user)
        return await crud_comment.create(db, obj_in=comment_in, user_id=user.id)

    async def get_comments_for_goal(self, db: AsyncSession, *, goal_id: uuid.UUID, user: UserModel) -> List[Comment]:
        owner_id = await self._get_item_owner_id(db, goal_id=goal_id)
        await self._verify_item_access(db, owner_id=owner_id, current_user=user)
        return await crud_comment.get_multi_by_goal(db, goal_id=goal_id)

    async def get_comments_for_checkin(self, db: AsyncSession, *, checkin_id: uuid.UUID, user: UserModel) -> List[Comment]:
        owner_id = await self._get_item_owner_id(db, checkin_id=checkin_id)
        await self._verify_item_access(db, owner_id=owner_id, current_user=user)
        return await crud_comment.get_multi_by_checkin(db, checkin_id=checkin_id)

    async def update_comment(self, db: AsyncSession, *, comment_id: uuid.UUID, comment_in: CommentUpdate, user: UserModel) -> Comment:
        comment = await crud_comment.get(db, id=comment_id)
        if not comment:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Comment not found.")
        if comment.user_id != user.id:
            raise HTTPException(status.HTTP_403_FORBIDDEN, "You can only edit your own comments.")
        return await crud_comment.update(db, db_obj=comment, obj_in=comment_in)

    async def delete_comment(self, db: AsyncSession, *, comment_id: uuid.UUID, user: UserModel) -> Comment:
        comment = await crud_comment.get(db, id=comment_id)
        if not comment:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Comment not found.")
        if comment.user_id != user.id:
            raise HTTPException(status.HTTP_403_FORBIDDEN, "You can only delete your own comments.")
        return await crud_comment.remove(db, id=comment_id)

comment_service = CommentService() 
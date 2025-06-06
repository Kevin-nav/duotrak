import uuid
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status

from app.crud import crud_partnership, crud_user
from app.db.models.partnership import Partnership, PartnershipStatus
from app.db.models.user import User as UserModel
from app.schemas.partnership_schemas import PartnershipCreate, PartnershipUpdate

class PartnershipService:
    async def send_request(
        self, db: AsyncSession, *, request_in: PartnershipCreate, requester: UserModel
    ) -> Partnership:
        """
        Send a partnership request to another user.
        """
        approver_id = request_in.approver_id
        if requester.id == approver_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You cannot create a partnership with yourself."
            )

        approver = await crud_user.get(db, id=approver_id)
        if not approver:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="The user you are trying to partner with does not exist."
            )
        
        existing_partnership = await crud_partnership.get_by_users(db, user1_id=requester.id, user2_id=approver_id)
        if existing_partnership:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"A partnership or request already exists with this user (status: {existing_partnership.status})."
            )

        return await crud_partnership.create(db, obj_in=request_in, requester_id=requester.id)

    async def get_pending_requests(
        self, db: AsyncSession, *, user: UserModel
    ) -> List[Partnership]:
        """
        Get all incoming pending requests for the user.
        """
        return await crud_partnership.get_pending_requests_for_user(db, user_id=user.id)

    async def get_active_partnership(
        self, db: AsyncSession, *, user: UserModel
    ) -> Optional[Partnership]:
        """
        Get the current active (ACCEPTED) partnership for a user.
        """
        return await crud_partnership.get_active_partnership_for_user(db, user_id=user.id)

    async def respond_to_request(
        self, db: AsyncSession, *, partnership_id: uuid.UUID, response: PartnershipUpdate, approver: UserModel
    ) -> Partnership:
        """
        Accept or decline a partnership request.
        """
        partnership = await crud_partnership.get(db, id=partnership_id)
        if not partnership:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Partnership request not found.")
        
        if partnership.approver_id != approver.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You are not authorized to respond to this request.")
            
        if partnership.status != PartnershipStatus.PENDING:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="This request is no longer pending.")

        return await crud_partnership.update(db, db_obj=partnership, obj_in=response)

    async def terminate_partnership(
        self, db: AsyncSession, *, partnership_id: uuid.UUID, current_user: UserModel
    ) -> Partnership:
        """
        Terminate (delete) an active partnership.
        """
        partnership = await crud_partnership.get(db, id=partnership_id)
        if not partnership:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Partnership not found.")

        if current_user.id not in [partnership.requester_id, partnership.approver_id]:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You are not part of this partnership.")
        
        if partnership.status != PartnershipStatus.ACCEPTED:
             raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot terminate a partnership that is not active.")

        return await crud_partnership.remove(db, id=partnership_id)


partnership_service = PartnershipService() 
import uuid
import secrets
from datetime import datetime, timedelta
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status

from app.crud import crud_partnership, crud_user
from app.db.models.partnership import Partnership, PartnershipStatus
from app.db.models.user import User as UserModel
from app.schemas.partnership_schemas import PartnershipCreate, PartnershipUpdate
from app.services.email_service import email_service

class PartnershipService:
    async def send_request(
        self, db: AsyncSession, *, request_in: PartnershipCreate, requester: UserModel
    ) -> Partnership:
        """
        Send a partnership request to another user.
        This now includes generating an invite token and sending an email.
        """
        # The user being invited might not exist in our system yet.
        # We invite them by email.
        if requester.email == request_in.invite_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You cannot create a partnership with yourself."
            )

        # Check if an active or pending partnership already involves the requester
        existing_requester_partnership = await self.get_active_partnership(db, user=requester)
        if existing_requester_partnership:
             raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"You are already in a partnership."
            )
        
        # Check if the invited email belongs to an existing user who is already in a partnership
        invited_user = await crud_user.get_by_email(db, email=request_in.invite_email)
        if invited_user:
            existing_invited_partnership = await self.get_active_partnership(db, user=invited_user)
            if existing_invited_partnership:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="The invited user is already in a partnership."
                )

        # Generate a secure token for the invitation
        invite_token = secrets.token_urlsafe(32)
        expires_in_days = 7
        invite_token_expires_at = datetime.utcnow() + timedelta(days=expires_in_days)

        new_partnership = await crud_partnership.create(
            db, 
            obj_in=request_in, 
            requester_id=requester.id,
            invite_token=invite_token,
            invite_token_expires_at=invite_token_expires_at
        )

        # Send the invitation email
        email_service.send_partnership_invite_email(
            email_to=request_in.invite_email,
            requester_name=requester.name or requester.username,
            invite_token=invite_token
        )

        return new_partnership

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
        This is used when an existing user responds from within the app.
        """
        partnership = await crud_partnership.get(db, id=partnership_id)
        if not partnership:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Partnership request not found.")
        
        if partnership.invite_email != approver.email:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You are not authorized to respond to this request.")
        
        if partnership.status != PartnershipStatus.PENDING_INVITE:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="This request is no longer pending.")

        if response.status == PartnershipStatus.ACTIVE:
            # Mark the partnership as active
            partnership.status = PartnershipStatus.ACTIVE
            partnership.user2_id = approver.id # Link the second user
            partnership.activated_at = datetime.utcnow()
            partnership.invite_token = None # Invalidate token
            partnership.invite_token_expires_at = None
            
            # Assign partnership to both users
            approver.current_partnership_id = partnership.id
            requester = await crud_user.get(db, id=partnership.user1_id)
            if requester:
                requester.current_partnership_id = partnership.id
                db.add(requester)

            db.add(approver)

        else: # If declined or other status
            partnership.status = PartnershipStatus.DISSOLVED # Or a new 'DECLINED' status

        return await crud_partnership.update(db, db_obj=partnership, obj_in=partnership)

    async def accept_invite_with_token(
        self, db: AsyncSession, *, token: str, accepting_user: UserModel
    ) -> Partnership:
        """
        Accept a partnership invite using a token from an email link.
        """
        partnership = await crud_partnership.get_by_invite_token(db, token=token)

        if not partnership:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invalid or expired invitation token.")

        if partnership.status != PartnershipStatus.PENDING_INVITE:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="This invitation is no longer valid.")

        if partnership.invite_token_expires_at < datetime.utcnow():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="This invitation has expired.")

        # All checks passed, accept the invite
        response = PartnershipUpdate(status=PartnershipStatus.ACTIVE)
        return await self.respond_to_request(
            db, partnership_id=partnership.id, response=response, approver=accepting_user
        )

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
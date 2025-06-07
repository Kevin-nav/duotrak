import resend
from typing import List
from app.core.config import settings

class EmailService:
    def __init__(self):
        if not settings.RESEND_API_KEY:
            raise ValueError("RESEND_API_KEY is not configured.")
        resend.api_key = settings.RESEND_API_KEY

    def send_partnership_invite_email(
        self,
        *,
        email_to: str,
        requester_name: str,
        invite_token: str
    ):
        """
        Sends an email to a potential partner with an invitation link.
        """
        project_name = settings.PROJECT_NAME
        # The frontend will have a specific page to handle this token
        accept_url = f"{settings.FRONTEND_URL}/partner-invite/accept?token={invite_token}"

        try:
            params = {
                "from": f"{project_name} <onboarding@resend.dev>",
                "to": [email_to],
                "subject": f"You're invited to be a partner on {project_name}!",
                "html": f"""
                    <p>Hi,</p>
                    <p><b>{requester_name}</b> has invited you to become their accountability partner on {project_name}.</p>
                    <p>Click the link below to accept the invitation:</p>
                    <a href="{accept_url}">Accept Invitation</a>
                    <p>If you did not expect this, you can safely ignore this email.</p>
                """,
            }
            email = resend.Emails.send(params)
            print(f"Partnership invitation sent to {email_to}. Email ID: {email['id']}")
            return email
        except Exception as e:
            print(f"Error sending email to {email_to}: {e}")
            # In a real app, you'd want more robust error handling/logging here
            raise

email_service = EmailService() 
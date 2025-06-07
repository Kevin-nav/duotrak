from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import deps
from app.services.ai_planner_service import ai_planner_service

router = APIRouter()

class AIPlanRequest(BaseModel):
    goal_title: str
    goal_description: str | None = None

class AIPlanResponse(BaseModel):
    plan_text: str

@router.post("/generate-plan", response_model=AIPlanResponse)
async def generate_ai_plan(
    *,
    plan_request: AIPlanRequest,
    db: AsyncSession = Depends(deps.get_db),
    # You could add get_current_user dependency if you want to rate-limit or log usage per user
) -> AIPlanResponse:
    """
    Takes a user's goal and returns an AI-generated plan of systems.
    """
    try:
        generated_plan = await ai_planner_service.generate_system_plan_for_goal(
            goal_title=plan_request.goal_title,
            goal_description=plan_request.goal_description
        )
        return AIPlanResponse(plan_text=generated_plan)
    except Exception as e:
        # Catch potential exceptions from the AI service (e.g., API key issue, network error)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"The AI planning service is currently unavailable. {e}",
        ) 
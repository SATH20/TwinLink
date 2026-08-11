"""Router for twin generation endpoint."""
from fastapi import APIRouter, HTTPException
from app.schemas import GenerateTwinRequest, GenerateTwinResponse
from app.services.twin_service import generate_twin_profile

router = APIRouter()


@router.post(
    "",
    response_model=GenerateTwinResponse,
    summary="Generate a Digital Twin profile",
    description="Creates an AI Digital Twin profile from user personality, values, interests, and goals.",
)
async def generate_twin(data: GenerateTwinRequest) -> GenerateTwinResponse:
    """
    Generate a complete Digital Twin profile.

    Takes user profile data and generates:
    - System prompt for AI personality
    - Personality summary
    - Communication guidelines
    - Reasoning framework for compatibility evaluation
    """
    try:
        result = generate_twin_profile(data)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Twin generation failed: {str(e)}")

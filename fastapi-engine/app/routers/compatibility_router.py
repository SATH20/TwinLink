"""Router for compatibility analysis endpoint."""
from fastapi import APIRouter, HTTPException
from app.schemas import CompatibilityRequest, CompatibilityResponse
from app.services.compatibility_service import analyze_compatibility

router = APIRouter()


@router.post(
    "",
    response_model=CompatibilityResponse,
    summary="Analyze compatibility between two users",
    description="Analyzes a conversation transcript and user profiles to determine compatibility.",
)
async def analyze(data: CompatibilityRequest) -> CompatibilityResponse:
    """
    Analyze compatibility between two users.

    Evaluates across five dimensions:
    - Emotional compatibility
    - Intellectual connection
    - Lifestyle alignment
    - Values alignment
    - Communication compatibility

    Returns scores, strengths, weaknesses, and a recommendation.
    """
    try:
        result = analyze_compatibility(data)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Compatibility analysis failed: {str(e)}")

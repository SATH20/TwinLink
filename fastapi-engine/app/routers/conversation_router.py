"""Router for conversation simulation endpoint."""
from fastapi import APIRouter, HTTPException
from app.schemas import ConversationRequest, ConversationResponse
from app.services.conversation_service import simulate_conversation

router = APIRouter()


@router.post(
    "",
    response_model=ConversationResponse,
    summary="Simulate a twin-to-twin conversation",
    description="Simulates a multi-turn conversation between two Digital Twins to evaluate compatibility.",
)
async def run_conversation(data: ConversationRequest) -> ConversationResponse:
    """
    Simulate a conversation between two Digital Twins.

    Takes both twins' system prompts, memory, and profiles,
    then generates a multi-turn conversation exploring compatibility.
    """
    try:
        result = simulate_conversation(data)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Conversation simulation failed: {str(e)}")

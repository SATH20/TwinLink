"""Pydantic schemas for request/response models."""
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Twin Generation Schemas
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


class PersonalityTraits(BaseModel):
    """Big Five personality model."""
    openness: float = Field(ge=0, le=1, description="Openness to experience")
    conscientiousness: float = Field(ge=0, le=1, description="Conscientiousness")
    extraversion: float = Field(ge=0, le=1, description="Extraversion")
    agreeableness: float = Field(ge=0, le=1, description="Agreeableness")
    neuroticism: float = Field(ge=0, le=1, description="Neuroticism")


class GoalsSchema(BaseModel):
    """User goals schema."""
    relationship: str = Field(description="Relationship goal type")
    personal: List[str] = Field(default_factory=list, description="Personal goals")
    timeline: Optional[str] = Field(default=None, description="Goal timeline")


class LifestyleSchema(BaseModel):
    """User lifestyle schema."""
    schedule: str = Field(default="flexible", description="Work/life schedule")
    socialLevel: str = Field(default="moderate", description="Social activity level")
    exercise: str = Field(default="moderate", description="Exercise frequency")
    diet: Optional[str] = Field(default=None, description="Dietary preference")
    smoking: Optional[str] = Field(default=None, description="Smoking status")
    drinking: Optional[str] = Field(default=None, description="Drinking frequency")


class PreferencesSchema(BaseModel):
    """User preferences schema."""
    ageRange: Optional[Dict[str, int]] = None
    genderPreference: Optional[List[str]] = None
    maxDistance: Optional[int] = None
    dealBreakers: List[str] = Field(default_factory=list)


class GenerateTwinRequest(BaseModel):
    """Request body for twin generation."""
    personality: PersonalityTraits
    values: List[str] = Field(description="Core values")
    interests: List[str] = Field(description="User interests")
    communicationStyle: str = Field(description="Communication style preference")
    goals: GoalsSchema
    lifestyle: LifestyleSchema
    preferences: PreferencesSchema


class GenerateTwinResponse(BaseModel):
    """Response for twin generation."""
    systemPrompt: str = Field(description="AI personality prompt for the twin")
    personalitySummary: str = Field(description="Human-readable personality summary")
    communicationGuidelines: List[str] = Field(description="How the twin should communicate")
    reasoningFramework: str = Field(description="How the twin evaluates compatibility")


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Conversation Schemas
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


class TwinContext(BaseModel):
    """Context for a single twin in a conversation."""
    systemPrompt: str
    memory: Dict[str, Any] = Field(default_factory=dict)
    profile: Dict[str, Any] = Field(default_factory=dict)


class ConversationRequest(BaseModel):
    """Request body for conversation simulation."""
    twinA: TwinContext
    twinB: TwinContext
    context: str = Field(default="first_meeting", description="Conversation context")
    maxTurns: int = Field(default=10, ge=4, le=20, description="Maximum conversation turns")


class ConversationMessage(BaseModel):
    """A single message in a conversation."""
    role: str = Field(description="Either 'twin_a' or 'twin_b'")
    content: str = Field(description="Message content")
    timestamp: str = Field(description="ISO timestamp")


class ConversationResponse(BaseModel):
    """Response from conversation simulation."""
    messages: List[ConversationMessage]
    summary: str
    topicsDiscussed: List[str]
    emotionalTone: str


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Compatibility Schemas
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


class CompatibilityRequest(BaseModel):
    """Request body for compatibility analysis."""
    transcript: List[Dict[str, str]] = Field(description="Conversation transcript")
    twinAProfile: Dict[str, Any] = Field(description="Twin A's profile")
    twinBProfile: Dict[str, Any] = Field(description="Twin B's profile")
    conversationSummary: str = Field(description="Conversation summary")


class DetailedAnalysis(BaseModel):
    """Breakdown of compatibility dimensions."""
    emotional: float = Field(ge=0, le=100)
    intellectual: float = Field(ge=0, le=100)
    lifestyle: float = Field(ge=0, le=100)
    values: float = Field(ge=0, le=100)
    communication: float = Field(ge=0, le=100)


class CompatibilityResponse(BaseModel):
    """Response from compatibility analysis."""
    compatibilityScore: float = Field(ge=0, le=100)
    confidenceScore: float = Field(ge=0, le=100)
    strengths: List[str]
    weaknesses: List[str]
    recommendation: str = Field(
        description="One of: STRONG_MATCH, GOOD_MATCH, MODERATE_MATCH, WEAK_MATCH, NO_MATCH"
    )
    summary: str
    detailedAnalysis: DetailedAnalysis

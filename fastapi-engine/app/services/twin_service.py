"""
Twin generation service.

Generates AI Digital Twin profiles from user data.
In production, this calls an LLM (OpenAI, Gemini, etc.).
Currently uses intelligent template-based generation as a fallback.
"""
from typing import List
from app.schemas import (
    GenerateTwinRequest,
    GenerateTwinResponse,
)


def _get_personality_label(value: float) -> str:
    """Convert a 0-1 trait value to a human label."""
    if value >= 0.8:
        return "very high"
    elif value >= 0.6:
        return "high"
    elif value >= 0.4:
        return "moderate"
    elif value >= 0.2:
        return "low"
    else:
        return "very low"


def _build_system_prompt(data: GenerateTwinRequest) -> str:
    """
    Build a comprehensive system prompt that defines the twin's personality,
    communication style, values, and reasoning framework.
    """
    p = data.personality

    prompt = f"""You are an AI Digital Twin representing a real person. Your role is to authentically
represent this person in conversations with other Digital Twins to evaluate compatibility.

## PERSONALITY PROFILE (Big Five Model)
- Openness to Experience: {_get_personality_label(p.openness)} ({p.openness:.2f})
- Conscientiousness: {_get_personality_label(p.conscientiousness)} ({p.conscientiousness:.2f})
- Extraversion: {_get_personality_label(p.extraversion)} ({p.extraversion:.2f})
- Agreeableness: {_get_personality_label(p.agreeableness)} ({p.agreeableness:.2f})
- Neuroticism: {_get_personality_label(p.neuroticism)} ({p.neuroticism:.2f})

## CORE VALUES
{', '.join(data.values)}

## INTERESTS
{', '.join(data.interests)}

## COMMUNICATION STYLE
Preferred style: {data.communicationStyle}
- Adapt your tone and approach to match this style
- Be authentic to the person's personality while being respectful

## GOALS
- Relationship: {data.goals.relationship}
- Personal: {', '.join(data.goals.personal)}
{f'- Timeline: {data.goals.timeline}' if data.goals.timeline else ''}

## LIFESTYLE
- Schedule: {data.lifestyle.schedule}
- Social Level: {data.lifestyle.socialLevel}
- Exercise: {data.lifestyle.exercise}

## BEHAVIORAL GUIDELINES
1. Be genuine and authentic to the personality profile above
2. Share interests and values naturally in conversation
3. Ask thoughtful questions to understand the other person
4. Express opinions that align with the stated values
5. Maintain the specified communication style throughout
6. Be honest about deal breakers: {', '.join(data.preferences.dealBreakers) if data.preferences.dealBreakers else 'none specified'}
7. Evaluate compatibility based on shared values, goals, and lifestyle alignment

## REASONING FRAMEWORK
When evaluating compatibility, consider:
- Value alignment (highest priority)
- Communication style compatibility
- Lifestyle compatibility
- Shared interests
- Goal alignment
- Emotional intelligence indicators
"""
    return prompt.strip()


def _build_personality_summary(data: GenerateTwinRequest) -> str:
    """Generate a human-readable personality summary."""
    p = data.personality
    traits: List[str] = []

    if p.extraversion >= 0.6:
        traits.append("outgoing and energetic")
    elif p.extraversion <= 0.4:
        traits.append("introspective and thoughtful")
    else:
        traits.append("balanced between social and solitary")

    if p.openness >= 0.6:
        traits.append("curious and open to new experiences")
    elif p.openness <= 0.4:
        traits.append("practical and grounded")

    if p.agreeableness >= 0.6:
        traits.append("empathetic and cooperative")
    elif p.agreeableness <= 0.4:
        traits.append("direct and independent-minded")

    if p.conscientiousness >= 0.6:
        traits.append("organized and disciplined")

    summary = f"A {data.communicationStyle} communicator who is {', '.join(traits)}. "
    summary += f"Passionate about {', '.join(data.interests[:3])}. "
    summary += f"Values {', '.join(data.values[:3])} above all."

    return summary


def _build_communication_guidelines(data: GenerateTwinRequest) -> List[str]:
    """Generate communication guidelines based on style and personality."""
    guidelines = []
    style = data.communicationStyle.lower()

    if style == "direct":
        guidelines.extend([
            "Be straightforward and get to the point",
            "Share opinions clearly without hedging",
            "Value efficiency in communication",
        ])
    elif style == "thoughtful":
        guidelines.extend([
            "Take time to consider responses carefully",
            "Ask reflective questions",
            "Appreciate depth over breadth in conversation",
        ])
    elif style == "expressive":
        guidelines.extend([
            "Use vivid language and share emotions openly",
            "Tell stories and use examples to illustrate points",
            "Be enthusiastic about shared interests",
        ])
    else:
        guidelines.extend([
            f"Communicate in a {style} manner",
            "Adapt to the flow of conversation",
            "Be genuine and authentic",
        ])

    # Add personality-driven guidelines
    if data.personality.agreeableness >= 0.7:
        guidelines.append("Prioritize harmony and understanding in dialogue")
    if data.personality.openness >= 0.7:
        guidelines.append("Explore unconventional topics and ideas willingly")

    return guidelines


def _build_reasoning_framework(data: GenerateTwinRequest) -> str:
    """Build the reasoning framework for compatibility evaluation."""
    return f"""Evaluate compatibility through these lenses (in priority order):
1. Values Alignment — Do our core values ({', '.join(data.values[:3])}) resonate?
2. Goal Compatibility — Are our relationship goals ({data.goals.relationship}) aligned?
3. Communication Fit — Can we communicate effectively given our styles?
4. Lifestyle Harmony — Are our daily lives compatible?
5. Interest Overlap — Do we have enough shared interests for engagement?
6. Deal Breaker Check — Are there any fundamental incompatibilities?

Score each dimension 0-100 and provide an overall assessment."""


def generate_twin_profile(data: GenerateTwinRequest) -> GenerateTwinResponse:
    """
    Generate a complete Digital Twin profile from user data.

    In production, this would call an LLM to generate more nuanced and
    personalized prompts. The template-based approach provides a solid
    baseline that captures the key personality dimensions.

    Args:
        data: User profile data for twin generation.

    Returns:
        Complete twin profile with system prompt, summary, guidelines, and reasoning.
    """
    return GenerateTwinResponse(
        systemPrompt=_build_system_prompt(data),
        personalitySummary=_build_personality_summary(data),
        communicationGuidelines=_build_communication_guidelines(data),
        reasoningFramework=_build_reasoning_framework(data),
    )

"""
Compatibility analysis service.

Analyzes conversation transcripts to evaluate compatibility between two users.
In production, this uses an LLM for deep analysis.
Currently uses heuristic-based analysis as a baseline.
"""
from typing import List, Dict, Any
from app.schemas import (
    CompatibilityRequest,
    CompatibilityResponse,
    DetailedAnalysis,
)


def _calculate_interest_similarity(profile_a: Dict[str, Any], profile_b: Dict[str, Any]) -> float:
    """Calculate Jaccard similarity of interests."""
    interests_a = set(i.lower() for i in profile_a.get("interests", []))
    interests_b = set(i.lower() for i in profile_b.get("interests", []))

    if not interests_a and not interests_b:
        return 50.0

    union = interests_a | interests_b
    if not union:
        return 50.0

    intersection = interests_a & interests_b
    return (len(intersection) / len(union)) * 100


def _calculate_values_alignment(profile_a: Dict[str, Any], profile_b: Dict[str, Any]) -> float:
    """Calculate values alignment score."""
    values_a = set(v.lower() for v in profile_a.get("values", []))
    values_b = set(v.lower() for v in profile_b.get("values", []))

    if not values_a and not values_b:
        return 50.0

    union = values_a | values_b
    if not union:
        return 50.0

    intersection = values_a & values_b
    return (len(intersection) / len(union)) * 100


def _calculate_personality_compatibility(
    profile_a: Dict[str, Any], profile_b: Dict[str, Any],
) -> float:
    """
    Calculate personality compatibility using Big Five traits.
    Research suggests similar levels of agreeableness and openness predict
    compatibility, while complementary extraversion can also work well.
    """
    personality_a = profile_a.get("personality", {})
    personality_b = profile_b.get("personality", {})

    if not personality_a or not personality_b:
        return 50.0

    traits = ["openness", "conscientiousness", "extraversion", "agreeableness", "neuroticism"]
    # Similarity weights: higher weight = similarity matters more
    similarity_weights = {
        "openness": 1.0,
        "conscientiousness": 0.8,
        "extraversion": 0.6,  # Complementary extraversion can work
        "agreeableness": 1.0,
        "neuroticism": 0.7,
    }

    total_score = 0.0
    total_weight = 0.0

    for trait in traits:
        val_a = personality_a.get(trait, 0.5)
        val_b = personality_b.get(trait, 0.5)
        weight = similarity_weights.get(trait, 0.5)
        similarity = 1.0 - abs(val_a - val_b)
        total_score += similarity * weight
        total_weight += weight

    return (total_score / total_weight) * 100 if total_weight > 0 else 50.0


def _calculate_lifestyle_compatibility(
    profile_a: Dict[str, Any], profile_b: Dict[str, Any],
) -> float:
    """Calculate lifestyle compatibility."""
    lifestyle_a = profile_a.get("lifestyle", {})
    lifestyle_b = profile_b.get("lifestyle", {})

    if not lifestyle_a and not lifestyle_b:
        return 50.0

    score = 0.0
    factors = 0

    # Compare schedule compatibility
    schedule_a = lifestyle_a.get("schedule", "").lower()
    schedule_b = lifestyle_b.get("schedule", "").lower()
    if schedule_a and schedule_b:
        factors += 1
        if schedule_a == schedule_b:
            score += 100
        elif "flexible" in (schedule_a, schedule_b):
            score += 75
        else:
            score += 40

    # Compare social level
    social_a = lifestyle_a.get("socialLevel", "").lower()
    social_b = lifestyle_b.get("socialLevel", "").lower()
    if social_a and social_b:
        factors += 1
        social_levels = {"low": 1, "moderate": 2, "high": 3}
        level_a = social_levels.get(social_a, 2)
        level_b = social_levels.get(social_b, 2)
        diff = abs(level_a - level_b)
        score += {0: 100, 1: 65, 2: 30}.get(diff, 50)

    # Compare exercise habits
    exercise_a = lifestyle_a.get("exercise", "").lower()
    exercise_b = lifestyle_b.get("exercise", "").lower()
    if exercise_a and exercise_b:
        factors += 1
        if exercise_a == exercise_b:
            score += 100
        else:
            score += 55

    return score / factors if factors > 0 else 50.0


def _calculate_communication_score(
    profile_a: Dict[str, Any], profile_b: Dict[str, Any],
) -> float:
    """Calculate communication style compatibility."""
    style_a = profile_a.get("communicationStyle", "").lower()
    style_b = profile_b.get("communicationStyle", "").lower()

    if not style_a or not style_b:
        return 50.0

    if style_a == style_b:
        return 90.0

    compatible_pairs = {
        frozenset({"direct", "thoughtful"}): 70.0,
        frozenset({"expressive", "thoughtful"}): 75.0,
        frozenset({"direct", "expressive"}): 60.0,
    }

    pair = frozenset({style_a, style_b})
    return compatible_pairs.get(pair, 55.0)


def _analyze_transcript_sentiment(transcript: List[Dict[str, str]]) -> float:
    """
    Analyze the conversation transcript for positive engagement indicators.
    Simple keyword-based sentiment as a baseline.
    """
    if not transcript:
        return 50.0

    positive_keywords = [
        "agree", "love", "great", "wonderful", "amazing", "interesting",
        "cool", "exciting", "absolutely", "definitely", "resonate",
        "same", "me too", "common", "shared", "together", "connect",
    ]
    negative_keywords = [
        "disagree", "don't think", "not sure", "different", "unfortunately",
        "however", "but", "concern", "worried", "uncomfortable",
    ]

    positive_count = 0
    negative_count = 0
    total_messages = len(transcript)

    for msg in transcript:
        content = msg.get("content", "").lower()
        positive_count += sum(1 for kw in positive_keywords if kw in content)
        negative_count += sum(1 for kw in negative_keywords if kw in content)

    total_signals = positive_count + negative_count
    if total_signals == 0:
        return 60.0

    positivity_ratio = positive_count / total_signals
    # Scale to 30-95 range
    return 30 + (positivity_ratio * 65)


def _generate_strengths(
    detailed: DetailedAnalysis,
    profile_a: Dict[str, Any],
    profile_b: Dict[str, Any],
) -> List[str]:
    """Generate list of compatibility strengths."""
    strengths: List[str] = []

    if detailed.values >= 70:
        strengths.append("Strong alignment on core values")
    if detailed.communication >= 70:
        strengths.append("Compatible communication styles")
    if detailed.lifestyle >= 70:
        strengths.append("Similar lifestyle preferences")
    if detailed.emotional >= 70:
        strengths.append("High emotional compatibility")
    if detailed.intellectual >= 70:
        strengths.append("Strong intellectual connection")

    # Interest-based strengths
    interests_a = set(i.lower() for i in profile_a.get("interests", []))
    interests_b = set(i.lower() for i in profile_b.get("interests", []))
    common = interests_a & interests_b
    if len(common) >= 3:
        strengths.append(f"Multiple shared interests: {', '.join(list(common)[:3])}")

    if not strengths:
        strengths.append("Potential for growth through different perspectives")

    return strengths


def _generate_weaknesses(
    detailed: DetailedAnalysis,
    profile_a: Dict[str, Any],
    profile_b: Dict[str, Any],
) -> List[str]:
    """Generate list of potential compatibility challenges."""
    weaknesses: List[str] = []

    if detailed.values < 50:
        weaknesses.append("Potential misalignment on core values")
    if detailed.communication < 50:
        weaknesses.append("Different communication preferences may require adjustment")
    if detailed.lifestyle < 50:
        weaknesses.append("Lifestyle differences could create friction")
    if detailed.emotional < 50:
        weaknesses.append("Emotional wavelengths may differ")

    if not weaknesses:
        weaknesses.append("No significant weaknesses identified")

    return weaknesses


def _get_recommendation(score: float) -> str:
    """Convert compatibility score to recommendation label."""
    if score >= 85:
        return "STRONG_MATCH"
    elif score >= 70:
        return "GOOD_MATCH"
    elif score >= 55:
        return "MODERATE_MATCH"
    elif score >= 40:
        return "WEAK_MATCH"
    else:
        return "NO_MATCH"


def analyze_compatibility(data: CompatibilityRequest) -> CompatibilityResponse:
    """
    Analyze compatibility between two users based on their conversation
    transcript and profiles.

    Evaluates across five dimensions:
    1. Emotional — Personality trait alignment and sentiment
    2. Intellectual — Interest overlap and conversational depth
    3. Lifestyle — Day-to-day compatibility
    4. Values — Core value alignment
    5. Communication — Style compatibility

    Args:
        data: Request with transcript and both profiles.

    Returns:
        Comprehensive compatibility analysis with scores and recommendations.
    """
    profile_a = data.twinAProfile
    profile_b = data.twinBProfile

    # Calculate dimension scores
    emotional_score = _calculate_personality_compatibility(profile_a, profile_b)
    intellectual_score = _calculate_interest_similarity(profile_a, profile_b)
    lifestyle_score = _calculate_lifestyle_compatibility(profile_a, profile_b)
    values_score = _calculate_values_alignment(profile_a, profile_b)
    communication_score = _calculate_communication_score(profile_a, profile_b)

    # Factor in transcript sentiment
    sentiment_bonus = _analyze_transcript_sentiment(data.transcript)
    # Blend sentiment into emotional score
    emotional_score = (emotional_score * 0.7) + (sentiment_bonus * 0.3)

    detailed = DetailedAnalysis(
        emotional=round(emotional_score, 1),
        intellectual=round(intellectual_score, 1),
        lifestyle=round(lifestyle_score, 1),
        values=round(values_score, 1),
        communication=round(communication_score, 1),
    )

    # Weighted overall score
    weights = {
        "values": 0.30,
        "emotional": 0.25,
        "communication": 0.20,
        "lifestyle": 0.15,
        "intellectual": 0.10,
    }

    overall_score = (
        values_score * weights["values"]
        + emotional_score * weights["emotional"]
        + communication_score * weights["communication"]
        + lifestyle_score * weights["lifestyle"]
        + intellectual_score * weights["intellectual"]
    )

    # Confidence based on data availability
    data_points = 0
    if profile_a.get("personality"):
        data_points += 1
    if profile_a.get("values"):
        data_points += 1
    if profile_a.get("interests"):
        data_points += 1
    if profile_a.get("lifestyle"):
        data_points += 1
    if data.transcript:
        data_points += 1
    confidence = min(95, (data_points / 5) * 100)

    strengths = _generate_strengths(detailed, profile_a, profile_b)
    weaknesses = _generate_weaknesses(detailed, profile_a, profile_b)
    recommendation = _get_recommendation(overall_score)

    summary_parts = [f"Overall compatibility score: {overall_score:.0f}/100."]
    if recommendation in ("STRONG_MATCH", "GOOD_MATCH"):
        summary_parts.append("Strong potential for a meaningful connection.")
    elif recommendation == "MODERATE_MATCH":
        summary_parts.append("Moderate compatibility with room for exploration.")
    else:
        summary_parts.append("Limited compatibility based on current profiles.")

    return CompatibilityResponse(
        compatibilityScore=round(overall_score, 1),
        confidenceScore=round(confidence, 1),
        strengths=strengths,
        weaknesses=weaknesses,
        recommendation=recommendation,
        summary=" ".join(summary_parts),
        detailedAnalysis=detailed,
    )

from typing import List, Dict, Any

def calculate_interest_similarity(interests1: List[str], interests2: List[str]) -> float:
    """Calculate similarity based on common interests"""
    if not interests1 or not interests2:
        return 0.0
    
    set1 = set(i.lower() for i in interests1)
    set2 = set(i.lower() for i in interests2)
    
    common = len(set1.intersection(set2))
    total = len(set1.union(set2))
    
    return common / total if total > 0 else 0.0

def calculate_communication_match(style1: str, style2: str) -> float:
    """Calculate communication style compatibility"""
    if not style1 or not style2:
        return 0.5
    
    if style1.lower() == style2.lower():
        return 1.0
    
    compatible_pairs = {
        ('direct', 'thoughtful'): 0.7,
        ('thoughtful', 'direct'): 0.7,
        ('expressive', 'thoughtful'): 0.8,
        ('thoughtful', 'expressive'): 0.8,
        ('direct', 'expressive'): 0.6,
        ('expressive', 'direct'): 0.6,
    }
    
    pair = (style1.lower(), style2.lower())
    return compatible_pairs.get(pair, 0.5)

def calculate_personality_similarity(traits1: Dict[str, float], traits2: Dict[str, float]) -> float:
    """Calculate personality trait similarity"""
    if not traits1 or not traits2:
        return 0.5
    
    openness_diff = abs(traits1.get('openness', 0.5) - traits2.get('openness', 0.5))
    extraversion_diff = abs(traits1.get('extraversion', 0.5) - traits2.get('extraversion', 0.5))
    
    openness_sim = 1.0 - openness_diff
    extraversion_sim = 1.0 - extraversion_diff
    
    return (openness_sim + extraversion_sim) / 2

def calculate_compatibility(twin1: Dict[str, Any], twin2: Dict[str, Any]) -> float:
    """Calculate overall compatibility score between two twins"""
    
    interests1 = twin1.get('interests', [])
    interests2 = twin2.get('interests', [])
    
    style1 = twin1.get('communicationStyle', '')
    style2 = twin2.get('communicationStyle', '')
    
    traits1 = twin1.get('traits', {})
    traits2 = twin2.get('traits', {})
    
    interest_score = calculate_interest_similarity(interests1, interests2)
    communication_score = calculate_communication_match(style1, style2)
    personality_score = calculate_personality_similarity(traits1, traits2)
    
    compatibility = (
        interest_score * 0.4 +
        communication_score * 0.3 +
        personality_score * 0.3
    )
    
    return round(compatibility * 100, 2)

def generate_match_explanation(twin1: Dict[str, Any], twin2: Dict[str, Any], match_score: float) -> str:
    """Generate human-readable explanation for why two twins are compatible"""
    
    interests1 = set(i.lower() for i in twin1.get('interests', []))
    interests2 = set(i.lower() for i in twin2.get('interests', []))
    common_interests = interests1.intersection(interests2)
    
    style1 = twin1.get('communicationStyle', '').lower()
    style2 = twin2.get('communicationStyle', '').lower()
    
    traits1 = twin1.get('traits', {})
    traits2 = twin2.get('traits', {})
    
    openness1 = traits1.get('openness', 0.5)
    openness2 = traits2.get('openness', 0.5)
    extraversion1 = traits1.get('extraversion', 0.5)
    extraversion2 = traits2.get('extraversion', 0.5)
    
    # Build explanation parts
    parts = []
    
    # Interest explanation
    if len(common_interests) >= 3:
        interest_list = ', '.join(list(common_interests)[:3])
        parts.append(f"share strong interests in {interest_list}")
    elif len(common_interests) == 2:
        interest_list = ' and '.join(list(common_interests))
        parts.append(f"both enjoy {interest_list}")
    elif len(common_interests) == 1:
        parts.append(f"share an interest in {list(common_interests)[0]}")
    
    # Communication style explanation
    if style1 == style2:
        parts.append(f"both prefer {style1} communication")
    elif (style1, style2) in [('direct', 'thoughtful'), ('thoughtful', 'direct')]:
        parts.append("have complementary communication styles that balance directness with thoughtfulness")
    elif (style1, style2) in [('expressive', 'thoughtful'), ('thoughtful', 'expressive')]:
        parts.append("complement each other with expressive and thoughtful communication")
    
    # Personality explanation
    openness_diff = abs(openness1 - openness2)
    extraversion_diff = abs(extraversion1 - extraversion2)
    
    if openness_diff < 0.15 and extraversion_diff < 0.15:
        if openness1 > 0.7 and extraversion1 > 0.7:
            parts.append("are both highly open and outgoing")
        elif openness1 > 0.7:
            parts.append("share high openness to new experiences")
        elif extraversion1 > 0.7 and extraversion2 > 0.7:
            parts.append("are both socially energetic")
        elif extraversion1 < 0.4 and extraversion2 < 0.4:
            parts.append("both value deeper one-on-one connections")
        else:
            parts.append("have similar personality traits")
    
    # Construct final explanation
    if not parts:
        if match_score >= 70:
            return "Show strong overall compatibility across multiple dimensions."
        elif match_score >= 50:
            return "Have moderate compatibility with potential for meaningful connection."
        else:
            return "May find common ground through shared goals and values."
    
    if len(parts) == 1:
        explanation = f"They {parts[0]}."
    elif len(parts) == 2:
        explanation = f"They {parts[0]} and {parts[1]}."
    else:
        explanation = f"They {parts[0]}, {parts[1]}, and {parts[2]}."
    
    # Add match quality descriptor
    if match_score >= 80:
        return f"{explanation} This creates exceptional compatibility."
    elif match_score >= 60:
        return f"{explanation} This makes them highly compatible."
    else:
        return explanation

def find_top_matches(twin1: Dict[str, Any], twins: List[Dict[str, Any]], top_n: int = 5) -> List[Dict[str, Any]]:
    """Find top N most compatible matches for twin1 with explanations"""
    
    matches = []
    
    for twin in twins:
        twin_id = twin.get('id')
        if not twin_id:
            continue
        
        score = calculate_compatibility(twin1, twin)
        reason = generate_match_explanation(twin1, twin, score)
        
        matches.append({
            'twinId': twin_id,
            'matchScore': score,
            'reason': reason
        })
    
    matches.sort(key=lambda x: x['matchScore'], reverse=True)
    
    return matches[:top_n]

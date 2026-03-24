# Matching Feature - Complete Code

## File: `fastapi-engine/matching.py`

```python
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

def find_top_matches(twin1: Dict[str, Any], twins: List[Dict[str, Any]], top_n: int = 5) -> List[Dict[str, Any]]:
    """Find top N most compatible matches for twin1"""
    
    matches = []
    
    for twin in twins:
        twin_id = twin.get('id')
        if not twin_id:
            continue
        
        score = calculate_compatibility(twin1, twin)
        
        matches.append({
            'twinId': twin_id,
            'matchScore': score
        })
    
    matches.sort(key=lambda x: x['matchScore'], reverse=True)
    
    return matches[:top_n]
```

---

## File: `fastapi-engine/main.py` (Updated)

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
from matching import find_top_matches

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TwinInput(BaseModel):
    interests: List[str]
    communicationStyle: str
    goals: str
    personality: Dict[str, Any]

class MatchRequest(BaseModel):
    twin1: Dict[str, Any]
    twins: List[Dict[str, Any]]

@app.post("/generate-twin")
async def generate_twin(data: TwinInput):
    twin_profile = {
        "twinProfile": {
            "personality": "Ambivert" if 0.4 < data.personality.get("extraversion", 0.5) < 0.7 else "Extrovert" if data.personality.get("extraversion", 0.5) >= 0.7 else "Introvert",
            "communicationStyle": data.communicationStyle,
            "interests": data.interests,
            "goals": data.goals,
            "matchScore": 85,
            "traits": {
                "openness": data.personality.get("openness", 0.5),
                "extraversion": data.personality.get("extraversion", 0.5)
            },
            "bio": f"A {data.communicationStyle} communicator interested in {', '.join(data.interests[:2])}. {data.goals}",
            "compatibility": {
                "social": 0.82,
                "intellectual": 0.88,
                "emotional": 0.79
            }
        }
    }
    return twin_profile

@app.post("/match-twins")
async def match_twins(data: MatchRequest):
    """Find top compatible matches for a twin"""
    matches = find_top_matches(data.twin1, data.twins, top_n=5)
    return {"matches": matches}

@app.get("/")
async def root():
    return {"message": "FastAPI AI Engine is running"}
```

---

## File: `backend/src/twins/twins.controller.ts` (Updated)

```typescript
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TwinsService } from './twins.service';
import { CreateTwinDto } from './dto/create-twin.dto';

@Controller('twin')
export class TwinsController {
  constructor(private readonly twinsService: TwinsService) {}

  @Get()
  findAll() {
    return this.twinsService.findAll();
  }

  @Post('create')
  createTwin(@Body() createTwinDto: CreateTwinDto) {
    return this.twinsService.createTwin(createTwinDto);
  }

  @Get('matches/:id')
  getTopMatches(@Param('id') id: string) {
    return this.twinsService.getTopMatches(id);
  }
}
```

---

## File: `backend/src/twins/twins.service.ts` (getTopMatches method)

```typescript
async getTopMatches(currentTwinId: string) {
  console.log('Finding matches for twin:', currentTwinId);

  try {
    // Fetch all twins from Firestore
    const snapshot = await db.collection('twins').get();

    if (snapshot.empty) {
      return {
        message: 'No twins found in database',
        matches: [],
      };
    }

    // Convert snapshot to array
    const allTwins = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as any[];

    // Find current twin
    const currentTwin = allTwins.find(twin => twin.id === currentTwinId);

    if (!currentTwin) {
      return {
        message: 'Twin not found',
        error: 'The specified twin ID does not exist',
      };
    }

    // Remove current twin from list
    const otherTwins = allTwins.filter(twin => twin.id !== currentTwinId);

    if (otherTwins.length === 0) {
      return {
        message: 'No other twins available for matching',
        matches: [],
      };
    }

    // Prepare data for FastAPI
    const matchRequest = {
      twin1: currentTwin.twinProfile,
      twins: otherTwins.map(twin => ({
        id: twin.id,
        ...twin.twinProfile,
      })),
    };

    // Call FastAPI matching endpoint
    const response = await firstValueFrom(
      this.httpService.post(
        'http://localhost:8000/match-twins',
        matchRequest
      )
    );

    console.log('Matching results:', response.data);

    // Return top matches
    return {
      message: 'Top matches found successfully',
      currentTwinId: currentTwinId,
      matches: response.data.matches,
    };
  } catch (error) {
    console.error('Matching error:', error.message);

    if (error.code === 'ECONNREFUSED') {
      return {
        message: 'AI service unavailable',
        error: 'FastAPI service is not running',
      };
    }

    return {
      message: 'Failed to find matches',
      error: error.message,
    };
  }
}
```

---

## Test Results

### Request
```bash
GET http://localhost:3000/twin/matches/2BamQG25Nq6hohTkK1Gk
```

### Response
```json
{
  "message": "Top matches found successfully",
  "currentTwinId": "2BamQG25Nq6hohTkK1Gk",
  "matches": [
    {"twinId": "avpXYD5HATt3FCqW7zMZ", "matchScore": 69.5},
    {"twinId": "Q94SUuJfTQbM9Lb0z7O0", "matchScore": 57.2},
    {"twinId": "zVXTejxAIMkPACFh1VGt", "matchScore": 54.5},
    {"twinId": "U0Bjj61fCDjfrCwHq0mp", "matchScore": 41.25},
    {"twinId": "LHV3itHwUBQQrXVjTPx7", "matchScore": 40.5}
  ]
}
```

---

## Status: ✅ Complete & Tested

All components working perfectly with real data from Firebase.

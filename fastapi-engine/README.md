# FastAPI AI Engine

AI service for generating digital twin profiles.

## Setup

```bash
pip install -r requirements.txt
```

## Run

```bash
python -m uvicorn main:app --reload --port 8000
```

## Endpoint

### POST /generate-twin

Generates an AI-powered twin profile from onboarding data.

**Request:**
```json
{
  "interests": ["coding", "music"],
  "communicationStyle": "direct",
  "goals": "Find meaningful connections",
  "personality": {
    "openness": 0.8,
    "extraversion": 0.6
  }
}
```

**Response:**
```json
{
  "twinProfile": {
    "personality": "Ambivert",
    "communicationStyle": "direct",
    "interests": ["coding", "music"],
    "goals": "Find meaningful connections",
    "matchScore": 85,
    "traits": {
      "openness": 0.8,
      "extraversion": 0.6
    },
    "bio": "A direct communicator interested in coding, music. Find meaningful connections",
    "compatibility": {
      "social": 0.82,
      "intellectual": 0.88,
      "emotional": 0.79
    }
  }
}
```

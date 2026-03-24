from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any

app = FastAPI()

# CORS configuration
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

@app.post("/generate-twin")
async def generate_twin(data: TwinInput):
    # AI-generated twin profile (dummy response)
    twin_profile = {
        "twinProfile": {
            "personality": "Ambivert" if data.personality.get("extraversion", 0.5) > 0.4 and data.personality.get("extraversion", 0.5) < 0.7 else "Extrovert" if data.personality.get("extraversion", 0.5) >= 0.7 else "Introvert",
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

@app.get("/")
async def root():
    return {"message": "FastAPI AI Engine is running"}

from typing import List, Optional, Dict
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from ..models.models import AIInteraction, RANGE_OS_PERSONAS
import structlog

logger = structlog.get_logger()
router = APIRouter()

class ChatRequest(BaseModel):
    mission_id: str
    profile_id: str
    prompt: str
    include_telemetry: bool = True

class Suggestion(BaseModel):
    type: str # CMD_OFFENSIVE, CMD_DEFENSIVE, FORENSIC_PIVOT
    command: str
    reason: str

class ChatResponse(BaseModel):
    content: str
    suggestions: List[Suggestion]
    grounded: bool = True

@router.post("/chat", response_model=ChatResponse)
async def tactical_chat(req: ChatRequest):
    # 1. Select Persona
    persona = RANGE_OS_PERSONAS.get(req.profile_id.upper())
    if not persona:
        raise HTTPException(status_code=404, detail="PERSONA_NOT_FOUND")

    await logger.info("ai_chat_request", mission_id=req.mission_id, profile=persona.name)

    # 2. Context Harvesting (STUB - In real impl, call telemetry-service and lab-service)
    context = {
        "lab_status": "ACTIVE",
        "nodes": ["kali-red-01", "ubuntu-target"],
        "recent_alerts": 2
    }

    # 3. LLM Orchestration (STUB - In real impl, call Google Gemini / Local LLM)
    response_text = f"As the {persona.name}, I've analyzed the mission context. You should perform reconnaissance on 10.0.10.20."
    
    suggestions = [
        Suggestion(
            type="CMD_OFFENSIVE",
            command="nmap -sV 10.0.10.20",
            reason="Verify target service availability."
        )
    ]

    # 4. Persistence would happen here
    
    return ChatResponse(
        content=response_text,
        suggestions=suggestions
    )

@router.get("/profiles")
def list_profiles():
    return [p.dict() for p in RANGE_OS_PERSONAS.values()]

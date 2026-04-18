from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional, Dict
import structlog
import random

logger = structlog.get_logger()
router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    agent_id: str
    context: Optional[Dict] = None

class Suggestion(BaseModel):
    id: str
    label: str
    action: str
    type: str

class ChatResponse(BaseModel):
    response: str
    suggestions: List[Suggestion]
    metadata: Dict

MOCK_CYBER_FACTS = [
    "The target DC is running a legacy version of the Print Spooler service, potentially vulnerable to PrintNightmare.",
    "Network telemetry shows unusual outbound traffic on port 4444, which matches common Metasploit stagers.",
    "The policy engine has flagged this subnet as 'High Containment', meaning all internet-bound packets are being dropped.",
    "Analyst intelligence suggests the presence of a persistent back-door in the edge router's firmware."
]

@router.post("/chat", response_model=ChatResponse)
async def chat_interaction(request: ChatRequest):
    await logger.info("ai_interaction_request", 
                 agent=request.agent_id, 
                 msg_len=len(request.message))

    # Determine mock response based on agent
    fact = random.choice(MOCK_CYBER_FACTS)
    
    response_text = f"As the {request.agent_id.capitalize()} agent, I've analyzed your request. {fact} How would you like to proceed?"
    
    suggestions = [
        {
            "id": "sug-1",
            "label": "ISOLATE SEGMENT",
            "action": f"isolate --id {request.context.get('lab_id', 'LAB-1') if request.context else 'LAB-1'}",
            "type": "policy_change"
        },
        {
            "id": "sug-2",
            "label": "INITIALIZE SNAPSHOT",
            "action": "snapshot create --all",
            "type": "lab_action"
        }
    ]

    return {
        "response": response_text,
        "suggestions": suggestions,
        "metadata": {"engine": "Mock-Neural-v4", "latency": "42ms"}
    }

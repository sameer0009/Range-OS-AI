from fastapi import APIRouter
from typing import List
from pydantic import BaseModel

router = APIRouter()

class Agent(BaseModel):
    id: str
    name: str
    description: str
    capabilities: List[str]

AGENTS = [
    {
        "id": "tutor",
        "name": "Range Tutor",
        "description": "Educational assistant for guided cyber learning.",
        "capabilities": ["Guided Walkthroughs", "Concept Explanation", "Quiz Generation"]
    },
    {
        "id": "architect",
        "name": "Lab Architect",
        "description": "Neural Forge specialist for precision range design.",
        "capabilities": ["Topology Synthesis", "Config Optimization", "Resource Planning"]
    },
    {
        "id": "analyst",
        "name": "Forensic Analyst",
        "description": "Data intelligence specialist for evidence deep-dives.",
        "capabilities": ["Log Analysis", "Artifact Correllation", "Anomaly Detection"]
    },
    {
        "id": "writer",
        "name": "Report Writer",
        "description": "Documentation specialist for synthesizing mission results.",
        "capabilities": ["Executive Summaries", "Risk Assessment", "Mitigation Tables"]
    }
]

@app_router_get := router.get("/agents", response_model=List[Agent])
async def get_agents():
    return AGENTS

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import agents, chat
import structlog

logger = structlog.get_logger()

app = FastAPI(title="RangeOS AI Service", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(agents.router, prefix="/api/v1/ai", tags=["Agents"])
app.include_router(chat.router, prefix="/api/v1/ai", tags=["Chat"])

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "ai-service"}

@app.on_event("startup")
async def startup_event():
    await logger.info("AI Service initialized", engine="Mock-LLM-v1")

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import cases, evidence
import structlog

logger = structlog.get_logger()

app = FastAPI(title="RangeOS Forensics Service", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(cases.router, prefix="/api/v1/forensics", tags=["Cases"])
app.include_router(evidence.router, prefix="/api/v1/forensics", tags=["Evidence"])

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "forensics-service"}

@app.on_event("startup")
async def startup_event():
    await logger.info("Forensics Service initialized", integrity_check="Enforced")

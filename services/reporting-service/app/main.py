from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import reports
import structlog

logger = structlog.get_logger()

app = FastAPI(title="RangeOS Reporting Service", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(reports.router, prefix="/api/v1/reporting", tags=["Reports"])

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "reporting-service"}

@app.on_event("startup")
async def startup_event():
    await logger.info("Reporting Service initialized", versioning="active")

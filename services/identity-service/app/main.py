from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, roles
from app.core.config import settings
from app.core.logging import setup_logging

# Setup structured logging
setup_logging()

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set all CORS enabled origins
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(roles.router, prefix=f"{settings.API_V1_STR}/roles", tags=["roles"])

@app.get("/health")
def health_check():
    return {"status": "healthy", "project": settings.PROJECT_NAME}

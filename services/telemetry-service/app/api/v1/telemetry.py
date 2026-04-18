from fastapi import APIRouter, Depends, Request
from fastapi.responses import StreamingResponse
from sqlmodel import Session
from ...models.models import TelemetryEvent, MissionAlert
from ...core.stream import stream_manager
# from ...core.database import get_session

router = APIRouter()

@router.post("/ingest")
async def ingest_event(event: TelemetryEvent):
    # 1. Broadast to live HUD
    await stream_manager.publish(event)
    
    # 2. Persist to DB (Assume managed session or background task)
    # db.add(event)
    # db.commit()
    
    # 3. Promote to Alert if Critical
    if event.level in ["ERROR", "CRITICAL"]:
        print(f"[!!!] ALERT PROMOTED: {event.category}")
        # Create MissionAlert logic here
        
    return {"status": "SUCCESS", "event_id": str(event.id)}

@router.get("/stream")
async def get_tactical_stream(request: Request):
    return StreamingResponse(
        stream_manager.subscribe(),
        media_type="text/event-stream"
    )

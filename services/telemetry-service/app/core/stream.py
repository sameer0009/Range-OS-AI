import asyncio
import json
from typing import AsyncGenerator
from ..models.models import TelemetryEvent

class TacticalStreamManager:
    def __init__(self):
        self.queues: set[asyncio.Queue] = set()

    async def subscribe(self) -> AsyncGenerator[str, None]:
        queue = asyncio.Queue()
        self.queues.add(queue)
        try:
            while True:
                event: TelemetryEvent = await queue.get()
                yield f"data: {json.dumps(event.model_dump(), default=str)}\n\n"
        finally:
            self.queues.remove(queue)

    async def publish(self, event: TelemetryEvent):
        for queue in self.queues:
            await queue.put(event)

stream_manager = TacticalStreamManager()

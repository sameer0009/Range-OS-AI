from fastapi import FastAPI, BackgroundTasks
from app.adapters.mock import MockAdapter
from app.core.orchestrator import Orchestrator
import structlog

logger = structlog.get_logger()

app = FastAPI(title="RangeOS Orchestration Service", version="0.1.0")

# Initialize orchestrator with mock adapter for the skeleton
adapter = MockAdapter()
orchestrator = Orchestrator(adapter)

@app.post("/deploy")
async def deploy_lab(lab_id: str, nodes: list, zones: list):
    task_id = await orchestrator.deploy_lab(lab_id, nodes, zones)
    await logger.info("api_deployment_requested", lab_id=lab_id, task_id=task_id)
    return {"task_id": task_id, "status": "QUEUED"}

@app.get("/tasks/{task_id}")
async def get_task_status(task_id: str):
    task = orchestrator.active_tasks.get(task_id)
    if not task:
        return {"error": "Task not found"}
    return {
        "task_id": task.task_id,
        "status": task.status,
        "progress": task.progress
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "adapter": "mock"}

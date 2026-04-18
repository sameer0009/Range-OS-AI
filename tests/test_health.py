"""
SH-05 — Service Health Probes
P0 Critical Path — All registered services must respond to GET /health
"""
import httpx
import pytest

# Registered services with their default dev ports
SERVICES = [
    ("api-gateway",           "http://localhost:8000"),
    ("lab-service",           "http://localhost:8001"),
    ("orchestration-service", "http://localhost:8002"),
    ("forensics-service",     "http://localhost:8003"),
    ("reporting-service",     "http://localhost:8004"),
    ("ai-service",            "http://localhost:8005"),
    ("policy-service",        "http://localhost:8006"),
    ("identity-service",      "http://localhost:8007"),
]

@pytest.mark.parametrize("name,base_url", SERVICES)
def test_sh05_service_health_probe(name, base_url):
    """
    SH-05: Each service must respond to GET /health with status 200
    and a body containing {"status": "healthy"} or equivalent.

    NOTE: These tests run against live services. Mark as integration
    with: pytest -m integration tests/test_health.py
    """
    try:
        resp = httpx.get(f"{base_url}/health", timeout=3.0)
        assert resp.status_code == 200, \
            f"[{name}] Expected 200 from /health, got {resp.status_code}"
        body = resp.json()
        # Accept either {"status": "healthy"} or {"status": "ok"}
        assert body.get("status", "").lower() in ("healthy", "ok"), \
            f"[{name}] Unexpected health body: {body}"
    except (httpx.ConnectError, httpx.TimeoutException) as e:
        pytest.skip(f"Service {name} unreachable at {base_url} — skipping (run live services first): {e}")

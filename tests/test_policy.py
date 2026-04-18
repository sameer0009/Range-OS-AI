"""
POL-01 through POL-05
P0 Critical Path — Policy Service Evaluation Tests
"""
import pytest

ALLOWED_CMD  = {"command": "nmap -sV", "zone": "pentest-vnet", "operator_id": "test-admin"}
BLOCKED_CMD  = {"command": "rm -rf /",  "zone": "pentest-vnet", "operator_id": "test-admin"}
ZONE_CMD     = {"command": "ping 8.8.8.8", "zone": "RESTRICTED_ZONE_99", "operator_id": "test-admin"}


@pytest.fixture(name="policy_client", scope="module")
def policy_client_fixture():
    try:
        from services.policy_service.app.main import app
        from fastapi.testclient import TestClient
        with TestClient(app) as client:
            yield client
    except ImportError:
        pytest.skip("policy-service not importable")


# ─────────────────────────────────────────────────────────────
# POL-01: Whitelisted command passes policy evaluation
# ─────────────────────────────────────────────────────────────
def test_pol01_whitelisted_command_allowed(policy_client):
    resp = policy_client.post("/v1/policy/evaluate", json=ALLOWED_CMD)
    assert resp.status_code == 200
    assert resp.json()["verdict"] in ("ALLOWED", "APPROVED"), \
        f"Expected ALLOWED, got: {resp.json()}"


# ─────────────────────────────────────────────────────────────
# POL-02: Blacklisted command returns DENIED with reason
# ─────────────────────────────────────────────────────────────
def test_pol02_blacklisted_command_denied(policy_client):
    resp = policy_client.post("/v1/policy/evaluate", json=BLOCKED_CMD)
    assert resp.status_code == 200
    body = resp.json()
    assert body.get("verdict") == "DENIED", \
        f"Expected DENIED for destructive command, got: {body}"
    assert "reason" in body or "detail" in body, \
        "DENIED response must include a reason field"


# ─────────────────────────────────────────────────────────────
# POL-03: Command in non-approved zone returns ZONE_RESTRICTED
# ─────────────────────────────────────────────────────────────
def test_pol03_zone_restricted_command(policy_client):
    resp = policy_client.post("/v1/policy/evaluate", json=ZONE_CMD)
    assert resp.status_code == 200
    assert resp.json().get("verdict") in ("ZONE_RESTRICTED", "DENIED"), \
        f"Expected zone restriction verdict, got: {resp.json()}"


# ─────────────────────────────────────────────────────────────
# POL-04: POST /v1/policy/seed-profile seeds correct rules
# ─────────────────────────────────────────────────────────────
@pytest.mark.parametrize("profile", ["classroom", "research", "red-team", "blue-team"])
def test_pol04_seed_profile(policy_client, profile):
    resp = policy_client.post(f"/v1/policy/seed-profile?profile={profile}")
    assert resp.status_code in (200, 201), \
        f"Profile seeding for '{profile}' failed: {resp.text}"


# ─────────────────────────────────────────────────────────────
# POL-05: Policy evaluation result is logged to audit trail
# ─────────────────────────────────────────────────────────────
def test_pol05_evaluation_creates_audit_log(policy_client):
    policy_client.post("/v1/policy/evaluate", json=ALLOWED_CMD)
    resp = policy_client.get("/v1/policy/audit?limit=5")
    assert resp.status_code == 200
    logs = resp.json()
    assert isinstance(logs, list) and len(logs) >= 1, \
        "Expected at least one audit log entry after policy evaluation"

"""
LAB-01, LAB-02, LAB-07
P0 Critical Path — Lab Service CRUD Tests
"""
import uuid
import pytest


VALID_LAB_PAYLOAD = {
    "name":        "Test Pentest Lab",
    "description": "Automated test lab",
    "topology_spec": {
        "nodes": [
            {"name": "kali-attacker", "type": "linux",   "image": "kali-linux"},
            {"name": "dvwa-target",   "type": "linux",   "image": "ubuntu-noble"},
        ],
        "networks": [
            {"name": "vnet-test", "subnet": "192.168.200.0/24", "isolated": True}
        ]
    }
}


# ─────────────────────────────────────────────────────────────
# LAB-01: POST /v1/labs creates a lab with valid topology
# ─────────────────────────────────────────────────────────────
def test_lab01_create_lab_valid_payload(lab_client, auth_headers):
    resp = lab_client.post("/v1/labs", json=VALID_LAB_PAYLOAD, headers=auth_headers)
    assert resp.status_code in (200, 201), \
        f"Expected 2xx, got {resp.status_code}: {resp.text}"
    data = resp.json()
    assert "id" in data, "Response must include lab ID"
    assert data.get("status") in ("REQUESTED", "DRAFT"), \
        f"Unexpected initial status: {data.get('status')}"


# ─────────────────────────────────────────────────────────────
# LAB-02: POST /v1/labs with missing required fields returns 422
# ─────────────────────────────────────────────────────────────
def test_lab02_create_lab_missing_fields_returns_422(lab_client, auth_headers):
    resp = lab_client.post("/v1/labs", json={}, headers=auth_headers)
    assert resp.status_code == 422, \
        f"Expected 422 Unprocessable Entity, got {resp.status_code}"


# ─────────────────────────────────────────────────────────────
# LAB-07: GET /v1/labs returns all labs for the operator
# ─────────────────────────────────────────────────────────────
def test_lab07_list_labs_returns_operator_labs(lab_client, auth_headers):
    # First create a lab to ensure at least one exists
    lab_client.post("/v1/labs", json=VALID_LAB_PAYLOAD, headers=auth_headers)

    resp = lab_client.get("/v1/labs", headers=auth_headers)
    assert resp.status_code == 200, \
        f"Expected 200, got {resp.status_code}: {resp.text}"
    data = resp.json()
    assert isinstance(data, list), "Expected a list of labs"
    assert len(data) >= 1, "Expected at least one lab in the list"

    # Verify each returned item has required fields
    for lab in data:
        assert "id" in lab
        assert "status" in lab

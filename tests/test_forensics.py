"""
FOR-01 through FOR-06
P0 Critical Path — Forensics Service Case & Evidence Tests
"""
import uuid
import pytest

# ── Helpers ───────────────────────────────────────────────────────────────
def create_case(client, headers, mission_id=None):
    payload = {
        "title":       "Automated Test Case",
        "description": "Created by pytest",
        "mission_id":  str(mission_id or uuid.uuid4()),
    }
    resp = client.post("/v1/cases", json=payload, headers=headers)
    assert resp.status_code in (200, 201), f"Case creation failed: {resp.text}"
    return resp.json()["id"]


def create_evidence(client, headers, case_id):
    payload = {
        "case_id":     case_id,
        "name":        "network_capture.pcap",
        "type":        "NETWORK_CAPTURE",
        "sha256_hash": "abc123def456abc123def456abc123def456abc123def456abc123def456abcd",
        "file_path":   "/var/lib/rangeos/evidence/cap.pcap",
    }
    resp = client.post("/v1/evidence", json=payload, headers=headers)
    assert resp.status_code in (200, 201), f"Evidence creation failed: {resp.text}"
    return resp.json()["id"]


# ─────────────────────────────────────────────────────────────
# FOR-01: POST /v1/cases creates a case linked to a mission
# ─────────────────────────────────────────────────────────────
def test_for01_create_case(forensics_client, auth_headers):
    mission_id = uuid.uuid4()
    case_id = create_case(forensics_client, auth_headers, mission_id)
    assert uuid.UUID(case_id)  # Must be a valid UUID


# ─────────────────────────────────────────────────────────────
# FOR-02: POST /v1/evidence registers artifact with SHA-256 hash
# ─────────────────────────────────────────────────────────────
def test_for02_register_evidence_with_hash(forensics_client, auth_headers):
    case_id = create_case(forensics_client, auth_headers)
    ev_id = create_evidence(forensics_client, auth_headers, case_id)
    assert uuid.UUID(ev_id)


# ─────────────────────────────────────────────────────────────
# FOR-03: POST /v1/evidence/{id}/verify returns VERIFIED or CONTAMINATED
# ─────────────────────────────────────────────────────────────
def test_for03_evidence_verification(forensics_client, auth_headers):
    case_id = create_case(forensics_client, auth_headers)
    ev_id   = create_evidence(forensics_client, auth_headers, case_id)
    resp = forensics_client.post(f"/v1/evidence/{ev_id}/verify", headers=auth_headers)
    assert resp.status_code == 200
    assert resp.json()["status"] in ("VERIFIED", "CONTAMINATED")


# ─────────────────────────────────────────────────────────────
# FOR-04: Evidence "View" action logs a ChainOfCustody record
# ─────────────────────────────────────────────────────────────
def test_for04_evidence_view_creates_custody_log(forensics_client, auth_headers):
    case_id = create_case(forensics_client, auth_headers)
    ev_id   = create_evidence(forensics_client, auth_headers, case_id)

    # Access the evidence (triggers chain-of-custody log)
    resp = forensics_client.get(f"/v1/evidence/{ev_id}", headers=auth_headers)
    assert resp.status_code == 200

    # Retrieve custody log
    custody_resp = forensics_client.get(
        f"/v1/evidence/{ev_id}/custody", headers=auth_headers
    )
    assert custody_resp.status_code == 200
    entries = custody_resp.json()
    assert isinstance(entries, list) and len(entries) >= 1, \
        "At least one custody log entry must exist after evidence access"


# ─────────────────────────────────────────────────────────────
# FOR-05: Case status transitions follow valid lifecycle
# ─────────────────────────────────────────────────────────────
def test_for05_case_lifecycle_transitions(forensics_client, auth_headers):
    case_id = create_case(forensics_client, auth_headers)

    # DISCOVERY → ANALYSIS
    r1 = forensics_client.patch(
        f"/v1/cases/{case_id}/status",
        json={"status": "ANALYSIS"},
        headers=auth_headers,
    )
    assert r1.status_code == 200, f"DISCOVERY→ANALYSIS failed: {r1.text}"

    # ANALYSIS → FINALIZED
    r2 = forensics_client.patch(
        f"/v1/cases/{case_id}/status",
        json={"status": "FINALIZED"},
        headers=auth_headers,
    )
    assert r2.status_code == 200, f"ANALYSIS→FINALIZED failed: {r2.text}"


# ─────────────────────────────────────────────────────────────
# FOR-06: Invalid transition (FINALIZED → DISCOVERY) returns 409
# ─────────────────────────────────────────────────────────────
def test_for06_invalid_case_transition_returns_409(forensics_client, auth_headers):
    case_id = create_case(forensics_client, auth_headers)

    # Jump straight to FINALIZED
    forensics_client.patch(
        f"/v1/cases/{case_id}/status",
        json={"status": "ANALYSIS"},
        headers=auth_headers,
    )
    forensics_client.patch(
        f"/v1/cases/{case_id}/status",
        json={"status": "FINALIZED"},
        headers=auth_headers,
    )

    # Try to reopen — must be rejected
    resp = forensics_client.patch(
        f"/v1/cases/{case_id}/status",
        json={"status": "DISCOVERY"},
        headers=auth_headers,
    )
    assert resp.status_code == 409, \
        f"Expected 409 for invalid transition FINALIZED→DISCOVERY, got {resp.status_code}"


# ── Fixture: forensics_client ─────────────────────────────────────────────
@pytest.fixture(name="forensics_client", scope="module")
def forensics_client_fixture():
    try:
        from services.forensics_service.app.main import app
        from services.forensics_service.app.core.db import get_session
        from sqlmodel import create_engine, Session
        from sqlmodel.pool import StaticPool
        from sqlmodel import SQLModel
        from fastapi.testclient import TestClient

        engine = create_engine("sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool)
        SQLModel.metadata.create_all(engine)
        def override():
            with Session(engine) as s:
                yield s
        app.dependency_overrides[get_session] = override
        with TestClient(app) as client:
            yield client
        app.dependency_overrides.clear()
    except ImportError:
        pytest.skip("forensics-service not importable — skipping")

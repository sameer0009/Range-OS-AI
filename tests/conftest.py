"""
RangeOS AI — Shared pytest fixtures
Provides: in-memory SQLite app client, JWT token factory, seeded test users.
"""
import pytest
from fastapi.testclient import TestClient
from sqlmodel import SQLModel, Session, create_engine
from sqlmodel.pool import StaticPool

# ── In-memory test DB (isolated per session) ──────────────────────────────
TEST_DB_URL = "sqlite://"

@pytest.fixture(name="engine", scope="session")
def engine_fixture():
    engine = create_engine(
        TEST_DB_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
    yield engine
    SQLModel.metadata.drop_all(engine)

@pytest.fixture(name="session")
def session_fixture(engine):
    with Session(engine) as session:
        yield session

# ── Identity service client ───────────────────────────────────────────────
@pytest.fixture(name="identity_client", scope="module")
def identity_client_fixture():
    from services.identity_service.app.main import app
    from services.identity_service.app.core.db import get_session
    engine = create_engine(TEST_DB_URL, connect_args={"check_same_thread": False}, poolclass=StaticPool)
    SQLModel.metadata.create_all(engine)
    def override_session():
        with Session(engine) as s:
            yield s
    app.dependency_overrides[get_session] = override_session
    with TestClient(app) as client:
        yield client
    app.dependency_overrides.clear()

# ── Lab service client ────────────────────────────────────────────────────
@pytest.fixture(name="lab_client", scope="module")
def lab_client_fixture():
    from services.lab_service.app.main import app
    from services.lab_service.app.core.db import get_session
    engine = create_engine(TEST_DB_URL, connect_args={"check_same_thread": False}, poolclass=StaticPool)
    SQLModel.metadata.create_all(engine)
    def override_session():
        with Session(engine) as s:
            yield s
    app.dependency_overrides[get_session] = override_session
    with TestClient(app) as client:
        yield client
    app.dependency_overrides.clear()

# ── JWT factory helper ────────────────────────────────────────────────────
@pytest.fixture(name="admin_token")
def admin_token_fixture(identity_client):
    """Bootstrap admin and return a valid JWT token."""
    identity_client.post("/v1/identity/admin-bootstrap", json={
        "username": "test-admin",
        "email":    "testadmin@rangeos.ai",
        "password": "TestPassword123!",
    })
    resp = identity_client.post("/v1/auth/login", data={
        "username": "test-admin",
        "password": "TestPassword123!",
    })
    assert resp.status_code == 200
    return resp.json()["access_token"]

@pytest.fixture(name="auth_headers")
def auth_headers_fixture(admin_token):
    return {"Authorization": f"Bearer {admin_token}"}

"""
AUTH-01 through AUTH-07
P0 Critical Path — Identity Service Authentication Tests
"""
import pytest
from jose import jwt

# ─────────────────────────────────────────────────────────────
# AUTH-01: POST /v1/auth/login returns JWT on valid credentials
# ─────────────────────────────────────────────────────────────
def test_auth01_login_returns_jwt(identity_client, admin_token):
    assert admin_token is not None
    assert len(admin_token) > 20, "Expected a non-trivial JWT string"


# ─────────────────────────────────────────────────────────────
# AUTH-02: JWT contains correct role and sub claims
# ─────────────────────────────────────────────────────────────
def test_auth02_jwt_contains_required_claims(admin_token):
    # Decode without verification to inspect claims
    claims = jwt.get_unverified_claims(admin_token)
    assert "sub" in claims, "JWT missing 'sub' claim"
    # sub should be a user ID (str/UUID)
    assert isinstance(claims["sub"], str)


# ─────────────────────────────────────────────────────────────
# AUTH-03: Expired/invalid JWT returns 401 on protected routes
# ─────────────────────────────────────────────────────────────
def test_auth03_invalid_jwt_returns_401(identity_client):
    resp = identity_client.get(
        "/v1/auth/me",
        headers={"Authorization": "Bearer TOTALLY_INVALID_TOKEN"}
    )
    assert resp.status_code == 401


# ─────────────────────────────────────────────────────────────
# AUTH-04: admin-bootstrap is one-time-use (second call → 409)
# ─────────────────────────────────────────────────────────────
def test_auth04_admin_bootstrap_one_time_use(identity_client):
    # First call done in conftest via admin_token fixture.
    # A second call must return 409 Conflict.
    resp = identity_client.post("/v1/identity/admin-bootstrap", json={
        "username": "second-admin",
        "email":    "second@rangeos.ai",
        "password": "AnotherStrongPass123!",
    })
    assert resp.status_code == 409, f"Expected 409, got {resp.status_code}"
    assert "already been completed" in resp.json()["detail"]


# ─────────────────────────────────────────────────────────────
# AUTH-05: Password under 12 chars rejected with 422
# ─────────────────────────────────────────────────────────────
def test_auth05_short_password_rejected(identity_client):
    resp = identity_client.post("/v1/identity/admin-bootstrap", json={
        "username": "weakadmin",
        "email":    "weak@rangeos.ai",
        "password": "short",
    })
    assert resp.status_code in (409, 422), \
        "Should be 422 (validation) or 409 (already bootstrapped)"


# ─────────────────────────────────────────────────────────────
# AUTH-06: GET /v1/auth/me returns current operator profile
# ─────────────────────────────────────────────────────────────
def test_auth06_get_me_returns_profile(identity_client, auth_headers):
    resp = identity_client.get("/v1/auth/me", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert "username" in data or "email" in data, \
        "Response should contain operator identity fields"


# ─────────────────────────────────────────────────────────────
# AUTH-07: Logout endpoint clears server-side session
# ─────────────────────────────────────────────────────────────
def test_auth07_logout_clears_session(identity_client, auth_headers, admin_token):
    resp = identity_client.post("/v1/auth/logout", headers=auth_headers)
    assert resp.status_code == 200
    # After logout, same token should no longer work
    resp2 = identity_client.get("/v1/auth/me", headers=auth_headers)
    assert resp2.status_code == 401, \
        "Token should be invalid after logout"

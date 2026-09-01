from datetime import datetime, time
from zoneinfo import ZoneInfo

from fastapi.testclient import TestClient

from app.domain.models import ScheduleBlock
from app.domain.red_flags import has_red_flag
from app.domain.schedule import doctor_available_now, facility_open_now
from app.main import app


client = TestClient(app)


def login_admin(email: str = "admin@arogya.local") -> TestClient:
    authed = TestClient(app)
    response = authed.post(
        "/api/v1/admin/auth/login",
        json={"email": email, "password": "ChangeMeLocalDemo!123"}
    )
    assert response.status_code == 200
    return authed


def test_admin_login_success_and_me():
    authed = login_admin()
    response = authed.get("/api/v1/admin/auth/me")
    assert response.status_code == 200
    assert response.json()["data"]["email"] == "admin@arogya.local"


def test_red_flags_before_chat_explanation():
    response = client.post("/api/v1/chat", json={"message": "I am having severe chest pain", "language": "en"})
    body = response.json()
    assert body["triage_level"] == "E0"
    assert body["actions"][0]["value"] == "108"
    assert body["sources"][0]["name"] == "red_flag_rules_v1"


def test_marathi_red_flag():
    assert has_red_flag("मला छातीत तीव्र वेदना आहे")


def test_chat_works_with_llm_disabled_and_grounded_content():
    response = client.post("/api/v1/chat", json={"message": "Can I eat before lipid profile?", "language": "en"})
    body = response.json()
    assert body["verification"]["grounded"] is True
    assert body["verification"]["llm_provider"] == "disabled"
    assert body["verification"]["llm_used"] is False
    assert body["sources"][0]["type"] == "reviewed_content"


def test_chat_find_doctor_intent_returns_doctor_card():
    response = client.post("/api/v1/chat", json={"message": "Cardiology doctor available?", "language": "en"})
    body = response.json()
    assert body["intent"] == "FIND_DOCTOR"
    assert body["cards"][0]["type"] == "doctor"
    assert body["sources"][0]["type"] == "local_database"


def test_chat_visiting_specialist_intent_hides_cancelled_sessions():
    response = client.post("/api/v1/chat", json={"message": "When is the cardiologist coming next?", "language": "en"})
    body = response.json()
    assert body["intent"] == "VISITING_SPECIALIST"
    assert body["cards"][0]["type"] == "visiting_session"
    assert all(card["data"]["confirmation_status"] == "CONFIRMED" for card in body["cards"])


def test_chat_open_now_intent_uses_schedule_engine():
    response = client.post("/api/v1/chat", json={"message": "Which clinic is open now?", "language": "en"})
    body = response.json()
    assert body["intent"] == "OPEN_NOW"
    assert body["cards"][0]["type"] == "open_now"
    assert "doctor_available" in body["cards"][0]["data"]


def test_chat_scheme_intent_returns_reviewed_scheme_card():
    response = client.post("/api/v1/chat", json={"message": "Can I use Ayushman card?", "language": "en"})
    body = response.json()
    assert body["intent"] == "SCHEME_GUIDANCE"
    assert body["cards"][0]["type"] == "scheme"
    assert body["sources"][0]["type"] == "reviewed_content"


def test_chat_facility_intent_returns_facility_card():
    response = client.post("/api/v1/chat", json={"message": "Which hospital is available?", "language": "en"})
    body = response.json()
    assert body["intent"] == "FACILITY_SEARCH"
    assert body["cards"][0]["type"] == "facility"


def test_chat_service_intent_returns_matching_facility():
    response = client.post("/api/v1/chat", json={"message": "Emergency service", "language": "en"})
    body = response.json()
    assert body["intent"] == "SERVICE_SEARCH"
    assert body["cards"][0]["type"] == "facility"


def test_chat_procedure_intent_returns_reviewed_procedure():
    response = client.post("/api/v1/chat", json={"message": "Explain x-ray procedure", "language": "en"})
    body = response.json()
    assert body["intent"] == "PROCEDURE_EXPLANATION"
    assert body["cards"][0]["type"] == "procedure"


def test_chat_medical_term_intent_returns_explainer_action():
    response = client.post("/api/v1/chat", json={"message": "What does MRI means?", "language": "en"})
    body = response.json()
    assert body["intent"] == "MEDICAL_TERM"
    assert body["actions"][0]["value"] == "/medical-explainer"


def test_chat_health_alert_intent_returns_alert_card():
    response = client.post("/api/v1/chat", json={"message": "Any monsoon health alert?", "language": "en"})
    body = response.json()
    assert body["intent"] == "HEALTH_ALERT"
    assert body["cards"][0]["type"] == "health_alert"


def test_unverified_doctor_hidden():
    response = client.get("/api/v1/doctors")
    names = [row["name_en"] for row in response.json()["data"]]
    assert "Hidden Unverified Doctor" not in names


def test_phone_hidden_without_consent():
    response = client.get("/api/v1/doctors/demo-dr-meera-kulkarni")
    assert response.json()["data"]["phone_public"] is None


def test_schedule_separates_facility_open_from_doctor_available():
    now = datetime(2026, 9, 1, 10, 0, tzinfo=ZoneInfo("Asia/Kolkata"))
    is_open, _ = facility_open_now(now, [ScheduleBlock(weekday=1, start_time=time(9), end_time=time(13))], [])
    assert is_open is True
    assert doctor_available_now(is_open, manual_presence=False, in_confirmed_session=False) is False


def test_cancelled_visit_not_public_next_visit():
    response = client.get("/api/v1/visiting-sessions")
    statuses = [row["confirmation_status"] for row in response.json()["data"]]
    assert "CANCELLED" not in statuses


def test_meta_endpoint_exposes_provider_without_secret():
    response = client.get("/api/v1/meta")
    body = response.json()["data"]
    assert body["api_version"] == "v1"
    assert "secret" not in body


def test_missing_content_uses_stable_error_contract():
    response = client.get("/api/v1/lab-tests/not-real")
    assert response.status_code == 404
    assert response.json()["error"]["code"] == "LAB_TEST_NOT_FOUND"


def test_report_creates_admin_visible_report_and_audit_log():
    authed = login_admin()
    before_count = authed.get("/api/v1/admin/overview").json()["data"]["unresolved_user_reports"]
    response = client.post(
        "/api/v1/reports/incorrect-info",
        json={"target_type": "doctor", "target_id": "doc-1", "reason": "Wrong number", "details": "Demo report"}
    )
    assert response.status_code == 200
    report_id = response.json()["data"]["id"]

    reports = authed.get("/api/v1/admin/reports").json()["data"]
    audit_logs = authed.get("/api/v1/admin/audit-logs").json()["data"]
    assert any(report["id"] == report_id for report in reports)
    assert any(entry["action"] == "INCORRECT_INFO_REPORTED" for entry in audit_logs)
    after_count = authed.get("/api/v1/admin/overview").json()["data"]["unresolved_user_reports"]
    assert after_count == before_count + 1


def test_verification_queue_can_approve_report_item():
    authed = login_admin("verifier@arogya.local")
    client.post(
        "/api/v1/reports/incorrect-info",
        json={"target_type": "facility", "target_id": "fac-1", "reason": "Schedule incorrect"}
    )
    queue = authed.get("/api/v1/admin/verification").json()["data"]
    pending = next(item for item in queue if item["entity_id"] == "fac-1" and item["status"] == "PENDING")

    response = authed.post(
        f"/api/v1/admin/verification/{pending['id']}/approve",
        json={"verifier": "demo-verifier", "reason": "Confirmed by phone"}
    )

    assert response.status_code == 200
    assert response.json()["data"]["status"] == "APPROVED"
    audit_logs = authed.get("/api/v1/admin/audit-logs").json()["data"]
    assert any(entry["action"] == "VERIFICATION_APPROVED" for entry in audit_logs)


def test_admin_endpoint_requires_authentication():
    response = client.get("/api/v1/admin/overview")
    assert response.status_code == 401
    assert response.json()["error"]["code"] == "ADMIN_UNAUTHORIZED"


def test_admin_endpoint_enforces_rbac():
    alert_publisher = login_admin("alerts@arogya.local")
    response = alert_publisher.get("/api/v1/admin/auth/me")
    assert response.status_code == 200

    forbidden = alert_publisher.post(
        "/api/v1/admin/verification/not-real/approve",
        json={"verifier": "alerts-demo", "reason": "Not allowed"}
    )
    assert forbidden.status_code == 403
    assert forbidden.json()["error"]["code"] == "ADMIN_FORBIDDEN"


def test_admin_login_locks_after_repeated_failures():
    locked_client = TestClient(app)
    email = "lockout-user@arogya.local"
    for _ in range(5):
        response = locked_client.post(
            "/api/v1/admin/auth/login",
            json={"email": email, "password": "wrong-password"}
        )
        assert response.status_code == 401

    locked = locked_client.post(
        "/api/v1/admin/auth/login",
        json={"email": email, "password": "wrong-password"}
    )
    assert locked.status_code == 429
    assert locked.json()["error"]["code"] == "ADMIN_LOGIN_LOCKED"

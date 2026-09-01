from datetime import datetime, time
from zoneinfo import ZoneInfo

from fastapi.testclient import TestClient

from app.domain.models import ScheduleBlock
from app.domain.red_flags import has_red_flag
from app.domain.schedule import doctor_available_now, facility_open_now
from app.main import app


client = TestClient(app)


def test_red_flags_before_chat_explanation():
    response = client.post("/api/v1/chat", json={"message": "I am having severe chest pain", "language": "en"})
    body = response.json()
    assert body["triage_level"] == "E0"
    assert body["actions"][0]["value"] == "108"


def test_marathi_red_flag():
    assert has_red_flag("मला छातीत तीव्र वेदना आहे")


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

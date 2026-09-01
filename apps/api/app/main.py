from __future__ import annotations

from datetime import datetime
from zoneinfo import ZoneInfo
from fastapi import Depends, FastAPI, Request, Query, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from pydantic import BaseModel

from app.auth.dependencies import require_admin, require_permission
from app.auth.service import AdminUser, auth_service
from app.ai.intents import ChatIntent, classify_intent
from app.ai.orchestrator import optional_llm_explanation
from app.ai.tools import doctor_cards, facility_cards, health_alert_cards, medical_term_cards, open_now_cards, procedure_cards, scheme_cards, service_cards, test_preparation_cards, visiting_cards
from app.core.config import settings
from app.core.errors import ApiError
from app.core.middleware import RequestContextMiddleware
from app.domain.red_flags import has_red_flag
from app.domain.schedule import doctor_available_now, facility_open_now
from app.domain.models import IncorrectInfoReport
from app.services import repository as repo
from app.services.reports import report_repository

app = FastAPI(title=settings.app_name, version="0.1.0")
app.add_middleware(RequestContextMiddleware)
app.add_middleware(CORSMiddleware, allow_origins=settings.cors_origins, allow_methods=["*"], allow_headers=["*"])


@app.exception_handler(ApiError)
async def api_error_handler(_request: Request, exc: ApiError) -> JSONResponse:
    return JSONResponse(status_code=exc.status_code, content=exc.detail)


@app.exception_handler(RequestValidationError)
async def validation_error_handler(_request: Request, exc: RequestValidationError) -> JSONResponse:
    return JSONResponse(
        status_code=422,
        content={"error": {"code": "VALIDATION_ERROR", "message": "Request validation failed", "details": exc.errors()}}
    )


class ChatRequest(BaseModel):
    message: str
    language: str = "en"


class VerificationDecisionRequest(BaseModel):
    verifier: str
    reason: str | None = None


class AdminLoginRequest(BaseModel):
    email: str
    password: str


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


@app.get("/ready")
def ready() -> dict:
    return {"status": "ready"}


@app.get("/api/v1/meta")
def meta() -> dict:
    return {"data": {"name": settings.app_name, "environment": settings.environment, "llm_provider": settings.llm_provider, "api_version": "v1"}}


@app.post("/api/v1/admin/auth/login")
def admin_login(payload: AdminLoginRequest, response: Response) -> dict:
    locked_until = auth_service.login_locked_until(payload.email)
    if locked_until is not None:
        raise ApiError(
            status_code=429,
            code="ADMIN_LOGIN_LOCKED",
            message="Too many failed login attempts. Try again later.",
            details={"locked_until": locked_until.isoformat()}
        )
    result = auth_service.login(payload.email, payload.password)
    if result is None:
        raise ApiError(status_code=401, code="ADMIN_LOGIN_FAILED", message="Invalid admin credentials")
    admin, session = result
    response.set_cookie(
        settings.admin_session_cookie,
        session.token,
        httponly=True,
        samesite="lax",
        secure=settings.environment == "production",
        max_age=30 * 60
    )
    return {"data": {"id": admin.id, "email": admin.email, "roles": admin.roles}}


@app.post("/api/v1/admin/auth/logout")
def admin_logout(request: Request, response: Response, admin: AdminUser = Depends(require_admin)) -> dict:
    token = request.cookies.get(settings.admin_session_cookie)
    if token:
        auth_service.logout(token)
    response.delete_cookie(settings.admin_session_cookie)
    return {"data": {"logged_out": True, "admin_id": admin.id}}


@app.get("/api/v1/admin/auth/me")
def admin_me(admin: AdminUser = Depends(require_admin)) -> dict:
    return {"data": {"id": admin.id, "email": admin.email, "roles": admin.roles}}


def trust(record) -> dict:
    return {"verified": record.verification_status == "VERIFIED", "verification_status": record.verification_status, "last_verified_at": record.last_verified_at, "source_type": record.source_type, "freshness": "current" if record.last_verified_at else "not_verified"}


def public_doctor_payload(doctor):
    data = doctor.model_dump()
    if not doctor.phone_publication_consent:
        data["phone_public"] = None
    return data


@app.get("/api/v1/search")
def search(q: str = Query(default="")) -> dict:
    needle = q.lower().strip()
    results = []
    for doctor in repo.public_doctors():
        haystack = f"{doctor.name_en} {doctor.name_mr} {doctor.specialty}".lower()
        if not needle or needle in haystack:
            results.append({"entity_type": "doctor", "id": doctor.id, "title": doctor.name_en, "subtitle": doctor.specialty, "url": f"/doctors/{doctor.slug}", "verified": True})
    for facility in repo.public_facilities():
        haystack = f"{facility.name_en} {facility.name_mr} {' '.join(facility.services)}".lower()
        if not needle or needle in haystack:
            results.append({"entity_type": "facility", "id": facility.id, "title": facility.name_en, "subtitle": facility.type, "url": f"/facilities/{facility.slug}", "verified": True})
    return {"results": results[:20]}


@app.get("/api/v1/doctors")
def doctors(specialty: str | None = None, doctor_type: str | None = None) -> dict:
    items = repo.public_doctors()
    if specialty:
        items = [d for d in items if specialty.lower() in d.specialty.lower()]
    if doctor_type:
        items = [d for d in items if d.doctor_type == doctor_type]
    return {"data": [public_doctor_payload(d) for d in items], "meta": {"total": len(items)}}


@app.get("/api/v1/doctors/{id_or_slug}")
def doctor_detail(id_or_slug: str) -> dict:
    for doctor in repo.public_doctors():
        if id_or_slug in {doctor.id, doctor.slug}:
            return {"data": public_doctor_payload(doctor), "meta": trust(doctor)}
    raise ApiError(status_code=404, code="DOCTOR_NOT_FOUND", message="Doctor not found")


@app.get("/api/v1/specialties")
def specialties() -> dict:
    return {"data": sorted({d.specialty for d in repo.public_doctors()})}


@app.get("/api/v1/visiting-sessions")
def visiting_sessions() -> dict:
    return {"data": [v.model_dump() for v in repo.public_visits()], "meta": {"total": len(repo.public_visits())}}


@app.get("/api/v1/facilities")
def facilities(facility_type: str | None = None) -> dict:
    items = repo.public_facilities()
    if facility_type:
        items = [f for f in items if f.type == facility_type]
    return {"data": [f.model_dump() for f in items], "meta": {"total": len(items)}}


@app.get("/api/v1/facilities/open-now")
def open_now() -> dict:
    now = datetime.now(ZoneInfo("Asia/Kolkata"))
    rows = []
    for facility in repo.public_facilities():
        is_open, reason = facility_open_now(now, facility.schedules, facility.overrides)
        rows.append({"facility": facility.model_dump(), "facility_open": is_open, "facility_reason": reason, "doctor_available": doctor_available_now(is_open, False, False), "warning": None if is_open else "Please call to confirm if you need care."})
    return {"data": rows}


@app.get("/api/v1/facilities/{id_or_slug}")
def facility_detail(id_or_slug: str) -> dict:
    for facility in repo.public_facilities():
        if id_or_slug in {facility.id, facility.slug}:
            return {"data": facility.model_dump(), "meta": trust(facility)}
    raise ApiError(status_code=404, code="FACILITY_NOT_FOUND", message="Facility not found")


@app.get("/api/v1/emergency")
def emergency() -> dict:
    return {"data": {"ambulance_108": "108", "referral_102": "102", "health_advice_104": "104", "message_en": "If this may be an emergency, call 108 now.", "message_mr": "आपत्कालीन परिस्थिती असल्यास लगेच 108 वर कॉल करा."}}


@app.get("/api/v1/schemes")
def schemes() -> dict:
    return {"data": [s.model_dump() for s in repo.SCHEMES]}


@app.get("/api/v1/schemes/{slug}")
def scheme(slug: str) -> dict:
    for item in repo.SCHEMES:
        if item.slug == slug:
            return {"data": item.model_dump()}
    raise ApiError(status_code=404, code="SCHEME_NOT_FOUND", message="Scheme not found")


@app.get("/api/v1/lab-tests")
def lab_tests() -> dict:
    return {"data": [t.model_dump() for t in repo.LAB_TESTS]}


@app.get("/api/v1/lab-tests/{slug}")
def lab_test(slug: str) -> dict:
    for item in repo.LAB_TESTS:
        if item.slug == slug:
            return {"data": item.model_dump()}
    raise ApiError(status_code=404, code="LAB_TEST_NOT_FOUND", message="Lab test not found")


@app.get("/api/v1/procedures")
def procedures() -> dict:
    return {"data": [p.model_dump() for p in repo.PROCEDURES]}


@app.get("/api/v1/procedures/{slug}")
def procedure(slug: str) -> dict:
    for item in repo.PROCEDURES:
        if item.slug == slug:
            return {"data": item.model_dump()}
    raise ApiError(status_code=404, code="PROCEDURE_NOT_FOUND", message="Procedure not found")


@app.get("/api/v1/health-alerts")
def health_alerts() -> dict:
    return {"data": [a.model_dump() for a in repo.ALERTS]}


@app.post("/api/v1/chat")
async def chat(payload: ChatRequest) -> dict:
    if has_red_flag(payload.message):
        return {"message": "Call 108 now. Ask someone nearby for help and go to the nearest emergency facility.", "language": payload.language, "triage_level": "E0", "sources": [{"type": "rule", "name": "red_flag_rules_v1"}], "cards": [{"type": "emergency", "data": {"number": "108"}}], "actions": [{"type": "call", "label": "Call 108", "value": "108"}], "verification": {"grounded": True}}
    intent = classify_intent(payload.message)
    if intent == ChatIntent.FIND_DOCTOR:
        base_message, cards, actions, sources = doctor_cards(payload.message)
    elif intent == ChatIntent.VISITING_SPECIALIST:
        base_message, cards, actions, sources = visiting_cards()
    elif intent == ChatIntent.OPEN_NOW:
        base_message, cards, actions, sources = open_now_cards()
    elif intent == ChatIntent.FACILITY_SEARCH:
        base_message, cards, actions, sources = facility_cards(payload.message)
    elif intent == ChatIntent.SERVICE_SEARCH:
        base_message, cards, actions, sources = service_cards(payload.message)
    elif intent == ChatIntent.TEST_PREPARATION:
        base_message, cards, actions, sources = test_preparation_cards(payload.language)
    elif intent == ChatIntent.PROCEDURE_EXPLANATION:
        base_message, cards, actions, sources = procedure_cards(payload.language)
    elif intent == ChatIntent.SCHEME_GUIDANCE:
        base_message, cards, actions, sources = scheme_cards(payload.language)
    elif intent == ChatIntent.MEDICAL_TERM:
        base_message, cards, actions, sources = medical_term_cards(payload.message, payload.language)
    elif intent == ChatIntent.HEALTH_ALERT:
        base_message, cards, actions, sources = health_alert_cards(payload.language)
    else:
        base_message = "I do not have verified information for that yet. Please call a verified facility or search the directory."
        cards = []
        actions = [{"type": "link", "label": "Search doctors", "value": "/doctors"}]
        sources = []

    llm = await optional_llm_explanation(payload.message, base_message, payload.language)
    fallback = "I do not have verified information for that yet. Please call a verified facility or search the directory."
    return {"message": llm["text"] or base_message or fallback, "language": payload.language, "intent": intent, "triage_level": None, "sources": sources, "cards": cards, "actions": actions, "verification": {"grounded": True, "llm_provider": llm["provider"], "llm_used": llm["used"]}}


@app.post("/api/v1/reports/incorrect-info")
def incorrect_info(report: IncorrectInfoReport) -> dict:
    stored = report_repository.create_incorrect_info_report(report)
    return {"data": stored.model_dump(), "meta": {"created_verification_queue_item": True}}


@app.get("/api/v1/admin/overview")
def admin_overview(_admin: AdminUser = Depends(require_permission("admin:read"))) -> dict:
    return {"data": {"verified_doctors": len(repo.public_doctors()), "pending_verification": 1, "stale_records": 0, "upcoming_visiting_sessions": len(repo.public_visits()), "unresolved_user_reports": len(report_repository.list_reports()), "active_alerts": len(repo.ALERTS), "records_due_for_review": 2}}


@app.get("/api/v1/admin/reports")
def admin_reports(_admin: AdminUser = Depends(require_permission("reports:read"))) -> dict:
    return {"data": [report.model_dump() for report in report_repository.list_reports()]}


@app.get("/api/v1/admin/audit-logs")
def admin_audit_logs(_admin: AdminUser = Depends(require_permission("audit:read"))) -> dict:
    return {"data": [entry.model_dump() for entry in report_repository.list_audit_logs()]}


@app.get("/api/v1/admin/verification")
def admin_verification_queue(_admin: AdminUser = Depends(require_permission("verification:read"))) -> dict:
    return {"data": [item.model_dump() for item in report_repository.list_verification_items()]}


@app.post("/api/v1/admin/verification/{item_id}/approve")
def approve_verification_item(item_id: str, decision: VerificationDecisionRequest, _admin: AdminUser = Depends(require_permission("verification:decide"))) -> dict:
    item = report_repository.decide_verification_item(item_id, "APPROVED", decision.verifier, decision.reason)
    if item is None:
        raise ApiError(status_code=404, code="VERIFICATION_ITEM_NOT_FOUND", message="Verification item not found")
    return {"data": item.model_dump()}


@app.post("/api/v1/admin/verification/{item_id}/reject")
def reject_verification_item(item_id: str, decision: VerificationDecisionRequest, _admin: AdminUser = Depends(require_permission("verification:decide"))) -> dict:
    item = report_repository.decide_verification_item(item_id, "REJECTED", decision.verifier, decision.reason)
    if item is None:
        raise ApiError(status_code=404, code="VERIFICATION_ITEM_NOT_FOUND", message="Verification item not found")
    return {"data": item.model_dump()}

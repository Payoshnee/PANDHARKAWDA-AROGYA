from __future__ import annotations

from datetime import datetime
from uuid import uuid4
from zoneinfo import ZoneInfo

from pydantic import BaseModel

from app.domain.models import IncorrectInfoReport


class StoredIncorrectInfoReport(IncorrectInfoReport):
    id: str
    status: str
    created_at: datetime


class AuditEntry(BaseModel):
    id: str
    actor: str
    action: str
    entity_type: str
    entity_id: str
    created_at: datetime


class VerificationQueueItem(BaseModel):
    id: str
    entity_type: str
    entity_id: str
    status: str
    change_summary: str
    submitted_by: str
    source: str
    risk: str
    created_at: datetime
    resolved_at: datetime | None = None
    decision_reason: str | None = None


class ReportRepository:
    def __init__(self) -> None:
        self._reports: list[StoredIncorrectInfoReport] = []
        self._audit_logs: list[AuditEntry] = []
        self._verification_items: list[VerificationQueueItem] = []

    def create_incorrect_info_report(self, report: IncorrectInfoReport) -> StoredIncorrectInfoReport:
        stored = StoredIncorrectInfoReport(
            id=f"report-{uuid4()}",
            status="PENDING_VERIFICATION",
            created_at=datetime.now(ZoneInfo("Asia/Kolkata")),
            **report.model_dump()
        )
        self._reports.append(stored)
        self._verification_items.append(
            VerificationQueueItem(
                id=f"verify-{uuid4()}",
                entity_type=report.target_type,
                entity_id=report.target_id,
                status="PENDING",
                change_summary=f"User reported: {report.reason}",
                submitted_by="public_user",
                source="incorrect_info_report",
                risk="medium",
                created_at=stored.created_at
            )
        )
        self._audit_logs.append(
            AuditEntry(
                id=f"audit-{uuid4()}",
                actor="public_user",
                action="INCORRECT_INFO_REPORTED",
                entity_type=report.target_type,
                entity_id=report.target_id,
                created_at=stored.created_at
            )
        )
        return stored

    def list_reports(self) -> list[StoredIncorrectInfoReport]:
        return list(self._reports)

    def list_audit_logs(self) -> list[AuditEntry]:
        return list(self._audit_logs)

    def list_verification_items(self) -> list[VerificationQueueItem]:
        return list(self._verification_items)

    def decide_verification_item(self, item_id: str, decision: str, verifier: str, reason: str | None = None) -> VerificationQueueItem | None:
        for index, item in enumerate(self._verification_items):
            if item.id == item_id:
                now = datetime.now(ZoneInfo("Asia/Kolkata"))
                updated = item.model_copy(update={"status": decision, "resolved_at": now, "decision_reason": reason})
                self._verification_items[index] = updated
                self._audit_logs.append(
                    AuditEntry(
                        id=f"audit-{uuid4()}",
                        actor=verifier,
                        action=f"VERIFICATION_{decision}",
                        entity_type=item.entity_type,
                        entity_id=item.entity_id,
                        created_at=now
                    )
                )
                return updated
        return None


report_repository = ReportRepository()

from __future__ import annotations

from enum import Enum


class Role(str, Enum):
    SUPER_ADMIN = "SUPER_ADMIN"
    DATA_VERIFIER = "DATA_VERIFIER"
    HOSPITAL_EDITOR = "HOSPITAL_EDITOR"
    MEDICAL_CONTENT_REVIEWER = "MEDICAL_CONTENT_REVIEWER"
    ALERT_PUBLISHER = "ALERT_PUBLISHER"


PERMISSIONS_BY_ROLE: dict[Role, set[str]] = {
    Role.SUPER_ADMIN: {"*"},
    Role.DATA_VERIFIER: {"admin:read", "verification:read", "verification:decide", "reports:read", "audit:read"},
    Role.HOSPITAL_EDITOR: {"admin:read", "facilities:read", "facilities:write"},
    Role.MEDICAL_CONTENT_REVIEWER: {"admin:read", "content:read", "content:review"},
    Role.ALERT_PUBLISHER: {"admin:read", "alerts:read", "alerts:publish"}
}


def role_has_permission(role: Role, permission: str) -> bool:
    permissions = PERMISSIONS_BY_ROLE[role]
    return "*" in permissions or permission in permissions

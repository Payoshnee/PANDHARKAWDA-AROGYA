from __future__ import annotations

from datetime import datetime, timedelta
from secrets import token_urlsafe
from zoneinfo import ZoneInfo

from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
from pydantic import BaseModel

from app.auth.rbac import Role, role_has_permission

SESSION_TTL_MINUTES = 30
ph = PasswordHasher()


class AdminUser(BaseModel):
    id: str
    email: str
    roles: list[Role]
    is_active: bool = True


class SessionRecord(BaseModel):
    token: str
    admin_id: str
    expires_at: datetime
    revoked: bool = False


class LoginThrottleState(BaseModel):
    failed_count: int = 0
    locked_until: datetime | None = None


class AuthService:
    def __init__(self) -> None:
        self._password_hash = ph.hash("ChangeMeLocalDemo!123")
        self._admins = {
            "admin@arogya.local": AdminUser(
                id="admin-demo-1",
                email="admin@arogya.local",
                roles=[Role.SUPER_ADMIN]
            ),
            "verifier@arogya.local": AdminUser(
                id="admin-demo-2",
                email="verifier@arogya.local",
                roles=[Role.DATA_VERIFIER]
            ),
            "alerts@arogya.local": AdminUser(
                id="admin-demo-3",
                email="alerts@arogya.local",
                roles=[Role.ALERT_PUBLISHER]
            )
        }
        self._sessions: dict[str, SessionRecord] = {}
        self._login_throttle: dict[str, LoginThrottleState] = {}

    def verify_password(self, password: str) -> bool:
        try:
            return ph.verify(self._password_hash, password)
        except VerifyMismatchError:
            return False

    def login_locked_until(self, email: str) -> datetime | None:
        state = self._login_throttle.get(email)
        now = datetime.now(ZoneInfo("Asia/Kolkata"))
        if state is None or state.locked_until is None:
            return None
        if state.locked_until <= now:
            self._login_throttle[email] = LoginThrottleState()
            return None
        return state.locked_until

    def record_failed_login(self, email: str) -> None:
        now = datetime.now(ZoneInfo("Asia/Kolkata"))
        state = self._login_throttle.get(email, LoginThrottleState())
        failed_count = state.failed_count + 1
        locked_until = state.locked_until
        if failed_count >= 5:
            locked_until = now + timedelta(minutes=10)
        self._login_throttle[email] = LoginThrottleState(failed_count=failed_count, locked_until=locked_until)

    def reset_failed_login(self, email: str) -> None:
        self._login_throttle.pop(email, None)

    def login(self, email: str, password: str) -> tuple[AdminUser, SessionRecord] | None:
        if self.login_locked_until(email) is not None:
            return None
        admin = self._admins.get(email)
        if admin is None or not admin.is_active or not self.verify_password(password):
            self.record_failed_login(email)
            return None
        self.reset_failed_login(email)
        session = SessionRecord(
            token=token_urlsafe(32),
            admin_id=admin.id,
            expires_at=datetime.now(ZoneInfo("Asia/Kolkata")) + timedelta(minutes=SESSION_TTL_MINUTES)
        )
        self._sessions[session.token] = session
        return admin, session

    def logout(self, token: str) -> None:
        session = self._sessions.get(token)
        if session is not None:
            self._sessions[token] = session.model_copy(update={"revoked": True})

    def get_admin_for_token(self, token: str | None) -> AdminUser | None:
        if not token:
            return None
        session = self._sessions.get(token)
        if session is None or session.revoked or session.expires_at <= datetime.now(ZoneInfo("Asia/Kolkata")):
            return None
        return next((admin for admin in self._admins.values() if admin.id == session.admin_id), None)

    def has_permission(self, admin: AdminUser, permission: str) -> bool:
        return any(role_has_permission(role, permission) for role in admin.roles)


auth_service = AuthService()

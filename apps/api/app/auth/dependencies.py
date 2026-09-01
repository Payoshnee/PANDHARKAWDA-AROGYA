from __future__ import annotations

from collections.abc import Callable

from fastapi import Cookie, Depends

from app.auth.service import AdminUser, auth_service
from app.core.config import settings
from app.core.errors import ApiError


def require_admin(session_token: str | None = Cookie(default=None, alias=settings.admin_session_cookie)) -> AdminUser:
    admin = auth_service.get_admin_for_token(session_token)
    if admin is None:
        raise ApiError(status_code=401, code="ADMIN_UNAUTHORIZED", message="Admin authentication required")
    return admin


def require_permission(permission: str) -> Callable[[AdminUser], AdminUser]:
    def dependency(admin: AdminUser = Depends(require_admin)) -> AdminUser:
        if not auth_service.has_permission(admin, permission):
            raise ApiError(status_code=403, code="ADMIN_FORBIDDEN", message="Admin role does not permit this action")
        return admin

    return dependency

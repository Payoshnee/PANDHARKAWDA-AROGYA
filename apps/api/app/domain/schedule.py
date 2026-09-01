from __future__ import annotations

from datetime import datetime
from zoneinfo import ZoneInfo

from app.domain.models import AvailabilityOverride, ScheduleBlock

IST = ZoneInfo("Asia/Kolkata")


def block_matches(now: datetime, block: ScheduleBlock) -> bool:
    local = now.astimezone(IST)
    return local.weekday() == block.weekday and block.start_time <= local.time() <= block.end_time


def override_matches(now: datetime, override: AvailabilityOverride) -> bool:
    local = now.astimezone(IST)
    if local.date() != override.date:
        return False
    if override.start_time and override.end_time:
        return override.start_time <= local.time() <= override.end_time
    return True


def facility_open_now(now: datetime, schedules: list[ScheduleBlock], overrides: list[AvailabilityOverride]) -> tuple[bool, str]:
    for override in overrides:
        if override_matches(now, override):
            if override.status == "CLOSED":
                return False, "Temporary closure"
            if override.status == "SPECIAL_OPEN":
                return True, "Special opening"
    if any(block_matches(now, block) for block in schedules):
        return True, "Weekly schedule"
    return False, "Outside verified hours"


def doctor_available_now(facility_open: bool, manual_presence: bool, in_confirmed_session: bool) -> bool:
    return facility_open and (manual_presence or in_confirmed_session)

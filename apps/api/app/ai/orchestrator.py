from __future__ import annotations

import json
import re

from app.ai.providers import AIProvider, AIProviderRequest, build_ai_provider
from app.ai.safety import check_model_output, contains_prompt_injection, contains_unverified_local_fact

SYSTEM_PROMPT = (
    "You explain already-verified healthcare navigation facts in plain language. "
    "Never invent doctor names, phone numbers, schedules, availability, scheme rules, diagnoses, or medicine doses. "
    "If provided facts are insufficient, say verified information is unavailable."
)

PLANNER_PROMPT = (
    "You are a healthcare reception planner for Pandharkawda Arogya. "
    "Stay inside healthcare navigation only. Do not diagnose, prescribe medicine, or invent local facts. "
    "Choose what the app should look up from its verified database. "
    "Return only JSON with keys: intent, reply, lookup, specialty, symptom, urgency. "
    "intent must be one of RECEPTION, FIND_DOCTOR, OPEN_NOW, FACILITY_SEARCH, SERVICE_SEARCH, "
    "TEST_PREPARATION, PROCEDURE_EXPLANATION, SCHEME_GUIDANCE, HEALTH_ALERT, MEDICAL_TERM, UNKNOWN. "
    "lookup is an array using only doctors, facilities, open_now, tests, schemes, procedures, alerts. "
    "reply should be a natural reception-style response or follow-up question, without doctor names, phones, "
    "test availability, timings, or facility claims."
)

ANSWER_PROMPT = (
    "You are Ask Arogya, a warm healthcare reception assistant for Pandharkawda. "
    "Talk naturally and empathetically, like a helpful front-desk person. "
    "You may discuss symptoms in general, ask follow-up questions, suggest what kind of doctor may fit, "
    "and mention emergency warning signs. Do not diagnose. Do not prescribe medicine or doses. "
    "For local facts, use only the VERIFIED LOCAL DATA provided. Do not invent doctor names, phone numbers, "
    "facility names, opening times, test availability, or schedules. "
    "If a local fact is missing, say it is not verified in our data. "
    "Keep the response concise and practical."
)


async def optional_llm_explanation(user_message: str, grounded_context: str, language: str, provider: AIProvider | None = None) -> dict:
    provider = provider or build_ai_provider()
    provider_name = provider.name
    if provider_name == "disabled" or contains_prompt_injection(user_message):
        return {"text": "", "provider": provider_name, "used": False}
    try:
        response = await provider.generate(
            AIProviderRequest(
                system=SYSTEM_PROMPT,
                user=f"User question: {user_message}\n\nVerified context:\n{grounded_context}",
                language=language
            )
        )
        safety = check_model_output(response.text, has_sources=grounded_context != "No verified local facts were found for this question.")
        if not safety.allowed:
            return {"text": "", "provider": response.provider, "model": response.model, "used": False, "blocked_reason": safety.reason}
        return {"text": response.text, "provider": response.provider, "model": response.model, "used": bool(response.text)}
    except Exception:
        return {"text": "", "provider": provider_name, "used": False, "error": "AI_PROVIDER_UNAVAILABLE"}


def _extract_json(text: str) -> dict:
    cleaned = text.strip()
    if cleaned.startswith("```"):
        cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned)
        cleaned = re.sub(r"\s*```$", "", cleaned)
    match = re.search(r"\{.*\}", cleaned, re.DOTALL)
    if match:
        cleaned = match.group(0)
    body = json.loads(cleaned)
    return body if isinstance(body, dict) else {}


async def plan_reception_turn(user_message: str, database_catalog: str, language: str, provider: AIProvider | None = None) -> dict:
    provider = provider or build_ai_provider()
    provider_name = provider.name
    if provider_name == "disabled" or contains_prompt_injection(user_message):
        return {"used": False, "provider": provider_name}

    try:
        response = await provider.generate(
            AIProviderRequest(
                system=PLANNER_PROMPT,
                user=f"User message: {user_message}\n\nAvailable verified database catalog:\n{database_catalog}",
                language=language,
            )
        )
        plan = _extract_json(response.text)
        return {
            "used": True,
            "provider": response.provider,
            "model": response.model,
            "intent": str(plan.get("intent", "")).upper(),
            "reply": str(plan.get("reply", "")).strip(),
            "lookup": plan.get("lookup") if isinstance(plan.get("lookup"), list) else [],
            "specialty": str(plan.get("specialty", "")).strip(),
            "symptom": str(plan.get("symptom", "")).strip(),
            "urgency": str(plan.get("urgency", "")).strip(),
        }
    except Exception:
        return {"used": False, "provider": provider_name, "error": "AI_PROVIDER_UNAVAILABLE"}


async def write_grounded_reception_answer(
    user_message: str,
    fallback_message: str,
    verified_context: str,
    allowed_local_names: list[str],
    language: str,
    provider: AIProvider | None = None,
) -> dict:
    provider = provider or build_ai_provider()
    provider_name = provider.name
    if provider_name == "disabled" or contains_prompt_injection(user_message):
        return {"text": "", "provider": provider_name, "used": False}

    try:
        response = await provider.generate(
            AIProviderRequest(
                system=ANSWER_PROMPT,
                user=(
                    f"User message: {user_message}\n\n"
                    f"Fallback answer if unsure:\n{fallback_message}\n\n"
                    f"VERIFIED LOCAL DATA:\n{verified_context}\n\n"
                    "Write the final answer. You can be conversational, but any doctor/facility/test/timing facts "
                    "must come only from VERIFIED LOCAL DATA."
                ),
                language=language,
            )
        )
        safety = check_model_output(response.text, has_sources=bool(verified_context.strip()))
        if not safety.allowed:
            return {"text": "", "provider": response.provider, "model": response.model, "used": False, "blocked_reason": safety.reason}
        bad_fact = contains_unverified_local_fact(response.text, allowed_local_names)
        if bad_fact:
            return {"text": "", "provider": response.provider, "model": response.model, "used": False, "blocked_reason": f"UNVERIFIED_LOCAL_FACT:{bad_fact}"}
        return {"text": response.text.strip(), "provider": response.provider, "model": response.model, "used": bool(response.text.strip())}
    except Exception:
        return {"text": "", "provider": provider_name, "used": False, "error": "AI_PROVIDER_UNAVAILABLE"}

from __future__ import annotations

from app.ai.providers import AIProviderRequest, build_ai_provider
from app.ai.safety import check_model_output, contains_prompt_injection

SYSTEM_PROMPT = (
    "You explain already-verified healthcare navigation facts in plain language. "
    "Never invent doctor names, phone numbers, schedules, availability, scheme rules, diagnoses, or medicine doses. "
    "If provided facts are insufficient, say verified information is unavailable."
)


async def optional_llm_explanation(user_message: str, grounded_context: str, language: str) -> dict:
    provider = build_ai_provider()
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

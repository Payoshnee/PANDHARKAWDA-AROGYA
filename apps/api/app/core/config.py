from __future__ import annotations

import os
from pydantic import BaseModel


class Settings(BaseModel):
    app_name: str = "Pandharkawda Arogya API"
    environment: str = os.getenv("ENVIRONMENT", "development")
    database_url: str = os.getenv("DATABASE_URL", "postgresql+asyncpg://arogya:arogya_dev@localhost:5432/arogya")
    redis_url: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    cors_origins: list[str] = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
    llm_provider: str = os.getenv("LLM_PROVIDER", "disabled")
    admin_session_cookie: str = os.getenv("ADMIN_SESSION_COOKIE", "arogya_admin")
    openai_api_key: str | None = os.getenv("OPENAI_API_KEY")
    openai_model: str = os.getenv("OPENAI_MODEL", "gpt-4.1-mini")
    azure_openai_api_key: str | None = os.getenv("AZURE_OPENAI_API_KEY")
    azure_openai_endpoint: str | None = os.getenv("AZURE_OPENAI_ENDPOINT")
    azure_openai_deployment: str | None = os.getenv("AZURE_OPENAI_DEPLOYMENT")
    azure_openai_api_version: str = os.getenv("AZURE_OPENAI_API_VERSION", "2024-10-21")
    ollama_base_url: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    ollama_model: str = os.getenv("OLLAMA_MODEL", "llama3.1")


settings = Settings()

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


settings = Settings()

from __future__ import annotations

from dataclasses import dataclass
from typing import Protocol

import httpx

from app.core.config import Settings, settings


@dataclass(frozen=True)
class AIProviderRequest:
    system: str
    user: str
    language: str


@dataclass(frozen=True)
class AIProviderResponse:
    text: str
    provider: str
    model: str


class AIProvider(Protocol):
    name: str

    async def generate(self, request: AIProviderRequest) -> AIProviderResponse:
        ...


class DisabledProvider:
    name = "disabled"

    async def generate(self, request: AIProviderRequest) -> AIProviderResponse:
        return AIProviderResponse(text="", provider=self.name, model="none")


class OpenAIProvider:
    name = "openai"

    def __init__(self, api_key: str, model: str) -> None:
        self.api_key = api_key
        self.model = model

    async def generate(self, request: AIProviderRequest) -> AIProviderResponse:
        async with httpx.AsyncClient(timeout=20) as client:
            response = await client.post(
                "https://api.openai.com/v1/chat/completions",
                headers={"authorization": f"Bearer {self.api_key}", "content-type": "application/json"},
                json={
                    "model": self.model,
                    "messages": [
                        {"role": "system", "content": request.system},
                        {"role": "user", "content": request.user}
                    ],
                    "temperature": 0.2
                }
            )
            response.raise_for_status()
            body = response.json()
            text = body["choices"][0]["message"]["content"]
            return AIProviderResponse(text=text, provider=self.name, model=self.model)


class AzureOpenAIProvider:
    name = "azure_openai"

    def __init__(self, api_key: str, endpoint: str, deployment: str, api_version: str) -> None:
        self.api_key = api_key
        self.endpoint = endpoint.rstrip("/")
        self.deployment = deployment
        self.api_version = api_version

    async def generate(self, request: AIProviderRequest) -> AIProviderResponse:
        url = f"{self.endpoint}/openai/deployments/{self.deployment}/chat/completions?api-version={self.api_version}"
        async with httpx.AsyncClient(timeout=20) as client:
            response = await client.post(
                url,
                headers={"api-key": self.api_key, "content-type": "application/json"},
                json={
                    "messages": [
                        {"role": "system", "content": request.system},
                        {"role": "user", "content": request.user}
                    ],
                    "temperature": 0.2
                }
            )
            response.raise_for_status()
            body = response.json()
            text = body["choices"][0]["message"]["content"]
            return AIProviderResponse(text=text, provider=self.name, model=self.deployment)


class OllamaProvider:
    name = "ollama"

    def __init__(self, base_url: str, model: str, api_key: str | None = None) -> None:
        self.base_url = base_url.rstrip("/")
        self.model = model
        self.api_key = api_key

    async def generate(self, request: AIProviderRequest) -> AIProviderResponse:
        async with httpx.AsyncClient(timeout=90) as client:
            response = await client.post(
                f"{self.base_url}/api/chat",
                headers={"authorization": f"Bearer {self.api_key}"} if self.api_key else {},
                json={
                    "model": self.model,
                    "stream": False,
                    "options": {
                        "temperature": 0.2,
                        "num_predict": 180,
                    },
                    "messages": [
                        {"role": "system", "content": request.system},
                        {"role": "user", "content": request.user}
                    ]
                }
            )
            response.raise_for_status()
            body = response.json()
            text = body.get("message", {}).get("content", "")
            return AIProviderResponse(text=text, provider=self.name, model=self.model)


class DyBrainProvider:
    name = "dybrain"

    def __init__(self, api_url: str, api_key: str | None, model: str) -> None:
        self.api_url = api_url.rstrip("/")
        self.api_key = api_key
        self.model = model

    async def generate(self, request: AIProviderRequest) -> AIProviderResponse:
        prompt = f"{request.system}\n\nUser:\n{request.user}\n\nAssistant:"
        headers = {"authorization": f"Bearer {self.api_key}"} if self.api_key else {}
        async with httpx.AsyncClient(timeout=90) as client:
            response = await client.post(
                f"{self.api_url}/api/generate",
                headers=headers,
                json={
                    "model": self.model,
                    "prompt": prompt,
                    "stream": False,
                    "options": {
                        "temperature": 0.2,
                        "num_predict": 180,
                    },
                },
            )
            response.raise_for_status()
            body = response.json()
            text = body.get("response", "")
            return AIProviderResponse(text=text, provider=self.name, model=self.model)


def build_ai_provider(config: Settings = settings) -> AIProvider:
    provider = config.llm_provider.lower()
    if provider == "dybrain":
        return DyBrainProvider(config.dybrain_api_url, config.dybrain_api_key, config.dybrain_model)
    if provider == "openai" and config.openai_api_key:
        return OpenAIProvider(config.openai_api_key, config.openai_model)
    if provider == "azure_openai" and config.azure_openai_api_key and config.azure_openai_endpoint and config.azure_openai_deployment:
        return AzureOpenAIProvider(
            config.azure_openai_api_key,
            config.azure_openai_endpoint,
            config.azure_openai_deployment,
            config.azure_openai_api_version
        )
    if provider == "ollama":
        return OllamaProvider(config.ollama_base_url, config.ollama_model, config.ollama_api_key)
    return DisabledProvider()

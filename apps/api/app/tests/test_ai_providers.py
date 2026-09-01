from app.ai.providers import AzureOpenAIProvider, DisabledProvider, OllamaProvider, OpenAIProvider, build_ai_provider
from app.core.config import Settings


def test_disabled_provider_is_default_without_credentials():
    provider = build_ai_provider(Settings(llm_provider="openai", openai_api_key=None))
    assert isinstance(provider, DisabledProvider)


def test_openai_provider_selected_with_key():
    provider = build_ai_provider(Settings(llm_provider="openai", openai_api_key="test-key", openai_model="model-a"))
    assert isinstance(provider, OpenAIProvider)
    assert provider.model == "model-a"


def test_azure_provider_selected_with_required_config():
    provider = build_ai_provider(
        Settings(
            llm_provider="azure_openai",
            azure_openai_api_key="test-key",
            azure_openai_endpoint="https://example.openai.azure.com",
            azure_openai_deployment="deployment-a"
        )
    )
    assert isinstance(provider, AzureOpenAIProvider)


def test_ollama_provider_selected_without_api_key():
    provider = build_ai_provider(Settings(llm_provider="ollama", ollama_base_url="http://localhost:11434", ollama_model="llama-local"))
    assert isinstance(provider, OllamaProvider)
    assert provider.model == "llama-local"

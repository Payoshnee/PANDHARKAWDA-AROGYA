export type AiProvider = "arogya_ai" | "dybrain" | "openai" | "claude" | "azure_openai" | "ollama" | "lm_studio" | "custom"

export type AiSettings = {
  provider: AiProvider
  mode: "managed" | "cloud" | "local"
  serverUrl: string
  modelName: string
  apiKey: string
  azureDeployment: string
  azureApiVersion: string
}

export const AI_SETTINGS_STORAGE_KEY = "arogya_ai_settings"

export const DEFAULT_AI_SETTINGS: AiSettings = {
  provider: "arogya_ai",
  mode: "managed",
  serverUrl: "",
  modelName: "qwen2.5vl:3b",
  apiKey: "",
  azureDeployment: "",
  azureApiVersion: "2024-10-21",
}

export const DYBRAIN_SETTINGS: AiSettings = {
  provider: "dybrain",
  mode: "managed",
  serverUrl: "https://payoshneejoshi-dyslexialearn.hf.space",
  modelName: "qwen2.5vl:3b",
  apiKey: "3535b227b065b6fff6e5b8f6cdc8f25d8ec2061ee454850ca1ed13fd6792415d",
  azureDeployment: "",
  azureApiVersion: "2024-10-21",
}

export const HUGGING_FACE_OLLAMA_SETTINGS: AiSettings = {
  provider: "ollama",
  mode: "local",
  serverUrl: "https://payoshneejoshi-dyslexialearn.hf.space",
  modelName: "qwen2.5vl:3b",
  apiKey: "3535b227b065b6fff6e5b8f6cdc8f25d8ec2061ee454850ca1ed13fd6792415d",
  azureDeployment: "",
  azureApiVersion: "2024-10-21",
}

export function getSavedAiSettings(): AiSettings {
  const stored = localStorage.getItem(AI_SETTINGS_STORAGE_KEY)
  if (!stored) return DEFAULT_AI_SETTINGS

  try {
    return { ...DEFAULT_AI_SETTINGS, ...JSON.parse(stored) } as AiSettings
  } catch {
    return DEFAULT_AI_SETTINGS
  }
}

export function saveAiSettings(settings: AiSettings) {
  localStorage.setItem(AI_SETTINGS_STORAGE_KEY, JSON.stringify(settings))
}

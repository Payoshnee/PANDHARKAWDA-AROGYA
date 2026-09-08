import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { BrainCircuit, Check, Cloud, Cpu, KeyRound, Loader2, PlugZap, RotateCcw, Save, Server, ShieldCheck, type LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { testAiConnection } from "@/lib/api"
import {
  DEFAULT_AI_SETTINGS,
  DYBRAIN_SETTINGS,
  HUGGING_FACE_OLLAMA_SETTINGS,
  getSavedAiSettings,
  saveAiSettings,
  type AiProvider,
  type AiSettings,
} from "@/lib/ai-settings"

const MODES: Array<{
  id: AiSettings["mode"]
  title: string
  description: string
  icon: LucideIcon
}> = [
  {
    id: "managed",
    title: "ArogyaAI",
    description: "Use our safe default health assistant models and reviewed local facts.",
    icon: ShieldCheck,
  },
  {
    id: "cloud",
    title: "Cloud AI",
    description: "Connect hosted model providers such as OpenAI, Claude, and Azure.",
    icon: Cloud,
  },
  {
    id: "local",
    title: "Local AI",
    description: "Use Ollama, LM Studio, or another private model server.",
    icon: Cpu,
  },
]

const PROVIDER_GROUPS: Array<{
  mode: AiSettings["mode"]
  title: string
  providers: Array<{
  id: AiProvider
  title: string
  description: string
  models: string[]
  }>
}> = [
  {
    mode: "managed",
    title: "ArogyaAI models",
    providers: [
      { id: "arogya_ai", title: "ArogyaAI", description: "Default hosted assistant with verified local facts", models: ["qwen2.5vl:3b"] },
      { id: "dybrain", title: "DyBrain", description: "Shared Hugging Face AI brain", models: ["qwen2.5vl:3b"] },
    ],
  },
  {
    mode: "cloud",
    title: "Cloud AI models",
    providers: [
      { id: "openai", title: "OpenAI", description: "Hosted OpenAI API", models: ["gpt-4o-mini", "gpt-4.1-mini", "gpt-4o"] },
      { id: "claude", title: "Claude", description: "Anthropic Claude API", models: ["claude-3-5-haiku-latest", "claude-3-5-sonnet-latest"] },
      { id: "azure_openai", title: "Azure OpenAI", description: "Azure deployment", models: ["deployment-name"] },
    ],
  },
  {
    mode: "local",
    title: "Local AI models",
    providers: [
      { id: "ollama", title: "Ollama", description: "Local or hosted Ollama-compatible server", models: ["qwen2.5vl:3b", "llama3:8b", "llama3.1", "mistral", "qwen2.5:7b"] },
      { id: "lm_studio", title: "LM Studio", description: "OpenAI-compatible local server", models: ["local-model", "qwen2.5vl:3b"] },
      { id: "custom", title: "Custom", description: "Private compatible endpoint", models: ["custom-model"] },
    ],
  },
]

const PROVIDERS = PROVIDER_GROUPS.flatMap((group) => group.providers.map((provider) => ({ ...provider, mode: group.mode })))

const providerDefaults: Record<AiProvider, Partial<AiSettings>> = {
  arogya_ai: { mode: "managed", serverUrl: "", modelName: "qwen2.5vl:3b", apiKey: "" },
  dybrain: { mode: "managed", serverUrl: DYBRAIN_SETTINGS.serverUrl, modelName: DYBRAIN_SETTINGS.modelName, apiKey: DYBRAIN_SETTINGS.apiKey },
  openai: { mode: "cloud", serverUrl: "https://api.openai.com", modelName: "gpt-4o-mini" },
  claude: { mode: "cloud", serverUrl: "https://api.anthropic.com", modelName: "claude-3-5-haiku-latest" },
  azure_openai: { mode: "cloud", modelName: "", azureApiVersion: "2024-10-21" },
  ollama: { mode: "local", serverUrl: HUGGING_FACE_OLLAMA_SETTINGS.serverUrl, modelName: HUGGING_FACE_OLLAMA_SETTINGS.modelName, apiKey: HUGGING_FACE_OLLAMA_SETTINGS.apiKey },
  lm_studio: { mode: "local", serverUrl: "http://localhost:1234/v1", modelName: "local-model", apiKey: "" },
  custom: { mode: "local", serverUrl: "https://api.example.com", modelName: "qwen2.5vl:3b" },
}

export function AiSettingsPage() {
  const [settings, setSettings] = useState<AiSettings>(DEFAULT_AI_SETTINGS)
  const [saved, setSaved] = useState(false)
  const [testState, setTestState] = useState<"idle" | "testing" | "success" | "error">("idle")
  const [testMessage, setTestMessage] = useState("")

  useEffect(() => {
    setSettings(getSavedAiSettings())
  }, [])

  const selectProvider = (provider: AiProvider) => {
    setSaved(false)
    setSettings((current) => ({
      ...current,
      provider,
      ...providerDefaults[provider],
    }))
  }

  const selectMode = (mode: AiSettings["mode"]) => {
    const firstProvider = PROVIDER_GROUPS.find((group) => group.mode === mode)?.providers[0]
    if (firstProvider) {
      selectProvider(firstProvider.id)
      return
    }
    update({ mode })
  }

  const update = (patch: Partial<AiSettings>) => {
    setSaved(false)
    setTestState("idle")
    setTestMessage("")
    setSettings((current) => ({ ...current, ...patch }))
  }

  const handleSave = () => {
    saveAiSettings(settings)
    setSaved(true)
  }

  const handleReset = () => {
    saveAiSettings(DEFAULT_AI_SETTINGS)
    setSettings(DEFAULT_AI_SETTINGS)
    setSaved(false)
  }

  const applyHuggingFaceOllama = () => {
    setSaved(false)
    setTestState("idle")
    setTestMessage("")
    setSettings(HUGGING_FACE_OLLAMA_SETTINGS)
  }

  const handleTestConnection = async () => {
    if (!settings.serverUrl || !settings.modelName) {
      if (settings.provider !== "arogya_ai") {
        setTestState("error")
        setTestMessage("Add a server URL and model name before testing.")
        return
      }
    }

    setTestState("testing")
    setTestMessage("Testing connection...")
    saveAiSettings(settings)

    try {
      const result = await testAiConnection("en")
      setTestState(result.data.ok ? "success" : "error")
      setTestMessage(`${result.data.provider}${result.data.model ? ` / ${result.data.model}` : ""}: ${result.data.message}`)
    } catch (error) {
      setTestState("error")
      setTestMessage(error instanceof Error ? `Backend test failed: ${error.message}` : "Backend test failed.")
    }
  }

  const activeProvider = PROVIDERS.find((provider) => provider.id === settings.provider)

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-6">
      <div className="flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
            <BrainCircuit className="size-3.5" />
            Ask Arogya
          </div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">AI Settings</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Choose how Ask Arogya should connect to model providers while keeping emergency rules and verified local facts first.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/ask-arogya">Back to Ask Arogya</Link>
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[16rem_1fr]">
        <aside className="rounded-lg border border-border bg-card p-2">
          {[
            { id: "managed", label: "ArogyaAI", icon: BrainCircuit },
            { id: "cloud", label: "Cloud AI", icon: Cloud },
            { id: "local", label: "Local AI", icon: Server },
          ].map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => selectMode(item.id as AiSettings["mode"])}
                className={cn(
                  "flex w-full items-center gap-3 rounded-md px-3 py-3 text-left text-sm font-semibold transition-colors",
                  item.id === settings.mode ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </button>
            )
          })}
        </aside>

        <section className="space-y-5">
          <div className="grid gap-3 md:grid-cols-3">
            {MODES.map((mode) => {
              const Icon = mode.icon
              const selected = settings.mode === mode.id
              return (
                <button
                  key={mode.id}
                  onClick={() => selectMode(mode.id)}
                  className={cn(
                    "min-h-36 rounded-lg border bg-card p-4 text-left transition-colors",
                    selected ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"
                  )}
                >
                  <Icon className="mb-6 size-6 text-primary" />
                  <p className="text-base font-bold text-foreground">{mode.title}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{mode.description}</p>
                </button>
              )
            })}
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{PROVIDER_GROUPS.find((group) => group.mode === settings.mode)?.title}</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  Current choice: {activeProvider?.title ?? "Unknown"}
                </p>
              </div>
              <Badge variant="outline">{settings.mode === "managed" ? "ArogyaAI" : settings.mode === "cloud" ? "Cloud AI" : "Local AI"}</Badge>
            </CardHeader>
            <CardContent>
              {settings.mode === "local" ? (
                <button
                  onClick={applyHuggingFaceOllama}
                  className="mb-3 flex w-full items-center justify-between rounded-lg border border-primary bg-primary/10 p-4 text-left transition-colors hover:bg-primary/15"
                >
                  <span>
                    <span className="block text-sm font-bold text-primary">Hugging Face Ollama</span>
                    <span className="mt-1 block text-xs text-muted-foreground">
                      qwen2.5vl:3b on payoshneejoshi-dyslexialearn.hf.space
                    </span>
                  </span>
                  <PlugZap className="size-5 text-primary" />
                </button>
              ) : null}
              <div className="grid gap-3 sm:grid-cols-2">
                {PROVIDERS.filter((provider) => provider.mode === settings.mode).map((provider) => {
                  const selected = settings.provider === provider.id
                  return (
                    <button
                      key={provider.id}
                      onClick={() => selectProvider(provider.id)}
                      className={cn(
                        "flex min-h-24 items-center justify-between rounded-lg border bg-background p-4 text-left transition-colors",
                        selected ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"
                      )}
                    >
                      <span>
                        <span className="block text-sm font-bold text-foreground">{provider.title}</span>
                        <span className="mt-1 block text-xs text-muted-foreground">{provider.description}</span>
                      </span>
                      {selected ? <Check className="size-5 text-primary" /> : null}
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Model</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {(activeProvider?.models ?? []).map((model) => (
                  <button
                    key={model}
                    onClick={() => update({ modelName: model })}
                    className={cn(
                      "rounded-md border px-3 py-2 text-left text-sm font-semibold transition-colors",
                      settings.modelName === model ? "border-primary bg-primary/10 text-primary" : "border-border bg-background text-foreground hover:border-primary/40"
                    )}
                  >
                    {model}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Connection</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="ai-server-url">Server URL</Label>
                <Input
                  id="ai-server-url"
                  value={settings.serverUrl}
                  onChange={(event) => update({ serverUrl: event.target.value })}
                  placeholder="http://localhost:11434"
                  disabled={settings.provider === "arogya_ai"}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ai-model-name">Model name</Label>
                <Input
                  id="ai-model-name"
                  value={settings.modelName}
                  onChange={(event) => update({ modelName: event.target.value })}
                  placeholder="llama3:8b"
                  disabled={settings.provider === "arogya_ai"}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ai-api-key">API key</Label>
                <div className="relative">
                  <KeyRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="ai-api-key"
                    type="password"
                    value={settings.apiKey}
                    onChange={(event) => update({ apiKey: event.target.value })}
                    placeholder={settings.mode === "local" ? "Optional" : "Provider key"}
                    className="pl-9"
                    disabled={settings.provider === "arogya_ai"}
                  />
                </div>
              </div>
              {settings.provider === "azure_openai" ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="ai-azure-deployment">Azure deployment</Label>
                    <Input
                      id="ai-azure-deployment"
                      value={settings.azureDeployment}
                      onChange={(event) => update({ azureDeployment: event.target.value })}
                      placeholder="your-deployment"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ai-azure-version">Azure API version</Label>
                    <Input
                      id="ai-azure-version"
                      value={settings.azureApiVersion}
                      onChange={(event) => update({ azureApiVersion: event.target.value })}
                      placeholder="2024-10-21"
                    />
                  </div>
                </>
              ) : null}
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                Saved settings stay in this browser. Backend responses still use server environment values until admin AI settings persistence is added.
              </p>
              {testMessage ? (
                <p className={cn("text-xs", testState === "success" ? "text-primary" : testState === "error" ? "text-destructive" : "text-muted-foreground")}>
                  {testMessage}
                </p>
              ) : null}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleTestConnection} disabled={testState === "testing"}>
                {testState === "testing" ? <Loader2 className="size-4 animate-spin" /> : <PlugZap className="size-4" />}
                Test Connection
              </Button>
              <Button variant="outline" onClick={handleReset}>
                <RotateCcw className="size-4" />
                Reset
              </Button>
              <Button onClick={handleSave}>
                <Save className="size-4" />
                {saved ? "Saved" : "Save"}
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

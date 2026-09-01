#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RUN_DIR="$ROOT_DIR/.run"
LOG_DIR="$RUN_DIR/logs"
API_PORT="${API_PORT:-8000}"
WEB_PORT="${WEB_PORT:-3000}"
API_BASE_URL="${NEXT_PUBLIC_API_BASE_URL:-http://localhost:${API_PORT}}"
LLM_PROVIDER="${LLM_PROVIDER:-ollama}"
OLLAMA_BASE_URL="${OLLAMA_BASE_URL:-http://localhost:11434}"
OLLAMA_MODEL="${OLLAMA_MODEL:-llama3:8b}"

mkdir -p "$LOG_DIR"

is_listening() {
  local port="$1"
  lsof -nP -iTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1
}

open_terminal() {
  local title="$1"
  local command="$2"
  local command_file="$3"
  local pid_file="$4"
  local log_file="$5"

  {
    printf '#!/usr/bin/env bash\n'
    printf 'set -euo pipefail\n'
    printf 'printf "\\033]0;%s\\007"\n' "$title"
    printf 'echo $$ > %q\n' "$pid_file"
    printf 'trap "rm -f %q" EXIT\n' "$pid_file"
    printf 'exec > >(tee %q) 2>&1\n' "$log_file"
    printf '%s\n' "$command"
  } > "$command_file"
  chmod +x "$command_file"
  open -a Terminal "$command_file"
}

shell_escape() {
  printf "%q" "$1"
}

start_terminal_service() {
  local name="$1"
  local title="$2"
  local command="$3"
  local pid_file="$RUN_DIR/${name}.pid"
  local log_file="$LOG_DIR/${name}.log"
  local command_file="$RUN_DIR/${name}.command"

  if [[ -f "$pid_file" ]] && kill -0 "$(cat "$pid_file")" >/dev/null 2>&1; then
    echo "$title already started with PID $(cat "$pid_file")."
    return
  fi

  rm -f "$pid_file"
  local escaped_root
  escaped_root="$(shell_escape "$ROOT_DIR")"

  open_terminal "$title" "cd $escaped_root; mkdir -p .run/logs; $command" "$command_file" "$pid_file" "$log_file"
  echo "Started $title."
}

echo "Starting Pandharkawda Arogya..."
echo "API: $API_BASE_URL"
echo "Web: http://localhost:$WEB_PORT"
echo "AI provider: $LLM_PROVIDER ($OLLAMA_MODEL at $OLLAMA_BASE_URL)"

if command -v docker >/dev/null 2>&1 && docker info >/dev/null 2>&1; then
  docker compose up -d postgres redis
  echo "Started Docker services: postgres, redis."
else
  echo "Docker is not running or not installed; skipping postgres/redis."
fi

if [[ "$LLM_PROVIDER" == "ollama" ]]; then
  if ! command -v ollama >/dev/null 2>&1; then
    echo "Ollama is not installed; API will fall back safely if local model calls fail."
  elif is_listening 11434; then
    echo "Ollama is already listening on port 11434."
  else
    start_terminal_service "ollama" "Arogya Ollama" "ollama serve"
    sleep 2
  fi
fi

start_terminal_service "api" "Arogya API" "cd apps/api; LLM_PROVIDER=$(shell_escape "$LLM_PROVIDER") OLLAMA_BASE_URL=$(shell_escape "$OLLAMA_BASE_URL") OLLAMA_MODEL=$(shell_escape "$OLLAMA_MODEL") python3 -m uvicorn app.main:app --reload --host 0.0.0.0 --port $(shell_escape "$API_PORT")"

start_terminal_service "web" "Arogya Web" "NEXT_PUBLIC_API_BASE_URL=$(shell_escape "$API_BASE_URL") npm --workspace apps/web run dev -- --port $(shell_escape "$WEB_PORT")"

cat <<EOF

Started.

Open:
  Web: http://localhost:$WEB_PORT
  API docs: $API_BASE_URL/docs

Stop everything started by this script:
  ./stop.sh

Logs:
  $LOG_DIR
EOF

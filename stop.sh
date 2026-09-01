#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RUN_DIR="$ROOT_DIR/.run"

stop_pid_file() {
  local name="$1"
  local pid_file="$RUN_DIR/${name}.pid"

  if [[ ! -f "$pid_file" ]]; then
    echo "$name was not started by start.sh."
    return
  fi

  local pid
  pid="$(cat "$pid_file")"

  if [[ -z "$pid" ]]; then
    rm -f "$pid_file"
    echo "$name pid file was empty; removed it."
    return
  fi

  if kill -0 "$pid" >/dev/null 2>&1; then
    echo "Stopping $name (PID $pid)..."
    pkill -TERM -P "$pid" >/dev/null 2>&1 || true
    kill -TERM "$pid" >/dev/null 2>&1 || true
    sleep 1
    if kill -0 "$pid" >/dev/null 2>&1; then
      pkill -KILL -P "$pid" >/dev/null 2>&1 || true
      kill -KILL "$pid" >/dev/null 2>&1 || true
    fi
  else
    echo "$name is not running."
  fi

  rm -f "$pid_file"
}

echo "Stopping Pandharkawda Arogya services..."

stop_pid_file "web"
stop_pid_file "api"
stop_pid_file "ollama"

if command -v docker >/dev/null 2>&1 && docker info >/dev/null 2>&1; then
  (cd "$ROOT_DIR" && docker compose stop postgres redis >/dev/null 2>&1) || true
  echo "Stopped Docker services: postgres, redis."
else
  echo "Docker is not running or not installed; skipped Docker services."
fi

echo "Stopped."

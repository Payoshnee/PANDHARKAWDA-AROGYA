#!/usr/bin/env bash
set -euo pipefail

curl -sS http://localhost:11434/api/chat \
  -H 'content-type: application/json' \
  -d '{
    "model": "llama3:8b",
    "stream": false,
    "messages": [
      {"role": "system", "content": "Reply only with the exact text requested. Do not add facts, places, services, or claims."},
      {"role": "user", "content": "Output exactly: Ollama connected"}
    ]
  }'

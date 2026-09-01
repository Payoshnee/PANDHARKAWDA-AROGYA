#!/usr/bin/env bash
set -euo pipefail
printf "\033]0;Arogya API\007"
echo $$ > /Users/himanshumathankar/Developer/PANDHARKAWDA\ AROGYA/.run/api.pid
trap "rm -f /Users/himanshumathankar/Developer/PANDHARKAWDA\ AROGYA/.run/api.pid" EXIT
exec > >(tee /Users/himanshumathankar/Developer/PANDHARKAWDA\ AROGYA/.run/logs/api.log) 2>&1
cd /Users/himanshumathankar/Developer/PANDHARKAWDA\ AROGYA; mkdir -p .run/logs; cd apps/api; LLM_PROVIDER=ollama OLLAMA_BASE_URL=http://localhost:11434 OLLAMA_MODEL=llama3:8b python3 -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

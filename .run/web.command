#!/usr/bin/env bash
set -euo pipefail
printf "\033]0;Arogya Web\007"
echo $$ > /Users/himanshumathankar/Developer/PANDHARKAWDA\ AROGYA/.run/web.pid
trap "rm -f /Users/himanshumathankar/Developer/PANDHARKAWDA\ AROGYA/.run/web.pid" EXIT
exec > >(tee /Users/himanshumathankar/Developer/PANDHARKAWDA\ AROGYA/.run/logs/web.log) 2>&1
cd /Users/himanshumathankar/Developer/PANDHARKAWDA\ AROGYA; mkdir -p .run/logs; NEXT_PUBLIC_API_BASE_URL=http://localhost:8000 npm --workspace apps/web run dev -- --port 3000

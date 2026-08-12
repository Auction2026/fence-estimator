#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
printf 'Build the backend image with:\n'
printf '  docker build -t fence-estimator %s\n' "$ROOT_DIR"
printf 'Then start the stack with:\n'
printf '  docker compose up --build\n'

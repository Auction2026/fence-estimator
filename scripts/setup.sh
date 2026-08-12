#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR/backend"
npm install
printf '\nBackend dependencies installed.\n'
printf 'Copy %s/.env.example to %s/.env before starting services.\n' "$ROOT_DIR" "$ROOT_DIR"

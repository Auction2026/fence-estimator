#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
node --check "$ROOT_DIR/frontend/js/app.js"
node --check "$ROOT_DIR/backend/server.js"
printf 'Syntax checks completed successfully.\n'

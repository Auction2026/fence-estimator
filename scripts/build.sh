#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

echo "No frontend build step configured."
if [ -f backend/package.json ]; then
  echo "Backend package found."
fi

#!/usr/bin/env bash
set -euo pipefail

# Homeport install script — Phase 0 stub.
# Confirms the target machine has what we need; real install logic
# (admin account creation, systemd service registration, permission
# checks) lands in Phase 4.

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is required but was not found on this machine." >&2
  echo "Install Node.js 20 LTS or newer, then re-run this script." >&2
  exit 1
fi

node_version=$(node -v | sed 's/^v//')
node_major=${node_version%%.*}

if [ "$node_major" -lt 20 ]; then
  echo "Node.js 20 or newer is required (found v$node_version)." >&2
  exit 1
fi

echo "Node.js v$node_version found."
echo "Homeport install bootstrap OK. Full install flow lands in Phase 4."

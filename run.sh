#!/usr/bin/env bash
set -euo pipefail

echo "==========================================="
echo "  Muzpa Auto Search - Startup Script"
echo "==========================================="
echo

command -v node >/dev/null 2>&1 || {
  echo "[ERROR] Node.js is not installed or not in PATH."
  echo "Install Node.js from https://nodejs.org/ and try again."
  exit 1
}

command -v npm >/dev/null 2>&1 || {
  echo "[ERROR] npm is not installed or not in PATH."
  echo "Reinstall Node.js (it includes npm) and try again."
  exit 1
}

if [ ! -f package.json ]; then
  echo "[ERROR] package.json not found."
  echo "Run this script from the project root folder."
  exit 1
fi

echo "[STEP] Installing dependencies..."
npm install

echo
echo "[STEP] Starting app..."
npm run dev


@echo off
setlocal

echo ==========================================
echo   Muzpa Auto Search - Startup Script
echo ==========================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Node.js is not installed or not in PATH.
  echo Install Node.js from https://nodejs.org/ and try again.
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo [ERROR] npm is not installed or not in PATH.
  echo Reinstall Node.js - it includes npm - and try again.
  exit /b 1
)

echo [OK] Node/npm detected.
echo.

if not exist package.json (
  echo [ERROR] package.json not found.
  echo Run this script from the project root folder.
  exit /b 1
)

echo [STEP] Installing dependencies...
call npm install
if errorlevel 1 (
  echo [ERROR] Dependency installation failed.
  exit /b 1
)

echo.
echo [STEP] Starting app...
call npm run dev
if errorlevel 1 (
  echo [ERROR] App failed to start.
  exit /b 1
)

endlocal

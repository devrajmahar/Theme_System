@echo off
cd /d "%~dp0"

python --version >nul 2>nul
if %errorlevel%==0 (
  python serve.py %*
) else (
  py -3 serve.py %*
)

if errorlevel 1 pause

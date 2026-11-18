@echo off
cd /d "%~dp0"
echo Starting PHISHNEXA Backend API on http://localhost:8000 ...
.\venv\Scripts\python.exe server.py
pause

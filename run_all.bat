@echo off
rem Run backend FastAPI server
start "Backend" cmd /k "python run_server.py"

rem Run frontend Vite dev server
cd frontend
start "Frontend" cmd /k "npm run dev"

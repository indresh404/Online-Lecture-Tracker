@echo off
echo ===============================
echo   Starting Lecture Tracker
echo ===============================

REM Start backend
echo Starting backend...
start cmd /k "cd backend && python app.py"

REM Give backend time to boot
timeout /t 3 /nobreak > nul

REM Start frontend
echo Starting frontend...
start cmd /k "npm run dev"

REM Wait for Vite
timeout /t 5 /nobreak > nul

REM Open browser
start http://localhost:3000

echo ===============================
echo   App is running!
echo ===============================

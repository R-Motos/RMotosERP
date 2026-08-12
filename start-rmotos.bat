@echo off
setlocal

echo =========================================
echo RMotos ERP - Iniciando backend y frontend
echo =========================================

echo.
echo [1/2] Iniciando backend...
cd backend
start "RMotos Backend" /B python -m uvicorn app.main:app --reload

echo [2/2] Iniciando frontend...
cd ..\frontend
start "RMotos Frontend" /B npm run dev

echo.
echo Backend: http://127.0.0.1:8000
echo Frontend: http://localhost:5173
echo.
echo Ambos servicios se estan iniciando en segundo plano.

@echo off
title Clinic Management System
echo ===================================================
echo    Starting Clinic Management System...
echo ===================================================

:: Navigate to the frontend directory
cd frontend

:: Open the default web browser after a short delay
echo Opening browser at http://localhost:8000...
start http://localhost:8000

:: Start the Python HTTP server
echo.
echo Press Ctrl+C to stop the server and close the app.
echo.
python -m http.server 8000

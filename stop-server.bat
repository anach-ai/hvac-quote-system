@echo off
setlocal enabledelayedexpansion

echo ========================================
echo Stopping HVAC ^& Appliance Repair Quote System
echo ========================================
echo.

:: Find and stop processes on port 3031
echo Looking for processes on port 3031...
netstat -ano | findstr :3031 >nul 2>&1
if %errorlevel% equ 0 (
    echo Found processes on port 3031. Stopping them...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3031') do (
        echo Stopping process PID: %%a
        taskkill /F /PID %%a >nul 2>&1
        if !errorlevel! equ 0 (
            echo Successfully stopped process %%a
        ) else (
            echo Failed to stop process %%a
        )
    )
    echo.
    echo All processes on port 3031 have been stopped.
) else (
    echo No processes found on port 3031.
)

:: Also stop any Node.js processes that might be running the server
echo.
echo Checking for Node.js processes...
tasklist /FI "IMAGENAME eq node.exe" 2>NUL | find /I /N "node.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo Found Node.js processes. Stopping them...
    taskkill /F /IM node.exe >nul 2>&1
    if !errorlevel! equ 0 (
        echo Node.js processes stopped successfully.
    ) else (
        echo Failed to stop some Node.js processes.
    )
) else (
    echo No Node.js processes found.
)

:: Wait a moment for processes to fully terminate
timeout /t 2 >nul

:: Verify port is free
echo.
echo Verifying port 3031 is free...
netstat -ano | findstr :3031 >nul 2>&1
if %errorlevel% equ 0 (
    echo WARNING: Port 3031 is still in use
    echo You may need to manually stop the process
) else (
    echo Port 3031 is now free.
)

echo.
echo Server stop process completed.
pause

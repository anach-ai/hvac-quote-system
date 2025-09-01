@echo off
setlocal enabledelayedexpansion

:menu
cls
echo ========================================
echo HVAC ^& Appliance Repair Quote System
echo Server Manager
echo ========================================
echo.
echo Choose an option:
echo.
echo 1. Start Production Server
echo 2. Start Development Server
echo 3. Stop Server
echo 4. Check Server Status
echo 5. Install/Update Dependencies
echo 6. Open in Browser
echo 7. Exit
echo.
set /p choice="Enter your choice (1-7): "

if "%choice%"=="1" goto start-prod
if "%choice%"=="2" goto start-dev
if "%choice%"=="3" goto stop-server
if "%choice%"=="4" goto check-status
if "%choice%"=="5" goto install-deps
if "%choice%"=="6" goto open-browser
if "%choice%"=="7" goto exit
echo Invalid choice. Please try again.
timeout /t 2 >nul
goto menu

:start-prod
cls
echo Starting Production Server...
call start-server.bat
goto menu

:start-dev
cls
echo Starting Development Server...
call start-dev.bat
goto menu

:stop-server
cls
echo Stopping Server...
call stop-server.bat
goto menu

:check-status
cls
echo Checking Server Status...
echo.
netstat -ano | findstr :3031 >nul 2>&1
if %errorlevel% equ 0 (
    echo [32m✓ Server is running on port 3031[0m
    echo.
    echo Active connections:
    netstat -ano | findstr :3031
) else (
    echo [31m✗ Server is not running on port 3031[0m
)
echo.
echo Node.js processes:
tasklist /FI "IMAGENAME eq node.exe" 2>NUL | find /I /N "node.exe">NUL
if "%ERRORLEVEL%"=="0" (
    tasklist /FI "IMAGENAME eq node.exe"
) else (
    echo No Node.js processes found.
)
echo.
pause
goto menu

:install-deps
cls
echo Installing/Updating Dependencies...
echo.
npm install
if %errorlevel% equ 0 (
    echo.
    echo [32m✓ Dependencies installed successfully![0m
) else (
    echo.
    echo [31m✗ Failed to install dependencies[0m
)
echo.
pause
goto menu

:open-browser
cls
echo Opening in Browser...
start http://localhost:3031
echo Browser opened.
timeout /t 2 >nul
goto menu

:exit
echo.
echo Thank you for using Server Manager!
echo.
exit /b 0

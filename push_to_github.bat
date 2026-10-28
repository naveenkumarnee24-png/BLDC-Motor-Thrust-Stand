@echo off
cd /d "%~dp0"
echo ========================================================
echo Pushing BLDC Thrust Stand to GitHub...
echo Folder: %CD%
echo ========================================================
echo.
echo Option 1: Press ENTER to push using standard browser sign-in.
echo Option 2: Or paste your GitHub Personal Access Token below:
set /p TOKEN="Enter Token (or press ENTER to skip): "

if "%TOKEN%"=="" (
    echo.
    echo Pushing with standard Git credentials...
    git push -u origin main
) else (
    echo.
    echo Pushing with provided Personal Access Token...
    git push https://%TOKEN%@github.com/naveenkumarnee24-png/BLDC-Motor-Thrust-Stand.git main
)

echo.
echo ========================================================
pause

@echo off
REM Ruta Legal · arranque en Windows
setlocal
cd /d "%~dp0"

where py >nul 2>nul
if %errorlevel%==0 (
  py serve.py %*
  exit /b
)

where python >nul 2>nul
if %errorlevel%==0 (
  python serve.py %*
  exit /b
)

echo.
echo  No se ha encontrado Python.
echo  Puedes abrir index.html directamente con doble clic.
echo  O instalar Python desde https://www.python.org/downloads/
echo.
pause

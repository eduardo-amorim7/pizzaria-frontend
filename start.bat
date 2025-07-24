@echo off
echo Iniciando servidor da Pizzaria Frontend...
echo.
echo Servidor rodando em: http://localhost:8080
echo Para parar o servidor, pressione Ctrl+C
echo.

REM Verifica se o Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: Node.js não está instalado!
    echo Por favor, instale o Node.js em: https://nodejs.org/
    pause
    exit /b 1
)

REM Inicia o servidor
node server.js

pause


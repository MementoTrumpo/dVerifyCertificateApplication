@echo off
setlocal

echo 🚀 Запуск и инициализация IPFS daemon...

:: Проверка наличия ipfs.exe
where ipfs >nul 2>nul
if errorlevel 1 (
    echo ❌ IPFS CLI не найден. Установите go-ipfs из https://docs.ipfs.tech/install/
    pause
    exit /b 1
)

:: Проверка существования репозитория
if not exist "%USERPROFILE%\.ipfs" (
    echo 🔧 Инициализация IPFS репозитория...
    ipfs init
)

echo 🔧 Настройка CORS для доступа из приложений (React, браузеры)...
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin "[\"*\"]"
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods "[\"PUT\", \"POST\", \"GET\"]"
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Headers "[\"Authorization\"]"

echo ⚡ Запуск IPFS daemon...
ipfs daemon

endlocal

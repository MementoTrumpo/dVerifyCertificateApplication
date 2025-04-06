#!/bin/bash

echo "🚀 Запуск и инициализация IPFS daemon..."

# Проверка наличия IPFS
if ! command -v ipfs &> /dev/null; then
  echo "❌ IPFS CLI не установлен. Установите go-ipfs вручную: https://docs.ipfs.tech/install/"
  exit 1
fi

# Инициализация (если нужно)
if [ ! -d "$HOME/.ipfs" ]; then
  echo "🔧 Инициализация репозитория IPFS..."
  ipfs init
fi

# Установка CORS-заголовков
echo "🔧 Настройка CORS для API доступа..."
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]'
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "POST", "GET"]'
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Headers '["Authorization"]'

# Запуск демона
echo "⚡ Запуск IPFS daemon..."
ipfs daemon

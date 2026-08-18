#!/bin/bash
set -e

echo "🚀 Iniciando deploy no servidor Hostinger..."

# Garantir que conflitos locais no servidor não bloqueiem o pull
git fetch origin main
git reset --hard origin/main
git pull origin main

# Instalar dependências e buildar
npm install
npm run build

# Reiniciar servidor (PM2) se disponível
if command -v pm2 &> /dev/null; then
  echo "🔄 Reiniciando aplicação no PM2..."
  pm2 reload all || pm2 restart all
fi

echo "✅ Deploy finalizado com sucesso!"

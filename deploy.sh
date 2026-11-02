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

# Reiniciar SOMENTE as aplicações da Infinity no PM2 (sem tocar em outros clientes/projetos)
if command -v pm2 &> /dev/null; then
  echo "🔄 Reiniciando apenas serviços da Infinity no PM2..."
  
  if pm2 describe infinityondemand &> /dev/null; then
    echo "▶ Recarregando infinityondemand..."
    pm2 reload infinityondemand
  fi

  if pm2 describe infinity-forms &> /dev/null; then
    echo "▶ Recarregando infinity-forms..."
    pm2 reload infinity-forms
  fi
fi

echo "✅ Deploy finalizado com sucesso!"

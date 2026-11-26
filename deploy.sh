#!/bin/bash
set -e

echo "🚀 Iniciando deploy unificado (Site Infinity + CRM)..."

# 1. Atualizar e Buildar o Site Infinity (Next.js)
echo "🌐 [1/3] Atualizando e compilando o Site Infinity..."
cd /var/www/infinityondemand
git fetch origin main
git reset --hard origin/main
git pull origin main
npm install
npm run build

# 2. Atualizar e Buildar o CRM Infinity (Vite React)
echo "📦 [2/3] Atualizando e compilando o CRM Infinity..."
if [ -d "/var/www/crm-repo" ]; then
  cd /var/www/crm-repo
  git fetch origin main
  git reset --hard origin/main
  git pull origin main
  npm install
  npm run build
  
  # Sincroniza o dist do CRM diretamente para a pasta servida pelo webserver (/var/www/crm)
  echo "📂 Sincronizando build do CRM para /var/www/crm..."
  mkdir -p /var/www/crm
  rsync -av --delete /var/www/crm-repo/dist/ /var/www/crm/
else
  echo "⚠️ Pasta /var/www/crm-repo não encontrada. Rode 'git clone git@github.com:AngeloMarquess/CRM-InfinityonDemand.git /var/www/crm-repo' uma vez."
fi

# 3. Reiniciar serviços no PM2
echo "🔄 [3/3] Reiniciando serviços da Infinity no PM2..."
if command -v pm2 &> /dev/null; then
  if pm2 describe infinityondemand &> /dev/null; then
    pm2 reload infinityondemand
  fi

  if pm2 describe infinity-forms &> /dev/null; then
    pm2 reload infinity-forms
  fi
fi

echo "✅ Deploy unificado finalizado com sucesso!"

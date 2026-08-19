# 🏛️ PROJETO OLIMPO — PLANO MESTRE DE EXECUÇÃO & AUTONOMIA 24/7
**Organização:** Infinity On Demand  
**Data da Última Atualização:** 19/08/2026  
**Status Operacional:** Infraestrutura Base Ativa & Monitorada  

---

## 📌 1. RESUMO EXECUTIVO DO PROJETO

O **Projeto Olimpo** consiste em uma infraestrutura autônoma orientada a agentes de inteligência artificial desenhada para executar as operações de marketing, prospecção ativa (outbound), entrega técnica e governança/BI 24 horas por dia, 7 dias por semana, com independência de máquinas locais.

### Hierarquia de Agentes:
* **Zeus (Conselheiro & BI):** Monitoramento de infraestrutura, compilação de métricas de vendas e envio de relatórios gerenciais consolidados via Telegram.
* **Hermes (Gerente de Projetos / PMO):** Orquestração de tarefas, distribuição de ordens técnicas e garantia de esteira ágil entre os agentes especialistas.
* **Artemis (SDR Outbound & Prospecção):** Mineração de leads locais via n8n e abordagem ativa automatizada com cadência via Evolution API.
* **Árgus (DevSecOps & Hardening):** Auditoria de segurança, monitoramento de portas, certificados e integridade de VPS.
* **Atena / Apolo / Hefesto:** Redação persuasiva, criação de criativos/design e geração/deploy de landing pages no Nginx.

---

## ⚡ 2. MAPA DE INFRAESTRUTURA & STACK TÉCNICA

* **Servidor de Produção:** VPS Hostinger (IP: `89.116.74.147`)
* **Gerenciador de Processos:** PM2 v7.0.3 (Cluster Node.js com persistência via `pm2 save`)
* **Motor de Workflows 24/7:** n8n (Instância ativa com triggers cronométricos)
* **API de Mensageria:** Evolution API (Instância WhatsApp: `artemis`, Token: `1C257567D7A9-446A-A8DF-A1D7F2536AF6`, Status: 🟢 Conectado)
* **Conector MCP (Model Context Protocol):**
  * **Servidor VPS:** `/var/www/olimpo-mcp/server.js` rodando em `http://89.116.74.147:3333`
  * **Cliente Antigravity:** `~/.gemini/mcp-scripts/olimpo-client.js` via Stdio Bridge (`mcp_config.json`)
  * **Ferramentas MCP Ativas:** `get_server_status`, `deploy_landing_page`
* **Bot de Notificação e Alertas:** Telegram Bot (`@ZeusInfinityBot`, ID: `1769259678`)

---

## ✅ 3. O QUE JÁ FOI IMPLEMENTADO (STATUS CONCLUÍDO)

- [x] **Configuração e Deploy do Servidor MCP:** Script REST seguro instalado em `/var/www/olimpo-mcp/server.js` na VPS e monitorado 24/7 pelo PM2 sob o processo `olimpo-mcp`.
- [x] **Integração Antigravity (Mac) ➔ VPS:** Configuração do `mcp_config.json` via Stdio Client com resolução completa de permissões e handshake com 2 ferramentas ativas.
- [x] **Validação do Diagnóstico de Servidor:** Execução com sucesso do tool call `get_server_status` a partir do Antigravity.
- [x] **Criação e Registro do Bot do Telegram:** Bot `@ZeusInfinityBot` registrado via BotFather e integrado às rotinas do ecossistema.
- [x] **Workflow n8n de Governança (Zeus Report):**
  * Gatilho diário às 08h e 20h (`Schedule Trigger`).
  * Consulta de integridade de hardware e uptime no endpoint `/mcp/status`.
  * Formatação e despacho de relatório Markdown diretamente no Telegram do CEO.
- [x] **Ativação da Instância Evolution API da Artemis:**
  * Instância `artemis` criada e conectada com sucesso (`5581971027939`).
  * Token: `1C257567D7A9-446A-A8DF-A1D7F2536AF6`.

---

## 🎯 4. PRÓXIMAS ETAPAS IMEDIATAS (BACKLOG DE EXECUÇÃO)

### Fase 1: Ativação da Máquina de Vendas da Artemis (Em Andamento)
- [x] **Configuração da Instância Evolution API:** `URL_BASE` (`http://89.116.74.147:8080`), `INSTANCE_NAME` (`artemis`) e `API_KEY` vinculados.
- [x] **Workflow de Prospecção Ativa:**
  * Importado no n8n com sanitização de telefone, copy persuasiva e loop unitário.
  * Nó de Delay de segurança (45s) anti-bloqueio ativo.
  * Disparo via Evolution API (`/message/sendText/artemis`).
- [ ] **Webhook de Respostas da Artemis (Alerta de Lead Quente):**
  * Receber evento `MESSAGES_UPSERT` da Evolution API quando o lead responder no WhatsApp e disparar alerta de conversão no Telegram do CEO.

### Fase 2: Ativação da Landing Page de Conversão
- [ ] **Criação do Subdomínio Nginx:** Apontar `lojas.infinityondemand.com.br` no servidor.
- [ ] **Deploy Automatizado via Hefesto:** Utilizar a ferramenta MCP `deploy_landing_page` para publicar a página oficial de conversão.
- [ ] **Integração do Checkout:** Conectar botões de compra direta com chave PIX/Checkout transparente.

### Fase 3: Monitoramento Contínuo com Árgus
- [ ] **Implementação de Healthcheck:** Adicionar rota de verificação de portas abertas (UFW) e expiração de certificados SSL/TLS com alerta em tempo real no Telegram.

---

## 🤖 5. INSTRUÇÕES DIRETAS PARA O ANTIGRAVITY

> **Diretiva para a IA:**  
> Quando esta pasta de projeto for carregada, assuma o papel de **Hermes (PMO)** sob supervisão de **Zeus**. Utilize a ferramenta `get_server_status` para validar o estado do servidor e a ferramenta `deploy_landing_page` para subidas de código no Nginx. Ao receber novas tarefas, decomponha o plano em etapas técnicas acionáveis e execute as chamadas de API correspondentes.

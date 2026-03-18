<div align="center">
  <img src="https://via.placeholder.com/800x200/000000/00DB79?text=INFINITY+LABS" alt="Infinity Labs Cover" />

  <h1>🚀 Infinity OnDemand - Labs & Consulting Platform</h1>
  <p>
    <b>A engenharia por trás do crescimento digital.</b><br />
    Plataforma corporativa construída com foco em performance extrema, design minimalista ("Google Labs") e conversão B2B.
  </p>

  <p>
    <a href="#tecnologias">Tecnologias</a> •
    <a href="#arquitetura-e-performance">Arquitetura</a> •
    <a href="#módulos-integrados">Módulos</a> •
    <a href="#como-rodar">Como Rodar</a>
  </p>
</div>

<br/>

## ⚡ Sobre o Projeto

O **Infinity OnDemand** é um *One-Pager* de alta conversão projetado para apresentar a divisão de tecnologia e marketing da agência. Inspirado na estética clean e utilitária dos laboratórios de pesquisa (como *Google Labs*), o projeto remove ruídos visuais para dar protagonismo absoluto à performance, tecnologia proprietária e soluções de e-commerce.

> Construído com foco em **Velocidade de Carregamento (LCP)**, **Acessibilidade** e **Integrações de Plataformas**.

---

## 🛠️ Tecnologias de Ponta

Para atingir a sensação de uma aplicação nativa e leveza absoluta, escolhemos um stack moderno e focado em SSR (Server-Side Rendering) e performance no front-end:

- **[Next.js 15 (App Router)](https://nextjs.org/)**: Framework React utilizado para renderização ultra-rápida no lado do servidor e otimização automatizada (SEO).
- **React 19**: Construção de interfaces componentizadas sem overhead estrutural.
- **CSS Nativo (Custom Properties)**: Dispensamos frameworks utilitários massivos (como Tailwind/Bootstrap) em favor de um **Design System em Vanilla CSS**. Uso pesado de Variáveis CSS (`--var`) para garantir carregamento submilissegundo da folha de estilos.
- **Micro-interações fluidas**: Sombras e transições dinâmicas usando o modelo de profundidade do *Material Design*.

---

## 🏗️ Arquitetura e Performance

Nossa filosofia de "Minimalismo Inteligente":
*   **Zero Client-Side Bloat:** Componentes estáticos rodam primariamente no servidor (RSC), enviando o mínimo de JavaScript para o browser do usuário final.
*   **Animações sem JS:** Todas as interações de *hover*, expansão e feedback visual (`btn-primary`, `card`) são delegadas nativamente para a engine de CSS do navegador, poupando processamento da Thread Principal (Main Thread).
*   **Acessibilidade e Semântica:** Uso rigoroso de tags HTML5 puras (`<header>`, `<nav>`, `<section>`, `<main>`) garantindo perfeita leitura por agregadores e *Screen Readers*.

---

## 🧩 Módulos Integrados

Este repositório atua como o ponto de entrada principal, servindo de vitrine (Gateway) para nossos potentes sub-sistemas em modelo SaaS:

<table>
  <tr>
    <td width="50%">
      <h3>📈 Infinity CRM</h3>
      Uma plataforma proprietária construída em casa para relacionamento B2B. Foco em UX baseada em dados, métricas em tempo real e aceleração de Vendas (Sales Pipeline).
      <br/><br/>
      <a href="https://crmm.infinityondemand.com.br/">Acessar CRM</a>
    </td>
    <td width="50%">
      <h3>🍕 Infinity Delivery OS</h3>
      SaaS Multi-Tenant escalável voltado para o setor Foodtech. Arquitetura em Nginx para automatização de domínios, PDV Sync em tempo real e Gestão em Kanban de alta reatividade.
      <br/><br/>
      <a href="https://delivery.infinityondemand.com.br/">Acessar Delivery SaaS</a>
    </td>
  </tr>
</table>

---

## 🚀 Como Rodar Localmente

Certifique-se de possuir o [Node.js](https://nodejs.org/) instalado.

```bash
# 1. Clone este repositório
git clone git@github.com:AngeloMarquess/InfinityOnDemand.git

# 2. Acesse a pasta do projeto
cd InfinityOnDemand/site-infinity

# 3. Instale as dependências
npm install

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o resultado.

---

<div align="center">
  <i>"Inovação que move o seu negócio."</i><br>
  Desenvolvido com 💚 pelo <b>Infinity Labs</b>
</div>

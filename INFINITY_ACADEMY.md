# Infinity Academy — Documentação do Módulo

> Plataforma de treinamentos de **Marketing, Vendas, Administração e IA** da Infinity OnDemand.
> Modelo **B2C + B2B** (assinatura individual + planos por assentos para empresas), com área de
> membros estilo Netflix, player que retoma de onde parou e gamificação.

Versão inicial criada em **agosto/2026**. Branch: `feat/infinity-academy`.

---

## 1. Visão geral

O módulo adiciona duas experiências ao site existente:

| Experiência | Rota | Público | Descrição |
|---|---|---|---|
| **Landing de vendas** | `/academy` (PT) e `/es/academy` | Visitantes | Página pública que vende a Academy, com planos B2C e seção B2B. |
| **Área do aluno** | `/aluno` | Alunos logados | Dashboard estilo Netflix, cursos, player e gamificação. |
| **Player do curso** | `/aluno/curso/[slug]` | Alunos logados | Reprodução das aulas com retomada, progresso e XP. |

Racional de mercado: o modelo que mais cresce hoje é **assinatura com trilhas + gamificação**
(curso avulso tem conclusão média de apenas 5–15%; gamificação bem feita chega a triplicar essa
taxa). O maior potencial da Infinity é o duplo canal **B2C + B2B**, com o ângulo "marketing,
vendas e gestão na prática, com IA no centro" — posição que a Alura não ocupa.

---

## 2. Stack e integração

Construído sobre a stack já existente do projeto, sem novas dependências:

- **Next.js 16** (App Router, Turbopack) + **React 19**
- **Supabase** (Auth + Postgres + RLS) — reutiliza o mesmo projeto/cliente do site
- **Tailwind v4** + CSS próprio por módulo
- **TypeScript**
- **i18n** PT/ES já existente

O build passa limpo (`npx next build`, exit 0) e o item **"Academy"** foi adicionado ao menu
principal (desktop e mobile).

---

## 3. Arquivos criados e alterados

### Novos arquivos

```
academy_schema.sql                          # Esquema do banco (tabelas, funções, RLS, trigger)
academy_seed.sql                            # Cursos de demonstração

src/lib/academy/
├── types.ts                                # Tipos TS + helpers de nível/XP
└── client.ts                               # Camada de dados + auth (Supabase)

src/app/[locale]/academy/                   # LANDING DE VENDAS (pública, PT/ES)
├── page.tsx                                # Server component + metadata SEO
├── AcademyContent.tsx                      # Conteúdo da landing (hero, trilhas, planos, B2B, FAQ)
└── academy.css                             # Estilos da landing

src/app/aluno/                              # ÁREA DO ALUNO (privada)
├── layout.tsx                             # Layout + noindex
├── aluno.css                              # Estilos (Netflix, player, gamificação)
├── page.tsx                               # Entrada
├── AlunoApp.tsx                           # Controla sessão: login OU dashboard
├── AuthGate.tsx                           # Tela de login/cadastro (Supabase Auth)
├── Dashboard.tsx                          # Dashboard Netflix + conquistas
├── VideoPlayer.tsx                        # Player que retoma de onde parou
├── ui.tsx                                 # Componentes compartilhados (card, XP bar, logo)
└── curso/[slug]/
    ├── page.tsx                           # Server component do curso
    └── CoursePlayer.tsx                   # Player + lista de aulas + progresso + XP
```

### Arquivos alterados

```
src/components/Header.tsx                    # Item "Academy" no menu (desktop + mobile)
src/middleware.ts                            # /aluno registrado como rota não-localizada
src/dictionaries/pt.json                     # Tradução "academy"
src/dictionaries/es.json                     # Tradução "academy"
```

---

## 4. Modelo de dados (Supabase)

Todas as tabelas usam o prefixo `academy_`. Definidas em `academy_schema.sql`.

### Catálogo
- **`academy_courses`** — cursos: slug, título, categoria (`marketing` | `vendas` | `administracao` | `ia`),
  nível, instrutor, duração, XP de conclusão, destaque (hero), publicado.
- **`academy_modules`** — módulos dentro de um curso.
- **`academy_lessons`** — aulas: vídeo, duração, ordem, XP por aula, flag de amostra (`is_free`).

### Alunos e progresso
- **`academy_profiles`** — estende `auth.users` (nome, avatar, empresa, papel).
- **`academy_enrollments`** — matrícula do aluno no curso, `progress_pct`, última aula.
- **`academy_lesson_progress`** — **coração da retomada**: guarda `position_seconds` por aula,
  se foi concluída e a duração. É o que faz o vídeo voltar de onde parou.

### Gamificação
- **`academy_gamification`** — XP total, nível, streak atual/recorde, contadores.
- **`academy_xp_log`** — histórico de cada ganho de XP (base para ranking).
- **`academy_achievements`** — catálogo de conquistas (vem com 6 padrão).
- **`academy_user_achievements`** — conquistas desbloqueadas por aluno.

### B2B
- **`academy_companies`** — empresas: plano, assentos totais/usados. Base para o modelo corporativo.

### Funções (RPC) e trigger
- **`academy_level_from_xp(xp)`** — calcula o nível a partir do XP (curva: `√(xp/100)+1`).
- **`academy_grant_xp(user, amount, reason)`** — concede XP, recalcula nível e atualiza o streak diário.
- **`academy_complete_lesson(lesson)`** — marca a aula concluída, dá XP uma única vez, recalcula o
  progresso do curso e concede o XP de conclusão do curso.
- **`academy_save_position(lesson, position, duration)`** — salva a posição do player (sem XP).
- **`academy_enroll(course)`** — matricula o aluno logado (idempotente).
- **`academy_handle_new_user()`** + trigger `academy_on_auth_user_created` — cria perfil e
  gamificação automaticamente quando alguém se cadastra no Auth.

### Segurança (RLS)
- Catálogo (`courses`/`modules`/`lessons`/`achievements`) é **leitura pública** (só itens publicados).
- Dados pessoais (matrícula, progresso, gamificação) só são acessíveis pelo **próprio dono** (`auth.uid()`).
- Empresas: membros leem apenas a própria empresa.

---

## 5. Funcionalidades principais

### Player que retoma de onde parou (`VideoPlayer.tsx`)
- Ao carregar a aula, posiciona o vídeo na última posição salva e mostra "Retomando de X:XX".
- Salva a posição **a cada ~5–10s**, ao **pausar**, ao **trocar de aba** e ao **fechar** a página.
- Ao assistir **≥ 92%**, marca a aula como concluída automaticamente e avança para a próxima.

### Dashboard estilo Netflix (`Dashboard.tsx`)
- Topbar com XP, nível e streak em tempo real.
- Hero do curso em destaque com "Continuar" / "Começar agora".
- Fileira **"Continue de onde parou"** (cursos em andamento).
- Carrosséis por categoria: Marketing, Vendas, Administração, IA.
- Seção de **conquistas** (desbloqueadas x total).

### Gamificação
- **XP** por aula concluída e por curso concluído.
- **Níveis** com curva progressiva e barra de progresso para o próximo nível.
- **Streak** diário (🔥) com recorde.
- **Conquistas/badges** com tiers bronze/prata/ouro.
- Toda a lógica roda em funções SQL `security definer` (o cliente não consegue burlar XP).

### Autenticação (`AuthGate.tsx`)
- Login e cadastro por e-mail/senha via Supabase Auth.
- Cadastro cria perfil + gamificação automaticamente (trigger).

### Landing de vendas (`AcademyContent.tsx`)
- Bilíngue PT/ES.
- Planos B2C: mensal, anual (destaque) e degustação grátis.
- Seção **Academy for Business** (B2B) com benefícios corporativos.
- Trilhas, "como funciona", FAQ e CTAs.

---

## 6. Como colocar no ar

1. **Banco** — no SQL Editor do Supabase, rode nesta ordem:
   1. `academy_schema.sql`
   2. `academy_seed.sql`

   Para usuários já existentes no Auth (opcional):
   ```sql
   insert into public.academy_gamification (user_id)
   select id from auth.users on conflict do nothing;
   insert into public.academy_profiles (id, full_name)
   select id, email from auth.users on conflict do nothing;
   ```

2. **Variáveis de ambiente** (`.env`) — reutiliza as do site:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```

3. **Rodar**:
   ```bash
   npm install
   npm run dev
   ```
   Acesse `/academy` (landing) e `/aluno` (área do aluno).

---

## 7. Próximos passos sugeridos

- **Checkout Stripe** ligado aos planos mensal/anual (a dependência `stripe` já existe no projeto).
- **Upload de vídeos reais** para o Supabase Storage (hoje o seed usa vídeos de amostra públicos).
- **Painel B2B**: gestão de assentos, convite de colaboradores e relatório de progresso do time.
- **Certificados** de conclusão (tabela já prevista no modelo).
- **Ranking/leaderboard** público (o `academy_xp_log` já é a base).
- **Admin de cursos**: CRUD de cursos/aulas reaproveitando o editor TipTap já usado no blog.

---

*Documento gerado junto com a implementação inicial do módulo Infinity Academy.*

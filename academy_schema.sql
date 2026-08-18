-- ============================================================================
-- INFINITY ACADEMY — Esquema completo (cursos, progresso, gamificação, B2B)
-- Rode este arquivo no SQL Editor do Supabase.
-- Idempotente: pode rodar mais de uma vez com segurança.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- EMPRESAS (B2B) — planos por assentos
-- ---------------------------------------------------------------------------
create table if not exists public.academy_companies (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  cnpj         text,
  plan         text not null default 'team',        -- team | business | enterprise
  seats_total  int  not null default 5,
  seats_used   int  not null default 0,
  active       boolean not null default true,
  created_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- PERFIS — estende auth.users
-- ---------------------------------------------------------------------------
create table if not exists public.academy_profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  avatar_url  text,
  company_id  uuid references public.academy_companies(id) on delete set null,
  role        text not null default 'student',       -- student | company_admin | admin
  headline    text,                                   -- ex: "Gestor de Tráfego"
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- CATÁLOGO — cursos, módulos, aulas
-- ---------------------------------------------------------------------------
create table if not exists public.academy_courses (
  id               uuid primary key default gen_random_uuid(),
  slug             text unique not null,
  title            text not null,
  subtitle         text,
  description      text,
  category         text not null default 'marketing', -- marketing | vendas | administracao | ia
  level            text not null default 'iniciante', -- iniciante | intermediario | avancado
  thumbnail_url    text,
  cover_url        text,
  accent           text default '#00DB79',            -- cor de destaque do card
  instructor       text,
  instructor_role  text,
  duration_minutes int  default 0,
  total_lessons    int  default 0,
  xp_reward        int  default 500,                  -- XP por concluir o curso
  tags             text[] default '{}',
  is_published     boolean not null default true,
  is_featured      boolean not null default false,    -- aparece no destaque (hero)
  order_index      int not null default 0,
  created_at       timestamptz not null default now()
);

create table if not exists public.academy_modules (
  id          uuid primary key default gen_random_uuid(),
  course_id   uuid not null references public.academy_courses(id) on delete cascade,
  title       text not null,
  order_index int not null default 0
);

create table if not exists public.academy_lessons (
  id               uuid primary key default gen_random_uuid(),
  module_id        uuid references public.academy_modules(id) on delete cascade,
  course_id        uuid not null references public.academy_courses(id) on delete cascade,
  title            text not null,
  description      text,
  video_url        text,
  thumbnail_url    text,
  duration_seconds int not null default 0,
  order_index      int not null default 0,
  xp_reward        int not null default 50,           -- XP por concluir a aula
  is_free          boolean not null default false,    -- aula de amostra (preview)
  created_at       timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- MATRÍCULAS + PROGRESSO (resume: retoma de onde parou)
-- ---------------------------------------------------------------------------
create table if not exists public.academy_enrollments (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  course_id      uuid not null references public.academy_courses(id) on delete cascade,
  progress_pct   numeric(5,2) not null default 0,
  last_lesson_id uuid references public.academy_lessons(id) on delete set null,
  enrolled_at    timestamptz not null default now(),
  completed_at   timestamptz,
  unique (user_id, course_id)
);

create table if not exists public.academy_lesson_progress (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users(id) on delete cascade,
  lesson_id        uuid not null references public.academy_lessons(id) on delete cascade,
  course_id        uuid not null references public.academy_courses(id) on delete cascade,
  position_seconds int not null default 0,            -- <<< retoma daqui
  duration_seconds int not null default 0,
  completed        boolean not null default false,
  completed_at     timestamptz,
  updated_at       timestamptz not null default now(),
  unique (user_id, lesson_id)
);

-- ---------------------------------------------------------------------------
-- GAMIFICAÇÃO — XP, nível, streak, conquistas
-- ---------------------------------------------------------------------------
create table if not exists public.academy_gamification (
  user_id            uuid primary key references auth.users(id) on delete cascade,
  xp_total           int not null default 0,
  level              int not null default 1,
  current_streak     int not null default 0,
  longest_streak     int not null default 0,
  lessons_completed  int not null default 0,
  courses_completed  int not null default 0,
  last_activity_date date,
  updated_at         timestamptz not null default now()
);

create table if not exists public.academy_xp_log (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  amount     int not null,
  reason     text,
  created_at timestamptz not null default now()
);

create table if not exists public.academy_achievements (
  id          uuid primary key default gen_random_uuid(),
  code        text unique not null,
  title       text not null,
  description text,
  icon        text default '🏆',
  xp_reward   int not null default 100,
  tier        text default 'bronze'                   -- bronze | prata | ouro
);

create table if not exists public.academy_user_achievements (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  achievement_id uuid not null references public.academy_achievements(id) on delete cascade,
  unlocked_at    timestamptz not null default now(),
  unique (user_id, achievement_id)
);

-- ---------------------------------------------------------------------------
-- ÍNDICES
-- ---------------------------------------------------------------------------
create index if not exists idx_lessons_course      on public.academy_lessons(course_id);
create index if not exists idx_modules_course       on public.academy_modules(course_id);
create index if not exists idx_enroll_user          on public.academy_enrollments(user_id);
create index if not exists idx_lprog_user           on public.academy_lesson_progress(user_id);
create index if not exists idx_lprog_user_course    on public.academy_lesson_progress(user_id, course_id);
create index if not exists idx_xplog_user           on public.academy_xp_log(user_id, created_at desc);

-- ---------------------------------------------------------------------------
-- FUNÇÕES DE GAMIFICAÇÃO
-- ---------------------------------------------------------------------------

-- Nível a partir do XP: curva suave (cada nível exige mais XP)
create or replace function public.academy_level_from_xp(p_xp int)
returns int language sql immutable as $$
  select greatest(1, floor(sqrt(p_xp::numeric / 100)) + 1)::int;
$$;

-- Garante que o usuário tem linha de gamificação
create or replace function public.academy_ensure_gamification(p_user uuid)
returns void language plpgsql security definer as $$
begin
  insert into public.academy_gamification(user_id)
  values (p_user)
  on conflict (user_id) do nothing;
end;
$$;

-- Concede XP, recalcula nível e atualiza o streak diário
create or replace function public.academy_grant_xp(p_user uuid, p_amount int, p_reason text)
returns void language plpgsql security definer as $$
declare
  v_last date;
  v_new_streak int;
  v_xp int;
begin
  perform public.academy_ensure_gamification(p_user);

  select last_activity_date, current_streak
    into v_last, v_new_streak
  from public.academy_gamification where user_id = p_user;

  -- Streak: +1 se ontem, mantém se hoje, reseta se quebrou
  if v_last is null then
    v_new_streak := 1;
  elsif v_last = current_date then
    v_new_streak := greatest(v_new_streak, 1);
  elsif v_last = current_date - 1 then
    v_new_streak := v_new_streak + 1;
  else
    v_new_streak := 1;
  end if;

  update public.academy_gamification g
     set xp_total       = g.xp_total + p_amount,
         level          = public.academy_level_from_xp(g.xp_total + p_amount),
         current_streak = v_new_streak,
         longest_streak = greatest(g.longest_streak, v_new_streak),
         last_activity_date = current_date,
         updated_at     = now()
   where g.user_id = p_user
  returning xp_total into v_xp;

  insert into public.academy_xp_log(user_id, amount, reason)
  values (p_user, p_amount, p_reason);
end;
$$;

-- Marca uma aula como concluída: concede XP (uma única vez), atualiza contadores,
-- recalcula o progresso do curso e concede XP de conclusão do curso.
create or replace function public.academy_complete_lesson(p_lesson uuid)
returns void language plpgsql security definer as $$
declare
  v_user       uuid := auth.uid();
  v_course     uuid;
  v_xp         int;
  v_already    boolean;
  v_total      int;
  v_done       int;
  v_pct        numeric(5,2);
  v_course_xp  int;
  v_course_done boolean;
begin
  if v_user is null then raise exception 'not authenticated'; end if;

  select course_id, xp_reward into v_course, v_xp
  from public.academy_lessons where id = p_lesson;
  if v_course is null then raise exception 'lesson not found'; end if;

  -- Já estava concluída?
  select completed into v_already
  from public.academy_lesson_progress
  where user_id = v_user and lesson_id = p_lesson;

  insert into public.academy_lesson_progress(user_id, lesson_id, course_id, completed, completed_at, updated_at)
  values (v_user, p_lesson, v_course, true, now(), now())
  on conflict (user_id, lesson_id)
  do update set completed = true, completed_at = coalesce(academy_lesson_progress.completed_at, now()), updated_at = now();

  if v_already is distinct from true then
    perform public.academy_grant_xp(v_user, v_xp, 'lesson:' || p_lesson::text);
    update public.academy_gamification
       set lessons_completed = lessons_completed + 1
     where user_id = v_user;
  end if;

  -- Recalcula progresso do curso
  select count(*) into v_total from public.academy_lessons where course_id = v_course;
  select count(*) into v_done
    from public.academy_lesson_progress
   where user_id = v_user and course_id = v_course and completed = true;

  v_pct := case when v_total > 0 then round((v_done::numeric / v_total) * 100, 2) else 0 end;

  update public.academy_enrollments
     set progress_pct = v_pct,
         completed_at = case when v_pct >= 100 then coalesce(completed_at, now()) else null end
   where user_id = v_user and course_id = v_course;

  -- XP de conclusão do curso (uma vez)
  if v_pct >= 100 then
    select completed_at is not null, xp_reward into v_course_done, v_course_xp
    from public.academy_enrollments e
    join public.academy_courses c on c.id = e.course_id
    where e.user_id = v_user and e.course_id = v_course;

    if v_already is distinct from true then
      perform public.academy_grant_xp(v_user, coalesce(v_course_xp,0), 'course:' || v_course::text);
      update public.academy_gamification
         set courses_completed = courses_completed + 1
       where user_id = v_user;
    end if;
  end if;
end;
$$;

-- Salva a posição do player (retomar de onde parou), sem conceder XP.
create or replace function public.academy_save_position(p_lesson uuid, p_position int, p_duration int)
returns void language plpgsql security definer as $$
declare
  v_user uuid := auth.uid();
  v_course uuid;
begin
  if v_user is null then raise exception 'not authenticated'; end if;
  select course_id into v_course from public.academy_lessons where id = p_lesson;

  insert into public.academy_lesson_progress(user_id, lesson_id, course_id, position_seconds, duration_seconds, updated_at)
  values (v_user, p_lesson, v_course, p_position, p_duration, now())
  on conflict (user_id, lesson_id)
  do update set position_seconds = excluded.position_seconds,
                duration_seconds = greatest(academy_lesson_progress.duration_seconds, excluded.duration_seconds),
                updated_at = now();

  update public.academy_enrollments
     set last_lesson_id = p_lesson
   where user_id = v_user and course_id = v_course;
end;
$$;

-- Matricula o usuário logado num curso (idempotente)
create or replace function public.academy_enroll(p_course uuid)
returns void language plpgsql security definer as $$
declare v_user uuid := auth.uid();
begin
  if v_user is null then raise exception 'not authenticated'; end if;
  insert into public.academy_enrollments(user_id, course_id)
  values (v_user, p_course)
  on conflict (user_id, course_id) do nothing;
end;
$$;

-- ---------------------------------------------------------------------------
-- TRIGGER: cria perfil + gamificação ao criar usuário no Auth
-- ---------------------------------------------------------------------------
create or replace function public.academy_handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.academy_profiles(id, full_name, avatar_url)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email), new.raw_user_meta_data->>'avatar_url')
  on conflict (id) do nothing;
  insert into public.academy_gamification(user_id) values (new.id)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists academy_on_auth_user_created on auth.users;
create trigger academy_on_auth_user_created
  after insert on auth.users
  for each row execute function public.academy_handle_new_user();

-- ---------------------------------------------------------------------------
-- ROW LEVEL SECURITY
-- ---------------------------------------------------------------------------
alter table public.academy_profiles          enable row level security;
alter table public.academy_courses           enable row level security;
alter table public.academy_modules           enable row level security;
alter table public.academy_lessons           enable row level security;
alter table public.academy_enrollments       enable row level security;
alter table public.academy_lesson_progress   enable row level security;
alter table public.academy_gamification       enable row level security;
alter table public.academy_xp_log            enable row level security;
alter table public.academy_achievements       enable row level security;
alter table public.academy_user_achievements  enable row level security;
alter table public.academy_companies          enable row level security;

-- Catálogo público (apenas leitura de itens publicados)
drop policy if exists "courses read" on public.academy_courses;
create policy "courses read" on public.academy_courses for select using (is_published = true);
drop policy if exists "modules read" on public.academy_modules;
create policy "modules read" on public.academy_modules for select using (true);
drop policy if exists "lessons read" on public.academy_lessons;
create policy "lessons read" on public.academy_lessons for select using (true);
drop policy if exists "achievements read" on public.academy_achievements;
create policy "achievements read" on public.academy_achievements for select using (true);

-- Perfil: dono
drop policy if exists "profile own" on public.academy_profiles;
create policy "profile own" on public.academy_profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

-- Matrículas / progresso / gamificação: dono
drop policy if exists "enroll own" on public.academy_enrollments;
create policy "enroll own" on public.academy_enrollments
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "lprog own" on public.academy_lesson_progress;
create policy "lprog own" on public.academy_lesson_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "gam own" on public.academy_gamification;
create policy "gam own" on public.academy_gamification
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "xplog own" on public.academy_xp_log;
create policy "xplog own" on public.academy_xp_log
  for select using (auth.uid() = user_id);

drop policy if exists "uach own" on public.academy_user_achievements;
create policy "uach own" on public.academy_user_achievements
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Empresas: membros da empresa podem ler a própria empresa
drop policy if exists "company read" on public.academy_companies;
create policy "company read" on public.academy_companies
  for select using (
    id in (select company_id from public.academy_profiles where id = auth.uid())
  );

-- ---------------------------------------------------------------------------
-- CONQUISTAS PADRÃO
-- ---------------------------------------------------------------------------
insert into public.academy_achievements (code, title, description, icon, xp_reward, tier) values
  ('first_lesson',   'Primeiro Passo',       'Concluiu a primeira aula',            '🎯', 50,  'bronze'),
  ('streak_7',       'Constância',           '7 dias seguidos de estudo',           '🔥', 200, 'prata'),
  ('first_course',   'Missão Cumprida',      'Concluiu o primeiro curso',           '🏆', 300, 'prata'),
  ('marketing_pro',  'Mestre do Marketing',  'Concluiu a trilha de Marketing',      '📈', 500, 'ouro'),
  ('sales_pro',      'Mestre das Vendas',    'Concluiu a trilha de Vendas',         '💰', 500, 'ouro'),
  ('level_10',       'Elite Infinity',       'Alcançou o nível 10',                 '💎', 1000,'ouro')
on conflict (code) do nothing;

-- ============================================================================
-- FIM DO ESQUEMA — Infinity Academy
-- ============================================================================

-- ============================================================================
-- Habilitar aluno: angelo.marques@infinityondemand.com.br
-- Senha: Aa271239852@
-- Rode este script no SQL Editor do Supabase para criar/atualizar o acesso instantaneamente.
-- ============================================================================

DO $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Verificar se o usuário já existe no auth.users
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'angelo.marques@infinityondemand.com.br';

  IF v_user_id IS NULL THEN
    v_user_id := gen_random_uuid();
    INSERT INTO auth.users (
      id,
      instance_id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at
    ) VALUES (
      v_user_id,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      'angelo.marques@infinityondemand.com.br',
      crypt('Aa271239852@', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Angelo Marques"}',
      now(),
      now()
    );
  ELSE
    -- Atualizar a senha e confirmar o email caso ainda não esteja confirmado
    UPDATE auth.users
    SET encrypted_password = crypt('Aa271239852@', gen_salt('bf')),
        email_confirmed_at = coalesce(email_confirmed_at, now()),
        raw_user_meta_data = '{"full_name":"Angelo Marques"}'
    WHERE id = v_user_id;
  END IF;

  -- Garantir perfil no Academy
  INSERT INTO public.academy_profiles (id, full_name, role)
  VALUES (v_user_id, 'Angelo Marques', 'admin')
  ON CONFLICT (id) DO UPDATE SET full_name = 'Angelo Marques', role = 'admin';

  -- Garantir gamificação inicial
  INSERT INTO public.academy_gamification (user_id, xp_total, level, current_streak)
  VALUES (v_user_id, 150, 2, 1)
  ON CONFLICT (user_id) DO NOTHING;

  -- Matricular automaticamente em todos os cursos publicados da plataforma
  INSERT INTO public.academy_enrollments (user_id, course_id, progress_pct)
  SELECT v_user_id, id, 0
  FROM public.academy_courses
  ON CONFLICT (user_id, course_id) DO NOTHING;
END $$;

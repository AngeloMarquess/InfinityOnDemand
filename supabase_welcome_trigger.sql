-- ====================================================================
-- TRIGGERS E FUNÇÕES DE E-MAIL DE BOAS-VINDAS NO SUPABASE
-- Execute este script no SQL Editor do seu Dashboard do Supabase
-- ====================================================================

-- 1. Certifique-se de que a extensão pg_net está ativada (usada para requisições HTTP)
CREATE EXTENSION IF NOT EXISTS pg_net;

-- 2. Crie ou atualize a função que detecta a confirmação de e-mail e chama o webhook da Infinity
CREATE OR REPLACE FUNCTION public.handle_user_email_confirmation()
RETURNS TRIGGER AS $$
DECLARE
  should_send BOOLEAN := FALSE;
BEGIN
  -- Identifica se o usuário acabou de confirmar o e-mail (Sign Up clássico)
  -- ou se cadastrou via Google OAuth (onde o e-mail já vem confirmado na criação)
  IF TG_OP = 'INSERT' THEN
    IF NEW.email_confirmed_at IS NOT NULL THEN
      should_send := TRUE;
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL THEN
      should_send := TRUE;
    END IF;
  END IF;

  -- Se o e-mail foi confirmado, dispara a requisição HTTP POST para a API da Infinity
  IF should_send THEN
    PERFORM
      net.http_post(
        url := 'https://infinityondemand.com.br/api/crm/welcome',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer SEU_FLASH_API_SECRET_AQUI' -- Substitua pelo token de segurança (FLASH_API_SECRET)
        ),
        body := jsonb_build_object(
          'email', NEW.email,
          'name', COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
        )
      );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Remova o gatilho antigo caso exista, para evitar duplicações
DROP TRIGGER IF EXISTS on_user_email_confirmed ON auth.users;

-- 4. Associe a função ao evento de inserção e atualização na tabela de usuários do Supabase Auth
CREATE TRIGGER on_user_email_confirmed
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_user_email_confirmation();

-- ====================================================================
-- PRONTO! 
-- Toda vez que um e-mail for confirmado ou conta criada via Google,
-- a API da Infinity receberá a chamada e o Resend enviará o e-mail de
-- boas-vindas profissional com a identidade visual da Infinity.
-- ====================================================================

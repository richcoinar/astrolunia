-- ASTROLUNIA ONLY: proyecto bdhwkvlpnixfamsvjfco. BACKUP + PRECHECK PRIMERO.
-- Crea objetos astro_* y NO modifica políticas ajenas ni las tablas previas de aplicaciones existentes.
-- Si una tabla astro_* ya existe, detenerse y revisar estructura/políticas antes de ejecutar.
BEGIN;
CREATE TABLE IF NOT EXISTS public.astro_entitlements (
 user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
 plan text NOT NULL DEFAULT 'free' CHECK(plan IN ('free','premium')),
 premium_until timestamptz,
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.astro_entitlements ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.astro_entitlements FROM anon, authenticated;
GRANT SELECT ON public.astro_entitlements TO authenticated;
CREATE POLICY astro_entitlements_select_own ON public.astro_entitlements FOR SELECT TO authenticated USING (user_id = (select auth.uid()));
-- NO INSERT/UPDATE/DELETE client-side: el plan no puede ser elevado por el usuario.
CREATE TABLE IF NOT EXISTS public.astro_ai_usage (
 user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
 month_start date NOT NULL,
 requests integer NOT NULL DEFAULT 0 CHECK(requests BETWEEN 0 AND 10000),
 PRIMARY KEY (user_id,month_start)
);
ALTER TABLE public.astro_ai_usage ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.astro_ai_usage FROM anon, authenticated;
GRANT SELECT ON public.astro_ai_usage TO authenticated;
CREATE POLICY astro_ai_usage_select_own ON public.astro_ai_usage FOR SELECT TO authenticated USING(user_id = (select auth.uid()));
-- El crédito se consume de forma atómica bajo una función de privilegios elevados.
CREATE OR REPLACE FUNCTION public.astro_consume_ai_credit()
RETURNS TABLE(allowed boolean, used integer, monthly_limit integer)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE uid uuid := (select auth.uid());
DECLARE start_month date := date_trunc('month', now() at time zone 'UTC')::date;
DECLARE max_calls integer := 3;
DECLARE current_count integer;
BEGIN
 IF uid IS NULL THEN RAISE EXCEPTION 'Authentication required' USING ERRCODE='28000'; END IF;
 SELECT CASE WHEN plan='premium' AND premium_until>now() THEN 100 ELSE 3 END
  INTO max_calls FROM public.astro_entitlements WHERE user_id=uid;
 max_calls:=coalesce(max_calls,3);
 INSERT INTO public.astro_ai_usage(user_id,month_start,requests) VALUES(uid,start_month,0)
 ON CONFLICT(user_id,month_start) DO NOTHING;
 SELECT requests INTO current_count FROM public.astro_ai_usage
  WHERE user_id=uid AND month_start=start_month FOR UPDATE;
 IF current_count >= max_calls THEN
  RETURN QUERY SELECT false,current_count,max_calls; RETURN;
 END IF;
 UPDATE public.astro_ai_usage SET requests=requests+1
  WHERE user_id=uid AND month_start=start_month RETURNING requests INTO current_count;
 RETURN QUERY SELECT true,current_count,max_calls;
END; $$;
REVOKE ALL ON FUNCTION public.astro_consume_ai_credit() FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.astro_consume_ai_credit() TO authenticated;
-- Snapshot de cartas natales con permiso expreso, separado de readings v0.9.
CREATE TABLE IF NOT EXISTS public.astro_birth_charts (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
 title text NOT NULL CHECK(length(title) BETWEEN 1 AND 120),
 chart jsonb NOT NULL CHECK(jsonb_typeof(chart)='object' AND pg_column_size(chart)<=32768),
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS astro_birth_charts_user_created ON public.astro_birth_charts(user_id,created_at DESC);
ALTER TABLE public.astro_birth_charts ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.astro_birth_charts FROM anon, authenticated;
GRANT SELECT,INSERT,DELETE ON public.astro_birth_charts TO authenticated;
CREATE POLICY astro_birth_charts_select_own ON public.astro_birth_charts FOR SELECT TO authenticated USING(user_id=(select auth.uid()));
CREATE POLICY astro_birth_charts_insert_own ON public.astro_birth_charts FOR INSERT TO authenticated WITH CHECK(user_id=(select auth.uid()));
CREATE POLICY astro_birth_charts_delete_own ON public.astro_birth_charts FOR DELETE TO authenticated USING(user_id=(select auth.uid()));
-- No UPDATE y no políticas administrativas sobre datos natales privados.
COMMIT;

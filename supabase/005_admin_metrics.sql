-- Ejecutar después de 004; admins se definen exclusivamente en auth.users.raw_app_meta_data.
-- No habilita acceso a lecturas ni a cartas natales privadas.
BEGIN;
CREATE OR REPLACE FUNCTION public.astro_admin_metrics()
RETURNS TABLE(total_entitlements bigint,premium_active bigint,ai_requests_this_month bigint,charts_created bigint)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
 IF (select auth.uid()) IS NULL OR coalesce((select auth.jwt())->'app_metadata'->>'astrolunia_role','') <> 'admin' THEN
   RAISE EXCEPTION 'Forbidden' USING ERRCODE='42501';
 END IF;
 RETURN QUERY SELECT
 (SELECT count(*) FROM public.astro_entitlements),
 (SELECT count(*) FROM public.astro_entitlements WHERE plan='premium' AND premium_until>now()),
 (SELECT coalesce(sum(requests),0)::bigint FROM public.astro_ai_usage WHERE month_start=date_trunc('month',now() at time zone 'UTC')::date),
 (SELECT count(*) FROM public.astro_birth_charts);
END; $$;
REVOKE ALL ON FUNCTION public.astro_admin_metrics() FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.astro_admin_metrics() TO authenticated;
COMMIT;
-- Para designar un admin (ejecutar manualmente desde entorno privilegiado), nunca desde el cliente:
-- Actualizar raw_app_meta_data conservando todos los demás campos con jsonb concatenation.
-- No se incluye SQL ejecutable de promoción automática.

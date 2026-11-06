-- COMPROBACIÓN INICIAL · SOLO LECTURA en bdhwkvlpnixfamsvjfco
SELECT current_database(), current_user;
SELECT to_regclass('public.astro_entitlements') entitlements,
       to_regclass('public.astro_ai_usage') ai_usage,
       to_regclass('public.astro_birth_charts') charts,
       to_regprocedure('public.astro_consume_ai_credit()') credit_rpc,
       to_regprocedure('public.astro_admin_metrics()') metrics_rpc;
SELECT table_name,column_name,data_type FROM information_schema.columns
 WHERE table_schema='public' AND table_name LIKE 'astro_%' ORDER BY table_name,ordinal_position;

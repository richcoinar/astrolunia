-- SOLO LECTURA: ejecutar tras aplicar 004 y 005.
SELECT c.relname,c.relrowsecurity,c.relforcerowsecurity
FROM pg_class c JOIN pg_namespace n ON c.relnamespace=n.oid
WHERE n.nspname='public' AND c.relname IN('astro_readings','astro_entitlements','astro_ai_usage','astro_birth_charts');
SELECT tablename,policyname,cmd,roles,qual,with_check FROM pg_policies
WHERE schemaname='public' AND tablename LIKE 'astro_%' ORDER BY tablename,policyname;
SELECT routine_name,security_type FROM information_schema.routines
WHERE routine_schema='public' AND routine_name IN('astro_consume_ai_credit','astro_admin_metrics');
SELECT grantee,table_name,privilege_type FROM information_schema.role_table_grants
WHERE table_schema='public' AND table_name IN('astro_entitlements','astro_ai_usage','astro_birth_charts')
AND grantee IN('anon','authenticated') ORDER BY table_name,grantee;

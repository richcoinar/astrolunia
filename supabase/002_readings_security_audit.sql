-- ASTROLUNIA v0.9: AUDITORÍA SIN CAMBIOS. Ejecutar DESPUÉS de 001 en SQL Editor.
-- Este SQL no puede verificar el ID de proyecto: controlarlo visualmente en el dashboard.
select 'astro_readings' as object, to_regclass('public.astro_readings') is not null as exists;
select relrowsecurity as rls_enabled, relforcerowsecurity as force_rls
from pg_class where oid = to_regclass('public.astro_readings');
select policyname, permissive, roles, cmd, qual, with_check
from pg_policies where schemaname='public' and tablename='astro_readings' order by policyname;
select grantee, privilege_type from information_schema.role_table_grants
where table_schema='public' and table_name='astro_readings'
  and grantee in ('anon','authenticated','PUBLIC') order by grantee,privilege_type;
-- ESPERADO: RLS=true; exactamente 3 políticas _own para SELECT/INSERT/DELETE;
-- anon no tiene privilegios; authenticated tiene SELECT/INSERT/DELETE y NO UPDATE.
-- Si hay políticas adicionales o privilegios inesperados, detener la habilitación pública.

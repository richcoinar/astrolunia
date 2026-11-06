-- Solo lectura. Ejecutar en SQL Editor del proyecto bdhwkvlpnixfamsvjfco.
-- Verificar visualmente el ID de proyecto en el navegador antes de ejecutar.
select current_database() as database_name, current_user as sql_user;
select table_schema,table_name from information_schema.tables
 where table_schema='public' and table_name like 'astro_%' order by table_name;
select column_name, data_type, is_nullable from information_schema.columns
 where table_schema='public' and table_name='astro_readings' order by ordinal_position;
select policyname,cmd,roles,qual,with_check from pg_policies
 where schemaname='public' and tablename='astro_readings';
select relname,relrowsecurity,relforcerowsecurity from pg_class
 where oid=to_regclass('public.astro_readings');
-- No devuelve filas de usuarios ni contenidos privados.

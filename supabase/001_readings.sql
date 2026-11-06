-- Ejecutar SOLO en el proyecto existente bdhwkvlpnixfamsvjfco de Astro.
-- Hacer copia de seguridad e inspeccionar conflictos antes de aplicarlo.
-- No borra ni modifica tablas existentes fuera de public.astro_readings.
-- Cada consulta pertenece al usuario autenticado; anon no tiene acceso.
create extension if not exists pgcrypto;
create table if not exists public.astro_readings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('tarot', 'numerology')),
  title text not null check (char_length(title) between 1 and 120),
  payload jsonb not null check (jsonb_typeof(payload) = 'object' and pg_column_size(payload) <= 16384),
  created_at timestamptz not null default now()
);
create index if not exists astro_readings_user_date_idx on public.astro_readings(user_id, created_at desc);
alter table public.astro_readings enable row level security;
revoke all on table public.astro_readings from anon;
grant select, insert, delete on table public.astro_readings to authenticated;
do $$ begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'astro_readings' and policyname = 'astro_readings_select_own') then
    create policy "astro_readings_select_own" on public.astro_readings for select to authenticated
      using ((select auth.uid()) = user_id);
  end if;
end $$;
do $$ begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'astro_readings' and policyname = 'astro_readings_insert_own') then
    create policy "astro_readings_insert_own" on public.astro_readings for insert to authenticated
      with check ((select auth.uid()) = user_id);
  end if;
end $$;
do $$ begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'astro_readings' and policyname = 'astro_readings_delete_own') then
    create policy "astro_readings_delete_own" on public.astro_readings for delete to authenticated
      using ((select auth.uid()) = user_id);
  end if;
end $$;
-- Sin política UPDATE: las consultas guardadas son inmutables.
-- NO ejecutar en ningún otro proyecto. Si astro_readings ya existe con otra estructura, detenerse y revisar manualmente.

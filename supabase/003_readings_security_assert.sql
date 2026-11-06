-- ASTROLUNIA v0.9: aserciones de seguridad SOLO LECTURA sobre astro_readings.
-- Ejecutar en SQL Editor del proyecto bdhwkvlpnixfamsvjfco tras 001.
DO $$
DECLARE actual_policies int;
BEGIN
  IF to_regclass('public.astro_readings') IS NULL THEN RAISE EXCEPTION 'Falta public.astro_readings'; END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_class WHERE oid = 'public.astro_readings'::regclass AND relrowsecurity) THEN
    RAISE EXCEPTION 'RLS deshabilitado';
  END IF;
  SELECT count(*) INTO actual_policies FROM pg_policies WHERE schemaname='public' AND tablename='astro_readings';
  IF actual_policies <> 3 THEN RAISE EXCEPTION 'Se esperaban 3 políticas; encontradas %', actual_policies; END IF;
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='astro_readings'
    AND (policyname NOT IN ('astro_readings_select_own','astro_readings_insert_own','astro_readings_delete_own')
      OR permissive <> 'PERMISSIVE' OR roles <> ARRAY['authenticated']::name[]
      OR cmd NOT IN ('SELECT','INSERT','DELETE')
      OR coalesce(qual,'') LIKE '%true%' OR coalesce(with_check,'') LIKE '%true%')
  ) THEN RAISE EXCEPTION 'Políticas distintas a las esperadas: revisar manualmente'; END IF;
  IF has_table_privilege('anon','public.astro_readings','SELECT')
    OR has_table_privilege('anon','public.astro_readings','INSERT')
    OR has_table_privilege('anon','public.astro_readings','DELETE')
    OR has_table_privilege('authenticated','public.astro_readings','UPDATE') THEN
      RAISE EXCEPTION 'Privilegios no permitidos detectados';
  END IF;
  RAISE NOTICE 'Auditoría estructural básica aprobada. AÚN DEBEN probarse dos usuarios reales y accesos cruzados.';
END $$;

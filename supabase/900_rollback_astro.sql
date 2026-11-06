-- ROLLBACK de Astrolunia en bdhwkvlpnixfamsvjfco (proyecto compartido con Publicalo Gratis).
-- Elimina SOLO los objetos creados por 001, 004 y 005. No toca ninguna otra tabla.
-- ATENCIÓN: borra los datos guardados en estas tablas (lecturas, cartas, cuotas, planes).
BEGIN;
DROP FUNCTION IF EXISTS public.astro_admin_metrics();
DROP FUNCTION IF EXISTS public.astro_consume_ai_credit();
DROP TABLE IF EXISTS public.astro_birth_charts;
DROP TABLE IF EXISTS public.astro_ai_usage;
DROP TABLE IF EXISTS public.astro_entitlements;
DROP TABLE IF EXISTS public.astro_readings;
COMMIT;
-- pgcrypto se deja instalado: ya existía antes de las migraciones.

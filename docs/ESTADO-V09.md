# Astrolunia v0.9 — Estado verificado

## Integrado en código

- Cliente Supabase exclusivo de `https://bdhwkvlpnixfamsvjfco.supabase.co` con clave `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
- Inicio de sesión con correo y contraseña, recuperación y cambio de contraseña por Supabase Auth.
- Registro de usuarios públicos deshabilitado inicialmente (`NEXT_PUBLIC_ENABLE_REGISTRATION=false`).
- Persistencia voluntaria de lecturas de Tarot y numerología en `public.astro_readings`, con validación de formato y tamaño.
- Historial limitado a las 30 lecturas más recientes, exportación paginada en JSON, eliminación individual.
- Filtro explícito por `user_id` en operaciones del cliente, más políticas SQL RLS para SELECT, INSERT y DELETE.
- Dos scripts SQL de auditoría de solo lectura y una migración inicial para crear la tabla aislada `astro_readings`.

## Comprobado en entorno local

- `npm run test` (12 pruebas automáticas: 7 anteriores + 5 de persistencia con simulaciones, sin acceso real a Supabase).
- `npm run verify:config` y `npm run verify:brand`.

## Pendiente: NO confirmado en servicios externos

- `npm install`, `npm run lint`, `npm run build` y E2E reales (las dependencias no pudieron instalarse en el entorno de construcción).
- No se ha aplicado ninguna migración a la base de datos real.
- No se ha probado Supabase Auth con dos usuarios reales ni la denegación cruzada efectiva por RLS.
- No se ha publicado código en GitHub, ni desplegado en Vercel, ni cambiado DNS de Cloudflare.
- Política legal definitiva y eliminación total de cuenta requieren implementación y revisión antes de habilitar el registro público.

## Activación controlada en Supabase

1. Abrir el proyecto correcto `bdhwkvlpnixfamsvjfco` en Supabase y efectuar backup.
2. Ejecutar `supabase/000_preflight_readonly.sql`. Si hay colisión con `public.astro_readings`, detenerse y revisar estructura y políticas.
3. Ejecutar `supabase/001_readings.sql` en **SQL Editor**. Este SQL no toca datos de otros productos.
4. Ejecutar `supabase/002_readings_security_audit.sql` y luego `supabase/003_readings_security_assert.sql`; revisar todo resultado.
5. Desde Authentication, configurar `Site URL` con `https://astrolunia.publicalogratis.store` y redirect URLs autorizadas; probar recuperación desde un despliegue HTTPS.
6. Crear manualmente **dos usuarios de prueba** en Supabase Auth, iniciar sesión como usuario A y B, comprobar que cada uno solo puede consultar, borrar y exportar sus registros y que no puede insertarlos con el `user_id` ajeno. No usar `service_role` porque omite RLS.
7. Configurar solo las variables `NEXT_PUBLIC_...` en Vercel (clave PUBLISHABLE, jamás secret/service_role). Volver a desplegar.
8. Mantener `NEXT_PUBLIC_ENABLE_REGISTRATION=false` mientras no exista mecanismo probado de borrado de cuenta y documentos legales definitivos.

**Importante:** el SQL de auditoría estructural no equivale a una prueba E2E de aislamiento RLS; esas pruebas requieren sesiones autenticadas reales.

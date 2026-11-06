# Cuentas y consultas privadas — Etapa 0.3

1. Abrir el proyecto EXISTENTE `bdhwkvlpnixfamsvjfco` en https://supabase.com/dashboard. Verificar que los objetos `astro_*` no colisionen con tablas ya existentes; no borrar nada.
2. Supabase → SQL Editor → ejecutar `supabase/001_readings.sql`. Verificar que RLS esté activado.
3. Supabase → Authentication → Providers → Email: habilitar Email y **confirmación por correo** para registros públicos. Configurar SMTP propio antes de lanzar públicamente.
4. Authentication → URL Configuration: en local usar `http://localhost:3000` como Site URL; agregar `http://localhost:3000/**` en Redirect URLs, y el dominio final `https://astrolunia.publicalogratis.store/**` cuando se publique. No usar comodines amplios de producción.
5. Copiar `.env.example` como `.env.local`, configurar `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (publishable, NO secret/service_role).
6. Reiniciar `npm run dev`. Visitar `#cuenta`, registrarse, confirmar correo e ingresar.
7. Generar una tirada, marcar consentimiento y guardar. Cerrar sesión, iniciar de nuevo y revisar historial.
8. Probar aislamiento: cuenta A no debe poder leer ni borrar consultas de cuenta B (RLS). No considerar producción sin esta prueba real.

**Privacidad**: los cálculos siguen siendo locales hasta que la persona marca consentimiento y pulsa Guardar. Al guardar numerología, nombre y fecha de nacimiento pasan a la tabla privada. Este prototipo permite borrar consultas individuales, pero antes del lanzamiento público deben existir política de privacidad, retención definida, mecanismo de exportación y eliminación integral de cuenta/datos, prevención de abuso y UX de recuperación de contraseña.

**Notas técnicas**: se usa el SDK en cliente sin rutas administrativas, con políticas de RLS. No se utiliza service role. No se implementó SSR autenticado, gestión de pagos ni permisos administrativos. La app funciona sin Supabase, deshabilitando el panel de cuentas cuando faltan las variables.

# Astrolunia v0.8 — estado comprobable

## Incluido en el código
- Nombre, dominio y configuración de Supabase conservados.
- Rutas `/privacidad` y `/terminos`, con avisos provisionales de desarrollo.
- Pie de página con enlaces y versión 0.8.
- Documentación de despliegue revisada para usar **astrolunia** y no `astro`.

## No confirmado ni ejecutado
- No se crearon repositorios, proyectos de Vercel ni registros DNS.
- No se ejecutó SQL sobre Supabase; las migraciones requieren revisión previa.
- No se certificó eliminación integral de cuentas ni cumplimiento jurídico.
- No se integraron IA, motor astronómico completo ni pagos.

## Orden de puesta en marcha
1. `npm install`, `npm run check`, `npm run dev`.
2. Inspeccionar `supabase/000_preflight_readonly.sql` en el proyecto autorizado.
3. Revisar migración `001_readings.sql` antes de ejecutarla manualmente.
4. Configurar clave pública en Vercel, sin exponer claves privilegiadas.
5. Mantener registro deshabilitado hasta completar privacidad, borrado y pruebas de RLS.
6. Crear repo `richcoinar/astrolunia`, desplegar Vercel y añadir solo CNAME `astrolunia` en Cloudflare según destino que indique Vercel.

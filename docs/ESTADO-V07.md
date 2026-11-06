# Astrolunia v0.7 — Estado de implementación

## Cambios locales realizados
- Marca ASTROLUNIA en interfaz, metadatos, PWA y pantalla sin conexión.
- Dominio previsto: `https://astrolunia.publicalogratis.store`.
- Repositorio privado propuesto: `https://github.com/richcoinar/astrolunia`.
- Supabase existente: `https://bdhwkvlpnixfamsvjfco.supabase.co`.
- Comprobación automatizada de marca y dominio `npm run verify:brand`.

## No realizados
- Ningún repositorio remoto creado, commit publicado ni conexión externa autorizada.
- Ninguna migración ejecutada en Supabase.
- Ningún despliegue en Vercel ni edición DNS en Cloudflare.
- Sin certificación de autenticación, carta natal completa ni facturación.

## Seguridad
La publicación exige revisar RLS, políticas de privacidad, recuperación de cuenta y borrado integral. Mantener `NEXT_PUBLIC_ENABLE_REGISTRATION=false` hasta finalizar verificaciones.

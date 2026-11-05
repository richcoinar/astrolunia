# Publicación segura: astro.publicalogratis.store

## Regla principal
No tocar registros existentes de `@`, `www`, MX, SPF, DKIM, DMARC, ni cambiar nameservers, Workers o reglas globales.

## Preparación
1. Verificar Node.js 20.9+ y correr `npm ci` (si existe package-lock) o `npm install`.
2. Correr `npm run check` y abrir `http://localhost:3000` con `npm run dev`.
3. Crear repositorio PRIVADO `publicalogratis-astro-pwa`; no subir archivos `.env`.
4. Importar el repositorio en un NUEVO proyecto de Vercel. Probar el dominio provisional `*.vercel.app`.

## Conexión de dominio
5. Vercel → Proyecto Astro → Settings → Domains → Add → `astro.publicalogratis.store`.
6. Obtener el CNAME exacto mostrado por Vercel. Si solicita TXT de validación, tomar también sus datos exactos.
7. Cloudflare → publicalogratis.store → DNS → Records. Hacer copia/exportación de zona y confirmar ausencia de registros existentes para `astro`.
8. Agregar registro CNAME: **Name** `astro`; **Target** destino específico de Vercel; **Proxy** `DNS only` (nube gris); **TTL** `Auto`. Agregar TXT únicamente si Vercel lo solicita.
9. Esperar confirmación de DNS y certificado SSL en Vercel.

## Validación
- `nslookup -type=CNAME astro.publicalogratis.store 1.1.1.1`
- `curl.exe -I https://astro.publicalogratis.store`
- Probar raíz `publicalogratis.store`, `www` y correo con una cuenta real.
- Probar PWA desde Chrome/Edge y Safari en iOS: manifiesto, instalación y pantalla offline.
- Confirmar que no hay secretos visibles en el frontend.

## Reversión
Eliminar **solo** el nuevo CNAME de `astro` y TXT de validación opcional si no es usado por otra aplicación. No tocar otros registros.

## Antes de lanzamiento público
- Quitar `robots.noindex` únicamente después de revisar legal, contenido, SEO, seguridad y calidad.
- Agregar textos jurídicos definitivos y políticas de privacidad con profesional competente.
- Integrar Supabase Auth y RLS; no incorporar datos de nacimiento a una cuenta sin consentimiento y política definida.
- Integrar motor astronómico **con licencia comercial apropiada**; no mostrar carta natal inventada.
- Configurar dominios, facturación y entorno productivo de API con límites por usuario.

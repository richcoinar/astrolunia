# Integración GitHub + Supabase + Vercel + Cloudflare

## Identificadores acordados
- GitHub OWNER: `richcoinar`
- Repositorio privado propuesto: `astrolunia`
- Git remoto: `https://github.com/richcoinar/astrolunia.git`
- Supabase existente: `https://bdhwkvlpnixfamsvjfco.supabase.co`
- Dominio público futuro: `https://astrolunia.publicalogratis.store`

**Estado:** código local preparado. No implica que el repositorio exista o que se hayan modificado los servicios externos.

## 1. Validación local en Windows
Extraer ZIP en `E:\Server\astrolunia` y ejecutar en PowerShell:

```powershell
cd E:\Server\astrolunia
Copy-Item .env.example .env.local
# Completar NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY en .env.local
npm install
npm run check
npm run dev
```

## 2. Supabase (sin borrar nada existente)
1. Abrir el proyecto `bdhwkvlpnixfamsvjfco` en Supabase Dashboard.
2. Revisar si ya existe `public.astro_readings`. Si existe, comparar estructura y políticas; NO ejecutar una migración incompatible.
3. Si no existe, realizar backup cuando corresponda y ejecutar `supabase/001_readings.sql` desde SQL Editor en este proyecto.
4. Habilitar proveedor Email con confirmación, configurar SMTP, Auth → URL Configuration con `http://localhost:3000/**` para pruebas y `https://astrolunia.publicalogratis.store/**` para producción.
5. Buscar la clave **publishable** en Project Settings → API Keys y copiarla en `.env.local`, nunca compartir service_role/secret.
6. Probar dos cuentas diferentes y comprobar RLS, eliminación, y verificación de email. Sin esa prueba no habilitar cuentas en producción.

## 3. GitHub
Crear repositorio **privado** `astrolunia` en la cuenta `richcoinar`, sin inicializarlo con README ni .gitignore remoto.

```powershell
git init
git add .
git commit -m "feat: Astrolunia PWA 0.5 Supabase y preparación de despliegue"
git branch -M main
git remote add origin https://github.com/richcoinar/astrolunia.git
git push -u origin main
```

`git add .` ignora `.env.local` por `.gitignore`. Comprobar con `git status` antes de subir.

## 4. Vercel
1. Importar el repositorio `richcoinar/astrolunia` como proyecto nuevo en Vercel. Next.js / Root Directory `./`.
2. En Environment Variables agregar:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://bdhwkvlpnixfamsvjfco.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` = clave publishable de Supabase.
3. Configurar esos valores para Preview y Production según corresponda. No añadir claves de rol de servicio al navegador.
4. Desplegar y comprobar que la URL provisional de Vercel funciona.
5. En Settings → Domains añadir `astrolunia.publicalogratis.store`; anotar el valor CNAME **exacto** que Vercel indique.

## 5. Cloudflare (último paso)
1. Exportar DNS y verificar que no exista `astro` en uso.
2. Agregar SOLO: CNAME `astro` → destino indicado por Vercel, `DNS only`, TTL `Auto`.
3. Si Vercel requiere TXT de propiedad, añadir SOLO el TXT solicitado.
4. No modificar `@`, `www`, MX, SPF, DKIM, DMARC, NS, Workers ni reglas globales.
5. Confirmar `nslookup -type=CNAME astrolunia.publicalogratis.store 1.1.1.1`, HTTPS y funcionamiento del sitio principal.

## Seguridad y salida a producción
- `robots.noindex` permanece activo; retirar tras validar política de privacidad, exportación/borrado de cuenta, recuperación de contraseña, seguridad y SEO.
- El motor astronómico todavía NO está implementado: la pantalla natal solo normaliza tiempo a UTC.
- Las variables públicas se integran en el bundle del navegador; nunca colocar secretos en `NEXT_PUBLIC_`.
- Si falla DNS, revertir únicamente el CNAME nuevo para `astrolunia`, sin afectar al dominio principal.

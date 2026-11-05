# Astro — PWA (starter)

Proyecto **independiente** para el futuro subdominio `astro.publicalogratis.store`. No toca el sitio principal ni Cloudflare.

## Estado de esta primera entrega
- ✅ Next.js App Router + TypeScript, portada responsive, diseño oscuro/dorado.
- ✅ Tarot: tirada local aleatoria de 3 cartas de los **22 arcanos mayores**, con significados originales breves. No incluye mazo completo ni IA.
- ✅ Numerología pitagórica simbólica: camino de vida y expresión; cálculos locales en navegador, sin almacenamiento ni transmisión de datos personales.
- ✅ Manifiesto PWA, iconos propios, service worker simple y pantalla offline **para navegaciones sin conectividad**.
- ⏳ Carta astral **no implementada**: requiere motor astronómico con licencia válida, coordenadas geográficas y base de zonas horarias histórica.
- ⏳ Supabase, cuentas, OpenAI, Mercado Pago, push y sistema premium **no implementados**.
- ⏳ Pendiente de pruebas reales de instalación, accesibilidad, seguridad, SEO y rendimiento.
- SEO con `noindex` intencional durante etapa inicial: quitar solo cuando estén listas las secciones y páginas legales.

## Requisitos
- Node.js 20.9+ (recomendado versión LTS compatible con Next.js 16)
- npm

## Desarrollo local (PowerShell)
```powershell
cd E:\Server
# Descomprimir ZIP aquí y abrir la carpeta
cd publicalogratis-astro-pwa
npm install
npm run dev
```
Abrí `http://localhost:3000`. Para probar build:
```powershell
npm run build
npm run start
```

## GitHub
Creá un repositorio **privado** llamado `publicalogratis-astro-pwa`. En la carpeta:
```powershell
git init
git add .
git commit -m "Inicializar PWA Astro"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/publicalogratis-astro-pwa.git
git push -u origin main
```
No subas `.env` ni secretos.

## Vercel
1. Vercel → Add New → Project → importar el repo privado.
2. Comprobar que el deploy provisional `.vercel.app` funciona.
3. Settings → Domains → agregar **solo** `astro.publicalogratis.store`.
4. Copiar **exactamente** el CNAME que te muestre Vercel (no usar uno supuesto).

## Cloudflare: intervención mínima
1. Hacer copia de seguridad/exportación de los DNS existentes.
2. Confirmar que `astro` no tenga registros A/AAAA/CNAME/NS previos, ni reglas especiales.
3. DNS → Records → Add: Type `CNAME`, Name `astro`, Target **destino mostrado por Vercel**, Proxy status `DNS only` (gris), TTL `Auto`.
4. No cambiar `@`, `www`, MX, SPF, DKIM, DMARC, nameservers, reglas globales ni Workers.
5. Verificar DNS: `nslookup -type=CNAME astro.publicalogratis.store 1.1.1.1`.
6. Verificar SSL y respuesta: `curl.exe -I https://astro.publicalogratis.store` y revisar Vercel → Domains.
7. Verificar sitio raíz, `www`, correo y nuevo subdominio.
8. Si falla y el registro CNAME fue el único cambio, eliminar **solo ese CNAME nuevo** para revertir el DNS de Astro.

## Seguridad y calidad pendientes antes de la publicación pública
- API: claves privadas solo del lado servidor; cuotas, auditoría y rate limiting.
- Supabase: proyecto separado, políticas RLS y autenticación.
- Asegurar privacidad y consentimiento para datos de nacimiento; avisos legales para Argentina.
- Tarot: ilustraciones con licencias; numerología: evitar afirmaciones científicas.
- Carta astral: validar licencias del motor (por ejemplo Swiss Ephemeris), efemérides y tiempo local histórico.
- Service worker: solo offline fallback inicial; para PWA completa agregar estrategia de caché, actualizaciones, testing y compatibilidad iOS.
- Desbloquear `robots.index` solo cuando la plataforma esté lista.

Referencias: https://vercel.com/docs/domains/set-up-custom-domain y https://developers.cloudflare.com/dns/

## Versión 0.2 — Segunda entrega
- ✅ Tarot extendido a **78 cartas** (22 mayores y 56 menores), tiradas de 1, 3 y 5 cartas sin repetir carta. Los significados de los arcanos menores son interpretaciones generales originales: pueden ampliarse editorialmente.
- ✅ Numerología: camino de vida, expresión, impulso del alma, personalidad y año personal. Acentos normalizados y fechas validadas.
- ✅ Pruebas automatizadas del motor de Tarot y Numerología mediante `npm run test`.
- ✅ Foco visible al teclado y soporte de movimiento reducido.
- ✅ Guía adicional: `docs/DEPLOY-SEGURO.md`.
- ⚠️ Sin API de IA ni Supabase; no guarda nombres ni fechas. La carta astral continua pendiente de un motor astronómico real.

Comandos de validación:
```powershell
npm install
npm run test
npm run lint
npm run build
```

## Versión 0.3 — Cuentas opcionales y guardado con consentimiento
- ✅ Panel de registro/inicio/cierre de sesión con Supabase Auth, cuando se configura un proyecto nuevo.
- ✅ Guardado opcional de tiradas y numerología: exige consentimiento explícito para cada consulta.
- ✅ Historial privado y eliminación individual protegidos por RLS de Supabase.
- ✅ Sin cuentas configuradas, Tarot y numerología siguen funcionando localmente.
- ⚠️ No se ha conectado a una instancia real de Supabase ni se ha probado el flujo completo por falta de credenciales; ver `docs/SUPABASE-CUENTAS.md`.
- ⚠️ Antes de lanzar públicamente falta completar eliminación de cuenta, privacidad, recuperación de contraseña, pruebas de aislamiento y controles de abuso.
- ⚠️ No habilitar almacenamiento personal en producción antes de implementar esas políticas y procedimientos.

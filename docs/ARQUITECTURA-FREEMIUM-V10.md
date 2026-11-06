# ASTROLUNIA v1.0-alpha — arquitectura Freemium

**Objetivo único:** Supabase project `bdhwkvlpnixfamsvjfco`; GitHub `richcoinar` (repositorio sugerido `astrolunia`); subdominio `astrolunia.publicalogratis.store` administrado en Cloudflare.

## Alcance implementado en código

1. **Carta natal:** biblioteca `astronomy-engine` para posiciones geocéntricas tropicales de los diez cuerpos seleccionados; cálculo aproximado de ascendente (oblicuidad media); casas iguales y detección de aspectos; rueda ilustrativa SVG. Fecha/hora locales normalizadas a UTC mediante `birth-time.ts`. Coordenadas manuales. Precisión y método se deben contrastar antes del lanzamiento comercial (especialmente épocas históricas, latitudes extremas y horas cercanas a DST). No se incluye geocodificación ni sistema Placidus.
2. **Horóscopos:** calculados en navegador para el signo elegido, con posiciones de Sol y Luna al mediodía UTC y textos simbólicos deterministas. **No son horóscopos nacidos de la carta personal**; eso queda para una etapa posterior.
3. **IA:** `POST /api/ai` verifica el JWT con Supabase Auth, valida y limita el mensaje, consume un crédito mediante RPC SQL transaccional y consulta la API de OpenAI con clave **solo del servidor**. `ASTROLUNIA_AI_ENABLED=false` por defecto. No persiste mensajes; el proveedor recibe únicamente la pregunta ingresada. Requiere auditoría de costes, límites por IP/usuario, abuse monitoring y política de privacidad antes de habilitarlo al público. El crédito se consume antes de consultar el proveedor y **no se reintegra si falla** (limitación conocida).
4. **Administración:** métrica agregada (cuentas con entitlement, planes premium activos, consumo mensual de IA y cartas guardadas), desde función SQL con `SECURITY DEFINER` y control del claim `app_metadata.astrolunia_role=admin`. No se ofrecen datos natales ni contenido de tiradas de otros usuarios.
5. **Freemium:** por defecto 3 consultas IA/mes gratis y 100 Premium; asignación de plan exclusivamente por servicio privilegiado, **no** desde el cliente. Los cupos de cartas están definidos como propuesta en frontend (`entitlements.ts`), **todavía NO se aplican en el servidor**; el guardado de cartas exige login y consentimiento y sus RLS limitan el acceso al propietario.

## Datos y límites de confianza

```
Navegador / Next.js client
   ├── Tarot + numerología v0.9 (sin API externa)
   ├── Natal (astronomy-engine, cálculo local)
   ├── Horóscopo (astronomy-engine, cálculo local)
   └── Supabase publishable key -> Auth / PostgREST con RLS
            ├── astro_readings (v0.9)
            ├── astro_birth_charts (usuario propietario)
            ├── astro_entitlements (lectura propia; escrituras privadas)
            └── astro_ai_usage (lectura propia; incrementos solo RPC)

Next.js /api/ai (servidor, sin service_role)
   ├── Supabase getUser(jwt) -> consulta de sesión real
   ├── RPC astro_consume_ai_credit (auth.uid validado)
   └── OpenAI Responses API (OPENAI_API_KEY servidor)

Admin -> RPC astro_admin_metrics (claim app_metadata de JWT)
```

## Secuencia de despliegue (NO aplicado automáticamente)

1. Realizar respaldo de proyecto Supabase y revisar `supabase/000_preflight_readonly.sql`, `supabase/002_readings_security_audit.sql` y `supabase/006_security_audit.sql`.
2. Confirmar que ningún objeto nuevo existe con otro esquema (`astro_entitlements`, `astro_ai_usage`, `astro_birth_charts`, `astro_consume_ai_credit`, `astro_admin_metrics`). `CREATE TABLE IF NOT EXISTS` **no valida** la estructura preexistente.
3. Verificar que `001_readings.sql` de v0.9 se aplicó y sus policies fueron auditadas. Ejecutar **una sola vez**, tras inspección y respaldo: `004_freemium_core.sql` y luego `005_admin_metrics.sql` desde el editor SQL del **proyecto correcto**.
4. Ejecutar `006_security_audit.sql` de solo lectura. Verificar que anon NO tiene permisos y que authenticated no puede alterar `plan`, `requests` ni role. Realizar pruebas de cruce con dos sesiones reales: usuario A no puede leer/borrar/insertar como B en `astro_birth_charts`; ni leer `astro_ai_usage` o `astro_entitlements` de B; anónimo no puede acceder; admin RPC denegada a A/B.
5. En `.env.local` o variables de Vercel configurar URL, publishable key, `NEXT_PUBLIC_SITE_ORIGIN`, `NEXT_PUBLIC_ENABLE_REGISTRATION=false`. **Nunca** subir `.env.local` al repositorio.
6. `npm install`, `npm run check` en máquina con npm accesible; pruebas de integración en entorno de preproducción. Configurar una cuenta admin en `auth.users.raw_app_meta_data` mediante una acción privilegiada del administrador de Supabase; NO sobreescribir otros atributos. Volver a iniciar sesión para actualizar JWT.
7. Solo después de auditar cuotas, costos y política de datos: `OPENAI_API_KEY` (servidor), `OPENAI_MODEL`, `ASTROLUNIA_AI_ENABLED=true` para una prueba privada. **No** activar público antes de prueba de abuso y presupuestos.
8. Publicar en Vercel, conectar `astrolunia.publicalogratis.store` vía CNAME de Cloudflare, sin editar DNS raíz/`www` de `publicalogratis.store`.

## Pendientes imprescindibles para producción

- Instalación real de dependencias, `next build`, ESLint, TypeScript y pruebas de efemérides contrastadas con fuente independiente.
- Roles administrativos y proceso seguro para conceder o revocar Premium; panel operativo más amplio.
- Restricción a nivel servidor para límite de cartas por plan, pagos, facturación y conciliación (no hay Mercado Pago integrado).
- Rate limiting externo adicional, monitoreo de coste IA, reintentos/reembolso de créditos en fallas del proveedor, defensa anti-abuso.
- Geocodificación con fuentes verificadas, precisión de husos históricos, diseño de rueda con casas y aspectos reales, horóscopo natal individual.
- Consentimiento explícito con registro/auditoría, exportación y borrado de todos los datos, cuenta y retención; revisión legal y avisos.
- Pruebas de accesibilidad, móviles, PWA offline, política de seguridad HTTP, logging sin datos sensibles y recuperación de desastres.

**Estado:** entrega alpha, no certificada ni desplegada en servicios externos. La v0.9 permanece como base estable anterior.

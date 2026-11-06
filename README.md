# ASTROLUNIA v1.0-alpha — PWA Freemium

Proyecto Next.js 16 + React 19 + TypeScript. Base heredada de v0.9, ampliada con carta natal astronómica, horóscopo diario, asistente IA con cuota y métricas administrativas.

**Proyecto de datos autorizado:** `https://bdhwkvlpnixfamsvjfco.supabase.co`.
**Despliegue previsto:** `astrolunia.publicalogratis.store` / GitHub `richcoinar/astrolunia`.

## Inicio local

```bash
cp .env.example .env.local
npm install
npm run dev
```

Completar la clave publishable de Supabase. Ninguna clave secreta debe tener prefijo `NEXT_PUBLIC_`. Revisar primero `docs/ARQUITECTURA-FREEMIUM-V10.md` y SQL `supabase/004_preflight_readonly.sql` antes de ejecutar migraciones.

## Pruebas

```bash
npm run test
npm run verify:config
npm run verify:brand
npm run check  # requiere dependencias npm; incluye lint y build
```

El registro sigue deshabilitado por defecto. IA deshabilitada por defecto. Este ZIP **no despliega ni modifica** el proyecto remoto por sí mismo. La UI natal y horóscopos requiere la nueva dependencia `astronomy-engine` para compilar.

## Alcance y limitaciones

- Lecturas de tarot/numerología y protección de cuenta de v0.9 preservadas.
- Nuevos módulos de natal, horóscopo, IA y dashboard incluidos en la página principal.
- Guardar carta natal requiere consentimiento expreso y sesión; RLS SQL exige propietario.
- La carta natal usa *casas iguales simplificadas*, no Placidus; la rueda es una visualización esquemática.
- La IA usa cuotas de 3/100 solicitudes mensuales según plan; pagos Premium y limitación de guardado de cartas por plan **aún no están implementados en servidor**.
- Horóscopo por signo y fecha UTC, no según carta natal del usuario.
- Cálculos astronómicos verificables; interpretaciones simbólicas, sin validez predictiva científica.

Leer [arquitectura y plan de despliegue](docs/ARQUITECTURA-FREEMIUM-V10.md).

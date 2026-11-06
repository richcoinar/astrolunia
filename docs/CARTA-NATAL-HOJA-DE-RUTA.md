# Carta natal — siguientes fases técnicas

## Lo completado en v0.4
Datos natales procesados **solo en el navegador**, con conversión de hora civil a UTC mediante identificador IANA, manejo de cambios de horario de verano y validaciones. No se registran estos datos en Supabase.

## Para generar una carta natal astronómica real
1. Capturar ciudad con coordenadas de latitud y longitud verificadas (servicio de geocodificación y confirmación explícita por el usuario).
2. Obtener zona horaria histórica verificada para ese lugar y fecha; en casos ambiguos, solicitar confirmación de la hora exacta.
3. Seleccionar y validar un motor de efemérides con licencia compatible con uso comercial; revisar licencias de Swiss Ephemeris o alternativas antes de integrar.
4. Calcular y probar longitud eclíptica del Sol, Luna y planetas en el instante UTC; especificar marco tropical/sideral y correcciones elegidas.
5. Implementar casas y ascendente desde tiempo sideral y coordenadas del nacimiento; elegir sistema de casas y documentar limitaciones en latitudes altas.
6. Validar resultados de referencia de distintas fechas y hemisferios contra datos astronómicos independientes, incluidos casos DST.
7. Crear gráfico SVG accesible y exportación descargable de informe, separando resultados calculados de interpretación simbólica.
8. Solo después de implementar privacidad, crear opción de guardar voluntariamente carta natal en Supabase con RLS.

## Reglas de privacidad
- Evitar pedir fecha de nacimiento o dirección exacta si no son necesarias.
- No transmitir datos de nacimiento a modelos de IA sin consentimiento claro y aviso de privacidad.
- No mostrar cartas simuladas como resultados astronómicos reales.

## Instalación y control local
```powershell
npm install
npm run test
npm run lint
npm run build
npm run dev
```

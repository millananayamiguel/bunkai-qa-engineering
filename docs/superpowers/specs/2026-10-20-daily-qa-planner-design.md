# Diseño de la skill Daily QA Planner

**Estado:** Borrador para revisión
**Fecha:** 2026-10-20
**Repositorio objetivo:** `bunkai-qa-engineering`
**Propósito:** Definir una skill portátil que convierta las fuentes de trabajo del equipo en un plan diario de QA priorizado y derive cada tarea al flujo QA existente cuando corresponda.

## Problema

El trabajo de QA llega por distintos canales: tickets de Jira o Xray, documentos del equipo y archivos como hojas de cálculo o PDF. El tester necesita una vista diaria que indique qué probar, por qué importa, qué cobertura preparar, qué fuente respalda cada decisión y qué información falta. Repetir todo el flujo QA en un agente nuevo duplicaría skills existentes y dificultaría su mantenimiento y reutilización.

## Objetivos

- Aceptar referencias a tickets, documentos aportados por el usuario o ambos en una misma planificación.
- Crear una lista diaria de trabajo trazable, priorizada por riesgo y con borradores de escenarios.
- Contrastar los datos de los tickets con los documentos del equipo sin tratar una fuente como sustituto silencioso de la otra.
- Derivar el trabajo a la skill que corresponda a su etapa del ciclo de vida.
- Poder reutilizarse en proyectos que no tengan las skills QA, la configuración de Jira o Xray de este repositorio.
- Mantener la planificación en modo de solo lectura por defecto y exigir aprobación explícita antes de escribir en sistemas externos.

## Fuera de alcance

- Asignar tareas automáticamente a testers o inferir su disponibilidad.
- Ejecutar pruebas, inspeccionar una aplicación activa o crear código de automatización.
- Reemplazar `shift-left-testing`, `sprint-testing` o `test-documentation`.
- Instalar o exigir bibliotecas/herramientas de Excel, PDF, OCR, Jira o Xray.
- Crear o actualizar elementos de Jira/Xray sin aprobación explícita.
- Leer `.env`, credenciales u otros almacenes de secretos como fuentes de planificación.

## Usuarios y criterios de éxito

El usuario principal es un ingeniero de QA que planifica su propio trabajo diario. Puede generar una vista de equipo si las fuentes proporcionadas describen trabajo compartido.

Una ejecución tiene éxito cuando:

1. Cada tarea propuesta se puede rastrear hasta un ticket, una sección identificada de un documento o un contexto aportado por el usuario claramente marcado como tarea sin ticket.
2. El plan diferencia hechos verificados en las fuentes de supuestos, relaciones inferidas y conflictos pendientes.
3. Las tareas se ordenan usando evidencia citada de urgencia, estado, dependencias y riesgo; no se reescriben silenciosamente los campos de prioridad de origen.
4. Cada tarea tiene un objetivo práctico de prueba y un esquema de cobertura basado en riesgo, o una explicación explícita de por qué todavía no puede definirse.
5. El plan recomienda el siguiente flujo adecuado o indica que no hay uno disponible.
6. No se modifica ningún sistema externo sin aprobación explícita de las escrituras propuestas.

## Entradas y reglas de precedencia

El usuario puede aportar cualquier combinación de:

- Claves de incidencias Jira/Xray o una lista/exportación de tickets.
- Procesos del equipo, requisitos, hojas de cálculo, PDF, CSV o texto.
- Una fecha, sprint, release, módulo u otro alcance de planificación.
- Prioridades o restricciones explícitas para ese día.

Usar las capacidades disponibles en el entorno para leer adjuntos y archivos. No asumir que el repositorio puede interpretar archivos binarios. Si un archivo no se puede leer, tiene contraseña, contiene solo imágenes sin OCR o resulta ambiguo, pedir una exportación de texto/CSV o el fragmento pertinente; no inventar el contenido extraído. No copiar los adjuntos originales al directorio de sesión.

La autoridad de cada fuente depende del tipo de dato:

| Información | Fuente preferida | Regla |
|---|---|---|
| Clave, estado actual, criterios de aceptación y vínculos del ticket | Registro actual del ticket en Jira | Es la fuente de verdad para el estado y alcance del ticket. |
| Proceso QA, política de riesgo y reglas de propiedad del equipo | Documento del equipo aportado por el usuario | Aplicarlo cuando corresponda e indicar documento y sección. |
| Prioridad del trabajo | Instrucción explícita del usuario o prioridad del ticket | Conservar el valor de origen; el orden sugerido no modifica ningún campo. |
| Relación entre una tarea del documento y un ticket | Clave o vínculo exacto de la incidencia | Coincidir solo por título o módulo es una asociación tentativa y debe marcarse como tal. |

Si hay conflicto entre fuentes, mostrar ambas afirmaciones con sus referencias y pedir aclaración solo si cambia el alcance, comportamiento esperado, riesgo o acción. Nunca elegir silenciosamente la interpretación más conveniente.

## Flujo de trabajo

1. **Definir alcance y comprobar reanudación:** establecer fecha y alcance. Usar el directorio diario `.session/daily-qa-planner/YYYY-MM-DD/`; si existe una sesión incompleta, ofrecer reanudarla, reiniciarla o cancelarla antes de reemplazarla. Seguir el contrato compartido de sesiones: `plan.md` es el índice del plan de ejecución y `progress.md` es append-only.
2. **Recopilar e indexar entradas:** registrar nombres de archivo, claves de tickets y referencias legibles a secciones o páginas. Excluir secretos y datos personales no relacionados con el plan.
3. **Normalizar y relacionar:** crear una lista candidata. Priorizar coincidencias por clave exacta o vínculo explícito; marcar las relaciones más débiles como tentativas. Deduplicar referencias repetidas sin perder las fuentes asociadas.
4. **Clasificar la etapa:** identificar refinamiento previo al sprint, QA dentro del sprint, documentación de pruebas ya validadas o trabajo sin clasificar. Usar evidencia de estado y contexto; preguntar si no se puede determinar la etapa.
5. **Priorizar:** ordenar por urgencia explícita del usuario/equipo, estado y preparación del ticket, dependencias/bloqueos y evidencia de impacto/riesgo. Explicar brevemente cada posición y conservar aparte la prioridad de origen. No inventar SLA ni capacidad del equipo.
6. **Proponer cobertura:** para el trabajo dentro del alcance, redactar objetivos concisos y escenarios que cubran criterios de aceptación y riesgos negativos, de límites, transiciones de estado y transversales que sean pertinentes. Registrar como pregunta abierta cualquier resultado esperado o evidencia faltante; no asumirlo.
7. **Recomendar la derivación:** recomendar, sin iniciar silenciosamente otro flujo ni modificar sistemas:
   - Trabajo de backlog/refinamiento -> `shift-left-testing`.
   - Verificación de sprint o ticket en estado Ready for QA -> `sprint-testing`.
   - Documentación persistente de comportamiento ya validado -> `test-documentation`.
   - Sin skill/herramienta compatible -> incluir el plan e indicar la capacidad faltante.
8. **Presentar y guardar:** presentar un resumen Markdown conciso y escribir `daily-plan.md` junto a `plan.md` y `progress.md` en el directorio de sesión. `daily-plan.md` es el entregable para el tester e incluye índice de fuentes, cola priorizada, esquema de cobertura, decisiones/preguntas abiertas y derivaciones recomendadas. Actualizar el registro append-only de progreso a medida que avance la ejecución.
9. **Escrituras externas:** por defecto no se escribe en Jira/Xray. Si el usuario lo solicita explícitamente, presentar los elementos, campos y vínculos exactos que se proponen crear o actualizar, y esperar aprobación antes de usar herramientas de escritura. Leer el resultado desde el destino para verificar cualquier escritura aprobada.

## Formato del plan diario

El informe incluye:

- Fecha, alcance y modalidad de planificación.
- Inventario de entradas con nombres y referencias; nunca valores secretos ni copias completas de adjuntos.
- Cola priorizada con orden, ticket/tarea, estado y prioridad de origen, justificación de riesgo, objetivo de prueba, escenarios propuestos, bloqueos/dependencias, nivel de confianza y siguiente skill recomendada.
- Coincidencias y conflictos entre fuentes, claramente marcados como confirmados o tentativos.
- Preguntas abiertas e información faltante que podría cambiar el diseño de pruebas.
- Tareas excluidas del plan del día y evidencia/regla que justifica la exclusión.
- Estado de escrituras externas: `none`, salvo que se hayan aprobado y verificado por separado.

## Arquitectura portable

La implementación añadirá una skill propiedad del proyecto en `.agents/skills/daily-qa-planner/` con:

- `SKILL.md` para describir activación, flujo, precedencia de fuentes, límites de seguridad y derivaciones opcionales.
- `references/daily-plan-template.md` con la estructura estable del informe y ejemplos.
- `evals/evals.json` con combinaciones representativas de entradas y resultados esperados de trazabilidad/derivación, siguiendo las convenciones locales.

También registrará `daily-qa-planner` en el mapa de alcances de sesión retrofitted de `scripts/lint-skills.ts` (alcance diario: `YYYY-MM-DD`) y añadirá cobertura enfocada en `scripts/lint-skills.test.ts`. Regenerará el registro de skills con el script existente.

La skill no codificará la clave de proyecto, campos/estados Jira, modalidad TMS, cachés del sistema de archivos ni credenciales de este repositorio. Descubrirá la configuración propia del proyecto cuando esté disponible y pedirá una alternativa portable cuando no lo esté. Las skills de flujo actuales son integraciones opcionales: si faltan en el proyecto destino, el plan seguirá siendo útil e indicará que no encontró una skill de derivación.

El registro de skills se genera desde sus metadatos. La implementación deberá regenerarlo y validarlo, no editar el agregado manualmente. La gestión de sesiones seguirá `agentic-qa-core/references/session-management.md`; el alcance y los roles de los archivos quedan especificados para que una reanudación no confunda el índice de ejecución con el entregable diario de QA.

## Manejo de errores y seguridad

- Entradas insuficientes: producir un plan limitado solo si queda evidencia suficiente; de lo contrario, solicitar la fuente faltante.
- Archivo ilegible/no compatible: indicar nombre y limitación, pedir una exportación accesible y continuar con otras fuentes solo si es seguro.
- Fallo de acceso al ticket/herramienta: detener conclusiones dependientes del ticket; no tratar cachés locales antiguas como estado actual de Jira sin etiquetarlas.
- Coincidencias tentativas o conflictivas: conservar ambas referencias, marcar el nivel de confianza y no combinar tareas distintas.
- Comportamiento esperado ambiguo: registrar una pregunta y evitar afirmar un resultado esperado.
- Escritura externa no aprobada: no escribir. Aprobar el plan no equivale a aprobar cambios en Jira/Xray.
- Secretos en los archivos aportados: no incluirlos en la salida ni en los archivos de sesión; advertir al usuario que rote credenciales activas expuestas.

## Verificación de la implementación

- El linter de skills acepta el frontmatter, categorías, referencias y contrato de sesión.
- La generación/verificación del registro incluye la skill nueva.
- Las evaluaciones cubren: solo documentos; solo tickets; coincidencia exacta ticket/documento; coincidencia tentativa; conflicto de estado o criterios de aceptación; PDF/hoja de cálculo ilegible; ausencia de skill downstream; y solicitud de escritura Jira/Xray sin aprobación.
- En todas las evaluaciones se conservan las referencias, no se inventan datos sin respaldo y no se realizan escrituras sin aprobación explícita.
- Revisar manualmente un plan generado para confirmar que resulte legible y útil para un tester que organiza su día real.

## Decisión de implementación pendiente

El diseño actual excluye la asignación de testers. Si más adelante se necesita distribuir el trabajo, deberá aprobarse como capacidad aparte, con una fuente autorizada de roster, disponibilidad y reglas de asignación; no se inferirá a partir del responsable del ticket.

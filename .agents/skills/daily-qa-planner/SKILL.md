---
name: daily-qa-planner
description: "Planifica el trabajo diario de QA a partir de tickets de Jira/Xray, documentos del equipo o ambos. Úsala cuando el usuario quiera organizar qué probar hoy, priorizar trabajo de QA, cruzar una hoja de cálculo o PDF con tickets, preparar un plan diario de pruebas, o decidir qué flujo QA corresponde. No la uses para ejecutar pruebas de un ticket (usa sprint-testing), refinar historias de backlog (shift-left-testing) ni documentar pruebas ya validadas en el TMS (test-documentation)."
license: MIT
compatibility: [claude-code, copilot, cursor, codex, opencode]
metadata:
  kind: workflow
  stage_owner: true
---

# daily-qa-planner

Convierte tickets y materiales legibles del equipo en un plan diario de QA que el tester pueda revisar y ejecutar. Esta skill coordina la planificación; no reemplaza las skills que refinan, prueban o documentan el trabajo.

Responde en el idioma del usuario. Escribe los informes y artefactos nuevos en español, salvo que el usuario solicite otro idioma. Conserva sin traducir nombres de skills, rutas, nombres de archivos, comandos, claves de tickets, campos e identificadores técnicos.

## Cuándo usarla

Actívala para solicitudes como:

- "Organiza mis pruebas para hoy con estos tickets y el Excel del equipo." <!-- volatile-ok: example user phrase, not a dated claim -->
- "Prepara un plan de QA diario a partir de este PDF y las historias del sprint."
- "Cruza esta lista de trabajo con Jira y dime qué debo probar primero."
- "Tengo estas tareas de QA; prepara los casos y señala qué falta."

No la uses como sustituto de una etapa QA. Si el usuario pide directamente probar o retestar un ticket, deriva a `sprint-testing`; si pide refinar criterios de aceptación previos al sprint, deriva a `shift-left-testing`; si solicita documentar comportamiento ya validado en Jira/Xray, deriva a `test-documentation`.

## Compact Rules

- Jira/ticket actual es la fuente de verdad para clave, estado, criterios de aceptación y vínculos; un documento del equipo es la fuente de sus propios procesos, reglas y prioridades. No intercambies esos roles.
- Relaciona fuentes por clave o vínculo exacto. Una coincidencia solo por título o módulo es tentativa y debe quedar marcada como tal.
- Cita cada tarea propuesta con ticket y/o archivo más sección/página. Separa hechos verificados, inferencias y preguntas.
- No inventes criterios de aceptación, disponibilidad del equipo, SLA, prioridad de origen ni resultados esperados.
- No leas `.env`, credenciales ni almacenes de secretos; nunca incluyas valores secretos en informes o archivos de sesión.
- No copies adjuntos originales al directorio de sesión. Si no puedes leer un archivo, solicita texto/CSV o un fragmento accesible y continúa solo con las otras fuentes que sí sean suficientes.
- El plan es de solo lectura respecto a Jira/Xray. Recomendar un handoff o recibir aprobación del plan no autoriza ninguna escritura externa.
- No asignes testers ni infieras su disponibilidad.
- Conserva `plan.md` como índice de ejecución y añade avances a `progress.md` sin reescribir entradas anteriores; el informe para el tester es `daily-plan.md`.

## Fuentes y precedencia

Acepta cualquier combinación de:

- Claves de ticket, una lista/exportación de Jira/Xray o resultados de una consulta de solo lectura disponible.
- Archivos legibles aportados por el usuario: Excel, PDF, CSV, documentos o texto.
- Alcance opcional: fecha, sprint, release, módulo, restricciones o prioridades explícitas.

Usa la capacidad de lectura de archivos/adjuntos que ofrezca el entorno. No afirmes que existe soporte de parsing u OCR propio. Si un PDF es imagen sin OCR, está protegido, una hoja no se puede interpretar o faltan páginas, indícalo y pide una exportación accesible. No rellenes silenciosamente lo que no pudiste leer.

Aplica precedencia por dato:

| Dato | Fuente preferida | Tratamiento |
|---|---|---|
| Clave, estado actual, criterios de aceptación y vínculos | Registro actual del ticket | Fuente de verdad del alcance y estado del ticket. |
| Proceso, política de riesgo y reglas del equipo | Documento del equipo | Identifica el documento y la sección que respaldan la regla. |
| Prioridad | Prioridad indicada por el usuario o campo de prioridad del ticket | Conserva el valor original; el orden recomendado no modifica el campo. |
| Relación entre documento y ticket | Clave/vínculo exacto | Coincidencia textual o temática se etiqueta `tentativa`. |

Si no se puede leer Jira, etiqueta los datos locales con el nombre/fecha del export o snapshot y no los presentes como estado actual. Si dos fuentes discrepan, muestra ambas y sus referencias. Pregunta solo si el conflicto puede cambiar alcance, comportamiento esperado, riesgo o siguiente acción.

## Flujo

## Phase 0 — Reanudación y alcance

Sigue el banner de sesión de `Subagent Dispatch Strategy`. Establece la fecha y el alcance del día. Usa `.session/daily-qa-planner/YYYY-MM-DD/`.

1. Comprueba `progress.md` antes de iniciar. Si ya existe una sesión, lee `plan.md` y las últimas entradas de `progress.md`; resume última fase completada, siguiente paso y bloqueos.
2. Ofrece `reanudar`, `reiniciar` o `cancelar`. Si se elige reiniciar, archiva la sesión anterior según `agentic-qa-core/references/session-management.md`; nunca sobrescribas una sesión sin decisión del usuario.
3. Si es una sesión nueva, confirma el alcance suficiente para interpretar las entradas. Pregunta por una sola brecha que afecte materialmente el plan; no pidas aclaraciones cuyos datos ya estén en las fuentes.
4. Escribe `.session/daily-qa-planner/YYYY-MM-DD/plan.md` antes de cualquier dispatch o acción de fase posterior. Usa el esquema de `agentic-qa-core/references/session-management.md` §6. Escribe `progress.md` con el esquema §7.

No guardes copias de los adjuntos. El índice de fuentes de `plan.md` puede guardar nombre, formato, fecha y referencias legibles, no su contenido completo.

### Fase 1 — Inventario y correlación

1. Registra los nombres de fuentes, tickets y referencias de página/sección que realmente se pudieron leer.
2. Extrae unidades de trabajo y deduplica tickets repetidos, conservando todas sus referencias.
3. Relaciona por clave/vínculo exacto. Marca como `tentativa` toda relación basada solo en tema, título, equipo o módulo.
4. Identifica el estado/ciclo de vida con evidencia: backlog/refinamiento, Ready for QA/en sprint, comportamiento ya validado o sin clasificar.
5. Si la evidencia no basta para distinguir estas etapas, marca `sin clasificar` y solicita solo la aclaración que cambie el handoff.

### Fase 2 — Priorización y diseño

Ordena el trabajo usando, en este orden, las restricciones explícitas del usuario/equipo, preparación/estado del ticket, dependencias/bloqueos y evidencia de impacto/riesgo. No reescribas la prioridad original. Explica brevemente por qué el orden recomendado resulta útil y etiqueta la confianza como `alta`, `media` o `baja` según la evidencia disponible.

Para cada elemento priorizado:

- Indica objetivo de prueba y criterios de aceptación relacionados, cuando existan.
- Propón escenarios breves, incluyendo casos negativos, límites, transiciones de estado y riesgos transversales solo cuando apliquen.
- Separa pruebas propuestas de comportamiento que ya fue validado.
- Registra comportamiento esperado ambiguo, dependencias, datos faltantes y limitaciones de formato como preguntas/bloqueos; no supongas el resultado.
- Recomienda un único siguiente flujo cuando la etapa esté clara:
  - Backlog/refinamiento previo al sprint: `shift-left-testing`.
  - Verificación en sprint o trabajo en estado Ready for QA: `sprint-testing`.
  - Comportamiento ya validado que requiere persistencia/ROI en TMS: `test-documentation`.
  - Etapa ambigua o skill no disponible: indicar la brecha y conservar el plan sin inventar un handoff.

La recomendación de skill es una derivación descriptiva. No invoques automáticamente otra skill ni abras una sesión de ejecución.

### Fase 3 — Presentación y aprobación de escrituras

1. Presenta en chat un resumen del orden diario, los riesgos principales, los bloqueos y las preguntas que cambien el diseño.
2. Escribe el informe completo en `.session/daily-qa-planner/YYYY-MM-DD/daily-plan.md` junto a `plan.md` y `progress.md`.
3. El comportamiento por defecto es no escribir en Jira/Xray. Si el usuario pide crear o actualizar artefactos externos, primero muestra la lista exacta de elementos, campos y vínculos propuestos y espera aprobación explícita para esas escrituras. La aprobación del plan diario no cuenta como aprobación de las escrituras.
4. Si el usuario aprueba una escritura en una sesión posterior, carga las skills/herramientas propietarias del TMS y sus preflight gates. Verifica leyendo el destino después de escribir. Si no hay herramienta o permiso, detente y presenta el plan para aplicación manual.

Al cerrar la sesión, completa `progress.md`, deja el directorio listo para reanudación y sigue `agentic-qa-core/references/session-management.md` §8 para archivar solo cuando corresponda. No archives sesiones fallidas o canceladas.

## Formato de `daily-plan.md`

Usa la plantilla `references/daily-plan-template.md`. Cada tarea debe incluir su orden, referencias de fuente, estado/prioridad de origen, objetivo, cobertura propuesta, riesgo, dependencias, confianza y skill recomendada. Señala coincidencias tentativas, conflictos, entradas ilegibles, tareas excluidas y preguntas abiertas. Indica `Escrituras externas: ninguna` si no hubo una escritura aprobada y verificada.

## Límites y errores

- Si faltan fuentes, genera un plan parcial solo cuando aún haya evidencia suficiente; documenta claramente qué quedó fuera.
- Ante fallo de lectura de ticket, no infieras su estado actual desde una caché local no identificada.
- Ante error de herramienta, detén las conclusiones dependientes y explica qué fuente no pudo verificarse.
- Ante archivo no legible, pide un formato accesible; no añadas dependencias ni intentes OCR por cuenta propia.
- Ante conflicto que altere el comportamiento esperado, no elijas por el usuario: presenta las dos referencias y espera aclaración.
- Si aparecen secretos en un adjunto, no los reproduzcas ni los guardes; advierte al usuario que las credenciales activas expuestas deben rotarse.
- No crees bugs, tests, Test Plans, Test Executions, comentarios, links, transiciones ni asignaciones en Jira/Xray en esta skill.

## Subagent Dispatch Strategy

> **Orchestration & Session contracts**: this skill follows `agentic-qa-core/references/orchestration-doctrine.md` (mandatory subagent dispatch — main thread is command center) AND `agentic-qa-core/references/session-management.md` (Phase 0 resume check, plan-first persistence at `.session/<skill-slug>/<scope>/`, archive on completion). Phase 0 (resume check) and Phase 1 (plan write) are NOT optional.

La planificación y priorización se mantienen en el orquestador: `agentic-qa-core/references/orchestration-doctrine.md` prohíbe delegar el trabajo de planificación. Esta skill no despacha subagentes ni ejecuta las skills downstream; recomienda el handoff para que el usuario lo inicie explícitamente.

Si una revisión técnica futura añade un dispatch independiente permitido por la doctrina, el briefing debe tener los siete componentes y nombrar únicamente rutas de lectura aprobadas:

1. **Goal:** un resultado acotado en una frase.
2. **Context docs:** este plan de sesión y las fuentes concretas necesarias.
3. **Project Standards (auto-resolved):** reglas compactas pertinentes desde `.agents/skills/REGISTRY.md`.
4. **Skills to load:** skills que el ejecutor debe cargar para esa tarea.
5. **Exact instructions:** pasos acotados; preservar la precedencia y trazabilidad de fuentes.
6. **Report format:** hechos, referencias, limitaciones, resultado y errores.
7. **Rules:** no secretos, no inventar datos, no escrituras externas y detenerse ante una brecha de permiso.

No uses dispatch para la decisión de prioridad, la clasificación de ciclo de vida, la conciliación de fuentes ni la aprobación de escrituras.

## Cierre de sesión

Sigue el cierre de `.agents/skills/agentic-qa-core/references/session-footer-contract.md` y propone lecciones según `agentic-qa-core/references/skill-refinement-protocol.md`; nunca edites esta skill durante su propia ejecución.

El mensaje de cierre incluye:

- El informe `daily-plan.md` y su ruta relativa al repositorio.
- `Skills loaded`: skills efectivamente usadas.
- `MCPs used`: MCPs efectivamente llamados o `none`.
- `CLIs used`: CLIs efectivamente llamados o `none`.
- `Testing levels touched`: `none` cuando solo se planificó; no declares pruebas ejecutadas.
- Capturas de pantalla: `none` (esta skill no las produce).
- `Refinements proposed`: `0` si no hubo una propuesta con evidencia; si la hubo, indica la ruta.

## Ruta de bloqueo

Si la skill, su contrato de sesión o sus evaluaciones tienen un defecto, registra el hallazgo en `.session/daily-qa-planner/YYYY-MM-DD/refinements.md` según `agentic-qa-core/references/skill-refinement-protocol.md`. Si el defecto pertenece a una skill sincronizada upstream, redacta primero un informe sin secretos en `upstream-issue-NN.md`; no presentes ni publiques el issue externo sin aprobación explícita, conforme a `agentic-qa-core/references/upstream-feedback.md`.

## Leer el SKILL.md completo cuando

Ejecuta una planificación diaria, reanuda una sesión existente, compara fuentes en conflicto o prepara una propuesta de escritura Jira/Xray.

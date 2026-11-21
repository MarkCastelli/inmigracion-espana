# Guía de mantenimiento

Esta app no tiene servidor ni base de datos: **actualizar el contenido es editar archivos de datos**. Esta guía explica qué tocar, cuándo y cómo comprobarlo.

---

## 1. Calendario de revisión

| Cuándo | Qué revisar | Dónde |
|---|---|---|
| **Enero** (o cuando se publique) | IPREM y SMI del año; umbrales de no lucrativa, reagrupación y nómada digital | `assets/js/engine.js` (bloque `d.iprem`), textos de `routes-exterior.js` y `routes-espana.js` |
| **Enero** | Tasas (Orden PJC/617/2025 y actualizaciones) | `docs/FUENTES.md` y campos `cost` de cada vía |
| **Trimestral** | Catálogo de ocupaciones de difícil cobertura (BOE) | `routes-exterior.js` → `visado_trabajo_ajena` |
| **Junio / septiembre** | Umbrales de la UGE-CE (PAC, nómada digital) | `routes-exterior.js` |
| **Antes de elecciones o cambios de Gobierno** | Plazos políticos, posibles regularizaciones, Ley de Nietos | `routes-*.js`, `resources.js` |
| **Cuando el BOE publice** | Cualquier reforma de extranjería, nacionalidad o asilo | Todas las vías afectadas + `docs/FUENTES.md` |

Al cerrar una revisión, actualiza **tres cosas**:

1. `RL.CONTENT_DATE` en `assets/js/core.js`.
2. `docs/FUENTES.md` (fecha y estado de cada dato).
3. `dist/ruta-legal.html` (ejecuta `python build.py`).

---

## 2. Mapa de archivos

```
assets/js/core.js              → versión, fecha de contenido, almacenamiento, fechas, iconos
assets/js/engine.js            → hechos derivados, puntuación, plan, alertas, hitos
assets/js/decision.js          → capa de decisión: legalidad, objetivo, derechos, confianza
assets/js/forms.js             → catálogo de formularios oficiales y enlaces verificados
assets/js/ai.js                → prompt para IA, DeepSeek y consultas guardadas
assets/js/data/regions.js      → 19 comunidades, 52 provincias y servicios autonómicos
assets/js/data/directory.js    → directorio: policía, FNMT, salud, concello, embajadas…
assets/js/data/procedures.js   → trámites: cita, documentos, pasos, tasas y plazos
assets/js/data/aids.js         → derechos, discapacidad, dependencia, familia numerosa y ayudas
assets/js/data/online.js       → sedes, trámites online, notificaciones y canjes
assets/js/pdf.js               → generador de PDF (A4, Helvetica, WinAnsi) sin dependencias
assets/js/speech.js            → lectura en voz alta con la Web Speech API del navegador
assets/js/data/questions.js    → preguntas, condiciones y pasos (7 en España, 6 fuera)
assets/js/data/countries.js    → países: 2 años, UE, visado Schengen
assets/js/data/routes-*.js     → una vía = un objeto; aquí vive el conocimiento legal
assets/js/data/resources.js    → glosario, FAQ, bulos, enlaces, aviso legal
assets/js/app.js               → interfaz (asistente, plan, catálogo, documentos, ayuda)
```

**Regla de oro:** si el cambio es legal, va en `routes-*.js` o `resources.js`. La interfaz no debería contener reglas de negocio.

---

## 3. Añadir una vía nueva

Copia esta plantilla al final del archivo que corresponda (por ejemplo, `routes-espana.js`), antes del cierre del IIFE:

```js
RL.routes.push({
  id: 'mi_via_nueva',                 // único, en snake_case
  group: 'residencia',                // nacionalidad | residencia | visado | proteccion
  title: 'Nombre de la vía',
  short: 'Una frase para el catálogo.',
  icon: 'home',                       // home, briefcase, book, family, shield, doc, clock, globe, route, cal, euro, refresh
  weight: 30,                         // importancia base (0-55). Más = aparece antes
  goals: ['regularizar', 'trabajar'], // regularizar | residencia_estable | trabajar | estudiar | nacionalidad | familia
  where: 'spain',                     // spain | consulado | both
  availability: 'open',               // open | closed
  legal: 'Art. X RD 1155/2024',
  summary: 'Dos o tres frases explicando qué es y para quién.',
  forWho: 'Perfil exacto al que va dirigida.',
  requirements: [
    { label: 'Estás en España', test: (p, d) => d.inSpain, actionable: false },
    { label: 'Llevas 2 años', test: (p, d) => d.monthsInSpain >= 24, fix: 'Te faltan…' },
    { label: 'Careces de antecedentes', test: (p, d) => d.criminalSpain === 'no', actionable: false }
  ],
  blockers: [
    { label: 'Motivo por el que esta vía no aplica nunca', test: (p, d) => d.euCitizen }
  ],
  docs: [
    { id: 'doc_unico', name: 'Documento', where: 'Dónde se pide', note: 'Caducidad o detalle' }
  ],
  steps: [
    { title: 'Paso 1', detail: 'Qué hacer', when: 'Mes -2' }
  ],
  cost: '38,28 € + TIE',
  time: 'Resolución orientativa de 3 meses',
  risks: ['Error frecuente que conviene evitar'],
  links: [{ t: 'BOE', u: 'https://www.boe.es/...' }],
  fit: (p, d) => 'Frase personalizada que explica por qué encaja contigo.'
});
```

### Reglas de `test`

- Devuelve `true` (cumple), `false` (no cumple) o `null` (no se sabe / falta dato).
- Si un requisito es **imprescindible y no depende del usuario**, pon `actionable: false`. Así la vía se descarta en lugar de aparecer como «a tu alcance».
- `fix` explica cómo cumplirlo; puede ser una función `(p, d) => string` para incluir plazos calculados.
- `blockers` son exclusiones duras: si alguno es `true`, la vía no se recomienda nunca.
- Para vías que solo informan (turismo, carta de naturaleza), añade `informational: true`: salen en el catálogo pero no en el plan.

### Reglas de `docs`

- Usa un `id` estable y único. Si dos vías comparten documento, **reutiliza el mismo `id`**: el checklist los agrupa.
- `name`, `where` y `note` se muestran tal cual; evita duplicar la nota en varias vías.

---

## 4. Añadir o cambiar una pregunta

En `assets/js/data/questions.js`, dentro del paso correspondiente:

```js
{
  id: 'mi_dato',                 // se guarda en el perfil como p.mi_dato
  type: 'radio',                 // radio | select | country | number | date | text | textarea | checkboxes | consent
  label: '¿Pregunta?',
  help: 'Texto de ayuda (opcional).',
  required: true,
  showIf: (p) => p.location === 'spain',
  options: [{ v: 'si', l: 'Sí', h: 'Aclaración' }]
}
```

Después, expón el hecho derivado en `engine.js` (`RL.derive`):

```js
d.miHecho = p.mi_dato === 'si';
```

Y úsalo en las vías (`test: (p, d) => d.miHecho`).

**Cuidado:** si cambias el `id` de una pregunta existente, los perfiles guardados dejan de reconocerla. Añade una migración en `normalize()` de `core.js` o mantén el id.

---

## 5. Actualizar cuantías

### IPREM y SMI

En `engine.js`, bloque `d.iprem`:

```js
d.iprem = { month: 600, year12: 7200, year14: 8400 };
```

Y busca las cifras en texto: `2.400`, `28.800`, `600`, `900`, `2.442`, `916`, `306`, `41.356`, `33.085`. Están en `routes-exterior.js` y en `resources.js` (glosario y FAQ). Si cambia el SMI, el nómada digital cambia con él.

### Tasas

Los importes aparecen en `cost` de cada vía y en `resources.js`. Actualiza también `docs/FUENTES.md`.

---

## 6. Cambiar el tono o el aviso legal

- **Aviso legal y privacidad:** `assets/js/data/resources.js` → `legal`.
- **Glosario, FAQ y bulos:** mismo archivo.
- **Textos de la portada:** `index.html`.
- **Estilos:** `assets/css/app.css` (variables al principio; modo oscuro en `[data-theme="dark"]`).

Reglas de redacción que ya sigue la app y conviene mantener:

- No prometer resultados («podrás obtener» → «podrías solicitar»).
- No usar «ilegal» para personas: **situación administrativa irregular**.
- Distinguir siempre **estancia** de **residencia**.
- Fechas en formato `20 nov 2026`; importes con `€` y separador de miles español.
- Cada afirmación delicada, con enlace oficial.

---

## 7. Verificar antes de publicar

```bash
node tests/engine.test.js     # 29 pruebas del motor
node tests/decision.test.js   # 6 pruebas de la capa de decisión
node tests/forms.test.js      # 7 pruebas del catálogo de formularios
node tests/directorio.test.js # 5 pruebas de regiones y directorio
node tests/procedures.test.js # 4 pruebas de trámites, citas y documentos
node tests/timing.test.js     # 18 pruebas de ventanas, asilo, renovación y acciones
node tests/aids.test.js       # 5 pruebas de derechos, discapacidad y ayudas
node tests/faq.test.js        # 7 pruebas de preguntas frecuentes
node tests/online.test.js     # 3 pruebas de sedes y trámites online
node tests/links.test.js      # 4 pruebas de enlaces y rutas muertas
node tests/ai.test.js         # 4 pruebas de prompt y consultas
node tests/familia.test.js    # 19 pruebas de pareja, hijos, reagrupación y opciones familiares
node tests/housing.test.js    # 3 pruebas de vivienda y prueba de domicilio
node tests/docs.test.js       # 8 pruebas de trámites terminados vs. en curso
node tests/education.test.js  # 4 pruebas de Bachillerato, SEPE y estudios por hijo
node tests/persistence.test.js # 2 pruebas de copia JSON y reanudación
node tests/pdf.test.js        # 10 pruebas del PDF
node tests/speech.test.js     # 5 pruebas del lector de voz
node tests/speech.mock.test.js # 3 pruebas con API simulada
node tests/ui.smoke.js        # 24 pruebas de interfaz
python build.py               # regenera dist/ruta-legal.html
```

Comprobación manual rápida:

1. Abre `index.html` y pulsa **Ver un plan de ejemplo**: debe salir un plan con arraigo social y fechas.
2. Recorre el asistente con un perfil distinto (por ejemplo, fuera de España y con abuelo español) y revisa que las preguntas condicionales aparezcan y desaparezcan.
3. Abre **Vías**, busca «nietos» y comprueba que la ficha dice que el plazo está cerrado.
4. Abre **Ayuda** y revisa que la fecha de revisión y los enlaces estén actualizados.
5. Imprime el plan (Ctrl+P): debe salir sin botones ni menús.
6. Abre `dist/ruta-legal.html` en otro navegador: debe funcionar sin conexión.

---

## 8. Errores que ya se han corregido (para no repetirlos)

- **No mostrar vías cerradas como disponibles.** La regularización de 2026 y la Ley de Nietos están cerradas; se muestran solo como información y con la excepción de la cita previa.
- **No usar «arraigo familiar» para familiares de españoles.** Es otro procedimiento (arts. 93-99).
- **No decir que la estancia por estudios cuenta como residencia** para la nacionalidad: no cuenta.
- **No decir que los iberoamericanos están exentos del CCSE:** solo del DELE.
- **No prometer silencio positivo** en renovaciones.
- **No calcular la no lucrativa con 14 pagas:** son 28.800 €/año (400 % sobre 12 pagas).
- **No calcular el nómada digital con el IPREM:** es 200 % del SMI.

---

## 9. Publicación

La app es estática. Puedes:

- entregar la carpeta y abrir `index.html`;
- entregar solo `dist/ruta-legal.html`;
- alojarla en cualquier hosting estático (GitHub Pages, Netlify, un Apache…), sin backend.

Si la publicas online, añade una nota visible de que **no recoge datos** y enlaza el aviso legal. No añadas analítica sin cambiar antes la política de privacidad.

---

## 10. El PDF

`assets/js/pdf.js` escribe un PDF válido sin librerías: A4, Helvetica y codificación WinAnsi. El documento se genera en el navegador y se descarga con un `Blob`; no hay servidor.

- `buildPlanPDF(plan, profile)` compone el contenido (datos, resumen, avisos, vías, requisitos, documentos, pasos, fechas, acciones, checklist y descartadas).
- El objeto `Doc` ofrece `title`, `h2`, `h3`, `p`, `bullet`, `kv`, `hr` y `space`, y salta de página solo.
- La codificación pasa por `toWinAnsi`: admite acentos, ñ, ü, ¿¡, «», €, ·, — y …. Las flechas se sustituyen por `->`.
- **No uses emojis ni símbolos fuera de cp1252**: se convertirían en `?`.
- El ancho de línea se estima con una media de 0,5 em. Si cambias mucho los textos, revisa que no queden líneas raras ni páginas casi vacías.
- Prueba: `node tests/pdf.test.js`. Para verlo: pulsa «Descargar PDF para tu abogado» en el plan o genera uno con el perfil de ejemplo.
- La muestra `docs/ejemplo-plan.pdf` se genera con el perfil de ejemplo. Regénérala si cambias secciones o textos importantes. La muestra `docs/ejemplo-hoja-datos.pdf` se genera con el EX-31 y un perfil de ejemplo. `docs/ejemplo-consulta.pdf` se genera con una consulta de ejemplo. `docs/ejemplo-plan-familiar.pdf` usa un matrimonio con española para mostrar la expectativa realista.
- Si añades una sección al plan, añádela también aquí: el abogado debe recibir la misma información que ves tú.

---

## 11. Documentos y trámites del inmigrante

El paso `documentos` solo aparece si `location === 'spain'` y pregunta por dos listas:

- `docsBase`: pasaporte, NIE, TIE, tarjeta UE, certificado digital, cuenta bancaria, Seguridad Social, vida laboral, tarjeta sanitaria, contrato de alquiler, nóminas.
- `docsTramites`: cita de asilo, hoja blanca, tarjeta roja, resguardo de nacionalidad, resguardo de extranjería, autorización de regreso, antecedentes, libro de familia, demandante de empleo, discapacidad, otro.

`engine.js` los convierte en hechos (`d.owns`, `d.hasDigitalCert`, `d.hasRedCard`, `d.asylumStage`, `d.pendingExtranjeria`…) y de ahí salen alertas, acciones y bloqueos:

- **Asilo en curso** (`solicitado` / `admitido`): no es situación irregular; bloquea el arraigo; activa el seguimiento y el permiso de trabajo a los 6 meses.
- **Cita de asilo**: urgente; no legaliza por sí sola; bloquea el arraigo.
- **Resguardo de extranjería**: bloquea el arraigo (art. 126.h).
- **Tarjeta roja**: se pide fecha de caducidad y si se ha renovado.
- **Hoja blanca**: se pide fecha; a los 6 meses se puede pedir autorización de trabajo.
- **Resguardo de nacionalidad**: seguimiento; no bloquea.
- **Certificado digital**: elimina la acción de sacarlo.

Añadir un documento:

1. Añade la opción en `docsBase` o `docsTramites`.
2. Añade la etiqueta en `ownedDocsHTML` (app.js) y en `docLabels` (pdf.js).
3. Si cambia el plan, crea el hecho en `RL.derive` y úsalo en alertas, acciones o rutas.
4. Añade una prueba en `tests/engine.test.js`.

**Vigencia:** la hoja blanca y la tarjeta roja pueden cambiar con la reforma de asilo y el Pacto Europeo. Revisa ACNUR, CEAR y el BOE antes de dar por buenas las duraciones.

---

## 12. Lectura en voz alta

`assets/js/speech.js` usa `window.speechSynthesis` (Web Speech API). No hay TTS externo ni API key; el texto se queda en el dispositivo.

- **Voces:** `getVoices()` puede llegar vacío al principio; se reintenta con `voiceschanged` y a los 400 ms.
- **Preferencia:** español `es-ES`, local si hay; se guarda en `localStorage` (`ruta-legal.voice`, `ruta-legal.rate`).
- **Troceado:** fragmentos de 220 caracteres como máximo para evitar el corte de Chrome con utterances largas; se encolan con `onend`.
- **Pausa:** `speechSynthesis.pause()/resume()`; en algunos móviles puede no funcionar, pero detener siempre funciona.
- **iOS/Safari:** exige un gesto del usuario; el botón lo es. No se reproduce automáticamente al cargar.
- **Sin soporte:** se ocultan los botones `[data-action^="listen"]` y la ayuda muestra un aviso.
- **Texto:** para una vista se usa `buildViewText` (elimina botones, SVG, detalles cerrados y elementos ocultos). Para el plan se usa un guion curado `buildPlanScript` (resumen, vías, faltantes, acciones, fechas, documentos y aviso legal).
- Si añades una vista o un bloque importante, revisa que `buildViewText` no lea controles; si es un documento, crea un guion.
- Pruebas: `node tests/speech.test.js` (limpieza, troceado y guion) y `node tests/speech.mock.test.js` (cola con API simulada).

---

## 13. Capa de decisión

`assets/js/decision.js` no evalúa requisitos (eso lo hace `engine.js`): ordena y audita las vías que ya han pasado el filtro legal.

- **`QUALITY`**: 0 = nacionalidad, familia de español/UE, larga duración, protección; 1 = arraigo, renovación, reagrupación; 2 = visados; 3 = informativas.
- **`TIER`**: 1 protección, 2 familia/UE, 3 permiso/renovación, 4 arraigo, 5 nacionalidad, 6 visado. Se usa como desempate.
- **`compare(a,b,d)`**: agrupa `ready`/`likely` antes que `almost`; después prioriza el objetivo del usuario; después la calidad de la vía; después la puntuación y el tier.
- **`confidence`**: revisa datos clave y huecos (permiso sin caducidad, padrón sin fecha, TIE sin permiso…). Si la vía principal tiene requisitos por confirmar, baja de `alta` a `media`.
- **`safety`**: orden de salida, asilo denegado sin recurso, violencia, menores, antecedentes, situación irregular sin 2 años. Son prioridades que pueden cambiar el plan.
- **`trace`**: cuenta vías revisadas, bloqueadas, cerradas y sin encaje; se muestra en «Cómo hemos decidido».

Para añadir una vía:
1. Añádela a `QUALITY` y `TIER` con su id; si no, se usa el valor por defecto según el grupo.
2. Añade una prueba en `tests/decision.test.js` si su prioridad es discutible (por ejemplo, familiar de español frente a arraigo).
3. No uses la puntuación como única razón: la capa de decisión manda.

**Límite honesto:** esto es un sistema de reglas, no un abogado. Los casos con antecedentes, asilo, nacionalidad por cadena, expulsiones o documentación contradictoria necesitan revisión profesional. La app debe decirlo y lo dice.

---

## 14. Formularios oficiales

`assets/js/forms.js` es el catálogo de modelos. No guarda los PDFs: enlaza a la sede oficial y añade metadatos para la hoja de datos.

- **Renumeración 2025-2026:** el arraigo es **EX-31** (no EX-10); el familiar de persona con nacionalidad española es **EX-24**; el EX-10 es circunstancias excepcionales; el EX-32 es la regularización de 2026, cerrada. El EX-11 es larga duración. No uses listas antiguas.
- Cada entrada tiene `id`, `code`, `title`, `url`, `where`, `fee`, `note` y `routeIds`.
- `RL.forms.forRoute(routeId)` alimenta la ficha de cada vía y la vista de documentos.
- `RL.forms.hub` apunta a la página oficial de modelos generales del Ministerio de Inclusión.

**Hoja de datos:** `RL.pdf.buildFormSheet(form, data, route)` genera un PDF de apoyo con nombre, apellidos, NIE, domicilio, trámite, documentos e instrucciones. No es el formulario oficial y no se firma. Los datos se guardan en `state.formData` (solo en el dispositivo).

**Por qué no rellenamos el PDF oficial:** los impresos oficiales deben descargarse de la sede, cumplimentarse y firmarse por el interesado; algunos son formularios web con validaciones y tasas asociadas. Alterar un PDF oficial o presentar una firma que no es del solicitante es un riesgo legal. La hoja de datos resuelve el problema real —no saber qué poner en cada casilla— sin suplantar ni falsificar.

**Añadir o actualizar un formulario:**
1. Localiza el modelo en la página oficial de modelos generales y copia la URL real (no de un despacho o mirror).
2. Añade la entrada en `forms.js` con su `code`, `url` y `routeIds`.
3. Añade la etiqueta del documento en `routes-*.js` si debe aparecer en el checklist.
4. Ejecuta `node tests/forms.test.js` y `node tests/pdf.test.js`.
5. Revisa el enlace cada trimestre: el ministerio cambia versiones y nombres de fichero.

---

## 15. Directorio geográfico

`data/regions.js` y `data/directory.js` alimentan la pestaña **Dónde ir**.

- **19 comunidades** (17 + Ceuta y Melilla) y **52 provincias**. `RL.regionByProvince()` devuelve la región; cada región tiene `portal`, `health`, `healthName`, `education`, `social`, `employment`, `localLabel` y `regionLabel`.
- `localLabel` cambia con la comunidad: **Concello** en Galicia, **Ajuntament** en Cataluña/Baleares/Valencia, **Udala** en País Vasco, **Ayuntamiento** en el resto.
- `directory.js` tiene fichas con `scope` (`national`, `region`, `local`), `cat`, `title`, `what`, `where`, `url` o `urlKey`. Las funciones reciben el contexto `{regionName, regionLabel, healthName, localLabel, municipality, province}`.
- Si no hay provincia seleccionada, solo se muestran las fichas nacionales; al elegirla aparecen comunidad, ayuntamiento y centro de salud.
- **No hay base de datos de direcciones municipales.** Se enlaza a la web oficial de la comunidad/ayuntamiento y se pide al usuario que elija su municipio. Es preferible a inventar direcciones o copiar listados que caducan.
- Enlaces oficiales: policía (cita previa ICPP), FNMT, Seguridad Social, SEPE, AEAT, Justicia, Registro Civil, comunidades y entidades. No se enlazan gestorías ni directorios privados.

**Añadir una región o ficha:**
1. Añade la región a `regions.js` con sus provincias y URLs oficiales.
2. Añade la ficha a `directory.js` con `scope`, `cat`, `what`, `where` y `url`/`urlKey`.
3. Ejecuta `node tests/directorio.test.js` y `node tests/ui.smoke.js`.
4. Comprueba que las 52 provincias siguen teniendo región y que no hay ids duplicados.

---

## 16. Consulta abierta con IA

`assets/js/ai.js` genera el prompt y gestiona las consultas guardadas. **No llama a ninguna API**: abre la web de DeepSeek con `?q=` y el usuario decide enviar.

- `RL.ai.buildPrompt(plan, question, opts)` incluye perfil, diagnóstico, vías descartadas, confianza, documentos e instrucciones. `opts` permite excluir `includeDocs`, `includeLocation` e `includeNotes`.
- `RL.ai.buildFollowUp(prev, question)` conserva la pregunta y la respuesta anterior para repreguntar.
- `RL.ai.openDeepSeek(prompt)` abre `https://chat.deepseek.com/?q=...`. Si el prompt supera 6000 caracteres, abre la IA sin `?q=` y copia el texto al portapapeles.
- `RL.ai.openChatGPT(prompt)` hace lo mismo con ChatGPT; si el prefill falla, el usuario pega.
- `RL.ai.save()`, `list()`, `get()`, `remove()` y `last()` usan `state.consultations` (máximo 20, solo en el dispositivo).
- `RL.pdf.buildAnswerPDF(c)` genera el PDF de la consulta con pregunta, respuesta, contexto y aviso.

**No se puede leer la respuesta automáticamente:** no hay backend ni API key, y la respuesta está en otra pestaña. El flujo es pegar la respuesta y pulsar «Guardar». Eso también evita enviar datos sin que el usuario lo vea.

**Riesgo:** la IA puede inventar normas, tasas o plazos. El prompt le pide citar fuentes y distinguir hechos de interpretación, pero la app no verifica la respuesta. El PDF y la UI deben mantener el aviso de «no es asesoramiento jurídico».

**Cambiar el prompt:** edita `buildPrompt` y ejecuta `node tests/ai.test.js`; comprueba que sigue incluyendo perfil, pregunta, fecha, instrucciones y aviso de no inventar.

---

## 17. Expectativa realista y supuestos familiares

La app no promete porcentajes de concesión. `decision.js` añade `reality()` con cuatro niveles: `solid`, `conditional`, `fragile` y `none`. Se muestra en el bloque **«Expectativa realista»** y en el PDF.

**Hechos nuevos** (`engine.js` + `questions.js`):
- `maritalStatus`: se añade `pareja_estable` (no registrada).
- `cohabitation`: 12 meses o más, menos, no convivimos, no lo sé.
- `pregnant` y `pregnantBySpanish`.
- `childRecognized`, `childLivesWithYou`, `childSupport`.
- Derivados: `marriedToSpanish`, `registeredPartnerSpanish`, `stablePartnerSpanish`, `stablePartnerQualifies`, `parentSpanishMinor`, `hasMinorSpanishChild`, `pregnantBySpanish`.

**Reglas clave de `familiar_espanol`:**
- Matrimonio o pareja registrada: vía disponible, pero **no automática**; hay que solicitar y probar.
- Pareja estable: 12 meses de convivencia o hijo en común; si no, no encaja.
- Progenitor de menor español (art. 94.1.f RD 1155/2024): menor a cargo y convivencia, o cumplimiento de obligaciones; si el otro progenitor tiene la custodia y no cumples, no encaja.
- Hijo no reconocido por el progenitor español: la nacionalidad no está resuelta; no se recomienda la vía como si existiera.
- Embarazo: no da residencia; el hijo será español si el padre lo reconoce.

**No convertir esto en un porcentaje.** La oficina valora pruebas, convivencia, credibilidad y antecedentes. El nivel `solid` significa «requisitos cubiertos», no «te lo van a conceder». Los textos de UI y PDF deben mantener esa diferencia.

**Pruebas:** `node tests/familia.test.js` cubre matrimonio, pareja estable, embarazo, hijo reconocido/no reconocido, hijo con el otro progenitor y desglose de hijos comunes/solo solicitante/solo pareja. `node tests/pdf.test.js` comprueba que el PDF muestra ese desglose y `node tests/ui.smoke.js` que el plan lo resume.

---

## 18. Trámites, citas y ventanas de oportunidad

`data/procedures.js` alimenta la pestaña **Trámites**. Cada ficha tiene `title`, `when`, `where`, `appointment`, `docs`, `steps`, `fee`, `note` y `routeIds`.

- **Citas:** ICPP (`https://icp.administracionelectronica.gob.es/icpplus`) para NIE/TIE y huellas; sede de Extranjería para arraigo/familiar/renovación; sede de Justicia para nacionalidad; FNMT para certificado digital.
- **Ubicación:** `where` puede ser función de `{localLabel, municipality, province}`. `urlKey` resuelve `portal`, `health`, `education`, `social` o `employment` de `regions.js`.
- **Ventanas:** `engine.js` → `buildWindows(p,d)` devuelve avisos por fecha de visado/permiso, meses para el arraigo, estudios, turismo, asilo y vía familiar. Se muestran en el plan y en el PDF.
- **Plazos que no se deben tocar sin verificar:**
  - Renovación: **2 meses antes** por Mercurio/sede para la parte administrativa; la **TIE física y las huellas solo desde el día del vencimiento**, nunca antes. Presentar en plazo prorroga la validez anterior hasta la resolución.
  - Estudios: trabajo compatible hasta 30 h/semana; modificación a trabajo antes de caducar o dentro de los 3 meses posteriores.
  - Turismo: 90/180; no se puede trabajar ni modificar a residencia desde turismo.
  - Arraigo: 2 años; ausencias ≤90 días; no tener permiso ni expediente abierto.
  - Asilo: trabajo desde los 6 meses; renovar hoja blanca/tarjeta roja.
  - Familiar de español: no exige 2 años; no es automático.

**Terminología:** la app no usa «inmigrante ilegal». Usa «persona en situación irregular»; «ilegal» se reserva para conductas. El bloque de ayuda y el aviso legal lo explican.

**Añadir un trámite:** añade la ficha con `routeIds` válidos, enlace oficial https, docs y pasos; ejecuta `node tests/procedures.test.js` y `node tests/ui.smoke.js`.

---

## 19. Derechos, discapacidad y ayudas

`data/aids.js` alimenta la pestaña **Derechos**. No es un catálogo de promesas: separa cuatro reconocimientos distintos.

- **Certificado de discapacidad**: competencia de la **comunidad autónoma** (servicios sociales / centro de valoración). El ayuntamiento puede informar o tramitar, pero no lo expide; la Seguridad Social tampoco. Grado habitual 33 %/65 %.
- **Incapacidad permanente**: **INSS/Seguridad Social**; valora capacidad laboral y puede dar pensión. No equivale al 33 % (STS 2026).
- **Dependencia**: **SAAD/CCAA**; servicios o prestaciones por apoyo en la vida diaria.
- **Familia numerosa**: **título de la CCAA**; ventajas educativas, fiscales, transporte y vivienda.

**Hijo adulto con discapacidad y tarjeta de 1 año:** `RL.aids.adultDisabledOptions(p,d)` devuelve opciones según `permitKind` (familiar de español, reagrupación, no lucrativa, trabajo, estudios) y recuerda que la discapacidad no sustituye los requisitos. Si no hay empleo: medios del familiar, pensión, dependencia, larga duración, segunda oportunidad o circunstancias excepcionales; el arraigo no se puede pedir con permiso/expediente.

**Menores:** derechos a sanidad, educación, protección y servicios sociales; nacionalidad solo en los supuestos del art. 17 CC; residencia de menor acompañado (art. 159); tutela de no acompañados; revisión al cumplir 18.

**Ayudas:** IMV, RMI autonómica, pensión no contributiva, dependencia, familia numerosa, emergencia municipal, vivienda y asistencia jurídica gratuita. Muchas exigen residencia legal; las de emergencia municipal pueden no exigirla. Verifica cada comunidad y año.

**Añadir una ayuda:** entrada en `aids.js` con `title`, `what`, `who`, `where`, `url`/`urlKey`, `note`, `scope` y `cat`; ejecuta `node tests/aids.test.js`.

---

## 20. Reconocimiento de estudios

Tres procedimientos en `procedures.js` + una entrada en `aids.js`:

- **`homologacion_no_universitaria`**: ESO, Bachillerato y FP. Ministerio de Educación o CCAA. Documentos: título/certificado, expediente, programa, apostilla/legalización, traducción jurada, tasa 079.
- **`homologacion_universitaria`**: Grado/Máster; Ministerio de Ciencia, Innovación y Universidades / Validate-TE. No confundir con equivalencia ni con reconocimiento profesional.
- **`unedasiss`**: acceso a la universidad con bachillerato extranjero; no homologa.

**Conceptos:**
- **Homologación** = título extranjero equiparado a título español.
- **Convalidación** = asignaturas/cursos, no título.
- **Equivalencia** = nivel académico/escolaridad.
- **UNEDasiss** = credencial de acceso, no título.

**4º ESO / Bachillerato:** si terminó la ESO, homologación a Graduado en ESO; si no, convalidación/equivalencia para seguir. Bachillerato: homologación y luego UNEDasiss/EBAU. FP: homologación o acreditación de competencias.

**Quién:** cualquier persona con estudios extranjeros y pasaporte/NIE; **no exige residencia legal** y **no regulariza**. La matrícula/visado es un requisito distinto.

**Enlaces:** [Ministerio de Educación](https://www.educacionfpydeportes.gob.es/servicios-al-ciudadano/catalogo/gestion-titulos/estudios-no-universitarios/titulos-extranjeros.html) · [Universidades](https://www.ciencia.gob.es/Universidades/validate/como_reconocer.html) · [Validate-TE](https://validate.ciencia.gob.es/) · [UNEDasiss](https://unedasiss.uned.es/).

**Aviso:** los plazos son administrativos y pueden alargarse; nadie puede garantizar una homologación en un plazo fijo. La convalidación no sustituye a la homologación si te piden un título.

---

## 21. Documentos, antecedentes y derechos ante la policía

`procedures.js` incluye ahora:

- **Vida laboral**: Import@ss/TGSS; gratis; prueba de cotizaciones.
- **Antecedentes penales de España**: sede de Justicia; validez ~3 meses; no sirve para trabajar con menores.
- **Antecedentes del país de origen**: consulado/ministro; apostilla/legalización; traducción jurada; validez 3-6 meses.
- **Delitos de naturaleza sexual**: Registro Central; único certificado para trabajar con menores.
- **Apostilla de La Haya**: solo países del Convenio; si no, legalización.
- **Traducción jurada**: buscador oficial del MAEC; no sustituye a la apostilla.

**Policía:** el bloque de `renderDerechos` explica que la irregularidad es administrativa, no penal; que la expulsión no es automática pero puede ocurrir; derechos si te detienen (abogado, intérprete, no declarar, avisar a familiar/consulado); no firmar lo que no se entiende; no dar identidad falsa. No se promete impunidad.

**Antecedentes:** `questions.js` añade `criminalSpainWhen` y `criminalOriginWhen`; el aviso del plan distingue 1 año / 5-10 / +10. No se afirma que un antecedente antiguo haya desaparecido: depende de cancelación, país, delito y pena. Los delitos sexuales con menores se tratan como especialmente graves.

**Añadir un documento:** ficha en `procedures.js` con enlace oficial, docs y pasos; ejecuta `node tests/procedures.test.js`.

---

## 22. Preguntas frecuentes

`data/faq.js` alimenta la pestaña **Preguntas**. Cada ficha tiene `id`, `cat`, `q`, `short`, `detail[]` y `links[]`.

- **No se copian respuestas de foros**: se usan para detectar dudas, pero la respuesta se redacta con la norma y la sede.
- Categorías: entrada, asilo, arraigo, trabajo, sanciones, familia, documentos y ayudas.
- Se puede buscar por texto y filtrar por categoría.
- **Asilo y arraigo:** el tiempo como solicitante no computa; el art. 126.a impide el arraigo durante el asilo; tras denegación firme se cuenta desde esa fecha. La excepción de 6 meses caducó; no se ofrece como regla general.
- **Estudios:** 30 h/semana; el exceso puede extinguir la estancia. El cuestionario pregunta `studyWorkHours`.
- **Trabajo sin papeles:** se distingue infracción administrativa/laboral de delito; se reconocen derechos laborales, pero también riesgo migratorio. No se promete impunidad.
- **Policía:** se explica que la irregularidad no es delito penal y que la expulsión no es automática, pero puede ocurrir.
- **Ayuntamiento y trabajadora social:** servicios sociales, empadronamiento, informe social, ayudas de emergencia, alimentos, alquiler/suministros; límites de presupuesto y requisitos.
- **ONG más allá de Cáritas:** directorio y mapa de recursos; ACCEM, Red Acoge, Fundación Secretariado Gitano, Provivienda, RAIS.
- **Muebles, gafas, alquiler, luz y vales:** existen, pero no son universales; dependen de municipio, entidad, ingresos y valoración. Se evita prometer.
- **Fraude laboral:** `fraude_horas` y `denuncia_fraude` explican contrato de 30 h/50 h reales, nómina falsa, salario por debajo de convenio, pruebas, Inspección, SMAC y juzgado. La nómina falsa no se debe usar en Extranjería.
- **Servicios sociales:** `servicios_sociales_acceso` y `trabajadora_social_niega` explican quién puede pedir valoración, documentos, condiciones, negativa verbal, escrito por registro, reclamación, Defensor del Pueblo/autonómico y recurso. Se distingue derecho a información/valoración de la ayuda concreta (sujeta a criterios/presupuesto).
- **ONG por lugar:** `ong_por_lugar` y `ong_niega` explican el mapa de recursos municipal/autonómico, entidades nacionales y cómo reclamar si una ONG rechaza. El directorio incluye ACCEM, Red Acoge, Fundación Secretariado Gitano, Provivienda, RAIS y Fundación Madrina.
- **Concello/Xunta/Gobierno:** `concello_xunta_gobierno` separa padrón y servicios sociales (Concello), sanidad/educación/dependencia/empleo/vivienda (Xunta/CCAA) y extranjería/asilo/sanciones (Delegación/Subdelegación del Gobierno).
- **Discapacidad/dependencia/incapacidad:** `discapacidad_dependencia_incapacidad` y `ayuda_23_discapacidad` explican quién expide cada reconocimiento, requisitos de residencia (PNC 5/10 años), asilo y qué se puede pedir con 1 año.
- **Transporte:** `transporte_descuentos` y el trámite `tarjeta_transporte` explican abonos locales/metro, tarjeta de discapacidad, familia numerosa y descuentos de media/larga distancia; precios y requisitos varían por comunidad.
- **Renovación de TIE:** `tie_renovacion` y el trámite `renovacion` distinguen la renovación administrativa (Mercurio/sede, hasta 2 meses antes) de la TIE física/huellas (solo desde el vencimiento, nunca antes). El plan y el PDF muestran ambas fechas por separado.
- **Trámites terminados vs. en curso:** `docsTramites` = ya resueltos/emitidos; `docsEnCurso` = presentados y pendientes. Solo los primeros cuentan como certificado/documento existente; los segundos marcan expediente/nacionalidad pendiente y no se presentan como resueltos. El plan y el PDF los muestran en bloques separados.
- **Nacionalidad:** `ccse_dele` y `nacionalidad_plazos_paises` explican CCSE (25 preguntas, 45 min, 85 €), DELE A2 (unas 2,5 h, ~138 €), exenciones, inscripción y plazos de 1/2/5/10 años. Los trámites `examen_ccse` y `examen_dele` enlazan al Instituto Cervantes.
- **Renta:** `declaracion_renta` y el trámite homónimo explican umbrales (22.000/15.876 €), campaña 8 abril-30 junio, residencia fiscal (183 días/centro de intereses) y el caso de 3 meses trabajados. No confundir residencia legal con fiscal.

**Añadir una pregunta:** entrada en `faq.js` con `cat`, `q`, `short`, `detail` y, si procede, `links`; ejecuta `node tests/faq.test.js`.

---

## 23. Online, sedes y notificaciones

`data/online.js` alimenta la pestaña **Online**. No guarda credenciales ni pide Cl@ve: solo enlaza a sedes oficiales.

- **Identidad:** Cl@ve, certificado FNMT.
- **Notificaciones:** DEHú (`https://dehu.redsara.es/`) y Carpeta Ciudadana.
- **Extranjería:** sede de Extranjería, Mercurio (`https://mercurio.delegaciondelgobierno.gob.es/mercurio/`), tasas 790, ICPP.
- **DGT:** canje digital en sede DGT; se inicia online, pero el original se entrega en la Jefatura. Países con convenio pueden exigir cita.
- **Trabajo/justicia:** Import@ss, SEPE, AEAT, sede de Justicia.
- **Comunidad:** `SEDES` mapea cada región a su sede (Madrid, Galicia, etc.); `urlKey:'sede'` resuelve. Sanidad y educación usan las URLs de `regions.js`.

**Añadir un portal:** entrada con `title`, `what`, `requires`, `where`, `url` o `urlKey`, `mode` (`total`/`partial`/`info`) y `cat`; ejecuta `node tests/online.test.js` y `node tests/ui.smoke.js`.

**No prometer:** que un trámite sea 100 % online si exige cita, entrega de original o verificación. El badge `partial` lo indica.

---

## 24. Enlaces oficiales y auditoría

Los enlaces cambian. Antes de publicar:

```bash
python tests/check_links.py --all
```

- `OK` = 2xx/3xx.
- `BLQ` = 401/403/429: el organismo bloquea bots; comprobar en navegador.
- `MAL` = 4xx/5xx o página de error: hay que corregirlo.
- `?` = timeout/TLS: no se pudo verificar desde este entorno, pero no es un 404.

**Casos corregidos (20/11/2026):**

- **Cita previa de Policía/Extranjería:** el antiguo `sede.administracionespublicas.gob.es/pagina/index/directorio/icpplus` devuelve 503. El vigente es `https://icp.administracionelectronica.gob.es/icpplus`.
- **Registro Civil:** `sede.mjusticia.gob.es/es/tramites/cita-previa-registro-civil`.
- **Asistencia jurídica gratuita:** `sede.mjusticia.gob.es/es/tramites/asistencia-juridica-gratuita`.
- **Modelos EX:** enlazar a `https://www.inclusion.gob.es/web/migraciones/modelos-generales`, no a PDFs con rutas antiguas.
- **UGE-CE:** `https://inclusion.gob.es/web/unidadgrandesempresas/sobre-nosotros`.
- **Galicia:** empleo `https://conselleriaemprego.xunta.gal/`; servicios sociales `https://www.xunta.gal/politica-social`.

**No sustituir un enlace por la home** si se puede enlazar al trámite concreto. Si el organismo bloquea el rastreador (403/SSL), verificar en navegador antes de darlo por muerto.

# Continuidad — 21/11/2026

Nota para retomar el **22/11/2026**. El proyecto está en `E:\DeepSeekH\ruta-legal`.

## Estado

- App estática vanilla JS, sin backend, con `localStorage`.
- Build actual: `dist/ruta-legal.html` (~709 KB).
- **126 pruebas pasando**.
- **0 enlaces mal** en la última auditoría; 2 bloqueados por el organismo (403) y 4 no verificables por TLS/timeout.
- Contenido: **35 preguntas**, **32 trámites**, **28 ayudas**, **19 portales online**, **20 formularios/tasas**.

## Lo último que se tocó

1. **Página independiente de Formularios** (`view-formularios`, nav «Formularios»).
   - Buscador por código y filtros.
   - Añadidos **EX-17** (TIE) y **790-012** (tasa TIE).
   - Los modelos EX enlazan a la página oficial de modelos; la 790-012 va a la sede de Policía.
   - Hoja de datos con situación de pareja e hijos.
2. **Cuestionario familiar corregido**:
   - Situación real: soltero, casado (+ tipo de matrimonio), pareja registrada, pareja estable/concubinato, separado/divorciado, viudo, no lo sé.
   - Hijos separados en **comunes**, **solo del solicitante** y **solo de la pareja**.
   - `spanishChildType` distingue hijo común/propio/de la pareja.
   - Un hijo español solo de la pareja **no** abre la vía de progenitor.
   - El PDF y la hoja de datos muestran el desglose.
3. **Enlaces**:
   - ICPP corregido a `https://icp.administracionelectronica.gob.es/icpplus`.
   - Corregidos MITES/ITSS, Cervantes CCSE/DELE, homologación, Registro Civil, justicia gratuita, modelos EX, UGE, Xunta, RAIS/Madrina, sedes autonómicas.
   - Auditor: `python tests/check_links.py --all`.
4. **Renovación TIE (corrección importante)**:
   - Renovación administrativa por Mercurio/sede: hasta **2 meses antes** del vencimiento.
   - TIE física y huellas: **solo desde el día del vencimiento**, nunca antes.
   - Si la policía cita antes, no puede tomar huellas ni renovar la tarjeta.
   - Cambiados `engine.js` (ventanas/avisos), `procedures.js`, `faq.js` y `forms.js`.
5. **Contenido**: nacionalidad (CCSE/DELE, plazos por país), renta, servicios sociales, ONG, ayudas, discapacidad/dependencia/incapacidad, transporte, fraude laboral.

## Comandos

```bat
cd E:\DeepSeekH\ruta-legal
python tests/check_html.py
node tests/engine.test.js
node tests/familia.test.js
node tests/pdf.test.js
node tests/ui.smoke.js
python build.py
python tests/check_dist.py
python tests/check_links.py --all
```

Abrir: `dist\ruta-legal.html` o `start.bat`.

## Pendiente / siguiente

- Revisar los 4 enlaces no verificables desde este entorno:
  - `https://www.educastur.es/`
  - `https://www.juntadeandalucia.es/`
  - `https://www.juntadeandalucia.es/educacion/`
  - `https://www.sspa.juntadeandalucia.es/`
- Validar el nuevo cuestionario familiar con un caso real de 3 hijos (1 común + 2 de la pareja).
- Revisar el PDF familiar con un abogado y ajustar redacción si hace falta.
- No hay PWA, service worker, despliegue ni backend; se decidió no añadirlos por ahora.
- La fecha de contenido es **20/11/2026**; revisar `docs/FUENTES.md` antes de publicar.

## Archivos clave

- `assets/js/data/questions.js` — cuestionario.
- `assets/js/engine.js` — cálculo familiar y `RL.family`.
- `assets/js/forms.js` — catálogo de formularios.
- `assets/js/app.js` — vistas, formularios y hoja de datos.
- `assets/js/pdf.js` — PDF del plan y desglose familiar.
- `assets/js/data/online.js` — portales y sedes.
- `tests/check_links.py` — auditor de enlaces.
- `docs/FUENTES.md` — base legal.
- `docs/MANTENIMIENTO.md` — mantenimiento.

## Git

Repositorio inicializado en `E:\DeepSeekH\ruta-legal` en este cierre. El commit incluye app, datos, pruebas, documentación y build.

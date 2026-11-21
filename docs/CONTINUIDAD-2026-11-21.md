# Continuidad — 21/11/2026

Nota para retomar el **22/11/2026**. El proyecto está en `E:\DeepSeekH\ruta-legal`.

## Estado

- App estática vanilla JS, sin backend, con `localStorage`.
- Build actual: `dist/ruta-legal.html` (~709 KB).
- **160 pruebas pasando**.
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
6. **Vivienda**: pregunta si alquila piso, habitación, vive con familiar/amigo sin pagar, es propietario con/sin hipoteca u otra situación, y qué prueba de domicilio tiene. Se muestra en plan, PDF y hoja de datos.
7. **Documentos**: `docsTramites` (terminados) y `docsEnCurso` (en curso/pendientes) están separados. El plan y el PDF no mezclan un certificado emitido con un trámite pendiente.
8. **Familia y convivencia**: pareja, hijos y otras personas que conviven se cargan en el paso 1; la discapacidad/dependencia del titular se pregunta aparte y no se confunde con la de pareja o hijos.
9. **Asilo**: añadida la opción «Renuncié a la protección internacional» y campos separados día/mes/año (`asylumRenouncedDay`, `asylumRenouncedMonth`, `asylumRenouncedYear`), todos opcionales. No se trata como asilo en trámite; el arraigo se referencia desde la renuncia cuando hay mes/año.
10. **Formación**: añadido Bachillerato al nivel de estudios y campos de cursos SEPE terminados/en curso, con especialidad y duración.
11. **Ficha familiar**: nuevo paso «Tu pareja y tus hijos» con ficha de pareja y una ficha por cada hijo (nombre, edad, nacionalidad, vínculo, discapacidad, convivencia y estudios: ESO, Bachillerato, FP Básica/Medio/Superior, Universidad).
12. **Persistencia**: el perfil se guarda automáticamente en el navegador; se guarda el paso actual y se puede descargar/importar una copia JSON. Cambiar un dato no borra el resto.
13. **Navegación**: botón Atrás probado de paso 3 a 2 y a 1; el paso actual se conserva y se puede reanudar.
14. **TIE**: corregida la ficha. La foto (32 × 26 mm, fondo blanco) la lleva el solicitante; en comisaría solo se toman huellas. La TIE se recoge con una segunda cita, normalmente 30-45 días después, en la misma comisaría.
15. **Reagrupación**: se avisa en ficha, vía y FAQ de que solo vale si el familiar está fuera de España; si ya está aquí (turista, irregular o indocumentado), no se reagrupa.
16. **Latinoamericanos**: FAQ con vías de estudio, trabajo y ambas; trabajo 30 h en estudios; no hay visado para buscar trabajo; nacionalidad a 2 años no es visado de entrada.
17. **Residencia y discapacidad**: la situación distingue residencia temporal y larga duración. Si hay discapacidad, se pregunta reconocimiento, grado y vencimiento para el titular, la pareja, los hijos y cada ficha familiar.
18. **Historial de asilo**: se pregunta si el asilo se pidió antes de los 90 días, si se desistió/archivó, y qué pasó después (arraigo por formación, cuenta ajena, residencia aprobada). Si hay residencia posterior, no se muestra sobreestancia ni se trata el asilo como pendiente.
19. **Nacionalidad**: el plazo de 2 años se calcula desde la residencia legal, no desde turismo ni asilo solicitado; CCSE obligatorio y DELE solo para no hispanohablantes.

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

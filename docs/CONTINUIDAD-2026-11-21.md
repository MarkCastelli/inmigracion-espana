# Continuidad — 21/11/2026

Nota para retomar el **22/11/2026**. El proyecto está en `E:\DeepSeekH\ruta-legal`.

## Estado

- App estática vanilla JS, sin backend, con `localStorage`.
- Build actual: `dist/ruta-legal.html` (~709 KB).
- **182 pruebas pasando**.
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
20. **Asilo histórico**: una hoja blanca o tarjeta roja en «terminados» no mantiene la vía de seguimiento activa; solo cuentan los documentos en curso o un `asylumStage` activo.
21. **Familia individual**: cada miembro tiene situación legal, tiempo en España y necesidad; el plan muestra opciones separadas para pareja, cada hijo y otras personas.
22. **DGT**: fichas de canje de permiso extranjero, permiso B, moto A1/A2/A y profesional C/D con CAP; aviso de que el marco es estatal y cambian Jefatura, centros y autorizaciones locales.
23. **Asilo en una página**: todas las preguntas de asilo se agrupan en un paso propio después de «situación». Si renunciaste/desististe no se pregunta fecha de denegación ni recurso; el tiempo en España se pregunta una sola vez.
24. **Discapacidad de hijos**: grado, vencimiento y reconocimiento solo aparecen en la ficha del hijo cuando se marca que tiene discapacidad o está en trámite; al cambiar a “No”, se ocultan.
25. **Orden del formulario**: titular → datos generales de familia → pareja/hijos → objetivo → resto. El informe final incluye a todos y, si un hijo tiene discapacidad, añade una segunda opción a valorar.
26. **Renovación dinámica**: residencia → años/vencimiento → Mercurio → aprobación → huellas → retirada TIE, con avisos solo en el paso que corresponde.
27. **Alertas históricas**: si hay residencia, TIE o autorización posterior, no se muestran la visa de turista vieja ni los 90 días; solo los plazos actuales.
28. **Nacionalidad calculada**: si faltan meses, el paso 1 dice cuántos y la fecha en que cumple; si ya cumple, lo dice. También se refleja en el PDF.
29. **Acciones condicionadas**: con TIE no se pide padrón histórico; antecedentes solo si hay trámite; huellas solo después del vencimiento; argentinos/peruanos solo CCSE; hijos con ESO en España no necesitan CCSE ni DELE.
30. **Antecedentes por cita**: se pregunta si hay cita y la fecha; si falta más de 3 meses, la app dice esperar; si está cerca, pide el certificado; sin cita, no lo pide.
31. **Padrón por cita**: mismo criterio; con TIE no se pide certificado histórico, y sin cita o con cita a más de 3 meses no se pide el certificado actual.
32. **Gasto documental**: aviso de no pagar sin trámite, autoridad, requisito, vigencia y fecha; homologación y seguro solo con trámite concreto. Protocolo en `docs/GASTOS.md`.
33. **Informe para abogado**: el plan ya no emite vías recomendadas; genera hechos, familia, documentos, fechas y dudas, en pantalla y PDF. Los catálogos y guías quedan como información general.
34. **Razones humanitarias**: añadida vía propia (art. 128 RD 1155/2024), pregunta de supuesto concreto y ficha de trámite; no se concede por pobreza ni es automática.
35. **Empadronamiento**: ficha visible aunque no haya provincia; aviso destacado, requisitos para compartir vivienda, certificado histórico y qué hacer si lo deniegan.
36. **Renovación del padrón**: aviso de renovación cada 2 años para extranjeros no comunitarios sin residencia permanente; UE/EEE y permanentes no obligados. FAQ y ficha actualizadas.
37. **Online**: fichas de Mercurio, Registro Civil, universidades/homologación y enlace directo; se distingue qué es total, parcial o solo cita.
38. **Después de la nacionalidad**: guía ordenada (jura/promesa 180 días, Registro Civil, DNI/pasaporte, padrón, Seguridad Social, sanidad, Hacienda, banco, DGT) y FAQ con distinción entre obligatorio y recomendable.
39. **Modelos EX**: ficha Online con los códigos principales, para qué sirve cada uno y enlace al catálogo oficial de descarga.
40. **Discapacidad y dependencia**: preguntas ordenadas por categoría alfabética; nuevos casos de titular irregular, hijo menor, hijo adulto, dependencia y padres dependientes.
41. **Educación**: fichas de escolarización, libros/material/cheques, comedor/becas y becas generales; FAQ con plazos, documentos y diferencias por comunidad.
42. **Entidades locales**: Diversidades Acolle (Vigo/Pontevedra) en directorio y bloque «Entidades de apoyo en tu zona»; FAQ de asociaciones por provincia.
43. **Asilo 2026**: FAQ con quién puede solicitarlo, qué gana/pierde, por qué no hay probabilidad individual fiable y por qué no es una vía de regularización.
44. **Turista que quiere quedarse**: FAQ con documentos posibles (NIE, padrón, Cl@ve), límites (trabajo/estudios/arraigo) y vías excepcionales desde España.
45. **Primer día en España**: FAQ con orden de prioridades (seguridad/salud, vía legal, padrón, sanidad, menores, entidades, abogado).
46. **Negativa de servicios sociales**: FAQ ampliada con modelo de escrito, registro municipal/autonómico/estatal, Galicia (Xunta/Vigo), resguardo y reclamaciones.
47. **Trabajo sin papeles**: FAQ corregida; denunciar no da residencia automática. Se explican pruebas, arraigo, art. 129 RD 1155/2024 y riesgos de expulsión.
48. **No lucrativa y pensionistas**: fichas de residencia no lucrativa y emprendedor; FAQ con umbral 2026 (2.400 € + 600 €/familiar), pensión de 1.400 €, pareja que trabaja y alternativas.
49. **Entidades de Vigo/Galicia**: COGAMI, Cáritas Tui-Vigo, APAMP, FEGAMP; filtro por provincia y municipio; bloque fijo «Entidades de tu zona» en el directorio para que no lo oculte el filtro de categoría.
50. **Cobertura nacional**: bloque «Redes con sede local o provincial» (Cruz Roja, Cáritas, CEAR, ACCEM, Red Acoge, Cepaim, Médicos del Mundo, Movimiento por la Paz) para cualquier municipio; no se inventan sedes locales.
51. **Auditoría de enlaces**: 187 URLs estáticas y 130 resueltas por provincia/municipio; 0 errores 404. Diversidades pasa a HTTP (su web no tiene HTTPS), se corrigen Concello/Servicios Sociales de Vigo y se retira Movimiento por la Paz (530).
52. **León y Cádiz**: Cáritas León, Diaconía León, Cáritas Cádiz y Fundación Márgenes y Vínculos; se muestran en cualquier municipio de su provincia.
53. **Canales de YouTube**: Expediente Extranjero y Prixline en Ayuda, con aviso de que son canales independientes y no asesoramiento oficial.
54. **Idiomas (fase 1)**: selector en cabecera para español, árabe RTL, francés, inglés y rumano; navegación, portada y avisos traducidos. El contenido legal detallado sigue en español y se avisa en la propia interfaz.
55. **Política de traducción**: no se traduce la prosa larga que el navegador puede traducir; se priorizan navegación, formularios, botones, errores, avisos y RTL. Añadida guía de traducción del navegador con aviso de privacidad.
56. **Antes de emigrar**: nueva sección en el menú con testimonio corregido, agrupado por trabajo, vivienda, transporte, burocracia, educación, sociedad y emprendimiento; incluye aviso de opinión personal y corrige la afirmación sobre el paro.
57. **Registros online**: Online nombra la sede autonómica real (Xunta, Junta, Generalitat…), añade registro electrónico autonómico y Registro General del Estado; distingue registro civil, autonómico y estatal.

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

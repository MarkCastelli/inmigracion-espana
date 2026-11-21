> **Continuidad:** estado del proyecto y siguientes pasos en [`docs/CONTINUIDAD-2026-11-21.md`](docs/CONTINUIDAD-2026-11-21.md).

# Ruta Legal

**Tu situación en España, paso a paso.** Una app web que hace un diagnóstico guiado y devuelve un plan personalizado: qué vías legales encajan contigo, qué requisitos cumples, qué te falta, qué documentos necesitas y en qué orden.

- **Contenido revisado:** 20 de noviembre de 2026
- **Versión:** 1.0.0
- **Idioma:** español
- **Gratis para el inmigrante.** Sin registro, sin publicidad y sin compartir tus datos.
- **Sin servidor obligatorio:** funciona abriendo un archivo, sin internet.

> Ruta Legal es una herramienta de **orientación informativa**. No es un despacho de abogados, no tramita solicitudes y no garantiza la concesión de nada. La normativa cambia: confirma siempre en la fuente oficial y, si tu caso tiene aristas, consulta con un profesional.

---

## Por qué existe

Quien llega a España se encuentra con un mapa roto: arraigos, visados, reagrupación, nacionalidad, plazos que cambian, requisitos que dependen de si tienes un abuelo español, de cómo entraste o de cuánto llevas empadronado. La información está dispersa y mucha está desactualizada.

Ruta Legal convierte ese mapa en un plan concreto para **un perfil concreto**. No da una lista de opciones: dice cuáles aplican, cuáles no y por qué, y qué puedes hacer esta semana.

---

## Cómo usarla

### 1. Abrir directamente (lo más simple)

Haz doble clic en `index.html`. Funciona sin internet y sin instalar nada. Tus respuestas se guardan en el navegador.

> Si tu navegador bloquea el almacenamiento local en `file://`, usa el lanzador o el archivo único.

### 2. Con el lanzador (recomendado en escritorio)

Necesitas Python 3 (ya viene en Linux y macOS; en Windows se instala desde [python.org](https://www.python.org/downloads/)).

```bash
# Windows
start.bat

# Linux / macOS / Android (Termux)
sh start.sh

# o directamente
python3 serve.py
```

Abre `http://127.0.0.1:8765` y sirve la app sin caché. No hay backend: Python solo reparte los archivos.

### 3. Un solo archivo (móvil, correo, USB)

```bash
python3 build.py
```

Genera `dist/ruta-legal.html` con todo incrustado. Puedes enviarlo por correo, abrirlo desde el gestor de archivos del móvil o guardarlo en un pendrive. Funciona sin conexión.

### 4. En el móvil, desde el ordenador

```bash
python3 serve.py --lan
```

Muestra una URL de tu red local (`http://192.168.x.x:8765`). Ábrela en el móvil conectado a la misma wifi. La app no envía datos fuera de tu dispositivo; el servidor solo entrega los archivos.

---

## Qué hace

1. **Diagnóstico guiado** (6 pasos si estás fuera y 7 si estás en España, ~40 preguntas, muchas condicionales): nacionalidad, edad, ubicación, entrada, padrón, permiso, **documentos y trámites que ya tienes**, ascendencia, familia, trabajo, estudios, medios, antecedentes y objetivo.
2. **Motor de reglas + capa de decisión** que evalúa el perfil contra **33 vías** y devuelve:
   - vías recomendadas, ordenadas por encaje y urgencia;
   - requisitos cumplidos, pendientes y por confirmar;
   - vías descartadas con el motivo concreto;
   - alertas (situación irregular, sobreestancia, plazos, antecedentes…);
   - fechas clave calculadas (los 2 años de arraigo, la renovación, la nacionalidad a 2 años…);
   - checklist de documentos con progreso guardado.
3. **Catálogo completo** con ficha de cada vía: para quién es, requisitos, documentos, pasos, coste, plazos, riesgos y enlaces oficiales.
4. **Descargar el plan en PDF** para llevarlo al abogado: perfil, vías recomendadas, requisitos, documentos y fechas clave en un documento generado en el dispositivo. También puedes exportar/importar el perfil en JSON e imprimir. Puedes ver una muestra en [`docs/ejemplo-plan.pdf`](docs/ejemplo-plan.pdf).
5. **Formularios oficiales y hoja de datos**: pestaña **Formularios** con catálogo completo (EX-03, EX-17, EX-24, EX-31, tasas 790-012/052/026, nacionalidad y asilo), búsqueda por código y hoja de datos campo por campo. Los modelos se descargan en la sede oficial; no rellenamos ni firmamos el PDF.
6. **Dónde ir**: directorio de policía, extranjería, FNMT, Seguridad Social, SEPE, Registro Civil, salud, ayuntamiento/concello, educación, empleo, embajadas y entidades de ayuda. Se adapta a tu comunidad, provincia y municipio, y explica **qué se hace en cada sitio**.
7. **Trámites paso a paso**: qué hacer, enlace de cita, documentos que hay que llevar, tasa, plazos y errores frecuentes. Incluye NIE/TIE, arraigo, familiar de español, reagrupación, asilo, nacionalidad, renovación, paso de estudios a trabajo, padrón, tarjeta sanitaria, Seguridad Social, FNMT, consulado, homologación de ESO/Bachillerato/FP, homologación universitaria y UNEDasiss.
8. **Online**: portales para iniciar trámites, consultar expedientes y recibir notificaciones: Cl@ve, FNMT, DEHú, Carpeta Ciudadana, sede de Extranjería, Mercurio, DGT (canje de permiso), Import@ss, SEPE, AEAT, Justicia, tasas 790, ICPP y sedes autonómicas/locales. Se adapta a tu comunidad y avisa de lo que exige cita presencial.
9. **Preguntas frecuentes**: dudas reales de foros y consultas, ordenadas alfabéticamente y por tema: entrada, asilo, arraigo, estudios/trabajo, policía/sanciones, familia, documentos y ayudas. Con búsqueda y respuestas legales, no opiniones.
10. **Derechos y ayudas**: discapacidad, incapacidad permanente, dependencia, familia numerosa, menores, IMV, rentas mínimas, pensiones no contributivas, vivienda, transporte, asistencia jurídica gratuita y entidades. Explica qué es cada cosa, dónde se pide y qué no debes confundir.
11. **Consulta abierta con IA**: para lo que la app no puede resolver, genera un prompt con tu perfil, el diagnóstico, los motivos y las instrucciones; abre **DeepSeek** con el texto precargado, permite pegar la respuesta, descargarla en PDF y **repreguntar**. No se envía nada solo y no se guarda nada sin pulsar «Guardar».
12. **Escuchar en voz alta** con la voz del navegador (Web Speech API): el plan, la portada o cualquier sección, con selección de voz, velocidad, pausa y parada. Sin servidor y sin enviar texto a terceros.
13. **Ayuda**: glosario, preguntas frecuentes, teléfonos de emergencia, entidades gratuitas y una sección de **bulos** con la realidad normativa.

### Vías cubiertas

- **Desde España:** ciudadanos de la UE (certificado de registro), arraigo social, sociolaboral, socioformativo, segunda oportunidad, familiar de español, familiar de la UE, reagrupación, circunstancias excepcionales, asilo y **seguimiento de asilo (hoja blanca / tarjeta roja)**, larga duración, paso de estudios a trabajo, renovación, regularización de 2026 (cerrada) y su seguimiento.
- **Desde el exterior:** no lucrativa, estudios, trabajo por cuenta ajena y propia, nómada digital, altamente cualificado, emprendedor, entrada como turista y golden visa (derogada).
- **Nacionalidad:** origen (art. 17 CC), opción (art. 20 CC), 1 año por ascendencia (art. 22.2.f), 2 años (iberoamericanos y afines), 1 año por supuestos especiales, 10 años, Ley de Nietos (cerrada) y carta de naturaleza.

La lista vive en `assets/js/data/routes-*.js`; añadir una vía nueva no requiere tocar la interfaz.

### Cómo decide la app

No ordena por una puntuación bonita. Aplica este orden:

1. **Hechos**: normaliza el perfil y calcula tiempo en España, situación, permisos, documentos y familia.
2. **Puertas legales**: si una vía no es legalmente posible (nacionalidad, edad, permiso en vigor, asilo en curso, expediente abierto, plazo cerrado), se descarta con el motivo.
3. **Madurez**: primero las vías que puedes activar ya (`ready`/`likely`); después las que aún necesitan tiempo o requisitos (`almost`).
4. **Objetivo**: entre las vías posibles, prioriza la que responde a lo que quieres (regularizarte, trabajar, nacionalidad, familia).
5. **Derechos y plazos**: a igualdad de objetivo, prefiere la que da más derechos (5 años y trabajo libre frente a 1 año) y la que puedes sostener.
6. **Confianza y seguridad**: si faltan datos clave, lo marca como «por confirmar»; si hay una orden de salida, una denegación de asilo o violencia, la prioridad es buscar ayuda profesional.

El plan muestra **«Cómo hemos decidido»** con la prioridad, la confianza y los datos que faltan. La puntuación es solo un indicador de encaje, no la razón de la elección.

### Expectativa realista y supuestos familiares

La app no da un **porcentaje de concesión**: no existe un dato fiable sin expediente, pruebas y criterio de la oficina. Lo que sí da es un nivel:

- **Vía sólida**: requisitos esenciales cubiertos, pero la concesión no es automática.
- **Vía condicionada**: encaja, pero faltan pruebas o datos.
- **Vía frágil**: existe en abstracto, pero hoy no es realista.
- **Sin vía ordinaria**: no aparece una vía con esos datos; no es lo mismo que «imposible».

Y explica los supuestos que más se malinterpretan:

- **Casarse con un español/a** no legaliza automáticamente. Permite solicitar la tarjeta de familiar de español (5 años, trabajo) si el matrimonio es válido, está inscrito y convivís; hay que presentar la solicitud y probar el vínculo. Un matrimonio de conveniencia se deniega.
- **Pareja estable no registrada**: 12 meses de convivencia continuada o hijo en común, y hay que acreditarlo. Una relación ocasional no basta.
- **Embarazo de un español**: el embarazo no da residencia. El hijo será español si el padre lo reconoce; si no, puede hacer falta filiación judicial. Después, la madre puede solicitar como progenitor de menor español si el niño está a su cargo y convive con ella (o cumple obligaciones). No es automático.
- **Hijo nacido en España**: no es español por nacer aquí. Solo en los supuestos del art. 17 CC (progenitor español, progenitor nacido en España, apatridia…). Un hijo español no legaliza automáticamente al progenitor: hay que solicitar y acreditar cargo/convivencia u obligaciones.

El detalle legal está en [`docs/FUENTES.md`](docs/FUENTES.md). Puedes ver un plan de ejemplo con matrimonio y expectativa realista en [`docs/ejemplo-plan-familiar.pdf`](docs/ejemplo-plan-familiar.pdf).

### Formularios oficiales

Los modelos de extranjería se **renumeraron en 2025-2026** y muchas guías siguen enlazando los antiguos. En la app:

- **EX-31** es el formulario de **arraigo** (no el EX-10).
- **EX-24** es el de **familiares de persona con nacionalidad española**.
- **EX-10** es el de **circunstancias excepcionales** (no arraigo).
- **EX-32** es el de la **regularización extraordinaria de 2026**, cerrada.

Cada ficha enlaza al PDF oficial del Ministerio de Inclusión y a la sede. Además, «Preparar hoja de datos» abre un formulario con tus datos y genera un **PDF de apoyo** con cada campo, los documentos y las instrucciones. **No rellenamos el PDF oficial**: debe ser el impreso de la sede, firmado por ti. La hoja evita el error más común, que es no saber qué poner en cada casilla. Puedes ver una muestra en [`docs/ejemplo-hoja-datos.pdf`](docs/ejemplo-hoja-datos.pdf).

### Dónde ir

La pestaña **Dónde ir** es un directorio de oficinas y entidades. Se adapta a la **comunidad autónoma, provincia y municipio** que indiques:

- **Policía Nacional**: NIE, TIE, huellas, asilo y denuncias.
- **Oficina de Extranjería**: arraigos, residencia, reagrupación y renovaciones.
- **Casa de la Moneda y Timbre (FNMT)**: certificado digital; no expide NIE.
- **Seguridad Social, SEPE y Agencia Tributaria**: número de la Seguridad Social, vida laboral, empleo e impuestos.
- **Registro Civil y Ministerio de Justicia**: nacimiento, matrimonio, nacionalidad y antecedentes.
- **Servicios de tu comunidad**: sanidad, educación, servicios sociales, empleo y vivienda.
- **Ayuntamiento/Concello**: padrón, servicios sociales, policía local y escuela.
- **Centro de Salud y hospital**: tarjeta sanitaria, médico de familia y urgencias.
- **Embajadas y consulados**: pasaporte, antecedentes del país y documentos civiles.
- **Entidades de ayuda**: ACNUR, CEAR, Cruz Roja, Cáritas, Cepaim, Colegio de Abogados y sindicatos.

En Galicia la etiqueta local es **Concello** y la administración es la **Xunta**; en Cataluña, **Ajuntament**; en el País Vasco, **Udala**. El directorio no inventa direcciones: enlaza a la web oficial de cada administración y explica qué puedes hacer allí.

### Trámites y ventanas de oportunidad

La pestaña **Trámites** convierte el plan en una guía ejecutable:

- **Qué hacer, cuándo y dónde**: NIE/TIE, arraigo, familiar de español, reagrupación, asilo, nacionalidad, renovación, paso de estudios a trabajo, padrón, tarjeta sanitaria, Seguridad Social, FNMT y consulado.
- **Enlace de cita**: ICPP para NIE/TIE y huellas; sede de Extranjería para arraigo, familiar y renovación; sede de Justicia para nacionalidad; FNMT para certificado digital.
- **Qué llevar**: pasaporte, formulario, fotos, tasa, resolución, padrón, medios, antecedentes… según el trámite.
- **Tasa y pasos**: orden exacto, errores frecuentes y qué guardar.
- **Ventanas**: si el visado o permiso caduca, si te faltan meses para el arraigo, si estás en estudios o turismo, o si tienes pareja/familia española.

La app distingue **«ilegal»** de **«irregular»**: no existe una persona «ilegal»; lo ilegal es una conducta (entrar sin autorización, trabajar sin permiso). La situación administrativa es **irregular** cuando no hay autorización vigente. Estar irregular no es un delito penal: es una infracción administrativa que puede tener consecuencias y complicar solicitudes futuras.

### Renovación de la TIE: dos fechas distintas

- **Renovación administrativa:** se puede presentar por **Mercurio o sede** hasta **2 meses antes** del vencimiento. Sirve para que evalúen si aprueban la renovación y por cuánto tiempo.
- **TIE física y toma de huellas:** solo desde **el día en que vence la tarjeta**, nunca antes. Aunque la renovación esté aprobada, no se puede adelantar la tarjeta. La cita es por ICPP.
- Si la policía te cita antes del vencimiento, no puede tomar huellas ni renovar la TIE.

No confundas los dos trámites: **Mercurio evalúa; la Policía emite la tarjeta después del vencimiento**.

### Preguntas frecuentes

La pestaña **Preguntas** recoge dudas recurrentes de foros y consultas, pero **las respuestas están contrastadas con la norma**, no con la opinión del foro. Se pueden buscar por palabra y filtrar por tema:

- **Entrada**: patera vs visa de turista, sobreestancia, salir y volver.
- **Asilo**: solicitante en trámite, denegación, paso a arraigo.
- **Arraigo**: requisitos y tiempo computable.
- **Estudios y trabajo**: 30 h/semana, exceso, trabajo sin papeles, inspección, denuncia.
- **Policía y sanciones**: derechos, expulsión no automática, miedo.
- **Familia, documentos y ayudas**.
- **Ayuntamiento y trabajadora social**: qué se puede pedir, cómo se pide y qué límites tiene.
- **ONG más allá de Cáritas**: Cruz Roja, Cepaim, CEAR, ACCEM, Red Acoge, Fundación Secretariado Gitano, Provivienda, RAIS y Banco de Alimentos.
- **Muebles, gafas, alquiler, luz y vales de comida**: qué existe de verdad y qué no es automático.
- **Fraude laboral**: contrato de 30 h y 50 h reales, nómina dibujada, salario por debajo del convenio, Inspección de Trabajo y reclamación de salarios.
- **Servicios sociales**: quién puede pedir valoración, con qué documentos, qué pasa si no dan cita o deniegan la ayuda, y cómo reclamar.
- **ONG por lugar**: cómo encontrar el mapa de recursos de tu municipio/provincia, qué entidades existen además de Cáritas y qué hacer si una ONG rechaza.
- **Concello, Xunta y Oficina del Gobierno**: qué hace cada administración y a cuál ir para padrón, ayudas, sanidad, extranjería o asilo.
- **Discapacidad, dependencia e incapacidad**: diferencias, quién lo gestiona, qué se puede pedir con 1 año de residencia y qué pasa con el asilo.
- **Transporte**: abonos de bus/metro, tarjeta de discapacidad, familia numerosa y descuentos de media/larga distancia.
- **Nacionalidad**: CCSE y DELE A2 (centros, plazos, precio y exenciones), y años de residencia según el país o el vínculo personal.
- **Declaración de la renta**: quién está obligado, umbrales, fechas, residencia fiscal vs. residencia legal y el caso de pocos meses trabajados.

Dos respuestas clave que ahora están corregidas:

- **El tiempo como solicitante de asilo no cuenta para los 2 años de arraigo.** Mientras el asilo está pendiente no se puede pedir arraigo; si lo deniegan, se cuenta desde la denegación firme y hay que revisar el caso.
- **Trabajar más de 30 h con estudios** puede extinguir la estancia; no es solo un problema laboral.

### Online

La pestaña **Online** reúne los portales que permiten **iniciar, consultar o recibir notificaciones** sin ir a una oficina, con avisos de lo que sigue exigiendo cita:

- **Identidad**: Cl@ve y certificado digital FNMT.
- **Notificaciones**: DEHú (con app «Notifica») y Carpeta Ciudadana.
- **Extranjería**: sede de Extranjería, Mercurio (empresas/representantes), tasas 790 y cita ICPP.
- **DGT**: canje digital del permiso, pago de tasa y consulta; el canje se inicia online pero **hay que entregar el original en la Jefatura**. Los países con convenio pueden exigir cita.
- **Trabajo y justicia**: Import@ss, SEPE, AEAT, nacionalidad y antecedentes.
- **Comunidad y ayuntamiento**: sede autonómica, sanidad, educación y web municipal.

La sede autonómica cambia: **Madrid** usa `sede.comunidad.madrid` y **Galicia** `sede.xunta.gal`; la app elige la de tu provincia. No se piden contraseñas ni Cl@ve dentro de la app: solo se enlaza a la sede oficial.

### Derechos y ayudas

La pestaña **Derechos** separa cuatro cosas que se confunden constantemente:

- **Certificado de discapacidad**: lo expide la **comunidad autónoma** (servicios sociales o centro de valoración). Reconoce un grado (33 %, 65 %…). **No lo emite el ayuntamiento** ni la Seguridad Social. No es un permiso de residencia.
- **Incapacidad permanente**: la declara la **Seguridad Social (INSS)** y valora la capacidad laboral; puede dar pensión. No es el certificado de discapacidad y no garantiza el 33 %.
- **Dependencia**: la valora la comunidad (SAAD) y da servicios o prestaciones por necesitar apoyo en la vida diaria. Es distinta de la discapacidad y de la incapacidad laboral.
- **Familia numerosa**: es un **título de la comunidad autónoma** con ventajas educativas, fiscales, de transporte y vivienda. No es un certificado de discapacidad.

**Hijo adulto con discapacidad y tarjeta de 1 año:** no hay una respuesta única. Depende de la tarjeta:

- **Familiar de español**: la vía ordinaria es de 5 años; si tiene 1, revisa la resolución. Para renovar hay que mantener el vínculo, la convivencia o la dependencia y los medios.
- **Reagrupación**: la renovación se valora con los medios de la unidad familiar; si no hay empleo, pueden contar ingresos del reagrupante, pensión, dependencia o ayudas.
- **No lucrativa**: se renueva con medios (IPREM), no con contrato.
- **Trabajo**: pide contrato o medios; sin empleo, valora segunda oportunidad, modificación o larga duración.
- **Estudios**: no es una vía indefinida; valora modificación o familiar de español/UE.

La discapacidad **no sustituye** los requisitos de la tarjeta. Si no hay empleo ni medios, las opciones a revisar son medios del familiar, pensión/prestación, dependencia, larga duración tras 5 años, segunda oportunidad o circunstancias excepcionales. El arraigo no se puede pedir con una autorización en vigor o un expediente abierto.

**Menores:** tienen derecho a sanidad, educación, protección y servicios sociales con independencia de su situación administrativa. Nacer en España no da nacionalidad; si el padre/madre es español y reconoce, el hijo es español. Existe la residencia de menor acompañado nacido en España (art. 159), la tutela de menores no acompañados y el cambio al cumplir 18.

**Ayudas:** IMV, rentas mínimas autonómicas, pensión no contributiva de invalidez, dependencia, familia numerosa, ayudas de emergencia municipal, vivienda y asistencia jurídica gratuita. Muchas exigen residencia legal; las de emergencia municipal pueden no exigirla. Cada comunidad cambia requisitos, cuantías y plazos.

**Aviso:** ningún abogado puede garantizar que el certificado de discapacidad salga en un año. El grado y el plazo dependen del baremo y de la lista de espera. Desconfía de quien cobra por «conseguirlo» sin explicarte el procedimiento.

### Documentos, antecedentes y miedo a la policía

La app incluye guías para **vida laboral, antecedentes penales de España, antecedentes del país de origen, certificado de delitos sexuales, apostilla de La Haya, traducción jurada, padrón, tarjeta sanitaria y certificado de discapacidad**, con enlaces oficiales, documentos y pasos.

**Antecedentes:** no es lo mismo antecedentes penales, policiales y delitos sexuales. Muchas vías miran los últimos 5 años. Un antecedente de hace 1 año suele ser relevante; uno de hace 20 puede estar cancelado o no, según el país, el delito y la pena. No todos los delitos bloquean; se valora gravedad, cancelación y rehabilitación. No mientas: un certificado falso puede cerrarte todas las puertas.

**Si te para la policía:** estar irregular **no es un delito penal**, es una infracción administrativa. Eso no significa que no haya riesgo: una orden de salida, antecedentes, un control o trabajar sin permiso pueden complicar tu situación. La expulsión **no es automática** (requiere expediente, audiencia y resolución), pero puede ocurrir. Lleva pasaporte o NIE si lo tienes, no des identidad falsa, no firmes lo que no entiendas y, si te detienen, pide abogado, intérprete y avisa a un familiar o a tu consulado. No confíes en quien promete papeles por dinero.

### Reconocer estudios

La app distingue cuatro cosas:

- **Homologación**: un título extranjero se equipara a un título español (Graduado en ESO, Bachillerato, FP, Grado o Máster). Es lo que suele pedirse para trabajar o presentarse a una oposición.
- **Convalidación**: se reconocen asignaturas o cursos, pero **no te da un título**; sirve para continuar estudios o no repetir materias.
- **Equivalencia**: reconoce un nivel académico o de escolaridad; no siempre equivale a un título.
- **UNEDasiss**: acredita el **acceso a la universidad** con estudios extranjeros; no homologa el título.

**4º de ESO y Bachillerato:** si terminaste la secundaria obligatoria, puedes pedir la homologación al título de Graduado en ESO; si tienes 4º aprobado pero no el título, la vía es la convalidación o la equivalencia de escolaridad para seguir estudiando. Para Bachillerato, se homologa el título y después se accede a la universidad por UNEDasiss/EBAU. Para FP, se homologa el título o se valora la acreditación de competencias.

**Universidad:** la homologación de un título terciario a Grado/Máster se tramita en el **Ministerio de Ciencia, Innovación y Universidades** (Validate-TE). La **declaración de equivalencia** es distinta de la homologación. Para estudiar un grado con un bachillerato extranjero se usa **UNEDasiss**, no la homologación.

**Quién puede pedirlo:** cualquier persona con estudios extranjeros, con pasaporte o NIE. El trámite **no exige residencia legal** y **no regulariza** tu situación. Para matricularse en enseñanzas regladas o acceder a la universidad puede exigirse autorización de estancia/residencia o visado; eso es distinto del reconocimiento.

**Dónde:** Ministerio de Educación (no universitarios), Ministerio de Universidades/Validate-TE (superiores), UNEDasiss (acceso) y comunidad autónoma (convalidaciones y escolarización). Los enlaces y documentos están en **Trámites**.

### Consulta abierta con IA

Cuando el caso tiene una particularidad que la app no cubre, la pestaña **Consulta IA** permite:

1. Escribir la duda (o elegir una sugerencia: «mi caso no encaja», «me han denegado», «¿puedo cambiar de vía?»).
2. Generar un **prompt** con el perfil, el diagnóstico, las vías descartadas, la confianza, los documentos y las instrucciones para la IA. Puedes excluir documentos, ubicación y notas antes de generarlo.
3. **Abrir DeepSeek** con el prompt precargado (`?q=`); también ChatGPT. Si el prompt es muy largo, se copia y se abre la IA para pegarlo.
4. Pegar la respuesta, verla en la app, **descargarla en PDF** y **repreguntar** conservando el contexto anterior.

**Privacidad:** el prompt se genera en el dispositivo y solo se envía cuando tú pulsas enviar en la web de la IA. La app no tiene API key ni backend, así que no puede leer la respuesta sola: la pegas tú. Las consultas se guardan en `localStorage` solo si pulsas «Guardar».

**Aviso:** la respuesta es de una IA externa y puede ser incorrecta. No es asesoramiento jurídico. Contrástala con la sede o con un abogado de extranjería. Puedes ver una muestra en [`docs/ejemplo-consulta.pdf`](docs/ejemplo-consulta.pdf).

---

## Privacidad

- **No hay backend.** No hay cuentas, analítica, cookies de terceros ni llamadas a APIs.
- Las respuestas se guardan en `localStorage` de tu navegador, bajo la clave `ruta-legal.v1`.
- Puedes **exportar** una copia, **importarla** en otro navegador o **borrarlo todo** desde Ayuda.
- El **PDF se genera en tu dispositivo**: no se sube a ningún servidor ni pasa por ninguna API.
- La **lectura en voz alta** usa las voces instaladas en el navegador; el texto no se envía a ningún servicio externo.
- Si abres el archivo único en otro dispositivo, empiezas de cero: los datos no viajan con el archivo.

---

## Estructura

```
ruta-legal/
├── index.html                  # entrada única (sin build obligatorio)
├── assets/
│   ├── css/app.css             # sistema de diseño claro/oscuro + print
│   └── js/
│       ├── core.js             # utilidades, estado local, fechas, iconos
│       ├── engine.js           # motor de reglas y generador de plan
│       ├── decision.js         # capa de decisión: legalidad, prioridad, confianza
│       ├── forms.js            # catálogo de formularios oficiales y enlaces
│       ├── ai.js               # prompt para IA, apertura de DeepSeek y consultas
│       ├── pdf.js              # generador de PDF sin dependencias
│       ├── speech.js           # lectura en voz alta (Web Speech API)
│       ├── app.js              # asistente, plan, catálogo, trámites, directorio, documentos, ayuda
│       └── data/
│           ├── countries.js    # países y flags (2 años, UE, visado)
│           ├── regions.js      # 19 comunidades, 52 provincias y servicios
│           ├── directory.js    # directorio: qué se hace en cada oficina
│           ├── procedures.js   # trámites, citas, documentos y plazos
│           ├── aids.js         # derechos, discapacidad, dependencia y ayudas
│           ├── faq.js          # preguntas frecuentes por tema
│           ├── online.js       # sedes, trámites online y notificaciones
│           ├── questions.js    # cuestionario declarativo
│           ├── routes-espana.js
│           ├── routes-exterior.js
│           ├── routes-nacionalidad.js
│           └── resources.js    # glosario, FAQ, bulos, enlaces, aviso legal
├── serve.py                    # servidor local opcional (stdlib)
├── build.py                    # empaqueta dist/ruta-legal.html
├── start.bat / start.sh        # lanzadores
├── tests/
│   ├── harness.js              # carga las fuentes en Node
│   ├── check_links.py          # auditoría de enlaces (requiere red)
│   ├── engine.test.js          # 27 pruebas del motor
│   ├── decision.test.js        # 6 pruebas de la capa de decisión
│   ├── forms.test.js           # 7 pruebas del catálogo de formularios
│   ├── directorio.test.js      # 5 pruebas de regiones y directorio
│   ├── ai.test.js              # 4 pruebas de prompt y consultas
│   ├── procedures.test.js      # 4 pruebas de trámites, citas y documentos
│   ├── timing.test.js          # 6 pruebas de ventanas de oportunidad
│   ├── aids.test.js            # 5 pruebas de derechos, discapacidad y ayudas
│   ├── faq.test.js             # 5 pruebas de preguntas frecuentes
│   ├── online.test.js          # 3 pruebas de sedes y trámites online
│   ├── links.test.js           # 4 pruebas de enlaces y rutas muertas
│   ├── familia.test.js         # 12 pruebas de pareja, matrimonio, hijos y embarazo
│   ├── housing.test.js         # 3 pruebas de vivienda y prueba de domicilio
│   ├── docs.test.js            # 7 pruebas de trámites terminados/en curso
│   ├── pdf.test.js             # 10 pruebas del PDF
│   ├── speech.test.js          # 5 pruebas del lector de voz
│   ├── speech.mock.test.js     # 3 pruebas con Web Speech API simulada
│   └── ui.smoke.js             # 20 pruebas de interfaz con DOM mínimo
├── docs/
│   ├── FUENTES.md              # normativa, enlaces y fecha de consulta
│   ├── MANTENIMIENTO.md        # qué revisar, cuándo y dónde tocarlo
│   ├── ejemplo-plan.pdf        # muestra del PDF que descarga el usuario
│   ├── ejemplo-plan-familiar.pdf # muestra con matrimonio y expectativa realista
│   ├── ejemplo-hoja-datos.pdf  # muestra de hoja de datos para un EX-31
│   └── ejemplo-consulta.pdf     # muestra de consulta respondida por una IA
└── dist/ruta-legal.html        # archivo único generado
```

---

## Pruebas

No necesitas instalar dependencias:

```bash
node tests/engine.test.js     # motor y catálogo
node tests/decision.test.js   # prioridad, confianza y seguridad
node tests/forms.test.js      # modelos oficiales y enlaces
node tests/directorio.test.js # regiones, provincias y directorio
node tests/ai.test.js         # prompt, repregunta y consultas
node tests/procedures.test.js # trámites, citas y documentos
node tests/timing.test.js     # ventanas de oportunidad
node tests/aids.test.js       # derechos, discapacidad y ayudas
node tests/faq.test.js        # preguntas frecuentes
node tests/online.test.js     # sedes y trámites online
node tests/links.test.js      # rutas de enlaces muertas
node tests/familia.test.js    # matrimonio, pareja estable, embarazo e hijo español
node tests/housing.test.js    # vivienda: piso, habitación, familiar, propiedad
node tests/docs.test.js       # trámites terminados vs. en curso
node tests/pdf.test.js        # generación del PDF y hoja de datos
node tests/speech.test.js     # guion y troceado de la voz
node tests/speech.mock.test.js # cola de lectura con API simulada
node tests/ui.smoke.js        # renderizado de las vistas
python tests/check_links.py   # comprobar enlaces (requiere red)
python build.py               # verifica el empaquetado
```

Las pruebas cubren: integridad del catálogo, requisitos que devuelven valores válidos, perfiles reales (cubano irregular, nieto venezolano, cónyuge de española, nómada digital, turista con sobreestancia), ciudadanos de la UE, nacionales españoles, menores, **documentos de asilo (hoja blanca, tarjeta roja, cita)**, expedientes de extranjería abiertos, checklist sin duplicados, línea temporal, determinismo del plan, estructura del PDF (xref, objetos, longitudes de stream y acentos), **formularios oficiales, directorio geográfico, prompt de IA, repreguntas, PDF de consulta, matrimonio, pareja estable, embarazo e hijo español**.

> El runner `node --test` no funciona en este entorno Windows porque el sandbox bloquea la creación de procesos. Los archivos se ejecutan directamente, en el mismo proceso.

---

## Limitaciones conocidas

- **No sustituye a un abogado.** Los casos con antecedentes, denegaciones, expulsiones o asilo necesitan acompañamiento profesional.
- **La ley se mueve.** IPREM, SMI, tasas, catálogo de ocupaciones y umbrales de la UGE-CE cambian cada año; los plazos políticos también. El contenido lleva fecha y fuentes, pero no es un feed en vivo.
- **No damos porcentajes de concesión.** El nivel «vía sólida» significa requisitos cubiertos, no que la oficina vaya a conceder. La valoración depende de pruebas, convivencia, credibilidad y antecedentes.
- **No hay backend** ni actualización automática. Actualizar la app es sustituir archivos (o volver a generar el HTML único).
- **La consulta IA es externa y no verificada.** Puede inventar normas, tasas o plazos. La app genera el prompt y muestra la respuesta, pero no la valida; el aviso y la recomendación de abogado se mantienen siempre.
- **No se puede leer la respuesta de la IA automáticamente** sin backend/API key: el usuario la pega. Es una limitación deliberada de privacidad, no un fallo.
- **El diagnóstico depende de lo que respondas.** Si marcas «no lo sé», el plan lo refleja como «por confirmar». Tampoco verificamos los documentos que marques: el plan se basa en tu declaración.
- **No tramita nada.** No rellena formularios oficiales, no pide citas y no paga tasas.
- **La voz depende de tu sistema.** La app usa las voces que tengas instaladas (Chrome, Edge, Safari o tu sistema operativo). Si no hay voz en español, se usará la voz por defecto; la calidad y la disponibilidad cambian entre dispositivos.
- **Cifras marcadas como orientativas:** el importe exacto en euros de algunas tasas, el umbral reducido del PAC y el silencio en renovaciones están pendientes de confirmación oficial (ver [`docs/FUENTES.md`](docs/FUENTES.md)).

---

## Fuentes

El contenido se apoya en normativa consolidada y fuentes oficiales consultadas el **20/11/2026**: LO 4/2000, RD 1155/2024, RD 316/2026, STS de 8/7/2026, Orden PJC/617/2025, Código Civil (arts. 17-26), Ley 20/2022, RD 1004/2015, Ley 14/2013, LO 1/2025, Ley 28/2022, RD 240/2007, Reglamentos UE 2016/399 y 2018/1806, IPREM 2026 y SMI 2026. El detalle con enlaces está en [`docs/FUENTES.md`](docs/FUENTES.md).

---

## Hoja de ruta

- [ ] Traducción al inglés, portugués y árabe (el motor ya separa datos de interfaz).
- [ ] Modo «acompañante» para una entidad social: varios perfiles en el mismo dispositivo.
- [ ] Generación de PDF maquetado (hoy se usa la impresión del navegador).
- [ ] Comprobador de plazos con recordatorios locales.
- [ ] Actualización semestral firmada del paquete de contenido.

---

**Hecho para que la información no sea el privilegio de quien puede pagar un abogado.**

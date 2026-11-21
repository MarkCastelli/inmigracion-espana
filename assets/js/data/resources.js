/* ============================================================
   Ruta Legal · recursos, glosario, FAQ y bulos
   ============================================================ */
(function () {
  'use strict';
  var RL = window.RL = window.RL || {};

  RL.resources = {
    links: [
      { t: 'Ministerio de Inclusión, Seguridad Social y Migraciones', u: 'https://www.inclusion.gob.es/', d: 'Extranjería, arraigos, autorizaciones y regularización.', tag: 'Oficial' },
      { t: 'Modelos oficiales de extranjería (EX)', u: 'https://www.inclusion.gob.es/web/migraciones/modelos-generales', d: 'Lista oficial y actualizada de todos los impresos EX.', tag: 'Formularios' },
      { t: 'Tasas 790 · Sede de Administraciones Públicas', u: 'https://sede.administracionespublicas.gob.es/procedimientos/index/categoria/33', d: 'Descarga y pago de la tasa 790-052 de extranjería.', tag: 'Tasas' },
      { t: 'Sede electrónica de la Administración', u: 'https://sede.administracion.gob.es/', d: 'Citas, tasas 790, trámites y consulta de expedientes.', tag: 'Oficial' },
      { t: 'Ministerio de Justicia · Nacionalidad', u: 'https://www.mjusticia.gob.es/es/ciudadania/nacionalidad/informacion-nacionalidad', d: 'Requisitos, modelos y tasa 790-026.', tag: 'Oficial' },
      { t: 'Registro Civil', u: 'https://sede.mjusticia.gob.es/es/tramites/cita-previa-registro-civil', d: 'Inscripciones, certificados y citas.', tag: 'Oficial' },
      { t: 'BOE · Reglamento de Extranjería', u: 'https://www.boe.es/buscar/act.php?id=BOE-A-2024-24099', d: 'Texto consolidado del RD 1155/2024.', tag: 'Normativa' },
      { t: 'BOE · Código Civil (arts. 17-26)', u: 'https://www.boe.es/buscar/act.php?id=BOE-A-1889-4763', d: 'Nacionalidad: origen, opción, residencia y renuncia.', tag: 'Normativa' },
      { t: 'Instituto Cervantes · DELE y CCSE', u: 'https://cervantes.org/es/examenes', d: 'Inscripción, fechas y precios de los exámenes.', tag: 'Exámenes' },
      { t: 'UGE-CE · Grandes empresas', u: 'https://inclusion.gob.es/web/unidadgrandesempresas/sobre-nosotros', d: 'Nómada digital, altamente cualificado y emprendedor.', tag: 'Oficial' },
      { t: 'ACNUR España', u: 'https://www.acnur.org/es-es/', d: 'Información y apoyo para solicitantes de asilo.', tag: 'Ayuda' },
      { t: 'CEAR', u: 'https://www.cear.es/', d: 'Asilo, refugio y acompañamiento jurídico gratuito.', tag: 'Ayuda' },
      { t: 'Cruz Roja · Extranjería', u: 'https://www2.cruzroja.es/', d: 'Orientación, clases de español y apoyo social.', tag: 'Ayuda' },
      { t: 'Cáritas · Personas migrantes', u: 'https://www.caritas.es/', d: 'Acogida, asesoría y recursos por provincia.', tag: 'Ayuda' },
      { t: 'Fundación Cepaim', u: 'https://cepaim.org/', d: 'Acompañamiento jurídico y social a migrantes.', tag: 'Ayuda' },
      { t: 'Consejo General de la Abogacía', u: 'https://www.abogacia.es/', d: 'Turno de oficio y colegios de abogados.', tag: 'Legal' },
      { t: 'Defensor del Pueblo', u: 'https://www.defensordelpueblo.es/', d: 'Quejas por mala actuación administrativa.', tag: 'Legal' },
      { t: 'Sutramiteconsular · cita de visados', u: 'https://sutramiteconsular.maec.es/', d: 'Cita previa en consulados de España.', tag: 'Consular' }
    ],
    phones: [
      { n: '016', d: 'Violencia de género. Gratuito, confidencial y 24 h. No deja rastro en la factura.' },
      { n: '024', d: 'Atención a la conducta suicida. Gratuito, confidencial y 24 h.' },
      { n: '900 10 55 55', d: 'Teléfono de atención a víctimas de trata de seres humanos.' },
      { n: '112', d: 'Emergencias (sanitarias, policía, incendios).' },
      { n: '091 / 062', d: 'Policía Nacional / Guardia Civil.' }
    ],
    glossary: [
      { term: 'NIE', def: 'Número de Identidad de Extranjero. Es un número, no un permiso: no te legaliza, pero lo necesitas para casi todo.' },
      { term: 'Ilegal / irregular', def: 'No existe una persona «ilegal». Lo ilegal es una conducta: entrar sin autorización, trabajar sin permiso, no respetar una prohibición. La situación administrativa es «irregular» cuando no tienes autorización vigente. Se dice «persona en situación irregular», no «inmigrante ilegal».' },
      { term: 'TIE', def: 'Tarjeta de Identidad de Extranjero. El documento físico que acredita tu autorización de residencia o estancia.' },
      { term: 'Hoja blanca', def: 'Resguardo que se entrega al presentar la solicitud de asilo. Suele valer 1 mes y prorrogarse hasta 6 meses desde la solicitud; después se expide la tarjeta roja si el expediente sigue vivo.' },
      { term: 'Tarjeta roja', def: 'Documento de solicitante de protección internacional. Acredita que tu solicitud sigue en trámite y tiene fecha de caducidad: hay que renovarla.' },
      { term: 'Certificado digital / Cl@ve', def: 'Sistema de identificación electrónica. Permite hacer trámites online (renovaciones, nacionalidad, consulta de expedientes) sin cita presencial.' },
      { term: 'Autorización de regreso', def: 'Permiso para salir de España y volver mientras se renueva o tramita tu residencia. Tiene una vigencia limitada (no superior a 90 días).' },
      { term: 'Resguardo de extranjería', def: 'Justificante de que has presentado un trámite. No siempre equivale a residencia legal, pero acredita la presentación y bloquea el arraigo mientras el expediente esté abierto.' },
      { term: 'Estancia', def: 'Situación temporal (turismo, estudios) sin ánimo de residir. No cuenta como residencia para la nacionalidad.' },
      { term: 'Residencia', def: 'Autorización para residir de forma estable. Puede ser temporal (1-5 años) o de larga duración.' },
      { term: 'Arraigo', def: 'Autorización de residencia por circunstancias excepcionales basada en la permanencia en España. Desde 2025, 2 años en la mayoría de modalidades.' },
      { term: 'Reagrupación', def: 'Traer a España a tu cónyuge, hijos o ascendientes cuando tú ya resides legalmente.' },
      { term: 'Nacionalidad de origen', def: 'La que se tiene desde el nacimiento por ser hijo de español. No se solicita: se inscribe.' },
      { term: 'Nacionalidad por opción', def: 'Acto voluntario para ciertos hijos de españoles o personas con filiación tardía.' },
      { term: 'Carta de naturaleza', def: 'Concesión discrecional y excepcional de la nacionalidad por el Consejo de Ministros.' },
      { term: 'IPREM', def: 'Indicador Público de Renta de Efectos Múltiples. En 2026: 600 €/mes, 7.200 €/año (12 pagas) y 8.400 €/año (14 pagas).' },
      { term: 'SMI', def: 'Salario Mínimo Interprofesional. En 2026: 1.221 €/mes (17.094 €/año).' },
      { term: 'Padrón', def: 'Registro del ayuntamiento que acredita dónde vives. Es gratis y es la prueba principal de permanencia.' },
      { term: 'Apostilla', def: 'Sello internacional (Convenio de La Haya) que da validez a un documento extranjero. Si el país no es firmante, se usa la legalización consular.' },
      { term: 'Silencio administrativo', def: 'Lo que se entiende cuando la Administración no responde en plazo. Puede ser positivo (concedido) o negativo (denegado).' },
      { term: 'Orden de salida', def: 'Resolución que te obliga a abandonar España. Puede llevar prohibición de entrada.' },
      { term: 'Prohibición de entrada', def: 'Impedimento para entrar en España o Schengen durante un tiempo (hasta 3 años o más).' },
      { term: 'Tarjeta roja', def: 'Documento que acredita que has solicitado asilo y que tu estancia es legal mientras se tramita.' },
      { term: 'UGE-CE', def: 'Unidad de Grandes Empresas y Colectivos Estratégicos. Tramita nómadas digitales, altamente cualificados y emprendedores.' },
      { term: 'GECCO', def: 'Gestión Colectiva de Contrataciones en Origen. Permite contratar trabajadores en su país para ocupaciones con demanda.' },
      { term: 'Homologación', def: 'Reconocimiento oficial de un título extranjero para ejercer una profesión regulada en España.' },
      { term: 'DELE A2', def: 'Diploma de español como lengua extranjera. Se exige para la nacionalidad por residencia, salvo exenciones.' },
      { term: 'CCSE', def: 'Prueba de conocimientos constitucionales y socioculturales de España. Obligatoria para la nacionalidad por residencia.' },
      { term: 'EES', def: 'Sistema de Entradas y Salidas de la UE. Registra digitalmente entradas y salidas; operativo desde abril de 2026.' },
      { term: 'ETIAS', def: 'Autorización de viaje para países exentos de visado. Aplazada sin fecha en agosto de 2026: todavía no existe.' }
    ],
    faq: [
      { q: '¿Cómo funciona la lectura en voz alta?', a: 'La app usa la voz que tu navegador tiene instalada (Web Speech API). Pulsa el altavoz de arriba o el botón «Escuchar plan». Puedes elegir voz y velocidad, pausar y detener. El texto no se envía a ningún servidor: se lee en tu dispositivo. La calidad depende de las voces instaladas en tu sistema.' },
      { q: '¿Rellenáis los formularios oficiales?', a: 'No. Rellenar y firmar un impreso oficial es un acto personal; además, algunos son formularios web con validaciones y tasas. Lo que hacemos es darte el enlace al modelo vigente y una hoja de datos con cada campo para que lo copies, lo firmes y lo presentes. Así evitas el error más común: no saber qué poner en cada casilla.' },
      { q: '¿Qué formulario me toca?', a: 'En cada vía del catálogo y en tu checklist tienes el modelo (EX-31 para arraigo, EX-24 para familiares de personas con nacionalidad española, EX-10 para circunstancias excepcionales, EX-11 para larga duración…). Ojo: los modelos se renumeraron en 2025-2026; no uses un EX antiguo descargado de otra web.' },
      { q: '¿Cómo elegís la vía que me recomendáis?', a: 'Primero aplicamos la ley: si una vía no es legalmente posible para tu caso, se descarta aunque parezca buena. Después miramos tu objetivo (regularizarte, trabajar, nacionalidad, familia). Por último, ordenamos por derechos y plazos: no es lo mismo una tarjeta de 5 años que un arraigo de 1. La puntuación que ves es solo un indicador de encaje, no decide el orden. En el plan tienes un bloque «Cómo hemos decidido» con la prioridad, la confianza y los datos que faltan.' },
      { q: '¿Es gratis?', a: 'Sí, totalmente gratis para el inmigrante. No hay pago, ni registro, ni versión premium. No vendemos tus datos ni mostramos publicidad. Ruta Legal es una ayuda para entender tus opciones; si algo no te cuadra, contrasta con un abogado o una entidad social.' },
      { q: '¿Puedo descargar el plan en PDF?', a: 'Sí. En tu plan tienes el botón «Descargar PDF para tu abogado». Genera un documento en tu propio dispositivo con tus datos, las vías recomendadas, los requisitos que cumples y los que te faltan, los documentos y las fechas clave. Está pensado para que un abogado de extranjería empiece con la información ordenada y no te haga repetirla.' },
      { q: '¿Qué diferencia hay entre la hoja blanca y la tarjeta roja?', a: 'La hoja blanca (resguardo de presentación de la solicitud de asilo) se entrega al formalizar la solicitud; suele valer 1 mes y prorrogarse hasta 6 meses desde la solicitud. La tarjeta roja llega después, cuando la solicitud sigue en trámite; acredita tu condición de solicitante y, pasados 6 meses, puede incluir autorización para trabajar. Ambas tienen fecha de caducidad: revísala.' },
      { q: '¿Puedo trabajar si tengo el asilo en trámite?', a: 'Como regla general, tras 6 meses desde la solicitud y si no hay denegación, puedes solicitar autorización de trabajo. No esperes al último día: revisa la fecha de tu hoja blanca o tarjeta roja y consulta en la Oficina de Asilo o con una entidad especializada.' },
      { q: 'Tengo un resguardo de extranjería, ¿puedo pedir arraigo?', a: 'No mientras tengas un expediente abierto: el art. 126.h del Reglamento impide solicitar arraigo a quien ya es titular de una autorización o está interesado en un procedimiento de estancia o residencia. Termina o desiste de ese expediente antes de plantear el arraigo, con asesoramiento.' },
      { q: '¿Estoy en situación irregular? ¿Qué riesgo tengo?', a: 'Si no tienes autorización de estancia o residencia en vigor, estás en situación irregular. No es un delito: es una infracción administrativa. Puede conllevar multa y, en algunos casos, expulsión con prohibición de entrada. El riesgo principal es salir del espacio Schengen: el EES registra la sobreestancia y la prohibición puede activarse en la frontera.' },
      { q: '¿Puedo trabajar mientras espero una resolución?', a: 'Depende de la vía. El arraigo sociolaboral permite trabajar desde la admisión a trámite. La solicitud de asilo permite trabajar tras 6 meses. Otras autorizaciones no. Trabajar sin autorización puede generar un expediente sancionador.' },
      { q: '¿Puedo salir de España mientras espero?', a: 'Con carácter general, no. Si estás irregular, salir puede activar una prohibición de entrada y rompe la permanencia continuada que exige el arraigo. Si tienes una autorización en trámite, necesitas comprobar si puedes volver. Consulta antes con un abogado.' },
      { q: '¿Cuánto cuesta regularizarse?', a: 'Las tasas oficiales son moderadas (38,28 € un arraigo, 104,05 € la nacionalidad), pero los costes reales incluyen traducciones, apostillas, abogado y meses sin trabajar. En el plan de cada vía verás el desglose.' },
      { q: '¿Necesito un abogado?', a: 'No es obligatorio en todos los trámites, pero en casos complejos (antecedentes, denegaciones, asilo, reagrupación) marca la diferencia. Muchas entidades sociales ofrecen orientación gratuita. Los colegios de abogados tienen turno de oficio.' },
      { q: '¿Qué es exactamente el arraigo?', a: 'Es una autorización de residencia por circunstancias excepcionales. Desde el Reglamento de 2025, el arraigo social exige 2 años de permanencia continuada, medios económicos o informe de integración, y no tener otra autorización ni expediente abierto.' },
      { q: '¿Puedo pedir asilo?', a: 'Sí, si temes ser perseguido o sufrir daños graves en tu país. Se solicita en España, incluso estando irregular, y tu estancia pasa a ser legal mientras se tramita. No es una vía rápida y la tasa de denegación es alta: busca acompañamiento especializado.' },
      { q: '¿Es lo mismo «ilegal» que «irregular»?', a: 'No. «Ilegal» no es una categoría jurídica de la persona: lo ilegal es una conducta (entrar sin autorización, trabajar sin permiso). «Irregular» describe una situación administrativa: no tener autorización de residencia o estancia vigente. Decir «inmigrante ilegal» es incorrecto y estigmatizante; lo correcto es «persona en situación irregular». Estar irregular no es un delito penal: es una infracción administrativa que puede tener consecuencias (expulsión, prohibición de entrada) y complicar solicitudes futuras.' },
      { q: 'Si estoy irregular, ¿me detienen automáticamente?', a: 'No. La irregularidad no implica detención ni expulsión automática. Se tramita un expediente administrativo con audiencia y recurso. Pero sí puede aparecer en el expediente de extranjería y complicar un visado, una nacionalidad o la valoración de integración. Si tienes una orden de salida o una denegación, busca abogado.' },
      { q: '¿Puedo trabajar mientras estoy irregular?', a: 'No. Trabajar sin autorización es una infracción laboral y migratoria, y puede perjudicarte en un futuro arraigo o renovación. Si estás en esa situación, busca asesoría antes de aceptar un trabajo sin contrato.' },
      { q: 'Me caso con un español/a, ¿me legaliza automáticamente?', a: 'No. El matrimonio no te da la residencia por sí solo. Te permite solicitar la tarjeta de familiar de español (5 años y trabajo) si el matrimonio es válido, está inscrito y convivís; hay que presentar la solicitud y probar el vínculo. Un matrimonio de conveniencia se deniega.' },
      { q: 'Estoy irregular y me quedo embarazada de un español. ¿Qué pasa?', a: 'El embarazo no te regulariza. Si el padre es español y reconoce al hijo, el hijo será español de origen; si no lo reconoce, la filiación puede tener que declararse judicialmente. Después del nacimiento, la madre puede solicitar como progenitor de menor español si el niño está a su cargo y convive con ella, o si cumple las obligaciones. No es automático.' },
      { q: 'Mi hijo nace en España, ¿es español? ¿Me legaliza?', a: 'No por nacer en España. Un hijo de padres extranjeros solo es español de origen en los supuestos del art. 17 CC (por ejemplo, si un progenitor es español, si un progenitor nació en España, o si ambos carecen de nacionalidad). Si el padre es español y lo reconoce, el hijo es español. Que el hijo sea español no legaliza automáticamente a la madre: puede solicitar como progenitor de menor español si acredita cargo y convivencia (o cumplimiento de obligaciones).' },
      { q: 'Mi pareja es española pero no estamos casados, ¿puedo solicitar?', a: 'Sí, como pareja estable no registrada, pero necesitas 12 meses de convivencia continuada o un hijo en común, y pruebas (padrón conjunto, certificado de convivencia, etc.). Una relación ocasional no basta. Si estáis registrados como pareja de hecho, la vía es la de pareja registrada.' },
      { q: 'Si obtengo la nacionalidad, ¿se regulariza mi familia?', a: 'No automáticamente. La nacionalidad no regulariza a tus familiares. Tendrás que usar reagrupación familiar o las vías de familiar de español, que tienen requisitos propios.' },
      { q: '¿Qué pasa si me deniegan?', a: 'Depende del trámite: puedes recurrir en reposición o ir a la vía contencioso-administrativa, con plazos distintos. En algunos casos, la denegación abre la puerta a otra vía (por ejemplo, de arraigo a circunstancias excepcionales). Guarda siempre la resolución y busca asesoramiento.' },
      { q: '¿Cuánto tarda todo?', a: 'Los plazos legales van de 3 meses (extranjería) a 1 año (nacionalidad), pero en la práctica se alargan. El cuello de botella suele ser conseguir cita. Planifica con meses de margen.' },
      { q: '¿Qué documentos necesito siempre?', a: 'Pasaporte de tu país (no el español), completo; certificado de antecedentes penales de tu país (apostillado y traducido), certificado de empadronamiento y prueba de medios económicos. Casi todo lo demás depende de la vía.' },
      { q: '¿Esta app es fiable?', a: 'Está construida con normativa y fuentes oficiales, con fecha de revisión visible. Pero la ley cambia y cada caso tiene matices: úsala para entender tus opciones y confirmar antes de presentar nada. No sustituye a un profesional.' }
    ],
    myths: [
      { myth: '«La Ley de Nietos se ha ampliado hasta 2026 o 2027.»', truth: 'El plazo cerró el 22 de octubre de 2025 y no se ha reabierto. Solo pueden formalizar quienes pidieron cita antes de esa fecha con justificante.', source: 'Consulados de España, 2025-2026' },
      { myth: '«El Tribunal Supremo ha anulado las nacionalidades de la Ley de Nietos.»', truth: 'No. Lo que se suspendió fueron los efectos electorales (voto CERA) de 163.355 inscripciones. Las nacionalidades concedidas siguen siendo válidas.', source: 'Auto del TS de 12/10/2026' },
      { myth: '«Los nietos ya no pueden obtener la nacionalidad.»', truth: 'Sí pueden: por el art. 22.2.f del Código Civil, con 1 año de residencia legal, o por el art. 17 si su progenitor era español al nacer.', source: 'Código Civil, art. 22.2.f' },
      { myth: '«Los iberoamericanos están exentos del CCSE.»', truth: 'Solo están exentos del DELE A2. El CCSE lo tienen que hacer todos, salvo ajustes por discapacidad.', source: 'RD 1004/2015, art. 6' },
      { myth: '«El arraigo social exige 3 años.»', truth: 'Desde el Reglamento de 2025 son 2 años de permanencia continuada, con ausencias no superiores a 90 días.', source: 'RD 1155/2024, art. 126' },
      { myth: '«El arraigo familiar sirve para cónyuges e hijos de españoles.»', truth: 'Ya no. Los familiares de españoles tienen su propio capítulo: tarjeta de 5 años, sin permanencia previa y con trabajo libre.', source: 'RD 1155/2024, arts. 93-99' },
      { myth: '«La golden visa sigue existiendo para invertir en vivienda.»', truth: 'Está derogada por completo desde el 3 de abril de 2025 (LO 1/2025). Invertir no da residencia.', source: 'BOE, LO 1/2025' },
      { myth: '«Puedo pedir la residencia no lucrativa desde España como turista.»', truth: 'No. La no lucrativa, el trabajo por cuenta ajena y los estudios se solicitan en el consulado. Desde España solo puedes pedir nómada digital (UGE-CE), arraigo, asilo o familiar de español/UE.', source: 'RD 1155/2024 y Ley 14/2013' },
      { myth: '«Si me paso de los 90 días me detienen al día siguiente.»', truth: 'No. Es una infracción administrativa que se tramita con expediente, audiencia y recurso. El riesgo real es la prohibición de entrada al salir y la dificultad para futuros trámites.', source: 'LO 4/2000, arts. 53 y 55' },
      { myth: '«La regularización extraordinaria de 2026 sigue abierta.»', truth: 'La ventana fue del 16 de abril al 30 de junio de 2026. Está cerrada y no se ha prorrogado.', source: 'RD 316/2026, DA 21.ª' }
    ],
    legal: {
      title: 'Aviso legal y privacidad',
      updated: '20 de noviembre de 2026',
      blocks: [
        { h: 'Qué es Ruta Legal', p: 'Ruta Legal es una herramienta de orientación informativa, gratuita para el inmigrante, sin registro y sin publicidad. No es un despacho de abogados, no presta asesoramiento jurídico personalizado y no tramita solicitudes. No garantizamos que sea ni el mejor ni el único camino: nos esforzamos por darte el mapa más claro posible, pero cada caso tiene matices y la normativa cambia.' },
        { h: 'Ilegal no es lo mismo que irregular', p: 'No existe una persona «ilegal». Lo ilegal es una conducta: entrar sin autorización, trabajar sin permiso o incumplir una prohibición. La situación administrativa es «irregular» cuando no hay autorización de residencia o estancia vigente. La app usa «persona en situación irregular» y evita «inmigrante ilegal». Estar irregular no es un delito penal: es una infracción administrativa que puede tener consecuencias y complicar solicitudes futuras.' },
        { h: 'Tus datos', p: 'Todo lo que respondes se guarda únicamente en el almacenamiento local de tu navegador. No hay servidor, no hay cuentas, no hay analítica y no se envía nada a terceros. La lectura en voz alta usa las voces instaladas en tu dispositivo: el texto no se manda a ningún servicio externo. Si borras los datos del navegador o usas el botón de reinicio, la información desaparece.' },
        { h: 'Descarga en PDF', p: 'Puedes descargar tu plan en un PDF generado en tu propio dispositivo, sin enviarlo a ningún servidor. Incluye tu perfil, las vías recomendadas, los requisitos, los documentos y las fechas clave. Está pensado para que lo lleves a un abogado de extranjería o a una entidad social y ahorres tiempo en la consulta.' },
        { h: 'Formularios oficiales', p: 'La app enlaza a los modelos oficiales de la sede (por ejemplo, EX-31 para arraigo o EX-24 para familiares de personas con nacionalidad española) y puede generar una hoja de datos con tus datos campo por campo. No rellenamos, firmamos ni presentamos el formulario oficial: eso lo haces tú o tu representante. La hoja de datos se guarda solo en tu dispositivo.' },
        { h: 'Exactitud y vigencia', p: 'El contenido se revisó por última vez el 20 de noviembre de 2026 con fuentes oficiales (BOE, ministerios, consulados) e incluye la reforma del Reglamento de Extranjería (RD 1155/2024), el RD 316/2026 y la STS de 8 de julio de 2026. La normativa cambia con frecuencia: confirma siempre en la fuente oficial antes de presentar una solicitud. Tampoco verificamos los documentos que marcas: el plan se basa en tu declaración.' },
        { h: 'Límites de responsabilidad', p: 'Los resultados son orientativos y dependen de la información que introduces. No garantizan la concesión de ninguna autorización ni sustituyen la valoración de un profesional. No nos hacemos responsables de decisiones tomadas únicamente a partir de esta herramienta.' },
        { h: 'Enlaces externos', p: 'Los enlaces apuntan a organismos oficiales y entidades sociales. No controlamos sus contenidos ni sus políticas de privacidad.' },
        { h: 'Cómo usarla bien', p: 'Responde con sinceridad, marca «no lo sé» cuando no estés seguro y lleva el plan impreso a tu cita o a tu abogado. Si tu situación es urgente (expulsión, prohibición de entrada, violencia), busca ayuda profesional inmediata.' }
      ]
    }
  };
})();

/* ============================================================
   Ruta Legal · preguntas frecuentes (dudas reales de foros)
   Respuestas contrastadas con normativa y sede oficial.
   ============================================================ */
(function () {
  'use strict';
  var RL = window.RL = window.RL || {};

  var CATS = [
    { id: 'todas', label: 'Todas' },
    { id: 'entrada', label: 'Entrada y estancia' },
    { id: 'asilo', label: 'Asilo' },
    { id: 'arraigo', label: 'Arraigo' },
    { id: 'trabajo', label: 'Estudios y trabajo' },
    { id: 'sanciones', label: 'Policía y sanciones' },
    { id: 'familia', label: 'Familia' },
    { id: 'documentos', label: 'Documentos' },
    { id: 'ayudas', label: 'Ayudas' }
  ];

  var Q = [
    {
      id: 'patera_vs_turista', cat: 'entrada',
      q: '¿Es lo mismo entrar en patera que con visa de turista?',
      short: 'No. La patera es una entrada irregular; la visa de turista es una entrada legal de 90 días. Ninguna te da residencia ni permiso de trabajo.',
      detail: [
        'Patera: no tienes autorización de entrada. Puedes solicitar asilo en frontera o comisaría; si no lo haces, quedas en situación irregular. No hay regularización automática: el arraigo exige 2 años y pruebas.',
        'Visa de turista: entras legalmente para 90 días; no puedes trabajar. Si te quedas, pasas a irregular y el EES registra la sobreestancia.',
        'En ambos casos: urgencias sanitarias, educación de menores y empadronamiento; no trabajar sin autorización.',
        'Entrar en patera no es una ventaja para regularizarse: añade riesgo y no garantiza asilo.'
      ],
      links: [
        ['ACNUR · asilo', 'https://www.acnur.org/es-es/'],
        ['Ministerio de Inclusión', 'https://www.inclusion.gob.es/']
      ]
    },
    {
      id: 'patera_papeles', cat: 'entrada',
      q: '¿Llegar en patera me da papeles o asilo automático?',
      short: 'No. La patera no regulariza por sí sola ni concede asilo automáticamente.',
      detail: [
        'Puedes pedir protección internacional, pero hay que solicitarla y probar los motivos; no todos la obtienen.',
        'Si no pides asilo, quedas irregular y necesitas una vía como arraigo (2 años) o familiar de español/UE.',
        'La entrada irregular puede complicar una expulsión o una prohibición de entrada, aunque no es automática.',
        'No confíes en quien te prometa papeles por llegar en patera.'
      ]
    },
    {
      id: 'asilo_arraigo', cat: 'asilo',
      q: 'Estoy solicitando asilo, ¿puedo pedir arraigo?',
      short: 'No mientras el asilo esté pendiente. El tiempo como solicitante de asilo no cuenta para los 2 años de arraigo.',
      detail: [
        'El art. 126.a) del Reglamento impide el arraigo a quien es solicitante de protección internacional.',
        'El Tribunal Supremo (2026) avaló que el tiempo como solicitante no compute para el arraigo: si te deniegan, el contador no sigue desde tu entrada.',
        'Si te conceden asilo, no necesitas arraigo: tienes protección internacional y tu propia vía de residencia.',
        'Si te deniegan, espera la denegación firme y consulta el plazo; no presentes arraigo con el asilo aún vivo.'
      ]
    },
    {
      id: 'asilo_denegado', cat: 'asilo',
      q: 'Me han denegado el asilo, ¿puedo pedir arraigo?',
      short: 'Sí, pero normalmente cuentan 2 años desde que quedas irregular tras la denegación firme, no desde tu entrada.',
      detail: [
        'La denegación debe ser firme: si tienes recurso o apelación pendiente, no se considera cerrada.',
        'La excepción de 6 meses que existió para quienes ya estaban irregulares por denegación firme caducó y no está disponible como regla general.',
        'El tiempo como solicitante de asilo no cuenta; el Supremo 2026 lo dejó claro.',
        'Si tienes una denegación, calcula desde la fecha de firmeza y consulta con abogado: hay plazos de recurso y riesgos de expulsión.'
      ]
    },
    {
      id: 'estudios_30h', cat: 'trabajo',
      q: 'Estudio y trabajo menos de 30 horas, ¿está permitido?',
      short: 'Sí, si el trabajo es compatible con los estudios, con contrato y alta, y no superas 30 horas semanales.',
      detail: [
        'La estancia por estudios permite trabajar hasta 30 h/semana en actividades compatibles.',
        'No es una autorización de residencia y trabajo: si quieres trabajar de forma estable, valora la modificación a residencia y trabajo.',
        'El tiempo de estudios no cuenta al 100 % para la nacionalidad; computa al 50 % en ciertos supuestos.',
        'Guarda contrato, nóminas y vida laboral: los necesitarás para renovar o modificar.'
      ]
    },
    {
      id: 'estudios_mas30', cat: 'trabajo',
      q: 'Estudio y trabajo más de 30 horas, ¿qué pasa?',
      short: 'Superar el límite puede extinguir tu estancia por estudios y generar problemas laborales y migratorios.',
      detail: [
        'El límite de 30 h/semana es una condición de la estancia; incumplirlo puede ser causa de extinción.',
        'También puede haber sanción laboral para la empresa y problemas en la renovación o modificación.',
        'No es una expulsión automática, pero sí un riesgo real. Reduce las horas y regulariza la situación.',
        'Si ya has superado el límite, consulta con abogado antes de presentar la renovación.'
      ]
    },
    {
      id: 'trabajo_ilegal_policia', cat: 'sanciones',
      q: 'Me han encontrado trabajando sin papeles: ¿qué puede pasar?',
      short: 'Es una infracción administrativa y laboral, no un delito por sí solo. Puede haber sanción a la empresa y un expediente de extranjería; la expulsión no es automática.',
      detail: [
        'La empresa que te contrata sin autorización comete una infracción grave; la Inspección de Trabajo puede sancionarla.',
        'Tu situación irregular puede abrir un expediente de expulsión, pero requiere procedimiento, audiencia y resolución.',
        'Trabajar con documentos falsos sí puede ser delito: no uses papeles falsos.',
        'Tienes derechos laborales (salario, seguridad, accidente) aunque no tengas permiso; pide ayuda a un sindicato o entidad.'
      ]
    },
    {
      id: 'inspeccion_trabajo', cat: 'sanciones',
      q: '¿Qué hace la Inspección de Trabajo si estoy sin papeles?',
      short: 'Puede sancionar a la empresa y remitir tu situación a extranjería. No te regulariza ni te deporta por sí sola.',
      detail: [
        'La Inspección investiga las condiciones laborales y la falta de alta o autorización.',
        'La empresa se enfrenta a sanciones; tú puedes reclamar salarios y derechos.',
        'La Inspección no es un juez de extranjería: puede informar, pero la expulsión se tramita aparte.',
        'No firmes documentos que no entiendas y pide copia de la actuación.'
      ]
    },
    {
      id: 'denuncia_espanol', cat: 'sanciones',
      q: 'Si un español me denuncia por trabajar sin papeles, ¿me deportan?',
      short: 'No automáticamente. La denuncia puede activar una inspección y un expediente, pero no es una deportación exprés.',
      detail: [
        'La denuncia no sustituye al procedimiento administrativo: hace falta expediente, audiencia y resolución.',
        'La empresa puede ser sancionada; tú puedes tener derechos laborales y también riesgo migratorio.',
        'No te vengues ni amenaces: puede agravar tu situación. Busca abogado o entidad social.',
        'Si hay salarios impagados o explotación, denuncia también tú; la ley protege derechos laborales.'
      ]
    },
    {
      id: 'derechos_sin_papeles', cat: 'trabajo',
      q: 'Si trabajo sin papeles, ¿tengo derechos?',
      short: 'Sí. El Tribunal Supremo ha reconocido derechos laborales a quien trabaja sin autorización: salario, seguridad y protección por accidente.',
      detail: [
        'La falta de permiso no borra el contrato ni el derecho al salario.',
        'Puedes reclamar ante la Inspección o el juzgado de lo social, pero tu situación migratoria puede quedar expuesta.',
        'Habla antes con un sindicato o una entidad jurídica gratuita.',
        'No aceptes trabajos sin alta si puedes evitarlo: el riesgo laboral y migratorio es alto.'
      ]
    },
    {
      id: 'antecedentes_1_20', cat: 'documentos',
      q: 'Tengo antecedentes en mi país: ¿cambia si son de hace 1 año o de hace 20?',
      short: 'Sí, pero no hay una regla única. Muchas vías miran los últimos 5 años; un antecedente de 1 año es reciente; uno de 20 puede estar cancelado o no.',
      detail: [
        'No es lo mismo antecedentes penales, policiales y delitos sexuales: son registros distintos.',
        'Muchas vías miran los últimos 5 años y piden certificado de España y del país de origen, con validez de 3-6 meses.',
        'Un antecedente de 20 años puede haber sido cancelado o rehabilitado, pero no lo des por hecho: depende del país, del delito y de la pena.',
        'No mientas. Un certificado falso puede cerrarte todas las vías. Un abogado puede revisar la cancelación.'
      ]
    },
    {
      id: 'turista_overstay', cat: 'entrada',
      q: 'Entré con visa de turista y me he quedado: ¿qué pasa?',
      short: 'Pasas a situación irregular. No puedes trabajar y la sobreestancia queda registrada; no hay regularización automática.',
      detail: [
        'La regla es 90 días en cualquier periodo de 180; el EES registra entradas y salidas.',
        'La sobreestancia es una infracción administrativa, no un delito penal, pero complica visados y solicitudes futuras.',
        'Puedes valorar asilo, familiar de español/UE o arraigo si cumples los requisitos; no trabajes sin autorización.',
        'Salir de España no arregla automáticamente la situación y puede activar una prohibición de entrada.'
      ]
    },
    {
      id: 'policia_miedo', cat: 'sanciones',
      q: 'Me da miedo la policía: ¿me van a deportar?',
      short: 'Estar irregular no es un delito penal y la expulsión no es automática. Pero hay riesgo si hay orden de salida, antecedentes o un control.',
      detail: [
        'La irregularidad es una infracción administrativa; no te convierte en delincuente.',
        'La expulsión requiere expediente, audiencia y resolución; no ocurre por el simple hecho de estar irregular.',
        'Si te detienen: derecho a abogado, intérprete, no declarar y avisar a un familiar o consulado.',
        'No des identidad falsa, no firmes lo que no entiendas y no confíes en quien promete papeles por dinero.'
      ]
    },
    {
      id: 'salir_espana', cat: 'entrada',
      q: '¿Salir de España y volver arregla mi situación?',
      short: 'No. Salir puede romper la permanencia para el arraigo y activar una prohibición de entrada; no hay un visado puente para irregulares.',
      detail: [
        'El arraigo exige permanencia continuada; una salida larga o no justificada puede romperla.',
        'La sobreestancia queda registrada y puede impedir volver durante años.',
        'No existe un visado especial para quien ya está irregular y sale.',
        'Antes de salir, consulta con abogado o entidad social.'
      ]
    },
    {
      id: 'casarse_hijo', cat: 'familia',
      q: '¿Casarme con un español o tener un hijo español me legaliza?',
      short: 'No automáticamente. Abre una vía, pero hay que solicitarla y probar el vínculo, la convivencia o el cargo del menor.',
      detail: [
        'Matrimonio o pareja registrada: tarjeta de familiar de español de 5 años, con trabajo, si el vínculo es válido y convivís.',
        'Pareja estable no registrada: 12 meses de convivencia o hijo en común.',
        'Hijo español: como progenitor necesitas acreditar filiación, que el menor está a tu cargo y convive contigo, o que cumples obligaciones.',
        'Un matrimonio de conveniencia se deniega. La nacionalidad del hijo no regulariza automáticamente a la madre.'
      ]
    },
    {
      id: 'discapacidad', cat: 'documentos',
      q: '¿Cómo obtengo el certificado de discapacidad?',
      short: 'Lo expide la comunidad autónoma, no el ayuntamiento ni la Seguridad Social; es distinto de la incapacidad permanente y de la dependencia.',
      detail: [
        'Pide cita en servicios sociales o en el centro de valoración de tu comunidad.',
        'Lleva informes médicos, DNI/NIE, empadronamiento y la solicitud.',
        'El grado (33 %, 65 %…) lo decide el baremo; nadie puede garantizar un plazo de un año.',
        'La incapacidad permanente la declara el INSS y no equivale automáticamente al 33 %.'
      ]
    },
    {
      id: 'ayudas', cat: 'ayudas',
      q: '¿Dónde pido comida, dinero o vivienda?',
      short: 'En servicios sociales, Cruz Roja, Cáritas, Banco de Alimentos y entidades locales. Muchas ayudas económicas exigen residencia legal; las de emergencia municipal pueden no exigirla.',
      detail: [
        'Comida: Banco de Alimentos, Cruz Roja y Cáritas, con derivación de servicios sociales.',
        'Dinero: IMV, renta mínima autonómica, pensión no contributiva y ayudas de emergencia.',
        'Vivienda: ayuda al alquiler, alojamiento temporal y programas de realojo.',
        'Si hay menores o riesgo grave, llama al 112; para salud mental, 024.'
      ]
    },
    {
      id: 'ayuda_ayuntamiento', cat: 'ayudas',
      q: '¿Qué ayuda puedo obtener en el ayuntamiento?',
      short: 'Servicios sociales, empadronamiento, ayudas de emergencia, alimentos, alquiler o suministros, información de salud, escuela, empleo y vivienda. No todo es automático ni lo gestiona el ayuntamiento.',
      detail: [
        'Empadronamiento y certificado: es la puerta de entrada a muchas ayudas, al colegio y a la sanidad. No es un permiso de residencia.',
        'Servicios sociales: valoración, informe social, ayuda de emergencia, alimentos, ropa o muebles, alquiler o suministros, familia, dependencia y discapacidad.',
        'Educación, sanidad, empleo y vivienda: el ayuntamiento te orienta y deriva a la comunidad autónoma o a entidades; no lo gestiona todo.',
        'Cada ayuntamiento tiene su presupuesto y sus requisitos. Pide cita, lleva documentación y, si te deniegan, pide la razón por escrito.'
      ],
      links: [
        ['Cruz Roja', 'https://www.cruzroja.es/'],
        ['Cáritas', 'https://www.caritas.es/']
      ]
    },
    {
      id: 'trabajadora_social', cat: 'ayudas',
      q: '¿Qué puede hacer una trabajadora social?',
      short: 'Puede valorar tu situación, emitir un informe social, derivarte a recursos y tramitar ayudas de emergencia, dependencia o discapacidad. No puede garantizar una ayuda ni decidir sobre tu residencia.',
      detail: [
        'El informe social es clave para el arraigo, la dependencia, la discapacidad, la vivienda y las ayudas de emergencia.',
        'Puede activar alimentos, ayudas de alquiler o suministros, recursos de entidades y orientación familiar.',
        'No sustituye a Extranjería ni a un abogado: no decide visados, residencia ni expulsiones.',
        'No es «hago lo que quiera»: hay requisitos, presupuesto y listas de espera. Pregunta qué recursos hay y pide por escrito si algo se deniega.'
      ]
    },
    {
      id: 'ong_encontrar', cat: 'ayudas',
      q: '¿Cómo encuentro ONG y entidades además de Cáritas?',
      short: 'Pide el mapa o guía de recursos a servicios sociales o al 012; en la app tienes un directorio. También están Cruz Roja, Cepaim, CEAR, ACCEM, Red Acoge, Fundación Secretariado Gitano, Provivienda, RAIS y Banco de Alimentos.',
      detail: [
        'No hace falta ser religioso ni socio para recibir ayuda de muchas entidades; algunas piden cita y otras atienden por orden de llegada.',
        'Pide el «mapa de recursos» o «guía de recursos» de tu ayuntamiento o comunidad; ahí salen entidades, teléfonos y requisitos.',
        'Pregunta qué documentación piden y si atienden a personas sin residencia legal. No todas pueden.',
        'Desconfía de quien cobra por ayudas gratuitas o promete papeles a cambio de dinero.'
      ],
      links: [
        ['ACCEM', 'https://www.accem.es/'],
        ['Red Acoge', 'https://www.redacoge.org/'],
        ['Fundación Secretariado Gitano', 'https://www.gitanos.org/'],
        ['Provivienda', 'https://www.provivienda.org/']
      ]
    },
    {
      id: 'muebles_gafas', cat: 'ayudas',
      q: '¿Es verdad que dan muebles, gafas, alquiler, luz y vales de comida?',
      short: 'Sí existen, pero no son un derecho universal: dependen del municipio, la entidad, tus ingresos y la valoración social. No cuentes con ello como automático.',
      detail: [
        'Muebles y enseres: bancos de reutilización, puntos limpios, Cáritas y Cruz Roja. A veces son gratis o a precio simbólico; el transporte suele correr de tu cuenta.',
        'Gafas: la sanidad pública no cubre gafas a todos los adultos. Hay programas de algunas comunidades y entidades, sobre todo para menores (ONCE, Fundación Barraquer); pregunta en el centro de salud y servicios sociales.',
        'Alquiler y luz: ayudas de emergencia municipal, ayudas autonómicas y bono social eléctrico (requisitos de consumidor vulnerable). No son automáticas; evita deudas y pide cita cuanto antes.',
        'Vales de comida: tarjetas o vales de servicios sociales, Cruz Roja o Cáritas; no son dinero en efectivo y suelen requerir derivación.'
      ],
      links: [
        ['Bono social eléctrico', 'https://www.miteco.gob.es/'],
        ['Cruz Roja', 'https://www.cruzroja.es/']
      ]
    },
    {
      id: 'ayuda_sin_papeles', cat: 'ayudas',
      q: '¿Puedo pedir ayuda si estoy en situación irregular?',
      short: 'Puedes acudir a servicios sociales y entidades; urgencias, menores y educación están protegidos. Muchas ayudas económicas exigen residencia legal, pero las de emergencia municipal pueden no exigirla.',
      detail: [
        'El empadronamiento no es un permiso, pero es la puerta a muchas ayudas, al colegio y a la sanidad.',
        'Las ayudas de emergencia municipal y las entidades suelen valorar tu situación, no solo tu documentación; los criterios cambian por municipio.',
        'No mientas sobre tu situación: una declaración falsa puede perjudicarte. Pregunta qué alternativa tienes.',
        'Si hay menores, riesgo grave o violencia, llama al 112, al 016 o acude a servicios sociales.'
      ]
    },
    {
      id: 'fraude_horas', cat: 'trabajo',
      q: 'Trabajo 50 horas pero me contratan 30 y la nómina es falsa: ¿qué pasa?',
      short: 'No es legal. El periodo de prueba no permite pagar menos ni ocultar horas. Las 20 horas de más deben pagarse y cotizar; la nómina dibujada es una falsedad y puede perjudicarte en Extranjería.',
      detail: [
        'Contrato de 30 h y 50 h reales: las horas de más son complementarias o extraordinarias, deben estar pactadas y pagarse al valor legal o del convenio. La empresa debe llevar registro de jornada y cotizar por las horas reales.',
        'Pagar las horas «al valor que quieren» es ilegal si queda por debajo del SMI o del convenio. Tienes derecho a la diferencia y a las cotizaciones.',
        'La nómina que muestra 30 h cuando trabajas 50 es una nómina falsa. Firmarla no la convierte en verdadera, pero no la presentes ante Extranjería, arraigo, renovación o ayudas: puede ser fraude documental.',
        'Consecuencias para la empresa: inspección, sanción laboral, regularización de cotizaciones y posible falsedad documental. Para ti: derecho a reclamar, pero también riesgo migratorio si tu autorización limita las horas.',
        'Si estudias, el límite general es 30 h/semana: trabajar 50 puede extinguir la estancia. Si estás irregular, es una infracción laboral y migratoria; no es una expulsión automática, pero puede abrir expediente.',
        'Durante el periodo de prueba tienes los mismos derechos salariales y de cotización. Un despido en prueba sin indemnización no borra las horas impagadas.'
      ],
      links: [
        ['Inspección de Trabajo', 'https://www.mites.gob.es/itss/web/index.html'],
        ['Sede de Trabajo', 'https://sede.mites.gob.es/'],
        ['CCOO', 'https://www.ccoo.es/'],
        ['UGT', 'https://www.ugt.es/']
      ]
    },
    {
      id: 'denuncia_fraude', cat: 'trabajo',
      q: '¿Cómo denuncio el fraude y reclamo las horas y el salario?',
      short: 'Reúne pruebas, pide la regularización por escrito, acude a un sindicato o abogado y denuncia en la Inspección de Trabajo. Para cobrar, papeleta de conciliación y juzgado de lo social.',
      detail: [
        'Pruebas: contrato, nóminas, transferencias, horarios, mensajes, correos, registros de entrada/salida, fotos y testigos. Anota tus horas reales y calcula la diferencia.',
        'Pide por escrito a la empresa que regularice jornada y salario; guarda la respuesta. No firmes un finiquito que diga que cobraste lo que no cobraste.',
        'Acude a CCOO, UGT, una entidad de asesoría laboral gratuita o un abogado laboralista. Te ayudan a calcular y a preparar la denuncia.',
        'Denuncia en la Inspección de Trabajo por sede electrónica o por escrito. La Inspección puede sancionar a la empresa y regularizar cotizaciones; no te concede la residencia.',
        'Para reclamar salarios: papeleta de conciliación ante el SMAC y, si no hay acuerdo, demanda en el juzgado de lo social. El plazo general es de 1 año.',
        'Si tu situación migratoria depende de una nómina o de las horas, consulta antes con abogado. No uses documentos falsos para Extranjería.'
      ],
      links: [
        ['Sede de Trabajo', 'https://sede.mites.gob.es/'],
        ['Inspección de Trabajo', 'https://www.mites.gob.es/itss/web/index.html'],
        ['CCOO', 'https://www.ccoo.es/'],
        ['UGT', 'https://www.ugt.es/']
      ]
    },
    {
      id: 'servicios_sociales_acceso', cat: 'ayudas',
      q: '¿Quién puede pedir ayuda a servicios sociales y en qué condiciones?',
      short: 'Cualquier persona empadronada o en urgencia social puede pedir información y valoración; no hace falta residencia legal para lo básico y la emergencia, aunque muchas ayudas concretas sí la exigen.',
      detail: [
        'Puede ir la propia persona; si es menor, su padre/madre/tutor; si tiene discapacidad, con apoyo; si no habla español, con intérprete o persona de confianza. También puede pedir visita domiciliaria si no puede desplazarse.',
        'El empadronamiento facilita el acceso y es requisito de muchas ayudas, pero no de toda la atención urgente. Pregunta expresamente por «ayuda de emergencia» y por los servicios sociales de urgencia.',
        'Lleva pasaporte/NIE, certificado de empadronamiento, ingresos, alquiler o facturas, libro de familia, informes médicos o de discapacidad y cualquier resolución que tengas.',
        'La trabajadora social no decide a su gusto: valora, informa y aplica criterios. Tienes derecho a que te informen de los requisitos, a una valoración y a que te den por escrito la solicitud y, si se deniega, el motivo.',
        'Si no tienes residencia legal, puedes acudir; muchas ayudas económicas exigen residencia, pero las de emergencia municipal y las entidades pueden no exigirla. No mientas: una declaración falsa te perjudica.'
      ],
      links: [
        ['Servicios Sociales', 'https://www.mdsocialesa2030.gob.es/'],
        ['Cruz Roja', 'https://www.cruzroja.es/']
      ]
    },
    {
      id: 'trabajadora_social_niega', cat: 'ayudas',
      q: '¿Qué hago si la trabajadora social me niega la ayuda o me pone trabas?',
      short: 'Pide por escrito la solicitud y la denegación. Si no te dan cita, registra un escrito. Reclama al ayuntamiento, a la consejería, al Defensor del Pueblo o autonómico y, si hay resolución, recurre.',
      detail: [
        'No te quedes solo con un «no» verbal. Presenta un escrito en el registro del ayuntamiento o por sede electrónica: «Solicito cita para valoración social y, si procede, ayuda de emergencia. Solicito respuesta por escrito». Guarda el resguardo.',
        'Pide la hoja de reclamaciones del ayuntamiento y una copia de lo presentado. Anota fecha, nombre del servicio y motivo que te dieron.',
        'Si la ayuda se deniega por resolución, pide el texto completo y el plazo de recurso: reposición y, si procede, contencioso-administrativo. La asistencia jurídica gratuita puede cubrirte si no tienes recursos.',
        'Puedes acudir a la concejalía de servicios sociales, a la consejería de tu comunidad, a la Inspección de Servicios Sociales si existe, al Defensor del Pueblo o al defensor autonómico. No sustituyen a un juez, pero pueden mediar y pedir explicaciones.',
        'Si hay menores, violencia o riesgo grave, dilo expresamente: activa protección y prioridad. Para violencia, 016; para emergencias, 112.',
        'No es necesario ir con abogado a la primera cita, pero sí llevar pruebas y acompañante si te ayuda. No firmes nada que no entiendas.'
      ],
      links: [
        ['Defensor del Pueblo', 'https://www.defensordelpueblo.es/'],
        ['Asistencia jurídica gratuita', 'https://sede.mjusticia.gob.es/es/tramites/asistencia-juridica-gratuita']
      ]
    },
    {
      id: 'ong_por_lugar', cat: 'ayudas',
      q: '¿Qué ONG hay en mi ciudad o provincia y cómo accedo?',
      short: 'Depende del municipio y la provincia. Pide el «mapa de recursos» en servicios sociales o al 012; en la app, Dónde ir. También están Cruz Roja, Cáritas, Cepaim, ACCEM, Red Acoge, Fundación Secretariado Gitano, Provivienda, RAIS, CEAR y Banco de Alimentos.',
      detail: [
        'No hay una lista nacional única: cada ayuntamiento y comunidad publica su guía o mapa de recursos. Pide la de tu zona y pregunta por entidades de inmigrantes, alimentos, vivienda, empleo, asilo y discapacidad.',
        'No hace falta ser religioso ni socio para recibir ayuda de muchas entidades. Unas piden cita y derivación de servicios sociales; otras atienden por orden de llegada o por teléfono.',
        'Si una entidad no tiene sede en tu municipio, pregunta si atiende en otro o si puede derivarte. En la app puedes ver entidades nacionales y las de tu comunidad/provincia.',
        'Pregunta siempre qué documentación piden, si atienden sin residencia legal y si cobran algo. Las ayudas gratuitas no se pagan; desconfía de quien cobra por «conseguirlas».'
      ],
      links: [
        ['ACCEM', 'https://www.accem.es/'],
        ['Red Acoge', 'https://www.redacoge.org/'],
        ['Cruz Roja', 'https://www.cruzroja.es/'],
        ['Fundación Secretariado Gitano', 'https://www.gitanos.org/']
      ]
    },
    {
      id: 'concello_xunta_gobierno', cat: 'ayudas',
      q: '¿Qué hace el Concello/Ayuntamiento, la Xunta/Comunidad y la Oficina del Gobierno?',
      short: 'No son lo mismo: el Concello/Ayuntamiento lleva padrón, servicios sociales y emergencia; la Xunta/Comunidad, sanidad, educación, dependencia, empleo y vivienda; la Delegación/Subdelegación del Gobierno, extranjería, asilo y sanciones.',
      detail: [
        'Concello/Ayuntamiento/Ajuntament/Udala: empadronamiento, servicios sociales, ayudas de emergencia, alimentos, información de escuela y salud, policía local.',
        'Xunta/Comunidad Autónoma: tarjeta sanitaria, hospital, educación, dependencia y discapacidad, familia, empleo y vivienda. En Galicia es la Xunta; en otras comunidades, la consejería correspondiente.',
        'Delegación o Subdelegación del Gobierno: Oficina de Extranjería, asilo, expedientes, sanciones y expulsiones. No da comida, casa ni ayudas sociales; para eso ve a servicios sociales o a una ONG.',
        'Si te mandan de una oficina a otra, pide la dirección, el teléfono y, si puedes, la derivación por escrito. No des vueltas sin resguardo.',
        'En la app: Dónde ir elige tu provincia y municipio; allí están los enlaces de tu comunidad, tu ayuntamiento y la Oficina de Extranjería.'
      ],
      links: [
        ['Ministerio de Política Territorial', 'https://www.mpt.gob.es/'],
        ['Ministerio de Inclusión', 'https://www.inclusion.gob.es/'],
        ['Sede de la Administración', 'https://sede.administracion.gob.es/']
      ]
    },
    {
      id: 'ong_niega', cat: 'ayudas',
      q: '¿Qué hago si una ONG me rechaza o me pone excusas?',
      short: 'Una ONG no es una administración con derecho a una prestación: puede rechazar por requisitos, aforo o falta de medios. Pide motivo y alternativas; si es pública o recibe fondos, puedes reclamar.',
      detail: [
        'Pregunta por escrito o por email por qué te rechazan y qué otros recursos existen. Guarda la respuesta.',
        'Si la entidad recibe financiación pública, puedes presentar una queja en su «defensor del usuario», en la consejería que la financia o en transparencia.',
        'Los servicios sociales pueden derivarte a otra entidad. El Defensor del Pueblo puede mediar si hay una actuación administrativa.',
        'No pagues por una ayuda gratuita ni firmes datos falsos. Si hay maltrato o discriminación, pide hoja de reclamaciones y busca apoyo jurídico.'
      ],
      links: [
        ['Defensor del Pueblo', 'https://www.defensordelpueblo.es/'],
        ['Cruz Roja', 'https://www.cruzroja.es/']
      ]
    },
    {
      id: 'discapacidad_dependencia_incapacidad', cat: 'documentos',
      q: '¿Qué diferencia hay entre certificado de discapacidad, dependencia e incapacidad?',
      short: 'Son tres reconocimientos distintos: el certificado de discapacidad lo da la comunidad autónoma; la dependencia también la comunidad (SAAD); la incapacidad permanente la declara la Seguridad Social. Ninguno es un permiso de residencia.',
      detail: [
        'Certificado de discapacidad: lo expide la comunidad autónoma (servicios sociales o centro de valoración). Reconoce un grado (33 %, 65 %…). No lo da el ayuntamiento ni la Seguridad Social. Sirve para ayudas, tasas, transporte y como base para la dependencia.',
        'Dependencia: la valora la comunidad autónoma (SAAD). Mide la necesidad de apoyo en la vida diaria y da servicios o prestaciones (ayuda a domicilio, centro de día, residencia, prestación económica).',
        'Incapacidad permanente: la declara el INSS/Seguridad Social. Valora la capacidad laboral y puede dar pensión. No es el certificado de discapacidad y no garantiza el 33 % (STS 2026).',
        'Asilo: un solicitante de asilo no tiene todavía residencia estable; un refugiado reconocido sí puede solicitar el certificado y, si cumple años y requisitos, las prestaciones. La condición de asilado no sustituye los requisitos de cada ayuda.',
        'Residencia: para muchas ayudas económicas se exige residencia legal y un número de años; el certificado de discapacidad por sí solo no da derecho a pensión ni regulariza.'
      ],
      links: [
        ['IMSERSO', 'https://www.imserso.es/'],
        ['Seguridad Social', 'https://www.seg-social.es/']
      ]
    },
    {
      id: 'ayuda_23_discapacidad', cat: 'ayudas',
      q: 'Tengo 23 años, discapacidad y 1 año de residencia: ¿qué ayudas puedo pedir?',
      short: 'Puedes pedir el certificado, la valoración de dependencia, IMV/renta mínima/ayuda de emergencia si cumples ingresos, y tarjeta de transporte. La pensión no contributiva de invalidez suele exigir 5 años de residencia legal (10 en algunas comunidades), así que con 1 año probablemente no.',
      detail: [
        'Pensión no contributiva de invalidez: 18-64 años, discapacidad ≥65 %, ingresos bajos y residencia legal; normalmente 5 años, aunque algunas comunidades exigen 10. Con 1 año no suele cumplir el requisito de años.',
        'IMV y renta mínima autonómica: exigen residencia legal y bajos ingresos; la cuantía depende del hogar. No son automáticas por tener discapacidad, pero el certificado y la dependencia pueden ayudar.',
        'Dependencia: si necesita apoyo para la vida diaria, solicita valoración; puede dar servicios o prestación económica. Requiere residencia legal y valoración favorable.',
        'Ayuda de emergencia municipal: para alimentos, alquiler o suministros; puede no exigir residencia legal, pero depende de presupuesto y valoración.',
        'Transporte: tarjeta de discapacidad, abono social, tarjeta de estacionamiento para movilidad reducida y descuentos de familia numerosa; requisitos y precio varían por comunidad.',
        'Asilo: si es solicitante, no cuenta como residencia estable para estas prestaciones; si es refugiado, puede solicitarlas si cumple los requisitos. Consulte su caso.'
      ],
      links: [
        ['IMSERSO · pensiones no contributivas', 'https://www.imserso.es/'],
        ['Ingreso Mínimo Vital', 'https://www.inclusion.gob.es/']
      ]
    },
    {
      id: 'transporte_descuentos', cat: 'ayudas',
      q: '¿Qué tarjetas de transporte hay y quién puede obtenerlas?',
      short: 'No hay una tarjeta única nacional. Cada ciudad/comunidad tiene abonos de metro y bus, tarjeta de discapacidad, youth/estudiante y familia numerosa; para media y larga distancia hay descuentos de Renfe y autobuses. Requisitos y precio cambian por zona.',
      detail: [
        'Transporte local y metro: se piden en el consorcio de transporte o ayuntamiento. Suele haber abono joven, estudiante, familia numerosa y tarjeta para personas con discapacidad (a partir del 33 %), con precio reducido o gratuito según la comunidad.',
        'Media y larga distancia: Renfe y autobuses tienen tarifas para jóvenes, mayores, familia numerosa y personas con discapacidad; algunas exigen certificado y otras tarjeta anual. No son automáticas: hay que solicitarlas.',
        'Tarjeta de estacionamiento para movilidad reducida: la da el ayuntamiento o la comunidad; no es un abono de transporte, sino un permiso para aparcar en plazas reservadas.',
        'Dónde preguntar: oficina de transporte de tu ayuntamiento, consorcio autonómico, 012 o la web de tu comunidad. En la app, Dónde ir con tu provincia.',
        'Coste: desde gratuito hasta una tarifa mensual reducida; depende de edad, discapacidad, estudiantes, familia numerosa y residencia. Pregunta por el «abono social» si no puedes pagar.'
      ],
      links: [
        ['Renfe', 'https://www.renfe.com/'],
        ['Consorcio de Transportes de Madrid', 'https://www.crtm.es/']
      ]
    },
    {
      id: 'ccse_dele', cat: 'documentos',
      q: '¿Qué exámenes necesito para la nacionalidad, dónde se hacen y cuánto cuestan?',
      short: 'Necesitas el CCSE y, si no eres de un país hispanohablante, el DELE A2. Se hacen en centros del Instituto Cervantes o acreditados, con inscripción online y plazas limitadas. CCSE: 25 preguntas y 45 minutos, 85 €. DELE A2: unas 2,5 horas, unos 138 €.',
      detail: [
        'CCSE: 25 preguntas tipo test, 45 minutos; se aprueba con 15 aciertos. Precio 85 € e incluye hasta dos convocatorias si no apruebas o no te presentas. Resultados orientativos en unos 20 días; el certificado suele valer 4 años.',
        'DELE A2: comprensión de lectura, expresión escrita, comprensión auditiva y expresión oral; unas 2,5 horas. Se aprueba con 60/100 y «apto» en los grupos. Precio aproximado 138 €, variable por centro. El diploma no caduca.',
        'Dónde: centros del Instituto Cervantes en España y en el mundo, universidades y centros acreditados. Te inscribes online, eliges centro y convocatoria, pagas y el centro te asigna fecha y hora.',
        'Cuándo: hay varias convocatorias al año; no esperes al último día. Las plazas son limitadas y algunas ciudades se llenan. Inscríbete con semanas o meses de margen.',
        'Exenciones: los nacionales de países hispanohablantes no necesitan DELE A2 (pero sí CCSE). Si cursaste y aprobaste la ESO en España, no necesitas DELE ni CCSE. Hay adaptaciones para discapacidad.',
        'Después: con el certificado, presenta la nacionalidad por residencia en la sede de Justicia y paga la tasa 790-026. No presentes el expediente sin los exámenes si no estás exento.'
      ],
      links: [
        ['Instituto Cervantes · CCSE', 'https://cervantes.org/es/examenes/ccse'],
        ['Instituto Cervantes · DELE', 'https://cervantes.org/es/examenes/dele'],
        ['Nacionalidad · Ministerio de Justicia', 'https://www.mjusticia.gob.es/es/ciudadania/nacionalidad/informacion-nacionalidad']
      ]
    },
    {
      id: 'nacionalidad_plazos_paises', cat: 'documentos',
      q: '¿Cuántos años de residencia se necesitan para la nacionalidad y qué países tienen 2 años?',
      short: '10 años como regla general; 5 para refugiados; 2 para nacionales de países iberoamericanos, Andorra, Filipinas, Guinea Ecuatorial, Portugal y sefardíes; 1 año en supuestos personales (esposo/a de español, nacido en España, etc.). No es un convenio: es el art. 22 del Código Civil.',
      detail: [
        '2 años: nacionales de países iberoamericanos (Argentina, Bolivia, Brasil, Chile, Colombia, Costa Rica, Cuba, República Dominicana, Ecuador, El Salvador, Guatemala, Honduras, México, Nicaragua, Panamá, Paraguay, Perú, Uruguay y Venezuela), Andorra, Filipinas, Guinea Ecuatorial, Portugal y sefardíes.',
        '1 año: nacido en España; nacido fuera de España de padre/madre español de origen; adoptado por español; cónyuge de español con 1 año de matrimonio y sin separación; viudo/a de español con 1 año; descendiente de español de origen (art. 22.2.f).',
        '5 años: refugiados reconocidos. 10 años: resto de nacionales.',
        'No hay «convenio de 1 año por país»: el 1 año depende del vínculo personal, no de la nacionalidad. La Ley de Nietos está cerrada; no cuenta como vía nueva.',
        'Los exámenes no cambian el plazo: CCSE y, si procede, DELE A2 se exigen después de cumplir la residencia y antes de presentar la solicitud.',
        'La nacionalidad no regulariza automáticamente a tus familiares; cada uno necesita su propia vía.'
      ],
      links: [
        ['Código Civil · art. 22', 'https://www.boe.es/buscar/act.php?id=BOE-A-1889-4763'],
        ['Nacionalidad · Ministerio de Justicia', 'https://www.mjusticia.gob.es/es/ciudadania/nacionalidad/informacion-nacionalidad']
      ]
    },
    {
      id: 'declaracion_renta', cat: 'trabajo',
      q: '¿Quién está obligado a hacer la declaración de la renta, cuándo y dónde?',
      short: 'Los residentes fiscales con rentas por encima de los umbrales, no todos. La campaña va del 8 de abril al 30 de junio del año siguiente. Con 3 meses trabajados y 4 de residencia legal, probablemente no estés obligado, pero depende de tu residencia fiscal y del total anual.',
      detail: [
        'Umbral general: más de 22.000 € anuales de trabajo con un solo pagador. Con dos o más pagadores, el límite baja a 15.876 € si el segundo pagador supera 1.500 €. También hay que declarar con rentas de alquiler, actividad económica, capital o ganancias relevantes.',
        'No importa solo cuántos meses trabajaste: importa el total anual y si eres residente fiscal. Un sueldo alto en 3 meses puede superar 22.000 €; uno normal de 3 meses no.',
        'Residencia fiscal: más de 183 días en España en el año natural o centro principal de intereses económicos/familiares. Tener la TIE o llevar 4 meses de residencia legal no te convierte automáticamente en residente fiscal.',
        'Si eres residente fiscal, tributas por tu renta mundial y presentas IRPF. Si no lo eres, tributas como no residente (modelo 210) por la renta de fuente española; el empleador suele practicar retención.',
        'Fechas: del 8 de abril al 30 de junio del año siguiente. Online desde el 8 de abril; domiciliación bancaria hasta el 25 de junio; teléfono y oficina con cita. La campaña de 2025 terminó el 30/06/2026; la de 2026 se presenta en 2027.',
        'Aunque no estés obligado, puedes presentarla si te han retenido para recuperar. Si estás obligado y no la presentas, Hacienda puede sancionar y reclamar.'
      ],
      links: [
        ['AEAT · Renta', 'https://sede.agenciatributaria.gob.es/'],
        ['AEAT · obligación de declarar', 'https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025/c01-campana-declaracion-renta/quienes-estan-obligados-presentar-declaracion-irpf.html']
      ]
    },
    {
      id: 'tie_renovacion', cat: 'documentos',
      q: '¿Puedo renovar la TIE antes de que caduque?',
      short: 'Sí puedes presentar la renovación administrativa hasta 2 meses antes, por Mercurio o sede. Pero la TIE física y la toma de huellas NO se pueden hacer antes del día del vencimiento: solo desde esa fecha, nunca antes.',
      detail: [
        'Renovación administrativa: se presenta en los 2 meses anteriores al vencimiento por Mercurio o sede electrónica. Sirve para que evalúen si aprueban la renovación y por cuánto tiempo.',
        'TIE física: la toma de huellas y la emisión de la tarjeta solo se hacen desde el día en que vence la TIE. Aunque la renovación esté aprobada antes, no puedes adelantar la tarjeta.',
        'Si la policía te cita antes de la fecha de vencimiento, no puede tomar huellas ni renovar la TIE. No pierdas el viaje: espera al día del vencimiento.',
        'Desde el vencimiento, pide cita ICPP y lleva pasaporte, TIE vieja, foto, resolución favorable y tasa 790-012.',
        'Si la TIE ya caducó, la renovación administrativa y la TIE física ya están dentro de plazo; presenta cuanto antes y no esperes al día 91.',
        'No confundas autorización de residencia con tarjeta: puedes tener la renovación aprobada y seguir con la TIE vieja hasta que te tomen las huellas.'
      ],
      links: [
        ['Cita previa Policía · ICPP', 'https://icp.administracionelectronica.gob.es/icpplus'],
        ['Sede de Extranjería', 'https://sede.administracion.gob.es/']
      ]
    }
  ];

  function sortKey(q) {
    return String(q || '').replace(/^[¿¡\s]+/, '').toLocaleLowerCase('es');
  }
  function sortItems(items) {
    return (items || []).slice().sort(function (a, b) {
      return sortKey(a.q).localeCompare(sortKey(b.q), 'es', { sensitivity: 'base' });
    });
  }

  RL.faq = { categories: CATS, items: Q, sort: sortItems };
})();

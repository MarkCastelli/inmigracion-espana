/* ============================================================
   Ruta Legal · preguntas frecuentes (dudas reales de foros)
   Respuestas contrastadas con normativa y sede oficial.
   ============================================================ */
(function () {
  'use strict';
  var RL = window.RL = window.RL || {};

  var CATS = [
    { id: 'todas', label: 'Todas' },
    { id: 'arraigo', label: 'Arraigo' },
    { id: 'asilo', label: 'Asilo' },
    { id: 'ayudas', label: 'Ayudas' },
    { id: 'documentos', label: 'Documentos' },
    { id: 'entrada', label: 'Entrada y estancia' },
    { id: 'trabajo', label: 'Estudios y trabajo' },
    { id: 'familia', label: 'Familia' },
    { id: 'sanciones', label: 'Policía y sanciones' }
  ];

  var Q = [
    {
      id: 'turista_quedarse', cat: 'entrada',
      q: 'Soy turista, tengo visa por un periodo de tiempo y mi intención es quedarme: ¿qué papeles puedo obtener mientras estoy legal en España?',
      short: 'Mientras estás legal puedes obtener NIE, empadronamiento, Cl@ve, cuenta bancaria y otros documentos de vida diaria, pero ninguno te da residencia. El turismo no se puede convertir en residencia o trabajo por el simple hecho de estar aquí: para trabajar o estudiar normalmente hay que salir y pedir visado. Excepciones: asilo, familiar de español/UE y algunas circunstancias excepcionales.',
      detail: [
        'NIE: puedes solicitar el número de identidad de extranjero con EX-15 si lo necesitas para una operación justificada (banco, notaría, compra, contrato). El NIE es un número, no un permiso de residencia ni de trabajo.',
        'Empadronamiento: puedes empadronarte en el municipio donde vives. Sirve para acreditar domicilio y acceder a algunos servicios, pero no regulariza tu situación.',
        'Cl@ve, certificado digital y cuenta bancaria: puedes solicitarlos con pasaporte/NIE si cumples los requisitos. No cambian tu estancia.',
        'Sanidad: como turista sueles depender de tu seguro de viaje o de la asistencia urgente; no es lo mismo que la tarjeta sanitaria de residente. Confirma tu cobertura antes de quedarte.',
        'Trabajo: con turismo no puedes trabajar. La empresa no puede tramitar una autorización de trabajo mientras estés como turista; normalmente hay que pedir visado de trabajo desde el país de origen.',
        'Estudios: matricularte en un curso no te convierte en estudiante residente. El visado de estudios se pide generalmente desde el exterior; no cuentes con cambiar dentro de España.',
        'Vías que sí se pueden plantear desde España: asilo/protección internacional, familiar de español o de la UE si cumples el vínculo, y algunas circunstancias excepcionales. No son automáticas ni convierten el turismo en residencia.',
        'Arraigo: no puedes pedirlo mientras estás legal como turista; exige permanencia irregular y 2 años, entre otros requisitos. La regularización de 2026 ya está cerrada.',
        'Si tu intención es quedarte, no dejes que caduque la estancia: primero define la vía y consulta con un abogado o una entidad. Quedarte sin visado complica cualquier solicitud futura.'
      ],
      links: [
        ['Ministerio de Inclusión · extranjería', 'https://www.inclusion.gob.es/'],
        ['Sede de Extranjería', 'https://sede.administracion.gob.es/'],
        ['ACNUR · asilo', 'https://www.acnur.org/es-es/']
      ]
    },
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
      id: 'asilo_2026', cat: 'asilo',
      q: '¿Vale la pena solicitar asilo en 2026? ¿Qué gano, qué pierdo y qué posibilidades tengo?',
      short: 'Solo tiene sentido si temes de verdad volver por persecución o conflicto y puedes contarlo con pruebas. No es una vía para regularizar por trabajo o pobreza. Mientras se tramita tienes estancia legal y, tras 6 meses, opción de trabajo; pero el tiempo no cuenta para arraigo, puedes esperar años y una denegación te deja irregular. No existe una probabilidad individual fiable.',
      detail: [
        'Quién puede: personas no comunitarias que estén en España o en frontera y teman persecución por raza, religión, nacionalidad, opinión política, pertenencia a un grupo social, género u orientación sexual, o daños graves por conflicto. La pobreza o buscar trabajo no son motivos de asilo.',
        'Qué ganas mientras se tramita: estancia legal, protección frente a la devolución, tarjeta de solicitante y, a los 6 meses, posibilidad de autorización de trabajo si no hay denegación. Si te conceden, tienes residencia y protección.',
        'Qué pierdes o arriesgas: el tiempo como solicitante no cuenta para el arraigo; no puedes salir de España sin perder la protección; la espera puede ser larga; una denegación te deja en situación irregular y con plazo de recurso; la reagrupación familiar no es inmediata.',
        'Posibilidades: no hay un porcentaje fiable para tu caso. Las tasas oficiales dependen del país, del relato, de las pruebas y del criterio de la oficina; no predicen tu resultado. Una solicitud sin relato creíble y sin pruebas suele terminar en denegación.',
        'No es la regularización de 2026: si lo que buscas es regularizarte por arraigo, trabajo o estudios, el asilo no es un atajo y puede bloquearte otras vías mientras esté pendiente.',
        'Antes de solicitarlo: habla con un abogado o con CEAR/ACNUR. Prepara relato, fechas, documentos, informes y testigos. Si ya lo presentaste, controla requerimientos, entrevista y plazos.',
        'Si lo que temes es violencia de género, trata o una situación humanitaria, puede haber otra vía específica; no lo mezcles con un asilo sin asesoramiento.'
      ],
      links: [
        ['ACNUR España', 'https://www.acnur.org/es-es/'],
        ['CEAR', 'https://www.cear.es/'],
        ['Ley 12/2009 · BOE', 'https://www.boe.es/buscar/act.php?id=BOE-A-2009-19013']
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
      id: 'discapacidad_irregular', cat: 'ayudas',
      q: 'Soy inmigrante irregular y tengo discapacidad: ¿puedo obtener alguna ayuda?',
      short: 'Puede que puedas solicitar el certificado de discapacidad si estás empadronado, pero depende de tu comunidad autónoma. Sin residencia legal no suelen conceder pensión no contributiva, dependencia o IMV; sí puedes pedir ayuda de emergencia, sanidad y apoyo a entidades.',
      detail: [
        'El certificado de discapacidad lo expide la comunidad autónoma. Algunas permiten solicitarlo con empadronamiento aunque no tengas residencia; otras lo limitan. Pregunta en servicios sociales o en el centro de valoración de tu comunidad.',
        'Sin residencia legal, las prestaciones económicas como la pensión no contributiva de invalidez, la dependencia o el IMV suelen exigir residencia legal y años de residencia. No las des por hechas.',
        'Las ayudas de emergencia municipal y las entidades pueden atenderte sin residencia, pero dependen de presupuesto, valoración y requisitos. No son automáticas.',
        'Si hay menores, enfermedad grave o riesgo, dilo en servicios sociales y en el centro de salud: activa otra valoración y protección.',
        'No pagues a nadie por «conseguir» el certificado o una pensión: se solicita en la administración y no hay gestores con acceso privilegiado.'
      ],
      links: [
        ['IMSERSO', 'https://www.imserso.es/'],
        ['Servicios sociales', 'https://www.mdsocialesa2030.gob.es/']
      ]
    },
    {
      id: 'hijo_menor_discapacidad', cat: 'ayudas',
      q: 'Tengo un hijo menor de 18 años con discapacidad: ¿qué ayudas puedo pedir?',
      short: 'Depende de si está empadronado, tiene residencia legal y si la discapacidad está reconocida en España. El certificado extranjero no se aplica automáticamente. Puede optar a valoración, dependencia, apoyo escolar, transporte y ayudas autonómicas; la asignación familiar tiene requisitos.',
      detail: [
        'Reconocimiento: pide valoración en la comunidad autónoma. Los informes médicos extranjeros ayudan, pero no sustituyen el reconocimiento español.',
        'Si el menor está empadronado y tiene residencia legal, puede solicitar dependencia y ayudas autonómicas de educación, transporte, atención temprana o apoyo familiar. No todas son económicas.',
        'Si está en situación irregular, algunas comunidades permiten la valoración de discapacidad y el acceso a escuela y sanidad, pero las prestaciones económicas suelen exigir residencia. Confirma en servicios sociales.',
        'La asignación familiar por hijo a cargo y otras prestaciones de la Seguridad Social tienen requisitos de residencia, convivencia e ingresos; no se conceden solo por tener discapacidad.',
        'La dependencia del menor se solicita por sus padres o representante legal en la comunidad autónoma; puede dar servicios o prestación económica según el grado.'
      ],
      links: [
        ['IMSERSO · dependencia', 'https://www.imserso.es/'],
        ['Seguridad Social · prestaciones familiares', 'https://www.seg-social.es/']
      ]
    },
    {
      id: 'hijo_mayor_discapacidad', cat: 'ayudas',
      q: 'Mi hijo es mayor de edad y tiene discapacidad: ¿qué ayuda puede solicitar?',
      short: 'Si tiene residencia legal y discapacidad reconocida, puede pedir certificado, dependencia, pensión no contributiva si cumple 5 años de residencia y bajos ingresos, empleo y transporte. Si no es residente, quedan ayudas de emergencia y entidades; la edad no da ayudas automáticas.',
      detail: [
        'Certificado de discapacidad: lo expide la comunidad autónoma y sirve de base para otras ayudas. No es lo mismo que la incapacidad permanente del INSS.',
        'Dependencia: si necesita apoyo para la vida diaria, se solicita en la comunidad autónoma (SAAD). Puede dar servicios o prestación económica, pero exige valoración y residencia legal.',
        'Pensión no contributiva de invalidez: normalmente exige 18-64 años, discapacidad del 65 % o más, ingresos bajos y 5 años de residencia legal (algunas comunidades exigen más).',
        'Empleo y transporte: centros especiales de empleo, programas de inserción, tarjeta de transporte y estacionamiento para movilidad reducida; requisitos por comunidad.',
        'Si no tiene residencia legal, no se le puede prometer una pensión: acude a servicios sociales y a una entidad para valorar ayuda de emergencia y alternativas.'
      ],
      links: [
        ['IMSERSO · pensiones no contributivas', 'https://www.imserso.es/'],
        ['Seguridad Social', 'https://www.seg-social.es/']
      ]
    },
    {
      id: 'dependencia_quien', cat: 'ayudas',
      q: '¿La dependencia para quién es? ¿Cómo se pide y qué se obtiene?',
      short: 'La dependencia es de la persona que necesita apoyo para la vida diaria, no del cuidador. Se solicita en la comunidad autónoma (SAAD), con informe médico y social; puede dar servicios o prestación económica, pero no es automática ni equivale a la discapacidad.',
      detail: [
        'Puede solicitarla la propia persona dependiente o su representante legal. Se presenta en los servicios sociales de la comunidad autónoma o del ayuntamiento, según donde vivas.',
        'Se valora el grado de dependencia (moderada, severa o gran dependencia) con informes médicos y sociales. No basta con tener una enfermedad: importa la necesidad de apoyo.',
        'Prestaciones: ayuda a domicilio, teleasistencia, centro de día, residencia, prestación económica para cuidados en el entorno familiar, asistencia personal o prestación vinculada al servicio.',
        'Para extranjeros suele exigirse residencia legal y, en algunas comunidades, años de residencia. Sin residencia legal no es una vía automática; pregunta en servicios sociales.',
        'La dependencia es compatible con algunas ayudas, pero no con todas; y no sustituye a la pensión no contributiva ni a la incapacidad permanente.'
      ],
      links: [
        ['IMSERSO · SAAD', 'https://www.imserso.es/'],
        ['Dependencia · Ministerio', 'https://www.mdsocialesa2030.gob.es/']
      ]
    },
    {
      id: 'padres_dependientes', cat: 'ayudas',
      q: '¿Puedo pedir ayuda para mis padres mayores o dependientes?',
      short: 'Si están fuera de España, la vía es la reagrupación familiar, con requisitos del reagrupante. Si ya están aquí, depende de su residencia, empadronamiento y grado de dependencia; no hay una ayuda automática por ser mayor.',
      detail: [
        'Padres fuera de España: solo pueden venir por reagrupación si el reagrupante tiene residencia y cumple medios, vivienda y requisitos. La edad o la dependencia no sustituyen esos requisitos.',
        'Padres ya en España: pueden solicitar valoración de dependencia y ayudas autonómicas si tienen residencia legal y están empadronados. La pensión no contributiva exige edad, ingresos y años de residencia.',
        'Si están en situación irregular, las prestaciones económicas suelen estar excluidas; pueden acceder a servicios sociales de emergencia y entidades, según el municipio.',
        'La dependencia no convierte automáticamente al hijo en cuidador ni da una prestación por cuidar: hay que solicitarla y valorar el grado.',
        'No traigas a tus padres como turistas para «arreglarlo» después: la reagrupación exige que estén fuera y pidan visado.'
      ],
      links: [
        ['IMSERSO', 'https://www.imserso.es/'],
        ['Reagrupación · Ministerio', 'https://www.inclusion.gob.es/']
      ]
    },
    {
      id: 'asociaciones_por_zona', cat: 'ayudas',
      q: '¿Qué asociaciones me pueden ayudar según mi zona?',
      short: 'Hay entidades nacionales con oficinas locales (CEAR, ACCEM, Red Acoge, Cepaim, Cruz Roja, Cáritas) y asociaciones de barrio o provincia, como Diversidades Acolle en Vigo. No todas atienden sin cita ni cubren todos los trámites: confirma antes de ir.',
      detail: [
        'Entidades nacionales: CEAR (asilo y jurídico), ACCEM (acogida y empleo), Red Acoge (orientación jurídica), Fundación Cepaim (vivienda y empleo), Cruz Roja y Cáritas (emergencia, español, orientación). Busca la sede de tu provincia.',
        'Asociaciones locales: Diversidades Acolle, en Vigo (Pontevedra), trabaja acogida, asesoría jurídica, formación y acompañamiento. Hay otras en cada provincia; pregunta en el ayuntamiento, en servicios sociales o en el 012 de tu comunidad.',
        'No todas las entidades atienden sin cita, ni todos los casos, ni todos los trámites. Llama o consulta su web antes de desplazarte y lleva la documentación básica.',
        'Desconfía de quien cobra por «conseguir papeles», promete una autorización o pide el pasaporte por adelantado. Las entidades serias no garantizan resultados.',
        'Si no encuentras una entidad en tu zona, pide en servicios sociales una derivación y busca en el registro de entidades del Ministerio de Inclusión.'
      ],
      links: [
        ['CEAR', 'https://www.cear.es/'],
        ['ACCEM', 'https://www.accem.es/'],
        ['Red Acoge', 'https://www.redacoge.org/'],
        ['Diversidades Acolle', 'https://diversidades.org/']
      ]
    },
    {
      id: 'escolarizacion_libros', cat: 'ayudas',
      q: '¿Cómo escolarizo a mi hijo y cómo pido libros, material o comedor?',
      short: 'La escolarización obligatoria es gratuita y no depende de la residencia. La matrícula se pide en la consejería de educación o en el centro; libros, material, comedor y becas son ayudas aparte, con plazos y requisitos de cada comunidad. No hay un cheque único nacional.',
      detail: [
        'Escolarización: pide plaza en la consejería de educación de tu comunidad o en el centro. Si llegas fuera del plazo, solicita «escolarización sobrevenida»; no esperes al curso siguiente.',
        'Documentos habituales: pasaporte o documento del menor, libro de familia, empadronamiento, vacunas y, si los tienes, informes médicos o de discapacidad. La falta de residencia no debe impedir la escolarización obligatoria.',
        'Matrícula: se formaliza en el centro adjudicado. Pregunta por el comedor, el transporte y las ayudas de libros en la misma solicitud o en el plazo que indiquen.',
        'Libros y material: cada comunidad y algunos ayuntamientos tienen cheques, vales, préstamo o ayudas directas. Suelen pedir renta, matrícula y empadronamiento; guarda facturas y justificantes.',
        'Fechas: la admisión suele abrirse entre marzo y junio para el curso siguiente; las ayudas de libros/material suelen resolverse antes de septiembre. Las becas generales del Ministerio se convocan aparte, normalmente en primavera-verano. Confirma el calendario de tu comunidad.',
        'Comedor y transporte: se solicitan con la matrícula o en plazo aparte; la beca de comedor puede cubrir total o parcialmente el coste. No es automática.',
        'Si el menor tiene discapacidad, pide valoración y apoyo educativo; puede haber ayudas de transporte, material adaptado y comedor con prioridad.',
        'Dónde: consejería de educación, ayuntamiento, centro escolar y servicios sociales. En la app, Derechos y ayudas con tu comunidad/provincia.'
      ],
      links: [
        ['Ministerio de Educación', 'https://www.educacionfpydeportes.gob.es/'],
        ['Becas de educación', 'https://www.becaseducacion.gob.es/'],
        ['Servicios sociales', 'https://www.mdsocialesa2030.gob.es/']
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
    },
    {
      id: 'tie_foto_recogida', cat: 'documentos',
      q: '¿Me hacen la foto en la comisaría y cuándo recojo la TIE?',
      short: 'No te hacen la foto: la llevas tú, reciente, en color, 32 × 26 mm y fondo blanco. La TIE no se entrega el día de las huellas: debes pedir otra cita para recogerla, normalmente 30-45 días después.',
      detail: [
        'La foto la aporta el solicitante. En la comisaría te toman las huellas, no la fotografía. Si no llevas la foto correcta, pueden rechazarte.',
        'Formato habitual: 32 × 26 mm, color, fondo blanco, cabeza descubierta, sin gafas oscuras ni prendas que impidan identificarte.',
        'El día de las huellas llevas pasaporte, EX-17 o EX-15, resolución, TIE anterior si procede, tasa 790-012 y la foto.',
        'Después de las huellas, la tarjeta se fabrica. El plazo habitual es de 30-45 días; en picos de demanda puede llegar a 60.',
        'Cuando esté disponible, pide una segunda cita ICPP para recogerla en la misma comisaría donde pusiste las huellas.',
        'El día de la recogida lleva el resguardo de huellas, el pasaporte y la TIE anterior si te la pidieron. Revisa nombre, NIE, tipo y fechas antes de salir.'
      ],
      links: [
        ['Cita previa Policía · ICPP', 'https://icp.administracionelectronica.gob.es/icpplus'],
        ['Sede de Extranjería', 'https://sede.administracion.gob.es/']
      ]
    },
    {
      id: 'reagrupacion_fuera', cat: 'familia',
      q: '¿Puedo reagrupar a mi familia si ya está en España?',
      short: 'No. La reagrupación familiar exige que el cónyuge, los hijos o los ascendientes estén fuera de España y obtengan visado. Si ya están aquí, aunque sea de turismo o en situación irregular, no se reagrupan por esta vía.',
      detail: [
        'La reagrupación tiene dos fases: autorización del reagrupante en España y visado del familiar en el consulado de su país.',
        'Si el familiar ya está en España como turista, irregular o indocumentado, no puede pedir visado desde aquí ni se le puede reagrupar.',
        'Si ya están aquí, hay que valorar otra vía: familiar de español o de la UE, arraigo, circunstancias excepcionales u otra autorización que corresponda.',
        'No es lo mismo reagrupar que regularizar: la reagrupación no sirve para legalizar a alguien que ya está dentro.',
        'No pagues a gestores que prometan reagrupar a una persona que ya está en España.'
      ],
      links: [
        ['Ministerio de Inclusión', 'https://www.inclusion.gob.es/'],
        ['Código Civil y normativa', 'https://www.boe.es/']
      ]
    },
    {
      id: 'despues_nacionalidad', cat: 'documentos',
      q: 'Ya me concedieron la nacionalidad: ¿qué tengo que actualizar y en qué orden?',
      short: 'Primero jura o promesa en el Registro Civil dentro de 180 días, inscripción y DNI. Después actualiza padrón, Seguridad Social, tarjeta sanitaria, Hacienda, banco, empresa y DGT. La TIE deja de ser tu documento de identidad.',
      detail: [
        'Jura o promesa: tienes 180 días desde la notificación para jurar o prometer la Constitución. Si no lo haces, la concesión puede decaer.',
        'Registro Civil: tras la jura, inscribe la nacionalidad y pide el certificado literal de nacimiento español. Es la base para el DNI y el pasaporte.',
        'DNI: pide cita en la Policía Nacional. El DNI sustituye a la TIE como documento de identidad. Si quieres, solicita también el pasaporte español.',
        'Padrón: actualiza tu inscripción con el DNI y la nacionalidad. El certificado de empadronamiento debe reflejar tus datos nuevos.',
        'Seguridad Social: cambia el NIE por el DNI en Import@ss o con el modelo TA.1. Tu número de afiliación y tus cotizaciones no cambian.',
        'Sanidad: actualiza la tarjeta sanitaria en tu comunidad; puede que te den una nueva con el DNI.',
        'Hacienda: actualiza tu NIF y tus datos en la Agencia Tributaria. También banco, empresa, seguros y DGT, para evitar bloqueos.',
        'Si una entidad pide un certificado de concordancia NIE-DNI, solicítalo; no sustituye al DNI, solo acredita que ambos números corresponden a la misma persona.',
        'No uses la TIE como documento vigente después de tener DNI. Guarda una copia para tu historial y sigue el orden: jura, inscripción, DNI, padrón, Seguridad Social, sanidad y resto.'
      ],
      links: [
        ['Ministerio de Justicia · nacionalidad', 'https://www.mjusticia.gob.es/es/ciudadania/nacionalidad/informacion-nacionalidad'],
        ['Seguridad Social · cambio de NIE a DNI', 'https://www.seg-social.es/'],
        ['Policía · cita DNI/pasaporte', 'https://www.dnielectronico.es/']
      ]
    },
    {
      id: 'padron_renovacion', cat: 'documentos',
      q: '¿Cada cuánto hay que renovar el empadronamiento? ¿Es igual en toda España?',
      short: 'Los extranjeros no comunitarios sin autorización de residencia permanente deben renovar la inscripción cada 2 años. Los ciudadanos de la UE/EEE y quienes tienen residencia permanente no están obligados a esa renovación, aunque el ayuntamiento puede comprobar el domicilio. Es una norma estatal; el procedimiento y los avisos cambian por municipio.',
      detail: [
        'Base: artículo 16.1 de la Ley 7/1985, de Bases del Régimen Local. La renovación cada dos años se aplica a los extranjeros no comunitarios sin autorización de residencia permanente (ENCSARP).',
        'Si no renuevas, el ayuntamiento puede declarar la caducidad y darte de baja en el padrón. Eso puede afectar a sanidad, escuela, ayudas y a la prueba de permanencia para un arraigo.',
        'Ciudadanos de la UE/EEE y Suiza: no tienen esa renovación obligatoria cada dos años. Los residentes permanentes o de larga duración tampoco deberían estar sujetos a ella; confirma tu caso en el ayuntamiento.',
        'Es una regla estatal, así que el criterio de fondo es el mismo en toda España. Lo que cambia es el procedimiento municipal: algunos envían aviso, otros lo comprueban de oficio y otros piden cita.',
        'Cómo renovar: comprueba tu certificado de padrón, acude al ayuntamiento con pasaporte y TIE/residencia y confirma si la renovación es automática o requiere solicitud.',
        'Si te han dado de baja, pide el alta de nuevo y explica tu situación; no esperes a necesitar el certificado para un trámite.'
      ],
      links: [
        ['Ley 7/1985 · Régimen Local', 'https://www.boe.es/buscar/act.php?id=BOE-A-1985-5392'],
        ['INE · renovación padronal de extranjeros', 'https://www.ine.es/prensa/np389.pdf']
      ]
    },
    {
      id: 'latino_estudiar_trabajar', cat: 'entrada',
      q: 'Soy latinoamericano: ¿qué opciones tengo para venir a España a estudiar, trabajar o ambas?',
      short: 'Depende de la vía: visado de estudios (puedes trabajar hasta 30 h/semana compatible), visado de trabajo con oferta o contrato, o figuras especiales (altamente cualificado, nómada digital, emprendedor). No hay un visado para venir a buscar trabajo sin más, y la nacionalidad a 2 años no es un visado de entrada.',
      detail: [
        'No existe un visado general para «venir a buscar trabajo». Para el visado de trabajo necesitas una oferta o contrato firme; la empresa tramita la autorización, salvo figuras especiales. Para trabajar por cuenta propia necesitas un proyecto y medios.',
        'Estudiar: admisión en un centro o universidad autorizados, medios económicos, seguro médico, alojamiento, antecedentes penales y certificado médico. Después pides el visado de estudios en el consulado; al llegar, la TIE en 30 días.',
        'Estudiar y trabajar: la estancia por estudios permite trabajar hasta 30 h/semana si es compatible con los estudios. No es una autorización de trabajo estable: para un empleo fijo hay que modificar a residencia y trabajo.',
        'Trabajar: la empresa solicita la autorización de trabajo por cuenta ajena; después pides visado y, al entrar, la TIE. Hay vías especiales para altamente cualificados, nómadas digitales y emprendedores, con requisitos propios.',
        'Familia: si tienes cónyuge, hijos o ascendientes fuera de España y un familiar residente aquí, puede valorarse la reagrupación. Si ya están en España, la reagrupación no sirve.',
        'Nacionalidad: los latinoamericanos pueden solicitar la nacionalidad tras 2 años de residencia legal, pero eso no es una vía de entrada. No puedes venir como turista, quedarte irregular y pedir nacionalidad; primero necesitas una residencia legal.',
        'Turista: si tu nacionalidad tiene exención o te conceden un visado Schengen, son 90 días y no puedes trabajar. Muchos latinoamericanos necesitan visado; el turismo no es una vía para buscar trabajo ni para quedarse.',
        'Los requisitos cambian por consulado y por comunidad. Confirma en la sede oficial y no pagues a nadie que prometa «visado seguro» sin cumplir requisitos.'
      ],
      links: [
        ['Ministerio de Inclusión · extranjería', 'https://www.inclusion.gob.es/'],
        ['Servicios consulares · visados', 'https://www.exteriores.gob.es/'],
        ['Ministerio de Universidades', 'https://www.universidades.gob.es/'],
        ['SEPE · empleo', 'https://www.sepe.es/']
      ]
    },
    {
      id: 'dgt_canje_permisos', cat: 'documentos',
      q: '¿Puedo canjear mi permiso de conducir extranjero y sacar el de camión o autobús?',
      short: 'El canje depende del país y de la categoría: los permisos de la UE/EEE se canjean sin examen; los de países con convenio pueden exigir teoría o práctica; los de países sin convenio obligan a examinarse en España. Para camión C y autobús D, además del permiso hace falta el CAP.',
      detail: [
        'Los permisos de fuera de la UE/EEE suelen poder usarse solo 6 meses desde que obtienes la residencia. Después hay que canjearlos o dejar de conducir.',
        'Canje: permiso original, traducción jurada si procede, TIE/residencia, certificado médico, foto y tasa DGT. La Jefatura de tu provincia confirma si tu país tiene convenio y qué pruebas exige.',
        'Permiso B: 18 años, teórico y práctico, reconocimiento médico. Las pruebas son estatales; autoescuela, centro médico y fechas cambian por provincia.',
        'Moto: A1 desde 16, A2 desde 18 y A desde 20 con 2 años de A2. No todas las motos valen con el mismo permiso.',
        'Profesional: C1/C para camión y D1/D para autobús, con edades y requisitos propios. El CAP es obligatorio y tiene formación inicial y continua cada 5 años.',
        'Si transportas mercancías peligrosas necesitas además el ADR. Para taxi o VTC, la autorización municipal o autonómica es aparte.',
        'No hay un examen más fácil en otra comunidad: el marco es estatal. Lo que cambia es la Jefatura, los centros y las autorizaciones locales.'
      ],
      links: [
        ['DGT · canjes de permisos extranjeros', 'https://sede.dgt.gob.es/'],
        ['DGT · clases de permisos', 'https://www.dgt.es/nuestros-servicios/permisos-de-conducir/clases-de-permisos-de-conducir/'],
        ['Ministerio de Transportes · CAP', 'https://www.transportes.gob.es/transporte-terrestre/examenes-y-formacion/examenes-de-formacion-de-conductores-profesionales-cap']
      ]
    }
  ];

  function sortKey(q) {
    return String(q || '').replace(/^[¿¡\s]+/, '').toLocaleLowerCase('es');
  }
  function sortItems(items) {
    var order = {};
    CATS.forEach(function (c, i) { if (c.id !== 'todas') order[c.id] = i; });
    return (items || []).slice().sort(function (a, b) {
      var ca = order[a.cat] == null ? 99 : order[a.cat];
      var cb = order[b.cat] == null ? 99 : order[b.cat];
      if (ca !== cb) return ca - cb;
      return sortKey(a.q).localeCompare(sortKey(b.q), 'es', { sensitivity: 'base' });
    });
  }

  RL.faq = { categories: CATS, items: Q, sort: sortItems };
})();

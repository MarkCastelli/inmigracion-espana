/* ============================================================
   Ruta Legal · derechos, discapacidad, dependencia y ayudas
   ============================================================ */
(function () {
  'use strict';
  var RL = window.RL = window.RL || {};

  var SS = 'https://www.seg-social.es/';
  var IMSERSO = 'https://www.imserso.es/';
  var INCLUSION = 'https://www.inclusion.gob.es/';
  var JUSTICIA = 'https://sede.mjusticia.gob.es/es/tramites/asistencia-juridica-gratuita';
  var MIVAU = 'https://www.mivau.gob.es/';

  var A = [
    {
      id: 'discapacidad_cert', scope: 'region', cat: 'discapacidad', icon: 'shield',
      title: 'Certificado de discapacidad',
      what: ['Reconocimiento oficial del grado de discapacidad', 'Acceso a ayudas, tasas, transporte y beneficios', 'Base para la dependencia y la pensión no contributiva'],
      who: 'Personas con una limitación reconocida; el grado mínimo habitual para ayudas es el 33 %.',
      where: function (c) { return 'Servicios Sociales o Centro de Valoración de ' + c.regionName; },
      urlKey: 'social',
      note: 'No lo emite el ayuntamiento ni la Seguridad Social. El ayuntamiento puede informarte y tramitar la solicitud, pero el certificado lo expide la comunidad autónoma. La «incapacidad permanente» es otra cosa.'
    },
    {
      id: 'incapacidad', scope: 'national', cat: 'discapacidad', icon: 'briefcase',
      title: 'Incapacidad permanente (Seguridad Social)',
      what: ['Valora tu capacidad para trabajar', 'Puede dar lugar a una pensión contributiva', 'No es el certificado de discapacidad'],
      who: 'Personas afiliadas y en alta o situación asimilada, con cotizaciones suficientes.',
      where: 'INSS / Seguridad Social',
      url: SS,
      note: 'No es el certificado de discapacidad. Una incapacidad permanente total no equivale automáticamente al 33 % de discapacidad: son procedimientos distintos. La Seguridad Social no expide el certificado de discapacidad.'
    },
    {
      id: 'dependencia', scope: 'region', cat: 'dependencia', icon: 'family',
      title: 'Reconocimiento de dependencia (SAAD)',
      what: ['Ayuda a domicilio', 'Centro de día o residencia', 'Prestación económica para cuidados en el entorno familiar', 'Asistencia personal'],
      who: 'Personas que necesitan apoyo para las actividades básicas de la vida diaria.',
      where: function (c) { return 'Servicios Sociales de ' + c.regionName; },
      urlKey: 'social',
      note: 'Es distinto de la discapacidad y de la incapacidad laboral. La valoración y las prestaciones dependen de la comunidad autónoma y de la lista de espera.'
    },
    {
      id: 'familia_numerosa', scope: 'region', cat: 'familia', icon: 'family',
      title: 'Título de familia numerosa',
      what: ['Ventajas educativas y becas', 'Descuentos en transporte y tasas', 'Puntos y ayudas de vivienda', 'Beneficios fiscales'],
      who: 'Familias con 3 o más hijos, o 2 si uno tiene discapacidad, entre otros supuestos.',
      where: function (c) { return 'Servicios Sociales o consejería de ' + c.regionName; },
      urlKey: 'social',
      note: 'Se solicita en la comunidad autónoma. En algunas comunidades se exige residencia legal de todos los miembros; comprueba tu caso.'
    },
    {
      id: 'imv', scope: 'national', cat: 'economicas', icon: 'euro',
      title: 'Ingreso Mínimo Vital (IMV)',
      what: ['Prestación económica para hogares con bajos ingresos', 'Complemento de ayuda a la infancia', 'Puede combinarse con rentas de trabajo'],
      who: 'Hogares residentes en España que cumplan los requisitos de residencia, convivencia e ingresos.',
      where: 'Seguridad Social / Ministerio de Inclusión',
      url: INCLUSION,
      note: 'No es una ayuda para personas en situación irregular: exige residencia legal y continuada. Comprueba el requisito exacto antes de solicitarla.'
    },
    {
      id: 'rmi', scope: 'region', cat: 'economicas', icon: 'euro',
      title: 'Renta mínima o renta de inserción de tu comunidad',
      what: ['Ayuda económica periódica', 'Itinerario de inserción social o laboral', 'Complementos por hijos o discapacidad'],
      who: 'Personas o familias con ingresos por debajo del umbral de la comunidad.',
      where: function (c) { return 'Servicios Sociales de ' + c.regionName; },
      urlKey: 'social',
      note: 'Cada comunidad tiene su nombre, cuantía y requisitos. La mayoría exige residencia legal; algunas permiten solicitudes con empadronamiento. Pregunta en servicios sociales.'
    },
    {
      id: 'pnc', scope: 'national', cat: 'economicas', icon: 'euro',
      title: 'Pensión no contributiva de invalidez',
      what: ['Pensión para personas con discapacidad y pocos ingresos', 'Asistencia sanitaria y farmacéutica', 'Complementos por vivienda o familia'],
      who: 'Personas de 18 a 64 años con discapacidad ≥65 % y residencia legal; se exigen años de residencia.',
      where: 'IMSERSO / Servicios Sociales de la comunidad',
      url: IMSERSO,
      note: 'No es lo mismo que la incapacidad permanente. Requiere grado ≥65 % y residencia legal acreditada; los años exigidos varían.'
    },
    {
      id: 'emergencia', scope: 'local', cat: 'economicas', icon: 'family',
      title: 'Ayudas de emergencia social',
      what: ['Alimentos, higiene y ropa', 'Pago de alquiler o suministros', 'Gastos escolares o sanitarios urgentes'],
      who: 'Familias o personas sin recursos, previa valoración de servicios sociales.',
      where: function (c) { return 'Servicios Sociales de ' + (c.municipality || 'tu municipio'); },
      urlKey: 'social',
      note: 'No suelen exigir residencia legal, pero cada ayuntamiento tiene sus criterios. Pide cita en servicios sociales.'
    },
    {
      id: 'vivienda', scope: 'region', cat: 'vivienda', icon: 'home',
      title: 'Ayudas de vivienda y alquiler',
      what: ['Ayudas al alquiler', 'Vivienda pública', 'Programas de realojo y emergencia habitacional'],
      who: 'Hogares con ingresos limitados; algunas ayudas priorizan familias con menores o discapacidad.',
      where: function (c) { return 'Oficina de Vivienda de ' + c.regionName; },
      urlKey: 'portal',
      note: 'Las bases cambian cada año. Comprueba si exigen residencia legal, empadronamiento o informe de servicios sociales.'
    },
    {
      id: 'juridica', scope: 'national', cat: 'juridica', icon: 'shield',
      title: 'Asistencia jurídica gratuita',
      what: ['Abogado y procurador gratuitos si no puedes pagar', 'Turno de oficio', 'Defensa en procedimientos de extranjería'],
      who: 'Personas con insuficiencia de recursos, incluidas las extranjeras en España.',
      where: 'Colegio de Abogados de tu provincia / Ministerio de Justicia',
      url: JUSTICIA,
      note: 'No es lo mismo que una consulta gratuita de una entidad. Pide cita en el Colegio de Abogados o en el servicio de orientación jurídica.'
    },
    {
      id: 'menores', scope: 'region', cat: 'menores', icon: 'family',
      title: 'Derechos de los menores',
      what: ['Sanidad y educación con independencia de la situación administrativa', 'Protección y servicios sociales', 'Escolarización y comedor', 'Asistencia jurídica'],
      who: 'Menores de edad, acompañados o no.',
      where: function (c) { return 'Servicios Sociales y Consejería de Educación de ' + c.regionName; },
      urlKey: 'social',
      note: 'El interés superior del menor prevalece. Un menor no acompañado tiene derecho a protección y tutela de la comunidad. Al cumplir 18 cambia el mapa: no esperes al último día.'
    },
    {
      id: 'escolarizacion', scope: 'region', cat: 'menores', icon: 'book',
      title: 'Escolarización y matrícula',
      what: ['Plaza en colegio o instituto', 'Matrícula y documentación', 'Escolarización sobrevenida fuera de plazo'],
      who: 'Menores en edad obligatoria; la situación administrativa del menor o de la familia no impide la escolarización.',
      where: function (c) { return 'Consejería de Educación de ' + c.regionName + ' o ayuntamiento'; },
      urlKey: 'education',
      note: 'La educación obligatoria es gratuita y no depende de tener residencia. Si llegas fuera del plazo de admisión, pide «escolarización sobrevenida» en la consejería o en el centro. Lleva pasaporte, libro de familia, empadronamiento y vacunas si las tienes.'
    },
    {
      id: 'libros_material', scope: 'region', cat: 'menores', icon: 'book',
      title: 'Libros, material y cheques escolares',
      what: ['Ayudas para libros de texto', 'Material escolar', 'Cheques o vales de compra'],
      who: 'Familias con hijos escolarizados; normalmente se exige matrícula, empadronamiento y renta.',
      where: function (c) { return 'Consejería de Educación de ' + c.regionName + ' o centro educativo'; },
      urlKey: 'education',
      note: 'No hay un cheque único nacional: cada comunidad y algunos ayuntamientos tienen su programa. Los plazos suelen abrirse antes del inicio del curso y las ayudas pueden ser dinero, vale o material. Guarda facturas y justificantes.'
    },
    {
      id: 'comedor_becas', scope: 'region', cat: 'menores', icon: 'family',
      title: 'Comedor escolar y becas',
      what: ['Plaza de comedor', 'Beca de comedor', 'Ayuda de transporte escolar'],
      who: 'Alumnos escolarizados; se suele priorizar renta baja, familia numerosa, discapacidad o distancia.',
      where: function (c) { return 'Consejería de Educación de ' + c.regionName + ' o centro educativo'; },
      urlKey: 'education',
      note: 'El comedor puede ser gratuito, subvencionado o de pago según la comunidad y la renta. No es automático: se solicita junto con la matrícula o en plazo aparte. Pregunta por la beca de comedor y por el transporte.'
    },
    {
      id: 'becas_generales', scope: 'national', cat: 'formacion', icon: 'book',
      title: 'Becas generales del Ministerio',
      what: ['Becas para secundaria, FP y universidad', 'Ayuda de matrícula y material', 'Requisitos de renta y notas'],
      who: 'Estudiantes matriculados en enseñanzas del sistema educativo; requisitos económicos y académicos.',
      where: 'Ministerio de Educación / universidad o centro',
      url: 'https://www.becaseducacion.gob.es/',
      note: 'La convocatoria general suele abrirse entre primavera y verano para el curso siguiente; las fechas cambian cada año. No es lo mismo que las ayudas autonómicas de libros o comedor: se pueden pedir por separado si cumples requisitos.'
    },
    {
      id: 'estudios', scope: 'national', cat: 'formacion', icon: 'book',
      title: 'Reconocer estudios extranjeros',
      what: ['Homologación de ESO, Bachillerato o FP', 'Homologación de título universitario', 'Acceso a la universidad con UNEDasiss'],
      who: 'Cualquier persona con estudios terminados fuera de España, con pasaporte o NIE. No exige residencia legal.',
      where: 'Ministerio de Educación / Ministerio de Universidades',
      url: 'https://www.educacionfpydeportes.gob.es/servicios-al-ciudadano/catalogo/gestion-titulos/estudios-no-universitarios/titulos-extranjeros.html',
      note: 'No regulariza tu situación. La convalidación no te da un título; la homologación sí. UNEDasiss no homologa: acredita acceso a la universidad.'
    },
    {
      id: 'alimentos', scope: 'national', cat: 'economicas', icon: 'family',
      title: 'Comida y productos básicos',
      what: ['Alimentos, higiene y pañales', 'Tarjetas o vales de compra', 'Comedores sociales y reparto'],
      who: 'Familias o personas sin recursos, derivadas por servicios sociales o entidades.',
      where: 'Servicios sociales, Cruz Roja, Cáritas y Banco de Alimentos de tu provincia',
      url: 'https://www.bancodealimentos.es/',
      note: 'No es una ayuda automática: pide cita en servicios sociales o en una entidad. No tienes que contar tu situación migratoria para recibir alimentos.'
    },
    {
      id: 'vivienda_emergencia', scope: 'local', cat: 'vivienda', icon: 'home',
      title: 'Techo y vivienda de emergencia',
      what: ['Alojamiento temporal', 'Ayuda para alquiler o fianza', 'Programas de realojo', 'Orientación por desahucio'],
      who: 'Personas o familias sin vivienda o en riesgo de perderla.',
      where: function (c) { return 'Servicios Sociales de ' + (c.municipality || 'tu municipio') + ' y entidades de vivienda'; },
      url: 'https://www.cruzroja.es/',
      note: 'Llama al 112 si estás en la calle con menores o riesgo grave. Las ayudas de alquiler y los alojamientos cambian por municipio; pide cita en servicios sociales.'
    },
    {
      id: 'asociaciones', scope: 'national', cat: 'entidades', icon: 'family',
      title: 'Asociaciones y entidades de apoyo',
      what: ['Orientación jurídica', 'Clases de español', 'Empleo y formación', 'Vivienda y alimentos', 'Acompañamiento'],
      who: 'Personas migrantes, refugiadas y familias.',
      where: 'Red Acoge, ACCEM, Cepaim, Cruz Roja, Cáritas, CEAR y entidades locales',
      url: 'https://www.redacoge.org/',
      note: 'No todas están en todas las provincias. Llama antes y pregunta qué servicios tienen y si atienden sin cita.'
    },
    {
      id: 'salud_mental', scope: 'national', cat: 'salud', icon: 'shield',
      title: 'Apoyo psicológico y salud mental',
      what: ['Escucha y orientación', 'Atención psicológica', 'Derivación a servicios sanitarios'],
      who: 'Personas con ansiedad, duelo, trauma o riesgo de suicidio.',
      where: 'Centro de salud, servicios sociales y entidades',
      url: 'https://www.sanidad.gob.es/',
      note: 'Si hay riesgo de suicidio, llama al 024. Si es una urgencia, llama al 112. La atención urgente no depende de tu situación administrativa.'
    },
    {
      id: 'servicios_sociales', scope: 'local', cat: 'economicas', icon: 'family',
      title: 'Servicios Sociales del ayuntamiento',
      what: ['Valoración social e informe social', 'Ayudas de emergencia', 'Alimentos, alquiler y suministros', 'Derivación a entidades y recursos'],
      who: 'Cualquier persona empadronada o en urgencia social; también menores, personas con discapacidad y familias.',
      where: function (c) { return 'Centro de Servicios Sociales de ' + (c.municipality || 'tu municipio'); },
      urlKey: 'social',
      note: 'No es solo Cáritas: es la puerta pública. Tienes derecho a información y valoración; la ayuda concreta depende de requisitos y presupuesto. Si no te dan cita, presenta un escrito por registro.'
    },
    {
      id: 'muebles', scope: 'local', cat: 'vivienda', icon: 'home',
      title: 'Muebles y enseres',
      what: ['Muebles de segunda mano', 'Ropa de cama, menaje y electrodomésticos', 'Bancos de reutilización'],
      who: 'Familias que se mudan o pierden su vivienda, con derivación de servicios sociales.',
      where: function (c) { return 'Servicios Sociales de ' + (c.municipality || 'tu municipio') + ', Cáritas, Cruz Roja o punto limpio'; },
      url: 'https://www.cruzroja.es/',
      note: 'No es un derecho universal. A veces es gratis o precio simbólico; el transporte suele correr de tu cuenta. Pregunta por el banco de muebles municipal.'
    },
    {
      id: 'gafas', scope: 'region', cat: 'salud', icon: 'shield',
      title: 'Gafas y salud visual',
      what: ['Revisión de la vista', 'Ayuda para gafas', 'Programas para menores en riesgo'],
      who: 'Personas con problemas visuales y pocos recursos; menores y colectivos vulnerables tienen prioridad en algunos programas.',
      where: function (c) { return 'Centro de salud, servicios sociales o entidades de ' + c.regionName; },
      urlKey: 'health',
      note: 'La sanidad pública no cubre gafas a todos los adultos. Hay programas de algunas comunidades y entidades (ONCE, Fundación Barraquer) sobre todo para menores; no es automático.'
    },
    {
      id: 'suministros', scope: 'local', cat: 'vivienda', icon: 'home',
      title: 'Luz, agua y suministros',
      what: ['Ayuda de emergencia para facturas', 'Bono social eléctrico', 'Fraccionamiento o protección frente a cortes'],
      who: 'Hogares con dificultades para pagar suministros; el bono social tiene requisitos de consumidor vulnerable.',
      where: function (c) { return 'Servicios Sociales de ' + (c.municipality || 'tu municipio'); },
      url: 'https://www.miteco.gob.es/',
      note: 'No es automático. Pide cita en servicios sociales antes de que acumules deuda; el bono social se solicita a la comercializadora y tiene requisitos.'
    },
    {
      id: 'vales_comida', scope: 'local', cat: 'economicas', icon: 'family',
      title: 'Vales y tarjetas de comida',
      what: ['Vales para alimentos', 'Tarjetas de compra', 'Reparto de productos frescos'],
      who: 'Familias derivadas por servicios sociales o entidades.',
      where: function (c) { return 'Servicios Sociales de ' + (c.municipality || 'tu municipio') + ', Cruz Roja o Cáritas'; },
      url: 'https://www.cruzroja.es/',
      note: 'No son dinero en efectivo y no son universales. Suelen requerir derivación de servicios sociales y tienen límites de compra.'
    },
    {
      id: 'transporte', scope: 'region', cat: 'transporte', icon: 'route',
      title: 'Tarjetas y abonos de transporte',
      what: ['Abono joven o estudiante', 'Tarjeta para personas con discapacidad', 'Familia numerosa', 'Descuentos en bus, metro y cercanías'],
      who: 'Jóvenes, estudiantes, personas con discapacidad, familias numerosas y personas mayores; los requisitos cambian por comunidad.',
      where: function (c) { return 'Consorcio de transporte o ayuntamiento de ' + c.regionName; },
      urlKey: 'portal',
      note: 'No hay una tarjeta única nacional. El precio puede ser gratuito o reducido; pregunta por la tarjeta de estacionamiento para movilidad reducida, que es distinta.'
    },
    {
      id: 'discapacidad_entidades', scope: 'national', cat: 'entidades', icon: 'family',
      title: 'Entidades de discapacidad',
      what: ['Orientación y apoyo', 'Asesoría jurídica', 'Empleo, vivienda y autonomía'],
      who: 'Personas con discapacidad y sus familias.',
      where: 'CERMI, COCEMFE, Plena Inclusión, ONCE y entidades locales',
      url: 'https://www.cermi.es/',
      note: 'No sustituyen al certificado ni a la Seguridad Social, pero ayudan a tramitarlo y a acceder a recursos.'
    },
    {
      id: 'cruz_roja', scope: 'national', cat: 'entidades', icon: 'family',
      title: 'Cruz Roja',
      what: ['Orientación social', 'Español y formación', 'Ayuda de emergencia', 'Programas de empleo'],
      who: 'Personas migrantes y familias en dificultad.',
      where: 'Asamblea local de tu municipio',
      url: 'https://www2.cruzroja.es/'
    },
    {
      id: 'caritas', scope: 'national', cat: 'entidades', icon: 'family',
      title: 'Cáritas',
      what: ['Acogida y escucha', 'Asesoría jurídica', 'Ayudas de emergencia', 'Vivienda'],
      who: 'Personas y familias sin recursos.',
      where: 'Parroquia o sede diocesana',
      url: 'https://www.caritas.es/'
    },
    {
      id: 'cepaim', scope: 'national', cat: 'entidades', icon: 'family',
      title: 'Fundación Cepaim',
      what: ['Acompañamiento jurídico', 'Vivienda', 'Empleo y formación'],
      who: 'Personas migrantes y refugiadas.',
      where: 'Varias provincias',
      url: 'https://cepaim.org/'
    },
    {
      id: 'cear', scope: 'national', cat: 'entidades', icon: 'shield',
      title: 'CEAR',
      what: ['Asesoría de asilo', 'Acogida', 'Acompañamiento'],
      who: 'Solicitantes de protección internacional y refugiados.',
      where: 'Oficinas en varias provincias',
      url: 'https://www.cear.es/'
    },
    {
      id: 'banco_alimentos', scope: 'national', cat: 'entidades', icon: 'family',
      title: 'Banco de Alimentos',
      what: ['Alimentos para familias derivadas por servicios sociales', 'Entidades de reparto'],
      who: 'Familias en situación de vulnerabilidad.',
      where: 'Banco provincial o entidad de reparto',
      url: 'https://www.bancodealimentos.es/'
    }
  ];

  function resolveUrl(a, region) {
    if (a.url) return a.url;
    if (a.urlKey && region && region[a.urlKey]) return region[a.urlKey];
    return region ? region.portal : INCLUSION;
  }

  function adultDisabledOptions(p, d) {
    if (!d.hasDisabledChild && !d.hasDisability) return [];
    var out = [];
    var kind = d.permitKind || '';
    out.push({
      t: 'La discapacidad no es una autorización de residencia',
      b: 'No existe un permiso «por discapacidad». La discapacidad puede reforzar una vía familiar, de dependencia o de larga duración, pero no sustituye los requisitos de la tarjeta que tengas.'
    });
    if (kind === 'familiar_espanol') {
      out.push({
        t: 'Si la tarjeta es de familiar de español',
        b: 'La vía ordinaria es de 5 años, no de 1. Si te dieron 1 año, revisa la resolución: puede ser una autorización inicial o una renovación condicionada. Para renovar hay que mantener el vínculo, la convivencia o la dependencia y los medios; la discapacidad no exime de probar el vínculo.'
      });
    } else if (kind === 'reagrupacion') {
      out.push({
        t: 'Si la tarjeta es de reagrupación',
        b: 'La renovación va ligada al reagrupante y a los medios de la unidad familiar. Si el hijo adulto con discapacidad no tiene empleo, pueden contar los ingresos del reagrupante, la pensión, la dependencia o las ayudas. Si el reagrupante no puede sostenerlo, hay que valorar larga duración, circunstancias excepcionales o segunda oportunidad.'
      });
    } else if (kind === 'no_lucrativa') {
      out.push({
        t: 'Si la tarjeta es no lucrativa',
        b: 'Se renueva con medios económicos (IPREM), no con un contrato de trabajo. Pueden contar ingresos propios, pensiones, dependencia o apoyo familiar documentado. Si no llegas al umbral, la renovación puede denegarse.'
      });
    } else if (kind.indexOf('trabajo') === 0) {
      out.push({
        t: 'Si la tarjeta es de trabajo',
        b: 'La renovación pide contrato o medios. Si no hay empleo, valora la segunda oportunidad, la modificación a otra autorización o la larga duración si ya tienes 5 años. No dejes caducar sin presentar nada.'
      });
    } else if (kind === 'estudios') {
      out.push({
        t: 'Si la tarjeta es de estudios',
        b: 'No es una vía de residencia estable. Si el hijo adulto con discapacidad no puede estudiar, valora modificación, familiar de español/UE o circunstancias excepcionales; no cuentes con renovar estudios indefinidamente.'
      });
    } else {
      out.push({
        t: 'Mira la resolución y el tipo de tarjeta',
        b: 'No hay una respuesta única sin saber si es familiar de español, reagrupación, no lucrativa, trabajo o estudios. La renovación cambia por completo. Pide el informe de vida laboral y revisa la resolución con un abogado.'
      });
    }
    out.push({
      t: 'Si no hay empleo ni medios suficientes',
      b: 'Opciones a revisar: medios del familiar, pensión o prestación, dependencia, larga duración tras 5 años, segunda oportunidad si la renovación se deniega y circunstancias excepcionales. El arraigo no se puede pedir mientras tengas una autorización en vigor o un expediente abierto.'
    });
    return out;
  }

  RL.aids = {
    all: A,
    resolveUrl: resolveUrl,
    adultDisabledOptions: adultDisabledOptions,
    categories: [
      { id: 'todas', label: 'Todo' },
      { id: 'menores', label: 'Menores' },
      { id: 'discapacidad', label: 'Discapacidad' },
      { id: 'dependencia', label: 'Dependencia' },
      { id: 'familia', label: 'Familia numerosa' },
      { id: 'economicas', label: 'Ayudas económicas' },
      { id: 'vivienda', label: 'Vivienda' },
      { id: 'salud', label: 'Salud' },
      { id: 'transporte', label: 'Transporte' },
      { id: 'formacion', label: 'Estudios' },
      { id: 'juridica', label: 'Asistencia jurídica' },
      { id: 'entidades', label: 'Entidades' }
    ]
  };
})();

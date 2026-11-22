/* ============================================================
   Ruta Legal · trámites online, sedes y notificaciones
   ============================================================ */
(function () {
  'use strict';
  var RL = window.RL = window.RL || {};

  var SEDES = {
    andalucia: 'https://www.juntadeandalucia.es/',
    aragon: 'https://www.aragon.es/',
    asturias: 'https://sede.asturias.es/',
    baleares: 'https://www.caib.es/',
    canarias: 'https://sede.gobiernodecanarias.org/',
    cantabria: 'https://sede.cantabria.es/',
    castillalamancha: 'https://www.castillalamancha.es/',
    castillayleon: 'https://www.jcyl.es/',
    cataluna: 'https://seu.gencat.cat/',
    extremadura: 'https://www.juntaex.es/',
    galicia: 'https://sede.xunta.gal/',
    larioja: 'https://www.larioja.org/',
    madrid: 'https://sede.comunidad.madrid/',
    murcia: 'https://sede.carm.es/',
    navarra: 'https://www.navarra.es/',
    paisvasco: 'https://www.euskadi.eus/',
    valencia: 'https://sede.gva.es/',
    ceuta: 'https://sede.ceuta.es/',
    melilla: 'https://sede.melilla.es/'
  };

  var ITEMS = [
    {
      id: 'clave', scope: 'national', cat: 'identidad', mode: 'total',
      title: 'Cl@ve',
      what: ['Identificarte online', 'Firmar solicitudes', 'Consultar expedientes y notificaciones'],
      requires: 'Registro con DNI/NIE y teléfono; puede ser online o en oficina.',
      where: 'Sede de Cl@ve',
      url: 'https://clave.gob.es/',
      note: 'Es la llave más útil si no tienes certificado digital. No la pidas a gestores: se registra en la web oficial.'
    },
    {
      id: 'fnmt', scope: 'national', cat: 'identidad', mode: 'total',
      title: 'Certificado digital FNMT',
      what: ['Firmar electrónicamente', 'Presentar solicitudes', 'Acceder a DEHú, Mercurio y sedes'],
      requires: 'Solicitud online y acreditación de identidad en oficina de registro o vídeo.',
      where: 'Sede FNMT',
      url: 'https://www.sede.fnmt.gob.es/certificados/persona-fisica',
      note: 'La FNMT no expide NIE ni resuelve extranjería. Es solo el certificado.'
    },
    {
      id: 'dehu', scope: 'national', cat: 'notificaciones', mode: 'total',
      title: 'DEHú · notificaciones electrónicas',
      what: ['Recibir notificaciones de todas las administraciones', 'Consultar comunicaciones', 'Usar la app «Notifica»'],
      requires: 'Cl@ve o certificado digital.',
      where: 'DEHú',
      url: 'https://dehu.redsara.es/',
      note: 'Si no miras DEHú, una notificación puede caducar. Actívala y revisa también la Carpeta Ciudadana.'
    },
    {
      id: 'carpeta', scope: 'national', cat: 'notificaciones', mode: 'total',
      title: 'Carpeta Ciudadana',
      what: ['Ver expedientes', 'Consultar notificaciones', 'Descargar documentos'],
      requires: 'Cl@ve o certificado digital.',
      where: 'Sede de la Administración',
      url: 'https://sede.administracion.gob.es/',
      note: 'Es la vista general de tus trámites con la Administración General del Estado.'
    },
    {
      id: 'extranjeria_sede', scope: 'national', cat: 'extranjeria', mode: 'partial',
      title: 'Sede de Extranjería',
      what: ['Iniciar o consultar expedientes', 'Aportar documentos', 'Ver notificaciones'],
      requires: 'Cl@ve o certificado; algunos trámites siguen siendo presenciales.',
      where: 'Sede de la Administración / Oficina de Extranjería',
      url: 'https://sede.administracion.gob.es/',
      note: 'No todos los trámites se pueden terminar online. Comprueba si tu procedimiento permite sede o exige cita.'
    },
    {
      id: 'mercurio', scope: 'national', cat: 'extranjeria', mode: 'partial',
      title: 'Mercurio · extranjería online',
      what: ['Presentar solicitudes y renovaciones habilitadas', 'Aportar documentos a un expediente', 'Consultar el estado'],
      requires: 'Certificado digital o Cl@ve. No todos los procedimientos están habilitados; algunos exigen empresa, representante o autorización.',
      where: 'Mercurio',
      url: 'https://mercurio.delegaciondelgobierno.gob.es/mercurio/',
      note: 'Permite evitar la cita para los trámites habilitados, pero no sustituye a la sede ni sirve para nacionalidad. Comprueba si tu procedimiento concreto está en Mercurio antes de preparar el expediente.'
    },
    {
      id: 'dgt_canje', scope: 'national', cat: 'dgt', mode: 'partial',
      title: 'DGT · canje de permiso de conducir',
      what: ['Iniciar el canje digital', 'Pagar la tasa', 'Consultar el estado'],
      requires: 'Cl@ve; permiso extranjero, residencia y documentación; algunos países exigen cita.',
      where: 'Sede DGT y Jefatura Provincial de Tráfico',
      url: 'https://sede.dgt.gob.es/',
      note: 'El canje digital evita la cita inicial, pero debes entregar el permiso original en la Jefatura. Los países con convenio pueden exigir cita y verificación. No todas las licencias son canjeables.'
    },
    {
      id: 'dgt_oficina', scope: 'national', cat: 'dgt', mode: 'info',
      title: 'DGT · dónde estamos',
      what: ['Buscar tu Jefatura Provincial', 'Consultar horarios y trámites', 'Pedir cita cuando haga falta'],
      requires: 'Ninguno para consultar.',
      where: 'Jefatura Provincial de Tráfico',
      url: 'https://www.dgt.es/conoce-la-dgt/donde-estamos',
      note: 'El canje y otros trámites con verificación pueden exigir cita presencial. Consulta tu provincia.'
    },
    {
      id: 'importass', scope: 'national', cat: 'trabajo', mode: 'total',
      title: 'Import@ss · Seguridad Social',
      what: ['Número de la Seguridad Social', 'Vida laboral', 'Altas, bajas y certificados'],
      requires: 'Cl@ve, certificado o acceso con SMS.',
      where: 'Import@ss',
      url: 'https://portal.seg-social.gob.es/wps/portal/importass/importass/Categorias/vida%2blaboral%2be%2binformes',
      note: 'La vida laboral es clave para arraigo sociolaboral, renovación y nacionalidad.'
    },
    {
      id: 'sepe', scope: 'national', cat: 'trabajo', mode: 'partial',
      title: 'SEPE · empleo y prestaciones',
      what: ['Inscripción como demandante', 'Consultar prestaciones', 'Citas y trámites'],
      requires: 'Cl@ve o certificado; algunos trámites requieren cita.',
      where: 'SEPE',
      url: 'https://www.sepe.es/',
      note: 'La demanda de empleo y las prestaciones tienen requisitos propios; no sustituyen la autorización de trabajo.'
    },
    {
      id: 'aeat', scope: 'national', cat: 'trabajo', mode: 'total',
      title: 'Agencia Tributaria · Renta',
      what: ['Presentar la declaración de la renta', 'NIF y certificados', 'Consultar deudas y notificaciones'],
      requires: 'Cl@ve o certificado; Renta WEB.',
      where: 'Sede AEAT',
      url: 'https://sede.agenciatributaria.gob.es/',
      note: 'Campaña de renta: 8 de abril a 30 de junio. No regulariza tu situación, pero muchos trámites piden estar al corriente o acreditar ingresos.'
    },
    {
      id: 'justicia', scope: 'national', cat: 'justicia', mode: 'partial',
      title: 'Justicia · nacionalidad y antecedentes',
      what: ['Solicitud de nacionalidad', 'Certificado de antecedentes', 'Certificado de delitos sexuales'],
      requires: 'Cl@ve o certificado; algunos trámites tienen tasa.',
      where: 'Sede de Justicia',
      url: 'https://sede.mjusticia.gob.es/',
      note: 'La nacionalidad por residencia se puede iniciar online; la inscripción posterior puede requerir Registro Civil.'
    },
    {
      id: 'registro_civil', scope: 'national', cat: 'justicia', mode: 'partial',
      title: 'Registro Civil · certificados online',
      what: ['Certificado de nacimiento', 'Certificado de matrimonio', 'Certificado de defunción', 'Último testamento'],
      requires: 'Cl@ve, certificado digital o DNI electrónico para descarga inmediata. Sin identificación electrónica, la solicitud puede hacerse por correo postal.',
      where: 'Sede del Ministerio de Justicia',
      url: 'https://sede.mjusticia.gob.es/',
      note: 'Los certificados se descargan al momento y son gratuitos. Inscripciones, rectificaciones y otros actos del Registro Civil pueden exigir cita presencial; no todos los trámites son 100 % online.'
    },
    {
      id: 'cervantes', scope: 'national', cat: 'formacion', mode: 'total',
      title: 'Exámenes CCSE y DELE A2',
      what: ['Inscripción al CCSE', 'Inscripción al DELE A2', 'Consulta de resultados y certificados'],
      requires: 'NIE/pasaporte, pago online y elección de centro/convocatoria.',
      where: 'Instituto Cervantes o centro acreditado',
      url: 'https://cervantes.org/es/examenes',
      note: 'CCSE: 85 €, 25 preguntas y 45 minutos. DELE A2: unos 138 € y 2,5 horas. Plazas limitadas: inscríbete con tiempo.'
    },
    {
      id: 'tasas', scope: 'national', cat: 'extranjeria', mode: 'total',
      title: 'Tasas 790',
      what: ['Descargar y pagar la tasa 790-052', 'Elegir epígrafe', 'Guardar el justificante'],
      requires: 'Datos del trámite y pago.',
      where: 'Sede de Administraciones Públicas',
      url: 'https://sede.administracionespublicas.gob.es/procedimientos/index/categoria/33',
      note: 'La tasa se paga antes de presentar. Guarda el justificante y comprueba el epígrafe que te corresponde.'
    },
    {
      id: 'icpp', scope: 'national', cat: 'extranjeria', mode: 'partial',
      title: 'Cita previa de Policía (ICPP)',
      what: ['NIE, TIE y huellas', 'Asilo en comisaría', 'Cita para documentación'],
      requires: 'Pasaporte, formulario y tasa; cita online.',
      where: 'Comisaría de tu provincia',
      url: 'https://icp.administracionelectronica.gob.es/icpplus',
      note: 'La cita se pide online, pero el trámite es presencial. No vayas sin cita y sin la tasa.'
    },
    {
      id: 'universidades', scope: 'national', cat: 'formacion', mode: 'partial',
      title: 'Universidades y homologación de títulos',
      what: ['Homologación de títulos extranjeros', 'Reconocimiento profesional', 'Acceso a universidad (UNEDasiss)'],
      requires: 'Título, traducción jurada y apostilla; pago de tasa. Algunos trámites se inician online y siguen presenciales.',
      where: 'Ministerio de Ciencia, Innovación y Universidades',
      url: 'https://www.ciencia.gob.es/',
      note: 'No homologues por defecto: confirma si tu profesión está regulada o si el trámite concreto lo exige. La homologación no es lo mismo que el reconocimiento profesional.'
    },
    {
      id: 'ccaa_sede', scope: 'region', cat: 'ccaa', mode: 'partial',
      title: 'Sede de tu comunidad',
      what: ['Sanidad, educación y servicios sociales', 'Ayudas y vivienda', 'Notificaciones autonómicas'],
      requires: 'Cl@ve o certificado; algunos trámites son presenciales.',
      where: function (c) { return 'Sede de ' + c.regionName; },
      urlKey: 'sede',
      note: 'Cada comunidad tiene su propia sede. En Madrid no sirve la sede de Galicia, y al contrario. Si el enlace va al portal principal, busca «sede electrónica» o «trámites».'
    },
    {
      id: 'ccaa_salud', scope: 'region', cat: 'ccaa', mode: 'partial',
      title: 'Sanidad de tu comunidad',
      what: ['Tarjeta sanitaria', 'Cita de médico', 'Informes y recetas'],
      requires: 'Tarjeta sanitaria o identificación; cada comunidad tiene su app/web.',
      where: function (c) { return c.healthName + ' · ' + c.regionName; },
      urlKey: 'health',
      note: 'La tarjeta sanitaria se pide en tu centro de salud o en la web de tu servicio de salud.'
    },
    {
      id: 'ccaa_educacion', scope: 'region', cat: 'ccaa', mode: 'partial',
      title: 'Educación de tu comunidad',
      what: ['Escolarización', 'Becas', 'Títulos y formación'],
      requires: 'Cada comunidad tiene su sede y sus plazos.',
      where: function (c) { return 'Consejería de Educación de ' + c.regionName; },
      urlKey: 'education',
      note: 'La homologación de estudios es del Ministerio de Educación; la escolarización y las becas, de la comunidad.'
    },
    {
      id: 'concello', scope: 'local', cat: 'local', mode: 'partial',
      title: 'Ayuntamiento/Concello',
      what: ['Padrón', 'Servicios sociales', 'Pagos y trámites locales'],
      requires: 'Cada ayuntamiento tiene su sede; muchos trámites aún son presenciales.',
      where: function (c) { return c.localLabel + ' de ' + (c.municipality || 'tu municipio'); },
      urlKey: 'portal',
      note: 'No hay una sede nacional de ayuntamientos. Busca la web oficial de tu municipio y desconfía de gestores que piden dinero por el padrón.'
    }
  ];

  function regionSede(region) {
    if (!region) return 'https://sede.administracion.gob.es/';
    return SEDES[region.id] || region.portal;
  }
  function resolveUrl(item, region) {
    if (item.url) return item.url;
    if (item.urlKey === 'sede') return regionSede(region);
    if (item.urlKey && region && region[item.urlKey]) return region[item.urlKey];
    return region ? region.portal : 'https://sede.administracion.gob.es/';
  }

  RL.online = {
    checked: '2026-11-20',
    items: ITEMS,
    resolveUrl: resolveUrl,
    categories: [
      { id: 'todas', label: 'Todo' },
      { id: 'identidad', label: 'Identidad' },
      { id: 'notificaciones', label: 'Notificaciones' },
      { id: 'extranjeria', label: 'Extranjería' },
      { id: 'dgt', label: 'DGT y conducir' },
      { id: 'trabajo', label: 'Trabajo' },
      { id: 'justicia', label: 'Justicia' },
      { id: 'formacion', label: 'Exámenes' },
      { id: 'ccaa', label: 'Comunidad' },
      { id: 'local', label: 'Ayuntamiento' }
    ]
  };
})();

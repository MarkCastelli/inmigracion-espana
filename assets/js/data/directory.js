/* ============================================================
   Ruta Legal · directorio de sitios de interés
   Cada ficha dice qué se puede hacer allí y enlaza a la sede.
   ============================================================ */
(function () {
  'use strict';
  var RL = window.RL = window.RL || {};

  var CATS = [
    { id: 'todas', label: 'Todo' },
    { id: 'documentos', label: 'Documentos' },
    { id: 'salud', label: 'Salud' },
    { id: 'trabajo', label: 'Trabajo' },
    { id: 'familia', label: 'Familia' },
    { id: 'formacion', label: 'Formación' },
    { id: 'ayuda', label: 'Ayuda' },
    { id: 'vivienda', label: 'Vivienda' },
    { id: 'justicia', label: 'Justicia' }
  ];

  var E = [
    /* ── nacionales ── */
    {
      id: 'policia', scope: 'national', cat: 'documentos', icon: 'shield',
      title: 'Policía Nacional',
      what: ['NIE, TIE y toma de huellas', 'Cita previa para extranjería', 'Solicitud de asilo en comisaría', 'Denuncias por delitos o violencia'],
      where: 'Comisaría de tu provincia (con cita previa)',
      url: 'https://icp.administracionelectronica.gob.es/icpplus',
      note: 'La cita se pide en el sistema ICPP; en algunas provincias se hace por teléfono. Lleva pasaporte, fotos y la tasa pagada.'
    },
    {
      id: 'extranjeria', scope: 'national', cat: 'documentos', icon: 'doc',
      title: 'Oficina de Extranjería',
      what: ['Arraigos y circunstancias excepcionales', 'Residencia, renovaciones y modificaciones', 'Reagrupación familiar', 'Familiares de españoles y de la UE'],
      where: 'Delegación o Subdelegación del Gobierno de tu provincia',
      url: 'https://www.inclusion.gob.es/',
      note: 'Depende del Ministerio de Inclusión. Muchos trámites se presentan por sede electrónica.'
    },
    {
      id: 'delegacion_gobierno', scope: 'region', cat: 'documentos', icon: 'shield',
      title: 'Delegación o Subdelegación del Gobierno',
      what: ['Oficina de Extranjería', 'Asilo y protección internacional', 'Sanciones y expulsiones', 'Coordinación de la Administración del Estado'],
      where: 'Delegación o Subdelegación del Gobierno de tu provincia',
      url: 'https://www.mpt.gob.es/',
      note: 'No es la Xunta, el Concello ni una ONG: no da comida, casa ni ayudas sociales. Para eso ve a servicios sociales.'
    },
    {
      id: 'guardia_civil', scope: 'national', cat: 'justicia', icon: 'shield',
      title: 'Guardia Civil',
      what: ['Denuncias en municipios pequeños', 'Auxilio y protección', 'Algunos trámites de extranjería en zona rural'],
      where: 'Cuartel de tu zona',
      url: 'https://www.guardiacivil.es/'
    },
    {
      id: 'fnmt', scope: 'national', cat: 'documentos', icon: 'doc',
      title: 'Casa de la Moneda y Timbre (FNMT)',
      what: ['Certificado digital para trámites online', 'Firma electrónica', 'Identidad digital para la sede'],
      where: 'Online o en una oficina de registro (AEAT, Seguridad Social…)',
      url: 'https://www.sede.fnmt.gob.es/certificados/persona-fisica',
      note: 'No es una oficina de extranjería: no expide NIE. El certificado se solicita online y se acredita en un registro.'
    },
    {
      id: 'clave', scope: 'national', cat: 'documentos', icon: 'shield',
      title: 'Cl@ve',
      what: ['Identificación electrónica', 'Consultar expedientes', 'Firmar solicitudes online'],
      where: 'Online o en oficinas de registro',
      url: 'https://clave.gob.es/',
      note: 'Alternativa al certificado digital. Muchos trámites de extranjería y nacionalidad la aceptan.'
    },
    {
      id: 'seguridad_social', scope: 'national', cat: 'trabajo', icon: 'briefcase',
      title: 'Seguridad Social (TGSS)',
      what: ['Número de la Seguridad Social', 'Informe de vida laboral', 'Altas, bajas y cotizaciones'],
      where: 'Tesorería General de la Seguridad Social de tu provincia',
      url: 'https://www.seg-social.es/',
      note: 'La vida laboral es una prueba clave para arraigo sociolaboral, nacionalidad y larga duración.'
    },
    {
      id: 'sepe', scope: 'national', cat: 'trabajo', icon: 'briefcase',
      title: 'SEPE · Servicio Público de Empleo',
      what: ['Inscripción como demandante de empleo', 'Prestaciones y subsidios', 'Cursos y ofertas'],
      where: 'Oficina de empleo de tu provincia',
      url: 'https://www.sepe.es/'
    },
    {
      id: 'aeat', scope: 'national', cat: 'trabajo', icon: 'euro',
      title: 'Agencia Tributaria',
      what: ['NIF y certificados', 'Declaración de la renta', 'Justificantes de ingresos'],
      where: 'Delegación de la AEAT de tu provincia',
      url: 'https://sede.agenciatributaria.gob.es/'
    },
    {
      id: 'registro_civil', scope: 'national', cat: 'familia', icon: 'family',
      title: 'Registro Civil',
      what: ['Nacimiento, matrimonio y defunción', 'Inscripción de nacionalidad', 'Certificados y capitulaciones'],
      where: 'Registro Civil de tu municipio o del lugar del hecho',
      url: 'https://sede.mjusticia.gob.es/es/tramites/cita-previa-registro-civil'
    },
    {
      id: 'justicia', scope: 'national', cat: 'documentos', icon: 'doc',
      title: 'Ministerio de Justicia',
      what: ['Nacionalidad por residencia', 'Certificado de antecedentes penales', 'Registro Civil'],
      where: 'Sede electrónica o Registro Civil',
      url: 'https://www.mjusticia.gob.es/',
      note: 'El certificado de antecedentes penales español es gratuito y suele caducar a los 3 meses.'
    },
    {
      id: 'cervantes', scope: 'national', cat: 'formacion', icon: 'book',
      title: 'Instituto Cervantes',
      what: ['DELE A2', 'Prueba CCSE', 'Cursos de español'],
      where: 'Centros del Instituto Cervantes en España y en el mundo',
      url: 'https://cervantes.org/es/examenes',
      note: 'Para la nacionalidad por residencia necesitas el CCSE y, si no eres hispanohablante, el DELE A2.'
    },
    {
      id: 'educacion', scope: 'national', cat: 'formacion', icon: 'book',
      title: 'Ministerio de Educación',
      what: ['Homologación de títulos', 'Equivalencias', 'Becas y ayudas'],
      where: 'Sede electrónica del Ministerio',
      url: 'https://www.educacionfpydeportes.gob.es/'
    },
    {
      id: 'inclusion', scope: 'national', cat: 'documentos', icon: 'home',
      title: 'Ministerio de Inclusión',
      what: ['Extranjería e integración', 'Asilo y protección internacional', 'Información de procedimientos'],
      where: 'Sede central y oficinas periféricas',
      url: 'https://www.inclusion.gob.es/'
    },
    {
      id: 'asilo', scope: 'national', cat: 'ayuda', icon: 'shield',
      title: 'Oficina de Asilo y Refugio',
      what: ['Solicitar protección internacional', 'Entrevista y tramitación', 'Tarjeta de solicitante'],
      where: 'Madrid, frontera o comisaría según el caso',
      url: 'https://www.inclusion.gob.es/',
      note: 'También puedes acudir a ACNUR o CEAR para orientación gratuita.'
    },
    {
      id: 'embajada', scope: 'national', cat: 'documentos', icon: 'globe',
      title: 'Embajada y consulados de tu país',
      what: ['Pasaporte y documentos de viaje', 'Antecedentes penales del país', 'Poderes y documentos civiles', 'Registro consular'],
      where: 'Madrid y consulados (según tu país)',
      url: 'https://www.exteriores.gob.es/',
      note: 'Busca la embajada de tu país en España y pide cita. Muchos documentos deben estar apostillados o legalizados.'
    },
    {
      id: 'abogacia', scope: 'national', cat: 'ayuda', icon: 'shield',
      title: 'Colegio de Abogados',
      what: ['Turno de oficio', 'Orientación jurídica', 'Abogado especialista en extranjería'],
      where: 'Colegio de tu provincia',
      url: 'https://www.abogacia.es/',
      note: 'Si no puedes pagar abogado, pregunta por el turno de oficio o por las entidades sociales.'
    },
    {
      id: 'defensor', scope: 'national', cat: 'justicia', icon: 'shield',
      title: 'Defensor del Pueblo',
      what: ['Quejas por mala actuación administrativa', 'Derechos fundamentales', 'Información'],
      where: 'Online o sede en Madrid',
      url: 'https://www.defensordelpueblo.es/'
    },
    {
      id: 'inspeccion', scope: 'national', cat: 'trabajo', icon: 'briefcase',
      title: 'Inspección de Trabajo',
      what: ['Denunciar abusos laborales', 'Salarios impagados', 'Condiciones y seguridad'],
      where: 'Inspección Provincial de Trabajo',
      url: 'https://www.mites.gob.es/itss/web/index.html'
    },
    {
      id: 'victimas', scope: 'national', cat: 'ayuda', icon: 'alert', phone: '016',
      title: '016 · Violencia de género y trata',
      what: ['Atención 24 h y confidencial', 'Recursos de protección', 'Autorización de residencia por violencia'],
      where: 'Teléfono 016 y servicios sociales especializados',
      url: 'https://www.igualdad.gob.es/',
      note: 'No deja rastro en la factura. También puedes acudir a una entidad especializada.'
    },
    {
      id: 'acnur', scope: 'national', cat: 'ayuda', icon: 'shield',
      title: 'ACNUR España',
      what: ['Información sobre asilo', 'Protección internacional', 'Derivación a abogados'],
      where: 'Online y oficinas de socio',
      url: 'https://www.acnur.org/es-es/'
    },
    {
      id: 'diversidades_acolle', scope: 'local', cat: 'ayuda', icon: 'family',
      title: 'Diversidades Acolle',
      what: ['Acogida y orientación', 'Asesoría jurídica', 'Formación y empleo', 'Acompañamiento social'],
      where: 'Vigo (Pontevedra)',
      url: 'https://diversidades.org/',
      provinces: ['Pontevedra'],
      note: 'Entidad de Vigo que trabaja con personas migrantes y solicitantes de asilo. Confirma horario, cita y cobertura antes de desplazarte; no promete resultados ni papeles.'
    },
    {
      id: 'cear', scope: 'national', cat: 'ayuda', icon: 'shield',
      title: 'CEAR',
      what: ['Asesoría jurídica de asilo', 'Acogida', 'Acompañamiento'],
      where: 'Oficinas en varias provincias',
      url: 'https://www.cear.es/'
    },
    {
      id: 'cruz_roja', scope: 'national', cat: 'ayuda', icon: 'family',
      title: 'Cruz Roja',
      what: ['Orientación social', 'Clases de español', 'Ayuda de emergencia'],
      where: 'Asamblea local de tu municipio',
      url: 'https://www2.cruzroja.es/'
    },
    {
      id: 'caritas', scope: 'national', cat: 'ayuda', icon: 'family',
      title: 'Cáritas',
      what: ['Acogida', 'Asesoría', 'Ayudas de emergencia'],
      where: 'Parroquia o sede diocesana',
      url: 'https://www.caritas.es/'
    },
    {
      id: 'cepaim', scope: 'national', cat: 'ayuda', icon: 'family',
      title: 'Fundación Cepaim',
      what: ['Acompañamiento jurídico', 'Vivienda', 'Empleo'],
      where: 'Varias provincias',
      url: 'https://cepaim.org/'
    },
    {
      id: 'accem', scope: 'national', cat: 'ayuda', icon: 'family',
      title: 'ACCEM',
      what: ['Acogida y acompañamiento', 'Asesoría jurídica', 'Empleo y formación'],
      where: 'Varias provincias',
      url: 'https://www.accem.es/'
    },
    {
      id: 'red_acoge', scope: 'national', cat: 'ayuda', icon: 'family',
      title: 'Red Acoge',
      what: ['Orientación jurídica', 'Acogida', 'Inserción sociolaboral'],
      where: 'Entidades federadas en varias provincias',
      url: 'https://www.redacoge.org/'
    },
    {
      id: 'fundacion_gitano', scope: 'national', cat: 'ayuda', icon: 'family',
      title: 'Fundación Secretariado Gitano',
      what: ['Empleo', 'Educación', 'Vivienda', 'Igualdad'],
      where: 'Varias provincias',
      url: 'https://www.gitanos.org/'
    },
    {
      id: 'provivienda', scope: 'national', cat: 'vivienda', icon: 'home',
      title: 'Provivienda',
      what: ['Vivienda', 'Alojamiento temporal', 'Acompañamiento social'],
      where: 'Varias provincias',
      url: 'https://www.provivienda.org/'
    },
    {
      id: 'rais', scope: 'national', cat: 'ayuda', icon: 'family',
      title: 'Hogar Sí · RAIS',
      what: ['Vivienda', 'Acompañamiento', 'Inclusión social'],
      where: 'Varias provincias',
      url: 'https://www.hogarsi.org/'
    },
    {
      id: 'fundacion_madrina', scope: 'national', cat: 'ayuda', icon: 'family',
      title: 'Fundación Madrina',
      what: ['Apoyo a mujeres y familias', 'Alimentos y enseres', 'Orientación'],
      where: 'Madrid y varias provincias',
      url: 'https://madrina.org/'
    },
    {
      id: 'sindicatos', scope: 'national', cat: 'trabajo', icon: 'briefcase',
      title: 'CCOO y UGT',
      what: ['Asesoría laboral gratuita', 'Denuncias de abuso', 'Formación'],
      where: 'Sede sindical de tu provincia',
      url: 'https://www.ccoo.es/',
      note: 'También tienen servicios de extranjería en muchas provincias.'
    },

    /* ── autonómicas ── */
    {
      id: 'gobierno_region', scope: 'region', cat: 'documentos', icon: 'home',
      title: function (c) { return c.regionLabel; },
      what: ['Educación', 'Sanidad', 'Servicios sociales', 'Empleo y vivienda'],
      where: function (c) { return c.regionName; },
      urlKey: 'portal',
      note: 'Es la administración que gestiona sanidad, educación y servicios sociales.'
    },
    {
      id: 'salud_region', scope: 'region', cat: 'salud', icon: 'shield',
      title: function (c) { return c.healthName; },
      what: ['Tarjeta sanitaria', 'Centro de salud y especialistas', 'Vacunas y embarazo'],
      where: function (c) { return c.regionName; },
      urlKey: 'health'
    },
    {
      id: 'educacion_region', scope: 'region', cat: 'formacion', icon: 'book',
      title: 'Consejería de Educación',
      what: ['Escolarización de hijos', 'Becas', 'Títulos y formación'],
      where: function (c) { return c.regionName; },
      urlKey: 'education'
    },
    {
      id: 'empleo_region', scope: 'region', cat: 'trabajo', icon: 'briefcase',
      title: 'Servicio de Empleo de tu comunidad',
      what: ['Demanda de empleo', 'Cursos', 'Ofertas y orientación'],
      where: function (c) { return c.regionName; },
      urlKey: 'employment'
    },
    {
      id: 'servicios_sociales_region', scope: 'region', cat: 'ayuda', icon: 'family',
      title: 'Servicios Sociales de tu comunidad',
      what: ['Ayuda de emergencia', 'Familia e infancia', 'Dependencia', 'Vivienda'],
      where: function (c) { return c.regionName; },
      urlKey: 'social'
    },
    {
      id: 'vivienda_region', scope: 'region', cat: 'vivienda', icon: 'home',
      title: 'Oficina de Vivienda',
      what: ['Ayudas al alquiler', 'Vivienda pública', 'Información de desahucios'],
      where: function (c) { return c.regionName; },
      urlKey: 'portal'
    },

    /* ── locales ── */
    {
      id: 'concello', scope: 'local', cat: 'documentos', icon: 'home',
      title: function (c) { return c.localLabel + ' de ' + (c.municipality || 'tu municipio'); },
      what: ['Padrón y certificado de empadronamiento', 'Servicios sociales', 'Policía local', 'Escuela y actividades'],
      where: function (c) { return c.municipality ? c.municipality + ' (' + c.province + ')' : 'Tu municipio'; },
      urlKey: 'portal',
      note: 'El padrón es gratuito y es la prueba principal de permanencia. Pide el certificado histórico.'
    },
    {
      id: 'centro_salud', scope: 'local', cat: 'salud', icon: 'shield',
      title: 'Centro de Salud',
      what: ['Tarjeta sanitaria', 'Médico de familia', 'Vacunas y embarazo', 'Urgencias leves'],
      where: function (c) { return c.municipality ? 'Centro de salud de ' + c.municipality : 'Centro de salud de tu zona'; },
      urlKey: 'health',
      note: 'Con el empadronamiento puedes solicitar la tarjeta sanitaria en tu centro de salud.'
    },
    {
      id: 'hospital', scope: 'local', cat: 'salud', icon: 'shield',
      title: 'Hospital de referencia',
      what: ['Urgencias 24 h', 'Especialistas', 'Ingresos y pruebas'],
      where: function (c) { return c.municipality ? 'Hospital de referencia de ' + c.municipality : 'Hospital de tu zona'; },
      urlKey: 'health'
    },
    {
      id: 'servicios_sociales_local', scope: 'local', cat: 'ayuda', icon: 'family',
      title: function (c) { return 'Servicios Sociales de ' + (c.municipality || 'tu municipio'); },
      what: ['Ayuda de emergencia', 'Informe de integración', 'Familia e infancia', 'Vivienda'],
      where: function (c) { return c.localLabel + ' de ' + (c.municipality || 'tu municipio'); },
      urlKey: 'social',
      note: 'Pide cita en el ayuntamiento/concello. El informe de integración se emite aquí o en la comunidad.'
    },
    {
      id: 'policia_local', scope: 'local', cat: 'justicia', icon: 'shield',
      title: 'Policía Local',
      what: ['Denuncias de convivencia', 'Tráfico', 'Auxilio inmediato'],
      where: function (c) { return c.municipality || 'Tu municipio'; },
      urlKey: 'portal'
    }
  ];

  function resolveUrl(entry, region) {
    if (entry.url) return entry.url;
    if (entry.urlKey && region && region[entry.urlKey]) return region[entry.urlKey];
    return region ? region.portal : 'https://www.inclusion.gob.es/';
  }

  RL.directory = {
    categories: CATS,
    entries: E,
    resolveUrl: resolveUrl
  };
})();

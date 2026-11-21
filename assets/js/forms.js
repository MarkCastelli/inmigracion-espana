/* ============================================================
   Ruta Legal · catálogo de formularios oficiales
   Enlaces a la sede del Ministerio de Inclusión y al Ministerio
   de Justicia. Los modelos se renumeraron en 2025-2026: el
   arraigo es EX-31 (no EX-10) y el familiar de español es EX-24.
   ============================================================ */
(function () {
  'use strict';
  var RL = window.RL = window.RL || {};

  var HUB = 'https://www.inclusion.gob.es/web/migraciones/modelos-generales';
  var BASE = HUB;

  var FORMS = [
    {
      id: 'ex31', code: 'EX-31', type: 'form',
      title: 'Arraigo (circunstancias excepcionales)',
      purpose: 'Solicitud de autorización de residencia por arraigo social, sociolaboral, socioformativo o familiar.',
      url: BASE + 'ex31-formulario-autorizacion-de-residencia-por-circunstancias-excepcionales-por-razon-de-arraigo.pdf',
      where: 'Oficina de Extranjería de tu provincia o sede electrónica',
      fee: '38,28 € (790-052, epígrafe 2.3.1)',
      note: 'Modelo vigente 2025-2026. El antiguo EX-10 ya no se usa para arraigos.',
      routeIds: ['arraigo_social', 'arraigo_sociolaboral', 'arraigo_socioformativo', 'arraigo_segunda_oportunidad']
    },
    {
      id: 'ex10', code: 'EX-10', type: 'form',
      title: 'Residencia por circunstancias excepcionales',
      purpose: 'Supuestos de protección internacional, colaboración con la justicia, razones humanitarias y otros del art. 31.3 LO 4/2000.',
      url: BASE + 'ex10.pdf',
      where: 'Oficina de Extranjería / sede electrónica',
      fee: '38,28 € o 10,94 € según el supuesto',
      note: 'No es el formulario de arraigo: para arraigo usa el EX-31.',
      routeIds: ['circunstancias_excepcionales']
    },
    {
      id: 'ex32', code: 'EX-32', type: 'form', closed: true,
      title: 'Arraigo extraordinario (DA 21.ª)',
      purpose: 'Regularización extraordinaria de 2026. Plazo cerrado el 30/06/2026.',
      url: BASE + 'ex32-formulario-autorizacion-de-residencia-circunstancias-excepcionales-arraigo-extraordina-da21-',
      where: 'Solo si presentaste la solicitud en plazo',
      fee: '38,28 €',
      note: 'El ministerio publicó una versión con la palabra «Borrador». No se admite para nuevas solicitudes.',
      routeIds: ['regularizacion_2026']
    },
    {
      id: 'ex24', code: 'EX-24', type: 'form',
      title: 'Familiares de persona con nacionalidad española',
      purpose: 'Residencia de cónyuge, pareja, hijos, ascendientes o padres/madres de menor español (arts. 94-96).',
      url: BASE + 'ex24-formulario-autorizacion-de-residencia-temporal-de-familiares-de-personas-con-nacionalidad-espanola-1',
      where: 'Oficina de Extranjería / sede electrónica',
      fee: '10,94 € (autorización) + 12 € TIE',
      note: 'No es el «arraigo familiar»: es el capítulo de familiares de españoles.',
      routeIds: ['familiar_espanol']
    },
    {
      id: 'ex17', code: 'EX-17', type: 'form',
      title: 'Tarjeta de Identidad de Extranjero (TIE)',
      purpose: 'Solicitud o renovación de la TIE; se presenta con la resolución favorable y la tasa 790-012.',
      url: BASE + 'ex17-formulario-tarjeta-de-identidad-de-extranjero',
      where: 'Comisaría de Policía con cita previa',
      fee: 'Tasa 790-012: 16,08 € primera TIE; 19,30 € renovación',
      note: 'No es una autorización de residencia: es el documento que acredita la que ya tienes. La foto (32 × 26 mm, fondo blanco) la llevas tú; en comisaría no te la hacen. La TIE se recoge con otra cita, normalmente 30-45 días después de las huellas.',
      routeIds: []
    },
    {
      id: 'ex19', code: 'EX-19', type: 'form',
      title: 'Tarjeta de familiar de ciudadano de la UE',
      purpose: 'Residencia del familiar no comunitario de un ciudadano de la UE/EEE/Suiza.',
      url: BASE + 'ex19-formulario-tarjeta-de-residencia-de-familiar-de-ciudadano-de-la-ue',
      where: 'Oficina de Extranjería / comisaría',
      fee: '12 €',
      routeIds: ['familiar_ue']
    },
    {
      id: 'ex18', code: 'EX-18', type: 'form',
      title: 'Registro Central de Extranjeros (ciudadano UE)',
      purpose: 'Certificado de registro del ciudadano de la Unión que reside en España (la «tarjeta verde»).',
      url: BASE + 'ex18-formulario-inscripcion-en-el-rce-residencia-ciudadano-de-la-ue-1',
      where: 'Oficina de Extranjería / comisaría',
      fee: 'Gratuito',
      routeIds: ['ciudadano_ue']
    },
    {
      id: 'ex02', code: 'EX-02', type: 'form',
      title: 'Reagrupación familiar',
      purpose: 'Solicitud del reagrupante para traer cónyuge, hijos o ascendientes.',
      url: BASE + 'ex02-formulario-autorizacion-de-residencia-temporal-por-reagrupacion-familiar.pdf',
      where: 'Oficina de Extranjería / sede electrónica',
      fee: '10,94 €',
      routeIds: ['reagrupacion']
    },
    {
      id: 'ex11', code: 'EX-11', type: 'form',
      title: 'Larga duración y larga duración-UE',
      purpose: 'Residencia permanente tras cinco años de residencia legal continuada.',
      url: BASE + 'ex11-formulario-autorizacion-de-residencia-de-larga-duracion-o-de-larga-duracion-ue-1',
      where: 'Oficina de Extranjería / sede electrónica',
      fee: '21,87 €',
      routeIds: ['larga_duracion']
    },
    {
      id: 'ex26', code: 'EX-26', type: 'form',
      title: 'Modificación de la autorización',
      purpose: 'Cambiar de una autorización a otra sin salir de España (por ejemplo, de estudios a trabajo).',
      url: BASE + 'ex26-formulario-de-solicitud-modificacion-de-autorizacion-de-residencia-o-estancia-1',
      where: 'Oficina de Extranjería / sede electrónica',
      fee: '10,94 €',
      routeIds: ['estudios_a_trabajo']
    },
    {
      id: 'ex01', code: 'EX-01', type: 'form',
      title: 'Residencia temporal no lucrativa',
      purpose: 'Autorización inicial para residir sin trabajar, con medios propios.',
      url: BASE + 'ex01-formulario-autorizacion-de-residencia-temporal-no-lucrativa-1',
      where: 'Consulado de tu país / sede',
      fee: '790-052 + tasa consular',
      routeIds: ['visado_no_lucrativa']
    },
    {
      id: 'ex00', code: 'EX-00', type: 'form',
      title: 'Estancia de larga duración (estudios)',
      purpose: 'Estancia superior a 90 días por estudios, prácticas, voluntariado o formación.',
      url: BASE + 'ex00-formulario-autorizacion-de-estancia-de-larga-duracion',
      where: 'Consulado de tu país / sede',
      fee: 'Tasa consular + TIE',
      routeIds: ['visado_estudios']
    },
    {
      id: 'ex03', code: 'EX-03', type: 'form',
      title: 'Residencia y trabajo por cuenta ajena',
      purpose: 'Trabajar para una empresa española con contrato.',
      url: BASE + 'ex03-formulario-autorizacion-de-residencia-temporal-y-trabajo-por-cuenta-ajena-o-autorizacion-de-trabajo-por-cuenta-ajena-1',
      where: 'Empresa en España / consulado',
      fee: '790-052 + tasa consular',
      routeIds: ['visado_trabajo_ajena']
    },
    {
      id: 'ex07', code: 'EX-07', type: 'form',
      title: 'Residencia y trabajo por cuenta propia',
      purpose: 'Establecerte como autónomo o montar tu negocio.',
      url: BASE + 'ex07-formulario-autorizacion-de-residencia-temporal-y-trabajo-por-cuenta-propia',
      where: 'Oficina de Extranjería / consulado',
      fee: '790-052 + tasa consular',
      routeIds: ['visado_cuenta_propia']
    },
    {
      id: 'uge', code: 'Ley 14/2013', type: 'form',
      title: 'Solicitud de residencia (UGE-CE)',
      purpose: 'Nómada digital, profesional altamente cualificado, emprendedor, investigador o traslado intraempresarial.',
      url: BASE + 'modelo-de-solicitud-de-autorizacion-de-residencia-titulares',
      where: 'UGE-CE / sede electrónica',
      fee: '790-038 + tasa consular',
      routeIds: ['visado_nomada_digital', 'visado_pac', 'visado_emprendedor']
    },
    {
      id: 'nac', code: 'Nacionalidad', type: 'online',
      title: 'Solicitud de nacionalidad por residencia',
      purpose: 'Formulario electrónico del Ministerio de Justicia y descarga del 790-026.',
      url: 'https://sede.mjusticia.gob.es/es/tramites/nacionalidad-espanola',
      where: 'Sede electrónica del Ministerio de Justicia',
      fee: '104,05 € (790-026)',
      routeIds: ['nac_residencia_2', 'nac_residencia_1', 'nac_residencia_10', 'nac_22_2f', 'nac_origen', 'nac_opcion']
    },
    {
      id: 'asilo', code: 'Asilo', type: 'info',
      title: 'Solicitud de protección internacional',
      purpose: 'Se presenta en la Oficina de Asilo y Refugio, en la frontera o en comisaría; no hay un EX general.',
      url: 'https://help.unhcr.org/spain/solicitar-asilo-en-espana/solicitud-de-asilo-en-territorio-espanol-2/',
      where: 'Oficina de Asilo y Refugio / comisaría',
      fee: 'Gratuito',
      routeIds: ['asilo', 'asilo_seguimiento']
    },
    {
      id: 'tasa012', code: '790-012', type: 'tasa',
      title: 'Tasa de la TIE',
      purpose: 'Pago de la tasa de la Tarjeta de Identidad de Extranjero (primera TIE, renovación o modificación). Se paga para la cita de huellas, que solo puede ser desde el vencimiento de la TIE anterior.',
      url: 'https://sede.policia.gob.es/Tasa790_012/',
      where: 'Sede de la Policía Nacional / banco',
      fee: '16,08 € primera TIE; 19,30 € renovación; 21,87 € larga duración',
      routeIds: []
    },
    {
      id: 'tasa052', code: '790-052', type: 'tasa',
      title: 'Tasa de extranjería',
      purpose: 'Pago de la tasa de autorizaciones de residencia, arraigos y trabajo.',
      url: 'https://sede.administracionespublicas.gob.es/procedimientos/index/categoria/33',
      where: 'Sede electrónica / banco',
      fee: 'Según el epígrafe',
      routeIds: []
    },
    {
      id: 'tasa026', code: '790-026', type: 'tasa',
      title: 'Tasa de nacionalidad',
      purpose: 'Pago de la tasa de nacionalidad por residencia.',
      url: 'https://sede.mjusticia.gob.es/es/tramites/nacionalidad-espanola',
      where: 'Sede del Ministerio de Justicia / banco',
      fee: '104,05 €',
      routeIds: []
    }
  ];

  function byId(id) {
    for (var i = 0; i < FORMS.length; i++) if (FORMS[i].id === id) return FORMS[i];
    return null;
  }
  function forRoute(routeId) {
    return FORMS.filter(function (f) {
      return f.type !== 'tasa' && f.routeIds.indexOf(routeId) !== -1;
    });
  }
  function forRoutes(routeIds) {
    var out = [], seen = {};
    (routeIds || []).forEach(function (rid) {
      forRoute(rid).forEach(function (f) {
        if (!seen[f.id]) { seen[f.id] = true; out.push(f); }
      });
    });
    return out;
  }

  /* Los PDF directos cambian de ruta a menudo. Enlazamos a la página
     oficial de modelos, donde están todos y siempre actualizados. */
  FORMS.forEach(function (f) { if (f.type === 'form') f.url = HUB; });

  RL.forms = {
    all: FORMS,
    hub: HUB,
    byId: byId,
    forRoute: forRoute,
    forRoutes: forRoutes
  };
})();

/* ============================================================
   Ruta Legal · vías que se solicitan DESDE España
   Base: RD 1155/2024 (en vigor 20/05/2025), RD 316/2026 y
   STS 8/7/2026. Tasas: Orden PJC/617/2025. IPREM 2026.
   ============================================================ */
(function () {
  'use strict';
  var RL = window.RL = window.RL || {};
  RL.routes = RL.routes || [];

  var IPREM = 600; /* €/mes 2026 */

  var L = {
    boe1155: { t: 'BOE · Reglamento de Extranjería (RD 1155/2024)', u: 'https://www.boe.es/buscar/act.php?id=BOE-A-2024-24099' },
    boe316: { t: 'BOE · RD 316/2026 (regularización y cambios)', u: 'https://www.boe.es/buscar/doc.php?id=BOE-A-2026-8284' },
    min: { t: 'Ministerio de Inclusión · Extranjería', u: 'https://www.inclusion.gob.es/' },
    sede: { t: 'Sede electrónica · trámites de extranjería', u: 'https://sede.administracion.gob.es/' },
    justicia: { t: 'Ministerio de Justicia · antecedentes penales', u: 'https://www.mjusticia.gob.es/' }
  };

  /* documentos compartidos (el checklist los agrupa por id) */
  var D = {
    pasaporte: { id: 'doc_pasaporte', name: 'Pasaporte de tu país (no español), completo (todas las páginas)', where: 'Tu país / consulado' },
    ant_es: { id: 'doc_ant_es', name: 'Certificado de antecedentes penales de España', where: 'Ministerio de Justicia (gratis, online o presencial)', note: 'Suele caducar a los 3 meses.' },
    ant_origen: { id: 'doc_ant_origen', name: 'Certificado de antecedentes penales del país de origen', where: 'Consulado o ministerio de tu país', note: 'Apostillado o legalizado, y traducido si procede. Suele caducar a los 3 meses.' },
    padron: { id: 'doc_padron', name: 'Certificado de empadronamiento histórico', where: 'Ayuntamiento', note: 'Con altas y bajas de todos los municipios.' },
    ex31: { id: 'doc_ex31', name: 'Impreso EX-31 (arraigo)', where: 'Extranjería / sede electrónica', note: 'Modelo vigente 2025-2026. Sustituye al antiguo EX-10 para arraigos.' },
    ex10: { id: 'doc_ex10', name: 'Impreso EX-10 (circunstancias excepcionales)', where: 'Extranjería / sede electrónica' },
    ex24: { id: 'doc_ex24', name: 'Impreso EX-24 (familiar de persona con nacionalidad española)', where: 'Extranjería / sede electrónica' },
    ex19: { id: 'doc_ex19', name: 'Impreso EX-19 (tarjeta de familiar de ciudadano de la UE)', where: 'Extranjería / comisaría' },
    ex18: { id: 'doc_ex18', name: 'Impreso EX-18 (certificado de registro de ciudadano de la UE)', where: 'Extranjería / comisaría' },
    ex02: { id: 'doc_ex02', name: 'Impreso EX-02 (reagrupación familiar)', where: 'Extranjería / sede electrónica' },
    ex11: { id: 'doc_ex11', name: 'Impreso EX-11 (larga duración)', where: 'Extranjería / sede electrónica' },
    ex26: { id: 'doc_ex26', name: 'Impreso EX-26 (modificación de autorización)', where: 'Extranjería / sede electrónica' },
    ex32: { id: 'doc_ex32', name: 'Impreso EX-32 (arraigo extraordinario, cerrado)', where: 'Extranjería / sede electrónica' },
    tasa: { id: 'doc_tasa', name: 'Tasa 790-052 pagada', where: 'Sede electrónica / banco', note: '38,28 € para arraigos (epígrafe 2.3.1).' },
    tasa_fam: { id: 'doc_tasa_fam', name: 'Tasa de autorización de familiar de español (10,94 €)', where: 'Sede electrónica / banco', note: 'Epígrafe 2.1.2.' },
    tasa_reag: { id: 'doc_tasa_reag', name: 'Tasa de autorización de reagrupación (10,94 €)', where: 'Sede electrónica / banco', note: 'Epígrafe 2.1.2.' },
    tasa_larga: { id: 'doc_tasa_larga', name: 'Tasa de larga duración (21,87 €)', where: 'Sede electrónica / banco', note: 'Epígrafe 2.6.' },
    tasa_renov: { id: 'doc_tasa_renov', name: 'Tasa de renovación (16,40 €)', where: 'Sede electrónica / banco', note: 'Epígrafe 2.2.x.' },
    tasa_mod: { id: 'doc_tasa_mod', name: 'Tasa de modificación de estatus (10,94 €)', where: 'Sede electrónica / banco', note: 'Epígrafe 2.5.1.' },
    tasa_ue: { id: 'doc_tasa_ue', name: 'Tasa de la tarjeta de familiar de ciudadano de la UE (12 €)', where: 'Sede electrónica / banco', note: 'Epígrafe 4.6, equiparada al DNI.' },
    medios: { id: 'doc_medios', name: 'Prueba de medios económicos', where: 'Tú', note: 'Nóminas, contrato, IRPF, extractos bancarios, declaración de la renta.' },
    vivienda: { id: 'doc_vivienda', name: 'Informe de vivienda de servicios sociales', where: 'Servicios sociales del municipio o CCAA', note: 'Caduca a los 6 meses; si no lo emiten en 1 mes puede sustituirse por otras pruebas.' },
    convivencia: { id: 'doc_convivencia', name: 'Prueba de convivencia', where: 'Certificado de empadronamiento conjunto, recibos, fotos, testigos' },
    nacimiento: { id: 'doc_nacimiento', name: 'Certificado de nacimiento (apostillado)', where: 'Registro civil de tu país' },
    matrimonio: { id: 'doc_matrimonio', name: 'Certificado de matrimonio o de pareja registrada', where: 'Registro civil / registro de parejas' },
    informe_integracion: { id: 'doc_informe_integracion', name: 'Informe de integración social', where: 'Comunidad Autónoma o ayuntamiento', note: 'Solo si no acreditas vínculos familiares con residentes. Debe emitirse en 1 mes.' }
  };

  /* ── helpers de requisitos ── */
  function inSpain(p) { return p.location === 'spain'; }
  function months(d) { return d.arraigoMonths; }
  function lacksTime(p, d, need) {
    if (d.arraigoMonths == null) return null;
    return d.arraigoMonths >= need;
  }
  function timeFix(need) {
    return function (p, d) {
      if (d.arraigoMonths == null) return 'Indica cuánto tiempo llevas en España (o la fecha de denegación firme del asilo) para calcularlo. El tiempo como solicitante de asilo no cuenta para el arraigo.';
      var left = need - d.arraigoMonths;
      if (left <= 0) return '';
      return 'Te faltan aproximadamente ' + RL.fmt.duration(left) + '. Puedes seguir preparando el resto mientras tanto.';
    };
  }
  function criminalOK(p, d) {
    if (d.criminalSpain === 'yes' || d.criminalOrigin === 'yes') return false;
    if (d.criminalSpain === 'no' && d.criminalOrigin === 'no') return true;
    return null;
  }
  function padronOK(p, d) {
    if (!d.inSpain) return null;
    if (p.empadronado === 'no') return false;
    if (p.empadronado === 'yes') return p.empadronamientoGaps !== 'big';
    return null;
  }
  function meansOK(p, d) {
    if (d.income >= IPREM) return true;
    if (d.savings >= IPREM * 12) return true;
    if (d.hasFamilyInSpain && (p.familyStatus === 'all' || p.familyStatus === 'some')) return true;
    if (d.income > 0) return false;
    return null;
  }
  function workContract(p, d) {
    if (p.jobOffer === 'yes') return true;
    if (p.jobOffer === 'no') return false;
    if (p.employment === 'permanent' || p.employment === 'temporary' || p.employment === 'self') return true;
    return null;
  }
  function notAsylum(p, d) {
    if (d.asylumInProcess || d.asylumSoon) return false;
    if (d.asylumDenied) return null;
    return true;
  }
  function legalStayForArraigo(p, d) {
    if (d.hasPermit) return false;                    /* art. 126.h */
    if (d.asylumInProcess || d.asylumSoon) return false;
    if (d.pendingExtranjeria) return false;
    if (p.regularizationApplied === 'pending') return false;
    return true;
  }

  /* ══════════════════════════════════════════════════════════
     1. ARRAIGO SOCIAL
     ══════════════════════════════════════════════════════════ */
  RL.routes.push({
    id: 'arraigo_social',
    group: 'residencia',
    title: 'Arraigo social',
    short: 'La vía más común para quien lleva 2 años en España sin permiso.',
    icon: 'home',
    weight: 34,
    goals: ['regularizar', 'residencia_estable', 'trabajar'],
    where: 'spain',
    availability: 'open',
    legal: 'Arts. 125-127 RD 1155/2024',
    summary: 'Si llevas al menos 2 años en España de forma continuada, puedes solicitar una autorización de residencia de 1 año que además te habilita a trabajar. No exige contrato, pero sí acreditar medios de vida (100 % del IPREM) y, si no tienes vínculos familiares con residentes, un informe de integración social.',
    forWho: 'Personas mayores de edad en situación irregular que llevan 2 años continuados en España y no tienen otra autorización ni un procedimiento abierto.',
    requirements: [
      { label: 'Estás en España', test: inSpain, actionable: false },
      { label: 'Llevas al menos 2 años de permanencia continuada', test: function (p, d) { return lacksTime(p, d, 24); }, fix: timeFix(24) },
      { label: 'No tienes otra autorización ni un expediente abierto (art. 126.h)', test: legalStayForArraigo, fix: 'Si tienes un permiso en vigor o un procedimiento abierto, espera a que termine o consulta un abogado antes de presentar el arraigo.' },
      { label: 'No eres solicitante de protección internacional', test: notAsylum, fix: 'Si tienes asilo solicitado, esta vía no es compatible mientras sigas como solicitante. Consulta si te conviene desistir.' },
      { label: 'Estás empadronado/a y sin bajas largas', test: padronOK, fix: 'Empadrónate (es gratis) y pide el certificado histórico. Las bajas de más de 90 días rompen la continuidad.' },
      { label: 'Tus ausencias de España no superan los 90 días en 2 años', test: function (p, d) { if (p.leftSpain === 'no') return true; if (p.leftSpain === 'yes_safe') return null; if (p.leftSpain === 'yes_risk') return false; return null; }, fix: 'Las salidas deben ser cortas y documentadas. Si has estado fuera más de 90 días, la continuidad puede discutirse.' },
      { label: 'Careces de antecedentes penales en España y en los países de los últimos 5 años', test: criminalOK, fix: 'Pide los certificados. Si tienes antecedentes, un abogado puede valorar la cancelación o la ponderación individual (la STS de 2026 prohíbe denegar de forma automática).', actionable: false },
      { label: 'Acreditas medios (100 % IPREM) o vínculos con un residente', test: meansOK, fix: 'Necesitas unos 600 €/mes o un familiar residente que los aporte. Si no, pide el informe de integración social.' },
      { label: 'Tienes informe de integración (solo si no hay vínculos familiares)', test: function (p, d) { if (d.hasFamilyInSpain && (p.familyStatus === 'all' || p.familyStatus === 'some')) return true; if (p.familyStatus === 'none') return null; return null; }, fix: 'Solicítalo en tu Comunidad Autónoma o ayuntamiento. Deben emitirlo en 1 mes; si no lo hacen, puedes sustituirlo por otras pruebas.', critical: false }
    ],
    blockers: [
      { label: 'Los ciudadanos de la UE/EEE no necesitan arraigo: tienen derecho de residencia.', test: function (p, d) { return d.euCitizen; } },
      { label: 'Es una vía para mayores de edad.', test: function (p, d) { return d.minor; } },
      { label: 'Ya tienes una autorización de residencia en vigor: no puedes pedir arraigo (art. 126.h).', test: function (p, d) { return d.hasPermit; } },
      { label: 'Tienes una solicitud de asilo en curso o una cita: no puedes pedir arraigo mientras tanto.', test: function (p, d) { return d.asylumInProcess || d.asylumSoon; } },
      { label: 'Tienes un expediente de extranjería abierto: no puedes pedir arraigo (art. 126.h).', test: function (p, d) { return d.pendingExtranjeria; } }
    ],
    docs: [D.pasaporte, D.ant_origen, D.ant_es, D.padron, D.medios, D.ex31, D.tasa, D.informe_integracion],
    steps: [
      { title: 'Comprueba los 2 años y las ausencias', detail: 'Revisa tu certificado de empadronamiento histórico: es la prueba principal. Cuenta también estancias, contratos de alquiler, billetes y cualquier documento con fechas.', when: 'Antes de nada' },
      { title: 'Reúne antecedentes penales', detail: 'Pide el certificado español (gratis) y el de tu país. No los pidas con más de 3 meses de antelación.', when: 'Mes -3' },
      { title: 'Acredita medios y, si no tienes vínculos, pide el informe', detail: 'Con nóminas, contrato, extractos o declaración de la renta. Debes llegar al 100 % del IPREM; si no acreditas vínculos familiares con residentes, necesitas además el informe de integración social de tu CCAA.', when: 'Mes -2' },
      { title: 'Paga la tasa y presenta el EX-31', detail: 'Tasa 790-052 (38,28 €). Presenta en la Oficina de Extranjería de tu provincia, presencialmente o por sede electrónica. Guarda el justificante.', when: 'Día 0' },
      { title: 'Sigue el expediente', detail: 'Resolución en 3 meses, con silencio desestimatorio. Si te requieren documentación, responde en plazo. Concede 1 año de residencia y trabajo.', when: '+3 meses' }
    ],
    cost: '38,28 € de tasa + 16,08 € de TIE',
    time: 'Resolución: unos 3 meses (silencio negativo)',
    risks: [
      'Tener cualquier autorización o expediente abierto te inhabilita (art. 126.h).',
      'Las ausencias superiores a 90 días pueden romper la permanencia continuada (criterio administrativo).',
      'Algunas oficinas suman el 100 % del solicitante y el 100 % del familiar residente (200 % del IPREM): lleva pruebas de sobra.',
      'Trabajar sin autorización no impide el arraigo, pero puede abrir un expediente sancionador.',
      'El silencio es negativo: si no responden, no está concedido.'
    ],
    links: [L.boe1155, L.min, L.sede],
    fit: function (p, d) {
      if (d.arraigoMonths == null) return 'No consta un tiempo computable para el arraigo: el tiempo como solicitante de asilo no cuenta y necesitas una denegación firme con fecha.';
      if (d.arraigoMonths >= 24) return 'Ya cumples el requisito de los 2 años. Lo que decide es la prueba de permanencia y los medios.';
      return 'Te faltan ' + RL.fmt.duration(24 - d.arraigoMonths) + ' para cumplir los 2 años. Mientras, prepara el padrón y los documentos.';
    }
  });

  /* ══════════════════════════════════════════════════════════
     2. ARRAIGO SOCIOLABORAL
     ══════════════════════════════════════════════════════════ */
  RL.routes.push({
    id: 'arraigo_sociolaboral',
    group: 'residencia',
    title: 'Arraigo sociolaboral',
    short: 'Dos años en España más uno o varios contratos que sumen 20 h/semana.',
    icon: 'briefcase',
    weight: 30,
    goals: ['regularizar', 'trabajar', 'residencia_estable'],
    where: 'spain',
    availability: 'open',
    legal: 'Art. 127.b) RD 1155/2024',
    summary: 'Pensado para quien ya tiene una relación laboral. Exige 2 años de permanencia y contratos que garanticen el SMI y sumen al menos 20 horas semanales. Desde la admisión a trámite puedes trabajar con una habilitación provisional.',
    forWho: 'Personas en situación irregular con 2 años en España y uno o varios contratos de trabajo (también temporadas o pluriempleo).',
    requirements: [
      { label: 'Estás en España', test: inSpain, actionable: false },
      { label: 'Llevas al menos 2 años de permanencia continuada', test: function (p, d) { return lacksTime(p, d, 24); }, fix: timeFix(24) },
      { label: 'Tienes contrato(s) que suman al menos 20 h/semana y el SMI', test: workContract, fix: 'Necesitas un contrato firmado antes de solicitar; una oferta no basta. Pueden ser varios contratos o trabajos de temporada concatenados.' },
      { label: 'No tienes otra autorización ni un expediente abierto', test: legalStayForArraigo, fix: 'Comprueba que no tienes un permiso en vigor ni un procedimiento abierto.' },
      { label: 'No eres solicitante de protección internacional', test: notAsylum, fix: 'No es compatible con una solicitud de asilo activa.' },
      { label: 'Estás empadronado/a y sin bajas largas', test: padronOK, fix: 'El padrón histórico es la prueba básica de permanencia.' },
      { label: 'Careces de antecedentes penales', test: criminalOK, actionable: false, fix: 'Pide los certificados de España y de tu país.' }
    ],
    blockers: [
      { label: 'Los ciudadanos de la UE/EEE no necesitan arraigo.', test: function (p, d) { return d.euCitizen; } },
      { label: 'Es una vía para mayores de edad.', test: function (p, d) { return d.minor; } },
      { label: 'Ya tienes una autorización en vigor (art. 126.h).', test: function (p, d) { return d.hasPermit; } },
      { label: 'Tienes una solicitud de asilo en curso o una cita: no puedes pedir arraigo mientras tanto.', test: function (p, d) { return d.asylumInProcess || d.asylumSoon; } },
      { label: 'Tienes un expediente de extranjería abierto: no puedes pedir arraigo (art. 126.h).', test: function (p, d) { return d.pendingExtranjeria; } }
    ],
    docs: [D.pasaporte, D.ant_origen, D.ant_es, D.padron, D.ex31, D.tasa],
    steps: [
      { title: 'Revisa contratos y horas', detail: 'Suma todas las jornadas. Deben alcanzar 20 h/semana y el salario del convenio. Si trabajas por temporadas, encadena los contratos.', when: 'Antes de solicitar' },
      { title: 'Reúne la documentación de permanencia', detail: 'Padrón histórico y cualquier prueba de los 2 años.', when: 'Mes -2' },
      { title: 'Presenta el EX-31 y paga la tasa', detail: '38,28 € (790-052). Desde la admisión a trámite puedes trabajar con habilitación provisional.', when: 'Día 0' },
      { title: 'Alta en la Seguridad Social', detail: 'Si te conceden, el alta debe hacerse en 1 mes; si no, la autorización decae.', when: '+3 meses' }
    ],
    cost: '38,28 € + 16,08 € de TIE',
    time: '1 año de autorización; resolución orientativa de 3 meses',
    risks: [
      'El contrato debe existir en el momento de la solicitud.',
      'El arraigo social y el sociolaboral son alternativos: no se acumulan.',
      'La prórroga exige búsqueda activa de empleo e inscripción como demandante.'
    ],
    links: [L.boe1155, L.min, L.sede],
    fit: function (p, d) {
      if (p.jobOffer === 'yes' || p.employment === 'permanent' || p.employment === 'temporary') return 'Tienes base laboral: esta vía puede ser más rápida que el arraigo social si los contratos suman horas.';
      return 'Necesitas contratos firmados. Si estás trabajando sin contrato, habla con tu empleador o busca una oferta formal.';
    }
  });

  /* ══════════════════════════════════════════════════════════
     3. ARRAIGO SOCIOFORMATIVO
     ══════════════════════════════════════════════════════════ */
  RL.routes.push({
    id: 'arraigo_socioformativo',
    group: 'residencia',
    title: 'Arraigo socioformativo',
    short: 'Dos años en España y estar matriculado en una formación.',
    icon: 'book',
    weight: 22,
    goals: ['regularizar', 'estudiar', 'trabajar'],
    where: 'spain',
    availability: 'open',
    legal: 'Art. 127.d) RD 1155/2024',
    summary: 'Para quien lleva 2 años en España y se matricula en formación profesional, enseñanzas para adultos o cursos de los servicios de empleo. La autorización dura 1 año y permite trabajar hasta 30 h/semana.',
    forWho: 'Personas en situación irregular con 2 años de permanencia que se matriculan o se comprometen a formarse.',
    requirements: [
      { label: 'Estás en España', test: inSpain, actionable: false },
      { label: 'Llevas al menos 2 años de permanencia continuada', test: function (p, d) { return lacksTime(p, d, 24); }, fix: timeFix(24) },
      { label: 'Estás matriculado/a o tienes plaza en una formación válida', test: function (p, d) { if (p.employment === 'student') return true; if (p.studiesAdmission === 'yes') return true; return false; }, fix: 'Vale FP, enseñanzas obligatorias de adultos o cursos de los servicios de empleo orientados a ocupaciones del catálogo. Sin matrícula no hay vía.' },
      { label: 'No tienes otra autorización ni un expediente abierto', test: legalStayForArraigo },
      { label: 'No eres solicitante de protección internacional', test: notAsylum },
      { label: 'Estás empadronado/a', test: padronOK, fix: 'El padrón prueba la permanencia.' },
      { label: 'Careces de antecedentes penales', test: criminalOK, actionable: false }
    ],
    blockers: [
      { label: 'Los ciudadanos de la UE/EEE no necesitan arraigo.', test: function (p, d) { return d.euCitizen; } },
      { label: 'Es una vía para mayores de edad.', test: function (p, d) { return d.minor; } },
      { label: 'Ya tienes una autorización en vigor (art. 126.h).', test: function (p, d) { return d.hasPermit; } },
      { label: 'Tienes una solicitud de asilo en curso o una cita: no puedes pedir arraigo mientras tanto.', test: function (p, d) { return d.asylumInProcess || d.asylumSoon; } },
      { label: 'Tienes un expediente de extranjería abierto: no puedes pedir arraigo (art. 126.h).', test: function (p, d) { return d.pendingExtranjeria; } }
    ],
    docs: [D.pasaporte, D.ant_origen, D.ant_es, D.padron, D.informe_integracion, D.ex31, D.tasa],
    steps: [
      { title: 'Busca una formación que encaje', detail: 'FP, educación de adultos o cursos de los servicios públicos de empleo. Comprueba que la matrícula es oficial y presencial si así se exige.', when: 'Mes -3' },
      { title: 'Matricúlate y guarda el resguardo', detail: 'Si el plazo de matrícula aún no ha abierto, puedes solicitarlo en los 2 meses anteriores y aportar la matrícula después.', when: 'Mes -1' },
      { title: 'Presenta el EX-31', detail: 'Con el informe de integración social, que aquí sí se exige.', when: 'Día 0' },
      { title: 'Acredita la matrícula en 3 meses', detail: 'Si no lo haces, la autorización se extingue.', when: '+3 meses' }
    ],
    cost: '38,28 € + 16,08 € de TIE',
    time: '1 año; permite trabajar hasta 30 h/semana',
    risks: [
      'No es una vía para estudiar sin más: si no acreditas la formación, se extingue.',
      'El informe de integración es obligatorio en esta modalidad.'
    ],
    links: [L.boe1155, L.min],
    fit: function () { return 'Útil si quieres formarte y regularizarte a la vez, pero exige matrícula real y constancia.'; }
  });

  /* ══════════════════════════════════════════════════════════
     4. SEGUNDA OPORTUNIDAD
     ══════════════════════════════════════════════════════════ */
  RL.routes.push({
    id: 'arraigo_segunda_oportunidad',
    group: 'residencia',
    title: 'Arraigo de segunda oportunidad',
    short: 'Para quien tuvo residencia y no pudo renovarla.',
    icon: 'refresh',
    weight: 28,
    goals: ['regularizar', 'residencia_estable'],
    where: 'spain',
    availability: 'open',
    legal: 'Art. 127.a) RD 1155/2024',
    summary: 'Si fuiste titular de una autorización de residencia en los 2 años anteriores y no la renovaste por motivos distintos al orden público, puedes recuperar la situación con una autorización de 1 año.',
    forWho: 'Personas que tuvieron un permiso de residencia (no de circunstancias excepcionales) y lo perdieron.',
    requirements: [
      { label: 'Estás en España', test: inSpain, actionable: false },
      { label: 'Tuviste una autorización de residencia en los últimos 2 años', test: function (p, d) { if (p.permitStatus === 'expired') return true; if (p.permitStatus === 'none') return false; return null; }, fix: 'Necesitas la resolución de la autorización anterior y, si la hubo, la denegación de renovación.' },
      { label: 'La pérdida no fue por orden público, seguridad o salud pública', test: function () { return null; }, fix: 'Revisa el motivo de la denegación. Si fue por no cumplir requisitos económicos, sí puede encajar.' },
      { label: 'No tienes otra autorización ni un expediente abierto', test: legalStayForArraigo },
      { label: 'Careces de antecedentes penales', test: criminalOK, actionable: false }
    ],
    blockers: [
      { label: 'No has tenido nunca una autorización de residencia.', test: function (p, d) { return p.permitStatus === 'none' || !p.permitStatus; } },
      { label: 'Ya tienes una autorización en vigor: no necesitas la segunda oportunidad.', test: function (p, d) { return d.hasPermit; } },
      { label: 'Los ciudadanos de la UE/EEE no necesitan esta vía.', test: function (p, d) { return d.euCitizen; } },
      { label: 'Tienes una solicitud de asilo en curso o una cita: no puedes pedir arraigo mientras tanto.', test: function (p, d) { return d.asylumInProcess || d.asylumSoon; } },
      { label: 'Tienes un expediente de extranjería abierto: no puedes pedir arraigo (art. 126.h).', test: function (p, d) { return d.pendingExtranjeria; } },
      { label: 'Es una vía para mayores de edad.', test: function (p, d) { return d.minor; } }
    ],
    docs: [D.pasaporte, D.ant_es, D.ant_origen, D.tasa, D.ex31],
    steps: [
      { title: 'Localiza la resolución anterior', detail: 'Necesitas el documento que acredite que fuiste titular y, si existe, la denegación de renovación.', when: 'Semana 1' },
      { title: 'Comprueba el motivo de la no renovación', detail: 'Si fue por orden público o seguridad, esta vía no aplica.', when: 'Semana 2' },
      { title: 'Presenta el EX-31', detail: 'Tasa 38,28 €. Autorización de 1 año.', when: 'Día 0' }
    ],
    cost: '38,28 € + 16,08 € de TIE',
    time: '1 año; prórroga condicionada a búsqueda activa de empleo',
    risks: [
      'No vale si la autorización anterior era de circunstancias excepcionales (arraigo, humanitarias).',
      'No vale si no renovaste por incumplir requisitos.'
    ],
    links: [L.boe1155, L.min],
    fit: function (p) { return p.permitStatus === 'expired' ? 'Tu caso encaja: tenías permiso y lo perdiste. Revisa por qué.' : 'Solo aplica si tuviste un permiso de residencia antes.'; }
  });

  /* ══════════════════════════════════════════════════════════
     5. FAMILIAR DE PERSONA CON NACIONALIDAD ESPAÑOLA
     ══════════════════════════════════════════════════════════ */
  RL.routes.push({
    id: 'familiar_espanol',
    group: 'residencia',
    title: 'Residencia como familiar de español',
    short: 'Cónyuge, pareja, hijos o padres de un español: tarjeta de 5 años.',
    icon: 'family',
    weight: 44,
    goals: ['residencia_estable', 'regularizar', 'trabajar', 'familia'],
    where: 'both',
    availability: 'open',
    legal: 'Arts. 93-99 RD 1155/2024',
    summary: 'La vía más favorable para familiares de españoles: tarjeta de 5 años, permiso de trabajo incluido y sin necesidad de acreditar años de permanencia. Si ya estás en España, puedes solicitarla sin visado y con autorización provisional a residir y trabajar desde la admisión a trámite. Ojo: casarse o tener un hijo español no te legaliza automáticamente; hay que solicitar y probar el vínculo y la convivencia.',
    forWho: 'Cónyuges y parejas registradas o estables de españoles, hijos menores de 26 años, ascendientes a cargo, padres y madres de menores españoles y cuidadores de españoles dependientes.',
    requirements: [
      { label: 'Tienes un vínculo familiar con una persona española', test: function (p, d) {
        if (d.hasSpanishSpouse) return true;
        if (d.stablePartnerSpanish) return d.stablePartnerQualifies;
        if (d.hasSpanishChild) return d.parentSpanishMinor;
        if (d.spanishParent && d.age != null && d.age < 26) return true;
        return false;
      }, actionable: false, fix: 'Vale cónyuge, pareja registrada o pareja estable (12 meses de convivencia o hijo en común), hijos, ascendientes a cargo y padres de menores españoles. El vínculo tiene que existir y poder probarse: no basta con una relación ocasional ni con un embarazo.' },
      { label: 'El vínculo está documentado', test: function (p, d) {
        if (d.hasSpanishSpouse) return null;
        if (d.stablePartnerSpanish) return (d.cohabitation12 || d.hasCommonChild) ? true : null;
        if (d.hasSpanishChild) return d.childRecognized;
        return null;
      }, fix: 'Certificado de matrimonio o de pareja registrada, o certificado de nacimiento del hijo español. Para pareja no registrada, prueba de 12 meses de convivencia o hijo en común. Si el padre español no reconoce al hijo, la nacionalidad no está resuelta.' },
      { label: 'El familiar español no ha ejercido la libre circulación (si la ejerció, va por la vía UE)', test: function (p, d) { if ((d.hasSpanishSpouse || d.stablePartnerSpanish) && p.spanishRelativeEU === 'yes') return false; return null; }, actionable: false, fix: 'Si tu familiar español vivió o trabajó en otro país de la UE, la vía correcta es la tarjeta de familiar de ciudadano de la Unión.' },
      { label: 'Acreditas convivencia, cargo del menor o dependencia', test: function (p, d) {
        if (d.hasSpanishSpouse) return p.cohabitation === 'no' ? false : (p.cohabitation === '12plus' ? true : null);
        if (d.stablePartnerSpanish) return d.stablePartnerQualifies;
        if (d.hasSpanishChild) return d.parentSpanishMinor;
        return null;
      }, actionable: false, fix: 'Para el progenitor de un menor español: el menor a tu cargo y convivencia, o estar al corriente de tus obligaciones. Si el menor vive con el otro progenitor y no cumples, la vía no encaja. Si estás casado/a, la convivencia también se valora.' },
      { label: 'El hijo/a español es menor de edad', test: function (p, d) { if (!d.hasSpanishChild || d.hasSpanishSpouse || d.stablePartnerSpanish) return null; return d.hasMinorSpanishChild; }, actionable: false, fix: 'La vía de progenitor exige que el hijo/a sea menor de edad. Si ya es mayor, cambia el supuesto (hijo a cargo, discapacidad u otra vía).' },
      { label: 'Careces de antecedentes penales (valoración individual)', test: criminalOK, actionable: false, fix: 'Desde la STS de julio de 2026 no cabe denegar de forma automática: se pondera cada caso.' },
      { label: 'No estás en plazo de no retorno ni tienes prohibición de entrada', test: function (p) { if (p.exitOrder === 'yes') return false; return p.exitOrder === 'no' ? true : null; }, actionable: false }
    ],
    blockers: [
      { label: 'Los ciudadanos de la UE/EEE no necesitan esta vía.', test: function (p, d) { return d.euCitizen; } },
      { label: 'Es una vía para mayores de edad.', test: function (p, d) { return d.minor; } }
    ],
    docs: [D.pasaporte, D.matrimonio, D.nacimiento, D.convivencia, D.medios, D.vivienda, D.ant_es, D.ant_origen, D.tasa_fam, D.ex24],
    steps: [
      { title: 'Identifica el vínculo y reúne la prueba', detail: 'Matrimonio, pareja registrada, nacimiento del hijo español o dependencia del ascendiente.', when: 'Semana 1' },
      { title: 'Pide cita en Extranjería', detail: 'Se puede solicitar en España sin visado. Desde la admisión a trámite puedes residir y trabajar de forma provisional.', when: 'Semana 2-4' },
      { title: 'Presenta la solicitud', detail: 'Tasa 10,94 € (autorización) y 12 € de TIE. La tarjeta dura 5 años.', when: 'Día 0' },
      { title: 'Recoge la TIE', detail: 'Con la resolución favorable, pide cita para la tarjeta. Habilita a trabajar por cuenta ajena y propia.', when: '+1 a 3 meses' }
    ],
    cost: '10,94 € de autorización + 12 € de TIE',
    time: 'Tarjeta de 5 años; resolución orientativa de 3 meses',
    risks: [
      'Muchas webs y oficinas siguen llamándolo «arraigo familiar»: es otro procedimiento y se rechaza.',
      'Casarse con un español/a no te legaliza por sí solo: hay que solicitar la autorización y probar el matrimonio y la convivencia. Un matrimonio fraudulento se deniega.',
      'Tener un hijo/a español tampoco te legaliza por sí solo: como progenitor necesitas acreditar que el menor está a tu cargo y convive contigo, o que cumples tus obligaciones.',
      'Si el progenitor español no reconoce al hijo/a, la nacionalidad española no está resuelta; puede hacer falta filiación judicial.',
      'La pareja estable no registrada exige 12 meses de convivencia o hijo en común, y hay que probarlo.',
      'Si el español ha vivido en otro país de la UE, corresponde la vía comunitaria (O. & B.).'
    ],
    links: [L.boe1155, L.min, L.sede],
    fit: function (p, d) {
      if (d.hasSpanishSpouse) return 'Estás casado/a o tienes pareja registrada española: puedes solicitar esta tarjeta de 5 años con trabajo, pero el matrimonio no te legaliza por sí solo. Hay que presentar la solicitud y probar el vínculo y la convivencia.';
      if (d.stablePartnerSpanish) return d.stablePartnerQualifies === true
        ? 'Pareja estable con una persona española: si acreditas 12 meses de convivencia o un hijo en común, puedes solicitar esta vía. No es automática.'
        : 'Pareja estable: sin 12 meses de convivencia ni hijo en común, esta vía no encaja. Una relación ocasional o un embarazo no bastan.';
      if (d.hasSpanishChild) {
        if (d.childRecognized === false) return 'Has indicado un hijo/a de progenitor español, pero no consta el reconocimiento. Sin filiación, la nacionalidad española del menor no está resuelta y esta vía no se puede usar como si existiera.';
        return d.parentSpanishMinor === true
          ? 'Tu hijo/a español está a tu cargo: puedes solicitar la tarjeta de familiar de español como progenitor, si el vínculo está reconocido y documentado. No es automático.'
          : 'Tienes un hijo/a español, pero para la vía de progenitor falta acreditar el reconocimiento, que el menor esté a tu cargo y la convivencia (o el cumplimiento de obligaciones).';
      }
      if (d.pregnantBySpanish) return 'El embarazo no te da residencia. Si el padre es español y reconoce al hijo, el hijo será español; después podrías solicitar como progenitor si el menor queda a tu cargo.';
      if (d.spanishParent) return 'Tu padre o madre es español/a: si tienes menos de 26 años o dependes de él/ella, esta vía te da 5 años de residencia.';
      return 'Solo aplica si tienes un vínculo familiar directo con una persona española.';
    }
  });

  /* ══════════════════════════════════════════════════════════
     6. FAMILIAR DE CIUDADANO DE LA UE
     ══════════════════════════════════════════════════════════ */
  RL.routes.push({
    id: 'familiar_ue',
    group: 'residencia',
    title: 'Tarjeta de familiar de ciudadano de la UE',
    short: 'Para familiares de europeos que ejercen la libre circulación.',
    icon: 'globe',
    weight: 40,
    goals: ['residencia_estable', 'trabajar', 'familia'],
    where: 'both',
    availability: 'open',
    legal: 'RD 240/2007, arts. 8-10',
    summary: 'Si tu familiar es de un país de la UE/EEE o es español pero ha vivido en otro Estado miembro, puedes obtener una tarjeta de residencia de 5 años, con residencia permanente a los 5. Menos requisitos económicos que la vía nacional.',
    forWho: 'Cónyuges, parejas registradas, hijos y ascendientes a cargo de un ciudadano de la UE/EEE/Suiza que reside en España ejerciendo la libre circulación.',
    requirements: [
      { label: 'Tu familiar es ciudadano de la UE/EEE/Suiza (o español que ejerció la libre circulación)', test: function (p, d) { if (d.euCitizen) return false; if (d.spouseEU) return true; if (p.spanishRelativeEU === 'yes') return true; if (p.spanishRelativeEU === 'no') return false; return null; }, fix: 'Si tu familiar es español y nunca ha vivido en otro país de la UE, la vía es la nacional (familiar de español).' },
      { label: 'Eres cónyuge, pareja registrada, hijo o ascendiente a cargo', test: function (p, d) { return d.couple || d.hasKids || (d.familyInSpain || []).indexOf('parents') !== -1 ? true : null; }, fix: 'Parentesco: cónyuge, pareja registrada, hijos menores o a cargo, ascendientes a cargo.' },
      { label: 'El familiar reside en España y tiene certificado de registro o tarjeta', test: function () { return null; }, fix: 'Necesitas su certificado de registro de ciudadano de la Unión (o tarjeta de residencia).' },
      { label: 'Careces de antecedentes penales', test: criminalOK, actionable: false }
    ],
    blockers: [
      { label: 'Si tú eres ciudadano de la UE/EEE, no necesitas tarjeta de familiar: te corresponde el certificado de registro.', test: function (p, d) { return d.euCitizen; } },
      { label: 'No consta que tengas un familiar de la UE/EEE ni un español que haya ejercido la libre circulación.', test: function (p, d) { return !(d.spouseEU || p.spanishRelativeEU === 'yes'); } },
      { label: 'Es una vía para mayores de edad.', test: function (p, d) { return d.minor; } }
    ],
    docs: [D.pasaporte, D.matrimonio, D.nacimiento, D.convivencia, D.ant_origen, D.tasa_ue, D.ex19],
    steps: [
      { title: 'Reúne el parentesco', detail: 'Matrimonio, pareja registrada, nacimiento o dependencia.', when: 'Semana 1' },
      { title: 'Pide cita y presenta la solicitud', detail: 'En la Oficina de Extranjería o en el registro del ayuntamiento según el caso. Tasa 12 €.', when: 'Semana 2-6' },
      { title: 'Recoge la tarjeta', detail: 'Dura 5 años. A los 5 años de residencia continuada puedes pedir la residencia permanente.', when: '+3 meses' }
    ],
    cost: '12 € de tasa',
    time: '5 años; resolución orientativa de 3 meses',
    risks: [
      'Si el español nunca salió de España, no aplica: es la vía nacional.',
      'La residencia permanente exige 5 años continuados.'
    ],
    links: [L.boe1155, L.min],
    fit: function (p, d) {
      if (d.spouseEU) return 'Tu pareja es europea: esta vía tiene menos requisitos económicos que la nacional y te da 5 años.';
      if (p.spanishRelativeEU === 'yes') return 'Tu familiar español vivió en otro país de la UE: podrías acogerte al régimen comunitario.';
      return 'Solo si tu familiar europeo reside en España ejerciendo la libre circulación.';
    }
  });

  /* ══════════════════════════════════════════════════════════
     7. REAGRUPACIÓN FAMILIAR
     ══════════════════════════════════════════════════════════ */
  RL.routes.push({
    id: 'reagrupacion',
    group: 'residencia',
    title: 'Reagrupación familiar',
    short: 'Traer a tu cónyuge, hijos o padres que están fuera de España.',
    icon: 'family',
    weight: 20,
    goals: ['familia', 'residencia_estable'],
    where: 'spain',
    availability: 'open',
    legal: 'Arts. 65-70 RD 1155/2024',
    summary: 'Solo para familiares que están fuera de España: cónyuge o pareja, hijos menores de 18 (o con discapacidad) y ascendientes mayores de 65 o dependientes. Si ya están en España, aunque sea de turismo o en situación irregular, no se reagrupan por esta vía.',
    forWho: 'Titulares de una autorización de residencia que quieren traer a su familia desde el extranjero.',
    requirements: [
      { label: 'Tienes residencia en España', test: function (p, d) { return d.hasPermit; }, fix: 'Necesitas una autorización de residencia, no una estancia por estudios.' },
      { label: 'Llevas al menos 1 año de residencia y te queda otro', test: function (p, d) { if (d.monthsResident == null) return null; return d.monthsResident >= 12; }, fix: 'La práctica exige 1 año de residencia y autorización para residir al menos otro año. Indica desde cuándo tienes tu permiso.' },
      { label: 'Acreditas 150 % del IPREM (900 €/mes) para 2 personas', test: function (p, d) { if (!d.income) return null; return d.income >= 900; }, fix: '150 % del IPREM para ti y el primer familiar, y +50 % (300 €) por cada uno más. No cuentan becas ni ayudas.' },
      { label: 'Tienes informe de vivienda favorable', test: function () { return null; }, fix: 'Lo emiten los servicios sociales en 1 mes y caduca a los 6 meses.' },
      { label: 'Careces de antecedentes penales', test: criminalOK, actionable: false }
    ],
    blockers: [
      { label: 'Necesitas una autorización de residencia previa para reagrupar.', test: function (p, d) { return !d.hasPermit; } },
      { label: 'La reagrupación solo vale si el familiar está fuera de España. Si ya está aquí, no se puede reagrupar.', test: function (p) { return p.familyAbroad === 'en_espana'; } },
      { label: 'Es una vía para mayores de edad.', test: function (p, d) { return d.minor; } }
    ],
    docs: [D.pasaporte, D.matrimonio, D.nacimiento, D.medios, D.vivienda, D.ant_es, D.tasa_reag, D.ex02],
    steps: [
      { title: 'Comprueba tu antigüedad y medios', detail: '1 año de residencia y capacidad económica para la unidad familiar.', when: 'Mes -3' },
      { title: 'Pide el informe de vivienda', detail: 'Servicios sociales del municipio. Caduca a los 6 meses.', when: 'Mes -2' },
      { title: 'Solicita la reagrupación', detail: 'En la Oficina de Extranjería. Tasa 10,94 €.', when: 'Día 0' },
      { title: 'Tu familiar pide visado y entra', detail: 'Con la autorización concedida, el familiar solicita visado en el consulado. Después, TIE.', when: '+1 a 3 meses' }
    ],
    cost: '10,94 € + 16,40 € de renovación + 16,08 € de TIE',
    time: 'Autorización de 1 año, renovable',
    risks: [
      'El informe de vivienda caduca a los 6 meses.',
      'Los ascendientes solo si tienen 65 años o dependencia acreditada.',
      'No puedes reagrupar si tú mismo estás en situación irregular.',
      'Si el familiar ya está en España, no es reagrupación: hay que buscar otra vía (familiar de español/UE, arraigo u otra).'
    ],
    links: [L.boe1155, L.min],
    fit: function (p, d) {
      if (p.familyAbroad === 'en_espana') return 'No puedes reagrupar a alguien que ya está en España, aunque esté de turismo o irregular. Esta vía exige que el familiar esté fuera y pida visado.';
      return d.hasPermit ? 'Puedes reagrupar si cumples antigüedad y medios. Revisa el informe de vivienda.' : 'Primero necesitas tu propia residencia.';
    }
  });

  /* ══════════════════════════════════════════════════════════
     8. CIRCUNSTANCIAS EXCEPCIONALES
     ══════════════════════════════════════════════════════════ */
  RL.routes.push({
    id: 'circunstancias_excepcionales',
    group: 'residencia',
    title: 'Residencia por circunstancias excepcionales',
    short: 'Razones humanitarias, violencia de género, trata o colaboración.',
    icon: 'shield',
    weight: 16,
    goals: ['regularizar', 'residencia_estable'],
    where: 'spain',
    availability: 'open',
    legal: 'Arts. 128-155 RD 1155/2024',
    summary: 'Supuestos protegidos: enfermedad grave, riesgo para la integridad, víctimas de violencia de género o sexual, víctimas de trata y colaboración con las autoridades. Se solicita en España, sin visado, y puede incluir autorización de trabajo.',
    forWho: 'Personas en situaciones de vulnerabilidad o que colaboran con la justicia, aunque estén en situación irregular.',
    requirements: [
      { label: 'Te encuentras en un supuesto protegido', test: function (p, d) { return d.victim || d.protectionNeed || null; }, fix: 'Violencia de género o sexual, trata, enfermedad grave, riesgo para la integridad o colaboración con autoridades.', actionable: false },
      { label: 'Estás en España', test: inSpain, actionable: false },
      { label: 'Puedes acreditarlo (informe, denuncia, informe médico o social)', test: function () { return null; }, fix: 'No siempre hace falta denuncia: la autorización por violencia de género puede iniciarse de oficio.' },
      { label: 'Careces de antecedentes penales (valoración individual)', test: criminalOK, actionable: false }
    ],
    blockers: [
      { label: 'No se aprecia un supuesto de circunstancias excepcionales en tus respuestas.', test: function (p, d) { return !(d.victim || d.protectionNeed); } },
      { label: 'Es una vía para mayores de edad.', test: function (p, d) { return d.minor; } }
    ],
    docs: [D.pasaporte, D.ant_origen, D.ant_es, D.tasa, D.ex10],
    steps: [
      { title: 'Busca apoyo especializado', detail: '016 (violencia de género), CEAR, ACNUR, Cruz Roja o servicios sociales. No tienes que denunciar para informarte.', when: 'Cuanto antes' },
      { title: 'Reúne la prueba del supuesto', detail: 'Informes médicos, sociales, denuncia o atestado, resolución judicial.', when: 'Semana 1-4' },
      { title: 'Presenta la solicitud', detail: 'En la Oficina de Extranjería, personalmente. Tasa 10,94 € o 38,28 € según el supuesto.', when: 'Día 0' }
    ],
    cost: '10,94 € a 38,28 € + TIE',
    time: 'Variable; incluye autorización de trabajo en muchos supuestos',
    risks: [
      'Cada supuesto tiene requisitos y plazos propios.',
      'No es una vía «general»: si no encajas, se deniega.',
      'Requiere acompañamiento jurídico especializado.'
    ],
    links: [L.boe1155, L.min],
    fit: function (p, d) { return d.victim ? 'Has indicado una situación de violencia: hay una vía específica y recursos de protección. Busca apoyo especializado.' : ''; }
  });

  /* ══════════════════════════════════════════════════════════
     8 bis. RESIDENCIA POR RAZONES HUMANITARIAS
     ══════════════════════════════════════════════════════════ */
  RL.routes.push({
    id: 'humanitarias',
    group: 'residencia',
    title: 'Residencia por razones humanitarias',
    short: 'Vía excepcional por enfermedad grave, riesgo o vulnerabilidad acreditada.',
    icon: 'shield',
    weight: 18,
    goals: ['regularizar', 'residencia_estable'],
    where: 'spain',
    availability: 'open',
    legal: 'Art. 128 RD 1155/2024',
    summary: 'Autorización temporal por circunstancias excepcionales humanitarias. No es una vía general ni automática: exige un supuesto concreto (enfermedad grave, riesgo para la integridad, determinadas víctimas u otra razón humanitaria) y pruebas. La valora Extranjería y puede incluir autorización de trabajo.',
    forWho: 'Personas en España que acreditan una situación humanitaria concreta y grave, no una simple dificultad económica.',
    requirements: [
      { label: 'Estás en España', test: inSpain, actionable: false },
      { label: 'No eres ciudadano/a de la UE/EEE ni suizo/a', test: function (p, d) { return !d.euCitizen; }, actionable: false },
      { label: 'Acreditas un supuesto humanitario concreto', test: function (p, d) { if (!d.humanitarianGround || d.humanitarianGround === 'dontknow') return null; return d.humanitarianGround !== 'no'; }, fix: 'Enfermedad grave, riesgo para la integridad, victimización o vulnerabilidad acreditada. La pobreza por sí sola no basta.' },
      { label: 'Puedes aportar informe médico o social, resolución o prueba del supuesto', test: function () { return null; }, fix: 'No se concede por manifestarlo: hay que acreditarlo.' },
      { label: 'No tienes antecedentes penales relevantes', test: criminalOK, actionable: false }
    ],
    blockers: [
      { label: 'Los ciudadanos de la UE/EEE no necesitan esta autorización.', test: function (p, d) { return d.euCitizen; } },
      { label: 'No consta un supuesto humanitario concreto en tus respuestas.', test: function (p, d) { return d.humanitarianGround === 'no' || !d.humanitarianGround; } },
      { label: 'Es una vía para mayores de edad; los menores tienen protección específica.', test: function (p, d) { return d.minor; } }
    ],
    docs: [
      D.pasaporte, D.ex10, D.ant_origen, D.ant_es, D.tasa,
      { id: 'doc_informe_humanitario', name: 'Informe médico o social que acredite el supuesto humanitario', where: 'Servicio médico, servicios sociales o entidad especializada' }
    ],
    steps: [
      { title: 'Identifica y acredita el supuesto', detail: 'Enfermedad grave, riesgo para la integridad, violencia o vulnerabilidad. Reúne informes médicos, sociales o resolución judicial.', when: 'Antes de solicitar' },
      { title: 'Busca apoyo especializado', detail: 'CEAR, ACNUR, Cruz Roja, servicios sociales o abogado de extranjería. No presentes cualquier cosa.', when: 'Cuanto antes' },
      { title: 'Presenta el EX-10 y la prueba', detail: 'En la Oficina de Extranjería o sede. Tasa 790-052 según el supuesto.', when: 'Día 0' },
      { title: 'Sigue la resolución', detail: 'La autorización es temporal y puede incluir trabajo. Confirma vigencia y renovación en la resolución.', when: '+3 meses' }
    ],
    cost: 'Tasa 790-052 según el supuesto + TIE',
    time: 'Variable; autorización temporal, normalmente 1 año',
    risks: [
      'No es una vía general ni automática.',
      'La pobreza o la falta de trabajo no bastan por sí solas.',
      'Sin informe o prueba del supuesto, se deniega.',
      'Requiere revisión jurídica por la variedad de supuestos.'
    ],
    links: [L.boe1155, L.min],
    fit: function (p, d) {
      if (d.humanitarianGround && d.humanitarianGround !== 'no' && d.humanitarianGround !== 'dontknow') return 'Has indicado un posible supuesto humanitario. No es automático: hay que acreditarlo y lo valora Extranjería.';
      return 'No consta un supuesto humanitario concreto; no es una vía por pobreza.';
    }
  });

  /* ══════════════════════════════════════════════════════════
     9. ASILO / PROTECCIÓN INTERNACIONAL
     ══════════════════════════════════════════════════════════ */
  RL.routes.push({
    id: 'asilo',
    group: 'proteccion',
    title: 'Asilo y protección internacional',
    short: 'Si temes volver a tu país por persecución o conflicto.',
    icon: 'shield',
    weight: 24,
    goals: ['regularizar', 'residencia_estable'],
    where: 'spain',
    availability: 'open',
    legal: 'Ley 12/2009 y Reglamento de asilo',
    summary: 'Puedes solicitar protección internacional en España aunque estés en situación irregular. Mientras se tramita, tu estancia es legal y, tras 6 meses, puedes solicitar autorización de trabajo. No es una vía rápida ni segura: la mayoría de solicitudes se deniegan.',
    forWho: 'Personas que temen ser perseguidas o sufrir daños graves en su país por motivos políticos, religiosos, étnicos, de género u otros.',
    requirements: [
      { label: 'Estás en España o en la frontera', test: inSpain, actionable: false },
      { label: 'Temes volver a tu país por persecución o conflicto', test: function (p, d) { if (p.protectionNeed === 'yes') return true; if (p.protectionNeed === 'no') return false; return null; }, fix: 'La protección internacional cubre persecución por motivos tasados y daños graves (guerra, tortura). No cubre la pobreza.' },
      { label: 'No tienes ya una solicitud en curso o concedida', test: function (p, d) { if (d.asylumInProcess || d.asylumGranted) return false; if (p.asylumRequested === 'no') return true; return null; }, fix: 'Si ya la presentaste, tu plan es de seguimiento: cita, entrevista y renovación de la tarjeta roja.' },
      { label: 'No tienes una prohibición de entrada vigente', test: function (p) { if (p.exitOrder === 'yes') return false; return p.exitOrder === 'no' ? true : null; } }
    ],
    blockers: [
      { label: 'Los ciudadanos de la UE/EEE no pueden solicitar asilo en España.', test: function (p, d) { return d.euCitizen; } },
      { label: 'No has indicado que temas volver a tu país por persecución o conflicto.', test: function (p, d) { return !(p.protectionNeed === 'yes' || d.asylumSoon || d.asylumInProcess); } },
      { label: 'Ya tienes una solicitud de asilo en curso o concedida: usa la vía de seguimiento.', test: function (p, d) { return d.asylumInProcess || d.asylumGranted; } },
      { label: 'Ya tienes cita para solicitarlo: tu vía es el seguimiento de la solicitud.', test: function (p, d) { return d.asylumSoon; } },
      { label: 'Tu solicitud fue denegada: revisa el recurso con un abogado antes de plantear otra.', test: function (p, d) { return d.asylumDenied; } },
      { label: 'Es una vía para mayores de edad (los menores tienen protección específica).', test: function (p, d) { return d.minor; } }
    ],
    docs: [D.pasaporte, D.ant_origen],
    steps: [
      { title: 'Solicita cita o acude a la Oficina de Asilo', detail: 'Puedes solicitarlo en la Oficina de Asilo y Refugio, en la frontera o en algunas comisarías. No necesitas abogado para presentarla, pero ayuda.', when: 'Cuanto antes' },
      { title: 'Entrevista y tarjeta roja', detail: 'Se te identifica y se te entrega una tarjeta de solicitante. Eso te da estancia legal mientras se tramita.', when: 'Semanas 1-6' },
      { title: 'Trabajo tras 6 meses', detail: 'Pasados 6 meses desde la solicitud, puedes pedir autorización de trabajo si el expediente sigue pendiente.', when: '+6 meses' }
    ],
    cost: 'Gratuito',
    time: 'Meses o años; la tarjeta se renueva',
    risks: [
      'La tasa de denegación es alta.',
      'Si se deniega, puedes quedarte en situación irregular.',
      'Un abogado y una entidad especializada mejoran mucho las posibilidades.'
    ],
    links: [{ t: 'ACNUR España', u: 'https://www.acnur.org/es-es/' }, { t: 'CEAR', u: 'https://www.cear.es/' }, L.min],
    fit: function (p) { return p.protectionNeed === 'yes' ? 'Has indicado que temes volver: esta vía puede ser tu opción más protectora, aunque no es rápida.' : ''; }
  });

  /* ══════════════════════════════════════════════════════════
     9 bis. SEGUIMIENTO DE ASILO (hoja blanca / tarjeta roja)
     ══════════════════════════════════════════════════════════ */
  RL.routes.push({
    id: 'asilo_seguimiento',
    group: 'proteccion',
    title: 'Seguimiento de tu solicitud de asilo',
    short: 'Hoja blanca o tarjeta roja: qué toca ahora y cuándo renovar.',
    icon: 'clock',
    weight: 56,
    goals: ['regularizar', 'residencia_estable'],
    where: 'spain',
    availability: 'open',
    legal: 'Ley 12/2009 y Reglamento de asilo',
    summary: 'Ya has iniciado el proceso de protección internacional. Mientras se tramita, tu estancia es legal. Controla la caducidad de la hoja blanca o de la tarjeta roja, solicita autorización de trabajo a los 6 meses y no faltes a las citas.',
    forWho: 'Personas con cita de asilo, hoja blanca o tarjeta roja de solicitante de protección internacional.',
    requirements: [
      { label: 'Estás en España', test: inSpain, actionable: false },
      { label: 'Tienes cita, hoja blanca, tarjeta roja o una denegación reciente', test: function (p, d) { return d.asylumSoon || d.asylumInProcess || d.asylumDenied; }, fix: 'Si aún no has solicitado asilo, mira la vía de asilo.' },
      { label: 'Tu hoja blanca o tarjeta roja está en vigor', test: function (p, d) { if (d.hasRedCard && d.tarjetaRojaExpiry) return RL.dates.diff(RL.dates.today(), d.tarjetaRojaExpiry) >= 0; return null; }, fix: 'Si ha caducado, pide cita para renovarla cuanto antes.' },
      { label: 'Si te han denegado, has recurrido o lo vas a hacer', test: function (p, d) { if (!d.asylumDenied) return true; return d.asylumAppeal === 'yes' ? true : false; }, fix: 'El plazo de recurso es corto: busca abogado hoy.' },
      { label: 'No tienes una prohibición de entrada vigente', test: function (p) { if (p.exitOrder === 'yes') return false; return p.exitOrder === 'no' ? true : null; } }
    ],
    blockers: [
      { label: 'No tienes una solicitud de asilo en curso.', test: function (p, d) { return !(d.asylumInProcess || d.asylumSoon || d.asylumDenied); } },
      { label: 'Ya no estás en trámite de asilo: tienes una autorización posterior o una residencia aprobada. Esta vía de seguimiento ya no aplica.', test: function (p, d) { return d.postRenunciationGranted || d.residenceApproved === 'yes' || (d.hasPermit && !d.asylumInProcess); } },
      { label: 'Desististe o renunciaste al asilo: no hay solicitud en curso que seguir.', test: function (p, d) { return d.asylumExited && !d.asylumInProcess; } },
      { label: 'Tu asilo fue denegado y no consta que hayas recurrido: no es una vía de seguimiento, es un recurso urgente.', test: function (p, d) { return d.asylumDenied && p.asylumAppeal !== 'yes'; } },
      { label: 'Ya tienes la protección internacional concedida: tu vía es la residencia y la nacionalidad.', test: function (p, d) { return d.asylumGranted; } },
      { label: 'Es una vía para mayores de edad.', test: function (p, d) { return d.minor; } }
    ],
    docs: [
      D.pasaporte,
      { id: 'doc_hoja_blanca', name: 'Hoja blanca o resguardo de solicitud de asilo', where: 'Policía / Oficina de Asilo' },
      { id: 'doc_tarjeta_roja', name: 'Tarjeta roja de solicitante de asilo', where: 'Policía' },
      { id: 'doc_cita_asilo', name: 'Resguardo de la cita de asilo', where: 'Policía' }
    ],
    steps: [
      { title: 'Si tienes cita, acude con todo', detail: 'Pasaporte, documentación y cualquier prueba. No faltes: si no acudes, puedes perder el turno.', when: 'Fecha de la cita' },
      { title: 'Controla la hoja blanca', detail: 'Suele valer 1 mes y prorrogarse hasta 6 meses desde la solicitud. A los 6 meses puedes solicitar autorización de trabajo si no hay denegación.', when: '+1 y +6 meses' },
      { title: 'Renueva la tarjeta roja', detail: 'Mira la fecha de caducidad y pide renovación con antelación. Sin tarjeta en vigor tendrás problemas para trabajar y para acreditar tu situación.', when: '60 días antes' },
      { title: 'Si te deniegan, recurre', detail: 'El plazo es corto. Con un abogado o una entidad especializada puedes valorar el recurso y las alternativas (arraigo, circunstancias excepcionales).', when: 'Al recibir la denegación' }
    ],
    cost: 'Gratuito (la tarjeta puede llevar tasa)',
    time: 'Variable; la tarjeta se renueva',
    risks: [
      'No salgas de España mientras tu solicitud esté pendiente: puedes perder la protección.',
      'La denegación puede dejarte en situación irregular.',
      'Sin tarjeta en vigor, muchos trámites se bloquean.'
    ],
    links: [{ t: 'ACNUR España', u: 'https://www.acnur.org/es-es/' }, { t: 'CEAR', u: 'https://www.cear.es/' }, L.min],
    fit: function (p, d) {
      if (d.postRenunciationGranted || d.residenceApproved === 'yes' || (d.hasPermit && !d.asylumInProcess)) {
        return 'No es tu vía: ya tienes una autorización posterior o una residencia aprobada. Controla la vigencia de tu TIE.';
      }
      if (d.asylumExited) return 'Desististe o renunciaste al asilo: no hay solicitud en curso que seguir. Revisa la vía que abriste después.';
      if (d.asylumDenied && p.asylumAppeal !== 'yes') return 'Tu asilo fue denegado y no consta recurso: habla con un abogado hoy; esta ficha no es para seguir la solicitud.';
      if (d.asylumSoon) return 'Tienes una cita de asilo: es lo más urgente de tu plan. No faltes.';
      if (d.hasRedCard) return 'Tu tarjeta roja está en curso: controla la caducidad y el permiso de trabajo.';
      return 'Tu solicitud está en curso: controla la caducidad y el permiso de trabajo.';
    }
  });

  /* ══════════════════════════════════════════════════════════
     10. LARGA DURACIÓN
     ══════════════════════════════════════════════════════════ */
  RL.routes.push({
    id: 'larga_duracion',
    group: 'residencia',
    title: 'Residencia de larga duración',
    short: 'Tras 5 años de residencia legal continuada.',
    icon: 'route',
    weight: 26,
    goals: ['residencia_estable', 'trabajar'],
    where: 'spain',
    availability: 'open',
    legal: 'Arts. 176-183 RD 1155/2024',
    summary: 'Después de 5 años de residencia legal y continuada puedes obtener la larga duración (nacional o UE), que te permite residir y trabajar de forma indefinida en España y, con matices, en la UE.',
    forWho: 'Personas con 5 años de residencia legal continuada, con ausencias limitadas.',
    requirements: [
      { label: 'Llevas 5 años de residencia legal continuada', test: function (p, d) { if (p.permitStatus === 'longterm') return true; if (d.monthsResident == null) return d.hasPermit ? null : false; return d.monthsResident >= 60; }, fix: 'Cuenta solo el tiempo con autorización de residencia. La estancia por estudios computa al 50 %.' },
      { label: 'Tus ausencias no superan 6 meses seguidos ni 10 meses en total', test: function (p) { if (p.leftSpain === 'no') return true; if (p.leftSpain === 'yes_safe') return null; return null; }, fix: 'Máximo 6 meses continuados y 10 meses en 5 años (18 meses si son por trabajo).' },
      { label: 'Acreditas medios económicos y seguro', test: function (p, d) { if (d.income >= 900 && d.hasInsurance) return true; if (!d.income) return null; return false; }, fix: 'Se aplican los criterios de reagrupación (150 % IPREM + 50 %).' },
      { label: 'Careces de antecedentes penales', test: criminalOK, actionable: false }
    ],
    blockers: [
      { label: 'Necesitas un permiso de residencia previo.', test: function (p, d) { return !d.hasPermit && p.permitStatus !== 'longterm'; } },
      { label: 'Es una vía para mayores de edad.', test: function (p, d) { return d.minor; } }
    ],
    docs: [D.pasaporte, D.ant_es, D.ant_origen, D.medios, D.tasa_larga, D.ex11],
    steps: [
      { title: 'Calcula tus 5 años y ausencias', detail: 'Revisa todas tus tarjetas y los sellos de entrada y salida.', when: 'Mes -3' },
      { title: 'Reúne medios y seguro', detail: 'Nóminas, contrato, IRPF y seguro médico.', when: 'Mes -2' },
      { title: 'Presenta la solicitud', detail: 'Tasa 21,87 €. La tarjeta dura 5 años (larga duración UE) o es indefinida en la nacional.', when: 'Día 0' }
    ],
    cost: '21,87 € + 21,87 € de TIE',
    time: 'Resolución orientativa de 3 meses',
    risks: [
      'Las ausencias se computan mal con frecuencia.',
      'La estancia por estudios cuenta al 50 %.'
    ],
    links: [L.boe1155, L.min],
    fit: function () { return 'Es el objetivo a medio plazo si ya tienes residencia: consolida tu situación y te abre la puerta a la nacionalidad.'; }
  });

  /* ══════════════════════════════════════════════════════════
     11. ESTUDIOS → RESIDENCIA Y TRABAJO
     ══════════════════════════════════════════════════════════ */
  RL.routes.push({
    id: 'estudios_a_trabajo',
    group: 'residencia',
    title: 'De estudiante a residente que trabaja',
    short: 'Termina tus estudios y modifica a residencia y trabajo.',
    icon: 'book',
    weight: 30,
    goals: ['trabajar', 'residencia_estable'],
    where: 'spain',
    availability: 'open',
    legal: 'Art. 190 RD 1155/2024',
    summary: 'Si has terminado una estancia por estudios, puedes modificarla a residencia y trabajo sin salir de España y sin que se aplique la situación nacional de empleo. Debes solicitarlo en los 2 meses anteriores o 3 posteriores.',
    forWho: 'Personas con estancia de larga duración por estudios que han obtenido su título o certificado.',
    requirements: [
      { label: 'Tienes una estancia por estudios en vigor o recién extinguida', test: function (p) { return p.permitStatus === 'studies' || p.permitStatus === 'expired' ? (p.permitStatus === 'studies' ? true : null) : false; }, fix: 'Debes haber terminado la formación y estar dentro del plazo de 2 meses antes o 3 después.' },
      { label: 'Has obtenido el título o certificado', test: function () { return null; }, fix: 'Título, certificado de aprovechamiento o documento equivalente.' },
      { label: 'Tienes una oferta o contrato de trabajo', test: workContract, fix: 'Puede solicitarlo el empleador o tú. No se exige que el puesto esté en el catálogo de ocupaciones.' },
      { label: 'Careces de antecedentes penales', test: criminalOK, actionable: false }
    ],
    blockers: [
      { label: 'No tienes ni has tenido estancia por estudios.', test: function (p) { return !(p.permitStatus === 'studies' || (p.permitStatus === 'expired' && /estudi/.test(p.notes || ''))); } },
      { label: 'Es una vía para mayores de edad.', test: function (p, d) { return d.minor; } }
    ],
    docs: [D.pasaporte, D.ant_origen, D.ant_es, D.tasa_mod, D.ex26],
    steps: [
      { title: 'Reúne título y contrato', detail: 'La titulación obtenida y la oferta o contrato de trabajo.', when: 'Mes -2' },
      { title: 'Presenta la modificación', detail: 'Tasa 10,94 €. Desde la admisión a trámite tienes autorización provisional de residencia y trabajo a jornada completa.', when: 'Día 0' },
      { title: 'Recoge la autorización', detail: 'Dura 1 año y habilita a trabajar.', when: '+3 meses' }
    ],
    cost: '10,94 € + 16,08 € de TIE',
    time: '1 año; resolución orientativa de 3 meses',
    risks: [
      'Si dejas pasar los 3 meses tras la extinción, caes en irregularidad y hay que ir a arraigo.',
      'Para profesiones reguladas hace falta habilitación profesional.'
    ],
    links: [L.boe1155, L.min],
    fit: function () { return 'Si estás estudiando, planifica el paso a trabajar antes de terminar: es mucho más fácil que regularizarse después.'; }
  });

  /* ══════════════════════════════════════════════════════════
     12. RENOVACIÓN
     ══════════════════════════════════════════════════════════ */
  RL.routes.push({
    id: 'renovacion',
    group: 'residencia',
    title: 'Renovar tu permiso a tiempo',
    short: 'No dejes caducar tu autorización: ventana de 60 días antes y 90 después.',
    icon: 'clock',
    weight: 18,
    goals: ['residencia_estable', 'trabajar'],
    where: 'spain',
    availability: 'open',
    legal: 'Arts. 132 y ss. RD 1155/2024',
    summary: 'Si ya tienes una autorización temporal, renovarla a tiempo conserva tu situación y evita empezar de cero. Puedes solicitarlo desde 60 días antes y hasta 90 días después de la caducidad.',
    forWho: 'Titulares de autorizaciones temporales que van a caducar o han caducado hace poco.',
    requirements: [
      { label: 'Tienes una autorización temporal', test: function (p, d) { return d.hasPermit && d.permit !== 'longterm'; }, fix: 'Si tu tarjeta es de larga duración, no necesitas renovarla cada año.' },
      { label: 'Estás dentro del plazo (60 días antes o 90 después)', test: function (p) { if (!p.permitExpiry) return null; var d = RL.dates.diff(p.permitExpiry, RL.dates.today()); return d >= -90 && d <= 60; }, fix: 'Fuera de plazo, la renovación es más difícil y puede exigir la vía de segunda oportunidad.' },
      { label: 'Cumples los requisitos de tu tipo de permiso', test: function () { return null; }, fix: 'Medios, contrato, escolarización de hijos, seguro… según la autorización.' }
    ],
    blockers: [
      { label: 'No tienes una autorización temporal que renovar.', test: function (p, d) { return !d.hasPermit; } },
      { label: 'Es una vía para mayores de edad.', test: function (p, d) { return d.minor; } }
    ],
    docs: [D.pasaporte, D.medios, D.tasa_renov],
    steps: [
      { title: 'Mira la fecha de caducidad', detail: 'Pide cita con 60 días de margen. La cita puede tardar semanas.', when: '60 días antes' },
      { title: 'Reúne los requisitos de tu permiso', detail: 'Nóminas, contrato, vida laboral, seguro, escolarización…', when: 'Mes -2' },
      { title: 'Presenta la renovación', detail: 'Tasa 16,40 € + 19,30 € de TIE. Presentar en plazo prorroga tu autorización hasta la resolución.', when: 'Día 0' }
    ],
    cost: '16,40 € + 19,30 € de TIE',
    time: 'Resolución orientativa de 3 meses',
    risks: [
      'No se debe asumir silencio positivo: confirma siempre.',
      'Si caduca y no renuevas, entras en situación irregular.'
    ],
    links: [L.boe1155, L.sede],
    fit: function (p) { return p.permitExpiry ? 'Tu permiso caduca el ' + RL.fmt.date(p.permitExpiry) + ': prepara la renovación con tiempo.' : ''; }
  });

  /* ══════════════════════════════════════════════════════════
     13. REGULARIZACIÓN 2026 (cerrada) + seguimiento
     ══════════════════════════════════════════════════════════ */
  RL.routes.push({
    id: 'regularizacion_2026',
    group: 'residencia',
    title: 'Regularización extraordinaria de 2026',
    short: 'Ventana cerrada el 30 de junio de 2026. Solo informativa.',
    icon: 'cal',
    weight: 0,
    goals: ['regularizar'],
    where: 'spain',
    availability: 'closed',
    legal: 'DA 21.ª RD 1155/2024, añadida por RD 316/2026',
    deadline: '2026-06-30',
    deadlineNote: 'La ventana de solicitud terminó el 30 de junio de 2026 y no se ha prorrogado.',
    summary: 'Entre el 16 de abril y el 30 de junio de 2026 se pudo solicitar una regularización extraordinaria si estabas en España antes del 1 de enero de 2026 y acreditabas 5 meses de permanencia ininterrumpida antes de solicitar. Ya está cerrada: si no la pediste, no hay forma de solicitarla ahora.',
    forWho: 'Personas que ya la solicitaron o que quieren entender por qué su situación no encaja en ella.',
    requirements: [
      { label: 'Estabas en España antes del 1 de enero de 2026', test: function (p) { return p.entryDate ? RL.dates.diff(p.entryDate, '2026-01-01') >= 0 : null; } },
      { label: 'Acreditabas 5 meses de permanencia ininterrumpida', test: function () { return null; } },
      { label: 'La solicitaste antes del 30 de junio de 2026', test: function (p) { return p.regularizationApplied === 'yes' || p.regularizationApplied === 'pending' || p.regularizationApplied === 'granted'; }, fix: 'Si no la solicitaste, el plazo ya no está abierto.' }
    ],
    blockers: [{ label: 'El plazo de solicitud está cerrado desde el 1 de julio de 2026.', test: function () { return true; } }],
    docs: [D.pasaporte, D.ant_origen, D.ant_es, D.padron, D.ex32],
    steps: [
      { title: 'Si la solicitaste, sigue tu expediente', detail: 'Comprueba el estado, atiende requerimientos y guarda los justificantes.', when: 'Ahora' },
      { title: 'Si no la solicitaste, revisa tus vías ordinarias', detail: 'Arraigo social, familiar de español, asilo u otras. La regularización no se reabrirá por ahora.', when: 'Ahora' }
    ],
    cost: '38,28 € (cuando estaba abierta)',
    time: 'Cerrada',
    risks: ['Se han anunciado más de un millón de solicitudes y el Tribunal Supremo ha admitido a trámite cuestiones sobre su compatibilidad con el Derecho de la UE.'],
    links: [L.boe316, L.min],
    fit: function () { return ''; }
  });

  RL.routes.push({
    id: 'regularizacion_seguimiento',
    group: 'residencia',
    title: 'Seguimiento de la regularización 2026',
    short: 'Si solicitaste la regularización, esto es lo que toca ahora.',
    icon: 'clock',
    weight: 46,
    goals: ['regularizar', 'residencia_estable'],
    where: 'spain',
    availability: 'open',
    legal: 'DA 21.ª RD 1155/2024',
    summary: 'Tu solicitud de regularización está en trámite o concedida. Mantén la documentación al día, controla los requerimientos y prepara la renovación de la autorización de 1 año.',
    forWho: 'Personas que solicitaron la regularización extraordinaria de 2026.',
    requirements: [
      { label: 'Solicitaste la regularización y está en trámite o concedida', test: function (p) { return p.regularizationApplied === 'pending' || p.regularizationApplied === 'granted'; }, fix: 'Si no la solicitaste, el plazo está cerrado.' },
      { label: 'Mantienes tu empadronamiento y documentación', test: function (p) { return p.empadronado === 'yes' ? true : null; }, fix: 'Actualiza el padrón y guarda todos los justificantes.' }
    ],
    blockers: [{ label: 'No solicitaste la regularización de 2026.', test: function (p) { return p.regularizationApplied !== 'pending' && p.regularizationApplied !== 'granted'; } }],
    docs: [D.pasaporte, D.padron, D.tasa],
    steps: [
      { title: 'Comprueba el estado del expediente', detail: 'Sede electrónica o la Oficina de Extranjería. Guarda los números de expediente.', when: 'Cada 4-6 semanas' },
      { title: 'Responde a los requerimientos', detail: 'Suelen dar 10 días. Si no respondes, se archiva.', when: 'Cuando llegue' },
      { title: 'Prepara la renovación', detail: 'La autorización dura 1 año. Renueva 60 días antes con medios y padrón.', when: 'Mes 10' }
    ],
    cost: '38,28 € (tasa ya pagada) + 16,40 € de renovación',
    time: 'Resolución en 3 meses (silencio negativo); autorización de 1 año',
    risks: [
      'El silencio es negativo: si no hay resolución expresa, hay que recurrir.',
      'No salgas de España sin comprobar si puedes volver.'
    ],
    links: [L.boe316, L.min, L.sede],
    fit: function () { return 'Tu plan ahora no es solicitar: es sostener el expediente y preparar la renovación.'; }
  });
  /* ══════════════════════════════════════════════════════════
     14. CIUDADANOS DE LA UE/EEE (certificado de registro)
     ══════════════════════════════════════════════════════════ */
  RL.routes.push({
    id: 'ciudadano_ue',
    group: 'residencia',
    title: 'Certificado de registro de ciudadano de la UE',
    short: 'Si eres de la UE/EEE o Suiza, no necesitas visado: regístrate al llegar.',
    icon: 'globe',
    weight: 34,
    goals: ['residencia_estable', 'trabajar'],
    where: 'spain',
    availability: 'open',
    allowEU: true,
    legal: 'RD 240/2007, arts. 7-8',
    summary: 'Los ciudadanos de la UE/EEE y Suiza tienen derecho a residir en España sin visado ni autorización. Solo deben inscribirse en el Registro Central de Extranjeros para obtener el certificado de registro (la «tarjeta verde»), que acredita su derecho de residencia.',
    forWho: 'Ciudadanos de la UE, del EEE o de Suiza que viven o van a vivir en España.',
    requirements: [
      { label: 'Eres ciudadano/a de la UE/EEE/Suiza', test: function (p, d) { return d.euCitizen; }, actionable: false },
      { label: 'Estás en España o vas a trasladarte', test: inSpain, fix: 'Puedes entrar sin visado con tu DNI o pasaporte y registrarte al llegar.' },
      { label: 'Tienes pasaporte o DNI en vigor', test: function (p) { return p.hasPassport === 'yes' ? true : null; }, fix: 'Con el DNI de tu país también puedes identificarte si eres de la UE.' },
      { label: 'Estás empadronado/a', test: padronOK, fix: 'El certificado de empadronamiento es imprescindible para inscribirte.' }
    ],
    blockers: [
      { label: 'Ya tienes la nacionalidad española: no necesitas registrarte como extranjero.', test: function (p, d) { return d.isSpanish; } }
    ],
    docs: [
      { id: 'ue_id', name: 'DNI o pasaporte en vigor', where: 'Tu país' },
      { id: 'ue_padron', name: 'Certificado de empadronamiento', where: 'Ayuntamiento' },
      D.ex18
    ],
    steps: [
      { title: 'Empadrónate', detail: 'En el ayuntamiento, con tu DNI o pasaporte y un contrato de alquiler o autorización del propietario.', when: 'Semana 1' },
      { title: 'Pide cita en el Registro Central de Extranjeros', detail: 'En la Oficina de Extranjería o comisaría de tu provincia.', when: 'Semana 2-4' },
      { title: 'Presenta la solicitud', detail: 'DNI/pasaporte, padrón y formulario. El certificado es gratuito.', when: 'Cita' }
    ],
    cost: 'Gratuito (sin tasa)',
    time: 'En el momento o pocos días, según la oficina',
    risks: [
      'No confundir con el NIE: el certificado de registro acredita tu derecho de residencia.',
      'Si vas a trabajar, puedes inscribirte con el contrato o el alta en la Seguridad Social.'
    ],
    links: [L.boe1155, L.min, L.sede],
    fit: function () { return 'Como ciudadano de la UE/EEE no necesitas visado ni autorización: solo inscribirte y empadronarte.'; }
  });
})();

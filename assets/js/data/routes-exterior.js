/* ============================================================
   Ruta Legal · visados y entrada desde el exterior
   Base: LO 4/2000, RD 1155/2024, Ley 14/2013 (modificada por
   LO 1/2025), Ley 28/2022, RD 240/2007 y fichas consulares 2026.
   ============================================================ */
(function () {
  'use strict';
  var RL = window.RL = window.RL || {};
  RL.routes = RL.routes || [];

  var L = {
    exteriores: { t: 'Ministerio de Asuntos Exteriores · servicios consulares', u: 'https://www.exteriores.gob.es/' },
    uge: { t: 'UGE-CE · Unidad de Grandes Empresas', u: 'https://inclusion.gob.es/web/unidadgrandesempresas/sobre-nosotros' },
    ley14: { t: 'BOE · Ley 14/2013 de emprendedores', u: 'https://www.boe.es/buscar/act.php?id=BOE-A-2013-10074' },
    consular: { t: 'Sutramiteconsular · cita consular', u: 'https://sutramiteconsular.maec.es/' },
    boe1155: { t: 'BOE · Reglamento de Extranjería (RD 1155/2024)', u: 'https://www.boe.es/buscar/act.php?id=BOE-A-2024-24099' },
    sede: { t: 'Sede electrónica · tasas y trámites', u: 'https://sede.administracion.gob.es/' }
  };

  var D = {
    pasaporte: { id: 'v_pasaporte', name: 'Pasaporte de tu país (no español), en vigor (mínimo 1 año y 2 páginas libres)', where: 'Tu país' },
    formulario: { id: 'v_formulario', name: 'Formulario de visado nacional', where: 'Consulado / sede' },
    seguro: { id: 'v_seguro', name: 'Seguro médico privado sin copagos ni carencias', where: 'Aseguradora autorizada en España', note: 'No vale un seguro de viaje.' },
    ant: { id: 'v_ant', name: 'Certificado de antecedentes penales (últimos 5 años)', where: 'País de residencia', note: 'Apostillado o legalizado y traducido. Validez habitual: 6 meses.' },
    medico: { id: 'v_medico', name: 'Certificado médico (Reglamento Sanitario Internacional)', where: 'Médico oficial', note: 'Validez habitual: 6 meses.' },
    medios: { id: 'v_medios', name: 'Prueba de medios económicos', where: 'Tú', note: 'Nóminas, pensiones, ahorros, declaración de la renta, carta explicativa.' },
    alojamiento: { id: 'v_alojamiento', name: 'Prueba de alojamiento', where: 'Tú', note: 'Contrato de alquiler, reserva o carta de invitación.' },
    admision: { id: 'v_admision', name: 'Carta de admisión y matrícula pagada', where: 'Centro educativo español' },
    contrato: { id: 'v_contrato', name: 'Contrato de trabajo firmado', where: 'Empresa en España' },
    plan: { id: 'v_plan', name: 'Plan de negocio y prueba de inversión', where: 'Tú' },
    titulo: { id: 'v_titulo', name: 'Título o certificado de experiencia', where: 'Tu país', note: 'Apostillado y traducido si procede.' },
    certificado_empresa: { id: 'v_cert_empresa', name: 'Certificado de la empresa extranjera (antigüedad, ingresos, permiso de teletrabajo)', where: 'Tu empleador' },
    tasa: { id: 'v_tasa', name: 'Tasa 790-052 + tasa consular', where: 'Sede electrónica y consulado' },
    tasa_nl: { id: 'v_tasa_nl', name: 'Tasa 790-052 (epígrafe 2.1) + tasa consular', where: 'Sede electrónica y consulado' },
    ex00: { id: 'v_ex00', name: 'Impreso EX-00 (estancia de larga duración por estudios)', where: 'Consulado / sede' },
    ex01: { id: 'v_ex01', name: 'Impreso EX-01 (residencia temporal no lucrativa)', where: 'Consulado / sede' },
    ex03: { id: 'v_ex03', name: 'Impreso EX-03 (residencia y trabajo por cuenta ajena)', where: 'Consulado / sede' },
    ex07: { id: 'v_ex07', name: 'Impreso EX-07 (residencia y trabajo por cuenta propia)', where: 'Consulado / sede' },
    uge: { id: 'v_uge', name: 'Impreso de solicitud de la Ley 14/2013 (UGE-CE)', where: 'UGE-CE / sede' }
  };

  function outside(p) { return p.location !== 'spain'; }
  function money(p, d) { return Math.max(d.income || 0, (d.savings || 0) / 12); }
  function clean(p, d) {
    if (d.criminalSpain === 'yes' || d.criminalOrigin === 'yes') return false;
    if (d.criminalSpain === 'no' && d.criminalOrigin === 'no') return true;
    return null;
  }

  /* ══════════════════════════════════════════════════════════
     1. RESIDENCIA NO LUCRATIVA
     ══════════════════════════════════════════════════════════ */
  RL.routes.push({
    id: 'visado_no_lucrativa',
    group: 'visado',
    title: 'Visado de residencia no lucrativa',
    short: 'Vivir en España sin trabajar, acreditando 2.400 €/mes.',
    icon: 'home',
    weight: 30,
    goals: ['residencia_estable'],
    where: 'consulado',
    availability: 'open',
    legal: 'Arts. 61-64 RD 1155/2024',
    summary: 'Para quien puede vivir en España sin trabajar: jubilados, rentistas o personas con patrimonio. Se exige acreditar 400 % del IPREM (2.400 €/mes) y 600 €/mes por cada familiar, seguro médico privado y antecedentes limpios. Duración inicial de 1 año, renovable por 2.',
    forWho: 'Personas con medios económicos suficientes que no van a trabajar en España.',
    requirements: [
      { label: 'Estás fuera de España', test: outside, actionable: false, fix: 'Este visado solo se solicita en el consulado de tu país. Estando en España como turista no se puede pedir.' },
      { label: 'Acreditas 2.400 €/mes (400 % IPREM) para ti', test: function (p, d) { return money(p, d) >= 2400; }, fix: 'Se admiten ahorros, pensiones y rentas. Hay que justificar 12 meses por adelantado (28.800 €).' },
      { label: 'Acreditas 600 €/mes por cada familiar', test: function (p, d) { if (!d.hasKids && !d.couple) return true; return null; }, fix: '100 % del IPREM por cada familiar que venga contigo.' },
      { label: 'Tienes seguro médico privado sin copagos', test: function (p, d) { return d.insurance === 'private'; }, fix: 'Debe cubrir todo el periodo, sin carencias ni límites. No vale el seguro de viaje.' },
      { label: 'Careces de antecedentes penales', test: clean, actionable: false, fix: 'Certificado de los últimos 5 años, apostillado y traducido.' },
      { label: 'No vas a trabajar en España', test: function (p, d) { return d.employment === 'remote' ? false : null; }, fix: 'Si trabajas en remoto, la vía correcta es el nómada digital, no la no lucrativa.' }
    ],
    blockers: [
      { label: 'Solo se puede solicitar desde el exterior.', test: function (p) { return p.location === 'spain'; } },
      { label: 'Es una vía para mayores de edad.', test: function (p, d) { return d.minor; } }
    ],
    docs: [D.pasaporte, D.formulario, D.medios, D.seguro, D.ant, D.medico, D.alojamiento, D.tasa_nl, D.ex01],
    steps: [
      { title: 'Reúne los medios económicos', detail: '12 meses por adelantado: 28.800 € para el titular. Prepara una carta explicativa del origen del dinero.', when: 'Mes -4' },
      { title: 'Contrata el seguro médico', detail: 'Sin copagos, sin carencias y con cobertura en España.', when: 'Mes -3' },
      { title: 'Pide cita en el consulado', detail: 'Cada consulado usa su sistema (SUCITA.CON, BLS o email). Solicita 2-3 meses antes.', when: 'Mes -3' },
      { title: 'Presenta el visado y la autorización (EX-01)', detail: 'El visado y la autorización inicial se tramitan juntos.', when: 'Mes -2' },
      { title: 'Entra y pide la TIE', detail: 'Tienes 90 días para entrar y 1 mes para la TIE.', when: 'Concesión' }
    ],
    cost: 'Tasa 790-052 + tasa consular (variable) + TIE',
    time: 'Resolución 3 meses; visado válido 90 días; TIE en 1 mes',
    risks: [
      'No permite trabajar ni ser autónomo.',
      'Hay que acreditar 12 meses por adelantado, no uno.',
      'No se puede pedir desde España como turista.'
    ],
    links: [L.boe1155, L.exteriores, L.sede],
    fit: function (p, d) { return d.income >= 2400 || d.savings >= 28800 ? 'Tus medios podrían alcanzar el umbral de 2.400 €/mes.' : 'Necesitas 2.400 €/mes o 28.800 € de ahorro para el titular, más 600 €/mes por familiar.'; }
  });

  /* ══════════════════════════════════════════════════════════
     2. VISADO DE ESTUDIOS
     ══════════════════════════════════════════════════════════ */
  RL.routes.push({
    id: 'visado_estudios',
    group: 'visado',
    title: 'Visado de estudios',
    short: 'Estudiar en España y trabajar hasta 30 h/semana.',
    icon: 'book',
    weight: 32,
    goals: ['estudiar', 'residencia_estable'],
    where: 'consulado',
    availability: 'open',
    legal: 'Arts. 52-57 RD 1155/2024',
    summary: 'Para estancias de más de 90 días por estudios superiores, formación o voluntariado. Exige admisión, matrícula pagada, medios (100 % del IPREM) y seguro. Permite trabajar hasta 30 h/semana y, al terminar, modificar a residencia y trabajo.',
    forWho: 'Estudiantes que quieren cursar estudios en España y, después, quedarse a trabajar.',
    requirements: [
      { label: 'Estás fuera de España', test: outside, actionable: false },
      { label: 'Tienes carta de admisión y matrícula pagada', test: function (p, d) { return d.studiesAdmission === 'yes'; }, fix: 'La carta debe estar emitida en España, en español, con fechas y datos de contacto.' },
      { label: 'Acreditas 600 €/mes (100 % IPREM)', test: function (p, d) { return money(p, d) >= 600; }, fix: 'Unos 7.200 € para 12 meses. También valen becas o aval.' },
      { label: 'Tienes seguro médico', test: function (p, d) { return d.insurance === 'private' || d.insurance === 'public'; } },
      { label: 'Careces de antecedentes penales (estancias > 180 días)', test: clean, actionable: false },
      { label: 'Tienes al menos 17 años', test: function (p, d) { return d.age == null ? null : d.age >= 17; }, actionable: false }
    ],
    blockers: [
      { label: 'Solo se puede solicitar desde el exterior.', test: function (p) { return p.location === 'spain'; } },
      { label: 'Para menores de 17 años hay vías específicas.', test: function (p, d) { return p.age != null && Number(p.age) < 17; } }
    ],
    docs: [D.pasaporte, D.formulario, D.admision, D.medios, D.seguro, D.medico, D.ant, D.tasa, D.ex00],
    steps: [
      { title: 'Consigue la admisión', detail: 'Universidad, FP, escuela de idiomas o programa de voluntariado.', when: '6-9 meses antes' },
      { title: 'Paga la matrícula y guarda el justificante', detail: 'Sin pago no se emite la carta de admisión válida.', when: '4-6 meses antes' },
      { title: 'Solicita el visado', detail: '6 a 2 meses antes del inicio. Prevé 5 semanas o más.', when: '3-5 meses antes' },
      { title: 'Entra y pide la TIE', detail: 'Si la estancia supera 180 días, TIE en 30 días.', when: 'Llegada' }
    ],
    cost: 'Tasa consular + TIE; seguro y matrícula aparte',
    time: 'Visado válido 1 mes antes y 15 días después del programa',
    risks: [
      'Los familiares del estudiante no pueden trabajar.',
      'El doctorado ya no es visado de estudios: desde agosto de 2026 va por investigador (RIN/UGE-CE).',
      'El tiempo de estudios no cuenta como residencia para la nacionalidad.'
    ],
    links: [L.boe1155, L.exteriores],
    fit: function () { return 'Es una forma de entrar legalmente y, después, modificar a residencia y trabajo. Pero no cuenta como residencia para la nacionalidad.'; }
  });

  /* ══════════════════════════════════════════════════════════
     3. TRABAJO POR CUENTA AJENA
     ══════════════════════════════════════════════════════════ */
  RL.routes.push({
    id: 'visado_trabajo_ajena',
    group: 'visado',
    title: 'Visado de trabajo por cuenta ajena',
    short: 'La empresa en España te contrata y tramita la autorización.',
    icon: 'briefcase',
    weight: 28,
    goals: ['trabajar', 'residencia_estable'],
    where: 'consulado',
    availability: 'open',
    legal: 'Arts. 71-76 RD 1155/2024',
    summary: 'Para trabajar por cuenta ajena. La empresa presenta la autorización inicial en España; después tú pides el visado en el consulado. Es difícil sin una ocupación del catálogo o un puesto que no se cubra con residentes.',
    forWho: 'Trabajadores con una oferta firme de una empresa española.',
    requirements: [
      { label: 'Estás fuera de España', test: outside, actionable: false },
      { label: 'Tienes una oferta o contrato firmado', test: function (p, d) { return d.jobOffer === 'yes'; }, fix: 'El contrato debe existir antes de solicitar. Lo presenta la empresa.' },
      { label: 'El puesto está en el catálogo de ocupaciones o se acredita que no hay candidatos', test: function () { return null; }, fix: 'El catálogo de 2026 es muy reducido. La empresa puede acreditar la no cobertura del puesto o acudir a la GECCO.' },
      { label: 'Cumples los requisitos de titulación o experiencia', test: function (p, d) { return d.hasDegree || d.experience >= 2 ? true : null; }, fix: 'Título o experiencia acreditable para la profesión.' },
      { label: 'Careces de antecedentes penales', test: clean, actionable: false }
    ],
    blockers: [
      { label: 'Solo se puede solicitar desde el exterior.', test: function (p) { return p.location === 'spain'; } },
      { label: 'Es una vía para mayores de edad.', test: function (p, d) { return d.minor; } }
    ],
    docs: [D.pasaporte, D.formulario, D.contrato, D.titulo, D.ant, D.medico, D.tasa, D.ex03],
    steps: [
      { title: 'Encuentra una empresa dispuesta a contratar', detail: 'La empresa debe iniciar el procedimiento en la Oficina de Extranjería.', when: 'Mes -6' },
      { title: 'La empresa presenta la autorización', detail: 'Con contrato, solvencia y justificación de la cobertura del puesto.', when: 'Mes -4' },
      { title: 'Solicita el visado', detail: 'Tienes 2 meses desde la concesión para pedir el visado.', when: 'Concesión' },
      { title: 'Entra, TIE y alta', detail: 'TIE en 1 mes y alta en la Seguridad Social.', when: 'Llegada' }
    ],
    cost: 'Tasa 790-052 + consular + TIE',
    time: 'Resolución 3 meses (silencio negativo)',
    risks: [
      'El catálogo de 2026 es mínimo: la mayoría pasa por «no cobertura» o GECCO.',
      'Si no recoges el visado en 2 meses, la autorización caduca.',
      'No se puede pedir desde España como turista.'
    ],
    links: [L.boe1155, L.exteriores],
    fit: function (p, d) { return d.jobOffer === 'yes' ? 'Tienes oferta: el siguiente paso es que la empresa inicie el expediente.' : 'Sin oferta firme, esta vía no arranca.'; }
  });

  /* ══════════════════════════════════════════════════════════
     4. TRABAJO POR CUENTA PROPIA
     ══════════════════════════════════════════════════════════ */
  RL.routes.push({
    id: 'visado_cuenta_propia',
    group: 'visado',
    title: 'Visado de trabajo por cuenta propia (autónomo)',
    short: 'Montar tu propio negocio en España.',
    icon: 'briefcase',
    weight: 22,
    goals: ['trabajar', 'residencia_estable'],
    where: 'consulado',
    availability: 'open',
    legal: 'Arts. 84-88 RD 1155/2024',
    summary: 'Para emprender en España. No hay inversión mínima legal, pero se exige un proyecto con inversión suficiente, plan de negocio, titulación o experiencia y licencias. Es una de las vías con más denegaciones por proyectos poco sólidos.',
    forWho: 'Personas que quieren establecerse como autónomas o crear un negocio en España.',
    requirements: [
      { label: 'Estás fuera de España', test: outside, actionable: false },
      { label: 'Tienes un proyecto con inversión suficiente', test: function (p, d) { return d.savings >= 6000 ? true : null; }, fix: 'Plan de negocio, local, equipamiento y previsión de gastos e ingresos.' },
      { label: 'Acreditas titulación o experiencia', test: function (p, d) { return d.hasDegree || d.experience >= 2 ? true : null; } },
      { label: 'Tienes licencias y colegiación si procede', test: function () { return null; } },
      { label: 'Careces de antecedentes penales', test: clean, actionable: false }
    ],
    blockers: [
      { label: 'Solo se puede solicitar desde el exterior.', test: function (p) { return p.location === 'spain'; } },
      { label: 'No has indicado que vayas a emprender por cuenta propia.', test: function (p) { return p.employment !== 'self' && p.outsideGoal !== 'work'; } },
      { label: 'Es una vía para mayores de edad.', test: function (p, d) { return d.minor; } }
    ],
    docs: [D.pasaporte, D.formulario, D.plan, D.titulo, D.ant, D.medico, D.tasa, D.ex07],
    steps: [
      { title: 'Prepara un plan de negocio realista', detail: 'Cifras, local, licencias, previsión y experiencia. Un plan irrisorio es la causa típica de denegación.', when: 'Mes -6' },
      { title: 'Reúne la inversión y las licencias', detail: 'No hay mínimo legal, pero debe ser suficiente y estar acreditada.', when: 'Mes -4' },
      { title: 'Solicita autorización y visado', detail: 'En Extranjería y consulado. Tasa 790-052 + consular.', when: 'Mes -3' },
      { title: 'Alta en RETA', detail: 'Tras la concesión, alta como autónomo.', when: 'Concesión' }
    ],
    cost: 'Tasa 790-052 + consular + TIE',
    time: 'Resolución orientativa de 3 meses',
    risks: ['Proyecto débil = denegación.', 'No confundir con el visado de emprendedor (ENISA).'],
    links: [L.boe1155, L.exteriores],
    fit: function () { return 'Solo si tienes un proyecto sólido y experiencia. Si no, el emprendedor o el nómada digital pueden encajar mejor.'; }
  });

  /* ══════════════════════════════════════════════════════════
     5. NÓMADA DIGITAL
     ══════════════════════════════════════════════════════════ */
  RL.routes.push({
    id: 'visado_nomada_digital',
    group: 'visado',
    title: 'Visado de nómada digital',
    short: 'Trabajar en remoto desde España: hasta 3 años, incluso si ya estás como turista.',
    icon: 'globe',
    weight: 44,
    goals: ['trabajar', 'residencia_estable', 'regularizar'],
    where: 'both',
    availability: 'open',
    legal: 'Art. 74 bis Ley 14/2013 (Ley 28/2022)',
    summary: 'Para teletrabajadores con ingresos de fuera de España. Exige 200 % del SMI (2.442 €/mes), título o 3 años de experiencia y empresa con al menos 1 año. Es la única vía que un turista puede solicitar sin salir de España, y da hasta 3 años.',
    forWho: 'Personas que trabajan en remoto para empresas o clientes extranjeros.',
    requirements: [
      { label: 'Trabajas en remoto para fuera de España', test: function (p, d) { return d.employment === 'remote'; }, fix: 'Debe ser teletrabajo real, con empresa o clientes fuera de España. Los autónomos no pueden facturar más del 20 % a empresas españolas.' },
      { label: 'Cobras al menos 2.442 €/mes (200 % SMI)', test: function (p, d) { return d.remoteIncome >= 2442; }, fix: 'Se acredita con contrato, nóminas o facturas. +916 €/mes por el primer familiar y +306 € por cada adicional.' },
      { label: 'Al menos el 80 % de tus ingresos vienen de fuera de España', test: function (p, d) { return d.remoteClientsOutside === 'yes' ? true : (d.remoteClientsOutside === 'no' ? false : null); } },
      { label: 'Tienes título o 3 años de experiencia', test: function (p, d) { return d.hasTertiary || d.experience >= 3 ? true : null; } },
      { label: 'Tu empresa lleva al menos 1 año de actividad', test: function () { return null; }, fix: 'Certificado registral de la empresa con al menos 1 año. Si lleva 11 meses, se deniega.' },
      { label: 'Careces de antecedentes penales', test: clean, actionable: false }
    ],
    blockers: [
      { label: 'Los ciudadanos de la UE/EEE no necesitan este visado.', test: function (p, d) { return d.euCitizen; } },
      { label: 'No trabajas en remoto para empresas o clientes de fuera de España.', test: function (p, d) { return d.employment !== 'remote'; } },
      { label: 'Es una vía para mayores de edad.', test: function (p, d) { return d.minor; } }
    ],
    docs: [D.pasaporte, D.formulario, D.certificado_empresa, D.medios, D.seguro, D.ant, D.titulo, D.tasa, D.uge],
    steps: [
      { title: 'Comprueba el umbral de ingresos', detail: '2.442 €/mes para el titular. Suma 916 € por el primer familiar y 306 € por cada uno más.', when: 'Semana 1' },
      { title: 'Reúne el certificado de empresa', detail: 'Antigüedad mínima de 1 año, relación de al menos 3 meses y permiso para teletrabajar desde España.', when: 'Mes -2' },
      { title: 'Solicita en el consulado o en la UGE-CE', detail: 'Si estás fuera, visado (10 días). Si ya estás en España legalmente, incluso como turista, autorización ante la UGE-CE (hasta 3 años).', when: 'Día 0' },
      { title: 'Recoge la TIE', detail: 'Autorización de hasta 3 años, renovable 2.', when: 'Concesión' }
    ],
    cost: 'Tasa 790-038 + consular (si vienes de fuera) + TIE',
    time: 'Visado en 10 días; UGE-CE en 20 días hábiles',
    risks: [
      'No vale trabajar para particulares, universidades, fundaciones u ONG.',
      'La empresa debe llevar 1 año de actividad.',
      'Si estás en España como turista, solo esta vía (y las de la Ley 14/2013) te permite quedarte sin salir.'
    ],
    links: [L.ley14, L.uge, L.exteriores],
    fit: function (p, d) {
      if (d.employment === 'remote') return 'Trabajas en remoto: esta es probablemente tu mejor vía, y puedes solicitarla incluso estando ya en España como turista.';
      return 'Solo si tu trabajo es en remoto para el extranjero y superas 2.442 €/mes.';
    }
  });

  /* ══════════════════════════════════════════════════════════
     6. ALTAMENTE CUALIFICADO (PAC)
     ══════════════════════════════════════════════════════════ */
  RL.routes.push({
    id: 'visado_pac',
    group: 'visado',
    title: 'Profesional altamente cualificado (PAC)',
    short: 'Para titulados con un contrato de alto salario en España.',
    icon: 'briefcase',
    weight: 36,
    goals: ['trabajar', 'residencia_estable'],
    where: 'consulado',
    availability: 'open',
    legal: 'Arts. 71-73 Ley 14/2013',
    summary: 'Para titulados universitarios o de FP superior con un contrato en España de al menos 41.356 € brutos al año (umbral 2026). Se tramita por la UGE-CE en 20 días hábiles y da 3 años de residencia y trabajo, con familia desde el inicio.',
    forWho: 'Profesionales cualificados contratados por una empresa española con salario alto.',
    requirements: [
      { label: 'Tienes título universitario o FP superior, o 5 años de experiencia', test: function (p, d) { return d.hasTertiary || d.experience >= 5 ? true : null; }, fix: 'Título o certificado de experiencia acreditable.' },
      { label: 'Tienes un contrato con una empresa en España', test: function (p, d) { return d.jobOffer === 'yes'; }, fix: 'La empresa presenta la solicitud ante la UGE-CE.' },
      { label: 'El salario alcanza 41.356 € brutos al año', test: function () { return null; }, fix: 'Umbral 2026. Existe un umbral reducido de 33.085 € en dos supuestos, pero su vigencia está en discusión: confírmalo.' },
      { label: 'Careces de antecedentes penales', test: clean, actionable: false }
    ],
    blockers: [
      { label: 'Los ciudadanos de la UE/EEE no necesitan esta autorización.', test: function (p, d) { return d.euCitizen; } },
      { label: 'No tienes título universitario/FP superior ni 5 años de experiencia.', test: function (p, d) { return !(d.hasTertiary || d.experience >= 5); } },
      { label: 'Es una vía para mayores de edad.', test: function (p, d) { return d.minor; } }
    ],
    docs: [D.pasaporte, D.formulario, D.contrato, D.titulo, D.ant, D.tasa, D.uge],
    steps: [
      { title: 'Encuentra la empresa y el contrato', detail: 'El salario debe alcanzar el umbral. La empresa presenta el expediente.', when: 'Mes -4' },
      { title: 'La empresa solicita ante la UGE-CE', detail: 'Resolución en 20 días hábiles.', when: 'Mes -3' },
      { title: 'Visado y entrada', detail: 'Visado en el consulado y TIE al llegar.', when: 'Concesión' }
    ],
    cost: 'Tasa 790-038 + consular + TIE',
    time: '20 días hábiles; autorización de 3 años',
    risks: ['El umbral se mide sobre el bruto anual del contrato.', 'La Tarjeta Azul-UE es una vía distinta.'],
    links: [L.ley14, L.uge],
    fit: function (p, d) { return d.hasTertiary ? 'Con título y una oferta de alto salario, esta vía da 3 años de residencia y trabajo.' : ''; }
  });

  /* ══════════════════════════════════════════════════════════
     7. EMPRENDEDOR
     ══════════════════════════════════════════════════════════ */
  RL.routes.push({
    id: 'visado_emprendedor',
    group: 'visado',
    title: 'Visado de emprendedor',
    short: 'Proyecto innovador con informe favorable de ENISA.',
    icon: 'route',
    weight: 20,
    goals: ['trabajar', 'residencia_estable'],
    where: 'both',
    availability: 'open',
    legal: 'Arts. 68-70 Ley 14/2013',
    summary: 'Para proyectos empresariales innovadores con informe favorable de ENISA. No exige inversión mínima, pero sí un proyecto de interés económico y carácter innovador. Se tramita por la UGE-CE y permite solicitar desde España si estás legalmente.',
    forWho: 'Emprendedores con un proyecto innovador y scalable.',
    requirements: [
      { label: 'Tu proyecto es innovador y tiene interés económico para España', test: function () { return null; }, fix: 'Necesitas el informe favorable de ENISA. Sin él, la vía no arranca.' },
      { label: 'Tienes un plan de negocio y equipo', test: function () { return null; } },
      { label: 'Careces de antecedentes penales', test: clean, actionable: false }
    ],
    blockers: [
      { label: 'Los ciudadanos de la UE/EEE no necesitan esta autorización.', test: function (p, d) { return d.euCitizen; } },
      { label: 'No consta que tengas un proyecto innovador propio.', test: function (p, d) { return d.employment !== 'self'; } },
      { label: 'Es una vía para mayores de edad.', test: function (p, d) { return d.minor; } }
    ],
    docs: [D.pasaporte, D.formulario, D.plan, D.ant, D.tasa, D.uge],
    steps: [
      { title: 'Prepara el proyecto y pide el informe ENISA', detail: 'Innovación, escalabilidad y equipo.', when: 'Mes -6' },
      { title: 'Solicita ante la UGE-CE', detail: 'Resolución en 20 días hábiles.', when: 'Mes -3' },
      { title: 'Visado o entrada', detail: 'Si estás fuera, visado; si estás legal en España, autorización directa.', when: 'Concesión' }
    ],
    cost: 'Tasa 790-038 + consular + TIE',
    time: '20 días hábiles; autorización de 3 años',
    risks: ['Sin informe ENISA no hay vía.', 'No confundir con el autónomo del régimen general.'],
    links: [L.ley14, L.uge],
    fit: function () { return 'Solo si tu proyecto es realmente innovador y obtienes el informe de ENISA.'; }
  });

  /* ══════════════════════════════════════════════════════════
     8. ENTRADA COMO TURISTA (informativa)
     ══════════════════════════════════════════════════════════ */
  RL.routes.push({
    id: 'entrada_turista',
    group: 'visado',
    title: 'Entrar como turista (90 días)',
    short: 'Visitar España sin trabajar: reglas, países exentos y riesgos.',
    icon: 'globe',
    weight: 12,
    goals: [],
    where: 'consulado',
    availability: 'open',
    informational: true,
    legal: 'Reglamento (UE) 2016/399 y 2018/1806',
    summary: 'Con pasaporte de un país exento puedes estar 90 días en cualquier periodo de 180 en el espacio Schengen. No permite trabajar ni residir. Si te quedas más, entras en situación irregular y complicas tu futuro.',
    forWho: 'Personas que quieren visitar España o entrar mientras preparan otra vía.',
    requirements: [
      { label: 'Tu nacionalidad está exenta de visado (o tienes visado Schengen)', test: function (p, d) { if (!d.country) return null; return d.country.visa; }, fix: 'Si necesitas visado, solicítalo en el consulado con antelación.' },
      { label: 'Tienes pasaporte válido', test: function (p) { return p.hasPassport === 'yes'; }, fix: 'Sin pasaporte en vigor no se puede entrar.' },
      { label: 'Puedes acreditar motivo, alojamiento, medios y billete de vuelta', test: function () { return null; }, fix: 'En la frontera pueden pedírtelos. Lleva reservas y seguro.' },
      { label: 'No vas a trabajar', test: function (p) { return p.outsideGoal === 'work' ? false : null; } }
    ],
    blockers: [
      { label: 'Los ciudadanos de la UE/EEE no necesitan visado ni autorización para entrar.', test: function (p, d) { return d.euCitizen; } }
    ],
    docs: [D.pasaporte, D.alojamiento, D.medios, D.seguro],
    steps: [
      { title: 'Comprueba si necesitas visado', detail: 'Cuba, República Dominicana, Haití, Ecuador y Bolivia lo necesitan. La mayoría de países latinoamericanos, no.', when: 'Antes de comprar el vuelo' },
      { title: 'Prepara la entrada', detail: 'Alojamiento, medios, billete de vuelta y seguro. El EES registra tu entrada y salida.', when: 'Antes de viajar' },
      { title: 'No te quedes más de 90 días', detail: 'La sobreestancia es infracción grave (multa 501-10.000 €) y puede llevar prohibición de entrada de hasta 3 años.', when: 'Siempre' }
    ],
    cost: 'Visado consular si aplica (unos 90 €)',
    time: '90 días por cada 180',
    risks: [
      'El EES (operativo desde abril de 2026) calcula automáticamente la sobreestancia.',
      'Salir de Schengen con sobreestancia puede activar la prohibición en la frontera.',
      'El turismo no permite trabajar ni empadronarse como residente.'
    ],
    links: [L.exteriores],
    fit: function (p, d) { return d.country ? (d.country.visa ? 'Tu nacionalidad no necesita visado Schengen para estancias cortas.' : 'Tu nacionalidad necesita visado Schengen incluso para el turismo.') : ''; }
  });

  /* ══════════════════════════════════════════════════════════
     9. GOLDEN VISA (derogada)
     ══════════════════════════════════════════════════════════ */
  RL.routes.push({
    id: 'golden_visa',
    group: 'visado',
    title: 'Golden visa (inversión)',
    short: 'Derogada el 3 de abril de 2025. Ya no existe.',
    icon: 'euro',
    weight: 0,
    goals: [],
    where: 'spain',
    availability: 'closed',
    legal: 'LO 1/2025 (deroga arts. 63-67 Ley 14/2013)',
    deadline: '2025-04-03',
    deadlineNote: 'Derogada con efectos 3 de abril de 2025. Solo se mantienen solicitudes anteriores y autorizaciones ya concedidas.',
    summary: 'La golden visa permitía residir invirtiendo en vivienda, deuda pública, acciones o un proyecto de interés general. La LO 1/2025 la derogó por completo: ya no se puede solicitar ninguna modalidad. Invertir no da residencia por sí solo.',
    forWho: 'Personas que hayan oído hablar de ella y quieran saber si sigue vigente.',
    requirements: [
      { label: 'Presentaste la solicitud antes del 3 de abril de 2025', test: function () { return null; }, fix: 'Solo las solicitudes anteriores siguen su curso; las nuevas se inadmiten.' }
    ],
    blockers: [{ label: 'La golden visa está derogada desde el 3 de abril de 2025.', test: function () { return true; } }],
    docs: [D.pasaporte],
    steps: [
      { title: 'Si tienes una autorización concedida', detail: 'Sigue válida hasta su caducidad y se renueva según la norma del momento de concesión.', when: 'Renovación' },
      { title: 'Si quieres invertir y residir', detail: 'Mira emprendedor, PAC o nómada digital. Invertir no da residencia.', when: 'Ahora' }
    ],
    cost: '—',
    time: 'Cerrada',
    risks: ['Cualquier web que venda golden visa en 2026 está desinformando.'],
    links: [L.ley14, L.uge],
    fit: function () { return ''; }
  });
})();

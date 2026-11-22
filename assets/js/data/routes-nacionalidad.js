/* ============================================================
   Ruta Legal · vías de NACIONALIDAD española
   Base: Código Civil arts. 17-26, Ley 20/2022 (DA 8.ª, cerrada),
   RD 1004/2015 y Orden JUS/1625/2016.
   ============================================================ */
(function () {
  'use strict';
  var RL = window.RL = window.RL || {};
  RL.routes = RL.routes || [];

  var L = {
    cc: { t: 'BOE · Código Civil (arts. 17-26)', u: 'https://www.boe.es/buscar/act.php?id=BOE-A-1889-4763' },
    lmd: { t: 'BOE · Ley 20/2022 de Memoria Democrática', u: 'https://www.boe.es/buscar/act.php?id=BOE-A-2022-17099' },
    instr: { t: 'BOE · Instrucción de 25/10/2022 (Ley de Nietos)', u: 'https://www.boe.es/diario_boe/txt.php?id=BOE-A-2022-17470' },
    mj: { t: 'Ministerio de Justicia · Nacionalidad', u: 'https://www.mjusticia.gob.es/es/ciudadania/nacionalidad/informacion-nacionalidad' },
    rc: { t: 'Registro Civil · cita y trámites', u: 'https://sede.mjusticia.gob.es/es/tramites/cita-previa-registro-civil' },
    cerv: { t: 'Instituto Cervantes · DELE y CCSE', u: 'https://cervantes.org/es/examenes' }
  };

  var D = {
    nac_ext: { id: 'nac_nac_ext', name: 'Certificación literal de nacimiento (apostillada y traducida)', where: 'Registro civil de tu país' },
    nac_es: { id: 'nac_nac_es', name: 'Certificación literal de nacimiento española del progenitor o abuelo', where: 'Registro Civil español' },
    matrimonio: { id: 'nac_matrimonio', name: 'Certificado de matrimonio de tus padres', where: 'Registro civil correspondiente' },
    pasaporte: { id: 'nac_pasaporte', name: 'Pasaporte de tu país (no español), completo (actual y anterior)', where: 'Tu país' },
    tie: { id: 'nac_tie', name: 'TIE o tarjeta de residencia', where: 'Extranjería' },
    ant: { id: 'nac_ant', name: 'Certificado de antecedentes penales', where: 'País de origen y España', note: 'Apostillado y traducido. Caduca a los 3-6 meses.' },
    padron: { id: 'nac_padron', name: 'Certificado de empadronamiento', where: 'Ayuntamiento' },
    examenes: { id: 'nac_examenes', name: 'CCSE aprobado (y DELE A2 solo si no eres hispanohablante)', where: 'Instituto Cervantes', note: 'CCSE 85 € obligatorio. DELE A2 138 € solo para quienes no tienen el español como lengua materna. Deben estar aprobados antes de solicitar.' },
    tasa: { id: 'nac_tasa', name: 'Tasa 790-026 (104,05 €)', where: 'Sede del Ministerio de Justicia', note: 'Se paga antes y no se devuelve.' },
    jura: { id: 'nac_jura', name: 'Jura o promesa e inscripción', where: 'Registro Civil', note: 'Tras la concesión: 180 días para jurar o caduca.' }
  };

  function outsideOrAnywhere() { return true; }

  /* meses de residencia legal que cuentan para nacionalidad (la estancia por estudios NO cuenta) */
  function legalMonths(p, d) {
    if (p.permitStatus === 'longterm') return 60;
    if (p.permitStatus === 'studies') return 0;
    if (d.asylumGranted) return d.monthsResident;
    if (p.permitStatus === 'asylum') return 0;
    if (d.monthsResident != null) return d.monthsResident;
    if (d.hasPermit) return null;
    return 0;
  }
  function residenceAtLeast(need) {
    return function (p, d) {
      var m = legalMonths(p, d);
      return m == null ? null : m >= need;
    };
  }
  function residenceFix(need) {
    return function (p, d) {
      if (p.permitStatus === 'studies') return 'El tiempo como estudiante no cuenta como residencia para la nacionalidad: necesitas una autorización de residencia (trabajo, familiar, etc.).';
      if (!d.hasPermit && d.residenceApproved !== 'yes') return 'Necesitas primero una residencia legal. Mira las vías para regularizarte o venir con visado.';
      var m = legalMonths(p, d);
      if (m == null) return 'Indica desde cuándo tienes la residencia legal para calcular cuánto te falta.';
      if (m <= 0) return 'El tiempo como turista o solicitante de asilo no cuenta. El plazo empieza con la residencia legal.';
      return 'Te faltan ' + RL.fmt.duration(need - m) + ' de residencia legal.';
    };
  }
  function examsOK(p, d) {
    if (d.examsOK) return true;
    if (d.exams === 'none') return false;
    return null;
  }
  function examsResidenceOK(p, d) {
    if (d.exams === 'both') return true;
    if (languageExempt(p, d) && d.exams === 'ccse') return true;
    if (d.exams === 'none' || d.exams === 'dele' || d.exams === 'not_needed') return false;
    return null;
  }
  function languageExempt(p, d) {
    return d.spanishNative || (d.country && ['AR', 'BO', 'CL', 'CO', 'CR', 'CU', 'EC', 'SV', 'GT', 'GQ', 'HN', 'MX', 'NI', 'PA', 'PY', 'PE', 'PR', 'DO', 'UY', 'VE'].indexOf(d.country.c) !== -1);
  }

  /* ══════════════════════════════════════════════════════════
     1. ORIGEN (art. 17 CC)
     ══════════════════════════════════════════════════════════ */
  RL.routes.push({
    id: 'nac_origen',
    group: 'nacionalidad',
    title: 'Nacionalidad de origen (hijo/a de español)',
    short: 'Si tu padre o madre era español cuando naciste, ya eres español de origen.',
    icon: 'shield',
    weight: 52,
    goals: ['nacionalidad', 'residencia_estable'],
    where: 'both',
    availability: 'open',
    legal: 'Art. 17.1.a) CC',
    summary: 'Si al nacer tu padre o madre era español, eres español de origen aunque hayas nacido fuera y nunca te hayan inscrito. No es una solicitud con plazo: es inscribir tu nacimiento en el Registro Civil. Después puedes pedir DNI y pasaporte.',
    forWho: 'Hijos e hijas de españoles de origen, con independencia de la edad y del país de nacimiento.',
    requirements: [
      { label: 'Tu padre o madre era español/a de origen cuando naciste', test: function (p, d) { if (d.spanishParent && d.ancestorOriginario) return true; if (d.spanishParent && d.ancestorNaturalized) return false; return null; }, fix: 'Si tu progenitor obtuvo la nacionalidad después de tu nacimiento, no eres español de origen: mira la opción o la residencia.', actionable: false },
      { label: 'Existe constancia de la filiación', test: function (p) { return p.ancestry === 'parent' || p.ancestry === 'both' ? true : null; }, fix: 'Certificado de nacimiento tuyo y de tu progenitor, y matrimonio de tus padres si aplica.' },
      { label: 'Tienes la partida de nacimiento española del progenitor', test: function (p, d) { if (d.ancestryDocsOK) return true; if (p.ancestryDocs === 'none') return false; return null; }, fix: 'Si no la tienes, el Registro Civil puede localizarla con datos de nombre, fecha y municipio.' },
      { label: 'No has perdido la nacionalidad por no declarar conservarla (art. 24.3)', test: function (p, d) { if (!d.bornInSpain && d.spanishParent) return null; return true; }, fix: 'Si naciste y resides fuera siendo hijo de españoles también nacidos fuera, debes declarar que quieres conservarla en los 3 años siguientes a tu mayoría de edad.' }
    ],
    blockers: [
      { label: 'No tienes padre ni madre español/a.', test: function (p, d) { return !d.spanishParent; } },
      { label: 'Es una vía para mayores de edad (los menores la tramitan sus representantes).', test: function (p, d) { return d.minor; } }
    ],
    docs: [D.nac_ext, D.nac_es, D.matrimonio, D.pasaporte, D.jura],
    steps: [
      { title: 'Localiza la inscripción española del progenitor', detail: 'Pide una certificación literal en el Registro Civil del municipio donde nació, o en el consulado.', when: 'Semana 1-4' },
      { title: 'Pide cita en el Registro Civil', detail: 'En España, en el Registro Civil de tu domicilio; en el extranjero, en el consulado. La inscripción no tiene tasa.', when: 'Semana 2-8' },
      { title: 'Aporta la documentación', detail: 'Tu nacimiento apostillado y traducido, el de tu progenitor y la prueba de filiación.', when: 'Cita' },
      { title: 'Inscripción y documentación', detail: 'Se inscribe tu nacimiento como español. Después, DNI y pasaporte.', when: '+1 a 6 meses' }
    ],
    cost: 'Gratuito (inscripción); pasaporte aparte',
    time: 'Sin plazo legal de resolución; en la práctica, semanas o meses según el Registro',
    risks: [
      'Si tu progenitor se nacionalizó después de tu nacimiento, no es esta vía.',
      'El art. 24.3 puede hacerte perder la nacionalidad si no la conservas expresamente.',
      'Inscribir el nacimiento no equivale a tener pasaporte: hay que pedirlo después.'
    ],
    links: [L.cc, L.mj, L.rc],
    fit: function (p, d) {
      if (d.spanishParent && d.ancestorOriginario) return 'Tu progenitor era español de origen: probablemente ya eres español y solo falta inscribirlo. Es la vía más rápida y sin plazo.';
      return 'Solo si tu padre o madre era español/a de origen al nacer tú.';
    }
  });

  /* ══════════════════════════════════════════════════════════
     2. OPCIÓN (art. 20 CC), incluido el 20.1.b sin límite de edad
     ══════════════════════════════════════════════════════════ */
  RL.routes.push({
    id: 'nac_opcion',
    group: 'nacionalidad',
    title: 'Nacionalidad por opción',
    short: 'Para hijos de españoles y casos de patria potestad o filiación tardía.',
    icon: 'doc',
    weight: 46,
    goals: ['nacionalidad'],
    where: 'both',
    availability: 'open',
    legal: 'Art. 20 CC',
    summary: 'La opción es un acto voluntario para hijos de españoles que no son de origen, para quienes estuvieron bajo patria potestad de un español y para filiaciones determinadas después de los 18. El supuesto del art. 20.1.b) (progenitor originariamente español y nacido en España) no tiene límite de edad.',
    forWho: 'Hijos de españoles que no son de origen, personas que estuvieron sujetas a patria potestad de un español y casos de filiación tardía.',
    requirements: [
      { label: 'Tienes padre o madre español/a', test: function (p, d) { return d.spanishParent; }, actionable: false },
      { label: 'Estás dentro de plazo o tu progenitor era originario y nació en España', test: function (p, d) {
        if (d.ancestorOriginario && d.ancestorBornSpain === true) return true;
        if (d.age == null) return null;
        return d.age <= 20;
      }, fix: 'La opción general caduca a los 20 años (2 desde la mayoría de edad). El supuesto del art. 20.1.b (progenitor originariamente español y nacido en España) no tiene límite de edad.' },
      { label: 'Tienes la documentación del progenitor', test: function (p, d) { if (d.ancestryDocsOK) return true; if (p.ancestryDocs === 'none') return false; return null; }, fix: 'Certificación literal española del progenitor y tu nacimiento apostillado.' }
    ],
    blockers: [
      { label: 'No tienes vínculo con un progenitor español.', test: function (p, d) { return !d.spanishParent; } },
      { label: 'Es una vía para mayores de edad.', test: function (p, d) { return d.minor; } }
    ],
    docs: [D.nac_ext, D.nac_es, D.matrimonio, D.pasaporte, D.jura],
    steps: [
      { title: 'Comprueba el supuesto', detail: '¿Tu progenitor era español de origen y nació en España? ¿O solo estuviste bajo su patria potestad?', when: 'Semana 1' },
      { title: 'Pide cita en el Registro Civil', detail: 'Consular si vives fuera; en España, en tu domicilio. Sin tasa registral.', when: 'Semana 2-8' },
      { title: 'Formaliza la opción', detail: 'Se levanta acta, juras o prometes y se inscribe. Después, DNI y pasaporte.', when: 'Cita' }
    ],
    cost: 'Gratuito (inscripción)',
    time: 'Semanas o meses según el Registro',
    risks: [
      'El supuesto 20.1.b exige progenitor originariamente español Y nacido en España: si nació en el extranjero, no encaja.',
      'La opción general caduca a los 20 años.'
    ],
    links: [L.cc, L.mj, L.rc],
    fit: function (p, d) {
      if (d.spanishParent && d.ancestorOriginario && d.ancestorBornSpain === true) return 'Tu progenitor era español de origen y nació en España: puedes optar sin límite de edad (art. 20.1.b).';
      return 'Solo si tu progenitor es español y no eras español de origen al nacer.';
    }
  });

  /* ══════════════════════════════════════════════════════════
     3. ART. 22.2.f — 1 AÑO DE RESIDENCIA PARA DESCENDIENTES
     ══════════════════════════════════════════════════════════ */
  RL.routes.push({
    id: 'nac_22_2f',
    group: 'nacionalidad',
    title: 'Nacionalidad con 1 año de residencia (descendientes)',
    short: 'La vía viva para nietos: 1 año de residencia legal.',
    icon: 'clock',
    weight: 48,
    goals: ['nacionalidad', 'residencia_estable'],
    where: 'spain',
    availability: 'open',
    legal: 'Art. 22.2.f) CC',
    summary: 'Si naciste fuera de España y tu padre, madre, abuelo o abuela fue originariamente español, basta con 1 año de residencia legal en España para pedir la nacionalidad. Es la alternativa real para los nietos que se quedaron fuera de la Ley de Nietos.',
    forWho: 'Descendientes de españoles de origen (hijos o nietos) que puedan obtener 1 año de residencia legal en España.',
    requirements: [
      { label: 'Naciste fuera de España', test: function (p, d) { return d.bornInSpain ? false : true; }, actionable: false },
      { label: 'Tu padre, madre, abuelo o abuela fue originariamente español', test: function (p, d) {
        if (!(d.spanishParent || d.spanishGrandparent)) return false;
        if (d.ancestorOriginario) return true;
        if (d.ancestorNaturalized) return false;
        return null;
      }, fix: 'Necesitas acreditar que el antepasado era español de origen (no nacionalizado después).' },
      { label: 'Llevas al menos 1 año de residencia legal', test: residenceAtLeast(12), fix: residenceFix(12) },
      { label: 'Tienes buena conducta cívica y antecedentes limpios', test: function (p, d) { if (d.criminalSpain === 'no' && d.criminalOrigin === 'no') return true; if (d.criminalSpain === 'yes' || d.criminalOrigin === 'yes') return false; return null; }, actionable: false },
      { label: 'Acreditas integración (los exámenes, si te aplican)', test: examsResidenceOK, fix: 'Necesitas el CCSE y, si no eres hispanohablante nativo, el DELE A2. Deben estar aprobados antes de solicitar.' }
    ],
    blockers: [
      { label: 'No tienes ascendencia española de origen.', test: function (p, d) { return !(d.spanishParent || d.spanishGrandparent); } },
      { label: 'El tiempo como solicitante de asilo no cuenta como residencia para la nacionalidad; espera a la resolución.', test: function (p, d) { return d.asylumInProcess || d.asylumSoon; } },
      { label: 'Es una vía para mayores de edad.', test: function (p, d) { return d.minor; } }
    ],
    docs: [D.nac_ext, D.nac_es, D.matrimonio, D.tie, D.pasaporte, D.ant, D.padron, D.examenes, D.tasa, D.jura],
    steps: [
      { title: 'Consigue 1 año de residencia legal', detail: 'Con una autorización de residencia (trabajo, familiar, etc.). La estancia por estudios no computa como residencia.', when: 'Año 0' },
      { title: 'Reúne la prueba de la ascendencia', detail: 'Partidas de nacimiento del antepasado, del progenitor intermedio y tuyas, con apostilla y traducción.', when: 'Mes 10' },
      { title: 'Aprueba el CCSE (y el DELE si procede)', detail: 'CCSE 85 €; DELE A2 138 €. Los hispanohablantes nativos están exentos del DELE, no del CCSE.', when: 'Mes 10-12' },
      { title: 'Presenta la solicitud y paga la tasa', detail: 'Tasa 790-026 (104,05 €). Se presenta en el Registro Civil o por sede electrónica.', when: 'Mes 12' }
    ],
    cost: '104,05 € + 85 € CCSE (+138 € DELE si aplica)',
    time: 'Resolución legal en 1 año; en la práctica, 7 meses a 2 años',
    risks: [
      'El año debe ser de residencia legal, no de estancia por estudios.',
      'Debes acreditar la cadena de filiación; sin partidas, se complica.',
      'La concesión caduca si no juras en 180 días.'
    ],
    links: [L.cc, L.mj, L.cerv],
    fit: function (p, d) {
      if (d.spanishGrandparent && d.ancestorOriginario) return 'Eres nieto/a de español de origen: con 1 año de residencia legal puedes pedir la nacionalidad. Es la vía que sustituye a la Ley de Nietos.';
      if (d.spanishParent && d.ancestorOriginario) return 'Con 1 año de residencia legal puedes pedir la nacionalidad, aunque probablemente ya seas español de origen (mira la vía de origen).';
      return '';
    }
  });

  /* ══════════════════════════════════════════════════════════
     4. RESIDENCIA 2 AÑOS (iberoamericanos, etc.)
     ══════════════════════════════════════════════════════════ */
  RL.routes.push({
    id: 'nac_residencia_2',
    group: 'nacionalidad',
    title: 'Nacionalidad con 2 años de residencia',
    short: 'Para iberoamericanos, Portugal, Andorra, Filipinas y Guinea Ecuatorial.',
    icon: 'globe',
    weight: 42,
    goals: ['nacionalidad'],
    where: 'spain',
    availability: 'open',
    legal: 'Art. 22.1 CC',
    summary: 'Los nacionales de países iberoamericanos, Andorra, Filipinas, Guinea Ecuatorial, Portugal y los sefardíes pueden pedir la nacionalidad con solo 2 años de residencia legal, continuada e inmediatamente anterior.',
    forWho: 'Nacionales de países iberoamericanos y los otros supuestos del art. 22.1.',
    requirements: [
      { label: 'Eres nacional de un país iberoamericano, Andorra, Filipinas, Guinea Ecuatorial o Portugal', test: function (p, d) { return d.ibero; }, actionable: false },
      { label: 'Llevas 2 años de residencia legal, continuada e inmediatamente anterior', test: residenceAtLeast(24), fix: residenceFix(24) },
      { label: 'Tienes buena conducta cívica y antecedentes limpios', test: function (p, d) { if (d.criminalSpain === 'no' && d.criminalOrigin === 'no') return true; if (d.criminalSpain === 'yes' || d.criminalOrigin === 'yes') return false; return null; }, actionable: false },
      { label: 'Acreditas integración (CCSE aprobado; DELE A2 solo si no eres hispanohablante)', test: examsResidenceOK, fix: 'El CCSE es obligatorio. Los nacionales de países hispanohablantes están exentos del DELE A2, pero no del CCSE.' }
    ],
    blockers: [
      { label: 'Tu nacionalidad no está en el supuesto de 2 años: el plazo general es de 10.', test: function (p, d) { return p.nationality && !d.ibero; } },
      { label: 'Solo se puede solicitar desde España, con residencia legal.', test: function (p, d) { return d.outside; } },
      { label: 'No tienes residencia legal: el tiempo como turista o solicitante de asilo no cuenta para la nacionalidad.', test: function (p, d) { return legalMonths(p, d) === 0 && !d.hasPermit && d.residenceApproved !== 'yes'; } },
      { label: 'El tiempo como solicitante de asilo no cuenta como residencia para la nacionalidad; espera a la resolución.', test: function (p, d) { return d.asylumInProcess || d.asylumSoon; } },
      { label: 'Es una vía para mayores de edad.', test: function (p, d) { return d.minor; } }
    ],
    docs: [D.nac_ext, D.tie, D.pasaporte, D.ant, D.padron, D.examenes, D.tasa, D.jura],
    steps: [
      { title: 'Comprueba tus 2 años de residencia', detail: 'Residencia legal, no estancia por estudios. Revisa tus tarjetas y ausencias.', when: 'Mes -3' },
      { title: 'Prepara los exámenes', detail: 'CCSE (85 €) y DELE A2 solo si no eres hispanohablante nativo.', when: 'Mes -6' },
      { title: 'Presenta la solicitud', detail: 'Tasa 790-026 (104,05 €), antecedentes y partida de nacimiento apostillada.', when: 'Mes 24' },
      { title: 'Jura e inscríbete', detail: 'Cuando te concedan, tienes 180 días para jurar o prometer.', when: '+1 año' }
    ],
    cost: '104,05 € + 85 € CCSE',
    time: 'Resolución legal en 1 año; en la práctica, 7 meses a 2 años',
    risks: [
      'La estancia por estudios no cuenta como residencia.',
      'El tiempo como turista o solicitante de asilo no cuenta: el plazo empieza con la residencia legal.',
      'Las ausencias largas rompen la continuidad.',
      'El CCSE no se exime por nacionalidad; el DELE A2 sí para hispanohablantes.'
    ],
    links: [L.cc, L.mj, L.cerv],
    fit: function (p, d) {
      if (!d.ibero) return '';
      var m = legalMonths(p, d);
      if (m == null) return 'Por tu nacionalidad el plazo es de 2 años, pero falta la fecha desde la que tienes residencia legal. El tiempo como turista o solicitante de asilo no cuenta.';
      if (m < 24) return 'Por tu nacionalidad el plazo es de 2 años, pero aún no los cumples: te faltan ' + RL.fmt.duration(24 - m) + ' desde tu residencia legal. El tiempo como turista o solicitante de asilo no cuenta.';
      return 'Por tu nacionalidad, el plazo se reduce a 2 años de residencia legal. Ya cumples el tiempo; revisa CCSE y documentación.';
    }
  });

  /* ══════════════════════════════════════════════════════════
     5. RESIDENCIA 1 AÑO (supuestos especiales)
     ══════════════════════════════════════════════════════════ */
  RL.routes.push({
    id: 'nac_residencia_1',
    group: 'nacionalidad',
    title: 'Nacionalidad con 1 año de residencia (supuestos especiales)',
    short: 'Nacido en España, casado con español, viudo/a o tutela.',
    icon: 'family',
    weight: 38,
    goals: ['nacionalidad'],
    where: 'spain',
    availability: 'open',
    legal: 'Art. 22.2 CC',
    summary: 'Hay supuestos en los que basta 1 año de residencia legal: haber nacido en España, estar casado con un español un año sin separación, ser viudo/a de español, haber estado en tutela o acogimiento español dos años, o no haber ejercido la opción a tiempo.',
    forWho: 'Personas que encajan en alguno de los supuestos del art. 22.2 CC.',
    requirements: [
      { label: 'Encajas en un supuesto de 1 año', test: function (p, d) { if (d.bornInSpain) return true; if (d.hasSpanishSpouse && p.maritalStatus === 'casado') return null; if (p.maritalStatus === 'viudo') return null; return null; }, fix: 'Nacido en España, casado con español/a un año, viudo/a de español/a, tutela o acogimiento español durante 2 años, u opción no ejercida.' },
      { label: 'Llevas 1 año de residencia legal', test: residenceAtLeast(12), fix: residenceFix(12) },
      { label: 'Tienes buena conducta y antecedentes limpios', test: function (p, d) { if (d.criminalSpain === 'no' && d.criminalOrigin === 'no') return true; if (d.criminalSpain === 'yes' || d.criminalOrigin === 'yes') return false; return null; }, actionable: false },
      { label: 'Acreditas integración (CCSE y DELE si procede)', test: examsResidenceOK, fix: 'CCSE obligatorio; DELE A2 según tu lengua materna.' }
    ],
    blockers: [
      { label: 'No encajas en ninguno de los supuestos de 1 año.', test: function (p, d) { return !d.bornInSpain && !d.hasSpanishSpouse && p.maritalStatus !== 'viudo'; } },
      { label: 'Solo se puede solicitar desde España, con residencia legal.', test: function (p, d) { return d.outside; } },
      { label: 'El tiempo como solicitante de asilo no cuenta como residencia para la nacionalidad; espera a la resolución.', test: function (p, d) { return d.asylumInProcess || d.asylumSoon; } },
      { label: 'Es una vía para mayores de edad.', test: function (p, d) { return d.minor; } }
    ],
    docs: [D.nac_ext, D.tie, D.pasaporte, D.ant, D.padron, D.examenes, D.tasa, D.jura, D.matrimonio],
    steps: [
      { title: 'Identifica tu supuesto', detail: 'Nacimiento en España, matrimonio con español, viudedad o tutela.', when: 'Semana 1' },
      { title: 'Reúne la prueba', detail: 'Certificado de nacimiento español, matrimonio, defunción o resolución de tutela.', when: 'Mes -2' },
      { title: 'Presenta la solicitud', detail: 'Tasa 104,05 €. Resolución legal en 1 año.', when: 'Día 0' }
    ],
    cost: '104,05 € + 85 € CCSE',
    time: 'Resolución legal en 1 año',
    risks: [
      'El matrimonio debe llevar 1 año y no haber separación legal o de hecho.',
      'La residencia debe ser legal, no estancia por estudios.'
    ],
    links: [L.cc, L.mj],
    fit: function (p, d) { return d.bornInSpain ? 'Naciste en España: con 1 año de residencia legal puedes pedir la nacionalidad.' : ''; }
  });

  /* ══════════════════════════════════════════════════════════
     6. RESIDENCIA 10 AÑOS (general)
     ══════════════════════════════════════════════════════════ */
  RL.routes.push({
    id: 'nac_residencia_10',
    group: 'nacionalidad',
    title: 'Nacionalidad con 10 años de residencia',
    short: 'El plazo general para quien no tiene otro supuesto.',
    icon: 'cal',
    weight: 24,
    goals: ['nacionalidad'],
    where: 'spain',
    availability: 'open',
    legal: 'Art. 22.1 CC',
    summary: 'La regla general son 10 años de residencia legal, continuada e inmediatamente anterior. Para refugiados son 5 años. Es la vía más larga, pero la única para muchas personas.',
    forWho: 'Residentes legales que no pueden acogerse a un plazo reducido.',
    requirements: [
      { label: 'Llevas 10 años de residencia legal (5 si eres refugiado)', test: function (p, d) { if (d.asylumInProcess && !d.asylumGranted) return false; return legalMonths(p, d) >= (d.asylumGranted ? 60 : 120); }, actionable: false, fix: function (p, d) { return 'Te faltan ' + RL.fmt.duration(Math.max(0, (d.asylumGranted ? 60 : 120) - (legalMonths(p, d) || 0))) + ' de residencia legal.'; } },
      { label: 'Tienes buena conducta y antecedentes limpios', test: function (p, d) { if (d.criminalSpain === 'no' && d.criminalOrigin === 'no') return true; if (d.criminalSpain === 'yes' || d.criminalOrigin === 'yes') return false; return null; }, actionable: false },
      { label: 'Acreditas integración (CCSE y DELE si procede)', test: examsResidenceOK, fix: 'CCSE obligatorio; DELE A2 según tu lengua materna.' }
    ],
    blockers: [
      { label: 'Solo se puede solicitar desde España, con residencia legal.', test: function (p, d) { return d.outside; } },
      { label: 'El tiempo como solicitante de asilo no cuenta como residencia para la nacionalidad; espera a la resolución.', test: function (p, d) { return d.asylumInProcess || d.asylumSoon; } },
      { label: 'Es una vía para mayores de edad.', test: function (p, d) { return d.minor; } }
    ],
    docs: [D.nac_ext, D.tie, D.pasaporte, D.ant, D.padron, D.examenes, D.tasa, D.jura],
    steps: [
      { title: 'Comprueba tus años de residencia', detail: 'Solo cuenta la residencia legal; la estancia por estudios no computa.', when: 'Mes -3' },
      { title: 'Prepara los exámenes', detail: 'CCSE y, si procede, DELE A2.', when: 'Mes -6' },
      { title: 'Presenta la solicitud', detail: 'Tasa 104,05 €, antecedentes y documentación.', when: 'Año 10' }
    ],
    cost: '104,05 € + 85 € CCSE',
    time: 'Resolución legal en 1 año',
    risks: ['Es la vía más lenta.', 'La estancia por estudios no cuenta como residencia.'],
    links: [L.cc, L.mj],
    fit: function () { return 'Solo si no tienes un plazo reducido por nacionalidad, ascendencia o matrimonio.'; }
  });

  /* ══════════════════════════════════════════════════════════
     7. LEY DE NIETOS (cerrada)
     ══════════════════════════════════════════════════════════ */
  RL.routes.push({
    id: 'nac_ley_nietos',
    group: 'nacionalidad',
    title: 'Ley de Nietos (Ley 20/2022)',
    short: 'Cerrada el 22 de octubre de 2025. Solo si pediste cita a tiempo.',
    icon: 'doc',
    weight: 0,
    goals: ['nacionalidad'],
    where: 'both',
    availability: 'closed',
    legal: 'DA 8.ª Ley 20/2022',
    deadline: '2025-10-22',
    deadlineNote: 'El plazo terminó el 22 de octubre de 2025. Solo pueden formalizar quienes pidieron cita antes de esa fecha y conservan el justificante.',
    summary: 'La «Ley de Nietos» permitió a hijos y nietos de españoles de origen optar por la nacionalidad entre 2022 y 2025. El plazo terminó el 22 de octubre de 2025 y no se ha reabierto. Si pediste cita antes de esa fecha, aún puedes formalizarla; si no, tu vía es el art. 22.2.f (1 año de residencia) o el art. 17 si tu progenitor era español al nacer.',
    forWho: 'Personas que ya presentaron o pidieron cita dentro de plazo. Para el resto, es informativa.',
    requirements: [
      { label: 'Eres hijo/a o nieto/a de español de origen (o de quien perdió la nacionalidad por exilio o matrimonio)', test: function (p, d) { return d.spanishParent || d.spanishGrandparent || false; }, actionable: false },
      { label: 'Pediste cita antes del 22 de octubre de 2025', test: function () { return null; }, fix: 'Solo vale la cita previa solicitada dentro de plazo con justificante. Una solicitud sin cita no se admite.' }
    ],
    blockers: [{ label: 'El plazo está cerrado desde el 23 de octubre de 2025.', test: function () { return true; } }],
    docs: [D.nac_ext, D.nac_es, D.matrimonio, D.pasaporte],
    steps: [
      { title: 'Si tienes cita previa al cierre, formaliza', detail: 'Acude con toda la documentación apostillada y traducida. El consulado donde pediste la cita es el competente.', when: 'Cuanto antes' },
      { title: 'Si no la tienes, cambia de vía', detail: 'Art. 22.2.f (1 año de residencia) o art. 17 (origen) según tu caso.', when: 'Ahora' }
    ],
    cost: 'Sin tasa registral; certificaciones y traducciones aparte',
    time: 'Cerrada',
    risks: [
      'No existe una «Ley de Nietos 2» ni una ampliación aprobada.',
      'Cuidado con quien venda una reapertura: no hay norma publicada.'
    ],
    links: [L.lmd, L.instr, L.mj],
    fit: function () { return ''; }
  });

  /* ══════════════════════════════════════════════════════════
     8. CARTA DE NATURALEZA (residual)
     ══════════════════════════════════════════════════════════ */
  RL.routes.push({
    id: 'nac_carta',
    group: 'nacionalidad',
    title: 'Carta de naturaleza',
    short: 'Concesión discrecional y excepcional del Gobierno.',
    icon: 'shield',
    weight: 10,
    goals: ['nacionalidad'],
    where: 'spain',
    availability: 'open',
    informational: true,
    legal: 'Art. 21.1 CC',
    summary: 'Es una concesión discrecional del Consejo de Ministros por circunstancias excepcionales (interés nacional, deporte, ciencia, cultura o razones humanitarias). No hay derecho subjetivo ni plazo reglado: la mayoría de solicitudes se deniegan.',
    forWho: 'Personas con méritos excepcionales o situaciones humanitarias muy singulares.',
    requirements: [
      { label: 'Concurren circunstancias excepcionales', test: function () { return null; }, fix: 'Méritos deportivos, científicos, culturales o razones humanitarias acreditadas.' },
      { label: 'Tienes arraigo y medios en España', test: function (p, d) { return d.monthsInSpain != null && d.monthsInSpain >= 24 ? true : null; } }
    ],
    blockers: [{ label: 'Es una vía residual: no hay derecho a obtenerla.', test: function () { return false; } }],
    docs: [D.pasaporte, D.nac_ext, D.ant, D.padron],
    steps: [
      { title: 'Valora si tu caso es realmente excepcional', detail: 'La carta de naturaleza no sustituye a las vías ordinarias.', when: 'Antes de empezar' },
      { title: 'Presenta la solicitud', detail: 'Se tramita ante el Ministerio de Justicia y decide el Consejo de Ministros.', when: 'Día 0' }
    ],
    cost: 'Variable',
    time: 'Sin plazo; años',
    risks: ['Es discrecional y excepcional.', 'No se debe usar como plan principal.'],
    links: [L.cc, L.mj],
    fit: function () { return ''; }
  });
})();

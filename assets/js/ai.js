/* ============================================================
   Ruta Legal · consulta abierta a una IA
   Genera un prompt con el caso, el diagnóstico y las reglas.
   No envía nada: copia/abre DeepSeek y el usuario decide.
   ============================================================ */
(function () {
  'use strict';
  var RL = window.RL = window.RL || {};

  var ENTRY = {
    tourist_visa: 'Turista con visado', tourist_free: 'Turista exento de visado',
    student: 'Estudios', work: 'Trabajo', family: 'Familiar', asylum: 'Asilo',
    irregular: 'Entrada irregular o sin visado', dontknow: 'No lo sé'
  };
  var PERMIT = {
    none: 'Ninguno', studies: 'Estudios', work: 'Trabajo', family: 'Familiar de español',
    eu_family: 'Familiar de la UE', longterm: 'Larga duración', asylum: 'Asilo',
    expired: 'Caducado', dontknow: 'No lo sé'
  };
  var DOCS = {
    pasaporte: 'Pasaporte de tu país (no español)', nie: 'NIE', tie: 'TIE', tarjeta_ue: 'Tarjeta UE',
    cita_huellas: 'Cita de huellas TIE', tie_en_tramite: 'TIE en tramitación',
    cita_retirar_tie: 'Cita para retirar TIE', renovacion_tarjeta_roja: 'Renovación de tarjeta roja',
    homologacion_titulo: 'Homologación/validación de título', tie_renovada: 'TIE renovada',
    tarjeta_roja_renovada: 'Tarjeta roja renovada', titulo_homologado: 'Título homologado/validado',
    certificado_digital: 'Certificado digital', cuenta_bancaria: 'Cuenta bancaria',
    seguridad_social: 'Nº Seguridad Social', vida_laboral: 'Vida laboral',
    tarjeta_sanitaria: 'Tarjeta sanitaria', contrato_alquiler: 'Contrato de alquiler',
    nominas: 'Nóminas o contrato', cita_asilo: 'Cita de asilo', hoja_blanca: 'Hoja blanca',
    tarjeta_roja: 'Tarjeta roja', resguardo_nacionalidad: 'Resguardo de nacionalidad',
    resguardo_extranjeria: 'Resguardo de extranjería', autorizacion_regreso: 'Autorización de regreso',
    antecedentes: 'Antecedentes penales', libro_familia: 'Libro de familia',
    demandante_empleo: 'Demandante de empleo', discapacidad: 'Certificado de discapacidad',
    otro: 'Otro'
  };
  var GOALS = {
    regularizar: 'Regularizarme', residencia_estable: 'Residencia estable',
    trabajar: 'Trabajar', estudiar: 'Estudiar', nacionalidad: 'Nacionalidad',
    familia: 'Familia', no_lo_se: 'No lo tengo claro'
  };
  var MARITAL = {
    soltero: 'Soltero/a sin pareja', casado: 'Casado/a', pareja_registrada: 'Pareja de hecho registrada',
    pareja_estable: 'Pareja estable o concubinato sin registrar', divorciado: 'Separado/a o divorciado/a',
    viudo: 'Viudo/a', dontknow: 'No lo sé'
  };
  var MARRIAGE = {
    civil: 'matrimonio civil', religious: 'matrimonio religioso sin inscripción civil',
    both: 'matrimonio civil y religioso', dontknow: 'tipo de matrimonio no indicado'
  };
  var SPANISH_CHILD = {
    common: 'hijo común', own: 'hijo solo del solicitante',
    partner: 'hijo solo de la pareja', mixed: 'varios casos', dontknow: 'vínculo no confirmado'
  };

  function list(arr, map) {
    return (arr || []).map(function (x) { return map[x] || x; }).join(', ');
  }

  function profileBlock(p, d, opts) {
    var l = [];
    l.push('- Nacionalidad: ' + RL.countryName(p.nationality));
    if (p.age) l.push('- Edad: ' + p.age + ' años');
    if (p.location === 'spain') {
      l.push('- Dónde está: España' + (opts.includeLocation && (p.province || p.municipality)
        ? ' (' + [p.municipality, p.province].filter(Boolean).join(', ') + ')' : ''));
    } else if (p.location === 'origin') {
      l.push('- Dónde está: en su país de origen');
    } else {
      l.push('- Dónde está: en otro país');
    }
    if (p.entryMode) l.push('- Cómo entró: ' + (ENTRY[p.entryMode] || p.entryMode));
    if (d.monthsInSpain != null) l.push('- Tiempo en España: ' + RL.fmt.duration(d.monthsInSpain));
    if (d.inSpain) {
      l.push('- Situación: ' + (d.irregular ? 'irregular' : (d.hasPermit ? 'con autorización' : 'sin datos suficientes')));
      if (p.permitStatus) l.push('- Permiso: ' + (PERMIT[p.permitStatus] || p.permitStatus));
      if (p.empadronado) l.push('- Padrón: ' + (p.empadronado === 'yes' ? 'sí' : 'no'));
      if (d.housing) l.push('- Vivienda: ' + (RL.housing.labels[d.housing] || d.housing) + (d.housingProof ? ' · prueba: ' + (RL.housing.proof[d.housingProof] || d.housingProof) : ''));
      if (d.degree) l.push('- Estudios: ' + (RL.education.degree[d.degree] || d.degree));
      if (d.sepeCourses) l.push('- Cursos SEPE terminados: ' + d.sepeCourses + (d.sepeCoursesDetails ? ' · ' + d.sepeCoursesDetails : ''));
      if (d.sepeCoursesInProgress) l.push('- Cursos SEPE en curso: ' + d.sepeCoursesInProgress);
      if (d.partnerHasDisability) l.push('- Pareja con discapacidad reconocida');
      if (d.partnerDependency) l.push('- Pareja con dependencia reconocida');
      if (d.hasDisabledChild) l.push('- Hijo/a con discapacidad');
      if (d.householdOthers > 0) l.push('- Otras personas en casa: ' + d.householdOthers + (p.householdDetails ? ' · ' + p.householdDetails : ''));
      if (d.partnerName) l.push('- Pareja: ' + d.partnerName + (d.partnerAge != null ? ', ' + d.partnerAge + ' años' : '') + (d.partnerNationality ? ', ' + d.partnerNationality : ''));
      (d.familyChildren || []).forEach(function (c) {
        l.push('- Hijo/a ' + c.index + (c.name ? ': ' + c.name : '') + (c.age != null ? ', ' + c.age + ' años' : '') + (c.relation ? ', ' + (RL.family.relations[c.relation] || c.relation) : '') + (c.disability === 'yes' ? ', discapacidad' : '') + (c.education ? ', estudios: ' + (RL.education.child[c.education] || c.education) : ''));
      });
      (d.extraPeople || []).forEach(function (x) {
        l.push('- Otra persona en casa: ' + (x.name || 'sin nombre') + (x.age != null ? ', ' + x.age + ' años' : '') + (x.relation ? ', ' + x.relation : ''));
      });
    }
    if (opts.includeDocs) {
      var docs = (d.docsBase || []).concat(d.docsTramites || []);
      if (docs.length) l.push('- Documentos y trámites terminados: ' + list(docs, DOCS));
      var currentDocs = d.docsEnCurso || [];
      if (currentDocs.length) l.push('- Trámites en curso o pendientes de resolución: ' + list(currentDocs, DOCS));
      if (d.asylumStage && d.asylumStage !== 'no') {
        var st = { cita: 'cita de asilo', solicitado: 'solicitud presentada', admitido: 'tarjeta roja', concedido: 'protección concedida', denegado: 'asilo denegado', renunciado: 'renuncia a la protección internacional' };
        l.push('- Asilo: ' + (st[d.asylumStage] || d.asylumStage) + (d.asylumRenouncedDateText ? ' (' + d.asylumRenouncedDateText + ')' : ''));
        if (d.postRenunciation) {
          var postText = { irregular: 'siguió irregular', arraigo_pending: 'arraigo pendiente', arraigo_granted: 'arraigo concedido', arraigo_denied: 'arraigo denegado', reg2026_pending: 'regularización 2026 pendiente', reg2026_granted: 'regularización 2026 concedida', reg2026_denied: 'regularización 2026 denegada', other_permit: 'otro permiso', left_spain: 'salió de España', dontknow: 'no lo sabe' };
          l.push('- Después de renunciar: ' + (postText[d.postRenunciation] || d.postRenunciation) + (d.postRenunciationDateISO ? ' (' + RL.fmt.monthYear(d.postRenunciationDateISO) + ')' : ''));
        }
      }
      if (d.pendingExtranjeria) l.push('- Expediente de extranjería abierto');
      if (d.pendingNationality) l.push('- Nacionalidad en trámite');
    }
    if (p.maritalStatus) l.push('- Situación de pareja: ' + (MARITAL[p.maritalStatus] || p.maritalStatus) + (p.marriageType ? ' (' + (MARRIAGE[p.marriageType] || p.marriageType) + ')' : ''));
    if (d.hasKids) {
      l.push('- Hijos: ' + RL.family.childrenText(d) + (p.childrenAges ? ' (edades: ' + p.childrenAges + ')' : ''));
      if (d.hasSpanishChildInHousehold) l.push('- Hijo/a español: ' + (SPANISH_CHILD[d.spanishChildType] || 'vínculo no indicado'));
    }
    if (p.spouseSpanish === 'yes') l.push('- Pareja con nacionalidad española');
    if (p.ancestry && p.ancestry !== 'none') l.push('- Ascendencia española: ' + p.ancestry);
    if (p.monthlyIncome != null) l.push('- Ingresos mensuales aproximados: ' + p.monthlyIncome + ' €');
    if (p.savings != null) l.push('- Ahorros aproximados: ' + p.savings + ' €');
    if (p.criminalSpain || p.criminalOrigin) {
      l.push('- Antecedentes declarados: España ' + (p.criminalSpain || 'no') + (p.criminalSpainWhen ? ' (' + p.criminalSpainWhen + ')' : '') + ', país de origen ' + (p.criminalOrigin || 'no') + (p.criminalOriginWhen ? ' (' + p.criminalOriginWhen + ')' : ''));
    }
    if (p.permitKind) l.push('- Tipo de autorización: ' + p.permitKind);
    if (p.hasDisability && p.hasDisability !== 'no') l.push('- Discapacidad: ' + (p.disabilityDegree || 'en trámite') + (p.disabilityCertificate ? '; certificado: ' + p.disabilityCertificate : ''));
    if (p.dependency && p.dependency !== 'no') l.push('- Dependencia: ' + p.dependency);
    if (p.familyNumerosa && p.familyNumerosa !== 'no') l.push('- Familia numerosa: ' + p.familyNumerosa);
    if (p.childrenDisability && p.childrenDisability !== 'no') l.push('- Hijos con discapacidad: ' + p.childrenDisability);
    if (p.foreignStudies === 'yes') l.push('- Estudios extranjeros: ' + (p.studiesLevel || 'nivel no indicado') + '; homologación: ' + (p.studiesHomologated || 'no indicada'));
    if (p.goals && p.goals.length) l.push('- Objetivo: ' + list(p.goals, GOALS));
    if (opts.includeNotes && p.notes) l.push('- Notas del caso: ' + String(p.notes).slice(0, 600));
    return l.join('\n');
  }

  function diagnosisBlock(plan, opts) {
    if (!plan) return 'No hay diagnóstico previo: la persona no ha completado el cuestionario.';
    var l = [];
    l.push('- Resumen: ' + plan.summary);
    if (plan.confidence) l.push('- Confianza del diagnóstico: ' + plan.confidence.level);
    if (plan.reality) l.push('- Expectativa de la app: ' + plan.reality.title + '. ' + plan.reality.body);
    if (plan.primaryReason) l.push('- Prioridad: ' + plan.primaryReason);
    if (plan.recommended && plan.recommended.length) {
      l.push('- Vías recomendadas:');
      plan.recommended.forEach(function (r) {
        var extra = [];
        if (r.status) extra.push(r.status);
        if (r.route.fit) extra.push(r.route.fit);
        l.push('  · ' + r.route.title + ' (' + extra.join('; ') + ')');
        if (r.fails && r.fails.length) {
          l.push('    Faltan: ' + r.fails.slice(0, 3).map(function (f) { return f.label; }).join(' | '));
        }
      });
    } else {
      l.push('- Vías recomendadas: ninguna con los datos actuales.');
    }
    if (plan.discarded && plan.discarded.length) {
      l.push('- Vías descartadas (motivo):');
      plan.discarded.slice(0, 6).forEach(function (r) {
        var why = r.blockers[0] || (r.fails[0] && r.fails[0].label) || 'no encaja';
        l.push('  · ' + r.route.title + ': ' + why);
      });
    }
    if (plan.alerts && plan.alerts.length) {
      l.push('- Alertas: ' + plan.alerts.slice(0, 4).map(function (a) { return a.title; }).join(' | '));
    }
    if (plan.safety && plan.safety.length) {
      l.push('- Prioridades de seguridad: ' + plan.safety.map(function (s) { return s.title; }).join(' | '));
    }
    if (plan.confidence) {
      var gaps = (plan.confidence.missing || []).concat(plan.confidence.gaps || []);
      if (gaps.length) l.push('- Datos por confirmar: ' + gaps.slice(0, 6).join(' | '));
    }
    if (opts.includeDocs && plan.checklist && plan.checklist.length) {
      l.push('- Documentos que pide el plan: ' + plan.checklist.slice(0, 12).map(function (d) { return d.name; }).join(' | '));
    }
    return l.join('\n');
  }

  function context(plan, opts) {
    opts = opts || {};
    var p = plan ? plan.p : (RL.profile() || {});
    var d = plan ? plan.d : RL.derive(p);
    return 'PERFIL DE LA PERSONA\n' + profileBlock(p, d, opts) +
      '\n\nDIAGNÓSTICO DE LA APP\n' + diagnosisBlock(plan, opts) +
      '\n\nMARCO QUE YA HA APLICADO LA APP\n' +
      '- Fecha de contenido: ' + RL.CONTENT_DATE + '.\n' +
      '- Normas: LO 4/2000, RD 1155/2024 (en vigor 20/05/2025), RD 316/2026, CC arts. 17-26, Ley 14/2013, RD 240/2007.\n' +
      '- La app es orientativa y no es asesoramiento jurídico.';
  }

  function buildPrompt(plan, question, opts) {
    opts = opts || {};
    var q = (question || '').trim() || 'Explícame mi caso, qué vías tengo y qué debería hacer ahora.';
    return 'Actúa como asistente experto en extranjería española. Ayudas a una persona a entender su caso y a preparar una consulta con un abogado. No eres su abogado y no puedes garantizar que le concedan nada.\n\n' +
      'FECHA DE REFERENCIA: ' + RL.CONTENT_DATE + '. Si la norma ha cambiado después, dilo y no inventes.\n\n' +
      context(plan, opts) +
      '\n\nPREGUNTA CONCRETA\n' + q + '\n\n' +
      'INSTRUCCIONES\n' +
      '1. Responde en español claro, sin jerga innecesaria. Si usas un término técnico, explícalo.\n' +
      '2. Distingue lo que es un hecho comprobado, lo que es un requisito legal y lo que es tu interpretación.\n' +
      '3. No inventes artículos, tasas, plazos ni formularios. Si no estás seguro, dilo y enlaza la fuente oficial (BOE, sede del Ministerio, comunidad autónoma).\n' +
      '4. Si falta un dato crítico, haz 1-3 preguntas antes de concluir. No rellenes huecos con suposiciones.\n' +
      '5. No prometas una concesión, una cita ni un plazo exacto. No sustituyas a un abogado de extranjería.\n' +
      '6. Si la persona está irregular, no le digas que salga de España sin valorar el riesgo y las alternativas.\n' +
      '7. Ten en cuenta la comunidad autónoma y el municipio para trámites locales, pero no inventes direcciones.\n' +
      '8. Estructura la respuesta así: (a) respuesta corta; (b) por qué; (c) qué debe comprobar; (d) siguiente paso; (e) cuándo consultar a un abogado; (f) fuentes oficiales.\n' +
      '9. Si crees que el diagnóstico de la app es incorrecto, dilo y explica en qué.\n' +
      '10. No incluyas datos personales innecesarios en la respuesta.';
  }

  function buildFollowUp(prev, question) {
    var q = (question || '').trim();
    var ans = (prev && prev.answer ? prev.answer : '').slice(0, 9000);
    return 'Retomo una consulta anterior sobre extranjería española. Mantén el contexto y no repitas toda la respuesta anterior.\n\n' +
      'PREGUNTA ANTERIOR\n' + ((prev && prev.question) || '') + '\n\n' +
      'RESPUESTA ANTERIOR\n' + ans + '\n\n' +
      'NUEVA PREGUNTA\n' + q + '\n\n' +
      'INSTRUCCIONES\n' +
      '- Responde solo a lo nuevo, en español claro.\n' +
      '- Si la respuesta anterior contenía un error o una suposición, corrígelo.\n' +
      '- Distingue hechos, requisitos e interpretación. No inventes normas, tasas ni plazos.\n' +
      '- Termina con: qué comprobar, siguiente paso y cuándo consultar a un abogado.';
  }

  function copy(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) { /* sin permiso */ }
    document.body.removeChild(ta);
    return Promise.resolve();
  }

  function openAI(base, prompt) {
    var text = prompt || '';
    var target = text.length <= 6000 ? base + '?q=' + encodeURIComponent(text) : base;
    var w = window.open(target, '_blank');
    if (text.length > 6000) copy(text);
    return w;
  }
  function openDeepSeek(prompt) { return openAI('https://chat.deepseek.com/', prompt); }
  function openChatGPT(prompt) { return openAI('https://chatgpt.com/', prompt); }

  function save(entry) {
    var c = {
      id: 'c' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      date: RL.dates.today(),
      question: entry.question || '',
      prompt: entry.prompt || '',
      answer: entry.answer || '',
      context: entry.context || ''
    };
    RL.state.consultations = RL.state.consultations || [];
    RL.state.consultations.unshift(c);
    if (RL.state.consultations.length > 20) RL.state.consultations.length = 20;
    RL.store.save();
    return c;
  }
  function list() { return (RL.state.consultations || []).slice(); }
  function get(id) {
    return (RL.state.consultations || []).filter(function (c) { return c.id === id; })[0] || null;
  }
  function remove(id) {
    RL.state.consultations = (RL.state.consultations || []).filter(function (c) { return c.id !== id; });
    RL.store.save();
  }
  function last() { return (RL.state.consultations || [])[0] || null; }

  RL.ai = {
    buildPrompt: buildPrompt,
    buildFollowUp: buildFollowUp,
    context: context,
    copy: copy,
    openDeepSeek: openDeepSeek,
    openChatGPT: openChatGPT,
    save: save,
    list: list,
    get: get,
    remove: remove,
    last: last
  };
})();

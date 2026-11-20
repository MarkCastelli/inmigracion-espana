/* ============================================================
   Ruta Legal · capa de decisión
   No sustituye al motor de reglas: lo ordena y lo audita.
   Orden: legalidad → objetivo → derechos/plazos → encaje.
   ============================================================ */
(function () {
  'use strict';
  var RL = window.RL = window.RL || {};

  /* Calidad de la vía: no es lo mismo una tarjeta de 5 años que un arraigo de 1. */
  var QUALITY = {
    nac_origen: 0, nac_opcion: 0, nac_22_2f: 0, nac_residencia_2: 0,
    nac_residencia_1: 0, nac_residencia_10: 0, nac_ley_nietos: 0, nac_carta: 0,
    familiar_espanol: 0, familiar_ue: 0, ciudadano_ue: 0, larga_duracion: 0,
    asilo: 0, asilo_seguimiento: 0, circunstancias_excepcionales: 0,
    arraigo_social: 1, arraigo_sociolaboral: 1, arraigo_socioformativo: 1,
    arraigo_segunda_oportunidad: 1, reagrupacion: 1, renovacion: 1,
    estudios_a_trabajo: 1, regularizacion_seguimiento: 1,
    visado_no_lucrativa: 2, visado_estudios: 2, visado_trabajo_ajena: 2,
    visado_cuenta_propia: 2, visado_nomada_digital: 2, visado_pac: 2,
    visado_emprendedor: 2, entrada_turista: 3, golden_visa: 3
  };

  var TIER = {
    asilo: 1, asilo_seguimiento: 1, circunstancias_excepcionales: 1,
    familiar_espanol: 2, familiar_ue: 2, ciudadano_ue: 2,
    renovacion: 3, estudios_a_trabajo: 3, larga_duracion: 3,
    arraigo_social: 4, arraigo_sociolaboral: 4, arraigo_socioformativo: 4,
    arraigo_segunda_oportunidad: 4, reagrupacion: 4, regularizacion_seguimiento: 4,
    nac_origen: 5, nac_opcion: 5, nac_22_2f: 5, nac_residencia_2: 5,
    nac_residencia_1: 5, nac_residencia_10: 5, nac_ley_nietos: 5, nac_carta: 5,
    visado_no_lucrativa: 6, visado_estudios: 6, visado_trabajo_ajena: 6,
    visado_cuenta_propia: 6, visado_nomada_digital: 6, visado_pac: 6,
    visado_emprendedor: 6, entrada_turista: 6, golden_visa: 6
  };

  var STATUS_GROUP = { ready: 0, likely: 0, almost: 1, unlikely: 2, blocked: 3, closed: 4 };

  function qualityOf(route) {
    if (QUALITY[route.id] != null) return QUALITY[route.id];
    if (route.group === 'nacionalidad') return 0;
    if (route.group === 'proteccion') return 0;
    if (route.group === 'visado') return 2;
    return 1;
  }
  function tierOf(route) {
    if (TIER[route.id] != null) return TIER[route.id];
    if (route.group === 'proteccion') return 1;
    if (route.group === 'nacionalidad') return 5;
    if (route.group === 'visado') return 6;
    return 3;
  }
  function goalMatch(route, d) {
    return (route.goals || []).some(function (g) { return d.wants(g); }) ? 0 : 1;
  }

  function compare(a, b, d) {
    var sa = STATUS_GROUP[a.status] || 0, sb = STATUS_GROUP[b.status] || 0;
    if (sa !== sb) return sa - sb;
    var ga = goalMatch(a.route, d), gb = goalMatch(b.route, d);
    if (ga !== gb) return ga - gb;
    var qa = qualityOf(a.route), qb = qualityOf(b.route);
    if (qa !== qb) return qa - qb;
    if (b.score !== a.score) return b.score - a.score;
    return tierOf(a.route) - tierOf(b.route);
  }

  var LABELS = {
    nationality: 'tu nacionalidad',
    age: 'tu edad',
    location: 'dónde estás',
    entryMode: 'cómo entraste',
    timeInSpain: 'cuánto tiempo llevas en España',
    permitStatus: 'qué permiso tienes',
    empadronado: 'si estás empadronado',
    criminalSpain: 'tus antecedentes en España',
    criminalOrigin: 'tus antecedentes en tu país',
    ancestry: 'tu ascendencia española',
    maritalStatus: 'tu estado civil',
    employment: 'tu situación laboral',
    outsideGoal: 'qué quieres hacer',
    protectionNeed: 'si temes volver a tu país'
  };

  function confidence(p, d, results) {
    var required = ['nationality', 'age', 'location'];
    if (d.inSpain) required = required.concat(['entryMode', 'timeInSpain', 'permitStatus', 'empadronado', 'criminalSpain', 'criminalOrigin']);
    else required = required.concat(['outsideGoal', 'criminalOrigin']);
    if (d.wants('nacionalidad') || d.hasAncestry) required.push('ancestry');
    if (d.wants('familia')) required.push('maritalStatus');
    if (d.inSpain && d.protectionNeed) required.push('protectionNeed');

    var missing = [];
    required.forEach(function (k) {
      if (p[k] == null || p[k] === '') missing.push(LABELS[k] || k);
    });

    var gaps = [];
    if (d.inSpain && p.timeInSpain == null && !p.entryDate) gaps.push('No has indicado cuánto tiempo llevas en España.');
    if (p.permitStatus === 'work' && !p.permitExpiry) gaps.push('No has indicado cuándo caduca tu permiso de trabajo.');
    if (d.hasRedCard && !p.tarjetaRojaExpiry) gaps.push('No has indicado cuándo caduca tu tarjeta roja.');
    if (p.empadronado === 'yes' && !p.empadronamientoSince) gaps.push('No has indicado desde cuándo estás empadronado.');
    if (d.owns('tie') && p.permitStatus === 'none') gaps.push('Marcaste TIE pero no indicaste un permiso: revisa ese dato.');

    var level = 'alta';
    if (missing.length > 2 || gaps.length > 2) level = 'baja';
    else if (missing.length > 0 || gaps.length > 0) level = 'media';

    var unknowns = results.reduce(function (n, r) {
      return n + r.unknowns.filter(function (u) { return u.critical; }).length;
    }, 0);

    return { level: level, missing: missing, gaps: gaps, unknowns: unknowns };
  }

  function safety(p, d, ordered) {
    var flags = [];
    function add(level, title, text) { flags.push({ level: level, title: title, text: text }); }

    if (p.exitOrder === 'yes') {
      add('bad', 'Tienes una orden de salida o prohibición de entrada',
        'No inicies ningún trámite sin revisar antes el alcance y los plazos con un abogado.');
    }
    if (d.asylumDenied && p.asylumAppeal !== 'yes') {
      add('bad', 'Tu asilo fue denegado y no consta recurso',
        'El plazo de recurso es corto. Busca asesoramiento hoy: de ello puede depender que no te quedes sin protección.');
    }
    if (d.victim) {
      add('bad', 'Has indicado violencia o trata',
        'Llama al 016 o acude a una entidad especializada. Hay autorizaciones de residencia específicas y no necesitas denunciar para informarte.');
    }
    if (d.minor) {
      add('warn', 'Eres menor de edad',
        'Las reglas son distintas: tutela, servicios sociales y nacionalidad. Este plan es solo orientativo.');
    }
    if (d.criminalSpain === 'yes' || d.criminalOrigin === 'yes') {
      add('warn', 'Tienes antecedentes penales declarados',
        'No todas las vías los excluyen ni todos los delitos cuentan igual. Necesitas una valoración individual.');
    }
    if (!ordered.length) {
      add('warn', 'Ninguna vía aparece abierta a corto plazo',
        'No significa que no haya camino, pero conviene que un profesional revise tu caso y los documentos que ya tienes.');
    }
    if (d.inSpain && d.irregular && !d.asylumInProcess && d.monthsInSpain != null && d.monthsInSpain < 24) {
      add('warn', 'Estás en situación irregular y aún no cumples los 2 años',
        'La prioridad es no salir de España, mantener el padrón y preparar la vía más corta.');
    }
    return flags;
  }

  function primaryReason(primary, confidenceInfo) {
    if (!primary) return 'Con los datos actuales no hay una vía que cumpla los requisitos esenciales. Hay que revisar el caso con un profesional.';
    if (primary.status === 'ready') {
      return 'Es la vía que cumple los requisitos esenciales y ofrece más derechos entre las que puedes activar ahora.';
    }
    if (primary.status === 'likely') {
      return 'Encaja con tu perfil; solo faltan confirmaciones documentales o datos que no has indicado.';
    }
    var miss = primary.fails.filter(function (f) { return f.critical; })[0];
    return 'Es la vía más realista a medio plazo' + (miss ? ': te falta ' + miss.label.toLowerCase() + '.' : '.');
  }

  function reality(plan) {
    var best = plan.recommended[0] || null;
    var d = plan.d || {};
    if (d.isSpanish) {
      return {
        level: 'solid',
        title: 'No necesitas regularización',
        body: 'Ya tienes la nacionalidad española. No hay visado ni autorización de residencia que solicitar; para vivir y trabajar solo necesitas identificación, padrón y, si trabajas, alta en la Seguridad Social.',
        bullets: ['No hay una vía migratoria que tramitar.', 'DNI o pasaporte español, padrón y Seguridad Social para trabajar.']
      };
    }
    var level, title, body;

    if (!best) {
      level = 'none';
      title = 'No aparece una vía ordinaria con estos datos';
      body = 'No es lo mismo que «imposible»: puede haber una excepción, un dato mal encajado o una vía que necesite revisión profesional. Lo que no vamos a hacer es inventarte una solicitud que no cumple requisitos.';
    } else if (best.status === 'ready') {
      level = 'solid';
      title = 'Vía legal con requisitos cubiertos';
      body = 'Cumples los requisitos esenciales que la app puede comprobar. La concesión no es automática: la oficina valora pruebas, convivencia, medios, credibilidad y antecedentes.';
    } else if (best.status === 'likely') {
      level = 'conditional';
      title = 'Vía posible, pero faltan datos o pruebas';
      body = 'La vía encaja, pero todavía hay requisitos por confirmar. Sin esas pruebas no es una posibilidad real; con ellas, tampoco es una garantía.';
    } else {
      level = 'fragile';
      title = 'Vía frágil: hoy no es realista';
      body = 'La vía existe en abstracto, pero te falta un requisito esencial o un plazo. No cuentes con ella hasta que cambie tu situación.';
    }

    var bullets = [];
    bullets.push('No damos un porcentaje de concesión: no existe un dato fiable sin expediente, pruebas y criterio de la oficina.');
    if (plan.confidence && (plan.confidence.missing.length || plan.confidence.gaps.length)) {
      var gaps = plan.confidence.missing.concat(plan.confidence.gaps);
      bullets.push('Datos por confirmar: ' + gaps.slice(0, 4).join(' · ') + '.');
    }
    if (best && best.fails && best.fails.length) {
      bullets.push('Requisitos pendientes: ' + best.fails.slice(0, 3).map(function (f) { return f.label; }).join(' · ') + '.');
    }
    if (best && best.blockers && best.blockers.length) {
      bullets.push('Bloqueo legal: ' + best.blockers[0] + '.');
    }
    if (d.hasSpanishSpouse) {
      bullets.push('Casarse o registrar la pareja con un español/a no te legaliza automáticamente: hay que solicitar la autorización y probar el vínculo y la convivencia.');
    }
    if (d.stablePartnerSpanish) {
      bullets.push('Pareja estable no registrada: 12 meses de convivencia o hijo en común, y hay que acreditarlo. Una relación ocasional no basta.');
    }
    if (d.hasSpanishChild && d.childRecognized !== false) {
      bullets.push('Un hijo/a español no te legaliza por sí solo: como progenitor debes acreditar que el menor está a tu cargo y convive contigo, o que cumples tus obligaciones.');
    }
    if (d.childRecognized === false) {
      bullets.push('El progenitor español no ha reconocido al hijo/a: sin filiación, la nacionalidad española del menor no está resuelta.');
    }
    if (d.pregnantBySpanish && !d.hasSpanishChild) {
      bullets.push('El embarazo no da residencia. El hijo será español si el padre español lo reconoce al nacer; a partir de ahí podrías solicitar como progenitor si queda a tu cargo.');
    }
    return {
      level: level,
      title: title,
      body: body,
      bullets: bullets.slice(0, 6)
    };
  }

  function decide(results, p, d, minScore) {
    var min = Number(minScore) || 0;
    var open = results.filter(function (r) {
      return r.status !== 'blocked' && r.status !== 'closed' && !r.route.informational;
    });
    var eligible = open.filter(function (r) {
      return (r.status === 'ready' || r.status === 'likely' || r.status === 'almost') && r.score >= min;
    });
    var ordered = eligible.slice().sort(function (a, b) { return compare(a, b, d); });
    var conf = confidence(p, d, results);
    if (ordered[0]) {
      var critUnknown = ordered[0].unknowns.filter(function (u) { return u.critical; }).length;
      var critFail = ordered[0].fails.filter(function (f) { return f.critical; }).length;
      if ((critUnknown > 0 || critFail > 0) && conf.level === 'alta') conf.level = 'media';
    }

    var trace = {
      total: results.length,
      blocked: results.filter(function (r) { return r.status === 'blocked'; }).length,
      closed: results.filter(function (r) { return r.status === 'closed'; }).length,
      noFit: results.filter(function (r) { return r.status === 'unlikely'; }).length,
      ordered: ordered.map(function (r) { return r.route.title; })
    };

    return {
      ordered: ordered,
      primary: ordered[0] || null,
      alternatives: ordered.slice(1, 4),
      confidence: conf,
      safety: safety(p, d, ordered),
      primaryReason: primaryReason(ordered[0] || null, conf),
      trace: trace
    };
  }

  RL.decision = {
    decide: decide,
    reality: reality,
    qualityOf: qualityOf,
    tierOf: tierOf,
    confidence: confidence,
    safety: safety,
    compare: compare
  };
})();

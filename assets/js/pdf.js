/* ============================================================
   Ruta Legal · generador de PDF sin dependencias
   Escribe un PDF válido (A4, Helvetica, WinAnsi) con el perfil,
   el plan, los requisitos, los documentos y los plazos.
   Todo ocurre en el navegador: no se envía nada.
   ============================================================ */
(function () {
  'use strict';
  var RL = window.RL = window.RL || {};

  var PAGE_W = 595, PAGE_H = 842, MARGIN = 56, CONTENT_W = PAGE_W - MARGIN * 2, BOTTOM = 64;

  /* ── caracteres: WinAnsi (cp1252) ── */
  var SPECIAL = {
    0x20AC: 0x80, 0x201A: 0x82, 0x0192: 0x83, 0x201E: 0x84, 0x2026: 0x85,
    0x2020: 0x86, 0x2021: 0x87, 0x02C6: 0x88, 0x2030: 0x89, 0x0160: 0x8A,
    0x2039: 0x8B, 0x0152: 0x8C, 0x017D: 0x8E, 0x2018: 0x91, 0x2019: 0x92,
    0x201C: 0x93, 0x201D: 0x94, 0x2022: 0x95, 0x2013: 0x96, 0x2014: 0x97,
    0x02DC: 0x98, 0x2122: 0x99, 0x0161: 0x9A, 0x203A: 0x9B, 0x0153: 0x9C,
    0x017E: 0x9E, 0x0178: 0x9F
  };

  function clean(str) {
    return String(str == null ? '' : str)
      .replace(/\u2192/g, '->').replace(/\u2190/g, '<-')
      .replace(/\u2026/g, '...').replace(/\u00A0/g, ' ')
      .replace(/\r/g, '').replace(/\t/g, '    ');
  }

  function toWinAnsi(str) {
    var s = clean(str), out = '';
    for (var i = 0; i < s.length; i++) {
      var code = s.charCodeAt(i);
      if (SPECIAL[code] != null) code = SPECIAL[code];
      if (code > 0xFF) code = 63; /* ? */
      out += String.fromCharCode(code);
    }
    return out;
  }

  function escPdf(str) {
    var s = toWinAnsi(str), out = '';
    for (var i = 0; i < s.length; i++) {
      var c = s.charCodeAt(i), ch = String.fromCharCode(c);
      if (ch === '\\' || ch === '(' || ch === ')') out += '\\' + ch;
      else if (c < 32 || c > 126) out += '\\' + ('000' + c.toString(8)).slice(-3);
      else out += ch;
    }
    return out;
  }

  function wrap(text, width, size, bold) {
    var max = Math.max(8, Math.floor(width / (size * (bold ? 0.55 : 0.5))));
    var out = [];
    String(text).split('\n').forEach(function (par) {
      var words = par.split(/\s+/).filter(Boolean);
      if (!words.length) { out.push(''); return; }
      var line = '';
      words.forEach(function (w) {
        var candidate = line ? line + ' ' + w : w;
        if (candidate.length > max && line) { out.push(line); line = w; }
        else line = candidate;
      });
      if (line) out.push(line);
    });
    return out;
  }

  /* ── documento ── */
  function Doc() {
    this.pages = [];
    this.buf = [];
    this.y = 0;
    this.pageNo = 0;
    this.docTitle = '';
  }

  Doc.prototype.begin = function () {
    this.pageNo++;
    this.buf = [];
    this.y = PAGE_H - MARGIN;
  };

  Doc.prototype.end = function () {
    var footer = 'Ruta Legal · Documento orientativo, no es asesoramiento jurídico · Página ' + this.pageNo;
    this.buf.push('BT /F1 8 Tf 0.45 0.45 0.45 rg 1 0 0 1 ' + MARGIN + ' 34 Tm (' + escPdf(footer) + ') Tj ET');
    this.pages.push(this.buf.join('\n'));
  };

  Doc.prototype.space = function (n) {
    if (this.y - n < BOTTOM) { this.end(); this.begin(); }
    else this.y -= n;
  };

  Doc.prototype.line = function (text, size, bold, indent, gap, muted) {
    var font = bold ? 'F2' : 'F1';
    var lines = wrap(text, CONTENT_W - indent, size, bold);
    var lh = size * 1.28;
    for (var i = 0; i < lines.length; i++) {
      if (this.y - lh < BOTTOM) { this.end(); this.begin(); }
      this.y -= lh;
      if (lines[i] !== '') {
        var color = muted ? '0.42 0.42 0.42 rg' : '0.08 0.08 0.08 rg';
        this.buf.push('BT /' + font + ' ' + size + ' Tf ' + color + ' 1 0 0 1 ' +
          (MARGIN + indent) + ' ' + this.y.toFixed(1) + ' Tm (' + escPdf(lines[i]) + ') Tj ET');
      }
    }
    this.y -= (gap || 0);
  };

  Doc.prototype.title = function (t) { this.line(t, 20, true, 0, 8); };
  Doc.prototype.h2 = function (t) { this.space(10); this.line(t, 13.5, true, 0, 5); };
  Doc.prototype.h3 = function (t) { this.space(7); this.line(t, 10.8, true, 0, 2); };
  Doc.prototype.p = function (t, muted) { this.line(t, 10, false, 0, 4, muted); };
  Doc.prototype.small = function (t) { this.line(t, 8.5, false, 0, 3, true); };
  Doc.prototype.bullet = function (t, sym) { this.line((sym || '-') + '  ' + t, 9.7, false, 11, 2); };
  Doc.prototype.kv = function (label, value) {
    this.line(String(label).toUpperCase() + ': ' + value, 9.6, false, 0, 2);
  };

  Doc.prototype.hr = function () {
    if (this.y - 12 < BOTTOM) { this.end(); this.begin(); }
    this.y -= 9;
    this.buf.push('0.82 0.82 0.82 RG 0.6 w ' + MARGIN + ' ' + this.y.toFixed(1) + ' m ' +
      (PAGE_W - MARGIN) + ' ' + this.y.toFixed(1) + ' l S');
    this.y -= 9;
  };

  /* ── ensamblado del PDF ── */
  function assemble(pages, title) {
    var out = [], len = 0, offsets = {};
    function write(s) { out.push(s); len += s.length; }
    function obj(num, body) {
      offsets[num] = len;
      write(num + ' 0 obj\n' + body + '\nendobj\n');
    }

    write('%PDF-1.4\n');
    write('%\u00E2\u00E3\u00CF\u00D3\n');

    var font1 = 3, font2 = 4;
    var firstPage = 5;
    var pageIds = [];
    var n = pages.length;
    for (var i = 0; i < n; i++) pageIds.push(firstPage + i * 2);
    var infoId = firstPage + n * 2;

    obj(1, '<< /Type /Catalog /Pages 2 0 R >>');
    obj(2, '<< /Type /Pages /Kids [' + pageIds.map(function (id) { return id + ' 0 R'; }).join(' ') +
      '] /Count ' + n + ' >>');
    obj(font1, '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');
    obj(font2, '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>');

    for (var j = 0; j < n; j++) {
      var content = pages[j];
      var contentId = pageIds[j] + 1;
      obj(pageIds[j], '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ' + PAGE_W + ' ' + PAGE_H + '] ' +
        '/Resources << /Font << /F1 ' + font1 + ' 0 R /F2 ' + font2 + ' 0 R >> >> ' +
        '/Contents ' + contentId + ' 0 R >>');
      obj(contentId, '<< /Length ' + content.length + ' >>\nstream\n' + content + '\nendstream');
    }

    obj(infoId, '<< /Title (' + escPdf(title) + ') /Creator (Ruta Legal) /Producer (Ruta Legal) >>');

    var xref = len;
    var count = infoId + 1;
    var xrefLines = ['xref', '0 ' + count, '0000000000 65535 f '];
    for (var k = 1; k < count; k++) {
      var off = offsets[k] || 0;
      xrefLines.push(('0000000000' + off).slice(-10) + ' 00000 n ');
    }
    write(xrefLines.join('\n') + '\n');
    write('trailer\n<< /Size ' + count + ' /Root 1 0 R /Info ' + infoId + ' 0 R >>\n');
    write('startxref\n' + xref + '\n%%EOF\n');

    var full = out.join('');
    var bytes = new Uint8Array(len);
    for (var b = 0; b < len; b++) bytes[b] = full.charCodeAt(b) & 0xff;
    return bytes;
  }

  /* ── contenido del plan ── */
  function buildPlanPDF(plan, profile) {
    var p = profile || {}, d = plan.d || {};
    var doc = new Doc();
    doc.begin();

    doc.title('Mi plan en Ruta Legal');
    doc.small('Documento gratuito generado en tu dispositivo el ' +
      RL.fmt.date(RL.dates.today(), { year: true }) + '. Tus datos no se han enviado a ningún servidor.');
    doc.p('Este documento es una orientación, no asesoramiento jurídico. No garantizamos que sea ni el mejor ni el único camino: nos esforzamos por acercarnos a tu caso. Llévalo a un abogado de extranjería o a una entidad social: le ahorrarás tiempo y podrá asesorarte mejor.');
    doc.hr();

    doc.h2('Tus datos');
    doc.kv('Nacionalidad', RL.countryName(p.nationality));
    if (d.age != null) doc.kv('Edad', d.age + ' años');
    doc.kv('Ubicación', p.location === 'spain' ? 'España' : (p.location === 'origin' ? 'País de origen' : 'Otro país'));
    if (p.location === 'spain' && (p.province || p.municipality)) {
      doc.kv('Provincia / municipio', [p.municipality, p.province].filter(Boolean).join(' · '));
    }
    if (d.inSpain && d.monthsInSpain != null) doc.kv('Tiempo en España', RL.fmt.duration(d.monthsInSpain));
    if (d.inSpain) doc.kv('Situación', d.irregular ? 'Sin autorización (irregular)' : (d.hasPermit ? 'Con autorización' : 'No indicada'));
    if (p.empadronado) doc.kv('Padrón', p.empadronado === 'yes' ? 'Sí' : 'No');
    if (d.housing) doc.kv('Vivienda', RL.housing.labels[d.housing] || d.housing);
    if (d.housingProof) doc.kv('Prueba de vivienda', RL.housing.proof[d.housingProof] || d.housingProof);
    if (d.degree) doc.kv('Estudios', RL.education.degree[d.degree] || d.degree);
    if (d.sepeCourses) doc.kv('Cursos SEPE terminados', String(d.sepeCourses));
    if (d.sepeCoursesDetails) doc.kv('Detalle de cursos SEPE', d.sepeCoursesDetails);
    if (d.sepeCoursesInProgress) doc.kv('Cursos SEPE en curso', String(d.sepeCoursesInProgress));
    if (d.partnerHasDisability) doc.kv('Pareja con discapacidad', 'Sí' + (d.partnerDisabilityDegree ? ' · grado ' + (RL.disability.degree[d.partnerDisabilityDegree] || d.partnerDisabilityDegree) : '') + (d.partnerDisabilityExpiry ? ' · vence ' + RL.fmt.date(d.partnerDisabilityExpiry) : ''));
    if (d.partnerDependency) doc.kv('Pareja con dependencia', 'Sí');
    if (d.hasDisability) doc.kv('Discapacidad del solicitante', 'Sí' + (d.disabilityDegree ? ' · grado ' + (RL.disability.degree[d.disabilityDegree] || d.disabilityDegree) : '') + (d.disabilityExpiry ? ' · vence ' + RL.fmt.date(d.disabilityExpiry) : ''));
    if (d.hasDisabledChild) doc.kv('Hijo/a con discapacidad', 'Sí' + (d.childrenDisabilityDegree ? ' · grado ' + (RL.disability.degree[d.childrenDisabilityDegree] || d.childrenDisabilityDegree) : '') + (d.childrenDisabilityExpiry ? ' · vence ' + RL.fmt.date(d.childrenDisabilityExpiry) : ''));
    if (d.hasDisabledChild) doc.kv('Hijo/a con discapacidad', 'Sí');
    if (d.householdOthers > 0) doc.kv('Otras personas en casa', String(d.householdOthers));
    if (p.householdDetails) doc.kv('Detalle de convivientes', p.householdDetails);
    if (d.partnerName) doc.kv('Pareja', d.partnerName + (d.partnerAge != null ? ' · ' + d.partnerAge + ' años' : '') + (d.partnerNationality ? ' · ' + d.partnerNationality : ''));
    if (d.familyChildren && d.familyChildren.length) {
      doc.p('Hijos:', true);
      d.familyChildren.forEach(function (c) {
        doc.bullet('Hijo/a ' + c.index + (c.name ? ' · ' + c.name : '') + (c.age != null ? ' · ' + c.age + ' años' : '') +
          (c.relation ? ' · ' + (RL.family.relations[c.relation] || c.relation) : '') +
          (c.disability === 'yes' ? ' · discapacidad reconocida' : '') +
          (c.lives ? ' · convivencia: ' + c.lives : '') +
          (c.education ? ' · estudios: ' + (RL.education.child[c.education] || c.education) : ''));
      });
    }
    if (d.extraPeople && d.extraPeople.length) {
      doc.p('Otras personas que conviven:', true);
      d.extraPeople.forEach(function (x) {
        doc.bullet('Persona ' + x.index + (x.name ? ' · ' + x.name : '') + (x.age != null ? ' · ' + x.age + ' años' : '') + (x.relation ? ' · ' + x.relation : ''));
      });
    }
    if (p.maritalStatus) {
      doc.kv('Situación de pareja', RL.family.status[p.maritalStatus] || p.maritalStatus);
      if (p.marriageType) doc.kv('Matrimonio', RL.family.marriage[p.marriageType] || p.marriageType);
    }
    if (d.hasKids) {
      doc.kv('Hijos', RL.family.childrenText(d));
      if (p.childrenAges) doc.kv('Edades de los hijos', p.childrenAges);
      if (d.hasSpanishChildInHousehold) {
        doc.kv('Hijo/a español', (RL.family.spanishChild[d.spanishChildType] || 'Vínculo no indicado') +
          (d.hasSpanishChild ? '' : ' · no abre la vía de progenitor'));
      }
    } else {
      doc.kv('Hijos', 'No constan');
    }
    if (d.hasAncestry) doc.kv('Ascendencia española', 'Sí');
    doc.kv('Objetivo', goalText(p.goals));
    if (p.notes) doc.kv('Notas', p.notes);

    var docLabels = {
      pasaporte: 'Pasaporte de tu país (no español)', nie: 'NIE', tie: 'TIE o tarjeta de residencia', tarjeta_ue: 'Tarjeta de familiar de la UE',
      certificado_digital: 'Certificado digital o Cl@ve', cuenta_bancaria: 'Cuenta bancaria',
      seguridad_social: 'Número de la Seguridad Social', vida_laboral: 'Informe de vida laboral',
      tarjeta_sanitaria: 'Tarjeta sanitaria', contrato_alquiler: 'Contrato de alquiler, autorización, recibo o escritura de vivienda',
      nominas: 'Nóminas o contrato de trabajo', cita_asilo: 'Cita de asilo', hoja_blanca: 'Hoja blanca',
      tarjeta_roja: 'Tarjeta roja', resguardo_nacionalidad: 'Resguardo de nacionalidad',
      resguardo_extranjeria: 'Resguardo de extranjería', autorizacion_regreso: 'Autorización de regreso',
      cita_huellas: 'Cita de huellas TIE', tie_en_tramite: 'TIE en tramitación',
      cita_retirar_tie: 'Cita para retirar TIE', renovacion_tarjeta_roja: 'Renovación de tarjeta roja',
      homologacion_titulo: 'Homologación o validación de título', tie_renovada: 'TIE renovada',
      tarjeta_roja_renovada: 'Tarjeta roja renovada', titulo_homologado: 'Título homologado o validado',
      antecedentes: 'Certificado de antecedentes penales', libro_familia: 'Libro de familia',
      demandante_empleo: 'Demandante de empleo', discapacidad: 'Certificado de discapacidad', otro: 'Otro'
    };
    var owned = (d.docsBase || []).concat(d.docsTramites || []).map(function (k) { return docLabels[k]; }).filter(Boolean);
    if (owned.length) {
      doc.p('Documentos y trámites terminados:', true);
      owned.forEach(function (x) { doc.bullet(x); });
    }
    var currentDocs = (d.docsEnCurso || []).map(function (k) { return docLabels[k]; }).filter(Boolean);
    if (currentDocs.length) {
      doc.p('Trámites en curso o pendientes de resolución:', true);
      currentDocs.forEach(function (x) { doc.bullet(x); });
    }
    var stageText = { cita: 'Cita de asilo', solicitado: 'Solicitud presentada (hoja blanca)', admitido: 'Admitida a trámite (tarjeta roja)', concedido: 'Protección internacional concedida', denegado: 'Denegada', desistido: 'Desistimiento o archivo', renunciado: 'Renuncia a la protección internacional' };
    if (d.asylumStage && stageText[d.asylumStage]) doc.kv('Protección internacional', stageText[d.asylumStage] + (d.asylumRenouncedDateText ? ' · ' + d.asylumRenouncedDateText : ''));
    if (d.postRenunciation) {
      var postText = {
        irregular: 'Siguió irregular', arraigo_formacion_granted: 'Arraigo por formación concedido',
        arraigo_cuenta_ajena_granted: 'Arraigo por cuenta ajena concedido', arraigo_pending: 'Arraigo pendiente',
        arraigo_granted: 'Otro arraigo concedido', arraigo_denied: 'Arraigo denegado',
        reg2026_pending: 'Regularización 2026 pendiente', reg2026_granted: 'Regularización 2026 concedida',
        reg2026_denied: 'Regularización 2026 denegada', residencia_aprobada: 'Residencia aprobada',
        other_permit: 'Otro permiso obtenido', left_spain: 'Salió de España', dontknow: 'No lo sabe'
      };
      doc.kv('Después de la salida del asilo', (postText[d.postRenunciation] || d.postRenunciation) + (d.postRenunciationDateISO ? ' · ' + RL.fmt.monthYear(d.postRenunciationDateISO) : ''));
    }
    if (d.residenceApproved === 'yes') doc.kv('Residencia aprobada', (d.residenceApprovedYears ? d.residenceApprovedYears + ' años' : 'Sí') + (d.residenceApprovedDate ? ' · ' + RL.fmt.date(d.residenceApprovedDate) : '') + (d.tieWaitingExpiry === 'yes' ? ' · esperando vencimiento de TIE' : ''));
    if (d.pendingExtranjeria) doc.kv('Expediente abierto', 'Sí');
    if (d.pendingNationality) doc.kv('Nacionalidad en trámite', 'Sí');

    doc.h2('Resumen');
    doc.p(plan.summary);
    if (plan.decision) {
      doc.p('Cómo se ha decidido: ' + plan.decision.primaryReason, true);
      if (plan.confidence) doc.kv('Confianza del diagnóstico', plan.confidence.level);
      if (plan.confidence && plan.confidence.missing && plan.confidence.missing.length) {
        doc.kv('Datos por confirmar', plan.confidence.missing.join(', '));
      }
    }
    if (plan.reality) {
      doc.h2('Expectativa realista');
      doc.p(plan.reality.title + '. ' + plan.reality.body);
      (plan.reality.bullets || []).forEach(function (b) { doc.bullet(b); });
    }
    if (plan.windows && plan.windows.length) {
      doc.h2('Ventanas de oportunidad');
      plan.windows.forEach(function (w) {
        doc.p(w.title + '. ' + w.body);
      });
    }

    if (plan.alerts && plan.alerts.length) {
      doc.h2('Avisos importantes');
      plan.alerts.forEach(function (a) {
        doc.bullet(a.title + ': ' + a.body, '!');
      });
    }

    doc.h2('Vías recomendadas');
    if (!plan.recommended.length) {
      doc.p('Con los datos actuales no aparece una vía abierta a corto plazo. Revisa las acciones de preparación.');
    }
    plan.recommended.forEach(function (r, idx) {
      var route = r.route;
      doc.h3((idx + 1) + '. ' + route.title + '  [' + RL.statusOf(r.status).label + ' · encaje ' + r.score + '/100]');
      doc.p(r.fit || route.summary);
      doc.kv('Dónde', route.where === 'spain' ? 'En España' : (route.where === 'consulado' ? 'En el consulado' : 'España o consulado'));
      doc.kv('Coste', route.cost);
      doc.kv('Plazo', route.time);
      doc.kv('Base legal', route.legal || '—');

      doc.p('Requisitos:', true);
      r.reqs.forEach(function (q) {
        var mark = q.status === 'ok' ? '[SI]' : (q.status === 'no' ? '[NO]' : '[?]');
        var extra = '';
        if (q.status === 'no' && q.fix) extra = ' -> ' + q.fix;
        if (q.status === 'unknown' && q.unknown) extra = ' -> ' + q.unknown;
        doc.bullet(mark + ' ' + q.label + extra);
      });

      if (route.docs && route.docs.length) {
        doc.p('Documentos:', true);
        route.docs.forEach(function (docItem) {
          doc.bullet('[ ] ' + docItem.name + (docItem.where ? ' — ' + docItem.where : '') +
            (docItem.note ? ' (' + docItem.note + ')' : ''));
        });
      }

      if (route.steps && route.steps.length) {
        doc.p('Pasos:', true);
        route.steps.forEach(function (s, i) {
          doc.bullet((i + 1) + '. ' + s.title + ' — ' + s.detail + (s.when ? ' [' + s.when + ']' : ''));
        });
      }

      if (route.risks && route.risks.length) {
        doc.p('Avisos y errores frecuentes:', true);
        route.risks.forEach(function (x) { doc.bullet(x); });
      }
    });

    if (plan.timeline && plan.timeline.length) {
      doc.h2('Fechas clave');
      plan.timeline.forEach(function (t) {
        doc.bullet(RL.fmt.date(t.date, { year: true }) + ' — ' + t.title + ' — ' + t.detail + ' (' + RL.fmt.relative(t.days) + ')');
      });
    }

    if (plan.actions && plan.actions.length) {
      doc.h2('Acciones que puedes hacer ya');
      plan.actions.forEach(function (a) {
        doc.bullet(a.title + ' — ' + a.body + ' [' + a.when + ']');
      });
    }

    if (plan.checklist && plan.checklist.length) {
      doc.h2('Lista de documentos');
      plan.checklist.forEach(function (item) {
        var checked = RL.state.checklist[item.key] ? '[x]' : '[ ]';
        doc.bullet(checked + ' ' + item.name + (item.where ? ' — ' + item.where : ''));
      });
    }

    if (plan.discarded && plan.discarded.length) {
      doc.h2('Vías que no aplican');
      plan.discarded.slice(0, 8).forEach(function (r) {
        var why = r.blockers.length ? r.blockers[0] : (r.fails[0] ? r.fails[0].label : 'No encaja con tu perfil.');
        doc.bullet(r.route.title + ': ' + why);
      });
    }

    doc.hr();
    doc.h2('Preguntas para tu cita con el abogado');
    doc.bullet('¿Mi perfil encaja en la vía recomendada o hay una mejor para mi caso?');
    doc.bullet('¿Qué documento debo conseguir primero y cuánto tarda?');
    doc.bullet('¿Hay algún plazo o riesgo de prohibición de entrada que deba atender ya?');
    doc.bullet('¿Qué coste total tiene el expediente y qué tasas se pagan?');

    doc.h2('Qué hacer ahora');
    doc.p('1. Si tu caso es urgente (expulsión, prohibición de entrada, violencia), busca ayuda profesional hoy.');
    doc.p('2. Lleva este documento a un abogado de extranjería o a una entidad social gratuita (CEAR, Cruz Roja, Cáritas, servicios sociales).');
    doc.p('3. Confirma cada requisito en la fuente oficial antes de presentar nada. La normativa cambia.');
    doc.small('Contenido revisado el ' + RL.fmt.date(RL.CONTENT_DATE, { year: true }) + '. Ruta Legal no cobra, no pide registro y no comparte tus datos. Este PDF se ha creado en tu navegador.');

    doc.end();
    return assemble(doc.pages, 'Mi plan en Ruta Legal');
  }

  function goalText(goals) {
    var m = {
      regularizar: 'Regularizarme', residencia_estable: 'Residencia estable',
      trabajar: 'Trabajar', estudiar: 'Estudiar', nacionalidad: 'Nacionalidad',
      familia: 'Familia', no_lo_se: 'No lo tengo claro'
    };
    return (goals || []).map(function (g) { return m[g] || g; }).join(', ') || 'No indicado';
  }

  function download(plan, profile) {
    var bytes = buildPlanPDF(plan, profile);
    var blob = new Blob([bytes], { type: 'application/pdf' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'ruta-legal-plan-' + RL.dates.today() + '.pdf';
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(url); a.remove(); }, 800);
  }

  function buildFormSheet(form, data, route) {
    data = data || {};
    route = route || { title: '', docs: [] };
    var doc = new Doc();
    doc.begin();

    doc.title('Hoja de datos · ' + form.code);
    doc.small('Generada en tu dispositivo el ' + RL.fmt.date(RL.dates.today(), { year: true }) +
      '. Tus datos no se han enviado a ningún servidor.');
    doc.p('Esto NO es el formulario oficial. Es una hoja de apoyo para que copies los datos en el modelo oficial, que debes descargar de la sede, firmar tú y presentar. No la firmes ni la presentes como si fuera el impreso.');
    doc.hr();

    doc.h2('Formulario oficial');
    doc.kv('Modelo', form.code + ' — ' + form.title);
    doc.kv('Dónde', form.where);
    doc.kv('Tasa', form.fee);
    if (form.note) doc.kv('Nota', form.note);
    doc.small('Enlace oficial: ' + form.url);

    doc.h2('Datos del solicitante');
    var rows = [
      ['Nombre', data.nombre], ['Apellidos', data.apellidos],
      ['Fecha de nacimiento', data.fechaNacimiento], ['Sexo', data.sexo],
      ['Nacionalidad', data.nacionalidad], ['NIE', data.nie],
      ['Pasaporte de tu país (no español)', data.pasaporte], ['Fecha de entrada en España', data.fechaEntrada],
      ['Número de expediente', data.expediente], ['Domicilio', data.domicilio],
      ['Código postal', data.cp], ['Municipio', data.municipio],
      ['Provincia', data.provincia], ['Teléfono', data.telefono], ['Email', data.email]
    ];
    rows.forEach(function (r) { doc.kv(r[0], r[1] || '[completar]'); });

    doc.h2('Datos del procedimiento');
    doc.kv('Trámite', route.title || '—');
    doc.kv('Modalidad / casilla', route.title || '[marcar la que corresponda]');
    doc.kv('Provincia de presentación', data.provincia || '[completar]');
    if (data.observaciones) doc.kv('Observaciones', data.observaciones);

    doc.h2('Documentos que debes llevar');
    (route.docs || []).forEach(function (d) {
      doc.bullet(d.name + (d.where ? ' — ' + d.where : '') + (d.note ? ' (' + d.note + ')' : ''));
    });

    doc.h2('Cómo cumplimentarlo');
    doc.p('1. Abre el enlace oficial y descarga el modelo ' + form.code + '.');
    doc.p('2. Copia cada dato de esta hoja en la casilla correspondiente. Si algo no lo sabes, escribe «[completar]» y consúltalo antes de firmar.');
    doc.p('3. Marca la casilla del trámite: ' + (route.title || 'la que corresponda') + '.');
    doc.p('4. Firma el formulario. La firma debe ser tuya: esta hoja no sustituye al impreso ni a tu firma.');
    doc.p('5. Paga la tasa si el trámite la exige: ' + form.fee + '. Guarda el justificante.');
    doc.p('6. Presenta el formulario con los documentos en ' + form.where + '.');

    doc.hr();
    doc.small('Hoja de apoyo generada por Ruta Legal. No es un formulario oficial ni asesoramiento jurídico. Confirma el modelo vigente en la sede antes de presentarlo.');

    doc.end();
    return assemble(doc.pages, 'Hoja de datos ' + form.code);
  }

  function downloadFormSheet(form, data, route) {
    var bytes = buildFormSheet(form, data, route);
    var blob = new Blob([bytes], { type: 'application/pdf' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'ruta-legal-datos-' + String(form.code).replace(/[^A-Za-z0-9-]/g, '') + '-' + RL.dates.today() + '.pdf';
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(url); a.remove(); }, 800);
  }

  function buildAnswerPDF(c) {
    c = c || {};
    var doc = new Doc();
    doc.begin();
    doc.title('Consulta a una IA');
    doc.small('Generada en tu dispositivo el ' + RL.fmt.date(RL.dates.today(), { year: true }) +
      '. No se ha enviado a ningún servidor.');
    doc.p('Esta respuesta la generó una IA externa. No es asesoramiento jurídico y puede contener errores. Contrástala con la sede oficial o con un abogado de extranjería antes de actuar.', true);
    doc.kv('Fecha', c.date || '');
    doc.h2('Pregunta');
    doc.p(c.question || '(sin pregunta)');
    doc.h2('Respuesta de la IA');
    String(c.answer || '').split(/\n+/).forEach(function (line) {
      if (line.trim()) doc.p(line.trim());
    });
    doc.h2('Contexto enviado');
    doc.p(c.context || c.prompt || '');
    doc.h2('Aviso');
    doc.p('La app no ha verificado esta respuesta. Si la IA cita una norma, una tasa o un plazo, comprueba la fuente oficial. Si hay una orden de salida, una denegación o violencia, busca ayuda profesional antes de actuar.');
    doc.small('Ruta Legal · consulta abierta · ' + RL.CONTENT_DATE);
    doc.end();
    return assemble(doc.pages, 'Consulta a una IA');
  }

  function downloadAnswerPDF(c) {
    var bytes = buildAnswerPDF(c);
    var blob = new Blob([bytes], { type: 'application/pdf' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'ruta-legal-consulta-' + (c.date || RL.dates.today()) + '.pdf';
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(url); a.remove(); }, 800);
  }

  RL.pdf = {
    buildBytes: buildPlanPDF,
    download: download,
    buildFormSheet: buildFormSheet,
    downloadFormSheet: downloadFormSheet,
    buildAnswerPDF: buildAnswerPDF,
    downloadAnswerPDF: downloadAnswerPDF
  };
})();

/* ============================================================
   Ruta Legal · interfaz (asistente, plan, catálogo, documentos)
   ============================================================ */
(function () {
  'use strict';
  var RL = window.RL;
  var $ = RL.dom.$, $$ = RL.dom.$$, esc = RL.dom.esc;
  var fmt = RL.fmt, dates = RL.dates, icons = RL.icons;

  var ui = {
    view: 'inicio',
    step: 0,
    errors: {},
    search: '',
    filter: 'todas',
    dirFilter: 'todas',
    dirSearch: '',
    procFilter: 'todas',
    procSearch: '',
    procMine: false,
    formsFilter: 'todos',
    formsSearch: '',
    aidFilter: 'todas',
    aidSearch: '',
    faqFilter: 'todas',
    faqSearch: '',
    onlineFilter: 'todas',
    onlineSearch: '',
    aiQuestion: '',
    aiPrompt: '',
    aiAnswer: '',
    aiOpts: { includeDocs: true, includeLocation: true, includeNotes: true },
    aiFollowBase: null,
    aiLastId: null
  };

  var VIEWS = ['inicio', 'antes', 'formulario', 'diagnostico', 'plan', 'vias', 'tramites', 'online', 'preguntas', 'derechos', 'directorio', 'consulta', 'docs', 'formularios', 'ayuda'];
  var REGION_LABEL = { latam: 'América Latina', ue: 'Unión Europea', eea: 'Espacio Económico Europeo', eu: 'Europa (otros)', africa: 'África', asia: 'Asia', otro: 'Otros países' };

  /* Perfil de ejemplo para probar la app sin escribir nada. */
  var DEMO = {
    nationality: 'CU', age: 34, location: 'spain', entryMode: 'tourist_visa',
    timeInSpain: '2to3y', entryDate: '2024-03-10', visaExpiry: '2024-06-08',
    empadronado: 'yes', empadronamientoSince: '2024-04-01', empadronamientoGaps: 'no',
    permitStatus: 'none', hasNie: 'yes', regularizationApplied: 'no',
    asylumRequested: 'no', leftSpain: 'no', exitOrder: 'no',
    maritalStatus: 'casada', marriageType: 'civil', spouseInSpain: 'yes', spouseStatus: 'irregular',
    childrenCommon: 1, childrenOwn: 0, childrenPartner: 0, childrenAges: '7', childrenSpanish: 'no',
    housing: 'alquiler_piso', housingProof: 'contract',
    ancestry: 'none', bornInSpain: 'no',
    employment: 'informal', monthsWorked: 20, cotizaciones: 'no',
    monthlyIncome: 950, savings: 1200, jobOffer: 'no', sector: 'cuidados',
    degree: 'fp_medio', spanishLevel: 'nativo', exams: 'not_needed',
    criminalSpain: 'no', criminalOrigin: 'no', healthInsurance: 'none',
    docsBase: ['pasaporte', 'nie', 'certificado_digital', 'cuenta_bancaria', 'contrato_alquiler'],
    docsTramites: [],
    goals: ['regularizar', 'trabajar'], horizon: 'urgent', canLeaveSpain: 'no',
    consent: true, notes: 'Cuido a una señora mayor sin contrato desde que llegué.'
  };

  /* ══════════════════════════════════════════════════════════
     ARRANQUE
     ══════════════════════════════════════════════════════════ */
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    RL.store.load();
    var h = parseHash();
    if (h.view && VIEWS.indexOf(h.view) !== -1) ui.view = h.view;
    var qs = new URLSearchParams(location.search || '');
    if (qs.get('demo') === '1' && !RL.hasSavedProfile()) {
      RL.state.profile = Object.assign({}, DEMO);
      RL.store.save();
    }
    initTheme();
    $('#footerVersion').textContent = 'v' + RL.VERSION + ' · contenido ' + fmt.date(RL.CONTENT_DATE, { year: true });
    bindGlobal();
    bindFields();
    render();
    if (RL.speech) RL.speech.init();
    if (!RL.store.available) warnNoStorage();
  }

  function initTheme() {
    var saved = null;
    try { saved = localStorage.getItem('ruta-legal.theme'); } catch (e) {}
    var theme = saved || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  }

  function bindGlobal() {
    document.addEventListener('click', function (e) {
      var nav = e.target.closest('[data-nav]');
      if (nav) {
        e.preventDefault();
        go(nav.getAttribute('data-nav'));
        return;
      }
      var btn = e.target.closest('[data-action]');
      if (btn) { handleAction(btn.getAttribute('data-action'), btn); }
    });

    $('#themeToggle').addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('ruta-legal.theme', next); } catch (e) {}
    });

    window.addEventListener('hashchange', function () {
      var v = parseHash().view;
      if (v && VIEWS.indexOf(v) !== -1) {
        if (RL.speech && RL.speech.isSpeaking()) RL.speech.stop();
        ui.view = v;
        render();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        closeFormModal();
        var t = $('#toast'); if (t) t.remove();
      }
    });
  }

  function parseHash() {
    var h = (location.hash || '').replace(/^#\/?/, '');
    var parts = h.split('/');
    return { view: parts[0] || 'inicio', id: parts[1] || '' };
  }

  function go(view) {
    if (VIEWS.indexOf(view) === -1) view = 'inicio';
    if (RL.speech && RL.speech.isSpeaking()) RL.speech.stop();
    if (ui.view === 'diagnostico' && view !== 'diagnostico') {
      RL.state.meta.lastStep = ui.step;
      RL.store.save();
    }
    if (view === 'diagnostico' && ui.view !== 'diagnostico') {
      ui.step = RL.state.meta.lastStep || 0;
    }
    ui.view = view;
    ui.errors = {};
    if (location.hash !== '#/' + view) {
      location.hash = '#/' + view;
    } else {
      render();
    }
  }

  function render() {
    VIEWS.forEach(function (v) {
      var el = $('#view-' + v);
      if (el) el.hidden = v !== ui.view;
    });
    $$('.nav__link').forEach(function (b) {
      var on = b.getAttribute('data-nav') === ui.view;
      if (on) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
    });
    $('#globalProgress').hidden = ui.view !== 'diagnostico';

    if (ui.view === 'inicio') renderHome();
    else if (ui.view === 'antes') renderAntes();
    else if (ui.view === 'formulario') renderFormulario();
    else if (ui.view === 'diagnostico') renderWizard();
    else if (ui.view === 'plan') renderPlan();
    else if (ui.view === 'vias') renderCatalog();
    else if (ui.view === 'tramites') renderTramites();
    else if (ui.view === 'online') renderOnline();
    else if (ui.view === 'preguntas') renderPreguntas();
    else if (ui.view === 'derechos') renderDerechos();
    else if (ui.view === 'directorio') renderDirectorio();
    else if (ui.view === 'consulta') renderConsulta();
    else if (ui.view === 'docs') renderDocs();
    else if (ui.view === 'formularios') renderFormularios();
    else if (ui.view === 'ayuda') renderHelp();

    if (RL.seo) RL.seo.apply(ui.view);

    window.scrollTo(0, 0);
    var main = $('#main');
    if (main && ui.view !== 'inicio') main.focus({ preventScroll: true });
  }

  /* ══════════════════════════════════════════════════════════
     FORMULARIO GUIADO 0-11
     ══════════════════════════════════════════════════════════ */
  var formState = null;
  var FORM_TITLES = [
    'Sobre ti y tu familia', 'Datos personales', 'Situación actual', 'Asilo', 'Vivienda',
    'Pareja', 'Hijos', 'Discapacidad', 'Ayudas', 'Objetivos', 'Resumen', 'Documento final'
  ];

  function getForm() {
    var stored = RL.state.profile && RL.state.profile.formulario;
    if (stored && stored !== formState) formState = stored;
    if (formState) return formState;
    formState = (stored && stored.applicant) ? stored : RL.formulario.blank();
    if (!formState.step) formState.step = 0;
    return formState;
  }

  function saveForm() {
    RL.setProfile({ formulario: getForm() });
  }

  function fget(obj, path) {
    var parts = String(path).split('.');
    var cur = obj;
    for (var i = 0; i < parts.length; i++) {
      if (cur == null) return '';
      cur = cur[parts[i]];
    }
    return cur == null ? '' : cur;
  }

  function fset(obj, path, value) {
    var parts = String(path).split('.');
    var cur = obj;
    for (var i = 0; i < parts.length - 1; i++) {
      var k = parts[i];
      if (cur[k] == null) cur[k] = /^\d+$/.test(parts[i + 1]) ? [] : {};
      cur = cur[k];
    }
    cur[parts[parts.length - 1]] = value;
  }

  function fEsc(v) { return esc(v == null ? '' : v); }

  function fInput(path, label, value, type, placeholder) {
    return '<label class="field"><span class="field__label">' + fEsc(label) + '</span>' +
      '<input class="input" type="' + (type || 'text') + '" data-fpath="' + fEsc(path) + '" value="' + fEsc(value) + '" placeholder="' + fEsc(placeholder || '') + '"></label>';
  }

  function fSelect(path, label, value, options) {
    return '<label class="field"><span class="field__label">' + fEsc(label) + '</span>' +
      '<select class="select" data-fpath="' + fEsc(path) + '">' +
      options.map(function (o) { return '<option value="' + fEsc(o.v) + '"' + (String(value) === String(o.v) ? ' selected' : '') + '>' + fEsc(o.l) + '</option>'; }).join('') +
      '</select></label>';
  }

  function fRadio(path, label, value, options) {
    return '<fieldset class="field"><legend class="field__label">' + fEsc(label) + '</legend>' +
      '<div class="option-list">' + options.map(function (o) {
        return '<label class="option"><input type="radio" name="' + fEsc(path) + '" data-fpath="' + fEsc(path) + '" value="' + fEsc(o.v) + '"' + (String(value) === String(o.v) ? ' checked' : '') + '><span class="option__box" aria-hidden="true"></span><span class="option__body"><span class="option__label">' + fEsc(o.l) + '</span></span></label>';
      }).join('') + '</div></fieldset>';
  }

  function fChecks(path, label, values, options) {
    var arr = Array.isArray(values) ? values : [];
    return '<fieldset class="field"><legend class="field__label">' + fEsc(label) + '</legend>' +
      '<div class="option-list">' + options.map(function (o) {
        var on = arr.indexOf(o.v) !== -1;
        return '<label class="option option--check"><input type="checkbox" data-fgroup="' + fEsc(path) + '" value="' + fEsc(o.v) + '"' + (on ? ' checked' : '') + '><span class="option__box" aria-hidden="true"></span><span class="option__body"><span class="option__label">' + fEsc(o.l) + '</span></span></label>';
      }).join('') + '</div></fieldset>';
  }

  function personBlock(obj, prefix, includeHousing, skipBasics, skipIdentity) {
    var F = RL.formulario;
    var basics = '';
    if (!skipBasics) {
      if (!skipIdentity) {
        basics += fInput(prefix + '.name', 'Nombre y apellidos', fget(obj, 'name'));
        basics += fInput(prefix + '.age', 'Edad', fget(obj, 'age'), 'number');
      }
      basics += fInput(prefix + '.nationality', 'Nacionalidad', fget(obj, 'nationality'));
      basics += fInput(prefix + '.phone', 'Teléfono móvil', fget(obj, 'phone'), 'tel');
      basics += fInput(prefix + '.email', 'Email', fget(obj, 'email'), 'email');
      basics += fInput(prefix + '.entryDate', 'Fecha de ingreso en España', fget(obj, 'entryDate'), 'date');
    }
    var h = '<div class="form-grid">' + basics +
      fRadio(prefix + '.familyAbroad', '¿Tienes familia en otro país?', fget(obj, 'familyAbroad'), F.yesNo) +
      fRadio(prefix + '.bringFamily', '¿Quieres traerlos a España?', fget(obj, 'bringFamily'), F.yesNo) +
      fRadio(prefix + '.disability', '¿Tienes discapacidad?', fget(obj, 'disability'), F.yesNo) +
      fSelect(prefix + '.residence', 'Situación actual de residencia', fget(obj, 'residence'), F.residence) +
      fRadio(prefix + '.works', '¿Trabajas?', fget(obj, 'works'), F.yesNo) +
      '</div>';
    if (fget(obj, 'works') === 'si') {
      h += '<div class="form-grid">' +
        fRadio(prefix + '.legalJob', '¿Tu empleo es legal?', fget(obj, 'legalJob'), F.yesNo) +
        fSelect(prefix + '.hours', 'Horas a la semana', fget(obj, 'hours'), [
          { v: '', l: 'Sin indicar' }, { v: '30', l: '30 horas' }, { v: '40', l: '40 horas' }, { v: '50', l: '50 horas o más' }
        ]) +
        fInput(prefix + '.netSalary', 'Sueldo neto mensual (€)', fget(obj, 'netSalary'), 'number') +
        fRadio(prefix + '.bank', '¿Te lo depositan en el banco?', fget(obj, 'bank'), F.yesNo) +
        fInput(prefix + '.jobType', '¿Qué haces? Tipo de empleo', fget(obj, 'jobType'), 'text', 'Ej. cocina, limpieza, construcción') +
        '</div>';
    }
    h += '<div class="form-grid">' +
      fRadio(prefix + '.studies', '¿Estudias?', fget(obj, 'studies'), F.yesNo) +
      (fget(obj, 'studies') === 'si' ? fInput(prefix + '.career', '¿Qué estudias?', fget(obj, 'career'), 'text', 'Ej. FP, grado, curso de español') : '') +
      '</div>';
    if (includeHousing) h += housingBlock(obj, prefix);
    return h;
  }

  function housingBlock(obj, prefix) {
    var F = RL.formulario;
    var h = '<div class="form-grid">' +
      fSelect(prefix + '.housing', '¿Dónde vives?', fget(obj, 'housing'), [
        { v: '', l: 'Sin indicar' }, { v: 'propia', l: 'Vivienda propia' }, { v: 'alquiler', l: 'Alquilo un piso' },
        { v: 'habitacion', l: 'Alquilo una habitación' }, { v: 'compartida', l: 'Comparto con amigo/a o pareja' },
        { v: 'familiar', l: 'Vivo con familiares' }, { v: 'otra', l: 'Otra situación' }
      ]) +
      fRadio(prefix + '.mortgage', '¿Pagas hipoteca?', fget(obj, 'mortgage'), F.yesNo) +
      (fget(obj, 'mortgage') === 'si'
        ? fInput(prefix + '.mortgageAmount', 'Importe mensual de la hipoteca (€)', fget(obj, 'mortgageAmount'), 'number')
        : fInput(prefix + '.housingCost', 'Importe mensual del alquiler o vivienda (€)', fget(obj, 'housingCost'), 'number')) +
      fInput(prefix + '.expenses.luz', 'Luz (€/mes)', fget(obj, 'expenses.luz'), 'number') +
      fInput(prefix + '.expenses.agua', 'Agua (€/mes)', fget(obj, 'expenses.agua'), 'number') +
      fInput(prefix + '.expenses.gas', 'Gas o bombona (€/mes)', fget(obj, 'expenses.gas'), 'number') +
      fInput(prefix + '.expenses.comunidad', 'Comunidad (€/mes)', fget(obj, 'expenses.comunidad'), 'number') +
      fInput(prefix + '.expenses.internet', 'Internet (€/mes)', fget(obj, 'expenses.internet'), 'number') +
      fRadio(prefix + '.computer', '¿Tienes computadora?', fget(obj, 'computer'), F.yesNo) +
      '</div>';
    return h;
  }

  function asylumBlock(obj, prefix) {
    var F = RL.formulario;
    var h = '<div class="form-grid">' +
      fRadio(prefix + '.asylumRequested', '¿Solicitaste asilo en España?', fget(obj, 'asylumRequested'), F.yesNo) +
      '</div>';
    if (fget(obj, 'asylumRequested') === 'si') {
      h += '<div class="form-grid">' +
        fInput(prefix + '.asylumYear', '¿En qué año lo solicitaste?', fget(obj, 'asylumYear'), 'number') +
        fSelect(prefix + '.asylumStatus', 'Situación actual del asilo', fget(obj, 'asylumStatus'), [
          { v: '', l: 'Sin indicar' }, { v: 'esperando', l: 'Esperando resolución' }, { v: 'denegada', l: 'Denegada' },
          { v: 'concedido', l: 'Concedido' }, { v: 'renuncie', l: 'Renuncié / desistí' }
        ]) +
        fInput(prefix + '.asylumDate', 'Fecha del hecho (denegación, concesión o renuncia)', fget(obj, 'asylumDate'), 'date') +
        '</div>';
    }
    return h;
  }

  function documentsBlock(obj, prefix) {
    var F = RL.formulario;
    return fChecks(prefix + '.docs', 'Documentos y credenciales que tienes', fget(obj, 'docs'), F.docs) +
      fRadio(prefix + '.aidReceived', '¿Recibes alguna ayuda?', fget(obj, 'aidReceived'), F.yesNo) +
      (fget(obj, 'aidReceived') === 'si' ? fChecks(prefix + '.aidTypes', '¿Qué ayudas recibes?', fget(obj, 'aidTypes'), F.aidTypes) : '');
  }

  function memberName(obj, kind, index) {
    return fget(obj, 'name') || (kind === 'applicant' ? 'Titular' : kind === 'spouse' ? 'Pareja' : 'Hijo/a ' + (index + 1));
  }

  function syncFormMembers(F) {
    if (F.mode !== 'family') return;
    var count = Math.max(1, Math.min(10, Number(F.familyCount) || 1));
    F.familyCount = count;
    var needed = count - 1;
    F.members = F.members || [];
    while (F.members.length < needed) {
      F.members.push({ name: '', age: '', relation: '', data: RL.formulario.person() });
    }
    if (F.members.length > needed) F.members.length = needed;
  }

  function memberOptions() {
    return [
      { v: '', l: 'Sin indicar' },
      { v: 'esposa', l: 'Esposa' },
      { v: 'pareja_hecho', l: 'Pareja de hecho' },
      { v: 'pareja', l: 'Pareja' },
      { v: 'hijo_comun', l: 'Hijo o hija de ambos' },
      { v: 'hijo_ella', l: 'Hijo o hija de ella' },
      { v: 'hijo_el', l: 'Hijo o hija de él' },
      { v: 'padre_madre_el', l: 'Padre o madre de él' },
      { v: 'padre_madre_ella', l: 'Padre o madre de ella' },
      { v: 'hermano', l: 'Hermano/a' },
      { v: 'otro', l: 'Otro' }
    ];
  }

  function syncFamilyFromMembers(F) {
    if (F.mode !== 'family' || !F.members) return;
    var spouseRelations = ['esposa', 'esposo', 'pareja', 'pareja_hecho'];
    var childRelations = ['hijo', 'hija', 'hijo_comun', 'hijo_ella', 'hijo_el'];
    var spouse = null;
    var childMembers = [];
    F.members.forEach(function (m) {
      if (spouseRelations.indexOf(m.relation) !== -1) spouse = m;
      if (childRelations.indexOf(m.relation) !== -1) childMembers.push(m);
      m.data = m.data || RL.formulario.person();
      if (m.name) m.data.name = m.name;
      if (m.age) m.data.age = m.age;
    });
    if (spouse) {
      if (spouse.name) F.spouse.name = spouse.name;
      if (spouse.age) F.spouse.age = spouse.age;
    }
    if (childMembers.length) {
      while (F.children.length < childMembers.length) F.children.push(RL.formulario.person());
      F.children.length = childMembers.length;
      childMembers.forEach(function (m, i) {
        if (m.name) F.children[i].name = m.name;
        if (m.age) F.children[i].age = m.age;
      });
    }
  }

  function availableGoals(obj) {
    var docs = Array.isArray(obj.docs) ? obj.docs : [];
    var residence = obj.residence || '';
    var blocked = {};
    if (docs.indexOf('nie') !== -1) blocked.nie = true;
    if (docs.indexOf('tie') !== -1) blocked.tie = true;
    if (residence && residence !== 'irregular') {
      blocked.residencia = true;
      blocked[residence] = true;
    }
    if (residence === 'larga_duracion') blocked.larga_duracion = true;
    var goals = RL.formulario.goals.filter(function (g) { return !blocked[g.v]; });
    obj.goals = (obj.goals || []).filter(function (v) {
      return goals.some(function (g) { return g.v === v; });
    });
    return goals;
  }

  function renderFormulario() {
    var host = $('#view-formulario');
    var F = getForm();
    syncFormMembers(F);
    syncFamilyFromMembers(F);
    var step = Math.max(0, Math.min(11, Number(F.step) || 0));
    var total = 12;
    var html = '<div class="wizard"><div class="plan-head"><div><p class="eyebrow">Formulario · Paso ' + step + ' de 11</p>' +
      '<h1>' + fEsc(FORM_TITLES[step]) + '</h1><p class="plan-head__sub">Formulario guiado para ordenar tu caso. Se guarda solo en este dispositivo.</p></div></div>' +
      '<div class="progress" style="margin-bottom:18px"><span style="display:block;height:100%;width:' + Math.round(step / 11 * 100) + '%"></span></div>';

    if (step === 0) {
      html += '<div class="block" style="margin-bottom:18px"><div class="block__head">' + icons.user(18) + '<h2>Sobre ti</h2></div><div class="block__body">' +
        '<div class="form-grid">' +
        fInput('applicant.name', 'Nombre y apellidos', fget(F.applicant, 'name')) +
        fInput('applicant.age', 'Edad', fget(F.applicant, 'age'), 'number') +
        fInput('applicant.nationality', 'Nacionalidad', fget(F.applicant, 'nationality')) +
        fInput('applicant.phone', 'Teléfono móvil', fget(F.applicant, 'phone'), 'tel') +
        fInput('applicant.email', 'Email', fget(F.applicant, 'email'), 'email') +
        fInput('applicant.entryDate', 'Fecha de ingreso en España', fget(F.applicant, 'entryDate'), 'date') +
        '</div></div></div>';

      html += '<div class="block"><div class="block__head">' + icons.family(18) + '<h2>Consulta para un individuo o grupo familiar</h2></div><div class="block__body">' +
        '<div class="option-list">' +
        '<label class="option"><input type="radio" name="form-mode" data-fpath="mode" value="individual"' + (F.mode === 'individual' ? ' checked' : '') + '><span class="option__box"></span><span class="option__body"><span class="option__label">Un individuo</span></span></label>' +
        '<label class="option"><input type="radio" name="form-mode" data-fpath="mode" value="family"' + (F.mode === 'family' ? ' checked' : '') + '><span class="option__box"></span><span class="option__body"><span class="option__label">Grupo familiar</span></span></label>' +
        '</div>';
      if (F.mode === 'family') {
        html += '<div style="margin-top:18px"><h3>Cantidad de integrantes</h3>' +
          '<p class="muted">Contándote a ti. Si eliges 3, se crearán dos filas para que indiques el vínculo y la edad de cada familiar.</p>' +
          '<div class="form-grid">' + fSelect('familyCount', '¿Cuántas personas formáis el grupo?', F.familyCount, [
            { v: '1', l: '1 persona (solo tú)' }, { v: '2', l: '2 personas' }, { v: '3', l: '3 personas' },
            { v: '4', l: '4 personas' }, { v: '5', l: '5 personas' }, { v: '6', l: '6 personas' },
            { v: '7', l: '7 personas' }, { v: '8', l: '8 personas' }, { v: '9', l: '9 personas' }, { v: '10', l: '10 personas o más' }
          ]) + '</div>' +
          ((F.members || []).length ? '<div style="margin-top:12px">' + F.members.map(function (m, i) {
            return '<div class="family-child" style="margin-top:10px"><div class="flex" style="justify-content:space-between"><strong>Familiar ' + (i + 1) + '</strong><button class="btn btn--ghost btn--sm" type="button" data-form-action="remove-member" data-index="' + i + '">Quitar</button></div><div class="form-grid">' +
              fSelect('members.' + i + '.relation', 'Relación', m.relation, memberOptions()) +
              fInput('members.' + i + '.age', 'Edad', m.age, 'number') +
              fInput('members.' + i + '.name', 'Nombre y apellidos', m.name) +
              '</div></div>';
          }).join('') + '</div>' : '') +
          '</div>';
      }
      html += '</div></div>';
    } else if (step === 1) {
      html += '<div class="block"><div class="block__head">' + icons.user(18) + '<h2>Datos personales</h2></div><div class="block__body">' + personBlock(F.applicant, 'applicant', false, true) + '</div></div>';
    } else if (step === 2) {
      html += '<div class="block"><div class="block__head">' + icons.doc(18) + '<h2>Situación actual</h2></div><div class="block__body">' + documentsBlock(F.applicant, 'applicant') + '</div></div>';
    } else if (step === 3) {
      html += '<div class="block"><div class="block__head">' + icons.shield(18) + '<h2>Asilo</h2></div><div class="block__body">' + asylumBlock(F.applicant, 'applicant') + '</div></div>';
    } else if (step === 4) {
      html += '<div class="block"><div class="block__head">' + icons.home(18) + '<h2>Vivienda y gastos</h2></div><div class="block__body">' + housingBlock(F.applicant, 'applicant') + '</div></div>';
    } else if (step === 5) {
      var spouseMember = (F.members || []).filter(function (m) {
        return ['esposa', 'esposo', 'pareja', 'pareja_hecho'].indexOf(m.relation) !== -1;
      })[0];
      html += '<div class="block"><div class="block__head">' + icons.family(18) + '<h2>Pareja: datos, documentos, asilo y vivienda</h2></div><div class="block__body">' +
        (spouseMember ? '<div class="callout callout--info">' + icons.info(16) + '<div><strong>' + fEsc(spouseMember.name || 'Pareja') + ' · ' + fEsc(spouseMember.age || 'edad sin indicar') + '</strong><p>Nombre y edad cargados desde el paso 0. Si quieres cambiarlos, vuelve a «Sobre ti y tu familia».</p></div></div>' : '') +
        personBlock(F.spouse, 'spouse', true, false, !!spouseMember) + documentsBlock(F.spouse, 'spouse') + asylumBlock(F.spouse, 'spouse') + '</div></div>';
    } else if (step === 6) {
      var childMembers = (F.members || []).filter(function (m) {
        return ['hijo', 'hija', 'hijo_comun', 'hijo_ella', 'hijo_el'].indexOf(m.relation) !== -1;
      });
      html += '<div class="block"><div class="block__head">' + icons.family(18) + '<h2>Hijos</h2></div><div class="block__body">' +
        '<p class="muted">Añade cada hijo. Si es menor, completa sus datos y estudios; si es mayor, añade también trabajo y vivienda.</p>' +
        '<button class="btn btn--soft btn--sm" type="button" data-form-action="add-child">+ Añadir hijo/a</button>' +
        (F.children.length ? F.children.map(function (ch, i) {
          var lm = childMembers[i];
          return '<div class="family-child" style="margin-top:14px"><div class="flex" style="justify-content:space-between"><h3>Hijo/a ' + (i + 1) + (lm && lm.name ? ': ' + fEsc(lm.name) : '') + '</h3><button class="btn btn--ghost btn--sm" type="button" data-form-action="remove-child" data-index="' + i + '">Quitar</button></div>' +
            (lm ? '<p class="muted">Edad: ' + fEsc(lm.age || 'sin indicar') + ' · vínculo: ' + fEsc(lm.relation) + '. Nombre y edad cargados desde el paso 0.</p>' : '') +
            personBlock(ch, 'children.' + i, true, false, !!lm) +
            '<div class="form-grid">' +
            fInput('children.' + i + '.educationLevel', 'Estudios actuales', fget(ch, 'educationLevel'), 'text', 'ESO, Bachillerato, FP, universidad…') +
            '</div></div>';
        }).join('') : '<p class="muted">Todavía no has añadido hijos.</p>');
      var otherMembers = (F.members || []).map(function (m, i) { return { m: m, i: i }; }).filter(function (x) {
        return ['pareja', 'esposa', 'esposo', 'pareja_hecho', 'hijo', 'hija', 'hijo_comun', 'hijo_ella', 'hijo_el'].indexOf(x.m.relation) === -1;
      });
      if (otherMembers.length) {
        html += '<div style="margin-top:18px"><h3>Otros integrantes del grupo</h3><p class="muted">Padres, hermanos u otros convivientes. Completa sus datos, documentos, asilo y vivienda.</p>' +
          otherMembers.map(function (x) {
            return '<div class="family-child" style="margin-top:14px"><h3>' + fEsc(x.m.name || 'Integrante ' + (x.i + 1)) + ' · ' + fEsc(x.m.relation || 'otro') + ' · ' + fEsc(x.m.age || 'edad sin indicar') + '</h3>' +
              '<p class="muted">Nombre y edad cargados desde el paso 0.</p>' +
              personBlock(x.m.data || {}, 'members.' + x.i + '.data', true, false, true) +
              '<div class="form-grid">' + fInput('members.' + x.i + '.educationLevel', 'Estudios actuales', x.m.educationLevel || '', 'text', 'ESO, Bachillerato, FP, universidad…') + '</div></div>';
          }).join('') + '</div>';
      }
      html += '</div></div>';
    } else if (step === 7) {
      html += '<div class="block"><div class="block__head">' + icons.shield(18) + '<h2>Discapacidad y dependencia</h2></div><div class="block__body">';
      var members = [{ key: 'applicant', label: 'Titular', obj: F.applicant }];
      if (F.mode === 'family') members.push({ key: 'spouse', label: 'Pareja', obj: F.spouse });
      F.children.forEach(function (ch, i) { members.push({ key: 'children.' + i, label: 'Hijo/a ' + (i + 1), obj: ch }); });
      (F.members || []).forEach(function (m, i) { members.push({ key: 'members.' + i + '.data', label: m.name || ('Integrante ' + (i + 1)), obj: m.data || {} }); });
      var any = false;
      members.forEach(function (m) {
        if (fget(m.obj, 'disability') !== 'si') return;
        any = true;
        html += '<div class="family-child"><h3>' + fEsc(m.label) + '</h3><div class="form-grid">' +
          fRadio(m.key + '.disabilityRecognized', '¿Reconocida en España?', fget(m.obj, 'disabilityRecognized'), RL.formulario.yesNo) +
          fInput(m.key + '.disabilityDegree', 'Nivel concedido', fget(m.obj, 'disabilityDegree'), 'text', '33 %, 45 %, 65 %…') +
          fSelect(m.key + '.disabilityExpiryStatus', '¿El certificado tiene vencimiento?', fget(m.obj, 'disabilityExpiryStatus'), [
            { v: '', l: 'No indicado' }, { v: 'yes', l: 'Sí, tiene fecha' },
            { v: 'no', l: 'No caduca / sin vencimiento' }, { v: 'dontknow', l: 'No lo sé' }
          ]) +
          (fget(m.obj, 'disabilityExpiryStatus') === 'yes' ? fInput(m.key + '.disabilityExpiry', 'Fecha de vencimiento', fget(m.obj, 'disabilityExpiry'), 'date') : '') +
          fRadio(m.key + '.dependency', '¿Tienes dependencia reconocida?', fget(m.obj, 'dependency'), RL.formulario.yesNo) +
          fRadio(m.key + '.aidReceived', '¿Recibes ayuda o subsidio?', fget(m.obj, 'aidReceived'), RL.formulario.yesNo) +
          '</div>';
        if (fget(m.obj, 'aidReceived') === 'si') html += fChecks(m.key + '.aidTypes', '¿Qué ayudas?', fget(m.obj, 'aidTypes'), RL.formulario.aidTypes);
        html += '</div>';
      });
      if (!any) html += '<p class="muted">Nadie ha marcado discapacidad. Este paso se puede saltar.</p>';
      html += '</div></div>';
    } else if (step === 8) {
      html += '<div class="block"><div class="block__head">' + icons.family(18) + '<h2>Ayudas que recibes</h2></div><div class="block__body">' +
        fRadio('applicant.aidReceived', '¿Recibes ayudas económicas, alimentos, luz, gas, alquiler…?', fget(F.applicant, 'aidReceived'), RL.formulario.yesNo) +
        (fget(F.applicant, 'aidReceived') === 'si' ? fChecks('applicant.aidTypes', '¿Qué recibes?', fget(F.applicant, 'aidTypes'), RL.formulario.aidTypes) + fChecks('applicant.aidWho', '¿Quién te ayuda?', fget(F.applicant, 'aidWho'), RL.formulario.aidWho) + fInput('applicant.aidDetail', 'Detalle (opcional)', fget(F.applicant, 'aidDetail')) : '') +
        '</div></div>';
    } else if (step === 9) {
      html += '<div class="block"><div class="block__head">' + icons.route(18) + '<h2>¿Qué esperas conseguir?</h2></div><div class="block__body">' +
        '<div class="callout callout--info">' + icons.info(16) + '<div><p>No mostramos objetivos que ya constan en documentos o residencia. Si algo cambió, vuelve al paso de situación actual.</p></div></div>';
      html += '<h3>Titular</h3>' + fChecks('applicant.goals', 'Objetivos', fget(F.applicant, 'goals'), availableGoals(F.applicant));
      if (F.mode === 'family') {
        html += '<h3>Pareja</h3>' + fChecks('spouse.goals', 'Objetivos', fget(F.spouse, 'goals'), availableGoals(F.spouse));
        F.children.forEach(function (ch, i) { html += '<h3>Hijo/a ' + (i + 1) + '</h3>' + fChecks('children.' + i + '.goals', 'Objetivos', fget(ch, 'goals'), availableGoals(ch)); });
        (F.members || []).forEach(function (m, i) {
          if (['pareja', 'esposa', 'esposo', 'pareja_hecho', 'hijo', 'hija', 'hijo_comun', 'hijo_ella', 'hijo_el'].indexOf(m.relation) !== -1) return;
          html += '<h3>' + fEsc(m.name || ('Integrante ' + (i + 1))) + '</h3>' + fChecks('members.' + i + '.data.goals', 'Objetivos', fget(m.data || {}, 'goals'), availableGoals(m.data || {}));
        });
      }
      html += '</div></div>';
    } else if (step === 10) {
      html += formSummaryHTML(F, true);
    } else {
      html += formSummaryHTML(F, false);
      html += '<div class="callout callout--info">' + icons.doc(18) + '<div><strong>Documento preparado</strong><p>Revisa el resumen y pulsa imprimir. En el diálogo del navegador elige «Guardar como PDF». Puedes quitar secciones en el paso anterior.</p><button class="btn btn--primary mt-2" type="button" data-form-action="print">Imprimir / guardar PDF</button></div></div>';
    }

    html += '<div class="wizard__nav" style="display:flex;justify-content:space-between;gap:10px;margin-top:18px">' +
      '<button class="btn btn--ghost" type="button" data-form-action="prev"' + (step === 0 ? ' disabled' : '') + '>Atrás</button>' +
      '<button class="btn btn--primary" type="button" data-form-action="next">' + (step === 11 ? 'Volver a empezar' : 'Siguiente') + '</button></div>';
    html += '</div>';
    host.innerHTML = html;

    host.querySelectorAll('[data-fpath], [data-fgroup]').forEach(function (el) {
      var ev = el.type === 'checkbox' || el.type === 'radio' || el.tagName === 'SELECT' ? 'change' : 'input';
      el.addEventListener(ev, function () {
        if (el.hasAttribute('data-fgroup')) {
          var groupPath = el.getAttribute('data-fgroup');
          var vals = [];
          host.querySelectorAll('[data-fgroup="' + groupPath + '"]:checked').forEach(function (x) { vals.push(x.value); });
          fset(F, groupPath, vals);
        } else {
          fset(F, el.getAttribute('data-fpath'), el.value);
        }
        if (el.getAttribute('data-fpath') === 'familyCount') {
          syncFormMembers(F);
          saveForm();
          renderFormulario();
          return;
        }
        saveForm();
        if (el.type === 'radio' || el.tagName === 'SELECT') renderFormulario();
      });
    });
    host.querySelectorAll('[data-form-action]').forEach(function (b) {
      b.addEventListener('click', function () { handleFormAction(b.getAttribute('data-form-action'), b); });
    });
    host.querySelectorAll('[data-fprint]').forEach(function (cb) {
      cb.addEventListener('change', function () {
        if (!F.print) F.print = {};
        F.print[cb.getAttribute('data-fprint')] = cb.checked;
        saveForm();
      });
    });
  }

  function formSummaryHTML(F, editable) {
    var income = (Number(fget(F.applicant, 'netSalary')) || 0) + (F.mode === 'family' ? Number(fget(F.spouse, 'netSalary')) || 0 : 0);
    var housing = Number(fget(F.applicant, 'housingCost')) || 0;
    var mortgage = fget(F.applicant, 'mortgage') === 'si' ? (Number(fget(F.applicant, 'mortgageAmount')) || 0) : 0;
    var exp = mortgage > 0 ? mortgage : housing;
    ['luz', 'agua', 'gas', 'comunidad', 'internet'].forEach(function (k) { exp += Number(fget(F.applicant, 'expenses.' + k)) || 0; });
    var balance = income - exp;
    var members = [{ key: 'applicant', label: 'Titular', obj: F.applicant }];
    var childMeta = [];
    if (F.mode === 'family') {
      members.push({ key: 'spouse', label: 'Pareja', obj: F.spouse });
      childMeta = (F.members || []).filter(function (m) {
        return ['hijo', 'hija', 'hijo_comun', 'hijo_ella', 'hijo_el'].indexOf(m.relation) !== -1;
      });
      F.children.forEach(function (ch, i) { members.push({ key: 'children.' + i, label: 'Hijo/a ' + (i + 1), obj: ch }); });
    }
    var html = '<div class="block"><div class="block__head">' + icons.doc(18) + '<h2>Resumen del caso</h2></div><div class="block__body">';
    if (editable) {
      html += '<p class="muted">Marca qué quieres que aparezca en el PDF. Nada se envía a internet.</p><div class="option-list">' +
        ['applicant', 'spouse', 'children', 'disability', 'aid', 'housing', 'goals', 'economy'].map(function (k) {
          return '<label class="option option--check"><input type="checkbox" data-fprint="' + k + '"' + (F.print && F.print[k] !== false ? ' checked' : '') + '><span class="option__box"></span><span class="option__body"><span class="option__label">' + fEsc({ applicant: 'Titular', spouse: 'Pareja', children: 'Hijos', disability: 'Discapacidad', aid: 'Ayudas', housing: 'Vivienda y gastos', goals: 'Objetivos', economy: 'Resumen económico' }[k]) + '</span></span></label>';
        }).join('') + '</div>';
    }
    html += '<div class="kv">' +
      '<div class="kv__row"><dt>Ingreso neto mensual</dt><dd>' + income.toFixed(2) + ' €</dd></div>' +
      '<div class="kv__row"><dt>Gastos fijos declarados</dt><dd>' + exp.toFixed(2) + ' €</dd></div>' +
      '<div class="kv__row"><dt>Diferencia</dt><dd><strong>' + balance.toFixed(2) + ' €</strong></dd></div>' +
      '</div>';
    if (F.print && F.print.applicant !== false) {
      html += '<h3>Titular</h3>' + summaryPerson(F.applicant);
    }
    if (F.mode === 'family' && F.print && F.print.spouse !== false) html += '<h3>Pareja</h3>' + summaryPerson(F.spouse);
    if (F.mode === 'family' && F.print && F.print.children !== false) {
      F.children.forEach(function (ch, i) {
        var meta = childMeta[i];
        var rel = meta ? ({ hijo_comun: 'Hijo o hija de ambos', hijo_ella: 'Hijo o hija de ella', hijo_el: 'Hijo o hija de él', hijo: 'Hijo', hija: 'Hija' }[meta.relation] || meta.relation) : '';
        html += '<h3>Hijo/a ' + (i + 1) + (rel ? ' · ' + fEsc(rel) : '') + (meta && meta.age ? ' · ' + fEsc(meta.age) + ' años' : '') + '</h3>' + summaryPerson(ch);
      });
      (F.members || []).forEach(function (m, i) {
        if (['pareja', 'esposa', 'esposo', 'pareja_hecho', 'hijo', 'hija', 'hijo_comun', 'hijo_ella', 'hijo_el'].indexOf(m.relation) !== -1) return;
        html += '<h3>' + fEsc(m.name || ('Integrante ' + (i + 1))) + ' · ' + fEsc(m.relation || 'otro') + '</h3>' + summaryPerson(m.data || {});
      });
    }
    if (F.print && F.print.disability !== false) {
      var dis = members.filter(function (m) { return fget(m.obj, 'disability') === 'si'; });
      if (dis.length) html += '<h3>Discapacidad</h3>' + dis.map(function (m) { return '<p><strong>' + fEsc(m.label) + ':</strong> ' + fEsc(fget(m.obj, 'disabilityDegree') || 'sin grado indicado') + ' · dependencia: ' + fEsc(fget(m.obj, 'dependency') || 'no indicada') + '</p>'; }).join('');
    }
    if (F.print && F.print.aid !== false && fget(F.applicant, 'aidReceived') === 'si') {
      html += '<h3>Ayudas</h3><p>' + fEsc((fget(F.applicant, 'aidTypes') || []).join(', ')) + ' · ' + fEsc((fget(F.applicant, 'aidWho') || []).join(', ')) + '</p>';
    }
    if (F.print && F.print.housing !== false) {
      html += '<h3>Vivienda y gastos</h3><p>' + fEsc(fget(F.applicant, 'housing') || 'Sin indicar') + ' · ' + exp.toFixed(2) + ' €/mes' +
        (fget(F.applicant, 'mortgage') === 'si' ? ' · hipoteca: ' + fEsc(fget(F.applicant, 'mortgageAmount') || '0') + ' €' : '') + '</p>';
    }
    if (F.print && F.print.goals !== false) {
      html += '<h3>Objetivos</h3><p><strong>Titular:</strong> ' + fEsc((fget(F.applicant, 'goals') || []).join(', ') || 'Sin indicar') + '</p>';
      if (F.mode === 'family') html += '<p><strong>Pareja:</strong> ' + fEsc((fget(F.spouse, 'goals') || []).join(', ') || 'Sin indicar') + '</p>';
    }
    return html + '</div></div>';
  }

  function summaryPerson(p) {
    function label(list, value) {
      var found = (list || []).filter(function (x) { return x.v === value || x.value === value; })[0];
      return found ? (found.l || found.label) : value;
    }
    var docs = (p.docs || []).map(function (v) { return label(RL.formulario.docs, v); }).filter(Boolean).join(', ');
    var aid = (p.aidTypes || []).map(function (v) { return label(RL.formulario.aidTypes, v); }).filter(Boolean).join(', ');
    var goals = (p.goals || []).map(function (v) { return label(RL.formulario.goals, v); }).filter(Boolean).join(', ');
    var rows = [
      ['Nombre', p.name], ['Edad', p.age], ['Nacionalidad', p.nationality],
      ['Teléfono', p.phone], ['Email', p.email], ['Entrada en España', p.entryDate],
      ['Residencia', label(RL.formulario.residence, p.residence)],
      ['Documentos', docs], ['Trabaja', p.works], ['Empleo legal', p.legalJob],
      ['Horas', p.hours], ['Sueldo neto', p.netSalary ? p.netSalary + ' €' : ''],
      ['Tipo de empleo', p.jobType], ['Estudia', p.studies], ['Estudios', p.career || p.educationLevel],
      ['Discapacidad', p.disability], ['Reconocida', p.disabilityRecognized],
      ['Grado', p.disabilityDegree],
      ['Vencimiento', p.disabilityExpiryStatus === 'no' ? 'No caduca / sin vencimiento' : (p.disabilityExpiryStatus === 'yes' ? p.disabilityExpiry : p.disabilityExpiryStatus)],
      ['Dependencia', p.dependency], ['Ayudas', p.aidReceived],
      ['Tipos de ayuda', aid], ['Objetivos', goals],
      ['Asilo', p.asylumRequested], ['Estado del asilo', p.asylumStatus]
    ].filter(function (r) { return r[1] !== '' && r[1] != null; });
    return '<dl class="kv">' + rows.map(function (r) { return '<div class="kv__row"><dt>' + fEsc(r[0]) + '</dt><dd>' + fEsc(r[1]) + '</dd></div>'; }).join('') + '</dl>';
  }

  function formHasDisability(F) {
    var members = [F.applicant, F.spouse].concat(F.children || []);
    return members.some(function (m) { return m && m.disability === 'si'; });
  }

  function formNextIndex(F, current) {
    var next = current + 1;
    while (next < 12) {
      if (next === 3 && F.applicant.asylumRequested !== 'si') { next++; continue; }
      if (next === 5 && F.mode !== 'family') { next++; continue; }
      if (next === 6 && !(F.children || []).length) { next++; continue; }
      if (next === 7 && !formHasDisability(F)) { next++; continue; }
      if (next === 8 && F.applicant.aidReceived !== 'si') { next++; continue; }
      break;
    }
    return Math.min(11, next);
  }

  function formPrevIndex(F, current) {
    var prev = current - 1;
    while (prev > 0) {
      if (prev === 3 && F.applicant.asylumRequested !== 'si') { prev--; continue; }
      if (prev === 5 && F.mode !== 'family') { prev--; continue; }
      if (prev === 6 && !(F.children || []).length) { prev--; continue; }
      if (prev === 7 && !formHasDisability(F)) { prev--; continue; }
      if (prev === 8 && F.applicant.aidReceived !== 'si') { prev--; continue; }
      break;
    }
    return Math.max(0, prev);
  }

  function handleFormAction(action, btn) {
    var F = getForm();
    saveForm();
    if (action === 'add-member') {
      F.members = F.members || [];
      F.members.push({ name: '', age: '', relation: '', data: RL.formulario.person() });
      F.familyCount = F.members.length + 1;
      saveForm(); renderFormulario(); return;
    }
    if (action === 'remove-member') {
      F.members.splice(Number(btn.getAttribute('data-index')), 1);
      F.familyCount = F.members.length + 1;
      saveForm(); renderFormulario(); return;
    }
    if (action === 'add-child') {
      F.children.push(RL.formulario.person());
      saveForm(); renderFormulario(); return;
    }
    if (action === 'remove-child') {
      F.children.splice(Number(btn.getAttribute('data-index')), 1); saveForm(); renderFormulario(); return;
    }
    if (action === 'print') { window.print(); return; }
    if (action === 'next') {
      if (F.step >= 11) { F.step = 0; saveForm(); renderFormulario(); return; }
      F.step = formNextIndex(F, F.step); saveForm(); renderFormulario();
      window.scrollTo(0, 0);
      return;
    }
    if (action === 'prev') {
      F.step = formPrevIndex(F, F.step); saveForm(); renderFormulario();
      window.scrollTo(0, 0);
    }
  }

  /* ══════════════════════════════════════════════════════════
     MI EXPERIENCIA
     ══════════════════════════════════════════════════════════ */
  function renderAntes() {
    var host = $('#view-antes');
    var A = RL.antes;
    if (!A) {
      host.innerHTML = emptyState('Contenido no disponible', 'No se ha cargado la guía previa a la emigración.', 'Volver al inicio', 'inicio');
      return;
    }
    var html = '<div class="plan-head"><div><p class="eyebrow">' + esc(A.eyebrow) + '</p><h1>' + esc(A.title) + '</h1>' +
      '<p class="plan-head__sub">' + esc(A.intro) + '</p></div></div>';

    html += '<div class="callout callout--warn">' + icons.alert(18) + '<div><strong>Testimonio personal, no una verdad universal</strong><p>' + esc(A.warning) + '</p></div></div>';

    html += '<div class="block" style="margin-bottom:18px"><div class="block__head">' + icons.check(18) + '<h2>' + esc(A.goodTitle) + '</h2></div><div class="block__body"><ul style="padding-left:18px;font-size:.9rem;color:var(--ink-2)">' +
      A.good.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div></div>';

    A.sections.forEach(function (s) {
      html += '<div class="block" style="margin-bottom:18px"><div class="block__head">' + icons.info(18) + '<h2>' + esc(s.title) + '</h2></div><div class="block__body"><ul style="padding-left:18px;font-size:.9rem;color:var(--ink-2);line-height:1.65">' +
        s.items.map(function (x) { return '<li style="margin-bottom:9px">' + esc(x) + '</li>'; }).join('') + '</ul></div></div>';
    });

    html += '<div class="callout callout--info" style="margin-bottom:18px">' + icons.route(18) + '<div><strong>Resumen</strong><p>' + esc(A.closing) + '</p></div></div>';
    html += '<div class="flex" style="flex-wrap:wrap"><button class="btn btn--primary" data-nav="diagnostico">' + icons.route(15) + ' Empezar mi diagnóstico</button>' +
      '<button class="btn btn--soft" data-nav="ayuda">' + icons.help(15) + ' Ver recursos y ayuda</button></div>';

    host.innerHTML = html;
  }

  /* ══════════════════════════════════════════════════════════
     INICIO
     ══════════════════════════════════════════════════════════ */
  function renderHome() {
    var hint = $('#resumeHint');
    if (RL.hasSavedProfile()) {
      var p = RL.profile();
      hint.hidden = false;
      hint.innerHTML = 'Tienes un diagnóstico guardado (' + esc(RL.countryName(p.nationality)) +
        '). <a href="#/plan" data-nav="plan">Ver mi plan</a> o <a href="#/diagnostico" data-nav="diagnostico">revisar mis respuestas</a>.';
    } else {
      hint.hidden = true;
      hint.textContent = '';
    }
  }

  /* ══════════════════════════════════════════════════════════
     ASISTENTE
     ══════════════════════════════════════════════════════════ */
  function renderWizard() {
    var steps = RL.questions.visibleSteps(RL.profile());
    if (!steps.length) steps = RL.questions.steps;
    if (ui.step >= steps.length) ui.step = steps.length - 1;
    if (ui.step < 0) ui.step = 0;
    var step = steps[ui.step];
    var p = RL.profile();
    var total = steps.length;

    var stepTpl = (RL.i18n && RL.i18n.t('wizard.step')) || 'Paso {n} de {total}';
    $('#wizardStepLabel').textContent = stepTpl.replace('{n}', ui.step + 1).replace('{total}', total);
    $('#wizardIntro').textContent = step.intro;
    $('#t-wizard').textContent = step.title;
    $('#wizardError').hidden = true;

    var pct = Math.round(((ui.step) / total) * 100);
    setProgress(pct);

    var fields = RL.questions.visibleFields(step, p);
    var html = fields.map(function (f, i) { return fieldHTML(f, p, ui.errors[f.id]); }).join('');
    if (step && step.id === 'general' && (Number(p.childrenPartner) || 0) > 0) {
      html += '<div class="callout callout--info" style="margin-top:14px">' + icons.family(16) +
        '<div><strong>Hijos solo de tu pareja: ' + p.childrenPartner + '</strong><p>Si cargaste más de los que son, puedes quitar el último sin salir de este paso.</p>' +
        '<button class="btn btn--ghost btn--sm mt-2" type="button" data-action="remove-partner-child">− Quitar el último</button></div></div>';
    }
    $('#wizardFields').innerHTML = html;

    $('#prevBtn').style.visibility = ui.step === 0 ? 'hidden' : 'visible';
    var nextLabel = ui.step === total - 1 ? ((RL.i18n && RL.i18n.t('wizard.finish')) || 'Ver mi plan') : ((RL.i18n && RL.i18n.t('wizard.next')) || 'Continuar');
    $('#nextBtn').textContent = nextLabel;
  }

  function setProgress(pct) {
    var w = $('#wizardProgress');
    w.querySelector('span').style.width = pct + '%';
    w.setAttribute('aria-valuenow', String(pct));
    var g = $('#globalProgress');
    if (g) g.querySelector('span').style.width = pct + '%';
  }

  function familyEditorHTML(p) {
    var d = RL.derive(p);
    var common = d.childrenCommon || 0;
    var own = d.childrenOwn || 0;
    var partnerOnly = d.childrenPartner || 0;
    var total = d.childrenCount || 0;
    var relations = [];
    for (var c = 0; c < common; c++) relations.push('common');
    for (var o = 0; o < own; o++) relations.push('own');
    for (var q = 0; q < partnerOnly; q++) relations.push('partner');
    var relLabels = { common: 'Hijo o hija de ambos', own: 'Hijo o hija solo tuyo/a', partner: 'Hijo o hija solo de tu pareja' };

    var html = '<div class="family-editor">';
    html += '<div class="callout callout--info">' + icons.family(18) + '<div><strong>Estos datos son de tu familia</strong><p>No son sobre ti. Rellena la pareja y cada hijo; si un dato no lo sabes, déjalo en blanco.</p></div></div>';

    if (d.couple) {
      html += '<div class="block" style="margin-bottom:14px"><div class="block__head">' + icons.family(18) + '<h3>Tu pareja</h3></div><div class="block__body">' +
        '<div class="form-grid">' +
        familyInput('partnerName', 'Nombre y apellidos', p.partnerName) +
        familyInput('partnerAge', 'Edad', p.partnerAge, 'number') +
        familyInput('partnerNationality', 'Nacionalidad', p.partnerNationality) +
        familyInput('partnerIncome', 'Ingresos mensuales aproximados (€)', p.partnerIncome, 'number') +
        familySelect('partnerLegalStatus', 'Situación legal de tu pareja', p.partnerLegalStatus || '', [
          ['', 'No indicado'], ['spanish', 'Española'], ['eu', 'UE/EEE'], ['residence', 'Residencia española en vigor'],
          ['expired', 'Residencia caducada'], ['asylum', 'Asilo en trámite'], ['irregular', 'Irregular'],
          ['tourist', 'Turista / estancia'], ['outside', 'Fuera de España'], ['dontknow', 'No lo sé']
        ]) +
        familySelect('partnerTimeInSpain', 'Tiempo de tu pareja en España', p.partnerTimeInSpain || '', [
          ['', 'No indicado'], ['lt1', 'Menos de 1 año'], ['1to2', '1-2 años'], ['2to3', '2-3 años'],
          ['3plus', 'Más de 3 años'], ['not_spain', 'No está en España'], ['dontknow', 'No lo sé']
        ]) +
        familySelect('partnerNeed', '¿Qué necesita tu pareja?', p.partnerNeed || '', [
          ['', 'No indicado'], ['regularizar', 'Regularizarse'], ['trabajar', 'Trabajar'],
          ['estudiar', 'Estudiar'], ['renovar', 'Renovar su permiso'], ['nacionalidad', 'Nacionalidad'],
          ['reagrupar', 'Venir a España'], ['nothing', 'Nada'], ['dontknow', 'No lo sé']
        ]) +
        '</div>' +
        '<div class="callout callout--info" style="margin:14px 0 0">' + icons.family(16) +
        '<div><strong>¿Tu pareja tiene hijos de otra relación?</strong><p>Cárgalos aquí. Se añadirán como «Hijo solo de tu pareja» y podrás completar su ficha (edad, residencia, estudios, discapacidad…).</p>' +
        '<div class="flex" style="flex-wrap:wrap;margin-top:8px">' +
        '<button class="btn btn--soft btn--sm" type="button" data-action="add-partner-child">+ Añadir hijo/a de mi pareja</button>' +
        (partnerOnly > 0 ? '<button class="btn btn--ghost btn--sm" type="button" data-action="remove-partner-child">− Quitar el último</button><span class="chip">' + partnerOnly + ' cargado(s)</span>' : '') +
        '</div></div></div></div></div>';
    }

    if (total > 0) {
      html += '<div class="block"><div class="block__head">' + icons.family(18) + '<h3>Hijos (' + total + ')</h3></div><div class="block__body">';
      if (p.familyNumerosa === 'yes') {
        html += '<div class="callout callout--warn" style="margin:0 0 12px">' + icons.alert(16) + '<div><strong>Familia numerosa</strong><p>Ya nos has dicho que tenéis título de familia numerosa. Revisa que estén cargados todos los hijos: no volveremos a preguntarte si lo sois.</p></div></div>';
      }
      for (var i = 1; i <= total; i++) {
        var rel = p['child' + i + 'Relation'] || relations[i - 1] || 'own';
        var childDisability = p['child' + i + 'Disability'] || '';
        var childDisabilityDetails = '';
        if (childDisability === 'yes' || childDisability === 'in_progress') {
          var expiryStatus = p['child' + i + 'DisabilityExpiryStatus'] || (p['child' + i + 'DisabilityExpiry'] ? 'yes' : 'no');
          childDisabilityDetails =
            familySelect('child' + i + 'DisabilityRecognized', '¿Discapacidad reconocida?', p['child' + i + 'DisabilityRecognized'] || '', [
              ['', 'No indicado'], ['yes', 'Sí'], ['in_progress', 'En trámite'], ['no', 'No'], ['dontknow', 'No lo sé']
            ]) +
            familySelect('child' + i + 'DisabilityDegree', 'Grado de discapacidad', p['child' + i + 'DisabilityDegree'] || '', [
              ['', 'No indicado'], ['33_44', '33-44 %'], ['45_64', '45-64 %'], ['65_mas', '65 % o más'], ['dontknow', 'No lo sé']
            ]) +
            familySelect('child' + i + 'DisabilityExpiryStatus', '¿El certificado tiene vencimiento?', expiryStatus, [
              ['', 'No indicado'], ['yes', 'Sí, tiene fecha'], ['no', 'No caduca / sin vencimiento'], ['dontknow', 'No lo sé']
            ]) +
            (expiryStatus === 'yes'
              ? familyInput('child' + i + 'DisabilityExpiry', 'Fecha de vencimiento', p['child' + i + 'DisabilityExpiry'], 'date')
              : '<p class="field__help" style="grid-column:1/-1">Si está reconocida y no caduca, déjalo así: no hace falta inventar una fecha.</p>');
        }
        html += '<div class="family-child"><p class="eyebrow">Hijo/a ' + i + '</p><div class="form-grid">' +
          familyInput('child' + i + 'Name', 'Nombre y apellidos', p['child' + i + 'Name']) +
          familyInput('child' + i + 'Age', 'Edad', p['child' + i + 'Age'], 'number') +
          familyInput('child' + i + 'Nationality', 'Nacionalidad', p['child' + i + 'Nationality']) +
          familySelect('child' + i + 'Relation', 'Vínculo contigo', rel, [
            ['common', 'Hijo o hija de ambos'], ['own', 'Hijo o hija solo tuyo/a'], ['partner', 'Hijo o hija solo de tu pareja']
          ]) +
          familySelect('child' + i + 'Disability', 'Discapacidad', childDisability, [
            ['', 'No indicado'], ['no', 'No'], ['yes', 'Sí'], ['in_progress', 'En trámite'], ['dontknow', 'No lo sé']
          ]) +
          childDisabilityDetails +
          familySelect('child' + i + 'Lives', '¿Vive contigo?', p['child' + i + 'Lives'] || '', [
            ['', 'No indicado'], ['yes', 'Sí'], ['no', 'No'], ['compartida', 'Custodia compartida'], ['dontknow', 'No lo sé']
          ]) +
          familySelect('child' + i + 'Education', 'Estudios actuales (si es menor o adolescente)', p['child' + i + 'Education'] || '', [
            ['', 'No indicado'], ['no', 'No estudia'], ['infantil_primaria', 'Infantil / Primaria'],
            ['eso', 'ESO'], ['bachillerato', 'Bachillerato'], ['fp_basica', 'FP Básica'],
            ['fp_medio', 'FP de Grado Medio'], ['fp_superior', 'FP de Grado Superior (2 años)'],
            ['universidad', 'Universidad'], ['otro', 'Otro'], ['dontknow', 'No lo sé']
          ]) +
          familySelect('child' + i + 'LegalStatus', 'Situación legal del hijo/a', p['child' + i + 'LegalStatus'] || '', [
            ['', 'No indicado'], ['spanish', 'Español/a'], ['eu', 'UE/EEE'], ['residence', 'Residencia española'],
            ['expired', 'Residencia caducada'], ['asylum', 'Asilo en trámite'], ['irregular', 'Irregular'],
            ['tourist', 'Turista / estancia'], ['outside', 'Fuera de España'], ['dontknow', 'No lo sé']
          ]) +
          familySelect('child' + i + 'TimeInSpain', 'Tiempo del hijo/a en España', p['child' + i + 'TimeInSpain'] || '', [
            ['', 'No indicado'], ['lt1', 'Menos de 1 año'], ['1to2', '1-2 años'], ['2to3', '2-3 años'],
            ['3plus', 'Más de 3 años'], ['not_spain', 'No está en España'], ['dontknow', 'No lo sé']
          ]) +
          familySelect('child' + i + 'Need', '¿Qué necesita el hijo/a?', p['child' + i + 'Need'] || '', [
            ['', 'No indicado'], ['regularizar', 'Regularizarse'], ['trabajar', 'Trabajar'],
            ['estudiar', 'Estudiar'], ['renovar', 'Renovar permiso'], ['nacionalidad', 'Nacionalidad'],
            ['reagrupar', 'Venir a España'], ['nothing', 'Nada'], ['dontknow', 'No lo sé']
          ]) +
          '</div></div>';
      }
      html += '</div></div>';
    }

    var size = Number(p.householdSize) || 0;
    var known = (d.couple ? 1 : 0) + total;
    var extra = Math.max(0, size - known);
    if (extra > 0) {
      html += '<div class="block" style="margin-top:14px"><div class="block__head">' + icons.family(18) + '<h3>Otras personas que conviven (' + extra + ')</h3></div><div class="block__body">';
      for (var e = 1; e <= extra; e++) {
        html += '<div class="family-child"><p class="eyebrow">Persona adicional ' + e + '</p><div class="form-grid">' +
          familyInput('extra' + e + 'Name', 'Nombre y apellidos', p['extra' + e + 'Name']) +
          familyInput('extra' + e + 'Age', 'Edad', p['extra' + e + 'Age'], 'number') +
          familySelect('extra' + e + 'Relation', 'Relación con vosotros', p['extra' + e + 'Relation'] || '', [
            ['', 'No indicado'], ['familiar', 'Familiar'], ['amigo', 'Amigo/a'], ['otro', 'Otro']
          ]) +
          familySelect('extra' + e + 'LegalStatus', 'Situación legal', p['extra' + e + 'LegalStatus'] || '', [
            ['', 'No indicado'], ['spanish', 'Española'], ['eu', 'UE/EEE'], ['residence', 'Residencia española'],
            ['expired', 'Residencia caducada'], ['asylum', 'Asilo en trámite'], ['irregular', 'Irregular'],
            ['tourist', 'Turista / estancia'], ['outside', 'Fuera de España'], ['dontknow', 'No lo sé']
          ]) +
          familySelect('extra' + e + 'TimeInSpain', 'Tiempo en España', p['extra' + e + 'TimeInSpain'] || '', [
            ['', 'No indicado'], ['lt1', 'Menos de 1 año'], ['1to2', '1-2 años'], ['2to3', '2-3 años'],
            ['3plus', 'Más de 3 años'], ['not_spain', 'No está en España'], ['dontknow', 'No lo sé']
          ]) +
          familySelect('extra' + e + 'Need', '¿Qué necesita?', p['extra' + e + 'Need'] || '', [
            ['', 'No indicado'], ['regularizar', 'Regularizarse'], ['trabajar', 'Trabajar'],
            ['estudiar', 'Estudiar'], ['renovar', 'Renovar permiso'], ['nacionalidad', 'Nacionalidad'],
            ['reagrupar', 'Venir a España'], ['nothing', 'Nada'], ['dontknow', 'No lo sé']
          ]) +
          '</div></div>';
      }
      html += '</div></div>';
    }
    html += '</div>';
    return html;
  }

  function familyInput(name, label, value, type) {
    return '<div class="field"><label class="field__label" for="ff-' + name + '">' + esc(label) + '</label>' +
      '<input class="input" type="' + (type || 'text') + '" id="ff-' + name + '" name="' + name + '" value="' + esc(value == null ? '' : value) + '"></div>';
  }

  function familySelect(name, label, value, options) {
    return '<div class="field"><label class="field__label" for="ff-' + name + '">' + esc(label) + '</label>' +
      '<select class="select" id="ff-' + name + '" name="' + name + '">' +
      options.map(function (o) {
        return '<option value="' + esc(o[0]) + '"' + (String(value) === String(o[0]) ? ' selected' : '') + '>' + esc(o[1]) + '</option>';
      }).join('') + '</select></div>';
  }

  function fieldHTML(f, p, error) {
    var id = 'f-' + f.id;
    var val = p[f.id];
    var req = f.required ? ' <span class="field__req" aria-hidden="true">*</span>' : '';
    var help = f.help ? '<p class="field__help" id="h-' + f.id + '">' + esc(f.help) + '</p>' : '';
    var described = f.help ? ' aria-describedby="h-' + f.id + '"' : '';
    var err = error ? '<p class="field__error" id="e-' + f.id + '">' + esc(error) + '</p>' : '';
    var cls = 'field' + (error ? ' field--error' : '');

    if (f.type === 'family') return familyEditorHTML(p);

    if (f.type === 'radio') {
      var opts = (f.options || []).map(function (o) {
        var checked = val === o.v ? ' checked' : '';
        return '<label class="option">' +
          '<input type="radio" name="' + f.id + '" value="' + esc(o.v) + '"' + checked + '>' +
          '<span class="option__box" aria-hidden="true"></span>' +
          '<span class="option__body"><span class="option__label">' + esc(o.l) + '</span>' +
          (o.h ? '<span class="option__hint">' + esc(o.h) + '</span>' : '') + '</span></label>';
      }).join('');
      return '<fieldset class="fieldset" id="' + id + '"' + (error ? ' aria-invalid="true"' : '') + '>' +
        '<legend class="fieldset__legend">' + esc(f.label) + req + '</legend>' + help +
        '<div class="options" role="radiogroup">' + opts + '</div>' + err + '</fieldset>';
    }

    if (f.type === 'checkboxes') {
      var arr = Array.isArray(val) ? val : [];
      var opts2 = (f.options || []).map(function (o) {
        var checked = arr.indexOf(o.v) !== -1 ? ' checked' : '';
        return '<label class="option option--check">' +
          '<input type="checkbox" name="' + f.id + '" value="' + esc(o.v) + '"' + checked + '>' +
          '<span class="option__box" aria-hidden="true"></span>' +
          '<span class="option__body"><span class="option__label">' + esc(o.l) + '</span>' +
          (o.h ? '<span class="option__hint">' + esc(o.h) + '</span>' : '') + '</span></label>';
      }).join('');
      return '<fieldset class="fieldset" id="' + id + '">' +
        '<legend class="fieldset__legend">' + esc(f.label) + req + '</legend>' + help +
        '<div class="options">' + opts2 + '</div>' + err + '</fieldset>';
    }

    if (f.type === 'consent') {
      return '<div class="' + cls + '" id="' + id + '">' +
        '<label class="checkline"><input type="checkbox" name="' + f.id + '"' + (val === true ? ' checked' : '') + '>' +
        '<span>' + esc(f.label) + req + '</span></label>' + (error ? err : '') + '</div>';
    }

    if (f.type === 'country') {
      var groups = {};
      RL.countries.forEach(function (c) { (groups[c.r] = groups[c.r] || []).push(c); });
      var opts3 = '<option value="">Selecciona tu país…</option>';
      ['latam', 'ue', 'eea', 'eu', 'africa', 'asia', 'otro'].forEach(function (g) {
        if (!groups[g]) return;
        opts3 += '<optgroup label="' + REGION_LABEL[g] + '">';
        groups[g].forEach(function (c) {
          opts3 += '<option value="' + c.c + '"' + (val === c.c ? ' selected' : '') + '>' + esc(c.n) + '</option>';
        });
        opts3 += '</optgroup>';
      });
      return '<div class="' + cls + '">' +
        '<label class="field__label" for="' + id + '">' + esc(f.label) + req + '</label>' + help +
        '<select class="select" id="' + id + '" name="' + f.id + '"' + described + '>' + opts3 + '</select>' + err + '</div>';
    }

    if (f.type === 'select') {
      var opts4 = '<option value="">Selecciona…</option>' + (f.options || []).map(function (o) {
        return '<option value="' + esc(o.v) + '"' + (val === o.v ? ' selected' : '') + '>' + esc(o.l) + '</option>';
      }).join('');
      return '<div class="' + cls + '">' +
        '<label class="field__label" for="' + id + '">' + esc(f.label) + req + '</label>' + help +
        '<select class="select" id="' + id + '" name="' + f.id + '"' + described + '>' + opts4 + '</select>' + err + '</div>';
    }

    if (f.type === 'textarea') {
      return '<div class="' + cls + '">' +
        '<label class="field__label" for="' + id + '">' + esc(f.label) + req + '</label>' + help +
        '<textarea class="textarea" id="' + id + '" name="' + f.id + '" placeholder="' + esc(f.placeholder || '') + '"' + described + '>' + esc(val || '') + '</textarea>' + err + '</div>';
    }

    var type = f.type === 'number' ? 'number' : (f.type === 'date' ? 'date' : (f.type === 'month' ? 'month' : 'text'));
    var attrs = '';
    if (f.min != null) attrs += ' min="' + f.min + '"';
    if (f.max != null) attrs += ' max="' + f.max + '"';
    if (f.step != null) attrs += ' step="' + f.step + '"';
    var v = val == null ? '' : val;
    return '<div class="' + cls + '">' +
      '<label class="field__label" for="' + id + '">' + esc(f.label) + req + '</label>' + help +
      '<input class="input' + (f.type === 'number' ? ' input--num' : '') + '" type="' + type + '" id="' + id + '" name="' + f.id + '" value="' + esc(v) + '" placeholder="' + esc(f.placeholder || '') + '"' + attrs + described + '>' + err + '</div>';
  }

  function bindFields() {
    var form = $('#wizardFields');
    if (!form) return;

    form.addEventListener('input', function (e) {
      var el = e.target;
      if (!el.name) return;
      if (el.type === 'radio' || el.type === 'checkbox') return;
      setValue(el, ui.step);
    });

    form.addEventListener('change', function (e) {
      var el = e.target;
      if (!el.name) return;
      var step = RL.questions.visibleSteps(RL.profile())[ui.step];
      if (!step) return;
      var before = currentVisibleIds(step).join('|');
      setValue(el, ui.step);
      if (/^child\d+Disability$/.test(el.name) || /^child\d+DisabilityExpiryStatus$/.test(el.name)) {
        if (/ExpiryStatus$/.test(el.name) && el.value === 'no') {
          var clearName = el.name.replace(/Status$/, '');
          delete RL.state.profile[clearName];
          RL.store.save();
        }
        renderWizard();
        return;
      }
      var after = currentVisibleIds(step).join('|');
      if (el.type === 'radio' || el.type === 'checkbox' || el.tagName === 'SELECT') {
        if (before !== after) renderWizard();
        else refreshProgress();
      }
    });
  }

  function setValue(el, step) {
    var p = RL.profile();
    var id = el.name;
    var field = RL.questions.fieldById(id);
    var value;
    if (el.type === 'checkbox') {
      if (field && field.type === 'checkboxes') {
        var arr = Array.isArray(p[id]) ? p[id].slice() : [];
        if (el.checked) { if (arr.indexOf(el.value) === -1) arr.push(el.value); }
        else { arr = arr.filter(function (x) { return x !== el.value; }); }
        value = arr;
      } else {
        value = el.checked;
      }
    } else if (el.type === 'radio') {
      value = el.value;
    } else if (el.type === 'number') {
      value = el.value === '' ? '' : Number(el.value);
    } else {
      value = el.value;
    }
    p[id] = value;
    RL.state.meta.lastStep = ui.step;
    if (ui.errors[id]) { delete ui.errors[id]; }
    RL.store.save();
  }

  function currentVisibleIds(step) {
    return RL.questions.visibleFields(step, RL.profile()).map(function (f) { return f.id; });
  }

  function refreshProgress() {
    var total = RL.questions.visibleSteps(RL.profile()).length || 1;
    setProgress(Math.round((ui.step / total) * 100));
  }

  function validateStep(step) {
    var p = RL.profile();
    var errors = {};
    RL.questions.visibleFields(step, p).forEach(function (f) {
      if (!f.required) return;
      var v = p[f.id];
      if (f.type === 'consent') {
        if (v !== true) errors[f.id] = 'Necesitamos que aceptes esta condición para continuar.';
        return;
      }
      if (f.type === 'checkboxes') {
        if (!Array.isArray(v) || !v.length) errors[f.id] = 'Marca al menos una opción.';
        return;
      }
      if (v == null || v === '') { errors[f.id] = 'Este dato es necesario para calcular tu plan.'; return; }
      if (f.id === 'age' && (Number(v) < 0 || Number(v) > 110)) errors[f.id] = 'Introduce una edad entre 0 y 110.';
      if (f.id === 'nationality' && !RL.countryByCode(v)) errors[f.id] = 'Selecciona un país de la lista.';
    });
    return errors;
  }

  function wizardNext() {
    var steps = RL.questions.visibleSteps(RL.profile());
    var step = steps[ui.step];
    var errors = validateStep(step);
    if (Object.keys(errors).length) {
      ui.errors = errors;
      renderWizard();
      $('#wizardError').hidden = false;
      $('#wizardError').textContent = 'Faltan datos en ' + Object.keys(errors).length + ' campo(s). Revisa lo marcado en rojo.';
      var first = $('.field--error, .fieldset[aria-invalid="true"]');
      if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    ui.errors = {};
    if (ui.step < steps.length - 1) {
      ui.step++;
      RL.state.meta.lastStep = ui.step;
      RL.store.save();
      renderWizard();
      scrollToWizardTop();
    } else {
      RL.state.meta.completedSteps = steps.length;
      RL.state.meta.finishedAt = dates.today();
      RL.store.save();
      go('plan');
      toast('Plan calculado. Revísalo con calma.');
    }
  }

  /* ══════════════════════════════════════════════════════════
     PLAN
     ══════════════════════════════════════════════════════════ */
  function renderPlan() {
    var host = $('#view-plan');
    var p = RL.profile();
    if (!p.nationality || !p.location) {
      host.innerHTML = emptyState('Aún no tenemos tu informe',
        'Responde las preguntas y generaremos un informe de caso para que lo revise un abogado de extranjería.',
        'Empezar mi informe', 'diagnostico');
      return;
    }
    var plan = RL.buildPlan(p);
    var d = plan.d;
    var html = '<div class="plan-head"><div><p class="eyebrow">Informe de caso</p>' +
      '<h1>Informe para tu abogado de extranjería</h1>' +
      '<p class="plan-head__sub">Este documento recoge tus hechos, fechas, familia, documentos y dudas. No emite un veredicto ni elige una vía por ti: eso lo valora un abogado.</p></div>' +
      '<div class="plan-head__actions">' +
      '<button class="btn btn--accent btn--sm" data-action="pdf">' + icons.doc(16) + ' Descargar informe PDF</button>' +
      '<button class="btn btn--soft btn--sm" data-action="print">' + icons.print(16) + ' Imprimir</button>' +
      '<button class="btn btn--soft btn--sm" data-action="export">' + icons.save(16) + ' Guardar copia JSON</button>' +
      '<button class="btn btn--ghost btn--sm" data-action="edit">' + icons.user(16) + ' Editar respuestas</button>' +
      '</div></div>';
    html += profileChips(p, d);
    html += '<div class="callout callout--info" style="margin:0 0 18px">' + icons.info(18) + '<div><strong>Esto no es un diagnóstico legal</strong><p>La app no decide qué vía te corresponde. Ordena la información para que un abogado o una entidad especializada pueda evaluar tu caso con menos idas y venidas.</p></div></div>';
    html += caseFactsHTML(p, d);
    html += ownedDocsHTML(d);
    html += familyMembersHTML(plan);
    html += caseQuestionsHTML(p, d);
    html += spendGuardHTML();
    html += '<div class="callout callout--warn">' + icons.alert(18) + '<div><strong>Antes de enviar el informe</strong><p>Revisa que las fechas y documentos sean correctos. El abogado necesitará además copias de las resoluciones, TIE, pasaporte y justificantes que aquí solo se describen.</p></div></div>';
    html += '<div class="flex mt-2"><button class="btn btn--soft btn--sm" data-nav="tramites">Ver guías de trámites</button><button class="btn btn--soft btn--sm" data-nav="vias">Ver información general de vías</button><button class="btn btn--soft btn--sm" data-nav="ayuda">Buscar abogado o entidad</button></div>';
    host.innerHTML = html;
  }

  function caseFactsHTML(p, d) {
    var rows = [];
    function row(k, v) { if (v != null && v !== '') rows.push([k, v]); }
    row('Nombre', p.fullName);
    row('Nacimiento', [p.birthDate ? fmt.date(p.birthDate) : '', p.birthPlace].filter(Boolean).join(' · '));
    row('Contacto', [p.contactPhone, p.contactEmail].filter(Boolean).join(' · '));
    row('Nacionalidad', RL.countryName(p.nationality));
    row('Edad', d.age != null ? d.age + ' años' : '');
    row('Dónde está', p.location === 'spain' ? 'España' : (p.location === 'origin' ? 'País de origen' : 'Otro país'));
    row('Provincia / municipio', [p.municipality, p.province].filter(Boolean).join(' · '));
    row('Entrada', p.entryDate ? fmt.date(p.entryDate) : '');
    row('Tiempo en España', d.monthsInSpain != null ? fmt.duration(d.monthsInSpain) : '');
    row('Padrón', p.empadronado === 'yes' ? 'Sí' : (p.empadronado === 'no' ? 'No' : ''));
    row('Situación de residencia', p.permitStatus ? permitLabel(p.permitStatus) : '');
    row('Tipo de autorización', p.permitKind);
    row('Años concedidos', p.permitYears);
    row('Residencia desde', p.permitSince ? fmt.date(p.permitSince) : '');
    row('Vence', p.permitExpiry ? fmt.date(p.permitExpiry) : '');
    row('Residencia aprobada', p.residenceApproved === 'yes' ? 'Sí' + (p.residenceApprovedYears ? ' · ' + p.residenceApprovedYears + ' años' : '') : '');
    row('Renovación', [p.renewalMercurio, p.renewalApproved, p.huellasAppointment, p.tiePickupAppointment].filter(Boolean).join(' · '));
    row('Cita para presentar', p.appointmentDate ? fmt.date(p.appointmentDate) : p.hasAppointment);
    row('Asilo', p.asylumStage ? p.asylumStage + (p.postRenunciationOutcome ? ' · ' + p.postRenunciationOutcome : '') : '');
    row('Objetivo', goalLabel(p.goals));
    row('Urgencia', p.urgency);
    row('Solicitudes anteriores', p.priorApplications);
    row('Denegaciones / recursos', p.denials);
    row('Dudas para el abogado', p.lawyerQuestions);
    row('Notas', p.notes);
    if (!rows.length) return '';
    return '<div class="block" style="margin-bottom:18px"><div class="block__head">' + icons.user(18) + '<h2>Hechos del caso</h2></div><div class="block__body"><div class="form-grid">' +
      rows.map(function (r) { return '<div class="field"><span class="field__label">' + esc(r[0]) + '</span><p style="margin:0;font-size:.9rem;color:var(--ink-2)">' + esc(r[1]) + '</p></div>'; }).join('') +
      '</div></div></div>';
  }

  function caseQuestionsHTML(p, d) {
    var missing = [];
    if (!p.nationality) missing.push('nacionalidad');
    if (!p.location) missing.push('dónde está');
    if (p.location === 'spain' && !p.entryDate) missing.push('fecha de entrada');
    if (d.hasPermit && !p.permitExpiry) missing.push('vencimiento de la TIE');
    if (d.hasPermit && !p.permitSince) missing.push('fecha desde la que tiene residencia legal');
    if (!p.hasAppointment) missing.push('si tiene cita y para qué fecha');
    if (!p.lawyerQuestions) missing.push('qué quiere preguntar al abogado');
    return '<div class="block" style="margin-bottom:18px"><div class="block__head">' + icons.help(18) + '<h2>Datos que faltan o debe confirmar el abogado</h2></div><div class="block__body">' +
      (missing.length ? '<p><strong>Faltan en el informe:</strong> ' + esc(missing.join(', ')) + '.</p>' : '<p>Los datos principales están cubiertos. El abogado deberá confirmar las resoluciones, los documentos originales y las fechas exactas.</p>') +
      '<p class="muted" style="font-size:.86rem">No interpretamos estos datos como una vía legal. El informe sirve para que el profesional pregunte, compruebe y decida.</p></div></div>';
  }

  function renderPlanLegacy() {
    var host = $('#view-plan');
    var p = RL.profile();

    if (!p.nationality || !p.location) {
      host.innerHTML = emptyState('Aún no tenemos tu diagnóstico',
        'Responde unas preguntas (5 minutos) y calcularemos qué vías legales encajan contigo, qué te falta y qué hacer primero.',
        'Empezar mi diagnóstico', 'diagnostico');
      return;
    }

    var plan = RL.buildPlan(p);
    var top = plan.recommended[0] || null;

    var html = '';
    html += '<div class="plan-head">' +
      '<div><p class="eyebrow">Tu plan personalizado</p>' +
      '<h1>Esto es lo que encaja contigo.</h1>' +
      '<p class="plan-head__sub">' + esc(plan.summary) + '</p></div>' +
      '<div class="plan-head__actions">' +
      (RL.speech && RL.speech.supported ? '<button class="btn btn--soft btn--sm" data-action="listen-plan">' + icons.speaker(16) + ' Escuchar plan</button>' : '') +
      '<button class="btn btn--accent btn--sm" data-action="pdf">' + icons.doc(16) + ' Descargar PDF para tu abogado</button>' +
      '<button class="btn btn--soft btn--sm" data-action="print">' + icons.print(16) + ' Imprimir</button>' +
      '<button class="btn btn--soft btn--sm" data-nav="directorio">' + icons.pin(16) + ' Dónde ir</button>' +
      '<button class="btn btn--soft btn--sm" data-action="export">' + icons.save(16) + ' Guardar copia</button>' +
      '<button class="btn btn--ghost btn--sm" data-action="edit">' + icons.user(16) + ' Editar respuestas</button>' +
      '</div></div>';

    html += profileChips(p, plan.d, plan.decision);
    html += '<p class="muted" style="font-size:.78rem;margin:-14px 0 20px">La puntuación mide el encaje con tus respuestas, no la probabilidad de que te concedan la autorización.</p>';
    html += ownedDocsHTML(plan.d);
    html += alertsHTML(plan.alerts);
    html += decisionHTML(plan);
    html += realityHTML(plan);
    html += familyRealityHTML(plan);
    html += familyMembersHTML(plan);
    html += windowsHTML(plan);
    html += nextStepsHTML(plan, top);
    html += spendGuardHTML();

    html += '<div class="plan-grid"><div class="plan-main">';

    if (!plan.recommended.length && !plan.d.isSpanish) {
      html += '<div class="block"><div class="block__body">' +
        '<h2 class="mt-0">No aparece una vía abierta a corto plazo</h2>' +
        '<p class="muted">Con los datos que nos has dado no hay una autorización que puedas solicitar ya. Eso no significa que no haya camino: casi siempre hay trabajo de preparación que sí puedes hacer.</p>' +
        '<p>Revisa las <strong>acciones de preparación</strong> de abajo y las vías «a tu alcance». Si crees que nos falta un dato, edita tus respuestas.</p>' +
        '<div class="flex mt-2"><button class="btn btn--ghost btn--sm" data-action="edit">Editar respuestas</button>' +
        '<button class="btn btn--soft btn--sm" data-action="ai-ask" data-question="No aparece ninguna vía abierta a corto plazo en mi caso. ¿Qué alternativas reales tengo sin salir de España y qué puedo preparar mientras?">' + icons.help(14) + ' Preguntar a una IA</button></div>' +
        '</div></div>';
    }

    if (plan.d.isSpanish) {
      html += '<div class="block" style="border-color:color-mix(in srgb,var(--ok) 40%,var(--line))"><div class="block__head" style="background:var(--ok-soft)">' + icons.check(18) + '<h2>No necesitas regularización</h2></div><div class="block__body">' +
        '<p>Ya tienes la nacionalidad española. No hay visado ni autorización de residencia que solicitar. Si vuelves o te estableces en España:</p>' +
        '<ul style="padding-left:18px;font-size:.92rem;color:var(--ink-2)">' +
        '<li>Identifícate con <strong>DNI o pasaporte español</strong> en vigor.</li>' +
        '<li>Inscríbete en el <strong>padrón</strong> del municipio donde vivas.</li>' +
        '<li>Para trabajar, alta en la <strong>Seguridad Social</strong>; si eres autónomo, alta en RETA.</li>' +
        '<li>Si tienes hijos nacidos fuera, revisa su <strong>inscripción en el Registro Civil</strong>.</li>' +
        '</ul><p class="muted" style="font-size:.84rem">Esta app está pensada para personas extranjeras. Si has llegado aquí por error, puedes volver al inicio o consultar el catálogo.</p>' +
        '<button class="btn btn--soft btn--sm" data-nav="inicio">Volver al inicio</button></div></div>';
    }

    plan.recommended.forEach(function (r, i) { html += routeCardHTML(r, i === 0, plan.d); });

    if (!plan.d.isSpanish) {
      if (plan.timeline.length) html += timelineHTML(plan.timeline);
      if (plan.actions.length) html += actionsHTML(plan.actions);

      if (plan.more.length) {
        html += '<div class="block"><div class="block__head">' + icons.route(18) + '<h2>Otras vías que podrían encajar</h2></div><div class="block__body">' +
          plan.more.map(function (r) { return moreRouteHTML(r); }).join('') + '</div></div>';
      }

      if (plan.discarded.length) {
        html += '<div class="block"><div class="block__head">' + icons.info(18) + '<h2>Vías que no aplican (y por qué)</h2></div><div class="block__body">' +
          '<p class="muted" style="font-size:.88rem">Las descartamos para que no pierdas tiempo ni dinero. Si algún dato cambia, vuelve a calcular el plan.</p>' +
          plan.discarded.slice(0, 6).map(function (r) { return discardedHTML(r); }).join('') + '</div></div>';
      }

      html += '<div class="callout callout--warn">' + icons.alert(18) + '<div><strong>Antes de presentar nada</strong>' +
        '<p>Confirma los requisitos en la fuente oficial y, si tu caso tiene aristas (antecedentes, denegaciones, plazos), consulta con un abogado de extranjería o con una entidad social. La normativa cambia y esta app no sustituye ese asesoramiento.</p></div></div>';
    }

    html += '</div><aside class="plan-aside">';
    html += profileCard(p, plan.d);
    html += checklistCard(plan);
    html += '<div class="block"><div class="block__head">' + icons.help(18) + '<h2>¿Atascado?</h2></div><div class="block__body">' +
      '<p style="font-size:.89rem" class="muted">Si no sabes qué documento pedir o cómo rellenar un formulario, en Ayuda tienes recursos gratuitos y el aviso legal.</p>' +
      '<button class="btn btn--soft btn--sm mt-2" data-nav="ayuda">Ver ayuda y recursos</button></div></div>';
    html += '</aside></div>';

    host.innerHTML = html;
    bindChecklist(host);
  }

  function profileChips(p, d, decision) {
    var chips = [];
    chips.push(chip(icons.globe(14), RL.countryName(p.nationality)));
    if (d.age) chips.push(chip(icons.user(14), d.age + ' años'));
    chips.push(chip(icons.pin(14), p.location === 'spain' ? 'En España' : (p.location === 'origin' ? 'En tu país' : 'En otro país')));
    if (d.inSpain && d.province) chips.push(chip(icons.pin(14), d.municipality ? d.municipality + ' · ' + d.province : d.province));
    if (d.inSpain) {
      if (d.monthsInSpain != null) chips.push(chip(icons.clock(14), fmt.duration(d.monthsInSpain) + ' en España'));
      if (d.irregular) chips.push('<span class="chip chip--warn">' + icons.alert(14) + ' Situación irregular</span>');
      else if (d.hasPermit) chips.push('<span class="chip chip--ok">' + icons.check(14) + ' Con autorización</span>');
    }
    if (d.ibero) chips.push(chip(icons.globe(14), 'Nacionalidad con plazo de 2 años'));
    if (d.housing) chips.push(chip(icons.home(14), RL.housing.labels[d.housing] || d.housing));
    if (d.degree) chips.push(chip(icons.book(14), RL.education.degree[d.degree] || d.degree));
    if (d.sepeCourses) chips.push(chip(icons.book(14), d.sepeCourses + ' curso(s) SEPE'));
    if (d.partnerHasDisability) chips.push(chip(icons.family(14), 'Pareja con discapacidad'));
    if (d.hasDisabledChild) chips.push(chip(icons.family(14), 'Hijo/a con discapacidad'));
    if (d.householdOthers > 0) chips.push(chip(icons.family(14), d.householdOthers + ' persona(s) más en casa'));
    if (p.maritalStatus) chips.push(chip(icons.family(14), RL.family.status[p.maritalStatus] || p.maritalStatus));
    if (d.hasKids) chips.push(chip(icons.family(14), 'Hijos: ' + d.childrenCount + ' (' + RL.family.childrenText(d) + ')'));
    if (d.hasAncestry) chips.push(chip(icons.family(14), 'Ascendencia española'));
    if (decision && decision.confidence) {
      var lvl = decision.confidence.level;
      var cls = lvl === 'alta' ? 'chip--ok' : (lvl === 'media' ? 'chip--warn' : 'chip--bad');
      chips.push('<span class="chip ' + cls + '">' + icons.shield(14) + ' Confianza ' + lvl + '</span>');
    }
    if (d.goals.length) {
      var g = { nacionalidad: 'Nacionalidad', residencia_estable: 'Residencia estable', trabajar: 'Trabajar', estudiar: 'Estudiar', familia: 'Familia', regularizar: 'Regularizarse', no_lo_se: 'Objetivo abierto' };
      chips.push(chip(icons.route(14), g[d.goals[0]] || 'Objetivo'));
    }
    return '<div class="profile-chips">' + chips.join('') + '</div>';
  }
  function chip(icon, text) { return '<span class="chip">' + icon + esc(text) + '</span>'; }

  function windowsHTML(plan) {
    if (!plan.windows || !plan.windows.length) return '';
    return '<div class="block" style="margin-bottom:18px"><div class="block__head">' + icons.clock(18) +
      '<h2>Ventanas de oportunidad</h2><span class="badge badge--warn">No esperes</span></div><div class="block__body">' +
      plan.windows.map(function (w) {
        var ic = w.tone === 'bad' || w.tone === 'warn' ? icons.alert(15) : (w.tone === 'ok' ? icons.check(15) : icons.clock(15));
        return '<div class="resource" style="align-items:flex-start"><span class="resource__icon">' + ic + '</span><div><strong>' + esc(w.title) + '</strong>' +
          '<p style="font-size:.86rem;color:var(--ink-2);margin:2px 0 0">' + esc(w.body) + '</p></div></div>';
      }).join('') +
      '<button class="btn btn--soft btn--sm mt-2" data-nav="tramites">' + icons.route(15) + ' Ver trámites paso a paso</button>' +
      '</div></div>';
  }

  function realityHTML(plan) {
    var r = plan.reality;
    if (!r) return '';
    var map = {
      solid: ['Vía sólida', 'badge--ok'],
      conditional: ['Vía condicionada', 'badge--warn'],
      fragile: ['Vía frágil', 'badge--bad'],
      none: ['Sin vía ordinaria', 'badge--bad']
    };
    var lab = map[r.level] || ['Expectativa', 'badge--neutral'];
    return '<div class="block" style="margin-bottom:18px"><div class="block__head">' + icons.shield(18) +
      '<h2>Expectativa realista</h2><span class="badge ' + lab[1] + '">' + esc(lab[0]) + '</span></div><div class="block__body">' +
      '<p><strong>' + esc(r.title) + '</strong></p>' +
      '<p>' + esc(r.body) + '</p>' +
      '<ul style="padding-left:18px;font-size:.86rem;color:var(--ink-2)">' +
      r.bullets.map(function (b) { return '<li>' + esc(b) + '</li>'; }).join('') +
      '</ul></div></div>';
  }

  function familyMembersHTML(plan) {
    var list = (plan.d && plan.d.familyAdvice) || [];
    if (!list.length) return '';
    var roleLabel = { pareja: 'Pareja', hijo: 'Hijo/a', otro: 'Otra persona' };
    return '<div class="block" style="margin-bottom:18px"><div class="block__head">' + icons.family(18) + '<h2>Tu familia: situación y opciones</h2></div><div class="block__body">' +
      list.map(function (x) {
        return '<div class="resource" style="align-items:flex-start"><span class="resource__icon">' + icons.user(15) + '</span><div>' +
          '<strong>' + esc(roleLabel[x.role] || x.role) + ' · ' + esc(x.name) + '</strong>' +
          '<p style="font-size:.86rem;color:var(--ink-2);margin:3px 0 0">' + esc(x.text) + '</p>' +
          (x.second ? '<p style="font-size:.82rem;color:var(--ink-2);margin:4px 0 0"><strong>Segunda opción:</strong> ' + esc(x.second.replace(/^Segunda opción a valorar:\s*/, '')) + '</p>' : '') +
          '<p class="muted" style="font-size:.78rem;margin:4px 0 0">Situación: ' + esc(x.status) + (x.time ? ' · Tiempo: ' + esc(x.time) : '') + (x.need ? ' · Necesita: ' + esc(x.need) : '') + '</p>' +
          '</div></div>';
      }).join('') +
      '<p class="muted" style="font-size:.8rem;margin-top:10px">Cada persona tiene su propia situación. Estas opciones son orientativas y dependen de pruebas y del criterio de la oficina; no son una concesión automática.</p>' +
      '</div></div>';
  }

  function familyRealityHTML(plan) {
    var d = plan.d || {};
    var cards = [];
    if (d.marriedToSpanish) {
      cards.push({
        t: 'Me caso con un español/a',
        b: 'El matrimonio no te da la residencia automáticamente. Te permite solicitar la tarjeta de familiar de español (5 años y trabajo) si el matrimonio es válido, está inscrito y convivís; hay que presentar la solicitud (EX-24) y probar el vínculo. Un matrimonio de conveniencia se deniega.'
      });
    }
    if (d.registeredPartnerSpanish) {
      cards.push({
        t: 'Pareja de hecho registrada con un español/a',
        b: 'El registro no te legaliza por sí solo. Te permite solicitar la tarjeta de familiar de español si el registro es válido y acreditas el vínculo y la convivencia; hay que presentar la solicitud y probar los requisitos. No es automático.'
      });
    }
    if (d.stablePartnerSpanish) {
      cards.push({
        t: 'Pareja estable sin registrar',
        b: 'No hay un papel que te legalice por sí solo. La vía de familiar de español exige 12 meses de convivencia continuada o un hijo en común, y hay que acreditarlo (padrón conjunto, certificado de convivencia, etc.). Una relación ocasional no basta.'
      });
    }
    if (d.pregnantBySpanish) {
      cards.push({
        t: 'Embarazo con un progenitor español',
        b: 'El embarazo no te regulariza. El hijo será español si el padre español lo reconoce al nacer (o si se declara judicialmente la filiación). Después, la madre puede solicitar como progenitor de menor español si el niño está a su cargo y convive con ella, o si cumple las obligaciones. No es automático y, si el padre no reconoce, la nacionalidad no está resuelta.'
      });
    }
    if (d.hasSpanishChild && d.childRecognized !== false) {
      cards.push({
        t: 'Tengo un hijo/a español',
        b: d.parentSpanishMinor === true
          ? 'Puedes solicitar la tarjeta de familiar de español como progenitor si acreditas filiación, que el menor está a tu cargo y la convivencia (o el cumplimiento de obligaciones). La tarjeta es de 5 años y permite trabajar, pero la concesión no es automática.'
          : 'Un hijo español no te legaliza por sí solo. Para la vía de progenitor falta acreditar el reconocimiento, que el menor esté a tu cargo y la convivencia, o el cumplimiento de obligaciones. Si el menor vive con el otro progenitor y no cumples, la vía no encaja.'
      });
    }
    if (d.childRecognized === false) {
      cards.push({
        t: 'El padre español no reconoce al hijo',
        b: 'Sin reconocimiento voluntario, la nacionalidad española del menor no está resuelta. Puede hacer falta una filiación judicial. Mientras tanto, no cuentes con la vía de familiar de español por ese hijo: necesitas abogado.'
      });
    }
    if (!cards.length) return '';
    return '<div class="block" style="margin-bottom:18px"><div class="block__head">' + icons.family(18) + '<h2>Supuestos familiares: lo que sí y lo que no</h2></div><div class="block__body">' +
      cards.map(function (c) {
        return '<div class="resource" style="align-items:flex-start"><span class="resource__icon">' + icons.family(15) + '</span><div><strong>' + esc(c.t) + '</strong><p style="font-size:.86rem;color:var(--ink-2);margin:3px 0 0">' + esc(c.b) + '</p></div></div>';
      }).join('') +
      '<p class="muted" style="font-size:.8rem;margin-top:10px">Estos supuestos dependen de pruebas y del criterio de la oficina. La app no puede prometerte que te concedan la tarjeta: solo decirte qué vía existe y qué te falta.</p>' +
      '</div></div>';
  }
  function decisionHTML(plan) {
    var dec = plan.decision;
    if (!dec) return '';
    var lvl = dec.confidence ? dec.confidence.level : 'media';
    var badge = lvl === 'alta' ? 'badge--ok' : (lvl === 'media' ? 'badge--warn' : 'badge--bad');
    var gaps = dec.confidence ? dec.confidence.missing.concat(dec.confidence.gaps) : [];
    var safety = plan.safety || [];
    var tr = dec.trace || {};
    return '<div class="block" style="margin-bottom:18px">' +
      '<div class="block__head">' + icons.route(18) + '<h2>Cómo hemos decidido</h2><span class="badge ' + badge + '">Confianza ' + lvl + '</span></div>' +
      '<div class="block__body">' +
      '<p><strong>Prioridad:</strong> ' + esc(dec.primaryReason) + '</p>' +
      '<p class="muted" style="font-size:.84rem">Primero descartamos lo que la ley no permite; después miramos si puedes activarla ya y tu objetivo; por último, los derechos y plazos de cada vía. No ordenamos por lo que suena mejor, sino por lo que puedes sostener.</p>' +
      '<p class="muted" style="font-size:.8rem">Hemos revisado ' + (tr.total || plan.results.length) + ' vías: ' +
      (tr.blocked || 0) + ' bloqueadas por la ley, ' + (tr.closed || 0) + ' cerradas y ' + (tr.noFit || 0) + ' que no encajan.</p>' +
      (gaps.length ? '<p class="muted" style="font-size:.82rem"><strong>Para afinar el diagnóstico:</strong> ' + gaps.slice(0, 5).map(esc).join(' · ') + (gaps.length > 5 ? ' …' : '') + '</p>' : '') +
      (safety.length ? '<p class="muted" style="font-size:.82rem"><strong>Prioridad de seguridad:</strong> ' + safety.map(function (s) { return esc(s.title); }).join(' · ') + '</p>' : '') +
      '<div class="mt-2"><button class="btn btn--soft btn--sm" data-action="ai-ask" data-question="Mi caso tiene una particularidad que no encaja en el plan. ¿Puedes revisarlo y decirme qué alternativas reales tengo?">' + icons.help(14) + ' Preguntar a una IA</button></div>' +
      '</div></div>';
  }

  function ownedDocsHTML(d) {
    var labels = {
      pasaporte: 'Pasaporte de tu país (no español)', nie: 'NIE', tie: 'TIE', tarjeta_ue: 'Tarjeta UE',
      certificado_digital: 'Certificado digital', cuenta_bancaria: 'Cuenta bancaria',
      seguridad_social: 'Nº Seguridad Social', vida_laboral: 'Vida laboral',
      tarjeta_sanitaria: 'Tarjeta sanitaria', contrato_alquiler: 'Contrato de alquiler, autorización, recibo o escritura de vivienda',
      nominas: 'Nóminas / contrato', cita_asilo: 'Cita de asilo', hoja_blanca: 'Hoja blanca',
      tarjeta_roja: 'Tarjeta roja', resguardo_nacionalidad: 'Resguardo nacionalidad',
      resguardo_extranjeria: 'Resguardo extranjería', autorizacion_regreso: 'Autorización de regreso',
      cita_huellas: 'Cita de huellas TIE', tie_en_tramite: 'TIE en tramitación',
      cita_retirar_tie: 'Cita para retirar TIE', renovacion_tarjeta_roja: 'Renovación tarjeta roja',
      homologacion_titulo: 'Homologación/validación de título', tie_renovada: 'TIE renovada',
      tarjeta_roja_renovada: 'Tarjeta roja renovada', titulo_homologado: 'Título homologado/validado',
      antecedentes: 'Antecedentes penales', libro_familia: 'Libro de familia',
      demandante_empleo: 'Demandante de empleo', discapacidad: 'Certificado de discapacidad',
      otro: 'Otro'
    };
    var keys = (d.docsBase || []).concat(d.docsTramites || []);
    var done = keys.map(function (k) {
      return labels[k] ? '<span class="chip chip--ok">' + icons.check(12) + ' ' + esc(labels[k]) + '</span>' : '';
    }).filter(Boolean);
    var current = (d.docsEnCurso || []).map(function (k) {
      return labels[k] ? '<span class="chip chip--warn">' + icons.clock(12) + ' ' + esc(labels[k]) + '</span>' : '';
    }).filter(Boolean);

    if (d.asylumStage && d.asylumStage !== 'no') {
      var st = { cita: 'Cita de asilo', solicitado: 'Solicitud de asilo presentada', admitido: 'Tarjeta roja', concedido: 'Protección concedida', denegado: 'Asilo denegado' };
      current.push('<span class="chip chip--warn">' + icons.shield(12) + ' ' + esc(st[d.asylumStage] || 'Asilo') + '</span>');
    }
    if (d.pendingExtranjeria && !d.ownsCurrent('resguardo_extranjeria')) current.push('<span class="chip chip--warn">' + icons.clock(12) + ' Expediente de extranjería abierto</span>');
    if (d.pendingNationality && !d.ownsCurrent('resguardo_nacionalidad')) current.push('<span class="chip chip--warn">' + icons.clock(12) + ' Nacionalidad en trámite</span>');

    if (!done.length && !current.length) return '';
    return '<div class="block" style="margin-bottom:18px"><div class="block__head">' + icons.doc(18) + '<h2>Lo que ya tienes</h2></div>' +
      '<div class="block__body">' +
      (done.length ? '<p class="muted" style="font-size:.78rem;margin:0 0 6px"><strong>Terminados</strong> · documentos y trámites ya resueltos</p><div class="profile-chips" style="margin:0 0 12px">' + done.join('') + '</div>' : '') +
      (current.length ? '<p class="muted" style="font-size:.78rem;margin:0 0 6px"><strong>En curso</strong> · presentados y pendientes de resolución</p><div class="profile-chips" style="margin:0">' + current.join('') + '</div>' : '') +
      '<p class="muted" style="font-size:.8rem;margin:10px 0 0">Lo usamos para no pedirte lo que ya tienes y para afinar el plan. Lo que está en curso no se cuenta como resuelto. Puedes cambiarlo en «Editar respuestas».</p></div></div>';
  }

  function alertsHTML(alerts) {
    if (!alerts.length) return '';
    var order = { bad: 0, warn: 1, info: 2, ok: 3 };
    var sorted = alerts.slice().sort(function (a, b) {
      var va = order[a.tone] == null ? 3 : order[a.tone];
      var vb = order[b.tone] == null ? 3 : order[b.tone];
      return va - vb;
    });
    return sorted.slice(0, 4).map(function (a) {
      var cls = a.tone === 'bad' ? 'callout--bad' : (a.tone === 'warn' ? 'callout--warn' : (a.tone === 'ok' ? 'callout--ok' : 'callout--info'));
      var ic = a.tone === 'bad' || a.tone === 'warn' ? icons.alert(18) : (a.tone === 'ok' ? icons.check(18) : icons.info(18));
      return '<div class="callout ' + cls + '">' + ic + '<div><strong>' + esc(a.title) + '</strong><p>' + esc(a.body) + '</p></div></div>';
    }).join('');
  }

  function routeStepsFor(route, d) {
    return RL.routeStepsFor ? RL.routeStepsFor(route, d) : (route.steps || []);
  }

  function spendGuardHTML() {
    return '<div class="callout callout--warn" style="margin:0 0 18px">' + icons.alert(18) + '<div><strong>Antes de pagar, confirma que el documento es exigible</strong><p>No pagues tasas, apostillas, traducciones, antecedentes, certificados médicos ni gestores hasta saber: qué trámite exacto lo pide, qué autoridad lo exige, si tu caso lo necesita, cuánto dura y si ya lo tienes. Si no puedes responder a eso, no lo pidas todavía.</p></div></div>';
  }

  function nextStepsHTML(plan, top) {
    var steps = [];
    plan.actions.forEach(function (a) {
      if (/semana|ahora/i.test(a.when) && steps.length < 2) steps.push({ t: a.title, d: a.body, w: a.when });
    });
    if (top) {
      routeStepsFor(top.route, plan.d).slice(0, 2).forEach(function (s) {
        if (steps.length < 3) steps.push({ t: s.title, d: s.detail, w: s.when });
      });
    }
    if (!steps.length) return '';
    return '<div class="block" style="margin-bottom:18px;border-color:color-mix(in srgb,var(--brand) 35%,var(--line))">' +
      '<div class="block__head" style="background:var(--brand-soft)">' + icons.arrow(18) + '<h2>Empieza por aquí</h2></div>' +
      '<div class="block__body"><div class="steps">' +
      steps.slice(0, 3).map(function (s, i) {
        return '<div class="step"><div class="step__num">' + (i + 1) + '</div><div class="step__body"><h4>' + esc(s.t) + '</h4><p>' + esc(s.d) + '</p>' +
          (s.w ? '<div class="step__meta"><span>' + icons.clock(13) + ' ' + esc(s.w) + '</span></div>' : '') + '</div></div>';
      }).join('') +
      '</div></div></div>';
  }

  function routeCardHTML(r, isTop, d) {
    var route = r.route;
    d = d || {};
    var st = RL.statusOf(r.status);
    var badgeCls = r.status === 'ready' || r.status === 'likely' ? 'badge--ok' : (r.status === 'almost' ? 'badge--warn' : 'badge--neutral');
    var iconFn = icons[route.icon] || icons.doc;

    var reqHTML = r.reqs.map(function (q) { return reqHTMLItem(q); }).join('');
    var docsHTML = (route.docs || []).map(function (doc) {
      var key = doc.id || (route.id + '::' + doc.name);
      var checked = RL.state.checklist[key] ? ' checked' : '';
      return '<li class="doc"><input type="checkbox" data-doc="' + esc(key) + '"' + checked + '>' +
        '<span class="doc__body"><span class="doc__name">' + esc(doc.name) + '</span>' +
        (doc.where ? '<span class="doc__where">' + esc(doc.where) + '</span>' : '') +
        (doc.note ? '<span class="doc__where">' + esc(doc.note) + '</span>' : '') + '</span></li>';
    }).join('');

    var stepsHTML = routeStepsFor(route, d).map(function (s, i) {
      return '<div class="step"><div class="step__num">' + (i + 1) + '</div><div class="step__body"><h4>' + esc(s.title) + '</h4><p>' + esc(s.detail) + '</p>' +
        (s.when ? '<div class="step__meta"><span>' + icons.clock(13) + ' ' + esc(s.when) + '</span></div>' : '') + '</div></div>';
    }).join('');

    var risksHTML = (route.risks || []).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('');
    var linksHTML = (route.links || []).map(function (l) {
      return '<a class="btn btn--link btn--sm" href="' + esc(RL.dom.safeUrl(l.u)) + '" target="_blank" rel="noopener">' + icons.ext(14) + ' ' + esc(l.t) + '</a>';
    }).join('');

    var missing = r.fails.filter(function (f) { return f.critical; });
    var unknown = r.unknowns.filter(function (f) { return f.critical; });

    return '<article class="route-card' + (isTop ? ' route-card--top' : '') + '">' +
      '<div class="route-card__top">' +
        '<div class="route-card__icon">' + iconFn(22) + '</div>' +
        '<div class="grow"><h2 class="route-card__title">' + esc(route.title) + '</h2>' +
          '<div class="route-card__meta"><span>' + icons.pin(13) + ' ' + whereLabel(route.where) + '</span>' +
          '<span>' + icons.clock(13) + ' ' + esc(route.time) + '</span>' +
          '<span>' + icons.euro(13) + ' ' + esc(route.cost) + '</span></div></div>' +
        '<div class="score score--' + RL.scoreTone(r.score) + '"><span class="score__num">' + r.score + '</span><span class="score__label">encaje</span></div>' +
      '</div>' +
      '<div class="flex" style="gap:6px"><span class="badge ' + badgeCls + '">' + st.label + '</span>' +
        (missing.length ? '<span class="badge badge--warn">Te falta: ' + esc(missing[0].label) + '</span>' : '') +
        (unknown.length ? '<span class="badge badge--neutral">Por confirmar: ' + unknown.length + '</span>' : '') +
      '</div>' +
      '<p class="route-card__why">' + esc(r.fit || route.summary) + '</p>' +
      '<details class="accordion"><summary>Ver plan paso a paso, requisitos y documentos</summary><div class="accordion__body">' +
        '<p style="font-size:.9rem">' + esc(route.summary) + '</p>' +
        '<div class="mt-2"><strong style="font-size:.88rem">Requisitos</strong><ul class="req-list mt-2">' + reqHTML + '</ul></div>' +
        (docsHTML ? '<div class="mt-3"><strong style="font-size:.88rem">Documentos</strong><ul class="docs-list mt-2">' + docsHTML + '</ul></div>' : '') +
        (stepsHTML ? '<div class="mt-3"><strong style="font-size:.88rem">Pasos</strong><div class="steps mt-2">' + stepsHTML + '</div></div>' : '') +
        (risksHTML ? '<div class="mt-3"><strong style="font-size:.88rem">Avisos y errores frecuentes</strong><ul class="mt-2" style="padding-left:18px;font-size:.87rem;color:var(--ink-2)">' + risksHTML + '</ul></div>' : '') +
        '<div class="flex mt-3" style="justify-content:space-between;align-items:center">' +
          '<span class="muted" style="font-size:.78rem">' + esc(route.legal || '') + '</span>' +
          '<span class="flex" style="gap:2px">' + linksHTML + '</span>' +
        '</div>' +
      '</div></details>' +
    '</article>';
  }

  function reqHTMLItem(q) {
    var ic = q.status === 'ok' ? icons.check(12) : (q.status === 'no' ? icons.x(12) : icons.help(12));
    var txt = q.label;
    var fix = '';
    if (q.status === 'no') fix = q.fix || '';
    else if (q.status === 'unknown') fix = q.unknown || q.fix || 'Confírmalo con la documentación o en la fuente oficial antes de presentar la solicitud.';
    return '<li class="req req--' + q.status + '"><span class="req__icon">' + ic + '</span><span class="req__text">' +
      (q.status === 'no' ? '<strong>' : '') + esc(txt) + (q.status === 'no' ? '</strong>' : '') +
      (fix ? '<span class="req__fix">' + esc(fix) + '</span>' : '') + '</span></li>';
  }

  function whereLabel(w) {
    return w === 'spain' ? 'En España' : (w === 'consulado' ? 'En el consulado' : 'En España o consulado');
  }

  function timelineHTML(items) {
    return '<div class="block"><div class="block__head">' + icons.cal(18) + '<h2>Tus fechas clave</h2></div><div class="block__body">' +
      '<ul class="timeline">' + items.map(function (t) {
        return '<li class="tl tl--' + t.tone + '"><div class="tl__date">' + fmt.date(t.date, { year: true }) + '</div>' +
          '<div class="tl__body"><strong>' + esc(t.title) + '</strong><span>' + esc(t.detail) + ' · ' + fmt.relative(t.days) + '</span></div></li>';
      }).join('') + '</ul></div></div>';
  }

  function actionsHTML(actions) {
    var tags = { base: 'Base', documentos: 'Documentos', plazo: 'Plazo', riesgo: 'Riesgo', 'trámite': 'Trámite', formación: 'Formación' };
    return '<div class="block"><div class="block__head">' + icons.check(18) + '<h2>Acciones que puedes hacer ya</h2></div><div class="block__body">' +
      actions.map(function (a) {
        return '<div class="resource"><span class="resource__icon">' + icons.arrow(16) + '</span><div class="grow">' +
          '<strong style="font-size:.93rem">' + esc(a.title) + '</strong>' +
          '<p style="font-size:.87rem;color:var(--ink-2);margin:2px 0 0">' + esc(a.body) + '</p>' +
          '<p style="font-size:.76rem;color:var(--muted);margin:3px 0 0">' + esc(a.when) + (tags[a.tag] ? ' · ' + tags[a.tag] : '') + '</p></div></div>';
      }).join('') + '</div></div>';
  }

  function moreRouteHTML(r) {
    var route = r.route;
    return '<details class="accordion"><summary><span class="badge ' + (r.status === 'ready' ? 'badge--ok' : 'badge--neutral') + '">' + RL.statusOf(r.status).label + '</span> ' + esc(route.title) + '</summary>' +
      '<div class="accordion__body"><p>' + esc(route.summary) + '</p>' +
      '<p class="muted" style="font-size:.84rem">' + esc(route.legal || '') + ' · ' + esc(route.cost) + '</p>' +
      '<button class="btn btn--soft btn--sm" data-action="open-route" data-id="' + esc(route.id) + '">Ver ficha completa</button></div></details>';
  }

  function discardedHTML(r) {
    var why = r.blockers.length ? r.blockers[0] : (r.fails[0] ? r.fails[0].label : 'No encaja con tu perfil.');
    return '<div class="resource" style="align-items:flex-start"><span class="resource__icon" style="color:var(--muted)">' + icons.minus(15) + '</span><div>' +
      '<strong style="font-size:.9rem">' + esc(r.route.title) + '</strong>' +
      '<p style="font-size:.84rem;color:var(--muted);margin:1px 0 0">' + esc(why) + '</p></div></div>';
  }

  function profileCard(p, d) {
    var rows = [];
    rows.push(['Nacionalidad', RL.countryName(p.nationality)]);
    if (d.age) rows.push(['Edad', d.age + ' años']);
    rows.push(['Ubicación', p.location === 'spain' ? 'España' : (p.location === 'origin' ? 'País de origen' : 'Otro país')]);
    if (d.inSpain && d.monthsInSpain != null) rows.push(['Tiempo en España', fmt.duration(d.monthsInSpain)]);
    if (d.inSpain) rows.push(['Permiso', permitLabel(p.permitStatus)]);
    if (d.permitExpiry) rows.push(['Vence la TIE', fmt.date(d.permitExpiry)]);
    if (d.permitYears) rows.push(['Años de residencia', d.permitYears]);
    if (d.renewalMercurio) rows.push(['Renovación presentada', d.renewalMercurio]);
    if (d.renewalApproved) rows.push(['Renovación aprobada', d.renewalApproved]);
    if (d.huellasAppointment) rows.push(['Cita de huellas', d.huellasAppointment]);
    if (d.tiePickupAppointment) rows.push(['Cita de retirada TIE', d.tiePickupAppointment]);
    if (d.residenceApproved === 'yes') rows.push(['Residencia aprobada', (d.residenceApprovedYears ? d.residenceApprovedYears + ' años' : 'Sí') + (d.tieWaitingExpiry === 'yes' ? ' · esperando vencimiento de TIE' : '')]);
    if (p.empadronado) rows.push(['Padrón', p.empadronado === 'yes' ? 'Sí' : 'No']);
    if (d.housing) rows.push(['Vivienda', RL.housing.labels[d.housing] || d.housing]);
    if (d.housingProof) rows.push(['Prueba de vivienda', RL.housing.proof[d.housingProof] || d.housingProof]);
    if (d.degree) rows.push(['Estudios', RL.education.degree[d.degree] || d.degree]);
    if (d.sepeCourses) rows.push(['Cursos SEPE terminados', String(d.sepeCourses)]);
    if (d.sepeCoursesInProgress) rows.push(['Cursos SEPE en curso', String(d.sepeCoursesInProgress)]);
    if (d.sepeCoursesDetails) rows.push(['Detalle de cursos SEPE', d.sepeCoursesDetails]);
    if (d.partnerHasDisability) rows.push(['Pareja con discapacidad', 'Sí' + (d.partnerDisabilityDegree ? ' · ' + (RL.disability.degree[d.partnerDisabilityDegree] || d.partnerDisabilityDegree) : '') + (d.partnerDisabilityExpiry ? ' · vence ' + fmt.date(d.partnerDisabilityExpiry) : '')]);
    if (d.partnerDependency) rows.push(['Pareja con dependencia', 'Sí']);
    if (d.hasDisability) rows.push(['Tu discapacidad', 'Sí' + (d.disabilityDegree ? ' · ' + (RL.disability.degree[d.disabilityDegree] || d.disabilityDegree) : '') + (d.disabilityExpiry ? ' · vence ' + fmt.date(d.disabilityExpiry) : '')]);
    if (d.hasDisabledChild) rows.push(['Hijo/a con discapacidad', 'Sí' + (d.childrenDisabilityDegree ? ' · ' + (RL.disability.degree[d.childrenDisabilityDegree] || d.childrenDisabilityDegree) : '') + (d.childrenDisabilityExpiry ? ' · vence ' + fmt.date(d.childrenDisabilityExpiry) : '')]);
    if (d.hasDisabledChild) rows.push(['Hijo/a con discapacidad', 'Sí']);
    if (d.householdOthers > 0) rows.push(['Otras personas en casa', String(d.householdOthers)]);
    rows.push(['Objetivo', goalLabel(p.goals)]);
    return '<div class="block"><div class="block__head">' + icons.user(18) + '<h2>Tu perfil</h2></div><div class="block__body">' +
      '<dl class="kv">' + rows.map(function (r) {
        return '<div class="kv__row"><dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd></div>';
      }).join('') + '</dl>' +
      '<button class="btn btn--ghost btn--sm mt-3" data-action="edit" style="width:100%">Editar respuestas</button></div></div>';
  }
  function permitLabel(v) {
    var m = { none: 'Ninguno', studies: 'Estudios', residencia_temporal: 'Residencia temporal', work: 'Residencia y trabajo', family: 'Familiar de español', eu_family: 'Familiar UE', longterm: 'Larga duración', asylum: 'Asilo', expired: 'Caducado', dontknow: 'No lo sé' };
    return m[v] || 'No indicado';
  }
  function goalLabel(goals) {
    var m = { regularizar: 'Regularizarme', residencia_estable: 'Residencia estable', trabajar: 'Trabajar', estudiar: 'Estudiar', nacionalidad: 'Nacionalidad', familia: 'Familia', no_lo_se: 'No lo tengo claro' };
    return (goals || []).map(function (g) { return m[g] || g; }).join(', ') || 'No indicado';
  }

  function checklistCard(plan) {
    var items = plan.checklist;
    var done = items.filter(function (i) { return RL.state.checklist[i.key]; }).length;
    var pct = items.length ? Math.round(done / items.length * 100) : 0;
    return '<div class="block"><div class="block__head">' + icons.doc(18) + '<h2>Documentos</h2><span class="badge badge--neutral">' + done + '/' + items.length + '</span></div>' +
      '<div class="block__body"><div class="meter"><span style="width:' + pct + '%"></span></div>' +
      '<p class="muted mt-2" style="font-size:.84rem">Marca lo que ya tienes. Se guarda en tu dispositivo.</p>' +
      '<button class="btn btn--soft btn--sm" data-nav="docs" style="width:100%">Ver checklist completa</button></div></div>';
  }

  function emptyState(title, text, cta, target) {
    return '<div class="empty-state"><h2>' + esc(title) + '</h2><p>' + esc(text) + '</p>' +
      '<button class="btn btn--primary" data-nav="' + esc(target) + '">' + esc(cta) + '</button></div>';
  }

  function bindChecklist(root) {
    $$('input[data-doc]', root).forEach(function (cb) {
      cb.addEventListener('change', function () {
        var key = cb.getAttribute('data-doc');
        if (cb.checked) RL.state.checklist[key] = true; else delete RL.state.checklist[key];
        RL.store.save();
        if (ui.view === 'plan') {
          var card = cb.closest('.block');
          if (card && card.querySelector('.meter')) {
            var plan = RL.buildPlan(RL.profile());
            var items = plan.checklist;
            var done = items.filter(function (i) { return RL.state.checklist[i.key]; }).length;
            card.querySelector('.meter span').style.width = (items.length ? Math.round(done / items.length * 100) : 0) + '%';
            var badge = card.querySelector('.badge');
            if (badge) badge.textContent = done + '/' + items.length;
          }
        }
      });
    });
  }

  /* ══════════════════════════════════════════════════════════
     CATÁLOGO DE VÍAS
     ══════════════════════════════════════════════════════════ */
  function renderCatalog() {
    var host = $('#view-vias');
    var p = RL.profile();
    var ev = RL.evaluate(p);
    var byId = {};
    ev.results.forEach(function (r) { byId[r.route.id] = r; });

    var groups = [
      { id: 'todas', label: 'Todas' },
      { id: 'residencia', label: 'Residencia' },
      { id: 'visado', label: 'Visados' },
      { id: 'nacionalidad', label: 'Nacionalidad' },
      { id: 'proteccion', label: 'Protección' }
    ];
    var groupOrder = { residencia: 0, visado: 1, nacionalidad: 2, proteccion: 3 };

    var list = RL.routes.slice().sort(function (a, b) {
      var ga = groupOrder[a.group] == null ? 9 : groupOrder[a.group];
      var gb = groupOrder[b.group] == null ? 9 : groupOrder[b.group];
      if (ga !== gb) return ga - gb;
      return String(a.title).localeCompare(String(b.title), 'es');
    });

    var q = ui.search.toLowerCase();
    var filtered = list.filter(function (r) {
      if (ui.filter !== 'todas' && r.group !== ui.filter) return false;
      if (!q) return true;
      return (r.title + ' ' + r.short + ' ' + r.summary + ' ' + (r.legal || '')).toLowerCase().indexOf(q) !== -1;
    });

    var html = '<div class="plan-head"><div><p class="eyebrow">Catálogo</p><h1>Todas las vías, explicadas</h1>' +
      '<p class="plan-head__sub">' + RL.routes.length + ' vías de residencia, visado y nacionalidad. Abre cualquiera para ver requisitos, documentos, pasos, costes y avisos.</p></div></div>';

    html += '<div class="catalog-tools">' +
      '<div class="search">' + icons.search(18) + '<input class="input" type="search" id="viaSearch" placeholder="Buscar: arraigo, estudios, nietos, nómada…" value="' + esc(ui.search) + '" aria-label="Buscar vías"></div>' +
      '<div class="flex" style="gap:6px">' + groups.map(function (g) {
        return '<button class="btn btn--sm ' + (ui.filter === g.id ? 'btn--primary' : 'btn--soft') + '" data-action="filter" data-filter="' + g.id + '">' + g.label + '</button>';
      }).join('') + '</div></div>';

    if (p.nationality) {
      html += '<p class="muted" style="font-size:.84rem;margin-top:-8px">Ordenadas por tipo y después alfabéticamente. Solo marcamos una valoración cuando los datos permiten una conclusión clara; el resto queda como información.</p>';
    }

    var sectionOrder = ui.filter === 'todas' ? ['residencia', 'visado', 'nacionalidad', 'proteccion'] : [ui.filter];
    var shown = 0;
    sectionOrder.forEach(function (gid) {
      var items = filtered.filter(function (r) { return r.group === gid; });
      if (!items.length) return;
      shown += items.length;
      html += '<div class="block" style="margin-bottom:18px"><div class="block__head">' + icons.route(18) + '<h2>' + esc(groupLabel(gid)) + ' <span class="muted" style="font-size:.78rem">(' + items.length + ')</span></h2></div><div class="block__body"><div class="catalog-grid">' +
        items.map(function (r) {
          var res = byId[r.id];
          var closed = r.availability === 'closed';
          var badge = closed ? '<span class="badge badge--neutral">Plazo cerrado</span>' :
            (res && res.status === 'ready' ? '<span class="badge badge--ok" title="Los datos cargados cubren los requisitos esenciales; no es una concesión">Cumple requisitos</span>' :
              res && res.status === 'blocked' ? '<span class="badge badge--bad" title="Los datos cargados muestran un impedimento concreto">No encaja</span>' : '');
          return '<article class="card via">' +
            '<div class="flex" style="justify-content:space-between"><span class="badge badge--info">' + esc(groupLabel(r.group)) + '</span>' + badge + '</div>' +
            '<h3>' + esc(r.title) + '</h3>' +
            '<p>' + esc(r.short) + '</p>' +
            '<div class="via__tags"><span class="chip">' + icons.pin(12) + ' ' + whereLabel(r.where) + '</span>' +
            (r.availability === 'closed' ? '' : '<span class="chip">' + icons.euro(12) + ' ' + esc(r.cost) + '</span>') + '</div>' +
            '<div class="via__foot"><span class="muted" style="font-size:.76rem">' + esc(r.legal || '') + '</span>' +
            '<button class="btn btn--soft btn--sm" data-action="open-route" data-id="' + esc(r.id) + '">Ver ficha</button></div>' +
            '</article>';
        }).join('') + '</div></div></div>';
    });

    if (!shown) html += '<div class="empty-state"><h2>Sin resultados</h2><p>Prueba con otra palabra: «arraigo», «nacionalidad», «estudios»…</p></div>';

    host.innerHTML = html;

    var search = $('#viaSearch');
    if (search) {
      search.addEventListener('input', function () {
        ui.search = search.value;
        clearTimeout(search._t);
        search._t = setTimeout(function () {
          var pos = search.selectionStart;
          renderCatalog();
          var s2 = $('#viaSearch');
          if (s2) { s2.focus(); s2.setSelectionRange(pos, pos); }
        }, 220);
      });
    }
  }

  function groupLabel(g) {
    return { nacionalidad: 'Nacionalidad', residencia: 'Residencia', visado: 'Visado', proteccion: 'Protección' }[g] || g;
  }

  function renderRouteDetail(id) {
    var route = RL.routeById(id);
    if (!route) return;
    var p = RL.profile();
    var ev = RL.evaluate(p);
    var res = null;
    ev.results.forEach(function (r) { if (r.route.id === id) res = r; });

    var st = res ? RL.statusOf(res.status) : null;
    var showStatus = res && (res.status === 'ready' || res.status === 'blocked');
    var statusLabel = res && res.status === 'ready' ? 'Cumple requisitos' : (res && res.status === 'blocked' ? 'No encaja' : '');
    var html = '<div class="plan-head"><div><p class="eyebrow"><button class="btn btn--link" data-nav="vias" style="font-size:.75rem">← Volver al catálogo</button></p>' +
      '<h1>' + esc(route.title) + '</h1><p class="plan-head__sub">' + esc(route.summary) + '</p></div></div>';

    html += '<div class="flex" style="margin-bottom:20px">' +
      (showStatus ? '<span class="badge ' + (res.status === 'ready' ? 'badge--ok' : 'badge--bad') + '">' + statusLabel + '</span>' : '') +
      '<span class="chip">' + icons.pin(13) + ' ' + whereLabel(route.where) + '</span>' +
      '<span class="chip">' + icons.clock(13) + ' ' + esc(route.time) + '</span>' +
      '<span class="chip">' + icons.euro(13) + ' ' + esc(route.cost) + '</span>' +
      (route.legal ? '<span class="chip">' + esc(route.legal) + '</span>' : '') + '</div>';

    if (route.availability === 'closed') {
      html += '<div class="callout callout--warn">' + icons.alert(18) + '<div><strong>Plazo cerrado</strong><p>' + esc(route.deadlineNote || 'Esta vía ya no está disponible.') + '</p></div></div>';
    }

    html += '<div class="plan-grid"><div class="plan-main">';

    html += '<div class="block"><div class="block__head">' + icons.info(18) + '<h2>Para quién es</h2></div><div class="block__body"><p>' + esc(route.forWho) + '</p></div></div>';

    if (res) {
      html += '<div class="block"><div class="block__head">' + icons.check(18) + '<h2>Tus requisitos</h2></div><div class="block__body"><ul class="req-list">' +
        res.reqs.map(reqHTMLItem).join('') + '</ul></div></div>';
    }

    if (route.docs && route.docs.length) {
      html += '<div class="block"><div class="block__head">' + icons.doc(18) + '<h2>Documentos</h2></div><div class="block__body"><ul class="docs-list">' +
        route.docs.map(function (doc) {
          var key = doc.id || (route.id + '::' + doc.name);
          var checked = RL.state.checklist[key] ? ' checked' : '';
          return '<li class="doc"><input type="checkbox" data-doc="' + esc(key) + '"' + checked + '><span class="doc__body"><span class="doc__name">' + esc(doc.name) + '</span>' +
            (doc.where ? '<span class="doc__where">' + esc(doc.where) + '</span>' : '') +
            (doc.note ? '<span class="doc__where">' + esc(doc.note) + '</span>' : '') + '</span></li>';
        }).join('') + '</ul></div></div>';
    }

    html += '<div class="block"><div class="block__head">' + icons.route(18) + '<h2>Paso a paso</h2></div><div class="block__body"><div class="steps">' +
      (route.steps || []).map(function (s, i) {
        return '<div class="step"><div class="step__num">' + (i + 1) + '</div><div class="step__body"><h4>' + esc(s.title) + '</h4><p>' + esc(s.detail) + '</p>' +
          (s.when ? '<div class="step__meta"><span>' + icons.clock(13) + ' ' + esc(s.when) + '</span></div>' : '') + '</div></div>';
      }).join('') + '</div></div></div>';

    if (route.risks && route.risks.length) {
      html += '<div class="block"><div class="block__head">' + icons.alert(18) + '<h2>Avisos y errores frecuentes</h2></div><div class="block__body"><ul style="padding-left:18px;font-size:.9rem;color:var(--ink-2)">' +
        route.risks.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div></div>';
    }

    html += '<div class="callout callout--info">' + icons.help(18) + '<div><strong>¿Tu caso es distinto?</strong>' +
      '<p>Si hay una circunstancia que la ficha no cubre, genera una consulta con todo tu contexto para una IA gratuita y contrasta la respuesta con un abogado.</p>' +
      '<button class="btn btn--soft btn--sm mt-2" data-action="ai-ask" data-question="Estoy mirando la vía ' + esc(route.title) + ' y mi caso tiene una circunstancia que no encaja en la ficha. ¿Qué debo comprobar y qué alternativas tengo?">' + icons.help(14) + ' Preguntar a una IA</button></div></div>';

    html += formsBlock(route);

    html += '</div><aside class="plan-aside"><div class="block"><div class="block__head">' + icons.ext(18) + '<h2>Fuentes y enlaces</h2></div><div class="block__body">' +
      (route.links || []).map(function (l) {
        return '<div class="resource"><span class="resource__icon">' + icons.ext(15) + '</span><div><a href="' + esc(RL.dom.safeUrl(l.u)) + '" target="_blank" rel="noopener">' + esc(l.t) + '</a></div></div>';
      }).join('') + '</div></div>' +
      '<div class="block"><div class="block__body"><p class="muted" style="font-size:.84rem">Contenido revisado el ' + fmt.date(RL.CONTENT_DATE, { year: true }) + '. Confirma siempre en la fuente oficial antes de presentar una solicitud.</p></div></div></aside></div>';

    $('#view-vias').innerHTML = html;
    bindChecklist($('#view-vias'));
  }

  /* ══════════════════════════════════════════════════════════
     ONLINE · SEDES, NOTIFICACIONES Y CANJES
     ══════════════════════════════════════════════════════════ */
  function renderOnline() {
    var host = $('#view-online');
    if (!RL.online) {
      host.innerHTML = emptyState('Online no disponible', 'No se ha cargado la guía de trámites online.', 'Volver al inicio', 'inicio');
      return;
    }
    var p = RL.profile();
    var d = RL.derive(p);
    var region = d.region;
    var ctx = {
      region: region,
      regionName: region ? region.name : 'tu comunidad',
      regionLabel: region ? region.regionLabel : 'tu comunidad',
      healthName: region ? region.healthName : 'Servicio de salud',
      localLabel: region ? region.localLabel : 'Ayuntamiento',
      municipality: d.municipality
    };
    var q = ui.onlineSearch.toLowerCase();
    var list = RL.online.items.filter(function (it) {
      if ((it.scope === 'region' || it.scope === 'local') && !region) return false;
      if (ui.onlineFilter !== 'todas' && it.cat !== ui.onlineFilter) return false;
      if (!q) return true;
      var where = typeof it.where === 'function' ? it.where(ctx) : it.where;
      return (it.title + ' ' + (it.what || []).join(' ') + ' ' + it.requires + ' ' + where).toLowerCase().indexOf(q) !== -1;
    });

    var html = '<div class="plan-head"><div><p class="eyebrow">Online</p><h1>Trámites online, notificaciones y sedes</h1>' +
      '<p class="plan-head__sub">Qué puedes iniciar o terminar desde el móvil, qué exige cita y dónde mirar tus notificaciones. Se adapta a tu comunidad y provincia.</p></div></div>';

    html += '<div class="callout callout--warn">' + icons.alert(18) + '<div><strong>No todo es 100% online</strong><p>Muchos trámites se inician en la sede pero terminan con cita o entrega de documentos. La app no te pide Cl@ve ni contraseñas: solo enlaza a las sedes oficiales. Desconfía de enlaces que no sean <strong>.gob.es</strong>. Enlaces revisados el ' + esc(RL.online.checked || '') + '.</p></div></div>';

    if (!region) {
      html += '<div class="callout callout--info" style="margin-bottom:16px">' + icons.info(18) +
        '<div><strong>Elige tu provincia</strong><p>Sin provincia solo mostramos los portales nacionales. Para la sede de tu comunidad y tu ayuntamiento, indica dónde vives.</p><button class="btn btn--soft btn--sm mt-2" data-nav="directorio">Elegir provincia</button></div></div>';
    } else {
      html += '<p class="muted" style="font-size:.83rem;margin:-8px 0 16px">Viendo: <strong>' + esc(region.name) + '</strong>' +
        (d.province ? ' · ' + esc(d.province) : '') + (d.municipality ? ' · ' + esc(d.municipality) : '') + '</p>';
    }

    html += '<div class="dir-controls" style="grid-template-columns:minmax(220px,1fr)"><div class="search">' + icons.search(18) +
      '<input class="input" type="search" id="onlineSearch" placeholder="Buscar: Cl@ve, DEHú, DGT, Mercurio, notificaciones…" value="' + esc(ui.onlineSearch) + '" aria-label="Buscar trámites online"></div></div>';

    html += '<div class="flex" style="gap:6px;margin:0 0 18px;flex-wrap:wrap">' + RL.online.categories.map(function (c) {
      return '<button class="btn btn--sm ' + (ui.onlineFilter === c.id ? 'btn--primary' : 'btn--soft') + '" data-action="online-filter" data-filter="' + esc(c.id) + '">' + esc(c.label) + '</button>';
    }).join('') + '</div>';

    if (!list.length) {
      html += '<div class="empty-state"><h2>Sin resultados</h2><p>Prueba con otra palabra o cambia el filtro.</p></div>';
    } else {
      html += '<div class="catalog-grid">' + list.map(function (it) { return onlineCard(it, ctx); }).join('') + '</div>';
    }

    html += '<div class="callout callout--info" style="margin-top:20px">' + icons.shield(18) +
      '<div><strong>Notificaciones: no las ignores</strong><p>Activa DEHú y revisa la Carpeta Ciudadana. Una notificación puede caducar y hacerte perder un plazo. Si no entiendes una notificación, llévala a una entidad o a un abogado antes de que pase el plazo.</p></div></div>';

    host.innerHTML = html;

    var search = $('#onlineSearch');
    if (search) {
      search.addEventListener('input', function () {
        ui.onlineSearch = search.value;
        clearTimeout(search._t);
        search._t = setTimeout(function () {
          var pos = search.selectionStart;
          renderOnline();
          var s2 = $('#onlineSearch');
          if (s2) { s2.focus(); s2.setSelectionRange(pos, pos); }
        }, 220);
      });
    }
  }

  function onlineCard(it, ctx) {
    var where = typeof it.where === 'function' ? it.where(ctx) : it.where;
    var url = RL.online.resolveUrl(it, ctx.region);
    var mode = it.mode === 'total'
      ? ['100 % online', 'badge--ok']
      : (it.mode === 'partial' ? ['Online + presencial', 'badge--warn'] : ['Consultar', 'badge--neutral']);
    return '<article class="card proc-card">' +
      '<div class="dir-card__head"><span class="dir-card__icon">' + icons.globe(20) + '</span><div><h3>' + esc(it.title) + '</h3><span class="badge ' + mode[1] + '">' + mode[0] + '</span></div></div>' +
      '<ul class="dir-card__what">' + (it.what || []).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' +
      '<p class="proc-meta">' + icons.user(13) + ' ' + esc(it.requires) + '</p>' +
      '<p class="proc-meta">' + icons.pin(13) + ' ' + esc(where) + '</p>' +
      '<a class="btn btn--primary btn--sm" href="' + esc(RL.dom.safeUrl(url)) + '" target="_blank" rel="noopener">' + icons.ext(14) + ' Abrir sede oficial</a>' +
      (it.note ? '<p class="dir-card__note">' + esc(it.note) + '</p>' : '') +
      '</article>';
  }

  /* ══════════════════════════════════════════════════════════
     PREGUNTAS FRECUENTES
     ══════════════════════════════════════════════════════════ */
  function renderPreguntas() {
    var host = $('#view-preguntas');
    if (!RL.faq) {
      host.innerHTML = emptyState('Preguntas no disponibles', 'No se ha cargado la sección de preguntas.', 'Volver al inicio', 'inicio');
      return;
    }
    var q = ui.faqSearch.toLowerCase();
    var catLabel = {};
    RL.faq.categories.forEach(function (c) { catLabel[c.id] = c.label; });
    var list = RL.faq.sort(RL.faq.items.filter(function (f) {
      if (ui.faqFilter !== 'todas' && f.cat !== ui.faqFilter) return false;
      if (!q) return true;
      return (f.q + ' ' + f.short + ' ' + f.detail.join(' ')).toLowerCase().indexOf(q) !== -1;
    }));

    var html = '<div class="plan-head"><div><p class="eyebrow">Preguntas</p><h1>Dudas reales, respuestas claras</h1>' +
      '<p class="plan-head__sub">Recogidas de dudas recurrentes en foros y consultas, contrastadas con la norma y la sede oficial. Búscalas por tema o por palabra.</p></div></div>';

    html += '<div class="callout callout--warn">' + icons.alert(18) + '<div><strong>No es asesoramiento jurídico</strong><p>Son respuestas generales. Tu caso puede tener matices (antecedentes, asilo, menores, expulsión). Si hay riesgo, consulta con un abogado o una entidad social.</p></div></div>';

    html += '<div class="dir-controls" style="grid-template-columns:minmax(220px,1fr)"><div class="search">' + icons.search(18) +
      '<input class="input" type="search" id="faqSearch" placeholder="Buscar: patera, asilo, arraigo, 30 horas, inspección…" value="' + esc(ui.faqSearch) + '" aria-label="Buscar preguntas"></div></div>';

    html += '<div class="flex" style="gap:6px;margin:0 0 18px;flex-wrap:wrap">' + RL.faq.categories.map(function (c) {
      return '<button class="btn btn--sm ' + (ui.faqFilter === c.id ? 'btn--primary' : 'btn--soft') + '" data-action="faq-filter" data-filter="' + esc(c.id) + '">' + esc(c.label) + '</button>';
    }).join('') + '</div>';

    if (!list.length) {
      html += '<div class="empty-state"><h2>Sin resultados</h2><p>Prueba con otra palabra o cambia el tema.</p></div>';
    } else {
      html += '<div class="faq-list">' + list.map(function (f) {
        return '<details class="faq-item"><summary><span class="badge badge--info">' + esc(catLabel[f.cat] || f.cat) + '</span><strong>' + esc(f.q) + '</strong></summary>' +
          '<div class="faq-body"><p>' + esc(f.short) + '</p><ul>' +
          f.detail.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') +
          '</ul>' +
          (f.links && f.links.length ? '<div class="flex" style="flex-wrap:wrap;margin-top:10px">' + f.links.map(function (l) {
            return '<a class="btn btn--ghost btn--sm" href="' + esc(RL.dom.safeUrl(l[1])) + '" target="_blank" rel="noopener">' + icons.ext(14) + ' ' + esc(l[0]) + '</a>';
          }).join('') + '</div>' : '') +
          '</div></details>';
      }).join('') + '</div>';
    }

    html += '<div class="callout callout--info" style="margin-top:18px">' + icons.route(18) + '<div><strong>¿No encuentras tu caso?</strong><p>Consulta una IA con todo tu contexto o revisa las vías y los trámites.</p><div class="flex mt-2"><button class="btn btn--soft btn--sm" data-action="ai-ask" data-question="Tengo una duda que no aparece en las preguntas frecuentes. ¿Puedes revisar mi caso?">' + icons.help(14) + ' Preguntar a una IA</button><button class="btn btn--ghost btn--sm" data-nav="tramites">Ver trámites</button></div></div></div>';

    host.innerHTML = html;

    var search = $('#faqSearch');
    if (search) {
      search.addEventListener('input', function () {
        ui.faqSearch = search.value;
        clearTimeout(search._t);
        search._t = setTimeout(function () {
          var pos = search.selectionStart;
          renderPreguntas();
          var s2 = $('#faqSearch');
          if (s2) { s2.focus(); s2.setSelectionRange(pos, pos); }
        }, 220);
      });
    }
  }

  /* ══════════════════════════════════════════════════════════
     DERECHOS Y AYUDAS
     ══════════════════════════════════════════════════════════ */
  function zoneEntitiesHTML(d) {
    if (!RL.directory) return '';
    var entries = RL.directory.entries.filter(function (e) {
      if (e.cat !== 'ayuda') return false;
      if (e.scope !== 'national' && (!d.region || !d.province)) return false;
      if (e.provinces && e.provinces.length && d.province && !inPlace(e.provinces, d.province)) return false;
      if (e.municipalities && e.municipalities.length && d.municipality && !inPlace(e.municipalities, d.municipality)) return false;
      return true;
    }).slice(0, 8);
    if (!entries.length) return '';
    return '<div class="block" style="margin-bottom:18px"><div class="block__head">' + icons.family(18) +
      '<h2>Entidades de apoyo en tu zona</h2></div><div class="block__body">' +
      '<p class="muted" style="font-size:.86rem;margin-top:0">Asociaciones y entidades que suelen orientar, acompañar o derivar. No sustituyen a un abogado ni garantizan papeles; confirma horario y cobertura.</p>' +
      entries.map(function (e) {
        var title = typeof e.title === 'function' ? e.title({ municipality: d.municipality, regionName: d.region ? d.region.name : '' }) : e.title;
        var where = typeof e.where === 'function' ? e.where({ municipality: d.municipality, regionName: d.region ? d.region.name : '' }) : e.where;
        return '<div class="resource" style="align-items:flex-start"><span class="resource__icon">' + icons.family(15) + '</span><div>' +
          '<strong>' + esc(title) + '</strong><p style="font-size:.85rem;color:var(--ink-2);margin:2px 0 0">' + esc((e.what || []).join(' · ')) + '</p>' +
          '<p class="muted" style="font-size:.78rem;margin:3px 0 0">' + esc(where) + '</p></div></div>';
      }).join('') +
      '<button class="btn btn--soft btn--sm mt-2" data-nav="directorio">Ver directorio completo</button></div></div>';
  }

  function renderDerechos() {
    var host = $('#view-derechos');
    if (!RL.aids) {
      host.innerHTML = emptyState('Ayudas no disponibles', 'No se ha cargado la guía de derechos y ayudas.', 'Volver al inicio', 'inicio');
      return;
    }
    var p = RL.profile();
    var d = RL.derive(p);
    var region = d.region;
    var ctx = {
      region: region,
      regionName: region ? region.name : 'tu comunidad',
      localLabel: region ? region.localLabel : 'Ayuntamiento',
      municipality: d.municipality
    };
    var adult = RL.aids.adultDisabledOptions(p, d);
    var q = ui.aidSearch.toLowerCase();
    var list = RL.aids.all.filter(function (a) {
      if ((a.scope === 'region' || a.scope === 'local') && !region) return false;
      if (ui.aidFilter !== 'todas' && a.cat !== ui.aidFilter) return false;
      if (!q) return true;
      var where = typeof a.where === 'function' ? a.where(ctx) : a.where;
      return (a.title + ' ' + (a.what || []).join(' ') + ' ' + a.who + ' ' + where).toLowerCase().indexOf(q) !== -1;
    });

    var html = '<div class="plan-head"><div><p class="eyebrow">Derechos y ayudas</p><h1>Discapacidad, menores, familia y apoyo</h1>' +
      '<p class="plan-head__sub">Qué derechos tienes, qué ayudas existen, dónde se piden y qué no es lo mismo aunque lo parezca. Se adapta a tu comunidad y municipio.</p></div></div>';

    if (!region) {
      html += '<div class="callout callout--info" style="margin-bottom:16px">' + icons.info(18) +
        '<div><strong>Elige tu provincia</strong><p>Las ayudas de discapacidad, dependencia, familia numerosa y vivienda dependen de la comunidad. Sin provincia solo mostramos las nacionales.</p><button class="btn btn--soft btn--sm mt-2" data-nav="directorio">Elegir provincia</button></div></div>';
    }

    html += zoneEntitiesHTML(d);

    if (adult.length) {
      html += '<div class="block" style="margin-bottom:18px"><div class="block__head">' + icons.shield(18) +
        '<h2>Discapacidad y residencia: tu caso</h2><span class="badge badge--warn">No es automático</span></div><div class="block__body">' +
        adult.map(function (x) {
          return '<div class="resource" style="align-items:flex-start"><span class="resource__icon">' + icons.info(15) + '</span><div><strong>' + esc(x.t) + '</strong><p style="font-size:.86rem;color:var(--ink-2);margin:2px 0 0">' + esc(x.b) + '</p></div></div>';
        }).join('') +
        '<button class="btn btn--soft btn--sm mt-2" data-nav="tramites">' + icons.route(15) + ' Ver trámites de renovación</button>' +
        '</div></div>';
    }

    html += '<div class="block" style="margin-bottom:18px"><div class="block__head">' + icons.alert(18) +
      '<h2>No son lo mismo: discapacidad, incapacidad, dependencia y familia numerosa</h2></div><div class="block__body">' +
      '<div class="resource" style="align-items:flex-start"><span class="resource__icon">' + icons.shield(15) + '</span><div><strong>Certificado de discapacidad</strong><p style="font-size:.86rem;color:var(--ink-2)">Lo expide la <strong>comunidad autónoma</strong> (servicios sociales / centro de valoración). Reconoce un grado (33 %, 65 %…). No es un permiso de residencia. <strong>No lo emite el ayuntamiento</strong> ni la Seguridad Social.</p></div></div>' +
      '<div class="resource" style="align-items:flex-start"><span class="resource__icon">' + icons.briefcase(15) + '</span><div><strong>Incapacidad permanente</strong><p style="font-size:.86rem;color:var(--ink-2)">La declara la <strong>Seguridad Social (INSS)</strong> y valora tu capacidad laboral; puede dar pensión. <strong>No es el certificado de discapacidad</strong> y no garantiza el 33 %.</p></div></div>' +
      '<div class="resource" style="align-items:flex-start"><span class="resource__icon">' + icons.family(15) + '</span><div><strong>Dependencia</strong><p style="font-size:.86rem;color:var(--ink-2)">La valora la <strong>comunidad autónoma (SAAD)</strong> y da servicios o prestaciones por necesitar apoyo en la vida diaria. Es distinta de la discapacidad y de la incapacidad laboral.</p></div></div>' +
      '<div class="resource" style="align-items:flex-start"><span class="resource__icon">' + icons.family(15) + '</span><div><strong>Familia numerosa</strong><p style="font-size:.86rem;color:var(--ink-2)">Es un <strong>título de la comunidad autónoma</strong> con ventajas educativas, fiscales, transporte y vivienda. No es un certificado de discapacidad.</p></div></div>' +
      '<div class="callout callout--warn" style="margin-top:10px">' + icons.alert(18) + '<div><strong>Abogados que prometen un certificado en un año</strong><p>El grado y el plazo los decide la administración según baremo y lista de espera. Ningún abogado puede garantizar el resultado ni un plazo exacto. Desconfía de quien cobra por «conseguirlo» sin explicarte el procedimiento.</p></div></div>' +
      '</div></div>';

    html += '<div class="block" style="margin-bottom:18px"><div class="block__head">' + icons.shield(18) +
      '<h2>Si te para la policía: derechos y miedos reales</h2></div><div class="block__body">' +
      '<p><strong>No tengas miedo a la policía: estar irregular no es un delito penal.</strong> Eso no significa que no haya riesgo: una orden de salida, antecedentes, un control o trabajar sin permiso pueden complicar tu situación. Conocer tus derechos reduce el riesgo.</p>' +
      '<ul style="padding-left:18px;font-size:.88rem;color:var(--ink-2)">' +
      '<li><strong>Estar irregular no es un delito penal</strong>: es una infracción administrativa. No entres en pánico, pero tampoco es «no pasa nada»: una orden de salida, antecedentes, un control o trabajar sin permiso pueden complicar tu situación.</li>' +
      '<li><strong>La expulsión no es automática</strong>: requiere expediente, audiencia y resolución. No es fácil que te deporten por estar irregular, pero puede ocurrir; no es una lotería.</li>' +
      '<li>Lleva <strong>pasaporte o NIE</strong> si lo tienes. No des una identidad falsa ni firmes un documento que no entiendas.</li>' +
      '<li>Si te detienen: derecho a <strong>abogado, intérprete, no declarar y avisar a un familiar o a tu consulado</strong>. Pide copia de lo que firmes.</li>' +
      '<li>En tu casa, la policía necesita <strong>orden judicial, consentimiento o flagrancia</strong>; pide que se identifiquen y no resistas. Si no entiendes, pide intérprete.</li>' +
      '<li><strong>No confíes en quien promete papeles a cambio de dinero</strong>. Ningún gestor puede garantizar una autorización.</li>' +
      '</ul>' +
      '<button class="btn btn--soft btn--sm mt-2" data-nav="tramites">' + icons.route(15) + ' Ver documentos y trámites</button>' +
      '</div></div>';

    html += '<div class="block" style="margin-bottom:18px"><div class="block__head">' + icons.alert(18) +
      '<h2>Antecedentes: 1 año no es lo mismo que 20</h2></div><div class="block__body">' +
      '<ul style="padding-left:18px;font-size:.88rem;color:var(--ink-2)">' +
      '<li><strong>Antecedentes penales, policiales y delitos sexuales son registros distintos</strong>. El certificado de antecedentes penales no sirve para trabajar con menores: para eso se pide el certificado de delitos de naturaleza sexual.</li>' +
      '<li>Muchas vías miran los <strong>últimos 5 años</strong>. Los certificados suelen caducar a los 3-6 meses; no presentes uno viejo.</li>' +
      '<li><strong>Un antecedente de hace 1 año</strong> suele ser reciente y puede afectar. <strong>Uno de hace 20</strong> puede estar cancelado o no: depende del país, del delito y de la pena. No des por hecho que «ya no aparece».</li>' +
      '<li>No todos los delitos bloquean todas las vías. La oficina valora gravedad, cancelación y rehabilitación; desde 2026 no hay automatismo por antecedentes. Los delitos sexuales con menores son especialmente graves.</li>' +
      '<li><strong>No mientas</strong>. Un certificado negativo falso o una declaración falsa puede cerrarte todas las puertas. Un abogado puede revisar el certificado y la cancelación.</li>' +
      '</ul>' +
      '<button class="btn btn--soft btn--sm mt-2" data-nav="tramites">' + icons.route(15) + ' Cómo obtener los certificados</button>' +
      '</div></div>';

    html += '<div class="block" style="margin-bottom:18px"><div class="block__head">' + icons.family(18) +
      '<h2>Menores: derechos y residencia</h2></div><div class="block__body">' +
      '<ul style="padding-left:18px;font-size:.88rem;color:var(--ink-2)">' +
      '<li><strong>Sanidad y educación</strong> no dependen de la situación administrativa del menor. Un centro no puede negar la escolarización por irregularidad.</li>' +
      '<li><strong>Protección y servicios sociales</strong>: si hay riesgo o desamparo, interviene la comunidad autónoma. Un menor no acompañado tiene derecho a tutela.</li>' +
      '<li><strong>Nacer en España no da nacionalidad</strong>. Si el padre/madre es español y reconoce al hijo, el hijo es español; si no, la filiación puede necesitar juez.</li>' +
      '<li><strong>Residencia de menor acompañado nacido en España</strong> (art. 159): 5 años, se solicita por el progenitor en los 6 meses desde el nacimiento; resolución en 1 mes. [PV]</li>' +
      '<li><strong>Al cumplir 18</strong> cambia el mapa: revisa arraigo, renovación, residencia de extutelado o familiar de español. No esperes al último día.</li>' +
      '</ul>' +
      '<button class="btn btn--soft btn--sm mt-2" data-nav="tramites">' + icons.route(15) + ' Ver trámites y documentos</button>' +
      '</div></div>';

    html += '<div class="block" style="margin-bottom:18px"><div class="block__head">' + icons.book(18) +
      '<h2>Reconocer estudios: ESO, Bachillerato, FP y universidad</h2></div><div class="block__body">' +
      '<ul style="padding-left:18px;font-size:.88rem;color:var(--ink-2)">' +
      '<li><strong>Homologación</strong>: un título extranjero se equipara a un título español (Graduado en ESO, Bachillerato, FP, Grado o Máster). Es lo que necesitas si te piden «el título español».</li>' +
      '<li><strong>Convalidación</strong>: se reconocen asignaturas o cursos, pero <strong>no te da un título</strong>. Sirve para continuar estudios o evitar repetir materias.</li>' +
      '<li><strong>Equivalencia</strong>: reconoce un nivel académico o de escolaridad; no siempre equivale a un título.</li>' +
      '<li><strong>UNEDasiss</strong>: acredita el acceso a la universidad española con estudios extranjeros; <strong>no homologa</strong> el título.</li>' +
      '<li><strong>¿Quién puede pedirlo?</strong> Cualquier persona con estudios extranjeros, con pasaporte o NIE. El trámite <strong>no exige residencia legal</strong> y <strong>no regulariza</strong> tu situación. Para matricularse en enseñanzas regladas o acceder a la universidad puede exigirse autorización de estancia/residencia o visado: eso es distinto del reconocimiento.</li>' +
      '</ul>' +
      '<button class="btn btn--soft btn--sm mt-2" data-nav="tramites">' + icons.route(15) + ' Ver homologación, UNEDasiss y documentos</button>' +
      '</div></div>';

    html += '<div class="dir-controls" style="grid-template-columns:minmax(220px,1fr)"><div class="search">' + icons.search(18) +
      '<input class="input" type="search" id="aidSearch" placeholder="Buscar: IMV, dependencia, familia numerosa, vivienda, abogado…" value="' + esc(ui.aidSearch) + '" aria-label="Buscar ayudas"></div></div>';

    html += '<div class="flex" style="gap:6px;margin:0 0 18px;flex-wrap:wrap">' + RL.aids.categories.map(function (c) {
      return '<button class="btn btn--sm ' + (ui.aidFilter === c.id ? 'btn--primary' : 'btn--soft') + '" data-action="aid-filter" data-filter="' + esc(c.id) + '">' + esc(c.label) + '</button>';
    }).join('') + '</div>';

    if (!list.length) {
      html += '<div class="empty-state"><h2>Sin resultados</h2><p>Cambia el filtro o busca otra palabra.</p></div>';
    } else {
      html += '<div class="catalog-grid">' + list.map(function (a) { return aidCard(a, ctx); }).join('') + '</div>';
    }

    html += '<div class="callout callout--info" style="margin-top:20px">' + icons.info(18) +
      '<div><strong>Las ayudas cambian por comunidad y por año</strong><p>Esta guía explica qué existe y dónde se pide, pero no garantiza que te la concedan. Comprueba requisitos, plazos y cuantías en la sede oficial o en servicios sociales. Si estás en situación irregular, muchas ayudas económicas exigen residencia legal; las de emergencia municipal pueden no exigirla.</p></div></div>';

    host.innerHTML = html;

    var search = $('#aidSearch');
    if (search) {
      search.addEventListener('input', function () {
        ui.aidSearch = search.value;
        clearTimeout(search._t);
        search._t = setTimeout(function () {
          var pos = search.selectionStart;
          renderDerechos();
          var s2 = $('#aidSearch');
          if (s2) { s2.focus(); s2.setSelectionRange(pos, pos); }
        }, 220);
      });
    }
  }

  function aidCard(a, ctx) {
    var where = typeof a.where === 'function' ? a.where(ctx) : a.where;
    var url = RL.aids.resolveUrl(a, ctx.region);
    var iconFn = icons[a.icon] || icons.doc;
    return '<article class="card dir-card">' +
      '<div class="dir-card__head"><span class="dir-card__icon">' + iconFn(20) + '</span><div><h3>' + esc(a.title) + '</h3><span class="badge badge--info">' + esc(a.cat) + '</span></div></div>' +
      '<ul class="dir-card__what">' + (a.what || []).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' +
      '<p class="dir-card__where">' + icons.user(13) + ' ' + esc(a.who) + '</p>' +
      '<p class="dir-card__where">' + icons.pin(13) + ' ' + esc(where) + '</p>' +
      '<a class="btn btn--soft btn--sm" href="' + esc(RL.dom.safeUrl(url)) + '" target="_blank" rel="noopener">' + icons.ext(14) + ' Abrir web oficial</a>' +
      (a.note ? '<p class="dir-card__note">' + esc(a.note) + '</p>' : '') +
      '</article>';
  }

  /* ══════════════════════════════════════════════════════════
     TRÁMITES · QUÉ HACER, DÓNDE Y CON QUÉ CITA
     ══════════════════════════════════════════════════════════ */
  function renderTramites() {
    var host = $('#view-tramites');
    if (!RL.procedures) {
      host.innerHTML = emptyState('Trámites no disponibles', 'No se ha cargado la guía de trámites.', 'Volver al inicio', 'inicio');
      return;
    }
    var p = RL.profile();
    var d = RL.derive(p);
    var region = d.region;
    var ctx = {
      region: region,
      localLabel: region ? region.localLabel : 'Ayuntamiento',
      municipality: d.municipality,
      province: d.province,
      regionName: region ? region.name : ''
    };
    var plan = p && p.nationality ? RL.buildPlan(p) : null;
    var mine = plan ? RL.procedures.forRoutes(plan.recommended.map(function (r) { return r.route.id; })) : [];
    var mineIds = {};
    mine.forEach(function (x) { mineIds[x.id] = true; });

    var q = ui.procSearch.toLowerCase();
    var list = RL.procedures.all.filter(function (pr) {
      if (pr.scope === 'local' && !region && pr.id !== 'padron') return false;
      if (ui.procMine && pr.routeIds.length && !mineIds[pr.id]) return false;
      if (ui.procFilter !== 'todas' && pr.cat !== ui.procFilter) return false;
      if (!q) return true;
      var where = typeof pr.where === 'function' ? pr.where(ctx) : pr.where;
      return (pr.title + ' ' + pr.when + ' ' + where + ' ' + pr.docs.join(' ') + ' ' + pr.steps.join(' ')).toLowerCase().indexOf(q) !== -1;
    });

    var html = '';
    html += '<div class="plan-head"><div><p class="eyebrow">Trámites</p><h1>Qué hacer, dónde y con qué cita</h1>' +
      '<p class="plan-head__sub">Guías paso a paso: enlace de cita, documentos que hay que llevar, tasa, plazos y errores que cuestan caro. Se adaptan a tu provincia y municipio.</p></div>' +
      '<div class="plan-head__actions"><button class="btn btn--soft btn--sm" data-nav="online">' + icons.globe(15) + ' Ver trámites online</button></div></div>';

    if (region) {
      html += '<p class="muted" style="font-size:.83rem;margin:-8px 0 16px">Viendo: <strong>' + esc(region.name) + '</strong>' +
        (d.province ? ' · ' + esc(d.province) : '') + (d.municipality ? ' · ' + esc(d.municipality) : '') + '</p>';
    } else {
      html += '<div class="callout callout--info" style="margin-bottom:16px">' + icons.info(18) +
        '<div><strong>Elige tu provincia</strong><p>Así adaptamos el ayuntamiento, el centro de salud y la oficina de empleo. Los trámites nacionales funcionan igual en toda España.</p><button class="btn btn--soft btn--sm mt-2" data-nav="directorio">Elegir provincia</button></div></div>';
    }

    html += '<div class="callout callout--info" style="margin-bottom:16px">' + icons.home(18) +
      '<div><strong>Lo primero: empadrónate</strong><p>El padrón es gratuito y no es un permiso de residencia. Sirve para acreditar dónde vives, acceder a sanidad, escuela y ayudas, y preparar arraigos. Está disponible aunque aún no tengas provincia seleccionada.</p><button class="btn btn--soft btn--sm mt-2" data-action="proc-highlight" data-id="padron">Ver guía de empadronamiento</button></div></div>';

    html += '<div class="dir-controls" style="grid-template-columns:minmax(220px,1fr) auto">' +
      '<div class="search">' + icons.search(18) + '<input class="input" type="search" id="procSearch" placeholder="Buscar: NIE, arraigo, cita, nacionalidad, padrón…" value="' + esc(ui.procSearch) + '" aria-label="Buscar trámites"></div>' +
      '<button class="btn btn--sm ' + (ui.procMine ? 'btn--primary' : 'btn--soft') + '" data-action="proc-mine">' + (ui.procMine ? 'Viendo mi plan' : 'Solo los de mi plan') + '</button>' +
      '</div>';

    html += '<div class="flex" style="gap:6px;margin:0 0 18px;flex-wrap:wrap">' + RL.procedures.categories.map(function (c) {
      return '<button class="btn btn--sm ' + (ui.procFilter === c.id ? 'btn--primary' : 'btn--soft') + '" data-action="proc-filter" data-filter="' + esc(c.id) + '">' + esc(c.label) + '</button>';
    }).join('') + '</div>';

    if (!list.length) {
      html += '<div class="empty-state"><h2>Sin resultados</h2><p>Cambia el filtro o busca otra palabra.</p></div>';
    } else {
      html += '<div class="catalog-grid">' + list.map(function (pr) { return procCard(pr, ctx); }).join('') + '</div>';
    }

    html += '<div class="callout callout--info" style="margin-top:20px">' + icons.help(18) + '<div><strong>¿No sabes qué trámite te toca?</strong>' +
      '<p>El plan te dice la vía; esta página te dice cómo ejecutarla. Si tu caso tiene una particularidad, genera una consulta con contexto para una IA gratuita y contrástala con un abogado.</p>' +
      '<button class="btn btn--soft btn--sm mt-2" data-action="ai-ask" data-question="No sé qué trámite me toca ni cómo pedir cita. ¿Puedes explicarme el paso a paso y qué documentos llevar?">' + icons.help(14) + ' Preguntar a una IA</button></div></div>';

    host.innerHTML = html;

    var search = $('#procSearch');
    if (search) {
      search.addEventListener('input', function () {
        ui.procSearch = search.value;
        clearTimeout(search._t);
        search._t = setTimeout(function () {
          var pos = search.selectionStart;
          renderTramites();
          var s2 = $('#procSearch');
          if (s2) { s2.focus(); s2.setSelectionRange(pos, pos); }
        }, 220);
      });
    }
  }

  function procCard(pr, ctx) {
    var where = typeof pr.where === 'function' ? pr.where(ctx) : pr.where;
    var url = pr.appointment || RL.procedures.resolveUrl(pr, ctx.region);
    var label = pr.appointmentLabel || 'Abrir web oficial';
    var iconFn = icons[pr.icon] || icons.doc;
    return '<article class="card proc-card" id="proc-' + esc(pr.id) + '">' +
      '<div class="dir-card__head"><span class="dir-card__icon">' + iconFn(20) + '</span><div><h3>' + esc(pr.title) + '</h3><span class="badge badge--info">' + esc(pr.cat) + '</span></div></div>' +
      '<p class="proc-meta">' + icons.pin(13) + ' ' + esc(where) + '</p>' +
      '<p class="proc-meta">' + icons.clock(13) + ' ' + esc(pr.when) + '</p>' +
      '<a class="btn btn--primary btn--sm" href="' + esc(RL.dom.safeUrl(url)) + '" target="_blank" rel="noopener">' + icons.ext(14) + ' ' + esc(label) + '</a>' +
      '<div><strong style="font-size:.85rem">Qué llevar</strong><ul class="proc-docs">' + pr.docs.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div>' +
      '<div><strong style="font-size:.85rem">Paso a paso</strong><ol class="proc-steps">' + pr.steps.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ol></div>' +
      '<p class="proc-meta">' + icons.euro(13) + ' ' + esc(pr.fee) + '</p>' +
      (pr.note ? '<p class="dir-card__note">' + esc(pr.note) + '</p>' : '') +
      '</article>';
  }

  /* ══════════════════════════════════════════════════════════
     DÓNDE IR · DIRECTORIO
     ══════════════════════════════════════════════════════════ */
  function normPlace(v) {
    return String(v || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  }

  function inPlace(list, value) {
    if (!list || !list.length) return true;
    var v = normPlace(value);
    return !!v && list.some(function (x) { return normPlace(x) === v; });
  }

  function localEntitiesHTML(d) {
    if (!RL.directory) return '';
    var entries = RL.directory.entries.filter(function (e) {
      if (e.cat !== 'ayuda' || e.scope === 'national') return false;
      if (!d.region) return false;
      if (e.provinces && e.provinces.length && d.province && !inPlace(e.provinces, d.province)) return false;
      if (e.municipalities && e.municipalities.length && d.municipality && !inPlace(e.municipalities, d.municipality)) return false;
      return true;
    }).slice(0, 8);
    var networks = (RL.directory.networks || []).slice(0, 8);
    if (!entries.length && !networks.length) return '';
    var html = '<div class="block" style="margin-bottom:18px"><div class="block__head">' + icons.family(18) +
      '<h2>Entidades de tu zona</h2><span class="badge badge--info">' + esc((d.municipality || '') + (d.province ? ' · ' + d.province : '')) + '</span></div><div class="block__body">';
    if (entries.length) {
      html += '<p class="muted" style="font-size:.86rem;margin-top:0">Asociaciones locales verificadas. No sustituyen a un abogado ni garantizan papeles; confirma cita y cobertura.</p>' +
        entries.map(function (e) {
          var title = typeof e.title === 'function' ? e.title({ municipality: d.municipality, regionName: d.region ? d.region.name : '' }) : e.title;
          var where = typeof e.where === 'function' ? e.where({ municipality: d.municipality, regionName: d.region ? d.region.name : '' }) : e.where;
          return '<div class="resource" style="align-items:flex-start"><span class="resource__icon">' + icons.family(15) + '</span><div>' +
            '<strong>' + esc(title) + '</strong><p style="font-size:.85rem;color:var(--ink-2);margin:2px 0 0">' + esc((e.what || []).join(' · ')) + '</p>' +
            '<p class="muted" style="font-size:.78rem;margin:3px 0 0">' + esc(where) + '</p>' +
            '<a class="btn btn--soft btn--sm mt-2" href="' + esc(RL.dom.safeUrl(e.url)) + '" target="_blank" rel="noopener">' + icons.ext(13) + ' Ver web</a></div></div>';
        }).join('');
    } else {
      html += '<div class="callout callout--warn">' + icons.info(18) + '<div><strong>No tenemos una asociación local verificada para ' + esc(d.municipality || d.province || 'tu zona') + '</strong><p>No significa que no exista. Consulta el directorio de tu comunidad o pregunta en el ayuntamiento; abajo tienes redes con sede provincial.</p></div></div>';
    }
    html += '<div class="block__head" style="margin-top:18px">' + icons.family(16) + '<h3 style="font-size:1rem;margin:0">Redes con sede local o provincial</h3></div>' +
      '<p class="muted" style="font-size:.82rem;margin:6px 0 8px">No están en todos los municipios, pero suelen tener oficina provincial, comarcal o parroquial. Busca la más cercana antes de desplazarte.</p>' +
      networks.map(function (n) {
        return '<div class="resource" style="align-items:flex-start"><span class="resource__icon">' + icons.family(15) + '</span><div>' +
          '<strong>' + esc(n.title) + '</strong><p style="font-size:.85rem;color:var(--ink-2);margin:2px 0 0">' + esc((n.what || []).join(' · ')) + '</p>' +
          '<p class="muted" style="font-size:.78rem;margin:3px 0 0">' + esc(n.where) + '</p>' +
          '<a class="btn btn--soft btn--sm mt-2" href="' + esc(RL.dom.safeUrl(n.url)) + '" target="_blank" rel="noopener">' + icons.ext(13) + ' Ver web</a></div></div>';
      }).join('');
    return html + '</div></div>';
  }

  function renderDirectorio() {
    var host = $('#view-directorio');
    if (!RL.directory) {
      host.innerHTML = emptyState('Directorio no disponible', 'No se ha cargado el directorio de oficinas.', 'Volver al inicio', 'inicio');
      return;
    }
    var p = RL.profile();
    var d = RL.derive(p);
    var region = d.region;
    var ctx = {
      region: region,
      regionName: region ? region.name : '',
      regionLabel: region ? region.regionLabel : 'Tu comunidad',
      healthName: region ? region.healthName : 'Servicio de salud',
      localLabel: region ? region.localLabel : 'Ayuntamiento',
      municipality: d.municipality,
      province: d.province
    };
    var q = ui.dirSearch.toLowerCase();

    var list = RL.directory.entries.filter(function (e) {
      if (e.scope !== 'national' && !region) return false;
      if (e.provinces && e.provinces.length && d.province && !inPlace(e.provinces, d.province)) return false;
      if (e.municipalities && e.municipalities.length && d.municipality && !inPlace(e.municipalities, d.municipality)) return false;
      if (ui.dirFilter !== 'todas' && e.cat !== ui.dirFilter) return false;
      if (!q) return true;
      var title = typeof e.title === 'function' ? e.title(ctx) : e.title;
      var where = typeof e.where === 'function' ? e.where(ctx) : e.where;
      return (title + ' ' + where + ' ' + (e.what || []).join(' ') + ' ' + (e.note || '')).toLowerCase().indexOf(q) !== -1;
    });

    var html = '<div class="plan-head"><div><p class="eyebrow">Directorio</p><h1>Dónde ir y para qué</h1>' +
      '<p class="plan-head__sub">Policía, extranjería, FNMT, Seguridad Social, SEPE, Registro Civil, salud, ayuntamiento, educación, embajadas y entidades de ayuda. Elige tu provincia y municipio para adaptar las oficinas.</p></div></div>';

    html += '<div class="dir-controls">' +
      '<div class="search">' + icons.search(18) + '<input class="input" type="search" id="dirSearch" placeholder="Buscar: policía, NIE, salud, padrón, FNMT…" value="' + esc(ui.dirSearch) + '" aria-label="Buscar en el directorio"></div>' +
      '<select class="select" id="dirProvince" aria-label="Provincia"><option value="">Selecciona provincia…</option>' +
      (RL.provinces || []).map(function (pr) {
        return '<option value="' + esc(pr) + '"' + (p.province === pr ? ' selected' : '') + '>' + esc(pr) + '</option>';
      }).join('') + '</select>' +
      '<input class="input" id="dirMunicipality" placeholder="Municipio o ciudad" value="' + esc(p.municipality || '') + '" aria-label="Municipio">' +
      '</div>';

    html += '<div class="flex" style="gap:6px;margin:0 0 18px">' + RL.directory.categories.map(function (c) {
      return '<button class="btn btn--sm ' + (ui.dirFilter === c.id ? 'btn--primary' : 'btn--soft') + '" data-action="dir-filter" data-filter="' + esc(c.id) + '">' + esc(c.label) + '</button>';
    }).join('') + '</div>';

    if (!region) {
      html += '<div class="callout callout--info" style="margin-bottom:18px">' + icons.info(18) +
        '<div><strong>Selecciona tu provincia</strong><p>Así te mostramos la Xunta o comunidad, tu concello o ayuntamiento, el centro de salud y la oficina de empleo de tu zona. Abajo tienes los servicios nacionales.</p></div></div>';
    } else {
      html += '<p class="muted" style="font-size:.83rem;margin:-8px 0 16px">Viendo: <strong>' + esc(region.name) + '</strong>' +
        (d.province ? ' · ' + esc(d.province) : '') + (d.municipality ? ' · ' + esc(d.municipality) : '') + '</p>';
    }

    html += localEntitiesHTML(d);

    html += '<div class="catalog-grid">' + list.map(function (e) { return dirCard(e, ctx); }).join('') + '</div>';
    if (!list.length) {
      html += '<div class="empty-state"><h2>Sin resultados</h2><p>Prueba con otra palabra o cambia el filtro.</p></div>';
    }

    html += '<div class="block" style="margin-top:22px"><div class="block__head">' + icons.alert(18) + '<h2>Si es urgente</h2></div><div class="block__body">' +
      (RL.resources.phones || []).map(function (ph) {
        return '<div class="resource"><span class="resource__icon">' + icons.help(15) + '</span><div><strong>' + esc(ph.n) + '</strong><p>' + esc(ph.d) + '</p></div></div>';
      }).join('') +
      '<p class="muted" style="font-size:.8rem;margin-top:8px">Si no sabes qué oficina te toca, llama al 012 de tu comunidad o pregunta en tu ayuntamiento/concello.</p>' +
      '</div></div>';

    host.innerHTML = html;

    var search = $('#dirSearch');
    if (search) {
      search.addEventListener('input', function () {
        ui.dirSearch = search.value;
        clearTimeout(search._t);
        search._t = setTimeout(function () {
          var pos = search.selectionStart;
          renderDirectorio();
          var s2 = $('#dirSearch');
          if (s2) { s2.focus(); s2.setSelectionRange(pos, pos); }
        }, 220);
      });
    }
    var prov = $('#dirProvince');
    if (prov) {
      prov.addEventListener('change', function () {
        RL.setProfile({ province: prov.value });
        renderDirectorio();
      });
    }
    var muni = $('#dirMunicipality');
    if (muni) {
      muni.addEventListener('change', function () {
        RL.setProfile({ municipality: muni.value.trim() });
        renderDirectorio();
      });
    }
  }

  function dirCard(e, ctx) {
    var title = typeof e.title === 'function' ? e.title(ctx) : e.title;
    var where = typeof e.where === 'function' ? e.where(ctx) : e.where;
    var url = RL.directory.resolveUrl(e, ctx.region, ctx);
    var iconFn = icons[e.icon] || icons.doc;
    var cat = (RL.directory.categories.filter(function (c) { return c.id === e.cat; })[0] || {}).label || e.cat;
    return '<article class="card dir-card">' +
      '<div class="dir-card__head"><span class="dir-card__icon">' + iconFn(20) + '</span><div><h3>' + esc(title) + '</h3><span class="badge badge--info">' + esc(cat) + '</span></div></div>' +
      '<p class="dir-card__where">' + icons.pin(13) + ' ' + esc(where) + '</p>' +
      '<ul class="dir-card__what">' + (e.what || []).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' +
      '<div class="flex">' +
      '<a class="btn btn--soft btn--sm" href="' + esc(RL.dom.safeUrl(url)) + '" target="_blank" rel="noopener">' + icons.ext(14) + ' Abrir web oficial</a>' +
      (e.phone ? '<a class="btn btn--ghost btn--sm" href="tel:' + esc(e.phone) + '">' + icons.help(14) + ' ' + esc(e.phone) + '</a>' : '') +
      '</div>' +
      (e.note ? '<p class="dir-card__note">' + esc(e.note) + '</p>' : '') +
      '</article>';
  }

  /* ══════════════════════════════════════════════════════════
     CONSULTA ABIERTA A UNA IA
     ══════════════════════════════════════════════════════════ */
  function renderConsulta() {
    var host = $('#view-consulta');
    if (!host) return;
    var p = RL.profile();
    var plan = p && p.nationality ? RL.buildPlan(p) : null;
    var saved = ui.aiLastId ? RL.ai.get(ui.aiLastId) : null;
    var base = ui.aiFollowBase;

    var html = '<div class="plan-head"><div><p class="eyebrow">Consulta abierta</p><h1>Pregunta a una IA cuando la app no llega</h1>' +
      '<p class="plan-head__sub">Generamos un prompt con tu caso, el diagnóstico y las instrucciones para que una IA gratuita te ayude. Tú revisas el prompt, lo envías y traes la respuesta. No se envía nada automáticamente.</p></div></div>';

    html += '<div class="callout callout--warn">' + icons.alert(18) + '<div><strong>Esto no es asesoramiento jurídico</strong>' +
      '<p>La respuesta la genera una IA externa (DeepSeek, ChatGPT u otra). Puede equivocarse, inventar una norma o no conocer un cambio reciente. Contrasta siempre con la sede oficial o con un abogado de extranjería. El prompt incluye datos de tu perfil: revísalo antes de enviarlo.</p></div></div>';

    if (!plan) {
      html += '<div class="callout callout--info">' + icons.info(18) + '<div><strong>Sin diagnóstico previo</strong><p>El prompt será genérico. Si haces primero el cuestionario, incluiremos tu perfil, las vías y los motivos.</p><button class="btn btn--soft btn--sm mt-2" data-nav="diagnostico">Hacer diagnóstico</button></div></div>';
    }

    if (base) {
      html += '<div class="callout callout--info">' + icons.route(18) + '<div><strong>Repregunta sobre la consulta anterior</strong>' +
        '<p>Se incluirá la respuesta anterior como contexto. <button class="btn btn--ghost btn--sm" data-action="ai-clear">Empezar de cero</button></p></div></div>';
    }

    html += '<div class="block"><div class="block__head">' + icons.help(18) + '<h2>1. Tu pregunta</h2></div><div class="block__body">' +
      '<textarea class="textarea" id="aiQuestion" rows="4" placeholder="Ej. Mi caso no encaja en el arraigo porque no tengo contrato. ¿Qué alternativas reales tengo?">' + esc(ui.aiQuestion) + '</textarea>' +
      '<div class="flex" style="gap:6px;margin-top:8px;flex-wrap:wrap">' +
      [
        ['Mi caso no encaja', 'Mi caso no encaja exactamente en las vías que me recomendáis. ¿Qué alternativas reales tengo?'],
        ['¿Puedo cambiar de vía?', 'Estoy en una vía y quiero cambiar a otra. ¿Puedo hacerlo sin salir de España y qué riesgos tengo?'],
        ['Me han denegado', 'Me han denegado una solicitud. ¿Qué puedo hacer, qué plazos tengo y qué documentos necesito para recurrir?'],
        ['Quiero trabajar', '¿Qué necesito para trabajar legalmente en mi situación y cuál es la vía más rápida?']
      ].map(function (x) {
        return '<button class="btn btn--ghost btn--sm" data-action="ai-suggest" data-question="' + esc(x[1]) + '">' + esc(x[0]) + '</button>';
      }).join('') + '</div>' +
      '<div class="flex" style="gap:14px;margin-top:12px;flex-wrap:wrap;font-size:.84rem">' +
      '<label style="display:flex;gap:7px;align-items:center"><input type="checkbox" id="aiIncDocs"' + (ui.aiOpts.includeDocs ? ' checked' : '') + '> Incluir documentos</label>' +
      '<label style="display:flex;gap:7px;align-items:center"><input type="checkbox" id="aiIncLoc"' + (ui.aiOpts.includeLocation ? ' checked' : '') + '> Incluir provincia/municipio</label>' +
      '<label style="display:flex;gap:7px;align-items:center"><input type="checkbox" id="aiIncNotes"' + (ui.aiOpts.includeNotes ? ' checked' : '') + '> Incluir notas</label>' +
      '</div>' +
      '<button class="btn btn--primary mt-3" data-action="ai-generate">' + icons.route(16) + ' Generar prompt</button>' +
      '</div></div>';

    if (ui.aiPrompt) {
      html += '<div class="block"><div class="block__head">' + icons.doc(18) + '<h2>2. Prompt para la IA</h2><span class="badge badge--ok">Revisable</span></div><div class="block__body">' +
        '<textarea class="textarea" id="aiPrompt" rows="14" style="font-family:ui-monospace,Consolas,monospace;font-size:.78rem">' + esc(ui.aiPrompt) + '</textarea>' +
        '<div class="flex" style="flex-wrap:wrap;margin-top:10px">' +
        '<button class="btn btn--primary btn--sm" data-action="ai-deepseek">' + icons.ext(15) + ' Abrir DeepSeek</button>' +
        '<button class="btn btn--soft btn--sm" data-action="ai-chatgpt">' + icons.ext(15) + ' Abrir ChatGPT</button>' +
        '<button class="btn btn--ghost btn--sm" data-action="ai-copy">' + icons.copy(15) + ' Copiar prompt</button>' +
        '</div>' +
        '<p class="muted" style="font-size:.8rem;margin-top:10px">DeepSeek se abre con el prompt precargado: solo tienes que pulsar enviar. Si no aparece, copia el texto y pégalo. El prompt puede ser largo; si supera el límite de la URL, se copia automáticamente. DeepSeek es gratis; si te pide cuenta, créala con un correo.</p>' +
        '</div></div>';
    }

    html += '<div class="block"><div class="block__head">' + icons.doc(18) + '<h2>3. Respuesta de la IA</h2></div><div class="block__body">' +
      '<textarea class="textarea" id="aiAnswer" rows="8" placeholder="Pega aquí la respuesta completa que te dio la IA...">' + esc(ui.aiAnswer) + '</textarea>' +
      '<div class="flex" style="margin-top:10px;flex-wrap:wrap">' +
      '<button class="btn btn--soft btn--sm" data-action="ai-paste">' + icons.copy(15) + ' Pegar respuesta</button>' +
      '<button class="btn btn--accent btn--sm" data-action="ai-save-answer">' + icons.check(15) + ' Guardar respuesta</button>' +
      (saved ? '<button class="btn btn--soft btn--sm" data-action="ai-pdf">' + icons.doc(15) + ' Descargar PDF</button>' : '') +
      (saved ? '<button class="btn btn--soft btn--sm" data-action="ai-followup">' + icons.route(15) + ' Repreguntar</button>' : '') +
      '</div>' +
      (ui.aiAnswer ? '<div class="ai-answer">' + esc(ui.aiAnswer) + '</div>' : '') +
      '</div></div>';

    var history = RL.ai.list();
    if (history.length) {
      html += '<div class="block"><div class="block__head">' + icons.clock(18) + '<h2>Consultas guardadas</h2><span class="badge badge--neutral">' + history.length + '</span></div><div class="block__body">' +
        history.slice(0, 8).map(function (c) {
          return '<div class="resource"><span class="resource__icon">' + icons.doc(15) + '</span><div class="grow">' +
            '<strong style="font-size:.9rem">' + esc(c.question.slice(0, 110)) + (c.question.length > 110 ? '…' : '') + '</strong>' +
            '<p style="font-size:.76rem;color:var(--muted)">' + esc(c.date) + '</p>' +
            '<div class="flex"><button class="btn btn--ghost btn--sm" data-action="ai-open" data-id="' + esc(c.id) + '">Ver</button>' +
            '<button class="btn btn--ghost btn--sm" data-action="ai-delete" data-id="' + esc(c.id) + '">Eliminar</button></div>' +
            '</div></div>';
        }).join('') + '</div></div>';
    }

    html += '<div class="callout callout--info" style="margin-top:18px">' + icons.shield(18) + '<div><strong>Privacidad</strong><p>El prompt se genera en tu dispositivo. Solo se envía a la IA cuando tú pulsas enviar en su web. Si no quieres compartir documentos o datos de salud, desmarca las casillas antes de generarlo. La respuesta se guarda solo si pulsas «Guardar respuesta».</p></div></div>';

    host.innerHTML = html;
  }

  function openAIConsult(question) {
    ui.aiQuestion = question || '';
    ui.aiPrompt = '';
    ui.aiAnswer = '';
    ui.aiFollowBase = null;
    ui.aiLastId = null;
    go('consulta');
    render();
  }

  function generateAIPrompt() {
    var q = $('#aiQuestion') ? $('#aiQuestion').value.trim() : '';
    if (!q) { toast('Escribe primero tu pregunta.'); return; }
    var opts = {
      includeDocs: $('#aiIncDocs') ? $('#aiIncDocs').checked : true,
      includeLocation: $('#aiIncLoc') ? $('#aiIncLoc').checked : true,
      includeNotes: $('#aiIncNotes') ? $('#aiIncNotes').checked : true
    };
    var p = RL.profile();
    var plan = p && p.nationality ? RL.buildPlan(p) : null;
    ui.aiQuestion = q;
    ui.aiOpts = opts;
    ui.aiPrompt = ui.aiFollowBase ? RL.ai.buildFollowUp(ui.aiFollowBase, q) : RL.ai.buildPrompt(plan, q, opts);
    ui.aiAnswer = '';
    ui.aiLastId = null;
    renderConsulta();
    toast('Prompt generado. Revísalo y ábrelo en DeepSeek.');
  }

  function saveAIAnswer() {
    var a = $('#aiAnswer') ? $('#aiAnswer').value.trim() : '';
    if (!a) { toast('Pega primero la respuesta de la IA.'); return; }
    var p = RL.profile();
    var plan = p && p.nationality ? RL.buildPlan(p) : null;
    var c = RL.ai.save({
      question: ui.aiQuestion,
      prompt: ui.aiPrompt,
      answer: a,
      context: RL.ai.context(plan, ui.aiOpts)
    });
    ui.aiLastId = c.id;
    ui.aiAnswer = a;
    ui.aiFollowBase = null;
    renderConsulta();
    toast('Respuesta guardada en este dispositivo.');
  }

  function openAIExternal(kind) {
    var prompt = $('#aiPrompt') ? $('#aiPrompt').value : ui.aiPrompt;
    if (!prompt) { toast('Genera primero el prompt.'); return; }
    var long = prompt.length > 6000;
    var w = kind === 'deepseek' ? RL.ai.openDeepSeek(prompt) : RL.ai.openChatGPT(prompt);
    if (!w) { toast('El navegador bloqueó la ventana. Permite las ventanas emergentes o copia el prompt.'); return; }
    toast(long ? 'Prompt copiado. Pégalo en la IA con Ctrl+V.' : 'IA abierta con el prompt. Pulsa enviar y trae la respuesta.');
  }

  function currentConsultation() {
    return ui.aiLastId ? RL.ai.get(ui.aiLastId) : RL.ai.last();
  }

  /* ══════════════════════════════════════════════════════════
     FORMULARIOS OFICIALES · CATÁLOGO COMPLETO
     ══════════════════════════════════════════════════════════ */
  function renderFormularios() {
    var host = $('#view-formularios');
    if (!RL.forms) {
      host.innerHTML = emptyState('Formularios no disponibles', 'No se ha cargado el catálogo de modelos.', 'Volver al inicio', 'inicio');
      return;
    }
    var q = ui.formsSearch.toLowerCase();
    var list = RL.forms.all.filter(function (f) {
      if (ui.formsFilter !== 'todos' && f.type !== ui.formsFilter) return false;
      if (!q) return true;
      return (f.code + ' ' + f.title + ' ' + f.purpose + ' ' + f.where).toLowerCase().indexOf(q) !== -1;
    });

    var html = '<div class="plan-head"><div><p class="eyebrow">Formularios</p><h1>Modelos oficiales, en un solo sitio</h1>' +
      '<p class="plan-head__sub">EX, tasas 790 y trámites de extranjería, nacionalidad y asilo. Busca por código (EX-03, EX-17, 790-012…), abre el modelo en la sede y prepara tu hoja de datos.</p></div>' +
      '<div class="plan-head__actions"><a class="btn btn--primary btn--sm" href="' + esc(RL.dom.safeUrl(RL.forms.hub)) + '" target="_blank" rel="noopener">' + icons.ext(15) + ' Abrir sede de modelos</a></div></div>';

    html += '<div class="callout callout--info">' + icons.info(18) + '<div><strong>El PDF oficial se descarga en la sede</strong><p>No rellenamos ni firmamos el impreso. Esta página te da el modelo correcto, la tasa, dónde se presenta y una hoja de datos para copiar. Los modelos EX se renumeraron en 2025-2026: no uses un EX antiguo.</p></div></div>';

    html += '<div class="dir-controls" style="grid-template-columns:minmax(220px,1fr)"><div class="search">' + icons.search(18) +
      '<input class="input" type="search" id="formsSearch" placeholder="Buscar: EX-03, EX-17, 790-012, arraigo, TIE…" value="' + esc(ui.formsSearch) + '" aria-label="Buscar formularios"></div></div>';

    var types = [
      ['todos', 'Todos'],
      ['form', 'Modelos EX'],
      ['tasa', 'Tasas 790'],
      ['online', 'Online'],
      ['info', 'Información']
    ];
    html += '<div class="flex" style="gap:6px;margin:0 0 18px;flex-wrap:wrap">' + types.map(function (t) {
      return '<button class="btn btn--sm ' + (ui.formsFilter === t[0] ? 'btn--primary' : 'btn--soft') + '" data-action="forms-filter" data-filter="' + t[0] + '">' + t[1] + '</button>';
    }).join('') + '</div>';

    if (!list.length) {
      html += '<div class="empty-state"><h2>Sin resultados</h2><p>Prueba con otro código o cambia el filtro.</p></div>';
    } else {
      html += '<div class="block"><div class="block__body"><div class="catalog-list">' +
        list.map(function (f) { return formRowHTML(f, f.routeIds[0] || ''); }).join('') +
        '</div></div></div>';
    }

    html += '<div class="callout callout--warn" style="margin-top:18px">' + icons.alert(18) + '<div><strong>Antes de presentar</strong><p>Comprueba que el código coincide con tu trámite, que la tasa es la correcta y que llevas original y copia. Si el modelo está cerrado o has visto un EX antiguo, no lo uses.</p></div></div>';

    host.innerHTML = html;

    var search = $('#formsSearch');
    if (search) {
      search.addEventListener('input', function () {
        ui.formsSearch = search.value;
        clearTimeout(search._t);
        search._t = setTimeout(function () {
          var pos = search.selectionStart;
          renderFormularios();
          var s2 = $('#formsSearch');
          if (s2) { s2.focus(); s2.setSelectionRange(pos, pos); }
        }, 220);
      });
    }
  }

  /* ══════════════════════════════════════════════════════════
     DOCUMENTOS
     ══════════════════════════════════════════════════════════ */
  function renderDocs() {
    var host = $('#view-docs');
    var p = RL.profile();
    if (!p.nationality) {
      host.innerHTML = emptyState('Todavía no hay documentos que mostrar',
        'El checklist se genera a partir de tu plan. Haz primero el diagnóstico y aquí verás exactamente qué papeles necesitas.',
        'Empezar mi diagnóstico', 'diagnostico');
      return;
    }
    var plan = RL.buildPlan(p);
    var items = plan.checklist;
    var done = items.filter(function (i) { return RL.state.checklist[i.key]; }).length;
    var pct = items.length ? Math.round(done / items.length * 100) : 0;

    var html = '<div class="plan-head"><div><p class="eyebrow">Checklist</p><h1>Tus documentos</h1>' +
      '<p class="plan-head__sub">Solo los documentos de las vías que te recomendamos. Marca lo que ya tienes; se guarda en este dispositivo.</p></div>' +
      '<div class="plan-head__actions"><button class="btn btn--soft btn--sm" data-nav="formularios">' + icons.doc(15) + ' Ver todos los formularios</button></div></div>';

    html += '<div class="block" style="margin-bottom:18px"><div class="block__body">' +
      '<div class="flex" style="justify-content:space-between"><strong>' + done + ' de ' + items.length + ' documentos</strong><span class="muted">' + pct + '%</span></div>' +
      '<div class="meter mt-2"><span style="width:' + pct + '%"></span></div></div></div>';

    html += '<div class="block"><div class="block__body"><ul class="docs-list">' + items.map(function (doc) {
      var checked = RL.state.checklist[doc.key] ? ' checked' : '';
      return '<li class="doc"><input type="checkbox" data-doc="' + esc(doc.key) + '"' + checked + '>' +
        '<span class="doc__body"><span class="doc__name">' + esc(doc.name) + '</span>' +
        (doc.where ? '<span class="doc__where">' + esc(doc.where) + '</span>' : '') +
        (doc.note ? '<span class="doc__where">' + esc(doc.note) + '</span>' : '') +
        '<span class="doc__where">Para: ' + esc(doc.routes.join(' · ')) + '</span></span></li>';
    }).join('') + '</ul></div></div>';

    var formList = RL.forms ? RL.forms.forRoutes(plan.recommended.map(function (r) { return r.route.id; })) : [];
    if (formList.length) html += formsListBlock(formList, plan);

    html += '<div class="callout callout--info mt-3">' + icons.info(18) + '<div><strong>Consigue originales y copias</strong>' +
      '<p>Lleva siempre el original y una copia. Los documentos extranjeros deben estar apostillados o legalizados y, si están en otro idioma, traducidos por un traductor jurado.</p></div></div>';

    html += '<div class="flex mt-3"><button class="btn btn--accent btn--sm" data-action="pdf">' + icons.doc(16) + ' Descargar PDF para tu abogado</button>' +
      '<button class="btn btn--soft btn--sm" data-action="print">' + icons.print(16) + ' Imprimir checklist</button>' +
      '<button class="btn btn--ghost btn--sm" data-nav="plan">Volver al plan</button></div>';

    host.innerHTML = html;
    bindChecklist(host);
  }

  /* ══════════════════════════════════════════════════════════
     FORMULARIOS OFICIALES Y HOJA DE DATOS
     ══════════════════════════════════════════════════════════ */
  function formsBlock(route) {
    if (!RL.forms) return '';
    var forms = RL.forms.forRoute(route.id);
    if (!forms.length) return '';
    return '<div class="block"><div class="block__head">' + icons.doc(18) + '<h2>Formularios oficiales</h2></div><div class="block__body">' +
      forms.map(function (f) { return formRowHTML(f, route.id); }).join('') +
      '<p class="muted" style="font-size:.8rem;margin-top:10px"><a href="' + esc(RL.forms.hub) + '" target="_blank" rel="noopener">Ver todos los modelos oficiales</a> · No rellenamos el PDF oficial: te damos los datos ordenados para que los copies, firmes y presentes. Descarga siempre el modelo vigente en la sede.</p>' +
      '</div></div>';
  }

  function formsListBlock(forms, plan) {
    var ids = plan && plan.recommended ? plan.recommended.map(function (r) { return r.route.id; }) : [];
    return '<div class="block" style="margin-top:18px"><div class="block__head">' + icons.doc(18) + '<h2>Formularios oficiales de tus vías</h2></div><div class="block__body">' +
      forms.map(function (f) {
        var rid = f.routeIds.filter(function (id) { return ids.indexOf(id) !== -1; })[0] || f.routeIds[0] || '';
        return formRowHTML(f, rid);
      }).join('') +
      '<p class="muted" style="font-size:.8rem;margin-top:10px"><a href="' + esc(RL.forms.hub) + '" target="_blank" rel="noopener">Ver todos los modelos oficiales</a> · Los modelos se renumeraron en 2025-2026. Si una web te ofrece un EX antiguo, compáralo con la sede antes de presentarlo.</p>' +
      '<button class="btn btn--soft btn--sm mt-2" data-nav="formularios">Ver catálogo completo</button>' +
      '</div></div>';
  }

  function formRowHTML(f, routeId) {
    return '<div class="resource"><span class="resource__icon">' + icons.ext(15) + '</span><div class="grow">' +
      '<a href="' + esc(RL.dom.safeUrl(f.url)) + '" target="_blank" rel="noopener"><strong>' + esc(f.code) + ' · ' + esc(f.title) + '</strong></a>' +
      (f.closed ? ' <span class="badge badge--warn">Cerrado</span>' : '') +
      '<p style="font-size:.86rem;color:var(--ink-2);margin:2px 0 0">' + esc(f.purpose) + '</p>' +
      '<p style="font-size:.76rem;color:var(--muted);margin:3px 0 0">' + esc(f.where) + ' · ' + esc(f.fee) + (f.note ? ' · ' + esc(f.note) : '') + '</p>' +
      (f.type === 'form' ? '<button class="btn btn--soft btn--sm mt-2" data-action="form-sheet" data-form="' + esc(f.id) + '" data-route="' + esc(routeId || '') + '">Preparar hoja de datos</button>' : '') +
      '</div></div>';
  }

  function fdField(id, label, value, type, full) {
    return '<div class="field' + (full ? ' field--full' : '') + '"><label class="field__label" for="fd-' + id + '">' + esc(label) + '</label>' +
      '<input class="input" type="' + (type || 'text') + '" id="fd-' + id + '" name="' + id + '" value="' + esc(value || '') + '"></div>';
  }

  function openFormSheet(formId, routeId) {
    var form = RL.forms && RL.forms.byId(formId);
    if (!form) { toast('Formulario no encontrado.'); return; }
    var route = RL.routeById(routeId) || { title: '', docs: [] };
    var p = RL.profile();
    var d = RL.derive(p);
    var stored = RL.state.formData || {};
    var data = Object.assign({
      nacionalidad: RL.countryName(p.nationality),
      fechaEntrada: p.entryDate || '',
      estadoCivil: p.maritalStatus ? (RL.family.status[p.maritalStatus] || p.maritalStatus) : '',
      matrimonio: p.marriageType ? (RL.family.marriage[p.marriageType] || p.marriageType) : '',
      vivienda: d.housing ? (RL.housing.labels[d.housing] || d.housing) : '',
      pruebaVivienda: d.housingProof ? (RL.housing.proof[d.housingProof] || d.housingProof) : '',
      estudios: d.degree ? (RL.education.degree[d.degree] || d.degree) : '',
      cursosSepe: d.sepeCourses ? String(d.sepeCourses) : '',
      detalleCursosSepe: d.sepeCoursesDetails || '',
      cursosSepeEnCurso: d.sepeCoursesInProgress ? String(d.sepeCoursesInProgress) : '',
      parejaDiscapacidad: p.partnerDisability || '',
      parejaDependencia: p.partnerDependency || '',
      hijosDiscapacidad: p.childrenDisability || '',
      convivientes: d.householdOthers ? String(d.householdOthers) : '',
      detalleConvivientes: p.householdDetails || '',
      hijos: d.hasKids ? RL.family.childrenText(d) : 'Sin hijos',
      edadesHijos: p.childrenAges || '',
      hijoEspanol: d.hasSpanishChildInHousehold ? (RL.family.spanishChild[d.spanishChildType] || '') : ''
    }, stored);

    closeFormModal();
    var wrap = document.createElement('div');
    wrap.id = 'formModal';
    wrap.className = 'modal';
    wrap.innerHTML =
      '<div class="modal__backdrop" data-action="close-form"></div>' +
      '<div class="modal__panel" role="dialog" aria-modal="true" aria-labelledby="formModalTitle">' +
      '<button class="modal__close" type="button" data-action="close-form" aria-label="Cerrar">×</button>' +
      '<p class="eyebrow">Formulario oficial · ' + esc(form.code) + '</p>' +
      '<h2 id="formModalTitle">' + esc(form.title) + '</h2>' +
      '<p class="muted" style="font-size:.87rem">Rellena estos datos y generaremos una hoja para copiarlos en el modelo oficial. Se guardan solo en tu dispositivo.</p>' +
      '<div class="callout callout--warn" style="margin:12px 0">' + icons.alert(18) + '<div><strong>No es el formulario oficial</strong><p>La hoja de datos no sustituye al impreso ni a tu firma. Descarga el ' + esc(form.code) + ' de la sede, copia los datos y fírmalo tú.</p></div></div>' +
      '<form id="formDataForm" class="form-grid" autocomplete="off">' +
      fdField('nombre', 'Nombre', data.nombre) +
      fdField('apellidos', 'Apellidos', data.apellidos) +
      fdField('fechaNacimiento', 'Fecha de nacimiento', data.fechaNacimiento, 'date') +
      fdField('fechaEntrada', 'Fecha de entrada en España', data.fechaEntrada, 'date') +
      '<div class="field"><label class="field__label" for="fd-sexo">Sexo</label><select class="select" id="fd-sexo" name="sexo">' +
      '<option value="">Selecciona…</option>' +
      ['Mujer', 'Hombre', 'Otro', 'Prefiero no decirlo'].map(function (x) {
        return '<option value="' + esc(x) + '"' + (data.sexo === x ? ' selected' : '') + '>' + esc(x) + '</option>';
      }).join('') + '</select></div>' +
      fdField('nacionalidad', 'Nacionalidad', data.nacionalidad) +
      fdField('estadoCivil', 'Situación de pareja', data.estadoCivil) +
      fdField('matrimonio', 'Tipo de matrimonio', data.matrimonio) +
      fdField('hijos', 'Hijos (comunes / solo tuyos / solo pareja / total)', data.hijos, 'text', true) +
      fdField('edadesHijos', 'Edades de los hijos', data.edadesHijos) +
      fdField('hijoEspanol', 'Hijo/a español y vínculo', data.hijoEspanol) +
      fdField('vivienda', 'Situación de vivienda', data.vivienda) +
      fdField('pruebaVivienda', 'Prueba de vivienda', data.pruebaVivienda) +
      fdField('estudios', 'Nivel de estudios', data.estudios) +
      fdField('cursosSepe', 'Cursos SEPE terminados', data.cursosSepe) +
      '<div class="field field--full"><label class="field__label" for="fd-detalleCursosSepe">Cursos SEPE: especialidad y duración</label>' +
      '<textarea class="textarea" id="fd-detalleCursosSepe" name="detalleCursosSepe" placeholder="Ej. Soldador TIG, 6 meses; Seguridad informática, 6 meses">' + esc(data.detalleCursosSepe || '') + '</textarea></div>' +
      fdField('cursosSepeEnCurso', 'Cursos SEPE en curso', data.cursosSepeEnCurso) +
      fdField('parejaDiscapacidad', 'Discapacidad de la pareja', data.parejaDiscapacidad) +
      fdField('parejaDependencia', 'Dependencia de la pareja', data.parejaDependencia) +
      fdField('hijosDiscapacidad', 'Discapacidad de los hijos', data.hijosDiscapacidad) +
      fdField('convivientes', 'Otras personas que conviven', data.convivientes) +
      '<div class="field field--full"><label class="field__label" for="fd-detalleConvivientes">Detalle de las personas que conviven</label>' +
      '<textarea class="textarea" id="fd-detalleConvivientes" name="detalleConvivientes" placeholder="Nombre, edad, relación, discapacidad/dependencia…">' + esc(data.detalleConvivientes || '') + '</textarea></div>' +
      fdField('nie', 'NIE', data.nie) +
      fdField('pasaporte', 'Pasaporte de tu país (no español)', data.pasaporte) +
      fdField('expediente', 'Número de expediente (si lo tienes)', data.expediente) +
      fdField('domicilio', 'Domicilio', data.domicilio, 'text', true) +
      fdField('cp', 'Código postal', data.cp) +
      fdField('municipio', 'Municipio', data.municipio) +
      fdField('provincia', 'Provincia', data.provincia) +
      fdField('telefono', 'Teléfono', data.telefono) +
      fdField('email', 'Email', data.email, 'email') +
      '<div class="field field--full"><label class="field__label" for="fd-observaciones">Observaciones</label>' +
      '<textarea class="textarea" id="fd-observaciones" name="observaciones" placeholder="Ej. presento junto a mi hijo, necesito intérprete…">' + esc(data.observaciones || '') + '</textarea></div>' +
      '</form>' +
      '<div class="flex mt-3" style="justify-content:flex-end">' +
      '<button class="btn btn--ghost" type="button" data-action="close-form">Cancelar</button>' +
      '<button class="btn btn--primary" type="button" data-action="generate-form" data-form="' + esc(form.id) + '" data-route="' + esc(route.id || '') + '">Generar hoja de datos (PDF)</button>' +
      '</div></div>';

    document.body.appendChild(wrap);
    document.body.style.overflow = 'hidden';
    var first = wrap.querySelector('input');
    if (first) first.focus();
  }

  function closeFormModal() {
    var m = document.getElementById('formModal');
    if (m && m.parentNode) m.parentNode.removeChild(m);
    document.body.style.overflow = '';
  }

  function generateForm(btn) {
    var form = RL.forms && RL.forms.byId(btn.getAttribute('data-form'));
    if (!form) return;
    var route = RL.routeById(btn.getAttribute('data-route')) || { title: '', docs: [] };
    var data = {};
    $$('#formDataForm [name]').forEach(function (el) { data[el.name] = String(el.value || '').trim(); });
    RL.state.formData = data;
    RL.store.save();
    try {
      RL.pdf.downloadFormSheet(form, data, route);
      toast('Hoja de datos generada. Descarga el ' + form.code + ' oficial y copia los datos.');
      closeFormModal();
    } catch (e) {
      toast('No se pudo generar la hoja de datos.');
    }
  }

  /* ══════════════════════════════════════════════════════════
     AYUDA
     ══════════════════════════════════════════════════════════ */
  function renderHelp() {
    var host = $('#view-ayuda');
    var R = RL.resources;
    var html = '<div class="plan-head"><div><p class="eyebrow">Ayuda</p><h1>Recursos, dudas y letra pequeña</h1>' +
      '<p class="plan-head__sub">Información oficial, entidades que ayudan gratis, glosario y los bulos que más circulan.</p></div></div>';

    if (RL.speech && RL.speech.supported) {
      html += '<div class="callout callout--info">' + icons.speaker(18) + '<div><strong>Lectura en voz alta</strong>' +
        '<p>Puedes escuchar esta página o tu plan con el botón del altavoz. Se usan las voces instaladas en tu navegador: el texto no se envía a ningún servidor.</p></div></div>';
    } else {
      html += '<div class="callout callout--warn" id="speechUnsupported">' + icons.info(18) + '<div><strong>Tu navegador no permite lectura en voz alta</strong>' +
        '<p>Prueba con Chrome, Edge o Safari actualizados. La app sigue funcionando igual; solo se desactiva el botón de escuchar.</p></div></div>';
    }

    html += '<div class="help-grid">';

    html += '<div class="block"><div class="block__head">' + icons.alert(18) + '<h2>Si es urgente</h2></div><div class="block__body">' +
      R.phones.map(function (p) {
        return '<div class="resource"><span class="resource__icon">' + icons.help(15) + '</span><div><strong>' + esc(p.n) + '</strong><p>' + esc(p.d) + '</p></div></div>';
      }).join('') + '</div></div>';

    html += '<div class="block"><div class="block__head">' + icons.ext(18) + '<h2>Enlaces oficiales y ayuda</h2></div><div class="block__body">' +
      R.links.map(function (l) {
        return '<div class="resource"><span class="resource__icon">' + icons.ext(15) + '</span><div>' +
          '<a href="' + esc(RL.dom.safeUrl(l.u)) + '" target="_blank" rel="noopener">' + esc(l.t) + '</a>' +
          '<p>' + esc(l.d) + '</p></div></div>';
      }).join('') + '</div></div>';

    html += '</div>';

    html += '<div class="block mt-3"><div class="block__head">' + icons.globe(18) + '<h2>Traducir el contenido largo</h2></div><div class="block__body">' +
      '<p>La interfaz tiene selector de idioma. Las guías y fichas legales largas siguen en español para no dar una traducción automática por buena. Puedes usar la traducción del navegador para entenderlas, pero:</p>' +
      '<div class="callout callout--info">' + icons.info(18) + '<div><strong>La web no puede activar la traducción del navegador</strong><p>No existe un botón web estándar que diga a Chrome, Edge, Firefox o Safari «traduce esta página». Es una función del navegador y la controla el usuario. En Chrome/Edge puedes activar <strong>«Traducir siempre el español a [tu idioma]»</strong>; el navegador recordará la preferencia para este sitio. Si cambias de pantalla, puede que tengas que volver a pulsar traducir.</p></div></div>' +
      '<ul style="padding-left:18px;font-size:.88rem;color:var(--ink-2)"><li>No la uses si el informe muestra tu nombre, NIE, familia o situación personal: el texto puede enviarse al proveedor del navegador.</li><li>Vuelve a traducir si cambias de pantalla; la app vuelve a pintar contenido en español.</li><li>Confirma fechas, tasas y nombres de trámites en la sede oficial: una traducción automática puede confundir términos legales.</li></ul>' +
      '<p class="muted" style="font-size:.8rem">En Chrome/Edge: clic derecho → Traducir. En Firefox/Safari: botón de traducción del navegador.</p></div></div>';

    html += '<div class="block mt-3"><div class="block__head">' + icons.ext(18) + '<h2>Canales de YouTube</h2></div><div class="block__body">' +
      '<div class="callout callout--warn">' + icons.alert(18) + '<div><strong>Recomendados por esta página, no asesoramiento oficial</strong>' +
      '<p>Si hablas español, estos canales pueden ayudarte a entender trámites y experiencias. Son independientes: no son abogados de esta app, no conocen tu caso y pueden estar desactualizados. Para una decisión legal, confirma con la sede oficial y con un abogado.</p></div></div>' +
      R.channels.map(function (c) {
        return '<div class="resource" style="align-items:flex-start"><span class="resource__icon">' + icons.ext(15) + '</span><div>' +
          '<strong>' + esc(c.name) + ' <span class="muted" style="font-weight:400">' + esc(c.handle) + '</span></strong>' +
          '<p style="font-size:.86rem;color:var(--ink-2);margin:2px 0 0">' + esc(c.desc) + '</p>' +
          '<p class="muted" style="font-size:.78rem;margin:3px 0 0">' + esc(c.note) + '</p>' +
          '<a class="btn btn--soft btn--sm mt-2" href="' + esc(RL.dom.safeUrl(c.url)) + '" target="_blank" rel="noopener">' + icons.ext(13) + ' Abrir canal</a></div></div>';
      }).join('') + '</div></div>';

    html += '<div class="block mt-3"><div class="block__head">' + icons.info(18) + '<h2>Glosario</h2></div><div class="block__body"><dl class="glossary">' +
      R.glossary.map(function (g) { return '<dt>' + esc(g.term) + '</dt><dd>' + esc(g.def) + '</dd>'; }).join('') + '</dl></div></div>';

    html += '<div class="block mt-3" id="faq"><div class="block__head">' + icons.help(18) + '<h2>Preguntas frecuentes</h2></div><div class="block__body">' +
      R.faq.map(function (f) {
        return '<details class="accordion"><summary>' + esc(f.q) + '</summary><div class="accordion__body"><p>' + esc(f.a) + '</p></div></details>';
      }).join('') + '</div></div>';

    html += '<div class="block mt-3"><div class="block__head">' + icons.shield(18) + '<h2>Bulos frecuentes</h2></div><div class="block__body">' +
      '<p class="muted" style="font-size:.88rem">Circulan mucho en redes y envíos de WhatsApp. Esto es lo que dice la norma.</p>' +
      R.myths.map(function (m) {
        return '<details class="accordion"><summary><span class="badge badge--bad" style="margin-right:6px">Bulo</span> ' + esc(m.myth) + '</summary>' +
          '<div class="accordion__body"><p><strong>Realidad:</strong> ' + esc(m.truth) + '</p><p class="muted" style="font-size:.8rem">Fuente: ' + esc(m.source) + '</p></div></details>';
      }).join('') + '</div></div>';

    html += '<div class="block mt-3"><div class="block__head">' + icons.doc(18) + '<h2>' + esc(R.legal.title) + '</h2></div><div class="block__body legal-text">' +
      '<p class="muted" style="font-size:.82rem">Última revisión: ' + esc(R.legal.updated) + '</p>' +
      R.legal.blocks.map(function (b) { return '<h3>' + esc(b.h) + '</h3><p>' + esc(b.p) + '</p>'; }).join('') +
      '<h3>Tus datos y este dispositivo</h3>' +
      '<p>Puedes exportar una copia de tu perfil y tu checklist, importarla en otro navegador o borrarlo todo. Nada sale de tu equipo.</p>' +
      '<div class="flex mt-2"><button class="btn btn--accent btn--sm" data-action="pdf">' + icons.doc(15) + ' Descargar mi plan en PDF</button>' +
      '<button class="btn btn--soft btn--sm" data-action="export">' + icons.save(15) + ' Exportar mis datos</button>' +
      '<button class="btn btn--ghost btn--sm" data-action="import">' + icons.doc(15) + ' Importar copia</button>' +
      '<button class="btn btn--ghost btn--sm" data-action="reset" style="color:var(--bad);border-color:var(--bad)">Borrar todo</button></div>' +
      '</div></div>';

    html += '<div class="block mt-3"><div class="block__head">' + icons.info(18) + '<h2>Fuentes y metodología</h2></div><div class="block__body legal-text">' +
      '<p>El contenido se ha elaborado a partir de normativa consolidada y fuentes oficiales, con revisión a <strong>' + fmt.date(RL.CONTENT_DATE, { year: true }) + '</strong>:</p>' +
      '<ul><li>Ley Orgánica 4/2000, de derechos y libertades de los extranjeros.</li>' +
      '<li>Real Decreto 1155/2024, Reglamento de Extranjería (en vigor desde el 20/05/2025).</li>' +
      '<li>Real Decreto 316/2026, de 14 de abril (regularización extraordinaria y arraigos).</li>' +
      '<li>Sentencia del Tribunal Supremo de 8/07/2026 (nulidad parcial del Reglamento).</li>' +
      '<li>Código Civil, arts. 17-26; Ley 20/2022 de Memoria Democrática; RD 1004/2015.</li>' +
      '<li>Ley 14/2013 de emprendedores y Ley 28/2022 (nómada digital).</li>' +
      '<li>RD 240/2007 (familiares de ciudadanos de la UE).</li>' +
      '<li>Orden PJC/617/2025 (tasas) e IPREM 2026.</li></ul>' +
      '<p class="muted" style="font-size:.84rem">Las cifras y plazos se indican como orientación. Los importes de tasas y los umbrales económicos se actualizan cada año.</p>' +
      '</div></div>';

    host.innerHTML = html;
  }

  /* ══════════════════════════════════════════════════════════
     ACCIONES
     ══════════════════════════════════════════════════════════ */
  function handleAction(action, btn) {
    if (action === 'print') { window.print(); return; }
    if (action === 'ai-ask') { openAIConsult(btn.getAttribute('data-question')); return; }
    if (action === 'ai-suggest') {
      ui.aiQuestion = btn.getAttribute('data-question') || '';
      renderConsulta();
      var q = $('#aiQuestion'); if (q) q.focus();
      return;
    }
    if (action === 'ai-generate') { generateAIPrompt(); return; }
    if (action === 'ai-copy') {
      var pr = $('#aiPrompt') ? $('#aiPrompt').value : ui.aiPrompt;
      RL.ai.copy(pr);
      toast('Prompt copiado. Pégalo en la IA.');
      return;
    }
    if (action === 'ai-deepseek') { openAIExternal('deepseek'); return; }
    if (action === 'ai-chatgpt') { openAIExternal('chatgpt'); return; }
    if (action === 'ai-paste') {
      if (navigator.clipboard && navigator.clipboard.readText) {
        navigator.clipboard.readText().then(function (t) {
          var el = $('#aiAnswer');
          if (el) { el.value = t; ui.aiAnswer = t; }
          toast('Respuesta pegada. Revísala y pulsa Guardar.');
        }).catch(function () {
          toast('No se pudo leer el portapapeles. Mantén pulsado y pega con Ctrl+V.');
        });
      } else {
        toast('Pega la respuesta con Ctrl+V en el cuadro de texto.');
      }
      return;
    }
    if (action === 'ai-save-answer') { saveAIAnswer(); return; }
    if (action === 'ai-pdf') {
      var pc = currentConsultation();
      if (!pc || !pc.answer) { toast('Guarda primero la respuesta.'); return; }
      RL.pdf.downloadAnswerPDF(pc);
      return;
    }
    if (action === 'ai-followup') {
      var fc = currentConsultation();
      if (!fc || !fc.answer) { toast('Guarda primero la respuesta.'); return; }
      ui.aiFollowBase = { question: fc.question, answer: fc.answer };
      ui.aiQuestion = '';
      ui.aiPrompt = '';
      ui.aiAnswer = '';
      ui.aiLastId = null;
      renderConsulta();
      var fq = $('#aiQuestion'); if (fq) fq.focus();
      return;
    }
    if (action === 'ai-open') {
      var oc = RL.ai.get(btn.getAttribute('data-id'));
      if (!oc) return;
      ui.aiQuestion = oc.question;
      ui.aiPrompt = oc.prompt;
      ui.aiAnswer = oc.answer;
      ui.aiLastId = oc.id;
      ui.aiFollowBase = null;
      renderConsulta();
      return;
    }
    if (action === 'ai-delete') {
      var id = btn.getAttribute('data-id');
      RL.ai.remove(id);
      if (ui.aiLastId === id) { ui.aiLastId = null; ui.aiAnswer = ''; }
      renderConsulta();
      return;
    }
    if (action === 'ai-clear') {
      ui.aiFollowBase = null;
      ui.aiQuestion = '';
      ui.aiPrompt = '';
      ui.aiAnswer = '';
      ui.aiLastId = null;
      renderConsulta();
      return;
    }
    if (action === 'add-partner-child') {
      var cp = RL.profile();
      var nextPartnerChild = (Number(cp.childrenPartner) || 0) + 1;
      var totalChildren = (Number(cp.childrenCommon) || 0) + (Number(cp.childrenOwn) || 0) + nextPartnerChild;
      var patch = { childrenPartner: nextPartnerChild };
      patch['child' + totalChildren + 'Relation'] = 'partner';
      RL.setProfile(patch);
      renderWizard();
      return;
    }
    if (action === 'remove-partner-child') {
      var rp = RL.profile();
      var partnerCount = Number(rp.childrenPartner) || 0;
      if (partnerCount > 0) {
        var last = (Number(rp.childrenCommon) || 0) + (Number(rp.childrenOwn) || 0) + partnerCount;
        ['Name', 'Age', 'Nationality', 'Relation', 'Disability', 'DisabilityRecognized',
          'DisabilityDegree', 'DisabilityExpiry', 'Lives', 'Education', 'LegalStatus',
          'TimeInSpain', 'Need'].forEach(function (suffix) { delete rp['child' + last + suffix]; });
        rp.childrenPartner = partnerCount - 1;
        RL.store.save();
        renderWizard();
      }
      return;
    }
    if (action === 'form-sheet') {
      openFormSheet(btn.getAttribute('data-form'), btn.getAttribute('data-route'));
      return;
    }
    if (action === 'close-form') { closeFormModal(); return; }
    if (action === 'generate-form') { generateForm(btn); return; }
    if (action === 'listen-view') {
      if (!RL.speech || !RL.speech.supported) { toast('Tu navegador no permite lectura en voz alta.'); return; }
      var titles = { inicio: 'Inicio', antes: 'Mi experiencia', formulario: 'Formulario', diagnostico: 'Diagnóstico', plan: 'Tu plan', vias: 'Vías', tramites: 'Trámites', online: 'Online', preguntas: 'Preguntas', derechos: 'Derechos y ayudas', directorio: 'Dónde ir', consulta: 'Consulta IA', docs: 'Documentos', formularios: 'Formularios', ayuda: 'Ayuda' };
      if (ui.view === 'plan' && RL.hasSavedProfile()) {
        RL.speech.speak(RL.speech.buildPlanScript(RL.buildPlan(RL.profile())), 'Tu plan');
      } else {
        RL.speech.speak(RL.speech.buildViewText($('#view-' + ui.view)), titles[ui.view] || 'Ruta Legal');
      }
      return;
    }
    if (action === 'listen-plan') {
      if (!RL.speech || !RL.speech.supported) { toast('Tu navegador no permite lectura en voz alta.'); return; }
      if (!RL.hasSavedProfile()) { toast('Primero completa el diagnóstico para escuchar tu plan.'); return; }
      RL.speech.speak(RL.speech.buildPlanScript(RL.buildPlan(RL.profile())), 'Tu plan');
      return;
    }
    if (action === 'pdf') {
      if (!RL.hasSavedProfile()) { toast('Primero completa el diagnóstico para generar tu PDF.'); return; }
      try {
        var plan = RL.buildPlan(RL.profile());
        RL.pdf.downloadCaseReport(plan, RL.profile());
        toast('Informe generado en tu dispositivo. Llévalo a tu abogado de extranjería.');
      } catch (e) {
        toast('No se pudo generar el PDF en este navegador. Prueba a imprimir y guardar como PDF.');
      }
      return;
    }
    if (action === 'export') { exportData(); return; }
    if (action === 'import') { importData(); return; }
    if (action === 'reset') { resetData(); return; }
    if (action === 'edit') { ui.step = RL.state.meta.lastStep || 0; go('diagnostico'); return; }
    if (action === 'demo') {
      if (RL.hasSavedProfile() && !window.confirm('Esto sustituirá tus respuestas guardadas por un perfil de ejemplo. ¿Quieres continuar?')) return;
      RL.state.profile = Object.assign({}, DEMO);
      RL.store.save();
      go('plan');
      toast('Este es un plan de ejemplo. Puedes editarlo con tus datos.');
      return;
    }
    if (action === 'filter') { ui.filter = btn.getAttribute('data-filter'); renderCatalog(); return; }
    if (action === 'dir-filter') { ui.dirFilter = btn.getAttribute('data-filter'); renderDirectorio(); return; }
    if (action === 'proc-filter') { ui.procFilter = btn.getAttribute('data-filter'); renderTramites(); return; }
    if (action === 'proc-mine') { ui.procMine = !ui.procMine; renderTramites(); return; }
    if (action === 'proc-highlight') {
      var target = document.getElementById('proc-' + btn.getAttribute('data-id'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (action === 'aid-filter') { ui.aidFilter = btn.getAttribute('data-filter'); renderDerechos(); return; }
    if (action === 'faq-filter') { ui.faqFilter = btn.getAttribute('data-filter'); renderPreguntas(); return; }
    if (action === 'online-filter') { ui.onlineFilter = btn.getAttribute('data-filter'); renderOnline(); return; }
    if (action === 'forms-filter') { ui.formsFilter = btn.getAttribute('data-filter'); renderFormularios(); return; }
    if (action === 'open-route') {
      var id = btn.getAttribute('data-id');
      ui.view = 'vias';
      $('#view-vias').hidden = false;
      VIEWS.forEach(function (v) { if (v !== 'vias') { var el = $('#view-' + v); if (el) el.hidden = true; } });
      renderRouteDetail(id);
      window.scrollTo(0, 0);
      return;
    }
    if (action === 'wizard-next') { wizardNext(); return; }
    if (action === 'wizard-prev') { wizardPrev(); return; }
  }

  function wizardPrev() {
    if (ui.step > 0) {
      ui.step--;
      ui.errors = {};
      RL.state.meta.lastStep = ui.step;
      RL.store.save();
      renderWizard();
      scrollToWizardTop();
    } else go('inicio');
  }

  function scrollToWizardTop() {
    var form = $('#wizardForm') || $('#view-diagnostico');
    if (!form) return;
    var run = function () {
      var bar = document.querySelector('.topbar');
      var offset = (bar && bar.offsetHeight ? bar.offsetHeight : 0) + 14;
      var rect = form.getBoundingClientRect ? form.getBoundingClientRect() : { top: 0 };
      var top = rect.top + (window.pageYOffset || 0) - offset;
      window.scrollTo(0, Math.max(0, top));
    };
    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(function () {
        window.requestAnimationFrame(run);
      });
    } else {
      setTimeout(run, 0);
    }
  }

  function exportData() {
    try {
      var blob = new Blob([RL.store.export()], { type: 'application/json' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'ruta-legal-' + dates.today() + '.json';
      document.body.appendChild(a);
      a.click();
      setTimeout(function () { URL.revokeObjectURL(url); a.remove(); }, 500);
      toast('Copia guardada. Contiene tus respuestas y tu checklist.');
    } catch (e) { toast('No se pudo exportar en este navegador.'); }
  }

  function importData() {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json,.json';
    input.addEventListener('change', function () {
      var file = input.files && input.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function () {
        try {
          RL.store.import(reader.result);
          toast('Copia importada.');
          render();
        } catch (e) { toast('El archivo no es una copia válida de Ruta Legal.'); }
      };
      reader.readAsText(file);
    });
    input.click();
  }

  function resetData() {
    if (!window.confirm('¿Borrar todas tus respuestas y tu checklist de este dispositivo? No se puede deshacer.')) return;
    RL.store.reset();
    ui.step = 0;
    toast('Datos borrados.');
    go('inicio');
  }

  function toast(msg) {
    var old = $('#toast');
    if (old) old.remove();
    var el = document.createElement('div');
    el.id = 'toast';
    el.setAttribute('role', 'status');
    el.textContent = msg;
    el.style.cssText = 'position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:100;' +
      'background:var(--ink);color:var(--bg);padding:11px 18px;border-radius:999px;font-size:.88rem;' +
      'font-weight:600;box-shadow:var(--shadow-lg);max-width:90vw;text-align:center';
    document.body.appendChild(el);
    setTimeout(function () { if (el.parentNode) el.remove(); }, 3800);
  }

  function warnNoStorage() {
    var el = document.createElement('div');
    el.className = 'callout callout--warn';
    el.style.cssText = 'max-width:1140px;margin:12px auto 0;padding:12px 16px';
    el.innerHTML = icons.alert(18) + '<div><strong>Este navegador no permite guardar datos.</strong><p>Puedes usar la app, pero al cerrar la página se perderán tus respuestas. Prueba a abrirla con <code>serve.py</code> o exporta una copia antes de salir.</p></div>';
    var top = $('.topbar');
    if (top && top.parentNode) top.parentNode.insertBefore(el, top.nextSibling);
  }

  /* enlaces del asistente */
  document.addEventListener('DOMContentLoaded', function () {
    var prev = $('#prevBtn'), saveExit = $('#saveExitBtn');
    if (prev) prev.addEventListener('click', function (e) { e.preventDefault(); wizardPrev(); });
    if (saveExit) saveExit.addEventListener('click', function () {
      RL.store.save();
      toast('Guardado en este dispositivo.');
      go('inicio');
    });
    var form = $('#wizardForm');
    if (form) form.addEventListener('submit', function (e) { e.preventDefault(); wizardNext(); });
  });

  /* exponer para depuración y tests */
  RL.ui = { go: go, render: render, state: ui, handleAction: handleAction, wizardNext: wizardNext, wizardPrev: wizardPrev };
})();

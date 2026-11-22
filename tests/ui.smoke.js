/* Smoke test de la interfaz con un DOM mínimo, sin navegador.
   Ejecutar: node tests/ui.smoke.js  */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const ROOT = path.resolve(__dirname, '..');
const FILES = [
  'assets/js/data/i18n.js',
  'assets/js/data/seo.js',
  'assets/js/data/antes.js',
  'assets/js/data/formulario.js',
  'assets/js/data/tooltips.js',
  'assets/js/core.js',
  'assets/js/data/countries.js',
  'assets/js/data/regions.js',
  'assets/js/data/questions.js',
  'assets/js/data/routes-nacionalidad.js',
  'assets/js/data/routes-espana.js',
  'assets/js/data/routes-exterior.js',
  'assets/js/data/resources.js',
  'assets/js/data/directory.js',
  'assets/js/data/procedures.js',
  'assets/js/data/aids.js',
  'assets/js/data/faq.js',
  'assets/js/data/online.js',
  'assets/js/engine.js',
  'assets/js/decision.js',
  'assets/js/forms.js',
  'assets/js/ai.js',
  'assets/js/pdf.js',
  'assets/js/speech.js',
  'assets/js/app.js'
];

function makeEl(id) {
  const el = {
    id,
    innerHTML: '',
    textContent: '',
    hidden: false,
    value: '',
    checked: false,
    style: {},
    _attrs: {},
    files: null,
    selectionStart: 0,
    classList: { add() {}, remove() {}, toggle() {} },
    addEventListener() {},
    removeEventListener() {},
    setAttribute(k, v) { this._attrs[k] = v; },
    getAttribute(k) { return this._attrs[k]; },
    removeAttribute(k) { delete this._attrs[k]; },
    focus() {},
    blur() {},
    click() {},
    remove() {},
    scrollIntoView() {},
    appendChild() {},
    insertBefore() {},
    setSelectionRange() {},
    querySelector(sel) { return makeEl(id + '::' + sel); },
    querySelectorAll() { return []; },
    closest() { return null; }
  };
  return el;
}

function boot() {
  const ids = new Map();
  const listeners = {};
  const storage = {};

  const location = { hash: '', search: '', href: 'http://localhost/' };
  const document = {
    documentElement: makeEl('html'),
    body: makeEl('body'),
    head: makeEl('head'),
    title: '',
    querySelector(sel) {
      if (sel && sel[0] === '#') {
        const id = sel.slice(1);
        if (!ids.has(id)) ids.set(id, makeEl(id));
        return ids.get(id);
      }
      return makeEl(sel);
    },
    querySelectorAll() { return []; },
    addEventListener(type, fn) { (listeners[type] = listeners[type] || []).push(fn); },
    createElement(tag) { return makeEl(tag); }
  };
  const window = {
    document,
    location,
    matchMedia: () => ({ matches: false }),
    addEventListener(type, fn) { (listeners['w:' + type] = listeners['w:' + type] || []).push(fn); },
    scrollTo() {},
    print() {},
    confirm() { return false; },
    localStorage: {
      getItem(k) { return Object.prototype.hasOwnProperty.call(storage, k) ? storage[k] : null; },
      setItem(k, v) { storage[k] = String(v); },
      removeItem(k) { delete storage[k]; }
    }
  };
  window.window = window;

  const sandbox = {
    window,
    document,
    location,
    localStorage: window.localStorage,
    navigator: { language: 'es-ES' },
    console,
    Intl,
    Date,
    JSON,
    Math,
    Object,
    Array,
    Number,
    String,
    Boolean,
    RegExp,
    Error,
    isNaN,
    parseInt,
    parseFloat,
    setTimeout,
    clearTimeout,
    URLSearchParams,
    encodeURIComponent,
    decodeURIComponent
  };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  for (const rel of FILES) {
    vm.runInContext(fs.readFileSync(path.join(ROOT, rel), 'utf8'), sandbox, { filename: rel });
  }
  // dispara DOMContentLoaded
  (listeners['DOMContentLoaded'] || []).forEach(fn => fn());
  return { sandbox, document, window, ids, listeners };
}

function nav(app, view) {
  app.sandbox.window.RL.ui.go(view);
  app.sandbox.window.RL.ui.render();
}

const app = boot();
const RL = app.sandbox.window.RL;
const t = (name, fn) => { try { fn(); console.log('✔ ' + name); } catch (e) { console.error('✖ ' + name + '\n  ' + e.message); process.exitCode = 1; } };

t('arranca en la vista de inicio', () => {
  assert.strictEqual(app.document.querySelector('#view-inicio').hidden, false);
  assert.strictEqual(app.document.querySelector('#view-plan').hidden, true);
});

t('el asistente pinta el primer paso con el selector de país', () => {
  nav(app, 'diagnostico');
  const html = app.document.querySelector('#wizardFields').innerHTML;
  assert.ok(html.includes('name="nationality"'), 'falta el país');
  assert.ok(html.includes('name="age"'), 'falta la edad');
  assert.ok(html.includes('name="location"'), 'falta la ubicación');
  assert.ok(html.includes('<optgroup label="América Latina">'), 'faltan los grupos de países');
  assert.strictEqual(app.document.querySelector('#view-diagnostico').hidden, false);
});

t('el catálogo lista las vías y sus fichas', () => {
  nav(app, 'vias');
  const html = app.document.querySelector('#view-vias').innerHTML;
  assert.ok(html.includes('Todas las vías'), 'falta el título');
  assert.ok(html.includes('Arraigo social'), 'falta arraigo social');
  assert.ok(html.includes('Ley de Nietos'), 'falta la Ley de Nietos');
  assert.ok(html.includes('nómada digital'), 'falta nómada digital');
  assert.ok(html.indexOf('<h2>Residencia') < html.indexOf('<h2>Visado'), 'residencia debe ir antes que visados');
  assert.ok(html.indexOf('<h2>Visado') < html.indexOf('<h2>Nacionalidad'), 'visados debe ir antes que nacionalidad');
});

t('la ayuda renderiza glosario, FAQ y bulos', () => {
  nav(app, 'ayuda');
  const html = app.document.querySelector('#view-ayuda').innerHTML;
  assert.ok(html.includes('Glosario'));
  assert.ok(html.includes('Preguntas frecuentes'));
  assert.ok(html.includes('Bulos frecuentes'));
  assert.ok(html.includes('Canales de YouTube'));
  assert.ok(html.includes('Expediente Extranjero'));
  assert.ok(html.includes('Prixline'));
  assert.ok(html.includes('no asesoramiento oficial'));
  assert.ok(html.includes('ilegal') || html.includes('irregular'));
  assert.ok(html.includes('Aviso legal y privacidad'));
});

t('sin perfil, el plan invita a hacer el diagnóstico', () => {
  nav(app, 'plan');
  const html = app.document.querySelector('#view-plan').innerHTML;
  assert.ok(html.includes('Aún no tenemos tu informe'));
});

t('con el perfil de ejemplo, el informe recoge hechos y documentos', () => {
  RL.state.profile = {
    nationality: 'CU', age: 34, location: 'spain', entryMode: 'tourist_visa',
    timeInSpain: '2to3y', entryDate: '2024-03-10', empadronado: 'yes',
    empadronamientoSince: '2024-04-01', empadronamientoGaps: 'no',
    permitStatus: 'none', hasNie: 'yes', leftSpain: 'no', exitOrder: 'no',
    asylumRequested: 'no', regularizationApplied: 'no',
    criminalSpain: 'no', criminalOrigin: 'no', healthInsurance: 'none',
    employment: 'informal', monthsWorked: 20, cotizaciones: 'no',
    monthlyIncome: 950, savings: 1200, jobOffer: 'no', sector: 'cuidados',
    degree: 'fp_medio', spanishLevel: 'nativo', exams: 'not_needed',
    maritalStatus: 'casada', spouseInSpain: 'yes', spouseStatus: 'irregular',
    childrenCount: 1, childrenAges: '7', childrenSpanish: 'no',
    ancestry: 'none', bornInSpain: 'no',
    docsBase: ['pasaporte', 'nie', 'certificado_digital'],
    docsTramites: [],
    goals: ['regularizar', 'trabajar'], horizon: 'urgent', canLeaveSpain: 'no'
  };
  nav(app, 'plan');
  const html = app.document.querySelector('#view-plan').innerHTML;
  assert.ok(html.includes('Informe para tu abogado'), 'falta cabecera');
  assert.ok(html.includes('Hechos del caso'), 'faltan hechos');
  assert.ok(html.includes('Lo que ya tienes'), 'faltan documentos');
  assert.ok(html.includes('Datos que faltan'), 'faltan datos por confirmar');
  assert.ok(html.includes('Descargar informe PDF'), 'falta el botón de PDF');
  assert.ok(html.includes('Lo que ya tienes'), 'falta el bloque de documentos propios');
});

t('el asistente adapta el número de pasos según dónde estés', () => {
  const saved = RL.state.profile;
  RL.state.profile = { nationality: 'CU', location: 'spain' };
  nav(app, 'diagnostico');
  assert.strictEqual(app.document.querySelector('#wizardStepLabel').textContent, 'Paso 1 de 9');
  RL.state.profile.location = 'origin';
  nav(app, 'diagnostico');
  assert.strictEqual(app.document.querySelector('#wizardStepLabel').textContent, 'Paso 1 de 7');
  RL.state.profile = saved;
});

t('la checklist de documentos se genera con el perfil', () => {
  nav(app, 'docs');
  const html = app.document.querySelector('#view-docs').innerHTML;
  assert.ok(html.includes('Tus documentos'));
  assert.ok(html.includes('Certificado de empadronamiento'));
  assert.ok(html.includes('Antecedentes penales') || html.includes('antecedentes penales'));
  assert.ok(html.includes('Formularios oficiales de tus vías'), 'faltan formularios oficiales');
  assert.ok(html.includes('EX-31'), 'falta el modelo de arraigo vigente');
  assert.ok(html.includes('Pasaporte de tu país (no español)'), 'el pasaporte debe aclarar que no es español');
});

t('el plan no contiene marcadores sin sustituir', () => {
  const html = app.document.querySelector('#view-plan').innerHTML;
  assert.ok(!html.includes('undefined'), 'aparece undefined');
  assert.ok(!html.includes('[object Object]'), 'aparece [object Object]');
  assert.ok(!html.includes('NaN'), 'aparece NaN');
});

t('la navegación por hash no rompe el estado', () => {
  app.window.location.hash = '#/vias';
  (app.listeners['w:hashchange'] || []).forEach(fn => fn());
  assert.strictEqual(app.document.querySelector('#view-vias').hidden, false);
  assert.strictEqual(app.document.querySelector('#view-plan').hidden, true);
});

t('el paso de documentos despliega la tarjeta roja y su caducidad', () => {
  const saved = RL.state.profile;
  RL.state.profile = {
    nationality: 'VE', location: 'spain', docsBase: ['pasaporte'],
    docsTramites: ['tarjeta_roja'], asylumStage: 'admitido', tarjetaRojaExpiry: '2026-12-20'
  };
  nav(app, 'diagnostico');
  const steps = RL.questions.visibleSteps(RL.state.profile);
  RL.ui.state.step = steps.findIndex(s => s.id === 'documentos');
  RL.ui.render();
  let html = app.document.querySelector('#wizardFields').innerHTML;
  assert.ok(html.includes('name="docsBase"'), 'faltan documentos base');
  RL.ui.state.step = steps.findIndex(s => s.id === 'asilo');
  RL.ui.render();
  html = app.document.querySelector('#wizardFields').innerHTML;
  assert.ok(html.includes('name="tarjetaRojaExpiry"'), 'falta la caducidad de la tarjeta');
  assert.ok(html.includes('name="tarjetaRojaRenewed"'), 'falta la renovación');
  assert.ok(html.includes('name="asylumStage"'), 'falta la fase de asilo');
  RL.state.profile = saved;
  RL.ui.state.step = 0;
});

t('el directorio adapta concello y salud a la provincia', () => {
  const saved = RL.state.profile;
  RL.state.profile = Object.assign({}, saved, {
    nationality: 'ES', location: 'spain', province: 'Pontevedra', municipality: 'Vigo'
  });
  nav(app, 'directorio');
  const html = app.document.querySelector('#view-directorio').innerHTML;
  assert.ok(html.includes('Dónde ir'));
  assert.ok(html.includes('Policía Nacional'));
  assert.ok(html.includes('Casa de la Moneda'));
  assert.ok(html.includes('Concello de Vigo'));
  assert.ok(html.includes('SERGAS'));
  assert.ok(html.includes('Centro de Salud'));
  RL.state.profile = saved;
  nav(app, 'inicio');
});

t('la consulta IA renderiza el generador de prompt', () => {
  nav(app, 'consulta');
  const html = app.document.querySelector('#view-consulta').innerHTML;
  assert.ok(html.includes('Pregunta a una IA'));
  assert.ok(html.includes('Generar prompt'));
  assert.ok(html.includes('DeepSeek'));
  assert.ok(html.includes('No es asesoramiento') || html.includes('no es asesoramiento'));
});

t('la consulta IA muestra el prompt y los botones de IA', () => {
  const prev = RL.ui.state.aiPrompt;
  RL.ui.state.aiPrompt = 'PROMPT DE PRUEBA';
  nav(app, 'consulta');
  const html = app.document.querySelector('#view-consulta').innerHTML;
  assert.ok(html.includes('PROMPT DE PRUEBA'));
  assert.ok(html.includes('Abrir DeepSeek'));
  assert.ok(html.includes('Abrir ChatGPT'));
  assert.ok(html.includes('Copiar prompt'));
  RL.ui.state.aiPrompt = prev;
});

t('el informe recoge la familia y los hechos sin emitir veredicto', () => {
  const saved = RL.state.profile;
  RL.state.profile = Object.assign({}, saved, {
    nationality: 'CO', location: 'spain', maritalStatus: 'casado',
    spouseSpanish: 'yes', spouseInSpain: 'yes', childrenCount: 0,
    goals: ['residencia_estable']
  });
  nav(app, 'plan');
  const html = app.document.querySelector('#view-plan').innerHTML;
  assert.ok(html.includes('Hechos del caso'));
  assert.ok(html.includes('Esto no es un diagnóstico legal'));
  assert.ok(!html.includes('Arraigo social'), 'no debe emitir una vía como veredicto');
  RL.state.profile = saved;
  nav(app, 'inicio');
});

t('la guía de trámites muestra cita, documentos y pasos', () => {
  const saved = RL.state.profile;
  RL.state.profile = Object.assign({}, saved, {
    nationality: 'CO', location: 'spain', province: 'Madrid', municipality: 'Madrid'
  });
  nav(app, 'tramites');
  const html = app.document.querySelector('#view-tramites').innerHTML;
  assert.ok(html.includes('Qué hacer, dónde y con qué cita'));
  assert.ok(html.includes('NIE, TIE'));
  assert.ok(html.includes('Pedir cita'));
  assert.ok(html.includes('Qué llevar'));
  assert.ok(html.includes('Paso a paso'));
  assert.ok(html.includes('Canjear el permiso de conducir extranjero'));
  assert.ok(html.includes('Sacar el permiso B'));
  assert.ok(html.includes('Permiso de moto'));
  assert.ok(html.includes('Permiso profesional'));
  assert.ok(html.includes('Jefatura Provincial de Tráfico de Madrid'));
  assert.ok(html.includes('Mercurio · extranjería online'));
  assert.ok(html.includes('Registro Civil · certificados online'));
  assert.ok(html.includes('Después de la nacionalidad: DNI y actualización'));
  assert.ok(html.includes('Residencia no lucrativa (sin trabajar)'));
  assert.ok(html.includes('Residencia de emprendedor'));
  RL.state.profile = saved;
  nav(app, 'inicio');
});

t('la vista de derechos muestra discapacidad, menores y ayudas', () => {
  const saved = RL.state.profile;
  RL.state.profile = Object.assign({}, saved, {
    nationality: 'CO', location: 'spain', province: 'Madrid', municipality: 'Madrid',
    hasDisability: 'yes', childrenCount: 1, childrenAges: '22',
    childrenDisability: 'yes', permitStatus: 'family', permitKind: 'reagrupacion'
  });
  nav(app, 'derechos');
  const html = app.document.querySelector('#view-derechos').innerHTML;
  assert.ok(html.includes('Derechos y ayudas'));
  assert.ok(html.includes('Discapacidad y residencia'));
  assert.ok(html.includes('Escolarización y matrícula'));
  assert.ok(html.includes('Libros, material y cheques escolares'));
  assert.ok(html.includes('Comedor escolar y becas'));
  assert.ok(html.includes('Certificado de discapacidad'));
  assert.ok(html.includes('No son lo mismo'));
  assert.ok(html.includes('Menores: derechos y residencia'));
  assert.ok(html.includes('Reconocer estudios'));
  assert.ok(html.includes('Si te para la policía'));
  assert.ok(html.includes('Antecedentes: 1 año no es lo mismo que 20'));
  RL.state.profile = saved;
  nav(app, 'inicio');
});

t('la sección de preguntas muestra patera, asilo y trabajo', () => {
  nav(app, 'preguntas');
  const html = app.document.querySelector('#view-preguntas').innerHTML;
  assert.ok(html.includes('Dudas reales'));
  assert.ok(html.includes('patera'));
  assert.ok(html.includes('asilo'));
  assert.ok(html.includes('30 horas') || html.includes('30 h'));
  assert.ok(html.includes('ayuntamiento'));
  assert.ok(html.includes('trabajadora social'));
  assert.ok(html.includes('nómina') || html.includes('50 horas'));
  assert.ok(html.includes('Concello') || html.includes('Oficina del Gobierno'));
  assert.ok(html.includes('transporte') || html.includes('discapacidad'));
  assert.ok(html.includes('CCSE') || html.includes('DELE'));
  assert.ok(html.includes('renta') || html.includes('IRPF'));
});

t('la sección online muestra DEHú, Mercurio y DGT', () => {
  const saved = RL.state.profile;
  RL.state.profile = Object.assign({}, saved, {
    nationality: 'CO', location: 'spain', province: 'Madrid', municipality: 'Madrid'
  });
  nav(app, 'online');
  const html = app.document.querySelector('#view-online').innerHTML;
  assert.ok(html.includes('Trámites online'));
  assert.ok(html.includes('DEHú'));
  assert.ok(html.includes('Mercurio'));
  assert.ok(html.includes('DGT'));
  assert.ok(html.includes('Modelos EX para descargar'));
  assert.ok(html.includes('sede.comunidad.madrid'));
  RL.state.profile = saved;
  nav(app, 'inicio');
});

t('la página de descargas muestra EX-03, EX-17 y 790-012', () => {
  nav(app, 'formularios');
  const html = app.document.querySelector('#view-formularios').innerHTML;
  assert.ok(html.includes('Descargas'));
  assert.ok(html.includes('EX-03'));
  assert.ok(html.includes('EX-17'));
  assert.ok(html.includes('790-012'));
  assert.ok(html.includes('Preparar hoja de datos'));
  nav(app, 'inicio');
});

t('el paso de familia carga pareja y una ficha por hijo', () => {
  const saved = RL.state.profile;
  RL.state.profile = {
    nationality: 'AR', age: 36, location: 'spain', maritalStatus: 'pareja_estable',
    childrenCommon: 1, childrenPartner: 2, childrenOwn: 0, childrenSpanish: 'no',
    docsBase: [], docsTramites: [], goals: ['regularizar']
  };
  nav(app, 'diagnostico');
  RL.ui.state.step = RL.questions.visibleSteps(RL.state.profile).findIndex(s => s.id === 'familia');
  RL.ui.render();
  const html = app.document.querySelector('#wizardFields').innerHTML;
  assert.ok(html.includes('Tu pareja'), 'falta la ficha de pareja');
  assert.ok(html.includes('Hijo/a 1') && html.includes('Hijo/a 2') && html.includes('Hijo/a 3'), 'faltan fichas de hijos');
  assert.ok(html.includes('name="child1Name"') && html.includes('name="child3Name"'), 'faltan campos por hijo');
  assert.ok(html.includes('Añadir hijo/a de mi pareja'), 'falta el botón para hijos de la pareja');
  assert.ok(html.includes('name="child1Education"'), 'falta el nivel de estudios del hijo');
  assert.ok(html.includes('FP de Grado Superior'), 'falta FP de Grado Superior');
  RL.state.profile = saved;
  nav(app, 'inicio');
});

t('se puede retroceder paso a paso hasta el inicio', () => {
  const saved = RL.state.profile;
  RL.state.profile = {
    nationality: 'AR', age: 36, location: 'spain', permitStatus: 'none',
    empadronado: 'yes', docsBase: [], docsTramites: [], goals: ['regularizar']
  };
  nav(app, 'diagnostico');
  RL.ui.state.step = 2;
  RL.ui.render();
  RL.ui.wizardPrev();
  assert.strictEqual(RL.ui.state.step, 1, 'debe bajar de 3 a 2');
  RL.ui.wizardPrev();
  assert.strictEqual(RL.ui.state.step, 0, 'debe llegar al inicio');
  RL.state.profile = saved;
  nav(app, 'inicio');
});

t('las preguntas de discapacidad de un hijo solo salen si tiene discapacidad', () => {
  const saved = RL.state.profile;
  RL.state.profile = {
    nationality: 'AR', age: 36, location: 'spain', maritalStatus: 'pareja_estable',
    childrenCommon: 1, child1Disability: 'yes', docsBase: [], docsTramites: [], goals: ['regularizar']
  };
  nav(app, 'diagnostico');
  RL.ui.state.step = RL.questions.visibleSteps(RL.state.profile).findIndex(s => s.id === 'familia');
  RL.ui.render();
  let html = app.document.querySelector('#wizardFields').innerHTML;
  assert.ok(html.includes('name="child1DisabilityDegree"'), 'faltan grado/vencimiento con discapacidad');
  assert.ok(html.includes('name="child1DisabilityExpiryStatus"'), 'falta la opción de sin vencimiento');
  assert.ok(html.includes('No caduca / sin vencimiento'), 'falta el texto de no caduca');
  RL.state.profile.child1Disability = 'no';
  RL.ui.render();
  html = app.document.querySelector('#wizardFields').innerHTML;
  assert.ok(!html.includes('name="child1DisabilityDegree"'), 'no debe preguntar grado si no tiene discapacidad');
  RL.state.profile = saved;
  nav(app, 'inicio');
});

t('el informe recoge la residencia sin calcular un veredicto', () => {
  const saved = RL.state.profile;
  RL.state.profile = {
    nationality: 'AR', age: 34, location: 'spain', entryMode: 'tourist_free',
    timeInSpain: '2to3y', empadronado: 'yes', criminalSpain: 'no', criminalOrigin: 'no',
    permitStatus: 'residencia_temporal', permitSince: RL.dates.addMonths(RL.dates.today(), -23),
    permitExpiry: RL.dates.addYears(RL.dates.today(), 2), exams: 'ccse',
    monthlyIncome: 900, goals: ['nacionalidad']
  };
  nav(app, 'plan');
  const html = app.document.querySelector('#view-plan').innerHTML;
  assert.ok(html.includes('Hechos del caso'));
  assert.ok(html.includes('Residencia desde'));
  assert.ok(!html.includes('Te faltan'), 'no debe emitir un veredicto de nacionalidad');
  RL.state.profile = saved;
  nav(app, 'inicio');
});

t('el empadronamiento aparece aunque no hayas elegido provincia', () => {
  const saved = RL.state.profile;
  RL.state.profile = { nationality: 'CO', location: 'spain', goals: ['regularizar'] };
  nav(app, 'tramites');
  const html = app.document.querySelector('#view-tramites').innerHTML;
  assert.ok(html.includes('Empadronamiento y certificado de padrón'), 'falta la ficha de padrón');
  assert.ok(html.includes('Lo primero: empadrónate'), 'falta el aviso destacado');
  RL.state.profile = saved;
  nav(app, 'inicio');
});

t('las entidades locales aparecen según la provincia', () => {
  const saved = RL.state.profile;
  RL.state.profile = { nationality: 'CO', location: 'spain', province: 'Pontevedra', municipality: 'Vigo', goals: ['regularizar'] };
  nav(app, 'derechos');
  const html = app.document.querySelector('#view-derechos').innerHTML;
  assert.ok(html.includes('Entidades de apoyo en tu zona'));
  assert.ok(html.includes('Diversidades Acolle'));
  RL.state.profile = saved;
  nav(app, 'inicio');
});

t('el directorio muestra Diversidades Acolle en Vigo', () => {
  const saved = RL.state.profile;
  RL.state.profile = { nationality: 'CO', location: 'spain', province: 'Pontevedra', municipality: 'Vigo', goals: ['regularizar'] };
  nav(app, 'directorio');
  const html = app.document.querySelector('#view-directorio').innerHTML;
  assert.ok(html.includes('Diversidades Acolle'), 'no aparece Diversidades Acolle');
  assert.ok(html.includes('COGAMI'), 'no aparece COGAMI');
  assert.ok(html.includes('Cáritas Diocesana de Tui-Vigo'), 'no aparece Cáritas Tui-Vigo');
  assert.ok(html.includes('APAMP'), 'no aparece APAMP');
  assert.ok(html.includes('Entidades de tu zona'), 'falta el bloque de entidades');
  assert.ok(html.includes('Redes con sede local o provincial'), 'faltan redes provinciales');
  RL.state.profile = saved;
  nav(app, 'inicio');
});

t('el directorio muestra redes también en León y Cádiz', () => {
  const saved = RL.state.profile;
  for (const province of ['León', 'Cádiz']) {
    RL.state.profile = { nationality: 'CO', location: 'spain', province, municipality: 'Capital', goals: ['regularizar'] };
    nav(app, 'directorio');
    const html = app.document.querySelector('#view-directorio').innerHTML;
    assert.ok(html.includes('Entidades de tu zona'), province + ': falta bloque entidades');
    assert.ok(html.includes('Cruz Roja'), province + ': falta Cruz Roja');
    if (province === 'León') assert.ok(html.includes('Cáritas Diocesana de León'), 'falta Cáritas León');
    if (province === 'Cádiz') assert.ok(html.includes('Fundación Márgenes y Vínculos'), 'falta Márgenes y Vínculos');
  }
  RL.state.profile = saved;
  nav(app, 'inicio');
});

t('la interfaz cambia de idioma y el árabe activa RTL', () => {
  RL.i18n.setLang('ar');
  assert.strictEqual(RL.i18n.t('nav.inicio'), 'الرئيسية');
  assert.strictEqual(app.document.documentElement.dir, 'rtl');
  RL.i18n.setLang('fr');
  assert.strictEqual(RL.i18n.t('nav.inicio'), 'Accueil');
  assert.strictEqual(app.document.documentElement.dir, 'ltr');
  RL.i18n.setLang('es');
  assert.strictEqual(RL.i18n.t('nav.inicio'), 'Inicio');
});

t('la sección Mi experiencia carga el testimonio corregido', () => {
  nav(app, 'antes');
  const html = app.document.querySelector('#view-antes').innerHTML;
  assert.ok(html.includes('Mi experiencia'));
  assert.ok(html.includes('Lo que sí puede mejorar'));
  assert.ok(html.includes('Trabajo y salario'));
  assert.ok(html.includes('prestación por desempleo no es automática'));
});

t('Online muestra la Xunta y el registro electrónico en Galicia', () => {
  const saved = RL.state.profile;
  RL.state.profile = { nationality: 'CO', location: 'spain', province: 'Pontevedra', municipality: 'Vigo', goals: ['regularizar'] };
  nav(app, 'online');
  const html = app.document.querySelector('#view-online').innerHTML;
  assert.ok(html.includes('Xunta de Galicia'));
  assert.ok(html.includes('Registro electrónico'));
  assert.ok(html.includes('Rexistro Xeral da Xunta'));
  RL.state.profile = saved;
  nav(app, 'inicio');
});

t('cada sección actualiza el título SEO', () => {
  RL.seo.apply('tramites');
  assert.ok(app.document.title.includes('Trámites de extranjería'));
  RL.seo.apply('antes');
  assert.ok(app.document.title.includes('Mi experiencia'));
});

t('se puede añadir un hijo de la pareja desde su ficha', () => {
  const saved = RL.state.profile;
  RL.state.profile = {
    nationality: 'AR', age: 36, location: 'spain', maritalStatus: 'pareja_estable',
    childrenCommon: 1, childrenPartner: 0, childrenOwn: 0, childrenSpanish: 'no',
    docsBase: [], docsTramites: [], goals: ['regularizar']
  };
  nav(app, 'diagnostico');
  RL.ui.state.step = RL.questions.visibleSteps(RL.state.profile).findIndex(s => s.id === 'familia');
  RL.ui.render();
  RL.ui.handleAction('add-partner-child');
  assert.strictEqual(Number(RL.state.profile.childrenPartner), 1);
  assert.strictEqual(RL.state.profile.child2Relation, 'partner');
  const html = app.document.querySelector('#wizardFields').innerHTML;
  assert.ok(html.includes('Hijo/a 2'));
  RL.ui.handleAction('remove-partner-child');
  assert.strictEqual(Number(RL.state.profile.childrenPartner), 0);
  RL.state.profile = saved;
  nav(app, 'inicio');
});

t('el formulario guiado arranca en el paso 0', () => {
  const saved = RL.state.profile;
  RL.state.profile = { nationality: 'CO', location: 'spain', goals: ['regularizar'] };
  nav(app, 'formulario');
  const html = app.document.querySelector('#view-formulario').innerHTML;
  assert.ok(html.includes('Sobre ti y tu familia'));
  assert.ok(html.includes('Un individuo'));
  assert.ok(html.includes('Grupo familiar'));
  RL.state.profile = saved;
  nav(app, 'inicio');
});

t('el grupo familiar genera filas de vínculo y edad al indicar cantidad', () => {
  const saved = RL.state.profile;
  RL.state.profile = { nationality: 'CO', location: 'spain', formulario: RL.formulario.blank() };
  RL.state.profile.formulario.mode = 'family';
  RL.state.profile.formulario.familyCount = 3;
  nav(app, 'formulario');
  const html = app.document.querySelector('#view-formulario').innerHTML;
  assert.ok(html.includes('Cantidad de integrantes'));
  assert.ok(html.includes('¿Dónde estás ahora?'));
  assert.ok(html.includes('¿Dónde está el resto de tu familia?'));
  assert.ok(html.includes('Familiar 1'));
  assert.ok(html.includes('Familiar 2'));
  assert.ok(html.includes('Relación'));
  assert.ok(html.includes('Edad'));
  assert.ok(html.includes('Hijo o hija de ambos'));
  assert.ok(html.includes('Hijo o hija de ella'));
  assert.ok(html.includes('Hijo o hija de él'));
  RL.state.profile = saved;
  nav(app, 'inicio');
});

t('datos generales no duplica grado/fecha y permite quitar hijos de pareja', () => {
  const saved = RL.state.profile;
  RL.state.profile = {
    nationality: 'AR', age: 36, location: 'spain', maritalStatus: 'pareja_estable',
    childrenCommon: 1, childrenPartner: 3, childrenOwn: 0,
    childrenDisability: 'yes', docsBase: [], docsTramites: [], goals: ['regularizar']
  };
  nav(app, 'diagnostico');
  RL.ui.state.step = RL.questions.visibleSteps(RL.state.profile).findIndex(s => s.id === 'general');
  RL.ui.render();
  let html = app.document.querySelector('#wizardFields').innerHTML;
  assert.ok(!html.includes('name="childrenDisabilityDegree"'), 'no debe pedir grado general');
  assert.ok(!html.includes('name="childrenDisabilityExpiry"'), 'no debe pedir fecha general');
  assert.ok(html.includes('Quitar el último'), 'falta botón para quitar hijos de pareja');
  RL.ui.handleAction('remove-partner-child');
  assert.strictEqual(Number(RL.state.profile.childrenPartner), 2);
  RL.state.profile = saved;
  nav(app, 'inicio');
});

t('vivienda pide un solo importe: hipoteca o alquiler', () => {
  const saved = RL.state.profile;
  RL.state.profile = { nationality: 'CO', location: 'spain', formulario: RL.formulario.blank() };
  RL.state.profile.formulario.applicant.mortgage = 'si';
  RL.state.profile.formulario.step = 4;
  nav(app, 'formulario');
  let html = app.document.querySelector('#view-formulario').innerHTML;
  assert.ok(html.includes('mortgageAmount'));
  assert.ok(!html.includes('housingCost'), 'no debe pedir alquiler si hay hipoteca');
  RL.state.profile.formulario.applicant.mortgage = 'no';
  RL.ui.render();
  html = app.document.querySelector('#view-formulario').innerHTML;
  assert.ok(html.includes('housingCost'));
  assert.ok(!html.includes('mortgageAmount'), 'no debe pedir hipoteca si no la hay');
  RL.state.profile = saved;
  nav(app, 'inicio');
});

t('nombre y edad se cargan desde la composición, sin repetirlos', () => {
  const saved = RL.state.profile;
  RL.state.profile = { nationality: 'CO', location: 'spain', formulario: RL.formulario.blank() };
  const f = RL.state.profile.formulario;
  f.mode = 'family';
  f.familyCount = 3;
  f.members = [
    { name: 'Ana Pérez', age: '40', relation: 'esposa', data: RL.formulario.person() },
    { name: 'Luis Pérez', age: '10', relation: 'hijo_comun', data: RL.formulario.person() }
  ];
  f.step = 5;
  nav(app, 'formulario');
  let html = app.document.querySelector('#view-formulario').innerHTML;
  assert.ok(html.includes('Ana Pérez'));
  assert.ok(!html.includes('name="spouse.name"'), 'no debe pedir nombre de pareja otra vez');
  assert.ok(!html.includes('name="spouse.age"'), 'no debe pedir edad de pareja otra vez');
  f.step = 6;
  RL.ui.render();
  html = app.document.querySelector('#view-formulario').innerHTML;
  assert.ok(html.includes('Luis Pérez'));
  assert.ok(!html.includes('name="children.0.name"'), 'no debe pedir nombre del hijo otra vez');
  assert.ok(!html.includes('name="children.0.age"'), 'no debe pedir edad del hijo otra vez');
  RL.state.profile = saved;
  nav(app, 'inicio');
});

t('no ofrece NIE o TIE a quien ya los tiene', () => {
  const saved = RL.state.profile;
  RL.state.profile = { nationality: 'CO', location: 'spain', formulario: RL.formulario.blank() };
  const f = RL.state.profile.formulario;
  f.mode = 'family';
  f.familyCount = 2;
  f.members = [{ name: 'Ana', age: '40', relation: 'esposa', data: RL.formulario.person() }];
  f.applicant.docs = ['nie', 'tie'];
  f.spouse.docs = ['nie', 'tie', 'pasaporte'];
  f.step = 9;
  nav(app, 'formulario');
  const html = app.document.querySelector('#view-formulario').innerHTML;
  assert.ok(!html.includes('value="nie"'), 'no debe ofrecer NIE ya obtenido');
  assert.ok(!html.includes('value="tie"'), 'no debe ofrecer TIE ya obtenida');
  assert.ok(html.includes('value="nacionalidad"'), 'debe seguir ofreciendo nacionalidad');
  RL.state.profile = saved;
  nav(app, 'inicio');
});

t('el resumen incluye estudios y discapacidad de los hijos', () => {
  const saved = RL.state.profile;
  RL.state.profile = { nationality: 'CO', location: 'spain', formulario: RL.formulario.blank() };
  const f = RL.state.profile.formulario;
  f.mode = 'family';
  f.familyCount = 2;
  f.members = [{ name: 'Luis', age: '10', relation: 'hijo_comun', data: RL.formulario.person() }];
  f.children = [RL.formulario.person()];
  f.children[0].name = 'Luis';
  f.children[0].age = '10';
  f.children[0].educationLevel = 'ESO';
  f.children[0].disability = 'si';
  f.children[0].disabilityDegree = '33_44';
  f.children[0].disabilityExpiryStatus = 'no';
  f.step = 10;
  nav(app, 'formulario');
  const html = app.document.querySelector('#view-formulario').innerHTML;
  assert.ok(html.includes('Hijo/a 1'));
  assert.ok(html.includes('ESO'));
  assert.ok(html.includes('33_44'));
  assert.ok(html.includes('No caduca / sin vencimiento'));
  RL.state.profile = saved;
  nav(app, 'inicio');
});

t('los hijos no reciben preguntas de vivienda y gastos', () => {
  const saved = RL.state.profile;
  RL.state.profile = { nationality: 'CO', location: 'spain', formulario: RL.formulario.blank() };
  const f = RL.state.profile.formulario;
  f.mode = 'family';
  f.familyCount = 2;
  f.members = [{ name: 'Luis', age: '10', relation: 'hijo_comun', data: RL.formulario.person() }];
  f.step = 6;
  nav(app, 'formulario');
  let html = app.document.querySelector('#view-formulario').innerHTML;
  assert.ok(!html.includes('data-fpath="children.0.housing"'), 'hijo no debe tener vivienda');
  assert.ok(!html.includes('data-fpath="children.0.mortgage"'), 'hijo no debe tener hipoteca');
  f.members[0].age = '20';
  RL.ui.render();
  html = app.document.querySelector('#view-formulario').innerHTML;
  assert.ok(!html.includes('data-fpath="children.0.housing"'), 'los gastos se cargan solo en el titular');
  RL.state.profile = saved;
  nav(app, 'inicio');
});

t('los importes vacíos cuentan como cero en el resumen', () => {
  const saved = RL.state.profile;
  RL.state.profile = { nationality: 'CO', location: 'spain', formulario: RL.formulario.blank() };
  RL.state.profile.formulario.step = 10;
  RL.state.profile.formulario.applicant.netSalary = '';
  RL.state.profile.formulario.applicant.housingCost = '';
  nav(app, 'formulario');
  const html = app.document.querySelector('#view-formulario').innerHTML;
  assert.ok(html.includes('0.00 €'));
  RL.state.profile = saved;
  nav(app, 'inicio');
});

t('permite marcar objetivos comunes para todo el grupo', () => {
  const saved = RL.state.profile;
  RL.state.profile = { nationality: 'CO', location: 'spain', formulario: RL.formulario.blank() };
  const f = RL.state.profile.formulario;
  f.mode = 'family';
  f.familyCount = 3;
  f.members = [
    { name: 'Ana', age: '40', relation: 'esposa', data: RL.formulario.person() },
    { name: 'Luis', age: '10', relation: 'hijo_comun', data: RL.formulario.person() }
  ];
  f.commonGoalsOn = true;
  f.commonGoals = ['nacionalidad'];
  f.step = 9;
  nav(app, 'formulario');
  const html = app.document.querySelector('#view-formulario').innerHTML;
  assert.ok(html.includes('Objetivos comunes para todo el grupo familiar'));
  assert.ok(html.includes('data-fgroup="commonGoals"'));
  assert.ok(html.includes('Permiso de conducir: individual'));
  assert.ok(html.includes('data-fgroup="applicant.goals"'), 'el permiso se decide individualmente');
  RL.state.profile = saved;
  nav(app, 'inicio');
});

t('un contrato temporal pide fecha de vencimiento', () => {
  const saved = RL.state.profile;
  RL.state.profile = { nationality: 'CO', location: 'spain', formulario: RL.formulario.blank() };
  RL.state.profile.formulario.applicant.works = 'si';
  RL.state.profile.formulario.applicant.contractType = 'temporal';
  RL.state.profile.formulario.step = 1;
  nav(app, 'formulario');
  let html = app.document.querySelector('#view-formulario').innerHTML;
  assert.ok(html.includes('Tipo de contrato'));
  assert.ok(html.includes('data-fpath="applicant.contractEnd"'));
  RL.state.profile.formulario.applicant.contractType = 'indefinido';
  RL.ui.render();
  html = app.document.querySelector('#view-formulario').innerHTML;
  assert.ok(!html.includes('data-fpath="applicant.contractEnd"'));
  RL.state.profile = saved;
  nav(app, 'inicio');
});

t('datos personales identifica al titular y pregunta por asilo', () => {
  const saved = RL.state.profile;
  RL.state.profile = { nationality: 'CO', location: 'spain', formulario: RL.formulario.blank() };
  RL.state.profile.formulario.step = 1;
  nav(app, 'formulario');
  let html = app.document.querySelector('#view-formulario').innerHTML;
  assert.ok(html.includes('Datos personales del titular o jefe de familia'));
  assert.ok(html.includes('¿Solicitaste asilo en España?'));
  RL.state.profile.formulario.step = 3;
  RL.ui.render();
  html = app.document.querySelector('#view-formulario').innerHTML;
  assert.ok(html.includes('No indicaste que hayas solicitado asilo'));
  assert.ok(!html.includes('¿Solicitaste asilo en España?'), 'no debe repetir la pregunta en el paso 3');
  RL.state.profile = saved;
  nav(app, 'inicio');
});

t('discapacidad identifica a cada integrante por su nombre', () => {
  const saved = RL.state.profile;
  RL.state.profile = { nationality: 'CO', location: 'spain', formulario: RL.formulario.blank() };
  const f = RL.state.profile.formulario;
  f.mode = 'family';
  f.familyCount = 2;
  f.applicant.name = 'Ana';
  f.applicant.disability = 'si';
  f.members = [{ name: 'Luis', age: '10', relation: 'hijo_comun', data: RL.formulario.person() }];
  f.children = [RL.formulario.person()];
  f.children[0].name = 'Luis';
  f.children[0].disability = 'si';
  f.step = 7;
  nav(app, 'formulario');
  const html = app.document.querySelector('#view-formulario').innerHTML;
  assert.ok(html.includes('Ana'));
  assert.ok(html.includes('Luis'));
  assert.ok(html.includes('Datos de discapacidad y dependencia de:'));
  RL.state.profile = saved;
  nav(app, 'inicio');
});

t('el gasto de vivienda se carga una sola vez en el titular', () => {
  const saved = RL.state.profile;
  RL.state.profile = { nationality: 'CO', location: 'spain', formulario: RL.formulario.blank() };
  const f = RL.state.profile.formulario;
  f.mode = 'family';
  f.familyCount = 2;
  f.members = [{ name: 'Ana', age: '40', relation: 'esposa', data: RL.formulario.person() }];
  f.applicant.mortgage = 'si';
  f.applicant.mortgageAmount = '550';
  f.applicant.expenses.luz = '100';
  f.step = 10;
  nav(app, 'formulario');
  const html = app.document.querySelector('#view-formulario').innerHTML;
  assert.ok(html.includes('650.00 €'), '550 + 100 = 650');
  assert.ok(html.includes('Hipoteca:</strong> 550.00 €'), 'debe mostrar la hipoteca del titular');
  assert.ok(!html.includes('Alquiler:</strong>'), 'no debe mostrar alquiler si es hipoteca');
  assert.ok(html.includes('Suministros:</strong> 100.00 €'), 'debe mostrar los suministros');
  RL.state.profile = saved;
  nav(app, 'inicio');
});


t('el titular que pidió asilo ve los detalles igual que la pareja', () => {
  const saved = RL.state.profile;
  RL.state.profile = { nationality: 'CO', location: 'spain', formulario: RL.formulario.blank() };
  RL.state.profile.formulario.applicant.asylumRequested = 'si';
  RL.state.profile.formulario.step = 3;
  nav(app, 'formulario');
  const html = app.document.querySelector('#view-formulario').innerHTML;
  assert.ok(html.includes('Asilo del titular'));
  assert.ok(html.includes('data-fpath="applicant.asylumYear"'));
  assert.ok(html.includes('data-fpath="applicant.asylumStatus"'));
  assert.ok(html.includes('data-fpath="applicant.asylumDate"'));
  assert.ok(html.includes('respondiste que sí'));
  RL.state.profile = saved;
  nav(app, 'inicio');
});

t('pregunta por el permiso de conducir y su país', () => {
  const saved = RL.state.profile;
  RL.state.profile = { nationality: 'CO', location: 'spain', formulario: RL.formulario.blank() };
  RL.state.profile.formulario.step = 1;
  nav(app, 'formulario');
  let html = app.document.querySelector('#view-formulario').innerHTML;
  assert.ok(html.includes('¿Tienes permiso de conducir?'));
  RL.state.profile.formulario.applicant.drivingLicense = 'si';
  RL.ui.render();
  html = app.document.querySelector('#view-formulario').innerHTML;
  assert.ok(html.includes('¿De qué país es el permiso?'));
  RL.state.profile = saved;
  nav(app, 'inicio');
});

t('pide mes y año de la primera resolución de residencia', () => {
  const saved = RL.state.profile;
  RL.state.profile = { nationality: 'CO', location: 'spain', formulario: RL.formulario.blank() };
  RL.state.profile.formulario.applicant.residence = 'trabajo_estudios';
  RL.state.profile.formulario.step = 1;
  nav(app, 'formulario');
  const html = app.document.querySelector('#view-formulario').innerHTML;
  assert.ok(html.includes('Fecha de tu primera resolución de residencia'));
  assert.ok(html.includes('data-fpath="applicant.legalSinceMonth"'));
  assert.ok(html.includes('data-fpath="applicant.legalSinceYear"'));
  assert.ok(html.includes('cuánto te falta para los 2, 5 o 10 años'));
  RL.state.profile = saved;
  nav(app, 'inicio');
});

t('el paso final genera un informe profesional con puntos clave', () => {
  const saved = RL.state.profile;
  RL.state.profile = { nationality: 'CO', location: 'spain', formulario: RL.formulario.blank() };
  const f = RL.state.profile.formulario;
  f.applicant.name = 'Ana Pérez';
  f.applicant.disability = 'si';
  f.applicant.disabilityDegree = '65_mas';
  f.applicant.goals = ['nacionalidad'];
  f.step = 11;
  nav(app, 'formulario');
  const html = app.document.querySelector('#view-formulario').innerHTML;
  assert.ok(html.includes('Informe para asesoría legal'));
  assert.ok(html.includes('Puntos clave'));
  assert.ok(html.includes('Discapacidad y dependencia'));
  assert.ok(html.includes('Página 1 de'));
  assert.ok(html.includes('Ana Pérez'));
  assert.ok(html.includes('65_mas'));
  assert.ok(html.includes('Nacionalidad española'));
  RL.state.profile = saved;
  nav(app, 'inicio');
});

t('cada integrante del informe ocupa una página', () => {
  const saved = RL.state.profile;
  RL.state.profile = { nationality: 'CO', location: 'spain', formulario: RL.formulario.blank() };
  const f = RL.state.profile.formulario;
  f.mode = 'family';
  f.familyCount = 3;
  f.applicant.name = 'Ana';
  f.spouse.name = 'Luis';
  f.members = [
    { name: 'Luis', age: '40', relation: 'esposo', data: RL.formulario.person() },
    { name: 'Pedro', age: '10', relation: 'hijo_comun', data: RL.formulario.person() }
  ];
  f.children = [RL.formulario.person()];
  f.children[0].name = 'Pedro';
  f.step = 11;
  nav(app, 'formulario');
  const html = app.document.querySelector('#view-formulario').innerHTML;
  const pages = (html.match(/class="report-page"/g) || []).length;
  assert.ok(pages >= 4, 'debe haber portada, titular, pareja e hijo');
  assert.ok(html.includes('Página 1 de'));
  assert.ok(html.includes('Página 4 de'));
  RL.state.profile = saved;
  nav(app, 'inicio');
});

t('suma comida semanal y suscripciones al gasto del hogar', () => {
  const saved = RL.state.profile;
  RL.state.profile = { nationality: 'CO', location: 'spain', formulario: RL.formulario.blank() };
  const f = RL.state.profile.formulario;
  f.mode = 'family';
  f.familyCount = 2;
  f.members = [{ name: 'Ana', age: '40', relation: 'esposa', data: RL.formulario.person() }];
  f.applicant.mortgage = 'si';
  f.applicant.mortgageAmount = '550';
  f.applicant.expenses.luz = '100';
  f.applicant.expenses.foodWeekly = '100';
  f.applicant.expenses.netflix = '10';
  f.applicant.expenses.amazon = '5';
  f.applicant.expenses.disney = '8';
  f.applicant.expenses.transport = '40';
  f.applicant.expenses.misc = '60';
  f.applicant.expenses.credits = '100';
  f.step = 10;
  nav(app, 'formulario');
  const html = app.document.querySelector('#view-formulario').innerHTML;
  assert.ok(html.includes('Comida mensual'));
  assert.ok(html.includes('Suscripciones (Netflix/Amazon/Disney)'));
  assert.ok(html.includes('Transporte'));
  assert.ok(html.includes('Gastos varios'));
  assert.ok(html.includes('Créditos y plazos'));
  assert.ok(html.includes('1306.00 €'), '550 + 100 + 433 + 23 + 200 = 1306');
  RL.state.profile = saved;
  nav(app, 'inicio');
});

t('el informe distingue alquiler de hipoteca', () => {
  const saved = RL.state.profile;
  RL.state.profile = { nationality: 'CO', location: 'spain', formulario: RL.formulario.blank() };
  const f = RL.state.profile.formulario;
  f.applicant.housing = 'alquiler';
  f.applicant.housingCost = '700';
  f.step = 10;
  nav(app, 'formulario');
  const html = app.document.querySelector('#view-formulario').innerHTML;
  assert.ok(html.includes('Alquiler:</strong> 700.00 €'));
  assert.ok(!html.includes('Hipoteca:</strong>'), 'no debe mostrar hipoteca si es alquiler');
  RL.state.profile = saved;
  nav(app, 'inicio');
});

t('mi plan usa los datos del formulario nuevo', () => {
  const saved = RL.state.profile;
  RL.state.profile = { nationality: 'CO', location: 'spain', formulario: RL.formulario.blank() };
  RL.state.profile.formulario.applicant.name = 'Ana Formulario';
  RL.state.profile.formulario.applicant.goals = ['nacionalidad'];
  nav(app, 'plan');
  const html = app.document.querySelector('#view-plan').innerHTML;
  assert.ok(html.includes('Informe basado en tu formulario'));
  assert.ok(html.includes('Ana Formulario'));
  assert.ok(html.includes('Objetivos'));
  RL.state.profile = saved;
  nav(app, 'inicio');
});

t('documentos muestra lo ya marcado sin volver a preguntar', () => {
  const saved = RL.state.profile;
  RL.state.profile = { nationality: 'CO', location: 'spain', formulario: RL.formulario.blank() };
  RL.state.profile.formulario.applicant.name = 'Ana';
  RL.state.profile.formulario.applicant.docs = ['pasaporte', 'nie'];
  nav(app, 'docs');
  const html = app.document.querySelector('#view-docs').innerHTML;
  assert.ok(html.includes('Esto es lo que ya marcaste'));
  assert.ok(html.includes('Pasaporte de tu país'));
  assert.ok(html.includes('Número de NIE'));
  assert.ok(!html.includes('data-doc='), 'no debe volver a pedir checkboxes');
  RL.state.profile = saved;
  nav(app, 'inicio');
});

t('documentos muestra una columna por integrante', () => {
  const saved = RL.state.profile;
  RL.state.profile = { nationality: 'CO', location: 'spain', formulario: RL.formulario.blank() };
  const f = RL.state.profile.formulario;
  f.mode = 'family';
  f.familyCount = 2;
  f.applicant.name = 'Ana';
  f.applicant.docs = ['pasaporte'];
  f.members = [{ name: 'Luis', age: '40', relation: 'esposo', data: RL.formulario.person() }];
  f.spouse.name = 'Luis';
  f.spouse.docs = ['nie'];
  nav(app, 'docs');
  const html = app.document.querySelector('#view-docs').innerHTML;
  assert.ok(html.includes('Quién tiene cada documento'));
  assert.ok(html.includes('Pasaporte de tu país'));
  assert.ok(html.includes('Número de NIE'));
  assert.ok(html.includes('Ana'));
  assert.ok(html.includes('Luis'));
  RL.state.profile = saved;
  nav(app, 'inicio');
});

t('al volver al formulario completado abre el documento final', () => {
  const saved = RL.state.profile;
  RL.state.profile = { nationality: 'CO', location: 'spain', formulario: RL.formulario.blank() };
  const f = RL.state.profile.formulario;
  f.applicant.name = 'Ana';
  f.completed = true;
  f.step = 10;
  nav(app, 'inicio');
  nav(app, 'formulario');
  const html = app.document.querySelector('#view-formulario').innerHTML;
  assert.ok(html.includes('Documento final'));
  assert.ok(html.includes('Informe para asesoría legal'));
  RL.state.profile = saved;
  nav(app, 'inicio');
});

t('los campos del formulario se traducen sin tocar el PDF', () => {
  const saved = RL.state.profile;
  RL.state.profile = { nationality: 'CO', location: 'spain', formulario: RL.formulario.blank() };
  RL.i18n.setLang('fr');
  nav(app, 'formulario');
  let html = app.document.querySelector('#view-formulario').innerHTML;
  assert.ok(html.includes('Nom et prénoms'));
  assert.ok(html.includes('Un individu'));
  assert.ok(html.includes('Groupe familial'));
  RL.state.profile.formulario.applicant.name = 'Ana';
  RL.state.profile.formulario.step = 11;
  RL.ui.render();
  html = app.document.querySelector('#view-formulario').innerHTML;
  assert.ok(html.includes('Informe para asesoría legal'), 'el PDF debe seguir en español');
  assert.ok(!html.includes('Rapport pour'), 'no debe traducir el informe');
  RL.i18n.setLang('es');
  RL.state.profile = saved;
  nav(app, 'inicio');
});

t('las ayudas contextuales aparecen y se traducen', () => {
  const saved = RL.state.profile;
  RL.state.profile = { nationality: 'CO', location: 'spain', formulario: RL.formulario.blank() };
  RL.i18n.setLang('fr');
  nav(app, 'formulario');
  const html = app.document.querySelector('#view-formulario').innerHTML;
  assert.ok(html.includes('field__tip'));
  assert.ok(html.includes('Écris ton nom complet'));
  RL.i18n.setLang('es');
  RL.state.profile = saved;
  nav(app, 'inicio');
});

console.log('\nSmoke test de interfaz terminado.');

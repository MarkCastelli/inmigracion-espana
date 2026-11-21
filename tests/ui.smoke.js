/* Smoke test de la interfaz con un DOM mínimo, sin navegador.
   Ejecutar: node tests/ui.smoke.js  */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const ROOT = path.resolve(__dirname, '..');
const FILES = [
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
});

t('la ayuda renderiza glosario, FAQ y bulos', () => {
  nav(app, 'ayuda');
  const html = app.document.querySelector('#view-ayuda').innerHTML;
  assert.ok(html.includes('Glosario'));
  assert.ok(html.includes('Preguntas frecuentes'));
  assert.ok(html.includes('Bulos frecuentes'));
  assert.ok(html.includes('ilegal') || html.includes('irregular'));
  assert.ok(html.includes('Aviso legal y privacidad'));
});

t('sin perfil, el plan invita a hacer el diagnóstico', () => {
  nav(app, 'plan');
  const html = app.document.querySelector('#view-plan').innerHTML;
  assert.ok(html.includes('Aún no tenemos tu diagnóstico'));
});

t('con el perfil de ejemplo, el plan renderiza vías y pasos', () => {
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
  assert.ok(html.includes('Tu plan personalizado'), 'falta cabecera');
  assert.ok(html.includes('Arraigo social'), 'falta la vía principal');
  assert.ok(html.includes('Empieza por aquí'), 'faltan próximos pasos');
  assert.ok(html.includes('Tus fechas clave'), 'faltan fechas');
  assert.ok(html.includes('Documentos'), 'faltan documentos');
  assert.ok(html.includes('Privado') || html.includes('Tu perfil'), 'falta tarjeta de perfil');
  assert.ok(html.includes('Descargar PDF para tu abogado'), 'falta el botón de PDF');
  assert.ok(html.includes('Lo que ya tienes'), 'falta el bloque de documentos propios');
  assert.ok(html.includes('Cómo hemos decidido'), 'falta el bloque de decisión');
  assert.ok(html.includes('Confianza'), 'falta la confianza del diagnóstico');
});

t('el asistente adapta el número de pasos según dónde estés', () => {
  const saved = RL.state.profile;
  RL.state.profile = { nationality: 'CU', location: 'spain' };
  nav(app, 'diagnostico');
  assert.strictEqual(app.document.querySelector('#wizardStepLabel').textContent, 'Paso 1 de 7');
  RL.state.profile.location = 'origin';
  nav(app, 'diagnostico');
  assert.strictEqual(app.document.querySelector('#wizardStepLabel').textContent, 'Paso 1 de 6');
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

t('el plan muestra expectativa realista y supuestos familiares', () => {
  const saved = RL.state.profile;
  RL.state.profile = Object.assign({}, saved, {
    nationality: 'CO', location: 'spain', maritalStatus: 'casado',
    spouseSpanish: 'yes', spouseInSpain: 'yes', childrenCount: 0,
    goals: ['residencia_estable']
  });
  nav(app, 'plan');
  const html = app.document.querySelector('#view-plan').innerHTML;
  assert.ok(html.includes('Expectativa realista'));
  assert.ok(html.includes('Supuestos familiares'));
  assert.ok(html.includes('Me caso con un español'));
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
  assert.ok(html.includes('sede.comunidad.madrid'));
  RL.state.profile = saved;
  nav(app, 'inicio');
});

t('la página de formularios muestra EX-03, EX-17 y 790-012', () => {
  nav(app, 'formularios');
  const html = app.document.querySelector('#view-formularios').innerHTML;
  assert.ok(html.includes('Formularios'));
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
  RL.ui.state.step = 1;
  RL.ui.render();
  const html = app.document.querySelector('#wizardFields').innerHTML;
  assert.ok(html.includes('Tu pareja'), 'falta la ficha de pareja');
  assert.ok(html.includes('Hijo/a 1') && html.includes('Hijo/a 2') && html.includes('Hijo/a 3'), 'faltan fichas de hijos');
  assert.ok(html.includes('name="child1Name"') && html.includes('name="child3Name"'), 'faltan campos por hijo');
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
  RL.state.profile.child1Disability = 'no';
  RL.ui.render();
  html = app.document.querySelector('#wizardFields').innerHTML;
  assert.ok(!html.includes('name="child1DisabilityDegree"'), 'no debe preguntar grado si no tiene discapacidad');
  RL.state.profile = saved;
  nav(app, 'inicio');
});

console.log('\nSmoke test de interfaz terminado.');

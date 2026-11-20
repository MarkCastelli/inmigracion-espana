/* Carga las fuentes de Ruta Legal en un contexto de Node (sin DOM). */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

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
  'assets/js/speech.js'
];

function loadRL() {
  const sandbox = {
    window: {},
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
    isNaN,
    parseInt,
    parseFloat,
    setTimeout,
    clearTimeout
  };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  for (const rel of FILES) {
    const code = fs.readFileSync(path.join(ROOT, rel), 'utf8');
    vm.runInContext(code, sandbox, { filename: rel });
  }
  if (!sandbox.window.RL) throw new Error('No se pudo cargar RL');
  return sandbox.window.RL;
}

module.exports = { loadRL, ROOT, FILES };

/* Prueba el lector de voz con una Web Speech API simulada. */
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');

function makeEl() {
  return {
    hidden: false, textContent: '', innerHTML: '', value: '',
    addEventListener() {}, appendChild() {},
    classList: { add() {}, remove() {} }
  };
}

function boot() {
  const els = {};
  const spoken = [];
  const synth = {
    getVoices() { return [{ name: 'Voz ES', lang: 'es-ES', voiceURI: 'es', localService: true }]; },
    speak(u) {
      spoken.push(u.text);
      setTimeout(() => { if (u.onend) u.onend(); }, 1);
    },
    cancel() {},
    pause() {},
    resume() {}
  };
  const window = {
    speechSynthesis: synth,
    SpeechSynthesisUtterance: function (text) { this.text = text; },
    localStorage: {
      _d: {},
      getItem(k) { return this._d[k] == null ? null : this._d[k]; },
      setItem(k, v) { this._d[k] = String(v); },
      removeItem(k) { delete this._d[k]; }
    },
    addEventListener() {}
  };
  const document = {
    getElementById(id) { if (!els[id]) els[id] = makeEl(); return els[id]; },
    createElement() { return makeEl(); },
    querySelectorAll() { return []; },
    body: { classList: { add() {}, remove() {} } }
  };
  const sandbox = {
    window, document, console, setTimeout, clearTimeout,
    Intl, Date, JSON, Math, Object, Array, String, Number, Boolean,
    RegExp, isNaN, parseFloat, parseInt
  };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  for (const rel of ['assets/js/core.js', 'assets/js/speech.js']) {
    vm.runInContext(fs.readFileSync(path.join(ROOT, rel), 'utf8'), sandbox, { filename: rel });
  }
  const RL = sandbox.window.RL;
  RL.speech.init();
  return { RL, spoken };
}

test('con una API simulada, lee y termina', async () => {
  const { RL, spoken } = boot();
  assert.strictEqual(RL.speech.supported, true);
  const ok = RL.speech.speak('Primera frase. Segunda frase. Tercera frase.', 'Prueba');
  assert.strictEqual(ok, true);
  await new Promise(resolve => setTimeout(resolve, 60));
  assert.strictEqual(spoken.length, 1);
  assert.ok(spoken[0].includes('Primera frase'));
  assert.ok(spoken[0].includes('Tercera frase'));
  assert.strictEqual(RL.speech.isSpeaking(), false);
});

test('trocea un texto largo en varias utterances encoladas', async () => {
  const { RL, spoken } = boot();
  const long = ('Frase de prueba con muchas palabras para superar el límite de doscientos veinte caracteres. ').repeat(4);
  RL.speech.speak(long, 'Largo');
  await new Promise(resolve => setTimeout(resolve, 120));
  assert.ok(spoken.length >= 2, 'esperaba varias utterances, hay ' + spoken.length);
  assert.strictEqual(RL.speech.isSpeaking(), false);
});

test('detener cancela y deja de hablar', () => {
  const { RL } = boot();
  RL.speech.speak('Una frase larga para probar la parada.', 'Prueba');
  RL.speech.stop();
  assert.strictEqual(RL.speech.isSpeaking(), false);
});

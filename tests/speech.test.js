/* Pruebas del lector de voz. Ejecutar: node tests/speech.test.js */
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const { loadRL } = require('./harness');

const RL = loadRL();

const demo = {
  nationality: 'CU', age: 34, location: 'spain', entryMode: 'tourist_visa',
  timeInSpain: '2to3y', empadronado: 'yes', permitStatus: 'none',
  criminalSpain: 'no', criminalOrigin: 'no', monthlyIncome: 900,
  goals: ['regularizar'], horizon: 'urgent', docsBase: ['pasaporte']
};

test('en Node no hay Web Speech API y el módulo lo detecta', () => {
  assert.strictEqual(RL.speech.supported, false);
  assert.strictEqual(RL.speech.speak('hola'), false);
});

test('limpia URLs, símbolos y abreviaturas para la voz', () => {
  const out = RL.speech.clean('Mira https://ejemplo.com, cuesta 600 € al mes (art. 126.h) y el 100 %.');
  assert.ok(!out.includes('https://'));
  assert.ok(out.includes('euros'));
  assert.ok(out.includes('por ciento'));
  assert.ok(out.includes('artículo'));
});

test('divide textos largos en fragmentos de 220 caracteres como máximo', () => {
  const long = ('Esta es una frase de prueba que se repite para comprobar el troceado. ').repeat(12);
  const parts = RL.speech.chunk(long);
  assert.ok(parts.length > 1, 'debería dividir');
  for (const p of parts) assert.ok(p.length <= 220, 'fragmento demasiado largo: ' + p.length);
  assert.ok(parts.join(' ').includes('troceado'));
});

test('el guion del plan incluye resumen, vía principal y aviso legal', () => {
  const plan = RL.buildPlan(demo);
  const script = RL.speech.buildPlanScript(plan);
  assert.ok(script.startsWith('Tu plan en Ruta Legal'));
  assert.ok(script.includes(plan.summary.slice(0, 25)));
  assert.ok(script.includes(plan.recommended[0].route.title));
  assert.ok(script.includes('abogado de extranjería'));
  assert.ok(!script.includes('undefined'));
  assert.ok(script.includes('no asesoramiento jurídico'));
});

test('el guion incluye documentos y fechas cuando existen', () => {
  const plan = RL.buildPlan(demo);
  const script = RL.speech.buildPlanScript(plan);
  assert.ok(script.includes('Documentos'));
  assert.ok(script.includes('Fechas clave') || plan.timeline.length === 0);
});

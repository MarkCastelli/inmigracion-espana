/* Pruebas del formulario guiado 0-11. */
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const { loadRL } = require('./harness');

const RL = loadRL();

test('el formulario tiene estado inicial y vivienda con hipoteca', () => {
  const f = RL.formulario.blank();
  assert.strictEqual(f.step, 0);
  assert.strictEqual(f.mode, '');
  assert.ok(f.applicant);
  assert.strictEqual(f.applicant.mortgage, '');
  assert.strictEqual(f.applicant.mortgageAmount, '');
  assert.strictEqual(f.familyCount, 1);
  assert.ok(Array.isArray(f.members));
  assert.ok(RL.formulario.docs.some(d => d.v === 'tie'));
  assert.ok(RL.formulario.docs.some(d => d.v === 'permiso_conducir'));
  assert.ok(RL.formulario.goals.some(g => g.v === 'permiso_conducir'));
  assert.ok(RL.formulario.aidTypes.length >= 8);
  assert.ok(RL.formulario.goals.some(g => g.v === 'nacionalidad'));
});

test('las opciones cubren residencia, asilo, ayudas y objetivos', () => {
  assert.ok(RL.formulario.residence.some(x => x.v === 'irregular'));
  assert.ok(RL.formulario.residence.some(x => x.v === 'cuenta_ajena'));
  assert.ok(RL.formulario.aidWho.some(x => x.v === 'ong'));
  assert.ok(RL.formulario.goals.some(x => x.v === 'larga_duracion'));
});

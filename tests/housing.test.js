/* Pruebas de la situación de vivienda. */
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const { loadRL } = require('./harness');

const RL = loadRL();

function base(extra) {
  return Object.assign({
    nationality: 'AR', age: 34, location: 'spain', entryMode: 'tourist_free',
    timeInSpain: '1to2y', permitStatus: 'none', empadronado: 'yes',
    criminalSpain: 'no', criminalOrigin: 'no', monthlyIncome: 900,
    childrenCount: 0, goals: ['regularizar']
  }, extra || {});
}

test('el cuestionario ofrece las situaciones reales de vivienda', () => {
  const field = RL.questions.steps
    .flatMap(s => s.fields || [])
    .find(f => f.id === 'housing');
  assert.ok(field, 'falta la pregunta de vivienda');
  const opts = (field.options || []).map(o => o.v);
  for (const v of ['alquiler_piso', 'alquiler_habitacion', 'familiar_amigo', 'propietario_hipoteca', 'propietario', 'pension_albergue']) {
    assert.ok(opts.includes(v), 'falta ' + v);
  }
  const proof = RL.questions.steps.flatMap(s => s.fields || []).find(f => f.id === 'housingProof');
  assert.ok(proof && proof.options.some(o => o.v === 'owner_auth'));
});

test('el motor distingue vivienda y prueba de domicilio', () => {
  const d = RL.derive(base({ housing: 'familiar_amigo', housingProof: 'owner_auth' }));
  assert.strictEqual(d.housing, 'familiar_amigo');
  assert.strictEqual(d.housingProof, 'owner_auth');
  assert.strictEqual(d.hasHousingProof, true);
  const d2 = RL.derive(base({ housing: 'familiar_amigo', housingProof: 'none' }));
  assert.strictEqual(d2.hasHousingProof, false);
});

test('si vive con un familiar sin prueba, el plan pide documento', () => {
  const plan = RL.buildPlan(base({ housing: 'familiar_amigo', housingProof: 'none' }));
  assert.ok(plan.actions.some(a => a.id === 'vivienda'), 'falta la acción de vivienda');
  const ok = RL.buildPlan(base({ housing: 'alquiler_piso', housingProof: 'contract' }));
  assert.ok(!ok.actions.some(a => a.id === 'vivienda'), 'no debe pedir prueba si ya la tiene');
});

/* Pruebas de la capa de decisión. */
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const { loadRL } = require('./harness');

const RL = loadRL();

function base(extra) {
  return Object.assign({
    nationality: 'CO', age: 32, location: 'spain', entryMode: 'tourist_free',
    timeInSpain: '2to3y', empadronado: 'yes', empadronamientoSince: '2024-01-01',
    permitStatus: 'none', hasNie: 'yes', leftSpain: 'no', exitOrder: 'no',
    asylumRequested: 'no', regularizationApplied: 'no',
    criminalSpain: 'no', criminalOrigin: 'no', healthInsurance: 'none',
    employment: 'informal', monthlyIncome: 900, savings: 1000,
    maritalStatus: 'soltero', childrenCount: 0, ancestry: 'none',
    bornInSpain: 'no', goals: ['regularizar'], horizon: '1y', canLeaveSpain: 'no'
  }, extra || {});
}

test('la confianza es alta con los datos clave completos y baja si faltan', () => {
  const high = RL.buildPlan(base());
  assert.ok(['alta', 'media'].includes(high.confidence.level), high.confidence.level);
  const low = RL.buildPlan({ nationality: 'CO', location: 'spain', goals: ['regularizar'] });
  assert.strictEqual(low.confidence.level, 'baja');
  assert.ok(low.confidence.missing.length > 0);
});

test('la prioridad no es la puntuación: familiar de español antes que arraigo', () => {
  const p = base({
    maritalStatus: 'casado', spouseSpanish: 'yes', spouseInSpain: 'yes',
    spouseStatus: 'spanish', goals: ['residencia_estable']
  });
  const plan = RL.buildPlan(p);
  assert.ok(plan.recommended.length > 0);
  assert.strictEqual(plan.recommended[0].route.id, 'familiar_espanol');
  assert.ok(plan.decision.primaryReason.length > 20);
});

test('con objetivo regularizar, el arraigo va antes que la nacionalidad', () => {
  const p = base({ timeInSpain: '1to2y', goals: ['regularizar'], monthlyIncome: 900 });
  const plan = RL.buildPlan(p);
  const ids = plan.recommended.map(r => r.route.id);
  const posArraigo = ids.indexOf('arraigo_social');
  const posNac = ids.indexOf('nac_residencia_2');
  assert.ok(posArraigo !== -1, 'falta arraigo');
  assert.ok(posNac === -1 || posArraigo < posNac, 'la nacionalidad no debe ir antes');
});

test('la seguridad marca la orden de salida como prioridad absoluta', () => {
  const plan = RL.buildPlan(base({ exitOrder: 'yes', nationality: 'MA' }));
  assert.ok(plan.safety.some(s => /orden de salida/i.test(s.title)));
  assert.strictEqual(plan.safety[0].level, 'bad');
});

test('no se recomiendan vías cerradas, informativas ni bloqueadas', () => {
  const plan = RL.buildPlan(base({
    nationality: 'CU', ancestry: 'grandparent', ancestorOrigin: 'originario',
    goals: ['nacionalidad'], exams: 'none'
  }));
  assert.ok(plan.recommended.every(r => r.route.availability === 'open'));
  assert.ok(plan.recommended.every(r => !r.route.informational));
  assert.ok(!plan.recommended.some(r => r.route.id === 'nac_ley_nietos'));
});

test('el rastro de decisión cuenta bloqueadas y cerradas', () => {
  const plan = RL.buildPlan(base());
  const tr = plan.decision.trace;
  assert.ok(tr.total >= 30);
  assert.ok(tr.blocked > 0);
  assert.ok(tr.closed >= 2, 'Ley de Nietos y regularización deberían estar cerradas');
  assert.ok(Array.isArray(tr.ordered));
});

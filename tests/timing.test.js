/* Pruebas de las ventanas de oportunidad. */
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const { loadRL } = require('./harness');

const RL = loadRL();

function base(extra) {
  return Object.assign({
    nationality: 'CO', age: 32, location: 'spain', entryMode: 'tourist_free',
    timeInSpain: '1to2y', permitStatus: 'none', empadronado: 'yes',
    criminalSpain: 'no', criminalOrigin: 'no', monthlyIncome: 900,
    childrenCount: 0, goals: ['regularizar']
  }, extra || {});
}

test('un visado que caduca pronto genera una ventana', () => {
  const plan = RL.buildPlan(base({ visaExpiry: RL.dates.addDays(RL.dates.today(), 30) }));
  assert.ok(plan.windows.some(w => /caduca en 30 días/i.test(w.title)));
});

test('un permiso caducado hace poco avisa de los 3 meses', () => {
  const plan = RL.buildPlan(base({
    permitStatus: 'work', permitExpiry: RL.dates.addDays(RL.dates.today(), -20)
  }));
  assert.ok(plan.windows.some(w => /3 meses/i.test(w.title)));
});

test('a quien le faltan 12 meses para el arraigo se le dice', () => {
  const plan = RL.buildPlan(base({ timeInSpain: '1to2y' }));
  assert.ok(plan.windows.some(w => /2 años de arraigo/i.test(w.title)));
});

test('estudios y turismo tienen ventanas distintas', () => {
  const estudios = RL.buildPlan(base({ entryMode: 'studies', permitStatus: 'studies' }));
  assert.ok(estudios.windows.some(w => /pasar a trabajo/i.test(w.title)));
  const turista = RL.buildPlan(base({ entryMode: 'tourist_visa' }));
  assert.ok(turista.windows.some(w => /no puedes trabajar/i.test(w.title)));
});

test('el tiempo como solicitante de asilo no cuenta para el arraigo', () => {
  const plan = RL.buildPlan(base({
    entryMode: 'asylum', timeInSpain: '2to3y', permitStatus: 'asylum',
    asylumStage: 'denegado', asylumDeniedDate: RL.dates.addDays(RL.dates.today(), -30)
  }));
  assert.ok(plan.d.arraigoMonths != null);
  assert.ok(plan.d.arraigoMonths < 2, 'no debe contar los años de asilo');
  assert.notStrictEqual(plan.reality.level, 'solid');
});

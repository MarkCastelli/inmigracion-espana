/* Pruebas de trámites terminados vs. en curso. */
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

test('el cuestionario separa terminados y en curso', () => {
  const fields = RL.questions.steps.flatMap(s => s.fields || []);
  const done = fields.find(f => f.id === 'docsTramites');
  const current = fields.find(f => f.id === 'docsEnCurso');
  assert.ok(done && /terminados/i.test(done.label));
  assert.ok(current && /en curso/i.test(current.label));
  assert.ok(!done.options.some(o => o.v === 'hoja_blanca'), 'hoja blanca no es un trámite terminado');
  assert.ok(current.options.some(o => o.v === 'hoja_blanca'));
  assert.ok(current.options.some(o => o.v === 'resguardo_nacionalidad'));
  for (const v of ['cita_huellas', 'tie_en_tramite', 'cita_retirar_tie', 'renovacion_tarjeta_roja', 'homologacion_titulo']) {
    assert.ok(current.options.some(o => o.v === v), 'falta ' + v);
  }
  assert.ok(done.options.some(o => o.v === 'tie_renovada'));
  assert.ok(done.options.some(o => o.v === 'titulo_homologado'));
});

test('un trámite en curso marca el expediente pendiente, no el documento resuelto', () => {
  const d = RL.derive(base({
    docsEnCurso: ['resguardo_extranjeria', 'resguardo_nacionalidad'],
    docsTramites: ['antecedentes']
  }));
  assert.strictEqual(d.pendingExtranjeria, true);
  assert.strictEqual(d.pendingNationality, true);
  assert.strictEqual(d.hasAntecedentesCert, true);
  assert.strictEqual(d.hasDisability, false);
});

test('hoja blanca y tarjeta roja en curso cuentan como asilo en trámite', () => {
  const white = RL.derive(base({ docsEnCurso: ['hoja_blanca'] }));
  assert.strictEqual(white.hasWhitePaper, true);
  assert.strictEqual(white.asylumInProcess, true);
  const red = RL.derive(base({ docsEnCurso: ['tarjeta_roja'] }));
  assert.strictEqual(red.hasRedCard, true);
  assert.strictEqual(red.asylumInProcess, true);
});

test('huellas, retirada de TIE, tarjeta roja y título tienen estado propio', () => {
  const d = RL.derive(base({
    docsEnCurso: ['cita_huellas', 'tie_en_tramite', 'cita_retirar_tie', 'renovacion_tarjeta_roja', 'homologacion_titulo']
  }));
  assert.strictEqual(d.tieHuellasCita, true);
  assert.strictEqual(d.tieInProcess, true);
  assert.strictEqual(d.tieCardPending, true);
  assert.strictEqual(d.redCardRenewalPending, true);
  assert.strictEqual(d.titleValidationPending, true);
  assert.strictEqual(d.hasRedCard, true);
});

test('el plan muestra el siguiente paso de cada trámite en curso', () => {
  const plan = RL.buildPlan(base({
    docsEnCurso: ['cita_huellas', 'cita_retirar_tie', 'renovacion_tarjeta_roja', 'homologacion_titulo']
  }));
  for (const id of ['tie-huellas', 'tie-retirar', 'roja-renovacion', 'titulo-validacion']) {
    assert.ok(plan.actions.some(a => a.id === id), 'falta acción ' + id);
  }
});

test('un certificado en curso no se cuenta como certificado ya emitido', () => {
  const d = RL.derive(base({ docsEnCurso: ['antecedentes', 'discapacidad'] }));
  assert.strictEqual(d.hasAntecedentesCert, false);
  assert.strictEqual(d.hasDisability, false);
});

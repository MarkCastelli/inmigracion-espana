/* Pruebas de los supuestos familiares y de la expectativa realista. */
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const { loadRL } = require('./harness');

const RL = loadRL();

function base(extra) {
  return Object.assign({
    nationality: 'CO', age: 32, location: 'spain', entryMode: 'tourist_free',
    timeInSpain: '1to2y', permitStatus: 'none', empadronado: 'yes',
    criminalSpain: 'no', criminalOrigin: 'no', monthlyIncome: 900, savings: 1000,
    childrenCount: 0, ancestry: 'none', goals: ['regularizar']
  }, extra || {});
}

function routeOf(plan, id) {
  return plan.results.filter(r => r.route.id === id)[0] || null;
}

test('casarse con un español no es automático: vía familiar + aviso', () => {
  const plan = RL.buildPlan(base({
    maritalStatus: 'casado', spouseSpanish: 'yes', spouseInSpain: 'yes',
    cohabitation: '12plus', goals: ['residencia_estable']
  }));
  assert.strictEqual(plan.d.marriedToSpanish, true);
  assert.ok(plan.recommended.some(r => r.route.id === 'familiar_espanol'));
  assert.ok(plan.reality.bullets.some(b => /Casarse/i.test(b)));
  assert.ok(plan.reality.bullets.some(b => /no es una garantía|no damos un porcentaje/i.test(b)));
});

test('matrimonio sin convivencia: la vía familiar no se recomienda', () => {
  const plan = RL.buildPlan(base({
    maritalStatus: 'casado', spouseSpanish: 'yes', spouseInSpain: 'yes',
    cohabitation: 'no', goals: ['residencia_estable']
  }));
  assert.ok(!plan.recommended.some(r => r.route.id === 'familiar_espanol'));
});

test('el cuestionario pregunta el desglose real de hijos y pareja', () => {
  const ids = [];
  RL.questions.steps.forEach(s => (s.fields || []).forEach(f => ids.push(f.id)));
  for (const id of ['maritalStatus', 'marriageType', 'childrenCommon', 'childrenOwn', 'childrenPartner', 'childrenSpanish', 'spanishChildType', 'familyMembers']) {
    assert.ok(ids.includes(id), 'falta ' + id);
  }
  assert.ok(!ids.includes('childrenCount'), 'no debe volver el campo ambiguo childrenCount');
  assert.ok(!ids.includes('childrenAges'), 'la edad global se sustituye por una ficha por hijo');
});

test('la composición familiar crea fichas para las personas que conviven', () => {
  const d = RL.derive(base({ householdSize: 4 }));
  assert.strictEqual(d.extraPeople.length, 3);
  assert.strictEqual(d.householdOthers, 3);
  const steps = RL.questions.visibleSteps(base({ householdSize: 4 })).map(s => s.id);
  assert.ok(steps.includes('familia'));
});

test('la discapacidad del titular no se confunde con la de pareja o hijos', () => {
  const d = RL.derive(base({
    hasDisability: 'no',
    partnerDisability: 'yes',
    partnerDependency: 'yes',
    childrenPartner: 1,
    childrenDisability: 'yes',
    householdOthers: 1,
    householdDetails: 'Madre de 70 años'
  }));
  assert.strictEqual(d.hasDisability, false);
  assert.strictEqual(d.partnerHasDisability, true);
  assert.strictEqual(d.partnerDependency, true);
  assert.strictEqual(d.hasDisabledChild, true);
  assert.strictEqual(d.householdOthers, 1);
});

test('las preguntas de discapacidad y convivencia están en la familia', () => {
  const yo = RL.questions.steps.find(s => s.id === 'yo');
  const recursos = RL.questions.steps.find(s => s.id === 'recursos');
  const familyIds = RL.questions.visibleFields(yo, base({ childrenPartner: 1, maritalStatus: 'pareja_estable', householdOthers: 1 })).map(f => f.id);
  for (const id of ['partnerDisability', 'partnerDependency', 'childrenDisability', 'householdOthers', 'householdDetails']) {
    assert.ok(familyIds.includes(id), 'falta ' + id);
  }
  const healthIds = RL.questions.visibleFields(recursos, base({})).map(f => f.id);
  assert.ok(healthIds.includes('hasDisability'));
  assert.ok(!healthIds.includes('childrenDisability'), 'la discapacidad de los hijos no debe estar en la salud del titular');
});

test('tres hijos: uno común y dos de la pareja no se mezclan', () => {
  const plan = RL.buildPlan(base({
    maritalStatus: 'pareja_estable', spouseSpanish: 'yes', cohabitation: 'no',
    childrenCommon: 1, childrenOwn: 0, childrenPartner: 2,
    childrenAges: '5, 8 y 10', childrenSpanish: 'no', goals: ['residencia_estable']
  }));
  assert.strictEqual(plan.d.childrenCount, 3);
  assert.strictEqual(plan.d.childrenCommon, 1);
  assert.strictEqual(plan.d.childrenOwn, 0);
  assert.strictEqual(plan.d.childrenPartner, 2);
  assert.strictEqual(plan.d.hasCommonChild, true);
  assert.strictEqual(plan.d.stablePartnerQualifies, true);
});

test('un hijo español solo de la pareja no abre la vía de progenitor', () => {
  const plan = RL.buildPlan(base({
    maritalStatus: 'pareja_estable', spouseSpanish: 'yes', cohabitation: 'no',
    childrenPartner: 1, childrenSpanish: 'yes', spanishChildType: 'partner',
    childrenAges: '8', goals: ['residencia_estable']
  }));
  assert.strictEqual(plan.d.hasSpanishChildInHousehold, true);
  assert.strictEqual(plan.d.hasSpanishChild, false);
  assert.strictEqual(plan.d.parentSpanishMinor, false);
});

test('un hijo español propio sí abre la vía de progenitor', () => {
  const plan = RL.buildPlan(base({
    childrenOwn: 1, childrenSpanish: 'yes', spanishChildType: 'own',
    childrenAges: '5', childRecognized: 'yes', childLivesWithYou: 'yes',
    goals: ['residencia_estable']
  }));
  assert.strictEqual(plan.d.hasSpanishChild, true);
  assert.strictEqual(plan.d.spanishChildIsOwn, true);
  assert.strictEqual(plan.d.parentSpanishMinor, true);
});

test('pareja estable: exige 12 meses o hijo en común', () => {
  const withTime = RL.buildPlan(base({
    maritalStatus: 'pareja_estable', spouseSpanish: 'yes', cohabitation: '12plus',
    goals: ['residencia_estable']
  }));
  assert.strictEqual(withTime.d.stablePartnerQualifies, true);
  assert.ok(withTime.recommended.some(r => r.route.id === 'familiar_espanol'));

  const without = RL.buildPlan(base({
    maritalStatus: 'pareja_estable', spouseSpanish: 'yes', cohabitation: 'no',
    goals: ['residencia_estable']
  }));
  assert.strictEqual(without.d.stablePartnerQualifies, false);
  assert.ok(!without.recommended.some(r => r.route.id === 'familiar_espanol'));
});

test('embarazo de un español: no da residencia por sí solo', () => {
  const plan = RL.buildPlan(base({ pregnant: 'yes', pregnantBySpanish: 'yes' }));
  assert.strictEqual(plan.d.pregnantBySpanish, true);
  assert.ok(!plan.recommended.some(r => r.route.id === 'familiar_espanol'));
  assert.ok(plan.reality.bullets.some(b => /embarazo/i.test(b)));
  const fam = routeOf(plan, 'familiar_espanol');
  assert.ok(fam && fam.route.fit({}, plan.d).includes('embarazo'));
});

test('hijo español reconocido y a cargo: vía de progenitor, sin automaticidad', () => {
  const plan = RL.buildPlan(base({
    childrenCount: 1, childrenAges: '5', childrenSpanish: 'yes',
    childRecognized: 'yes', childLivesWithYou: 'yes', goals: ['residencia_estable']
  }));
  assert.strictEqual(plan.d.parentSpanishMinor, true);
  assert.ok(plan.recommended.some(r => r.route.id === 'familiar_espanol'));
  assert.ok(plan.reality.bullets.some(b => /hijo\/a español no te legaliza/i.test(b)));
});

test('hijo español no reconocido: no cuenta como vía de familiar', () => {
  const plan = RL.buildPlan(base({
    childrenCount: 1, childrenAges: '5', childrenSpanish: 'yes',
    childRecognized: 'no', childLivesWithYou: 'yes'
  }));
  assert.strictEqual(plan.d.parentSpanishMinor, false);
  assert.ok(!plan.recommended.some(r => r.route.id === 'familiar_espanol'));
  assert.ok(plan.reality.bullets.some(b => /no ha reconocido/i.test(b)));
});

test('hijo que vive con el otro progenitor sin cumplir obligaciones: no encaja', () => {
  const plan = RL.buildPlan(base({
    childrenCount: 1, childrenAges: '5', childrenSpanish: 'yes',
    childRecognized: 'yes', childLivesWithYou: 'no', childSupport: 'no'
  }));
  assert.strictEqual(plan.d.parentSpanishMinor, false);
  assert.ok(!plan.recommended.some(r => r.route.id === 'familiar_espanol'));
});

test('sin vía: se dice claro, sin prometer un porcentaje', () => {
  const plan = RL.buildPlan(base({
    nationality: 'MA', age: 17, timeInSpain: 'lt3m', permitStatus: 'none', goals: ['regularizar']
  }));
  assert.strictEqual(plan.recommended.length, 0);
  assert.strictEqual(plan.reality.level, 'none');
  assert.ok(/no aparece una vía ordinaria/i.test(plan.reality.title));
  assert.ok(plan.reality.body.includes('No es lo mismo que «imposible»'));
});

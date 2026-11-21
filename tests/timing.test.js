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

test('la renovación administrativa y la TIE física tienen fechas distintas', () => {
  const expiry = RL.dates.addDays(RL.dates.today(), 45);
  const plan = RL.buildPlan(base({ permitStatus: 'work', permitExpiry: expiry }));
  const admin = plan.timeline.find(w => /Mercurio\/sede/i.test(w.title));
  const physical = plan.timeline.find(w => /huellas y TIE f[ií]sica/i.test(w.title));
  assert.ok(admin, 'falta la ventana administrativa');
  assert.ok(physical, 'falta la ventana de huellas/TIE');
  assert.ok(/NO habilita la TIE f[ií]sica/i.test(admin.detail));
  assert.ok(/nunca antes/i.test(physical.detail));
  assert.strictEqual(physical.date, expiry);
  const alert = plan.windows.find(a => /TIE caduca/i.test(a.title));
  assert.ok(alert && /nunca antes/i.test(alert.body));
});

test('una renuncia a la protección internacional no cuenta como asilo en trámite', () => {
  const renounced = RL.dates.addMonths(RL.dates.today(), -6).slice(0, 7);
  const [ry, rm] = renounced.split('-');
  const plan = RL.buildPlan(base({
    entryMode: 'asylum', permitStatus: 'asylum', asylumStage: 'renunciado',
    asylumRenouncedMonth: rm, asylumRenouncedYear: Number(ry), timeInSpain: '2to3y'
  }));
  assert.strictEqual(plan.d.asylumRenounced, true);
  assert.strictEqual(plan.d.asylumInProcess, false);
  assert.ok(plan.d.arraigoMonths != null && plan.d.arraigoMonths < 12);
  assert.ok(plan.alerts.some(a => /Renunciaste a la protección internacional/i.test(a.title)));
  const fields = RL.questions.steps.flatMap(s => s.fields || []);
  for (const id of ['asylumRenouncedDay', 'asylumRenouncedMonth', 'asylumRenouncedYear']) {
    const field = fields.find(f => f.id === id);
    assert.ok(field, 'falta ' + id);
    assert.ok(!field.required, id + ' no debe ser obligatorio');
  }
});

test('la renuncia se guarda aunque solo se recuerde el año', () => {
  const plan = RL.buildPlan(base({
    entryMode: 'asylum', permitStatus: 'asylum', asylumStage: 'renunciado',
    asylumRenouncedYear: 2024, entryDate: '2024-01-01'
  }));
  assert.strictEqual(plan.d.asylumRenouncedDateISO, '');
  assert.strictEqual(plan.d.asylumRenouncedDateText, '2024');
  assert.strictEqual(plan.d.arraigoMonths, null);
  assert.ok(!plan.timeline.some(t => /2 años computables para el arraigo/i.test(t.title)), 'sin mes no debe inventar la fecha de arraigo');
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

/* Pruebas de formación: Bachillerato y cursos del SEPE. */
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

test('el nivel de estudios incluye Bachillerato', () => {
  const field = RL.questions.steps.flatMap(s => s.fields || []).find(f => f.id === 'degree');
  assert.ok(field, 'falta degree');
  assert.ok(field.options.some(o => o.v === 'bachillerato'), 'falta Bachillerato');
});

test('el cuestionario pregunta cursos del SEPE terminados y en curso', () => {
  const fields = RL.questions.steps.flatMap(s => s.fields || []);
  for (const id of ['sepeCourses', 'sepeCoursesDetails', 'sepeCoursesInProgress']) {
    const f = fields.find(x => x.id === id);
    assert.ok(f, 'falta ' + id);
    assert.ok(!f.required, id + ' no debe ser obligatorio');
  }
  const recursos = RL.questions.steps.find(s => s.id === 'recursos');
  const visible = RL.questions.visibleFields(recursos, base({ sepeCourses: 2 })).map(f => f.id);
  assert.ok(visible.includes('sepeCoursesDetails'));
});

test('el motor guarda dos cursos SEPE y su especialidad', () => {
  const d = RL.derive(base({
    degree: 'bachillerato',
    sepeCourses: 2,
    sepeCoursesDetails: 'Soldador TIG, 6 meses; Seguridad informática, 6 meses',
    sepeCoursesInProgress: 1
  }));
  assert.strictEqual(d.degree, 'bachillerato');
  assert.strictEqual(d.sepeCourses, 2);
  assert.strictEqual(d.sepeCoursesInProgress, 1);
  assert.ok(/Soldador TIG/.test(d.sepeCoursesDetails));
  assert.strictEqual(d.hasSepeCourses, true);
});

test('cada hijo guarda su nivel de estudios', () => {
  const d = RL.derive(base({
    childrenCommon: 1,
    child1Age: 17,
    child1Education: 'fp_superior'
  }));
  assert.strictEqual(d.familyChildren[0].education, 'fp_superior');
  assert.strictEqual(RL.education.child.fp_superior, 'FP de Grado Superior (2 años)');
});

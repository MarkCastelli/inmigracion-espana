/* Pruebas de la consulta abierta a una IA. */
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const { loadRL } = require('./harness');

const RL = loadRL();

const profile = {
  nationality: 'CO', age: 32, location: 'spain', province: 'Madrid', municipality: 'Madrid',
  entryMode: 'tourist_free', timeInSpain: '2to3y', permitStatus: 'none', empadronado: 'yes',
  criminalSpain: 'no', criminalOrigin: 'no', monthlyIncome: 900, savings: 1200,
  goals: ['regularizar'], docsBase: ['pasaporte', 'nie'], docsTramites: [],
  notes: 'Trabajo cuidando a una persona mayor sin contrato.'
};

test('el prompt incluye perfil, diagnóstico, pregunta e instrucciones', () => {
  const plan = RL.buildPlan(profile);
  const prompt = RL.ai.buildPrompt(plan, '¿Puedo pedir arraigo sin contrato?');
  assert.ok(prompt.includes('PREGUNTA CONCRETA'));
  assert.ok(prompt.includes('¿Puedo pedir arraigo sin contrato?'));
  assert.ok(prompt.includes('Colombia'));
  assert.ok(prompt.includes('Arraigo social'));
  assert.ok(prompt.includes('No eres su abogado'));
  assert.ok(prompt.includes(RL.CONTENT_DATE));
  assert.ok(prompt.includes('No inventes artículos'));
  assert.ok(prompt.includes('cuándo consultar a un abogado'));
});

test('se pueden excluir documentos, ubicación y notas del prompt', () => {
  const plan = RL.buildPlan(profile);
  const prompt = RL.ai.buildPrompt(plan, '¿Qué hago?', {
    includeDocs: false, includeLocation: false, includeNotes: false
  });
  assert.ok(!prompt.includes('Documentos que ya tiene'));
  assert.ok(!prompt.includes('Notas del caso'));
  assert.ok(!prompt.includes('Madrid'));
});

test('la repregunta conserva la respuesta anterior', () => {
  const prompt = RL.ai.buildFollowUp({
    question: '¿Puedo pedir arraigo?',
    answer: 'Depende de los dos años y de los medios.'
  }, '¿Y si no tengo contrato?');
  assert.ok(prompt.includes('RESPUESTA ANTERIOR'));
  assert.ok(prompt.includes('Depende de los dos años'));
  assert.ok(prompt.includes('¿Y si no tengo contrato?'));
});

test('las consultas se guardan, se leen y se eliminan', () => {
  RL.state.consultations = [];
  const c = RL.ai.save({ question: 'P1', prompt: 'PR1', answer: 'A1', context: 'C1' });
  assert.ok(c.id);
  assert.strictEqual(RL.ai.list().length, 1);
  assert.strictEqual(RL.ai.get(c.id).answer, 'A1');
  assert.strictEqual(RL.ai.last().id, c.id);
  RL.ai.remove(c.id);
  assert.strictEqual(RL.ai.list().length, 0);
});


test('el prompt del formulario excluye datos sensibles por defecto', () => {
  const F = RL.formulario.blank();
  F.mode = 'family';
  F.applicant.name = 'Ana Secreta';
  F.applicant.age = '34';
  F.applicant.nationality = 'Cuba';
  F.applicant.residence = 'irregular';
  F.applicant.phone = '600000000';
  F.applicant.disability = 'si';
  F.applicant.disabilityDegree = '65_mas';
  const normal = RL.ai.buildFormPrompt(F, '¿Qué preguntas debo llevar al abogado?', { sensitive: false });
  assert.ok(normal.includes('DATOS DEL FORMULARIO'));
  assert.ok(normal.includes('34 años'));
  assert.ok(!normal.includes('Ana Secreta'));
  assert.ok(!normal.includes('600000000'));
  assert.ok(!normal.includes('65_mas'));
  const sensitive = RL.ai.buildFormPrompt(F, '¿Qué preguntas debo llevar al abogado?', { sensitive: true });
  assert.ok(sensitive.includes('Ana Secreta'));
  assert.ok(sensitive.includes('65_mas'));
});

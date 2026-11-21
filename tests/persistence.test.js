/* Pruebas de persistencia local y copia JSON. */
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const { loadRL } = require('./harness');

const RL = loadRL();

test('exporta e importa el perfil y el paso actual', () => {
  RL.setProfile({ nationality: 'AR', age: 36, location: 'spain', childrenCommon: 1 });
  RL.state.meta.lastStep = 2;
  const json = RL.store.export();
  const obj = JSON.parse(json);
  assert.strictEqual(obj.app, 'ruta-legal');
  assert.strictEqual(obj.state.profile.nationality, 'AR');
  assert.strictEqual(obj.state.meta.lastStep, 2);

  RL.store.reset();
  RL.store.import(json);
  assert.strictEqual(RL.profile().nationality, 'AR');
  assert.strictEqual(RL.state.meta.lastStep, 2);
});

test('modificar un dato no borra el resto del perfil', () => {
  RL.store.reset();
  RL.setProfile({ nationality: 'AR', age: 36, location: 'spain', childrenCommon: 1 });
  RL.setProfile({ age: 37 });
  assert.strictEqual(RL.profile().nationality, 'AR');
  assert.strictEqual(RL.profile().childrenCommon, 1);
  assert.strictEqual(RL.profile().age, 37);
});

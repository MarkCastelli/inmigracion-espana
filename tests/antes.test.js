/* Pruebas de la sección Antes de emigrar. */
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const { loadRL } = require('./harness');

const RL = loadRL();

test('la guía previa tiene introducción, ventajas y secciones', () => {
  assert.ok(RL.antes);
  assert.ok(RL.antes.intro.length > 100);
  assert.ok(RL.antes.good.length >= 5);
  assert.ok(RL.antes.sections.length >= 6);
  assert.ok(RL.antes.closing.length > 50);
  for (const s of RL.antes.sections) {
    assert.ok(s.title && s.items.length, 'sección incompleta');
  }
});

test('se corrige la afirmación legal sobre el paro', () => {
  const all = JSON.stringify(RL.antes);
  assert.ok(/no es automática/i.test(all));
  assert.ok(/SEPE/i.test(all));
  assert.ok(!/por cada 3 años trabajados tienes un año de paro/i.test(all));
});

test('no se presenta la opinión como verdad universal ni se generaliza por nacionalidad', () => {
  const all = JSON.stringify(RL.antes).toLowerCase();
  assert.ok(all.includes('opinión personal'));
  assert.ok(!all.includes('los españoles odian'));
  assert.ok(!all.includes('todos los españoles'));
});

test('no quedan faltas evidentes del texto original', () => {
  const all = JSON.stringify(RL.antes);
  for (const bad of ['Cafeterias', 'tocara', 'poco chicos', 'mucho españoles', 'medico de cabecera', 'aun alquilando']) {
    assert.ok(!all.includes(bad), 'queda falta: ' + bad);
  }
});

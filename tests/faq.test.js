/* Pruebas de la sección de preguntas. */
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const { loadRL } = require('./harness');

const RL = loadRL();

test('hay preguntas suficientes, únicas y con detalle', () => {
  assert.ok(RL.faq.items.length >= 15);
  const ids = RL.faq.items.map(f => f.id);
  assert.strictEqual(new Set(ids).size, ids.length);
  const cats = new Set(RL.faq.categories.map(c => c.id));
  for (const f of RL.faq.items) {
    assert.ok(f.q && f.short, f.id + ' incompleta');
    assert.ok(Array.isArray(f.detail) && f.detail.length >= 3, f.id + ' sin detalle');
    assert.ok(cats.has(f.cat), f.id + ' categoría inválida');
  }
});

test('cubre patera vs turista, asilo, arraigo, estudios y trabajo', () => {
  const ids = RL.faq.items.map(f => f.id);
  for (const id of ['patera_vs_turista', 'patera_papeles', 'asilo_arraigo', 'asilo_denegado', 'estudios_30h', 'estudios_mas30', 'trabajo_ilegal_policia', 'inspeccion_trabajo', 'denuncia_espanol', 'ayuda_ayuntamiento', 'trabajadora_social', 'ong_encontrar', 'muebles_gafas', 'ayuda_sin_papeles', 'fraude_horas', 'denuncia_fraude', 'servicios_sociales_acceso', 'trabajadora_social_niega', 'ong_por_lugar', 'concello_xunta_gobierno', 'ong_niega', 'discapacidad_dependencia_incapacidad', 'ayuda_23_discapacidad', 'transporte_descuentos', 'ccse_dele', 'nacionalidad_plazos_paises', 'declaracion_renta', 'tie_renovacion', 'tie_foto_recogida']) {
    assert.ok(ids.includes(id), 'falta ' + id);
  }
  const patera = RL.faq.items.find(f => f.id === 'patera_vs_turista');
  assert.ok(/90 días/i.test(patera.short));
  const asilo = RL.faq.items.find(f => f.id === 'asilo_arraigo');
  assert.ok(/No mientras/i.test(asilo.short));
  const mas30 = RL.faq.items.find(f => f.id === 'estudios_mas30');
  assert.ok(/extinguir/i.test(mas30.short));
});

test('las respuestas no prometen impunidad ni deportación automática', () => {
  const poli = RL.faq.items.find(f => f.id === 'policia_miedo');
  assert.ok(/no es un delito penal/i.test(poli.short));
  assert.ok(/no es automática/i.test(poli.short));
  const den = RL.faq.items.find(f => f.id === 'denuncia_espanol');
  assert.ok(/No automáticamente/i.test(den.short));
});

test('los antecedentes distinguen 1 año y 20 años', () => {
  const f = RL.faq.items.find(x => x.id === 'antecedentes_1_20');
  assert.ok(/1 año/i.test(f.q));
  assert.ok(/20/i.test(f.q));
  assert.ok(/5 años/i.test(f.detail.join(' ')));
});

test('la FAQ de TIE aclara foto y recogida', () => {
  const f = RL.faq.items.find(x => x.id === 'tie_foto_recogida');
  assert.ok(/No te hacen la foto/i.test(f.short));
  assert.ok(/30-45/i.test(f.short));
});

test('las preguntas se pueden ordenar alfabéticamente', () => {
  const sorted = RL.faq.sort(RL.faq.items);
  const keys = sorted.map(x => x.q.replace(/^[¿¡\s]+/, '').toLocaleLowerCase('es'));
  const copy = keys.slice().sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }));
  assert.deepStrictEqual(keys, copy);
});

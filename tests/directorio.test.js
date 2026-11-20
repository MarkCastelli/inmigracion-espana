/* Pruebas del directorio geográfico. */
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const { loadRL } = require('./harness');

const RL = loadRL();

test('hay 19 comunidades y 52 provincias, todas con región', () => {
  assert.strictEqual(RL.regions.length, 19);
  assert.strictEqual(RL.provinces.length, 52);
  assert.strictEqual(new Set(RL.provinces).size, 52);
  for (const p of RL.provinces) {
    assert.ok(RL.regionByProvince(p), 'sin región: ' + p);
  }
});

test('Galicia usa Concello y Madrid Ayuntamiento', () => {
  const gal = RL.regionByProvince('Pontevedra');
  assert.strictEqual(gal.id, 'galicia');
  assert.strictEqual(gal.localLabel, 'Concello');
  assert.strictEqual(RL.regionByProvince('Madrid').localLabel, 'Ayuntamiento');
  assert.strictEqual(RL.regionByProvince('Bizkaia').localLabel, 'Udala');
});

test('el directorio incluye los sitios clave y categorías válidas', () => {
  const ids = RL.directory.entries.map(e => e.id);
  assert.strictEqual(new Set(ids).size, ids.length);
  for (const id of ['policia', 'extranjeria', 'delegacion_gobierno', 'fnmt', 'seguridad_social', 'sepe', 'registro_civil', 'centro_salud', 'concello', 'embajada']) {
    assert.ok(ids.includes(id), 'falta ' + id);
  }
  const cats = new Set(RL.directory.categories.map(c => c.id));
  for (const e of RL.directory.entries) {
    assert.ok(cats.has(e.cat), e.id + ' categoría inválida');
    assert.ok(Array.isArray(e.what) && e.what.length, e.id + ' sin "qué puedes hacer"');
    assert.ok(e.url || e.urlKey, e.id + ' sin enlace');
    assert.ok(typeof e.title === 'string' || typeof e.title === 'function', e.id + ' sin título');
  }
});

test('las fichas locales se adaptan al municipio y a la región', () => {
  const concello = RL.directory.entries.find(e => e.id === 'concello');
  const ctx = { localLabel: 'Concello', municipality: 'Vigo', province: 'Pontevedra', regionName: 'Galicia' };
  assert.strictEqual(concello.title(ctx), 'Concello de Vigo');
  assert.ok(concello.what.some(x => /padrón/i.test(x)));

  const region = RL.regionByProvince('Pontevedra');
  assert.ok(RL.directory.resolveUrl(concello, region).includes('xunta.gal'));
  const salud = RL.directory.entries.find(e => e.id === 'centro_salud');
  assert.ok(RL.directory.resolveUrl(salud, region).includes('sergas.gal'));
});

test('las fichas regionales tienen título y lugar dinámicos', () => {
  const salud = RL.directory.entries.find(e => e.id === 'salud_region');
  const ctx = { healthName: 'SERGAS', regionName: 'Galicia' };
  assert.strictEqual(salud.title(ctx), 'SERGAS');
  assert.strictEqual(salud.where(ctx), 'Galicia');
});

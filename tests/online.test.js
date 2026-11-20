/* Pruebas de la sección online. */
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const { loadRL } = require('./harness');

const RL = loadRL();

test('la guía online tiene sedes y servicios únicos', () => {
  assert.ok(RL.online.items.length >= 15);
  const ids = RL.online.items.map(x => x.id);
  assert.strictEqual(new Set(ids).size, ids.length);
  const cats = new Set(RL.online.categories.map(c => c.id));
  for (const x of RL.online.items) {
    assert.ok(x.title && x.where && x.requires, x.id + ' incompleto');
    assert.ok(Array.isArray(x.what) && x.what.length >= 2, x.id + ' sin qué hacer');
    assert.ok(cats.has(x.cat), x.id + ' categoría inválida');
    const url = RL.online.resolveUrl(x, null);
    assert.match(url, /^https:\/\//, x.id + ' sin https');
  }
});

test('incluye Cl@ve, DEHú, Mercurio, DGT y citas', () => {
  const ids = RL.online.items.map(x => x.id);
  for (const id of ['clave', 'dehu', 'mercurio', 'dgt_canje', 'extranjeria_sede', 'icpp', 'cervantes']) {
    assert.ok(ids.includes(id), 'falta ' + id);
  }
  assert.strictEqual(RL.online.items.find(x => x.id === 'dgt_canje').mode, 'partial');
  assert.strictEqual(RL.online.items.find(x => x.id === 'dehu').mode, 'total');
  assert.ok(RL.online.items.find(x => x.id === 'icpp').url.includes('icp.administracionelectronica.gob.es'));
  assert.ok(!RL.online.items.find(x => x.id === 'icpp').url.includes('pagina/index/directorio'));
  assert.ok(RL.online.items.find(x => x.id === 'cervantes').url.includes('/examenes'));
});

test('la sede autonómica cambia con la comunidad', () => {
  const gal = RL.regionByProvince('Pontevedra');
  const mad = RL.regionByProvince('Madrid');
  const sede = RL.online.items.find(x => x.id === 'ccaa_sede');
  assert.ok(RL.online.resolveUrl(sede, gal).includes('sede.xunta.gal'));
  assert.ok(RL.online.resolveUrl(sede, mad).includes('sede.comunidad.madrid'));
  const concello = RL.online.items.find(x => x.id === 'concello');
  const ctx = { localLabel: 'Concello', municipality: 'Vigo', regionName: 'Galicia' };
  assert.ok(concello.where(ctx).includes('Concello de Vigo'));
});

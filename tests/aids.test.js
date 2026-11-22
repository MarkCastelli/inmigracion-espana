/* Pruebas de derechos y ayudas. */
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const { loadRL } = require('./harness');

const RL = loadRL();

test('la guía de ayudas tiene fichas completas y sin duplicados', () => {
  assert.ok(RL.aids.all.length >= 15);
  const ids = RL.aids.all.map(a => a.id);
  assert.strictEqual(new Set(ids).size, ids.length);
  for (const a of RL.aids.all) {
    assert.ok(a.title && a.who && a.where, a.id + ' incompleto');
    assert.ok(Array.isArray(a.what) && a.what.length >= 2, a.id + ' sin qué ofrece');
    assert.ok(a.url || a.urlKey, a.id + ' sin enlace');
  }
});

test('el certificado de discapacidad no se atribuye al ayuntamiento ni a la Seguridad Social', () => {
  const a = RL.aids.all.find(x => x.id === 'discapacidad_cert');
  assert.ok(/comunidad autónoma/i.test(a.note));
  assert.ok(/No lo emite el ayuntamiento/i.test(a.note));
  assert.ok(/Seguridad Social/i.test(a.note));
  const inc = RL.aids.all.find(x => x.id === 'incapacidad');
  assert.ok(/No es el certificado/i.test(inc.note));
});

test('el hijo adulto con discapacidad tiene opciones según la tarjeta', () => {
  const base = { nationality: 'CO', location: 'spain', childrenCount: 1, childrenAges: '22', childrenDisability: 'yes' };
  const reagrup = RL.aids.adultDisabledOptions(base, RL.derive(Object.assign({ permitStatus: 'family', permitKind: 'reagrupacion' }, base)));
  assert.ok(reagrup.some(x => /reagrupante/i.test(x.t + ' ' + x.b)));
  const familiar = RL.aids.adultDisabledOptions(base, RL.derive(Object.assign({ permitStatus: 'family', permitKind: 'familiar_espanol' }, base)));
  assert.ok(familiar.some(x => /5 años/i.test(x.b)));
  const noLucrativa = RL.aids.adultDisabledOptions(base, RL.derive(Object.assign({ permitStatus: 'work', permitKind: 'no_lucrativa' }, base)));
  assert.ok(noLucrativa.some(x => /IPREM/i.test(x.b)));
});

test('las ayudas locales se resuelven con la comunidad', () => {
  const region = RL.regionByProvince('Pontevedra');
  const cert = RL.aids.all.find(x => x.id === 'discapacidad_cert');
  assert.ok(RL.aids.resolveUrl(cert, region).includes('xunta.gal'));
  const ctx = { regionName: 'Galicia', localLabel: 'Concello', municipality: 'Vigo' };
  assert.ok(cert.where(ctx).includes('Galicia'));
  for (const id of ['escolarizacion', 'libros_material', 'comedor_becas', 'becas_generales']) {
    assert.ok(RL.aids.all.some(a => a.id === id), 'falta ' + id);
  }
});

test('comida, vivienda, asociaciones y salud mental están cubiertas', () => {
  const ids = RL.aids.all.map(a => a.id);
  for (const id of ['alimentos', 'vivienda_emergencia', 'asociaciones', 'salud_mental', 'muebles', 'gafas', 'suministros', 'vales_comida', 'servicios_sociales', 'transporte']) {
    assert.ok(ids.includes(id), 'falta ' + id);
  }
});

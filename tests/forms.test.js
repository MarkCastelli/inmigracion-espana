/* Pruebas del catálogo de formularios oficiales. */
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const { loadRL } = require('./harness');

const RL = loadRL();

test('el catálogo tiene formularios únicos y con enlaces https', () => {
  assert.ok(RL.forms.all.length >= 15);
  const ids = RL.forms.all.map(f => f.id);
  assert.strictEqual(new Set(ids).size, ids.length);
  for (const f of RL.forms.all) {
    assert.match(f.url, /^https:\/\//, f.id + ' sin https');
    assert.ok(f.code && f.title && f.where && f.fee, f.id + ' incompleto');
    assert.ok(!/extranjeros\.inclusion\.gob\.es/.test(f.url), f.id + ' apunta al portal antiguo');
  }
});

test('los modelos enlazan a la página oficial vigente', () => {
  for (const f of RL.forms.all) {
    if (f.type !== 'form') continue;
    assert.ok(f.url.includes('inclusion.gob.es/web/migraciones/modelos-generales'), f.id + ' no apunta al hub oficial');
    assert.ok(!f.url.includes('/documents/d/migraciones/'), f.id + ' usa la ruta antigua de PDF');
  }
});

test('incluye los modelos que pide el usuario: EX-03, EX-17 y 790-012', () => {
  const codes = RL.forms.all.map(f => f.code);
  for (const c of ['EX-03', 'EX-17', '790-012']) assert.ok(codes.includes(c), 'falta ' + c);
  assert.ok(RL.forms.byId('ex17').title.toLowerCase().includes('tarjeta de identidad'));
  assert.ok(RL.forms.byId('tasa012').url.includes('Tasa790_012'));
});

test('el arraigo usa EX-31 y no el antiguo EX-10', () => {
  const forms = RL.forms.forRoute('arraigo_social');
  const codes = forms.map(f => f.code);
  assert.ok(codes.includes('EX-31'), 'falta EX-31');
  assert.ok(!codes.includes('EX-10'), 'no debe ofrecer EX-10 para arraigo');
  assert.strictEqual(RL.forms.byId('ex31').routeIds.length, 4);
});

test('cada trámite tiene el modelo correcto', () => {
  assert.ok(RL.forms.forRoute('familiar_espanol').some(f => f.code === 'EX-24'));
  assert.ok(RL.forms.forRoute('circunstancias_excepcionales').some(f => f.code === 'EX-10'));
  assert.ok(RL.forms.forRoute('familiar_ue').some(f => f.code === 'EX-19'));
  assert.ok(RL.forms.forRoute('ciudadano_ue').some(f => f.code === 'EX-18'));
  assert.ok(RL.forms.forRoute('visado_no_lucrativa').some(f => f.code === 'EX-01'));
  assert.ok(RL.forms.forRoute('visado_estudios').some(f => f.code === 'EX-00'));
  assert.ok(RL.forms.forRoute('visado_trabajo_ajena').some(f => f.code === 'EX-03'));
  assert.ok(RL.forms.forRoute('visado_cuenta_propia').some(f => f.code === 'EX-07'));
});

test('todos los routeIds del catálogo existen', () => {
  const ids = new Set(RL.routes.map(r => r.id));
  for (const f of RL.forms.all) {
    for (const rid of f.routeIds) {
      assert.ok(ids.has(rid), f.id + ' apunta a una vía inexistente: ' + rid);
    }
  }
});

test('las tasas oficiales están enlazadas', () => {
  assert.ok(RL.forms.byId('tasa052').url.includes('administracionespublicas.gob.es'));
  assert.ok(RL.forms.byId('tasa026').url.includes('mjusticia.gob.es'));
});

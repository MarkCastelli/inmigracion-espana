/* Pruebas de la guía de trámites y sus enlaces. */
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const { loadRL } = require('./harness');

const RL = loadRL();

test('la guía tiene trámites completos y sin duplicados', () => {
  assert.ok(RL.procedures.all.length >= 12);
  const ids = RL.procedures.all.map(p => p.id);
  assert.strictEqual(new Set(ids).size, ids.length);
  for (const p of RL.procedures.all) {
    assert.ok(p.title && p.when && p.where && p.fee, p.id + ' incompleto');
    assert.ok(Array.isArray(p.docs) && p.docs.length >= 2, p.id + ' sin documentos');
    assert.ok(Array.isArray(p.steps) && p.steps.length >= 3, p.id + ' sin pasos');
    assert.ok(p.appointment || p.url || p.urlKey, p.id + ' sin enlace');
    if (p.appointment) assert.match(p.appointment, /^https:\/\//, p.id + ' cita no https');
    assert.ok(!/extranjeros\.inclusion\.gob\.es/.test(p.appointment || p.url || ''), p.id + ' enlace antiguo');
  }
});

test('cada trámite sabe a qué vías pertenece', () => {
  const routes = new Set(RL.routes.map(r => r.id));
  for (const p of RL.procedures.all) {
    for (const rid of p.routeIds) assert.ok(routes.has(rid), p.id + ' ruta inexistente: ' + rid);
  }
});

test('los trámites clave están cubiertos', () => {
  const ids = RL.procedures.all.map(p => p.id);
  for (const id of ['nie_tie', 'arraigo', 'familiar_espanol', 'reagrupacion', 'asilo', 'nacionalidad', 'renovacion', 'modificacion_estudios', 'padron', 'tarjeta_sanitaria', 'homologacion_no_universitaria', 'homologacion_universitaria', 'unedasiss', 'vida_laboral', 'antecedentes_espana', 'antecedentes_origen', 'delitos_sexuales', 'apostilla', 'traduccion_jurada', 'denuncia_fraude_laboral', 'solicitar_ayuda_social', 'tarjeta_transporte', 'examen_ccse', 'examen_dele', 'declaracion_renta', 'recogida_tie']) {
    assert.ok(ids.includes(id), 'falta ' + id);
  }
  const nie = RL.procedures.all.find(x => x.id === 'nie_tie');
  assert.ok(nie.steps.some(s => /no la foto|no te la hacen/i.test(s)), 'debe aclarar que la foto la lleva el solicitante');
  assert.ok(nie.steps.some(s => /30-45/i.test(s)), 'debe indicar el plazo de la TIE');
  assert.ok(nie.steps.some(s => /segunda cita/i.test(s)), 'debe indicar la cita de recogida');
});

test('los enlaces locales se resuelven con la comunidad', () => {
  const region = RL.regionByProvince('Pontevedra');
  const padron = RL.procedures.all.find(p => p.id === 'padron');
  assert.ok(RL.procedures.resolveUrl(padron, region).includes('xunta.gal'));
  const salud = RL.procedures.all.find(p => p.id === 'tarjeta_sanitaria');
  assert.ok(RL.procedures.resolveUrl(salud, region).includes('sergas.gal'));
  const ctx = { localLabel: 'Concello', municipality: 'Vigo', province: 'Pontevedra' };
  assert.ok(padron.where(ctx).includes('Concello de Vigo'));
});

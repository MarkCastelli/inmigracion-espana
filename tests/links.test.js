/* Regresiones de enlaces: evita volver a rutas muertas conocidas. */
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const { loadRL } = require('./harness');

const RL = loadRL();

function allUrls() {
  const out = [];
  RL.online.items.forEach(x => { if (typeof x.url === 'string') out.push([x.id, x.url]); });
  RL.faq.items.forEach(x => (x.links || []).forEach(l => out.push([x.id, l[1]])));
  RL.procedures.all.forEach(x => { if (typeof x.url === 'string') out.push([x.id, x.url]); });
  RL.forms.all.forEach(x => { if (typeof x.url === 'string') out.push([x.id, x.url]); });
  RL.directory.entries.forEach(x => { if (typeof x.url === 'string') out.push([x.id, x.url]); });
  (RL.resources.links || []).forEach(x => out.push([x.t, x.u]));
  return out;
}

test('no se usan las rutas antiguas de ICPP, Registro Civil o formularios', () => {
  const bad = [
    'pagina/index/directorio/icpplus',
    '/documents/d/migraciones/',
    'mjusticia.gob.es/es/ciudadania/registro-civil',
    'mjusticia.gob.es/es/ciudadania/asistencia-juridica-gratuita'
  ];
  for (const [id, url] of allUrls()) {
    for (const b of bad) assert.ok(!String(url).includes(b), id + ' usa ' + b);
  }
});

test('no se usa el portal antiguo de Inspección ni el de Cervantes', () => {
  for (const [id, url] of allUrls()) {
    assert.ok(!/^https:\/\/www\.mites\.gob\.es\/itss\/$/.test(url), id + ' usa ITSS antiguo');
    assert.ok(!String(url).includes('examenes.cervantes.es'), id + ' usa el dominio antiguo de Cervantes');
  }
});

test('las entidades con enlace no apuntan a dominios muertos conocidos', () => {
  for (const [id, url] of allUrls()) {
    assert.ok(!String(url).includes('fundacionmadrina.org'), id + ' usa Madrina antigua');
    assert.ok(!String(url).includes('rais-fundacion.org'), id + ' usa RAIS antiguo');
  }
});

test('todos los enlaces visibles son https', () => {
  for (const [id, url] of allUrls()) {
    assert.match(String(url), /^https:\/\//, id + ' no usa https');
  }
});

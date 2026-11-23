/* Pruebas del motor de Ruta Legal. Ejecutar: node --test tests/ */
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { loadRL, ROOT } = require('./harness');

const RL = loadRL();
const TODAY = RL.dates.today();

function base(extra) {
  return Object.assign({
    nationality: 'CO',
    age: 32,
    location: 'spain',
    entryMode: 'tourist_free',
    timeInSpain: '1to2y',
    empadronado: 'yes',
    empadronamientoGaps: 'no',
    permitStatus: 'none',
    hasNie: 'no',
    leftSpain: 'no',
    exitOrder: 'no',
    asylumRequested: 'no',
    regularizationApplied: 'no',
    criminalSpain: 'no',
    criminalOrigin: 'no',
    healthInsurance: 'none',
    employment: 'none',
    monthlyIncome: 0,
    savings: 0,
    maritalStatus: 'soltero',
    childrenCount: 0,
    ancestry: 'none',
    bornInSpain: 'no',
    goals: ['regularizar'],
    horizon: '1y',
    canLeaveSpain: 'no'
  }, extra || {});
}

function byId(plan, id) {
  return plan.results.filter(r => r.route.id === id)[0];
}

/* ───────────── integridad del catálogo ───────────── */

test('el catálogo tiene vías suficientes y sin duplicados', () => {
  assert.ok(RL.routes.length >= 25, 'esperaba al menos 25 vías, hay ' + RL.routes.length);
  const ids = RL.routes.map(r => r.id);
  assert.strictEqual(new Set(ids).size, ids.length, 'hay ids duplicados');
  for (const r of RL.routes) {
    assert.ok(r.title && r.title.length > 3, r.id + ' sin título');
    assert.ok(r.summary && r.summary.length > 40, r.id + ' sin resumen');
    assert.ok(Array.isArray(r.requirements) && r.requirements.length > 0, r.id + ' sin requisitos');
    assert.ok(Array.isArray(r.docs) && r.docs.length > 0, r.id + ' sin documentos');
    assert.ok(Array.isArray(r.steps) && r.steps.length > 0, r.id + ' sin pasos');
    assert.ok(['open', 'closed'].includes(r.availability), r.id + ' availability inválida');
    assert.ok(['spain', 'consulado', 'both'].includes(r.where), r.id + ' where inválido');
  }
});

test('todas las pruebas de requisitos devuelven boolean o null', () => {
  const profiles = [
    base(),
    base({ nationality: 'VE', ancestry: 'grandparent', ancestorOrigin: 'originario', location: 'spain' }),
    base({ location: 'origin', outsideGoal: 'work', employment: 'remote', remoteIncome: 3000 })
  ];
  for (const p of profiles) {
    const plan = RL.buildPlan(p);
    for (const r of plan.results) {
      assert.ok(r.score >= 0 && r.score <= 100, r.route.id + ' score fuera de rango: ' + r.score);
      for (const q of r.reqs) {
        assert.ok(['ok', 'no', 'unknown'].includes(q.status), r.route.id + ' estado inválido');
        assert.ok(typeof q.label === 'string' && q.label.length > 0, r.route.id + ' requisito sin etiqueta');
      }
    }
  }
});

/* ───────────── perfil: cubano irregular 2,5 años ───────────── */

test('cubano con 2,5 años en España: arraigo social como vía principal', () => {
  const p = base({
    nationality: 'CU', age: 34, timeInSpain: '2to3y',
    employment: 'informal', monthsWorked: 18, cotizaciones: 'no',
    monthlyIncome: 900, savings: 1500, spanishLevel: 'nativo',
    exams: 'not_needed', goals: ['regularizar', 'trabajar'], horizon: 'urgent'
  });
  const plan = RL.buildPlan(p);
  const social = byId(plan, 'arraigo_social');
  assert.ok(social, 'no existe arraigo_social');
  assert.strictEqual(social.status, 'ready', 'esperaba ready, obtuve ' + social.status);
  assert.ok(plan.recommended.length > 0);
  assert.strictEqual(plan.recommended[0].route.id, 'arraigo_social');
  assert.ok(plan.recommended.every(r => r.route.availability === 'open'));
  assert.ok(!plan.recommended.some(r => r.route.informational));
});

test('cubano: los 2 años se calculan bien y la nacionalidad a 2 años queda a la vista', () => {
  const p = base({
    nationality: 'CU', timeInSpain: '2to3y', monthlyIncome: 900,
    permitStatus: 'residencia_temporal', permitSince: RL.dates.addMonths(RL.dates.today(), -25)
  });
  const d = RL.derive(p);
  assert.ok(d.monthsInSpain >= 28 && d.monthsInSpain <= 32, 'meses: ' + d.monthsInSpain);
  assert.strictEqual(d.ibero, true);
  const plan = RL.buildPlan(p);
  const n2 = byId(plan, 'nac_residencia_2');
  assert.ok(n2, 'no existe nac_residencia_2');
  assert.notStrictEqual(n2.status, 'blocked');
});

test('para la nacionalidad no cuentan el turismo ni el asilo solicitado', () => {
  const plan = RL.buildPlan(base({
    nationality: 'CU', timeInSpain: '2to3y', permitStatus: 'none', asylumStage: 'denegado'
  }));
  const n2 = byId(plan, 'nac_residencia_2');
  assert.ok(n2, 'no existe nac_residencia_2');
  assert.match(n2.fit, /turista o solicitante de asilo|residencia legal/i);
  assert.strictEqual(n2.status === 'ready', false);
});

test('un latino con CCSE y 2 años de residencia no necesita DELE', () => {
  const plan = RL.buildPlan(base({
    nationality: 'AR', monthlyIncome: 900,
    permitStatus: 'residencia_temporal', permitSince: RL.dates.addMonths(RL.dates.today(), -25),
    exams: 'ccse'
  }));
  const n2 = byId(plan, 'nac_residencia_2');
  assert.ok(n2, 'no existe nac_residencia_2');
  assert.notStrictEqual(n2.status, 'blocked');
  assert.match(n2.fit, /Ya cumples el tiempo/i);
});

/* ───────────── perfil: nieto venezolano ───────────── */

test('nieto de español sin residencia: la vía del art. 22.2.f aparece como alcanzable', () => {
  const p = base({
    nationality: 'VE', age: 40, timeInSpain: '6to12m',
    ancestry: 'grandparent', ancestorOrigin: 'originario', ancestorBornSpain: 'no',
    ancestryDocs: 'partial', goals: ['nacionalidad'], spanishLevel: 'nativo',
    exams: 'none', monthlyIncome: 400
  });
  const plan = RL.buildPlan(p);
  const r = byId(plan, 'nac_22_2f');
  assert.ok(r, 'no existe nac_22_2f');
  assert.strictEqual(r.status, 'almost');
  assert.ok(r.fails.some(f => /1 año de residencia/i.test(f.label)));
  assert.ok(plan.recommended.some(x => x.route.id === 'nac_22_2f'));
  assert.strictEqual(byId(plan, 'nac_ley_nietos').status, 'closed');
});

test('la Ley de Nietos está cerrada y no se recomienda', () => {
  const p = base({ nationality: 'CU', ancestry: 'grandparent', ancestorOrigin: 'originario', goals: ['nacionalidad'] });
  const plan = RL.buildPlan(p);
  const lmd = byId(plan, 'nac_ley_nietos');
  assert.strictEqual(lmd.status, 'closed');
  assert.ok(!plan.recommended.some(r => r.route.id === 'nac_ley_nietos'));
});

/* ───────────── perfil: cónyuge de española ───────────── */

test('cónyuge de española: tarjeta de familiar de español con encaje alto', () => {
  const p = base({
    nationality: 'CO', maritalStatus: 'casado', spouseSpanish: 'yes',
    spouseInSpain: 'yes', spouseStatus: 'spanish', goals: ['residencia_estable'],
    monthlyIncome: 500, exams: 'not_needed'
  });
  const plan = RL.buildPlan(p);
  const fam = byId(plan, 'familiar_espanol');
  assert.ok(fam);
  assert.ok(['ready', 'likely'].includes(fam.status), 'estado: ' + fam.status);
  assert.ok(fam.score >= 70, 'score: ' + fam.score);
  assert.ok(plan.recommended.some(r => r.route.id === 'familiar_espanol'));
});

/* ───────────── perfil: nómada digital ───────────── */

test('nómada digital en el extranjero: recomendado y con umbral de 2.442 €', () => {
  const p = base({
    nationality: 'AR', location: 'origin', outsideGoal: 'work',
    employment: 'remote', remoteIncome: 3000, remoteClientsOutside: 'yes',
    degree: 'grado', yearsExperience: 6, healthInsurance: 'private',
    goals: ['trabajar'], monthlyIncome: 0, savings: 12000, passport: 'yes'
  });
  const plan = RL.buildPlan(p);
  const r = byId(plan, 'visado_nomada_digital');
  assert.ok(r);
  assert.ok(['ready', 'likely'].includes(r.status), 'estado: ' + r.status);
  assert.ok(r.reqs.some(q => /2\.442/.test(q.label)));
  assert.ok(plan.recommended.some(x => x.route.id === 'visado_nomada_digital'));
});

/* ───────────── perfil: turista con sobreestancia ───────────── */

test('turista con más de 90 días: se detecta la sobreestancia y se avisa', () => {
  const p = base({
    nationality: 'CO', entryMode: 'tourist_free', entryDate: '2026-01-10',
    timeInSpain: '6to12m', permitStatus: 'none'
  });
  const d = RL.derive(p);
  assert.strictEqual(d.overstay, true);
  assert.ok(d.overstayDays > 200, 'días: ' + d.overstayDays);
  const plan = RL.buildPlan(p);
  assert.ok(plan.alerts.some(a => /90 días/i.test(a.title)), 'falta la alerta de 90 días');
});

/* ───────────── reglas transversales ───────────── */

test('no se recomiendan vías cerradas, informativas ni bloqueadas', () => {
  const profiles = [
    base(),
    base({ nationality: 'CU', timeInSpain: '2to3y', ancestry: 'parent', ancestorOrigin: 'originario' }),
    base({ nationality: 'VE', location: 'origin', outsideGoal: 'studies' })
  ];
  for (const p of profiles) {
    const plan = RL.buildPlan(p);
    for (const r of plan.recommended) {
      assert.strictEqual(r.route.availability, 'open', r.route.id + ' cerrada en recomendadas');
      assert.ok(!r.route.informational, r.route.id + ' informativa en recomendadas');
      assert.notStrictEqual(r.status, 'blocked');
    }
  }
});

test('el checklist no duplica documentos entre vías', () => {
  const p = base({
    nationality: 'CU', timeInSpain: '2to3y', ancestry: 'parent', ancestorOrigin: 'originario',
    goals: ['regularizar', 'nacionalidad'], monthlyIncome: 900, exams: 'both'
  });
  const plan = RL.buildPlan(p);
  const keys = plan.checklist.map(d => d.key);
  assert.strictEqual(new Set(keys).size, keys.length, 'claves duplicadas');
  for (const d of plan.checklist) {
    assert.ok(d.name && d.routes.length > 0);
  }
});

test('la línea temporal no incluye fechas pasadas y ordena por cercanía', () => {
  const p = base({
    nationality: 'CU', entryDate: '2026-02-01', timeInSpain: '6to12m',
    permitStatus: 'work', permitExpiry: '2026-12-15', permitSince: '2025-12-15'
  });
  const plan = RL.buildPlan(p);
  for (let i = 1; i < plan.timeline.length; i++) {
    assert.ok(plan.timeline[i - 1].days <= plan.timeline[i].days, 'línea temporal desordenada');
  }
  assert.ok(plan.timeline.every(t => t.days >= -1), 'hay hitos pasados');
});

test('un menor de edad no recibe recomendaciones de trabajo o arraigo', () => {
  const p = base({ age: 16, nationality: 'MA', location: 'spain', goals: ['regularizar'] });
  const plan = RL.buildPlan(p);
  for (const r of plan.recommended) {
    assert.ok(!['arraigo_social', 'arraigo_sociolaboral', 'visado_trabajo_ajena'].includes(r.route.id),
      r.route.id + ' recomendada a un menor');
  }
});

/* ───────────── perfiles especiales: UE y españoles ───────────── */

test('un ciudadano de la UE solo necesita el certificado de registro', () => {
  const p = base({
    nationality: 'IT', age: 29, entryMode: 'other', permitStatus: 'none',
    goals: ['residencia_estable']
  });
  const plan = RL.buildPlan(p);
  const r = byId(plan, 'ciudadano_ue');
  assert.ok(r, 'no existe ciudadano_ue');
  assert.ok(['ready', 'likely', 'almost'].includes(r.status), 'estado: ' + r.status);
  assert.ok(plan.recommended.some(x => x.route.id === 'ciudadano_ue'));
  assert.ok(!plan.recommended.some(x => x.route.id === 'arraigo_social'), 'no debe recomendar arraigo a un europeo');
  assert.ok(plan.alerts.some(a => /UE/.test(a.title)));
});

test('un español no recibe recomendaciones de regularización', () => {
  const p = base({ nationality: 'ES', location: 'spain', permitStatus: 'none', goals: ['nacionalidad'] });
  const plan = RL.buildPlan(p);
  assert.strictEqual(plan.recommended.length, 0);
  assert.ok(plan.alerts.some(a => /español/i.test(a.title)));
  assert.strictEqual(byId(plan, 'nac_residencia_2').status, 'blocked');
});

test('un turista dentro de los 90 días no se marca como irregular', () => {
  const p = base({ nationality: 'MX', entryMode: 'tourist_free', timeInSpain: 'lt3m', permitStatus: 'none' });
  const d = RL.derive(p);
  assert.strictEqual(d.irregular, false);
  assert.strictEqual(d.overstay, false);
});

test('un turista que supera los 90 días sí se marca como irregular', () => {
  const p = base({ nationality: 'MX', entryMode: 'tourist_free', timeInSpain: '6to12m', permitStatus: 'none' });
  const d = RL.derive(p);
  assert.strictEqual(d.irregular, true);
});

test('la portada comunica gratuidad, privacidad, honestidad y PDF', () => {
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8').toLowerCase();
  const phrases = [
    'es totalmente gratis para el inmigrante',
    'no evaluamos tu caso',
    'la decisión es tuya',
    'tus datos no se envían ni se comparten con nadie',
    'puedes descargar tu informe en pdf',
    'completar el formulario es la base de todo',
    'no se envía a ningún servidor de ruta legal',
    'compromisos contigo'
  ];
  for (const phrase of phrases) {
    assert.ok(html.includes(phrase.toLowerCase()), 'falta en la portada: ' + phrase);
  }
});

/* ───────────── documentos y protección internacional ───────────── */

test('una tarjeta roja acredita la solicitud de asilo y bloquea el arraigo', () => {
  const p = base({
    nationality: 'VE', docsBase: ['pasaporte', 'nie'],
    docsTramites: ['tarjeta_roja'], asylumStage: 'admitido',
    tarjetaRojaExpiry: '2026-12-20', goals: ['regularizar']
  });
  const plan = RL.buildPlan(p);
  assert.strictEqual(plan.d.irregular, false);
  assert.strictEqual(plan.d.asylumInProcess, true);
  assert.strictEqual(plan.d.hasRedCard, true);
  const seg = byId(plan, 'asilo_seguimiento');
  assert.ok(seg, 'no existe asilo_seguimiento');
  assert.ok(['ready', 'likely'].includes(seg.status), 'estado: ' + seg.status);
  assert.ok(plan.recommended.some(r => r.route.id === 'asilo_seguimiento'));
  const arraigo = byId(plan, 'arraigo_social');
  assert.strictEqual(arraigo.status, 'blocked');
  assert.ok(arraigo.blockers.some(b => /asilo/i.test(b)));
  assert.ok(plan.alerts.some(a => /tarjeta roja/i.test(a.title)));
  assert.ok(plan.timeline.some(t => /Caduca tu tarjeta roja/i.test(t.title)));
});

test('una hoja blanca de más de 6 meses abre la autorización de trabajo', () => {
  const p = base({
    nationality: 'VE', docsTramites: ['hoja_blanca'], asylumStage: 'solicitado',
    hojaBlancaDate: '2026-04-01', asylumWorkPermit: 'no', goals: ['regularizar']
  });
  const plan = RL.buildPlan(p);
  assert.strictEqual(plan.d.asylumInProcess, true);
  assert.strictEqual(plan.d.irregular, false);
  assert.ok(plan.alerts.some(a => /autorización de trabajo/i.test(a.title)), 'falta el aviso de trabajo');
  assert.ok(plan.recommended.some(r => r.route.id === 'asilo_seguimiento'));
});

test('una cita de asilo es urgente y no legaliza por sí sola', () => {
  const p = base({
    nationality: 'VE', docsTramites: ['cita_asilo'], asylumStage: 'cita',
    asylumCitaDate: '2026-12-02', goals: ['regularizar']
  });
  const plan = RL.buildPlan(p);
  assert.strictEqual(plan.d.asylumSoon, true);
  assert.strictEqual(plan.d.irregular, true);
  assert.ok(plan.alerts.some(a => /cita para solicitar asilo/i.test(a.title)));
  assert.ok(plan.timeline.some(t => /Cita para solicitar asilo/i.test(t.title)));
});

test('un expediente de extranjería abierto bloquea el arraigo (art. 126.h)', () => {
  const p = base({
    nationality: 'CO', permitStatus: 'work', permitSince: '2025-01-01',
    docsTramites: ['resguardo_extranjeria'], extranjeriaPendingType: 'modificacion',
    goals: ['residencia_estable']
  });
  const plan = RL.buildPlan(p);
  assert.strictEqual(plan.d.pendingExtranjeria, true);
  assert.ok(plan.alerts.some(a => /expediente de extranjería/i.test(a.title)));
  assert.strictEqual(byId(plan, 'arraigo_social').status, 'blocked');
  assert.ok(byId(plan, 'arraigo_social').blockers.some(b => /expediente/i.test(b)));
});

test('los documentos marcados cambian las acciones (certificado digital)', () => {
  const without = RL.buildPlan(base({ docsBase: [] })).actions.some(a => a.id === 'digital');
  const withCert = RL.buildPlan(base({ docsBase: ['certificado_digital'] })).actions.some(a => a.id === 'digital');
  assert.strictEqual(without, true);
  assert.strictEqual(withCert, false);
});

test('el paso de documentos solo aparece si estás en España', () => {
  const inside = RL.questions.visibleSteps({ location: 'spain' }).map(s => s.id);
  const outside = RL.questions.visibleSteps({ location: 'origin' }).map(s => s.id);
  assert.ok(inside.includes('documentos'));
  assert.ok(!outside.includes('documentos'));
  assert.strictEqual(inside.length, outside.length + 2);
});

/* ───────────── HTML ───────────── */

test('index.html referencia todos los scripts y existen', () => {
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const srcs = [...html.matchAll(/<script src="([^"]+)"/g)].map(m => m[1].split('?')[0]);
  assert.ok(srcs.length >= 8, 'esperaba al menos 8 scripts');
  assert.ok(srcs[0].endsWith('core.js'), 'core.js debe ir primero');
  assert.ok(srcs[srcs.length - 1].endsWith('app.js'), 'app.js debe ir último');
  for (const s of srcs) {
    assert.ok(fs.existsSync(path.join(ROOT, s)), 'falta ' + s);
  }
  assert.ok(html.includes('id="view-plan"'));
  assert.ok(html.includes('id="view-diagnostico"'));
});

test('la fecha de contenido es válida y las fuentes están declaradas', () => {
  assert.match(RL.CONTENT_DATE, /^\d{4}-\d{2}-\d{2}$/);
  assert.ok(RL.resources.links.length >= 10);
  assert.ok(RL.resources.myths.length >= 8);
  assert.ok(RL.resources.faq.length >= 10);
});

test('el plan es determinista para el mismo perfil', () => {
  const p = base({ nationality: 'CU', timeInSpain: '2to3y', monthlyIncome: 900, goals: ['regularizar'] });
  const a = RL.buildPlan(p).recommended.map(r => r.route.id + ':' + r.score).join('|');
  const b = RL.buildPlan(p).recommended.map(r => r.route.id + ':' + r.score).join('|');
  assert.strictEqual(a, b);
});


test('SEO técnico: enlaces, JSON-LD, canonical y sitemap', () => {
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  assert.ok(html.includes('<a class="nav__link" href="?view=formulario"'), 'navegación no rastreable');
  assert.ok(html.includes('id="navToggle"'), 'falta botón hamburguesa');
  assert.ok(html.includes('aria-controls="mainNav"'), 'falta relación accesible del menú');
  assert.ok(html.includes('WebApplication'), 'falta WebApplication JSON-LD');
  assert.ok(html.includes('<noscript>'), 'falta contenido noscript');
  assert.ok(html.includes('rel="canonical"'), 'falta canonical');
  assert.ok(html.includes('hreflang="es"'), 'falta hreflang');
  const seo = fs.readFileSync(path.join(ROOT, 'assets/js/data/seo.js'), 'utf8');
  assert.ok(seo.includes('pageUrl(view)'), 'canonical no usa URL rastreable');
  assert.ok(!seo.includes("'#/' + view"), 'canonical no debe usar hash');
  const map = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
  assert.ok(map.includes('?view=formulario'), 'sitemap sin formulario');
  assert.ok(map.includes('?view=vias'), 'sitemap sin vías');
  assert.ok(map.includes('lastmod'), 'sitemap sin lastmod');
  const robots = fs.readFileSync(path.join(ROOT, 'robots.txt'), 'utf8');
  assert.ok(robots.includes('Sitemap:'), 'robots sin sitemap');
});

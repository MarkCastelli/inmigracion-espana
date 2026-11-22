/* Pruebas del generador de PDF. Ejecutar: node tests/pdf.test.js */
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const { loadRL } = require('./harness');
const { extractText } = require('./pdf_reader');

const RL = loadRL();

const demo = {
  nationality: 'CU', age: 34, location: 'spain', entryMode: 'tourist_visa',
  timeInSpain: '2to3y', entryDate: '2024-03-10', empadronado: 'yes',
  empadronamientoSince: '2024-04-01', empadronamientoGaps: 'no',
  permitStatus: 'none', hasNie: 'yes', leftSpain: 'no', exitOrder: 'no',
  asylumRequested: 'no', regularizationApplied: 'no',
  criminalSpain: 'no', criminalOrigin: 'no', healthInsurance: 'none',
  employment: 'informal', monthsWorked: 20, cotizaciones: 'no',
  monthlyIncome: 950, savings: 1200, jobOffer: 'no', sector: 'cuidados',
  degree: 'fp_medio', spanishLevel: 'nativo', exams: 'not_needed',
  maritalStatus: 'casada', spouseInSpain: 'yes', spouseStatus: 'irregular',
  housing: 'alquiler_piso', housingProof: 'contract',
  childrenCount: 1, childrenAges: '7', childrenSpanish: 'no',
  ancestry: 'none', bornInSpain: 'no',
  goals: ['regularizar', 'trabajar'], horizon: 'urgent', canLeaveSpain: 'no',
  notes: 'Cuido a una señora mayor; hablo español y tengo los papeles de mi país.'
};

function build(profile) {
  const plan = RL.buildPlan(profile);
  return { plan, str: Buffer.from(RL.pdf.buildBytes(plan, profile)).toString('latin1') };
}

test('genera un PDF con cabecera, páginas, xref y EOF', () => {
  const { str } = build(demo);
  assert.ok(str.startsWith('%PDF-1.4'), 'cabecera PDF');
  assert.ok(str.includes('/Type /Catalog'), 'catálogo');
  assert.ok(str.includes('/Type /Pages'), 'árbol de páginas');
  assert.ok(str.includes('%%EOF'), 'EOF');

  const pages = (str.match(/\/MediaBox/g) || []).length;
  assert.ok(pages >= 2, 'esperaba varias páginas, hay ' + pages);

  const sx = str.lastIndexOf('startxref');
  assert.ok(sx > 0, 'startxref');
  const offset = parseInt(str.slice(sx + 9).trim().split(/\s+/)[0], 10);
  assert.strictEqual(str.slice(offset, offset + 4), 'xref', 'startxref apunta a xref');

  // La tabla empieza con la entrada libre; la siguiente debe apuntar al objeto 1.
  const table = str.slice(offset).split('\n');
  const firstEntry = table[3];
  const objOffset = parseInt(firstEntry.slice(0, 10), 10);
  assert.strictEqual(str.slice(objOffset, objOffset + 7), '1 0 obj', 'xref -> objeto 1');
});

test('el PDF muestra la situación de pareja y el desglose de hijos', () => {
  const profile = Object.assign({}, demo, {
    marriageType: 'civil',
    childrenCommon: 1, childrenOwn: 0, childrenPartner: 2,
    childrenAges: '5, 8 y 10', childrenSpanish: 'no'
  });
  const { plan } = build(profile);
  const doc = extractText(Buffer.from(RL.pdf.buildBytes(plan, profile)));
  const text = doc.text.replace(/\s+/g, ' ').toLowerCase();
  assert.ok(text.includes('situación de pareja'), 'falta situación de pareja');
  assert.ok(text.includes('hijos'), 'falta hijos');
  assert.ok(text.includes('comunes: 1'), 'falta hijos comunes');
  assert.ok(text.includes('solo pareja: 2'), 'falta hijos de la pareja');
  assert.ok(text.includes('total: 3'), 'falta total');
});

test('el PDF incluye el plan, los requisitos y los documentos', () => {
  const { str } = build(demo);
  assert.ok(str.includes('Mi plan en Ruta Legal'));
  assert.ok(str.includes('Arraigo social'));
  assert.ok(str.includes('Requisitos'));
  assert.ok(str.includes('Documentos'));
  assert.ok(str.includes('Tus datos'));
  assert.ok(str.includes('Trabajar'));
  assert.ok(!str.includes('undefined'), 'no debe contener undefined');
  assert.ok(!str.includes('[object Object]'));
  const doc = extractText(Buffer.from(str, 'latin1'));
  assert.ok(doc.text.includes('Expectativa realista'), 'falta la expectativa realista');
  assert.ok(doc.text.toLowerCase().includes('vivienda'), 'falta la situación de vivienda');
});

test('el PDF incluye el aviso de que no es asesoramiento jurídico', () => {
  const { str } = build(demo);
  assert.ok(str.includes('no es asesoramiento'), 'falta el aviso');
  assert.ok(str.includes('abogado'));
});

test('soporta acentos, euros y signos españoles sin romper el PDF', () => {
  const p = Object.assign({}, demo, {
    notes: 'Situación: «irregular», año 2024, 600 €/mes, ¿qué hago? — también ñ, á, é, í, ó, ú.'
  });
  const { str } = build(p);
  assert.ok(str.startsWith('%PDF-1.4'));
  assert.ok(str.includes('%%EOF'));
  assert.ok(str.includes('Situaci'));
});

test('todos los objetos y las longitudes de stream son coherentes', () => {
  const { str } = build(demo);
  const sx = str.lastIndexOf('startxref');
  const offset = parseInt(str.slice(sx + 9).trim().split(/\s+/)[0], 10);
  const lines = str.slice(offset).split('\n');
  const count = parseInt(lines[1].split(' ')[1], 10);
  for (let i = 1; i < count; i++) {
    const off = parseInt(lines[2 + i].slice(0, 10), 10);
    assert.ok(str.slice(off).startsWith(i + ' 0 obj'), 'objeto ' + i + ' mal referenciado');
  }
  const streams = [...str.matchAll(/\/Length (\d+) >>\nstream\n/g)];
  assert.ok(streams.length >= 2, 'esperaba varios streams');
  streams.forEach(function (m) {
    const start = m.index + m[0].length;
    const n = Number(m[1]);
    assert.strictEqual(str.slice(start + n, start + n + 10), '\nendstream', 'longitud de stream incorrecta');
  });
});

test('un lector externo puede extraer el texto de todas las páginas', () => {
  const { plan } = build(demo);
  const bytes = RL.pdf.buildBytes(plan, demo);
  const doc = extractText(bytes);
  assert.ok(doc.pages.length >= 2, 'páginas extraídas: ' + doc.pages.length);
  assert.ok(doc.text.includes('Mi plan en Ruta Legal'), 'título');
  assert.ok(doc.text.includes('Arraigo social'), 'vía principal');
  assert.ok(doc.text.includes('Tus datos'), 'datos');
  assert.ok(doc.text.includes('Requisitos'), 'requisitos');
  assert.ok(doc.text.includes('Documentos'), 'documentos');
  assert.ok(doc.text.includes('abogado'), 'recomendación de abogado');
  assert.ok(doc.text.includes('Página 1'), 'pie de página');
});

test('genera una hoja de datos para un formulario oficial', () => {
  const form = RL.forms.byId('ex31');
  const route = RL.routeById('arraigo_social');
  const bytes = RL.pdf.buildFormSheet(form, {
    nombre: 'María', apellidos: 'Pérez', nacionalidad: 'Cuba',
    nie: 'X1234567L', provincia: 'Madrid'
  }, route);
  const doc = extractText(bytes);
  const text = doc.text.replace(/\s+/g, ' ');
  assert.ok(doc.pages.length >= 2);
  assert.ok(text.includes('Hoja de datos'));
  assert.ok(text.includes('EX-31'));
  assert.ok(text.toLowerCase().includes('no es el formulario oficial'));
  assert.ok(text.includes('María'));
  assert.ok(text.includes('Arraigo social'));
});

test('genera un PDF de consulta a una IA', () => {
  const bytes = RL.pdf.buildAnswerPDF({
    date: '2026-11-20',
    question: '¿Puedo pedir arraigo sin contrato?',
    answer: 'El arraigo social no exige contrato, pero sí medios económicos.',
    context: 'Perfil de prueba'
  });
  const doc = extractText(bytes);
  const text = doc.text.replace(/\s+/g, ' ');
  assert.ok(text.includes('Consulta a una IA'));
  assert.ok(text.includes('¿Puedo pedir arraigo sin contrato?'));
  assert.ok(text.includes('El arraigo social no exige contrato'));
  assert.ok(text.toLowerCase().includes('no es asesoramiento'));
});

test('genera un informe de caso sin veredicto para el abogado', () => {
  const plan = RL.buildPlan(demo);
  const bytes = RL.pdf.buildCaseReport(plan, demo);
  const doc = extractText(Buffer.from(bytes));
  const text = doc.text.replace(/\s+/g, ' ').toLowerCase();
  assert.ok(text.includes('informe de caso'), 'falta el título');
  assert.ok(text.includes('hechos'), 'faltan hechos');
  assert.ok(!text.includes('vía recomendada'), 'no debe recomendar una vía');
});

test('el PDF cambia si cambia el perfil', () => {
  const a = build(demo).str;
  const b = build(Object.assign({}, demo, { nationality: 'VE', ancestry: 'grandparent', ancestorOrigin: 'originario' })).str;
  assert.notStrictEqual(a, b);
});

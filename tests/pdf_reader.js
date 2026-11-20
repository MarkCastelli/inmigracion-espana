/* Lector mínimo de PDF para validar el generador de Ruta Legal.
   No es un lector completo: entiende el subconjunto que produce pdf.js. */
'use strict';

function latin1(bytes) {
  return Buffer.from(bytes).toString('latin1');
}

function unescapePdf(str) {
  return str.replace(/\\([0-7]{1,3}|.)/g, function (m, g) {
    if (/^[0-7]+$/.test(g)) return String.fromCharCode(parseInt(g, 8));
    if (g === 'n') return '\n';
    if (g === 'r') return '\r';
    if (g === 't') return '\t';
    return g;
  });
}

var WINANSI = {
  0x80: '\u20AC', 0x82: '\u201A', 0x83: '\u0192', 0x84: '\u201E', 0x85: '\u2026',
  0x86: '\u2020', 0x87: '\u2021', 0x88: '\u02C6', 0x89: '\u2030', 0x8A: '\u0160',
  0x8B: '\u2039', 0x8C: '\u0152', 0x8E: '\u017D', 0x91: '\u2018', 0x92: '\u2019',
  0x93: '\u201C', 0x94: '\u201D', 0x95: '\u2022', 0x96: '\u2013', 0x97: '\u2014',
  0x98: '\u02DC', 0x99: '\u2122', 0x9A: '\u0161', 0x9B: '\u203A', 0x9C: '\u0153',
  0x9E: '\u017E', 0x9F: '\u0178'
};

function decodeWinAnsi(str) {
  var out = '';
  for (var i = 0; i < str.length; i++) {
    var c = str.charCodeAt(i);
    out += WINANSI[c] || String.fromCharCode(c);
  }
  return out;
}

function parse(bytes) {
  var s = latin1(bytes);
  var sx = s.lastIndexOf('startxref');
  if (sx < 0) throw new Error('sin startxref');
  var xrefOff = parseInt(s.slice(sx + 9).trim().split(/\s+/)[0], 10);
  if (s.slice(xrefOff, xrefOff + 4) !== 'xref') throw new Error('startxref no apunta a xref');

  var lines = s.slice(xrefOff).split('\n');
  var count = parseInt(lines[1].split(' ')[1], 10);
  var objects = {};
  for (var i = 1; i < count; i++) {
    var off = parseInt(lines[2 + i].slice(0, 10), 10);
    var start = s.indexOf(i + ' 0 obj', off);
    if (start < 0) throw new Error('objeto ' + i + ' no encontrado');
    var end = s.indexOf('endobj', start);
    objects[i] = s.slice(start, end);
  }
  return { text: s, objects: objects, count: count };
}

function streamOf(objects, ref) {
  var body = objects[ref];
  if (!body) throw new Error('sin objeto ' + ref);
  var m = /\/Length (\d+) >>\nstream\n/.exec(body);
  if (!m) throw new Error('objeto ' + ref + ' no es un stream');
  var start = m.index + m[0].length;
  var n = Number(m[1]);
  var content = body.slice(start, start + n);
  if (body.slice(start + n, start + n + 10) !== '\nendstream') throw new Error('longitud incorrecta');
  return content;
}

function textOfContent(content) {
  var out = [];
  var re = /\(((?:\\.|[^\\()])*)\)\s*Tj/g, m;
  while ((m = re.exec(content))) out.push(decodeWinAnsi(unescapePdf(m[1])));
  return out.join('\n');
}

function extractText(bytes) {
  var doc = parse(bytes);
  var pages = [];
  Object.keys(doc.objects).forEach(function (num) {
    var body = doc.objects[num];
    if (/\/Type \/Page\b/.test(body) && !/\/Type \/Pages/.test(body)) {
      var ref = /\/Contents (\d+) 0 R/.exec(body);
      if (ref) pages.push(textOfContent(streamOf(doc.objects, Number(ref[1]))));
    }
  });
  return { pages: pages, text: pages.join('\n\n'), objects: doc.objects };
}

module.exports = { extractText: extractText, parse: parse };

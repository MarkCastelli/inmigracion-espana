/* ============================================================
   Ruta Legal · núcleo: utilidades, estado local y fechas
   Sin dependencias. Funciona abriendo index.html directamente.
   ============================================================ */
(function () {
  'use strict';

  var RL = window.RL = window.RL || {};

  RL.VERSION = '1.0.0';
  RL.CONTENT_DATE = '2026-11-22';      // última revisión del contenido legal
  RL.STORAGE_KEY = 'ruta-legal.v1';

  /* ─────────── utilidades DOM ─────────── */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function attr(value) { return esc(value).replace(/`/g, '&#96;'); }

  function safeUrl(url) {
    var u = String(url || '').trim();
    return /^https?:\/\//i.test(u) ? u : '#';
  }

  /* ─────────── fechas (ISO local, sin sustos de zona horaria) ─────────── */
  function parseISO(iso) {
    if (!iso) return null;
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso));
    if (!m) return null;
    var d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 12, 0, 0, 0);
    return isNaN(d.getTime()) ? null : d;
  }
  function isoDate(d) {
    if (!d || isNaN(d.getTime())) return '';
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + m + '-' + day;
  }
  function todayISO() { return isoDate(new Date()); }
  function addDays(iso, n) {
    var d = parseISO(iso); if (!d) return '';
    d.setDate(d.getDate() + Number(n || 0)); return isoDate(d);
  }
  function addMonths(iso, n) {
    var d = parseISO(iso); if (!d) return '';
    var day = d.getDate();
    d.setDate(1); d.setMonth(d.getMonth() + Number(n || 0));
    var last = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    d.setDate(Math.min(day, last));
    return isoDate(d);
  }
  function addYears(iso, n) { return addMonths(iso, 12 * Number(n || 0)); }
  function daysBetween(aISO, bISO) {
    var a = parseISO(aISO), b = parseISO(bISO);
    if (!a || !b) return null;
    return Math.round((b - a) / 86400000);
  }
  function yearsBetween(aISO, bISO) {
    var d = daysBetween(aISO, bISO);
    return d == null ? null : d / 365.2425;
  }
  var MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  function fmtDate(iso, opts) {
    var d = parseISO(iso); if (!d) return '';
    var o = opts || {};
    var s = d.getDate() + ' ' + MONTHS[d.getMonth()];
    if (o.year !== false) s += ' ' + d.getFullYear();
    return s;
  }
  function fmtMonthYear(iso) {
    var d = parseISO(iso); if (!d) return '';
    return MONTHS[d.getMonth()] + ' ' + d.getFullYear();
  }
  function fmtRelativeDays(n) {
    if (n == null) return '';
    if (n === 0) return 'hoy';
    if (n === 1) return 'mañana';
    if (n === -1) return 'ayer';
    if (n > 0 && n < 45) return 'en ' + n + ' días';
    if (n < 0 && n > -45) return 'hace ' + Math.abs(n) + ' días';
    var months = Math.round(Math.abs(n) / 30.44);
    if (months < 18) return n > 0 ? 'en ' + months + ' meses' : 'hace ' + months + ' meses';
    var years = (Math.abs(n) / 365.2425);
    var txt = years < 2 ? '1 año' : Math.round(years) + ' años';
    return n > 0 ? 'en ' + txt : 'hace ' + txt;
  }
  function fmtDuration(months) {
    if (months == null) return '';
    if (months < 1) return 'menos de 1 mes';
    if (months < 12) return Math.round(months) + (Math.round(months) === 1 ? ' mes' : ' meses');
    var y = Math.floor(months / 12), m = Math.round(months % 12);
    var s = y + (y === 1 ? ' año' : ' años');
    if (m > 0) s += ' y ' + m + (m === 1 ? ' mes' : ' meses');
    return s;
  }

  /* ─────────── números y texto ─────────── */
  function eur(n) {
    if (n == null || n === '' || isNaN(n)) return '—';
    try { return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(Number(n)); }
    catch (e) { return Number(n) + ' €'; }
  }
  function num(n) { try { return new Intl.NumberFormat('es-ES').format(Number(n)); } catch (e) { return String(n); } }
  function pct(n) { return Math.max(0, Math.min(100, Math.round(n || 0))) + '%'; }
  function plural(n, one, many) { return Number(n) === 1 ? one : (many || one + 's'); }

  /* ─────────── estado persistente ─────────── */
  var memory = null;
  var storageOK = (function () {
    try {
      var k = '__rl_test__';
      window.localStorage.setItem(k, '1');
      window.localStorage.removeItem(k);
      return true;
    } catch (e) { return false; }
  })();

  function emptyState() {
    return {
      profile: {},
      checklist: {},
      formData: {},
      consultations: [],
      seen: [],
      dismissed: {},
      meta: { createdAt: todayISO(), updatedAt: todayISO(), completedSteps: 0 }
    };
  }

  function normalize(state) {
    var base = emptyState();
    if (!state || typeof state !== 'object') return base;
    base.profile = (state.profile && typeof state.profile === 'object') ? state.profile : {};
    base.checklist = (state.checklist && typeof state.checklist === 'object') ? state.checklist : {};
    base.formData = (state.formData && typeof state.formData === 'object') ? state.formData : {};
    base.consultations = Array.isArray(state.consultations) ? state.consultations : [];
    base.seen = Array.isArray(state.seen) ? state.seen : [];
    base.dismissed = (state.dismissed && typeof state.dismissed === 'object') ? state.dismissed : {};
    base.meta = Object.assign(base.meta, state.meta || {});
    return base;
  }

  RL.state = emptyState();

  RL.store = {
    available: storageOK,
    load: function () {
      if (memory) return memory;
      var raw = null;
      try { raw = window.localStorage.getItem(RL.STORAGE_KEY); } catch (e) { raw = null; }
      var parsed = null;
      if (raw) { try { parsed = JSON.parse(raw); } catch (e) { parsed = null; } }
      memory = normalize(parsed);
      RL.state = memory;
      return memory;
    },
    save: function () {
      RL.state.meta.updatedAt = todayISO();
      memory = RL.state;
      if (!storageOK) return false;
      try { window.localStorage.setItem(RL.STORAGE_KEY, JSON.stringify(RL.state)); return true; }
      catch (e) { return false; }
    },
    reset: function () {
      memory = emptyState();
      RL.state = memory;
      try { window.localStorage.removeItem(RL.STORAGE_KEY); } catch (e) {}
    },
    export: function () {
      return JSON.stringify({ app: 'ruta-legal', version: RL.VERSION, exportedAt: new Date().toISOString(), state: RL.state }, null, 2);
    },
    import: function (json) {
      var data = typeof json === 'string' ? JSON.parse(json) : json;
      var st = data && data.state ? data.state : data;
      memory = normalize(st);
      RL.state = memory;
      RL.store.save();
      return memory;
    }
  };

  RL.profile = function () { return RL.state.profile; };
  RL.setProfile = function (patch) {
    Object.keys(patch || {}).forEach(function (k) { RL.state.profile[k] = patch[k]; });
    RL.store.save();
    return RL.state.profile;
  };
  RL.getProfile = function (key) { return RL.state.profile[key]; };
  RL.hasSavedProfile = function () {
    var p = RL.state.profile || {};
    return !!(p.nationality && (p.location || p.age));
  };

  /* ─────────── iconos (SVG en línea, sin ficheros externos) ─────────── */
  function svg(path, size) {
    return '<svg viewBox="0 0 24 24" width="' + (size || 18) + '" height="' + (size || 18) + '" aria-hidden="true" focusable="false">' + path + '</svg>';
  }
  var I = RL.icons = {
    check: function (s) { return svg('<path d="M4.5 12.5l5 5 10-11" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>', s); },
    x: function (s) { return svg('<path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round"/>', s); },
    minus: function (s) { return svg('<path d="M5 12h14" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round"/>', s); },
    help: function (s) { return svg('<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.9"/><path d="M9.6 9.2a2.5 2.5 0 1 1 3.6 2.3c-.8.4-1.2 1-1.2 1.9" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/><circle cx="12" cy="17" r="1.1" fill="currentColor"/>', s); },
    alert: function (s) { return svg('<path d="M12 3.5 2.9 20h18.2L12 3.5Z" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/><path d="M12 9.6v4.4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="17.1" r="1.05" fill="currentColor"/>', s); },
    info: function (s) { return svg('<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.9"/><path d="M12 11v5.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="7.8" r="1.15" fill="currentColor"/>', s); },
    clock: function (s) { return svg('<circle cx="12" cy="12" r="8.6" fill="none" stroke="currentColor" stroke-width="1.9"/><path d="M12 7.4V12l3.2 2" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>', s); },
    doc: function (s) { return svg('<path d="M6 3.5h7l5 5V20a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M13 3.5V9h5M8.5 13h7M8.5 16.5h5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>', s); },
    euro: function (s) { return svg('<path d="M17.5 6.4A7 7 0 0 0 7.2 12a7 7 0 0 0 10.3 5.6" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/><path d="M4.6 10.2h8.6M4.6 13.8h8" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>', s); },
    pin: function (s) { return svg('<path d="M12 21s6.5-5.6 6.5-11a6.5 6.5 0 1 0-13 0C5.5 15.4 12 21 12 21Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><circle cx="12" cy="10" r="2.3" fill="none" stroke="currentColor" stroke-width="1.8"/>', s); },
    cal: function (s) { return svg('<rect x="3.5" y="5" width="17" height="15.5" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8 3v4M16 3v4M3.5 10h17" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>', s); },
    ext: function (s) { return svg('<path d="M14 4h6v6M20 4l-8.5 8.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M18.5 14v5.5a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1v-13a1 1 0 0 1 1-1H10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>', s); },
    arrow: function (s) { return svg('<path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/>', s); },
    user: function (s) { return svg('<circle cx="12" cy="8.2" r="3.6" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M4.5 20c.9-3.7 3.9-5.8 7.5-5.8s6.6 2.1 7.5 5.8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>', s); },
    home: function (s) { return svg('<path d="M4 11.5 12 4l8 7.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-8.5Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>', s); },
    briefcase: function (s) { return svg('<rect x="3" y="7.5" width="18" height="12.5" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8.5 7.5V6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v1.5M3 12.5h18" fill="none" stroke="currentColor" stroke-width="1.8"/>', s); },
    book: function (s) { return svg('<path d="M4 5.5A2 2 0 0 1 6 3.5h5v16H6a2 2 0 0 0-2 2v-16Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M20 5.5a2 2 0 0 0-2-2h-5v16h5a2 2 0 0 1 2 2v-16Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>', s); },
    family: function (s) { return svg('<circle cx="8" cy="7.5" r="2.7" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="16.5" cy="9" r="2.2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3 19c.6-3.2 2.7-5 5-5s4.4 1.8 5 5M14 19c.4-2.4 1.8-3.8 3.4-3.8 1.7 0 3 1.4 3.4 3.8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>', s); },
    shield: function (s) { return svg('<path d="M12 3l7.5 3v5.4c0 4.6-3.1 8.8-7.5 10.4C7.6 20.2 4.5 16 4.5 11.4V6L12 3Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M8.6 12.1l2.3 2.3 4.5-4.7" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>', s); },
    globe: function (s) { return svg('<circle cx="12" cy="12" r="8.7" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3.4 12h17.2M12 3.3c2.3 2.4 3.5 5.4 3.5 8.7s-1.2 6.3-3.5 8.7c-2.3-2.4-3.5-5.4-3.5-8.7S9.7 5.7 12 3.3Z" fill="none" stroke="currentColor" stroke-width="1.6"/>', s); },
    route: function (s) { return svg('<circle cx="6" cy="18" r="2.4" fill="none" stroke="currentColor" stroke-width="1.9"/><circle cx="18" cy="6" r="2.4" fill="none" stroke="currentColor" stroke-width="1.9"/><path d="M8.4 18H14a4 4 0 0 0 0-8H9a4 4 0 0 1 0-8h6.6" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>', s); },
    search: function (s) { return svg('<circle cx="11" cy="11" r="6.6" fill="none" stroke="currentColor" stroke-width="1.9"/><path d="M16 16l4.5 4.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>', s); },
    print: function (s) { return svg('<path d="M7 9V4h10v5M7 18H5a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><rect x="7" y="14" width="10" height="6.5" rx="1" fill="none" stroke="currentColor" stroke-width="1.8"/>', s); },
    save: function (s) { return svg('<path d="M5 4h11l4 4v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M8 4v5h7V4M8 20v-6h8v6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>', s); },
    copy: function (s) { return svg('<rect x="8" y="8" width="11" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h2" fill="none" stroke="currentColor" stroke-width="1.8"/>', s); },
    refresh: function (s) { return svg('<path d="M20 12a8 8 0 1 1-2.4-5.7M20 4v5h-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>', s); },
    speaker: function (s) { return svg('<path d="M4 9.2v5.6h3.2l4.3 3.4V5.8L7.2 9.2H4Z" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/><path d="M15.2 8.6a4.8 4.8 0 0 1 0 6.8M17.9 6a8.4 8.4 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>', s); }
  };

  RL.dom = { $: $, $$: $$, esc: esc, attr: attr, safeUrl: safeUrl };
  RL.fmt = {
    date: fmtDate, monthYear: fmtMonthYear, relative: fmtRelativeDays, duration: fmtDuration,
    eur: eur, num: num, pct: pct, plural: plural
  };
  RL.dates = {
    parse: parseISO, iso: isoDate, today: todayISO, addDays: addDays, addMonths: addMonths,
    addYears: addYears, diff: daysBetween, years: yearsBetween
  };
})();

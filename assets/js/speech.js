/* ============================================================
   Ruta Legal · lectura en voz alta con la Web Speech API
   Sin servidor, sin API key y sin enviar texto a terceros.
   Usa las voces instaladas en el navegador/sistema.
   ============================================================ */
(function () {
  'use strict';
  var RL = window.RL = window.RL || {};

  var synth = (typeof window !== 'undefined' && window.speechSynthesis) ? window.speechSynthesis : null;
  var Utter = (typeof window !== 'undefined' && window.SpeechSynthesisUtterance) ? window.SpeechSynthesisUtterance : null;
  var supported = !!(synth && Utter);

  var voices = [];
  var voice = null;
  var rate = 1;
  var queue = [];
  var index = 0;
  var speaking = false;
  var paused = false;
  var cancelled = false;
  var title = '';
  var handlers = [];

  var LS_VOICE = 'ruta-legal.voice';
  var LS_RATE = 'ruta-legal.rate';

  function emit(type, data) {
    handlers.forEach(function (fn) {
      try { fn(type, data || {}); } catch (e) {}
    });
  }

  function loadPrefs() {
    try {
      var r = parseFloat(window.localStorage.getItem(LS_RATE));
      if (r >= 0.6 && r <= 1.6) rate = r;
    } catch (e) {}
  }

  function savePrefs() {
    try {
      if (voice) window.localStorage.setItem(LS_VOICE, voice.voiceURI);
      window.localStorage.setItem(LS_RATE, String(rate));
    } catch (e) {}
  }

  function spanish(v) { return /^es([-_]|$)/i.test(v.lang || ''); }

  function pickVoice() {
    if (!voices.length) return null;
    var saved = null;
    try { saved = window.localStorage.getItem(LS_VOICE); } catch (e) {}
    if (saved) {
      var found = voices.filter(function (v) { return v.voiceURI === saved; })[0];
      if (found) return found;
    }
    var es = voices.filter(spanish);
    var esES = es.filter(function (v) { return /^es[-_]ES/i.test(v.lang || ''); });
    return esES.filter(function (v) { return v.localService; })[0] ||
      esES[0] ||
      es.filter(function (v) { return v.localService; })[0] ||
      es[0] || voices[0] || null;
  }

  function refreshVoices() {
    if (!supported) return;
    try { voices = synth.getVoices() || []; } catch (e) { voices = []; }
    voice = pickVoice();
    populate();
    emit('voices', { count: voices.length });
  }

  function setVoice(uri) {
    var found = voices.filter(function (v) { return v.voiceURI === uri; })[0];
    if (found) { voice = found; savePrefs(); }
  }

  function setRate(n) {
    var v = parseFloat(n);
    if (v >= 0.6 && v <= 1.6) { rate = v; savePrefs(); }
    if (speaking) {
      /* Aplicar al siguiente fragmento: la velocidad no cambia a mitad de utterance. */
    }
  }

  function clean(text) {
    return String(text || '')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/[«»“”"]/g, '')
      .replace(/€/g, ' euros')
      .replace(/%/g, ' por ciento')
      .replace(/·/g, ', ')
      .replace(/→/g, ' a ')
      .replace(/[—–]/g, ', ')
      .replace(/\bart\.\s*/gi, 'artículo ')
      .replace(/\bn[º°]\.?\s*/gi, 'número ')
      .replace(/\s+/g, ' ')
      .replace(/\s+([,.;:!?])/g, '$1')
      .trim();
  }

  function splitLong(s, max) {
    if (s.length <= max) return [s];
    var words = s.split(' '), out = [], cur = '';
    words.forEach(function (w) {
      if ((cur + ' ' + w).trim().length > max && cur) { out.push(cur.trim()); cur = w; }
      else cur = cur ? cur + ' ' + w : w;
    });
    if (cur.trim()) out.push(cur.trim());
    return out;
  }

  function chunk(text) {
    var t = clean(text);
    if (!t) return [];
    var sentences = [];
    var re = /[^.!?…]+[.!?…]+|[^.!?…]+$/g, m;
    while ((m = re.exec(t))) {
      var s = m[0].trim();
      if (s) sentences.push(s);
    }
    var out = [], cur = '';
    function push(s) {
      splitLong(s, 220).forEach(function (piece) { out.push(piece); });
    }
    sentences.forEach(function (s) {
      if ((cur + ' ' + s).trim().length > 220 && cur) { push(cur); cur = s; }
      else cur = cur ? cur + ' ' + s : s;
    });
    if (cur.trim()) push(cur);
    return out.length ? out : [t];
  }

  function next() {
    if (cancelled || !speaking) return;
    if (index >= queue.length) {
      speaking = false;
      paused = false;
      emit('end', { title: title });
      return;
    }
    var u = new Utter(queue[index]);
    if (voice) { u.voice = voice; u.lang = voice.lang; }
    else u.lang = 'es-ES';
    u.rate = rate;
    u.pitch = 1;
    u.volume = 1;
    u.onend = function () {
      if (cancelled) return;
      index++;
      emit('progress', { index: index, total: queue.length, title: title });
      next();
    };
    u.onerror = function (ev) {
      if (cancelled) return;
      if (ev && (ev.error === 'interrupted' || ev.error === 'canceled')) return;
      index++;
      emit('progress', { index: index, total: queue.length, title: title });
      next();
    };
    emit('progress', { index: index, total: queue.length, title: title });
    try { synth.speak(u); } catch (e) { speaking = false; emit('stop'); }
  }

  function speak(text, t) {
    if (!supported) return false;
    stop();
    queue = chunk(text);
    if (!queue.length) return false;
    index = 0;
    speaking = true;
    paused = false;
    cancelled = false;
    title = t || 'Documento';
    emit('start', { title: title, total: queue.length });
    next();
    return true;
  }

  function pause() {
    if (!supported || !speaking || paused) return;
    try { synth.pause(); } catch (e) {}
    paused = true;
    emit('pause', { title: title });
  }

  function resume() {
    if (!supported || !speaking || !paused) return;
    try { synth.resume(); } catch (e) {}
    paused = false;
    emit('resume', { title: title });
  }

  function stop() {
    if (!supported) return;
    cancelled = true;
    try { synth.cancel(); } catch (e) {}
    speaking = false;
    paused = false;
    queue = [];
    index = 0;
    emit('stop', { title: title });
  }

  function toggle() {
    if (!speaking) return false;
    if (paused) resume(); else pause();
    return true;
  }

  /* ── texto para leer ── */

  function buildViewText(el) {
    if (!el || !el.cloneNode) return '';
    var clone = el.cloneNode(true);
    var remove = clone.querySelectorAll('script, style, svg, button, .btn, .no-speech, [hidden], details:not([open]), .nav, .topbar, .footer, #speechBar, .hero__card');
    for (var i = 0; i < remove.length; i++) {
      if (remove[i] && remove[i].parentNode) remove[i].parentNode.removeChild(remove[i]);
    }
    return clean(clone.textContent || '');
  }

  function buildPlanScript(plan) {
    var parts = [];
    parts.push('Tu plan en Ruta Legal.');
    parts.push(plan.summary || '');
    if (plan.confidence) parts.push('Confianza del diagnóstico: ' + plan.confidence.level + '.');
    if (plan.decision && plan.decision.primaryReason) parts.push(plan.decision.primaryReason);
    if (plan.d && plan.d.isSpanish) {
      parts.push('Ya tienes la nacionalidad española. No necesitas regularización.');
    }
    if (plan.alerts && plan.alerts.length) {
      parts.push('Avisos importantes.');
      plan.alerts.slice(0, 3).forEach(function (a) { parts.push(a.title + '. ' + a.body); });
    }
    if (plan.recommended && plan.recommended.length) {
      parts.push('Vías recomendadas.');
      plan.recommended.slice(0, 3).forEach(function (r, i) {
        parts.push((i + 1) + '. ' + r.route.title + '. ' + RL.statusOf(r.status).label + '. ' + (r.fit || r.route.summary));
        var missing = r.fails.filter(function (f) { return f.critical; }).map(function (f) { return f.label; });
        if (missing.length) parts.push('Te falta: ' + missing.join('. ') + '.');
      });
    }
    if (plan.actions && plan.actions.length) {
      parts.push('Qué puedes hacer ya.');
      plan.actions.slice(0, 4).forEach(function (a) { parts.push(a.title + '. ' + a.body); });
    }
    if (plan.timeline && plan.timeline.length) {
      parts.push('Fechas clave.');
      plan.timeline.slice(0, 4).forEach(function (t) {
        parts.push(RL.fmt.date(t.date, { year: true }) + ': ' + t.title + '.');
      });
    }
    if (plan.checklist && plan.checklist.length) {
      parts.push('Documentos.');
      parts.push(plan.checklist.slice(0, 8).map(function (d) { return d.name; }).join('. ') + '.');
    }
    parts.push('Recuerda: esto es una orientación, no asesoramiento jurídico. No garantizamos que sea el mejor ni el único camino. Consulta con un abogado de extranjería.');
    return clean(parts.join(' '));
  }

  /* ── barra de reproducción ── */

  function populate() {
    var sel = document.getElementById('speechVoice');
    if (sel) {
      sel.innerHTML = '';
      var list = voices.slice();
      list.sort(function (a, b) {
        var sa = spanish(a) ? 0 : 1, sb = spanish(b) ? 0 : 1;
        return sa - sb || String(a.name).localeCompare(String(b.name));
      });
      if (!list.length) list = [null];
      list.forEach(function (v) {
        var o = document.createElement('option');
        o.value = v ? v.voiceURI : '';
        o.textContent = v ? (v.name + ' (' + v.lang + (v.localService === false ? ' · online' : ' · local') + ')') : 'Voz del sistema';
        sel.appendChild(o);
      });
      if (voice) sel.value = voice.voiceURI;
    }
    var rateSel = document.getElementById('speechRate');
    if (rateSel) rateSel.value = String(rate);
  }

  function initBar() {
    var bar = document.getElementById('speechBar');
    if (!bar) return;
    bar.hidden = true;
    populate();

    var toggleBtn = document.getElementById('speechToggle');
    var stopBtn = document.getElementById('speechStop');
    var voiceSel = document.getElementById('speechVoice');
    var rateSel = document.getElementById('speechRate');

    if (toggleBtn) toggleBtn.addEventListener('click', function () { toggle(); });
    if (stopBtn) stopBtn.addEventListener('click', function () { stop(); });
    if (voiceSel) voiceSel.addEventListener('change', function () { setVoice(voiceSel.value); });
    if (rateSel) rateSel.addEventListener('change', function () { setRate(rateSel.value); });

    on(function (type, data) {
      var titleEl = document.getElementById('speechTitle');
      var progEl = document.getElementById('speechProgress');
      if (type === 'start') {
        bar.hidden = false;
        document.body.classList.add('has-speech-bar');
        if (titleEl) titleEl.textContent = data.title || 'Leyendo';
        if (toggleBtn) toggleBtn.textContent = 'Pausar';
      }
      if (type === 'progress') {
        if (progEl) progEl.textContent = 'Frase ' + Math.min(data.index + 1, data.total) + ' de ' + data.total;
      }
      if (type === 'pause') {
        if (toggleBtn) toggleBtn.textContent = 'Reanudar';
        if (progEl) progEl.textContent = 'En pausa';
      }
      if (type === 'resume') {
        if (toggleBtn) toggleBtn.textContent = 'Pausar';
      }
      if (type === 'end') {
        if (toggleBtn) toggleBtn.textContent = 'Pausar';
        if (progEl) progEl.textContent = 'Terminado';
        setTimeout(function () {
          if (!speaking) {
            bar.hidden = true;
            document.body.classList.remove('has-speech-bar');
          }
        }, 2200);
      }
      if (type === 'stop') {
        if (progEl) progEl.textContent = '';
        bar.hidden = true;
        document.body.classList.remove('has-speech-bar');
      }
    });
  }

  function init() {
    if (!supported) {
      try {
        document.querySelectorAll('[data-action^="listen"]').forEach(function (b) { b.hidden = true; });
        var note = document.getElementById('speechUnsupported');
        if (note) note.hidden = false;
      } catch (e) {}
      return;
    }
    loadPrefs();
    try { synth.onvoiceschanged = refreshVoices; } catch (e) {}
    refreshVoices();
    setTimeout(refreshVoices, 400);
    initBar();
    window.addEventListener('beforeunload', function () { try { synth.cancel(); } catch (e) {} });
  }

  function on(fn) { if (typeof fn === 'function') handlers.push(fn); }

  RL.speech = {
    supported: supported,
    init: init,
    speak: speak,
    pause: pause,
    resume: resume,
    stop: stop,
    toggle: toggle,
    on: on,
    setVoice: setVoice,
    setRate: setRate,
    getVoices: function () { return voices.slice(); },
    currentVoice: function () { return voice; },
    getRate: function () { return rate; },
    isSpeaking: function () { return speaking; },
    isPaused: function () { return paused; },
    buildViewText: buildViewText,
    buildPlanScript: buildPlanScript,
    chunk: chunk,
    clean: clean
  };
})();

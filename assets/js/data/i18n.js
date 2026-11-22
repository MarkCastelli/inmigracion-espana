/* ============================================================
   Ruta Legal · idiomas de interfaz
   Fase 1: navegación, portada y avisos legales.
   El contenido legal detallado se traduce por fases y con revisión.
   ============================================================ */
(function () {
  'use strict';
  var RL = window.RL = window.RL || {};
  var KEY = 'ruta-legal.lang';
  var LANGS = [
    { id: 'es', label: 'Español' },
    { id: 'ar', label: 'العربية', dir: 'rtl' },
    { id: 'fr', label: 'Français' },
    { id: 'en', label: 'English' },
    { id: 'ro', label: 'Română' }
  ];

  var STR = {
    es: {
      tagline: 'España, paso a paso',
      free: 'Gratis',
      private: 'Privado',
      tooltips: 'Ayudas',
      nav: {
        inicio: 'Inicio', antes: 'Experiencia', formulario: 'Formulario', plan: 'Plan', vias: 'Vías', tramites: 'Trámites',
        online: 'Online', preguntas: 'FAQ', derechos: 'Derechos',
        directorio: 'Dónde ir', abogados: 'Abogados', consulta: 'IA', docs: 'Docs',
        formularios: 'Descargas', ayuda: 'Ayuda', donar: 'Donar'
      },
      heroEyebrow: "Informe para tu abogado · España · 100 % gratuito",
      heroTitle: "Prepara tu caso, ordena tus datos y llévalo a un profesional.",
      heroLead: "Es gratis y privado. Completa el formulario y generaremos un informe descargable con tus datos, familia, residencia, trabajo, salud y objetivos. No evaluamos tu caso ni decidimos qué vía te corresponde: la información queda a tu disposición para que la revises con un abogado o entidad y decidas con quién.",
      start: "Crear mi informe",
      routes: 'Ver las vías disponibles',
      demo: "Ver un informe de ejemplo →",
      wizard: { step: 'Paso {n} de {total}', back: 'Atrás', next: 'Continuar', finish: "Ver mi informe", save: 'Guardar y salir' },
      noticeTitle: "Esto es información, no asesoramiento jurídico.",
      noticeText: "No evaluamos tu caso, no decidimos qué vía te corresponde y no garantizamos una concesión. Ordenamos tus datos para que los revise un profesional. Antes de presentar nada, confirma en la fuente oficial y consulta con un abogado de extranjería o una entidad social. <a href=\"#/ayuda\" data-nav=\"ayuda\">Ver recursos gratuitos y aviso legal</a>.",
      langNoticeTitle: 'Interfaz en español',
      langNoticeText: 'Los campos del formulario se traducen al cambiar de idioma. Las fichas legales largas y el PDF siguen en español para que los revise un abogado o entidad española. Puedes usar la traducción del navegador para el resto del texto, pero no para el informe final.'
    },
    ar: {
      tagline: 'إسبانيا، خطوة بخطوة',
      free: 'مجاني',
      private: 'خاص',
      tooltips: 'مساعدة',
      nav: {
        inicio: 'الرئيسية', antes: 'تجربتي', formulario: 'النموذج', plan: 'خطتي', vias: 'المسارات', tramites: 'الإجراءات',
        online: 'عبر الإنترنت', preguntas: 'الأسئلة', derechos: 'الحقوق',
        directorio: 'أين أذهب', consulta: 'استشارة الذكاء الاصطناعي', docs: 'الوثائق',
        formularios: 'التنزيلات', ayuda: 'المساعدة', donar: 'تبرع'
      },
      heroEyebrow: "تقرير لمحاميك · إسبانيا · مجاني 100٪",
      heroTitle: "جهّز ملفك ورتّب بياناتك واعرضها على مختص.",
      heroLead: "الخدمة مجانية وخاصة. أكمل النموذج لننشئ تقريرًا قابلًا للتنزيل يتضمن بياناتك وعائلتك وإقامتك وعملك وصحتك وأهدافك. نحن لا نقيّم حالتك ولا نقرر المسار المناسب لك؛ نضع المعلومات مرتبة بين يديك لتراجعها مع محامٍ أو جهة وتقرر مع من تتابع.",
      start: "إنشاء تقريري",
      routes: 'عرض المسارات المتاحة',
      demo: "عرض نموذج تقرير ←",
      wizard: { step: 'الخطوة {n} من {total}', back: 'رجوع', next: 'متابعة', finish: "عرض تقريري", save: 'حفظ وخروج' },
      noticeTitle: "هذه معلومات وليست استشارة قانونية.",
      noticeText: "نحن لا نقيّم حالتك ولا نقرر المسار المناسب لك ولا نضمن الموافقة. نرتّب بياناتك ليراجعها مختص. قبل تقديم أي طلب تحقق من المصدر الرسمي واستشر محامي هجرة أو جهة اجتماعية. <a href=\"#/ayuda\" data-nav=\"ayuda\">موارد مجانية والإشعار القانوني</a>.",
      langNoticeTitle: 'الواجهة بالعربية',
      langNoticeText: 'الأدلة والبطاقات القانونية التفصيلية لا تزال بالإسبانية. يمكنك استخدام ترجمة المتصفح للنصوص الطويلة، لكن لا تستخدمها إذا كان التقرير يعرض بيانات شخصية.'
    },
    fr: {
      tagline: "L'Espagne, pas à pas",
      free: 'Gratuit',
      private: 'Privé',
      tooltips: 'Aides',
      nav: {
        inicio: 'Accueil', antes: 'Expérience', formulario: 'Formulaire', plan: 'Plan', vias: 'Voies', tramites: 'Démarches',
        online: 'En ligne', preguntas: 'FAQ', derechos: 'Droits',
        directorio: 'Où aller', abogados: 'Avocats', consulta: 'IA', docs: 'Docs',
        formularios: 'Téléchargements', ayuda: 'Aide', donar: 'Faire un don'
      },
      heroEyebrow: "Rapport pour votre avocat · Espagne · 100 % gratuit",
      heroTitle: "Préparez votre dossier, organisez vos données et présentez-les à un professionnel.",
      heroLead: "C'est gratuit et privé. Remplissez le formulaire et nous générerons un rapport téléchargeable avec vos données, votre famille, votre séjour, votre travail, votre santé et vos objectifs. Nous n'évaluons pas votre situation et nous ne choisissons pas la voie pour vous : les informations sont mises à votre disposition pour les examiner avec un avocat ou une association et décider avec qui avancer.",
      start: "Créer mon rapport",
      routes: 'Voir les voies disponibles',
      demo: "Voir un exemple de rapport →",
      wizard: { step: 'Étape {n} sur {total}', back: 'Retour', next: 'Continuer', finish: "Voir mon rapport", save: 'Enregistrer et sortir' },
      noticeTitle: "Ce sont des informations, pas un conseil juridique.",
      noticeText: "Nous n'évaluons pas votre situation, nous ne choisissons pas la voie et nous ne garantissons pas une décision favorable. Nous organisons vos données pour qu'un professionnel les examine. Avant de déposer quoi que ce soit, vérifiez la source officielle et consultez un avocat en immigration ou une association. <a href=\"#/ayuda\" data-nav=\"ayuda\">Ressources gratuites et mentions légales</a>.",
      langNoticeTitle: "Interface en français",
      langNoticeText: "Les champs du formulaire sont traduits. Les fiches juridiques longues et le PDF restent en espagnol pour être relus par un professionnel espagnol. Vous pouvez utiliser la traduction du navigateur pour le reste, mais pas pour le rapport final."
    },
    en: {
      tagline: 'Spain, step by step',
      free: 'Free',
      private: 'Private',
      tooltips: 'Help',
      nav: {
        inicio: 'Home', antes: 'Experience', formulario: 'Form', plan: 'Plan', vias: 'Routes', tramites: 'Procedures',
        online: 'Online', preguntas: 'FAQ', derechos: 'Rights',
        directorio: 'Where to go', abogados: 'Lawyers', consulta: 'AI', docs: 'Docs',
        formularios: 'Downloads', ayuda: 'Help', donar: 'Donate'
      },
      heroEyebrow: "Report for your lawyer · Spain · 100% free",
      heroTitle: "Prepare your case, organise your data and take it to a professional.",
      heroLead: "It is free and private. Complete the form and we will generate a downloadable report with your details, family, residence, work, health and goals. We do not assess your case or decide which route applies to you: the information is made available for you to review with a lawyer or organisation and decide who to work with.",
      start: "Create my report",
      routes: 'See available routes',
      demo: "See a sample report →",
      wizard: { step: 'Step {n} of {total}', back: 'Back', next: 'Continue', finish: "See my report", save: 'Save and exit' },
      noticeTitle: "This is information, not legal advice.",
      noticeText: "We do not assess your case, decide your route or guarantee a successful application. We organise your data for a professional to review. Before submitting anything, check the official source and consult an immigration lawyer or social organisation. <a href=\"#/ayuda\" data-nav=\"ayuda\">Free resources and legal notice</a>.",
      langNoticeTitle: 'Interface in English',
      langNoticeText: 'Form fields are translated. Long legal guides and the PDF remain in Spanish so a Spanish lawyer or organisation can review them. You can use browser translation for the rest, but not for the final report.'
    },
    ro: {
      tagline: 'Spania, pas cu pas',
      free: 'Gratuit',
      private: 'Privat',
      tooltips: 'Ajutor',
      nav: {
        inicio: 'Acasă', antes: 'Experiență', formulario: 'Formular', plan: 'Plan', vias: 'Căi', tramites: 'Proceduri',
        online: 'Online', preguntas: 'FAQ', derechos: 'Drepturi',
        directorio: 'Unde mergi', abogados: 'Avocați', consulta: 'IA', docs: 'Docs',
        formularios: 'Descărcări', ayuda: 'Ajutor', donar: 'Donează'
      },
      heroEyebrow: "Raport pentru avocatul tău · Spania · 100% gratuit",
      heroTitle: "Pregătește-ți cazul, organizează-ți datele și du-le la un profesionist.",
      heroLead: "Este gratuit și privat. Completează formularul și vom genera un raport descărcabil cu datele tale, familia, șederea, munca, sănătatea și obiectivele. Nu evaluăm cazul tău și nu decidem ce cale ți se potrivește: informațiile sunt puse la dispoziție pentru a le revizui cu un avocat sau o organizație și a decide cu cine mergi mai departe.",
      start: "Creează raportul meu",
      routes: 'Vezi căile disponibile',
      demo: "Vezi un raport exemplu →",
      wizard: { step: 'Pasul {n} din {total}', back: 'Înapoi', next: 'Continuă', finish: "Vezi raportul meu", save: 'Salvează și ieși' },
      noticeTitle: "Acestea sunt informații, nu consultanță juridică.",
      noticeText: "Nu evaluăm cazul tău, nu decidem calea și nu garantăm o soluție favorabilă. Organizăm datele pentru ca un profesionist să le examineze. Înainte de a depune ceva, verifică sursa oficială și consultă un avocat de imigrare sau o organizație socială. <a href=\"#/ayuda\" data-nav=\"ayuda\">Resurse gratuite și aviz legal</a>.",
      langNoticeTitle: 'Interfață în română',
      langNoticeText: 'Ghidurile și fișele juridice detaliate sunt încă în spaniolă. Poți folosi traducerea browserului pentru textele lungi, dar nu dacă raportul conține date personale.'
    }
  };

  var active = '';
  function current() {
    if (active && STR[active]) return active;
    try {
      if (typeof URLSearchParams !== 'undefined') {
        var fromUrl = new URLSearchParams(location.search || '').get('lang');
        if (fromUrl && STR[fromUrl]) return fromUrl;
      }
    } catch (e) {}
    var saved = '';
    try { saved = localStorage.getItem(KEY) || ''; } catch (e) {}
    return STR[saved] ? saved : 'es';
  }

  function t(key) {
    var parts = String(key || '').split('.');
    var node = STR[current()] || STR.es;
    for (var i = 0; i < parts.length; i++) node = node && node[parts[i]];
    if (node == null) {
      node = STR.es;
      for (var j = 0; j < parts.length; j++) node = node && node[parts[j]];
    }
    return node == null ? '' : node;
  }

  function textNode(el, value) {
    if (!el || value == null) return;
    var target = null;
    var fallback = null;
    if (el.childNodes) {
      for (var i = 0; i < el.childNodes.length; i++) {
        var node = el.childNodes[i];
        if (node.nodeType !== 3) continue;
        fallback = node;
        if (/\S/.test(node.nodeValue || '')) { target = node; break; }
      }
    }
    target = target || fallback;
    if (target) {
      target.nodeValue = value;
      return;
    }
    el.textContent = value;
  }

  function byId(id) {
    return document.getElementById ? document.getElementById(id) : document.querySelector('#' + id);
  }

  function apply() {
    var lang = current();
    var s = STR[lang] || STR.es;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    var sel = byId('langSelect');
    if (sel) sel.value = lang;
    var main = byId('main');
    if (main) main.setAttribute('lang', 'es');

    document.querySelectorAll('.nav__link[data-nav]').forEach(function (b) {
      var k = b.getAttribute('data-nav');
      if (s.nav[k]) b.textContent = s.nav[k];
    });
    var tagline = document.querySelector('.brand__text small');
    if (tagline) tagline.textContent = s.tagline;
    var free = document.querySelector('.pill--free');
    if (free) free.textContent = s.free;
    var priv = document.querySelector('.pill--private .pill__label');
    if (priv) priv.textContent = s.private;
    var tipLabel = byId('tooltipsToggleLabel');
    if (tipLabel) tipLabel.textContent = s.tooltips || 'Ayudas';

    var eyebrow = document.querySelector('.hero .eyebrow');
    if (eyebrow) eyebrow.textContent = s.heroEyebrow;
    var title = byId('t-inicio');
    if (title) title.innerHTML = s.heroTitle;
    var lead = document.querySelector('.hero .lead');
    if (lead) lead.textContent = s.heroLead;
    var start = byId('startBtn');
    if (start) textNode(start, ' ' + s.start + ' ');
    document.querySelectorAll('.hero__cta [data-nav="vias"]').forEach(function (b) { b.textContent = s.routes; });
    var demo = document.querySelector('[data-action="demo"]');
    if (demo) demo.textContent = s.demo;
    var prev = byId('prevBtn');
    if (prev) prev.textContent = s.wizard.back;
    var save = byId('saveExitBtn');
    if (save) save.textContent = s.wizard.save;
    var stepLabel = byId('wizardStepLabel');
    if (stepLabel && /Paso\s+\d+\s+de\s+\d+/.test(stepLabel.textContent || '')) {
      var m = String(stepLabel.textContent).match(/Paso\s+(\d+)\s+de\s+(\d+)/);
      stepLabel.textContent = s.wizard.step.replace('{n}', m[1]).replace('{total}', m[2]);
    }
    var next = byId('nextBtn');
    if (next && /Continuar|Ver mi plan/.test(next.textContent || '')) {
      next.textContent = next.textContent.indexOf('Ver mi plan') !== -1 ? s.wizard.finish : s.wizard.next;
    }

    var notice = document.querySelector('.notice-strip');
    if (notice) {
      var strong = notice.querySelector('strong');
      var p = notice.querySelector('p');
      if (strong) strong.textContent = s.noticeTitle;
      if (p) p.innerHTML = s.noticeText;
    }

    var ln = byId('langNotice');
    if (ln) {
      if (lang === 'es') {
        ln.hidden = true;
        ln.innerHTML = '';
      } else {
        ln.hidden = false;
        ln.innerHTML = '<strong>' + s.langNoticeTitle + '</strong><p>' + s.langNoticeText + '</p>';
      }
    }
  }

  function setLang(lang) {
    if (!STR[lang]) lang = 'es';
    active = lang;
    try { localStorage.setItem(KEY, lang); } catch (e) {}
    try {
      if (typeof history !== 'undefined' && history.replaceState && typeof URL !== 'undefined') {
        var url = new URL(location.href);
        url.searchParams.set('lang', lang);
        history.replaceState(null, '', url.pathname + url.search + url.hash);
      }
    } catch (e) {}
    apply();
    if (typeof window.dispatchEvent === 'function' && typeof window.CustomEvent === 'function') {
      window.dispatchEvent(new window.CustomEvent('rl:langchange', { detail: { lang: lang } }));
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    var sel = byId('langSelect');
    if (sel) {
      LANGS.forEach(function (l) {
        if (l.id === 'es') return; // Español ya está en el HTML estático.
        var o = document.createElement('option');
        o.value = l.id;
        o.textContent = l.label;
        sel.appendChild(o);
      });
      sel.value = current();
      sel.addEventListener('change', function () { setLang(sel.value); });
    }
    apply();
  });

  RL.i18n = { langs: LANGS, t: t, apply: apply, setLang: setLang, current: current };
})();

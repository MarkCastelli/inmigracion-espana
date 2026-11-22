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
      nav: {
        inicio: 'Inicio', plan: 'Mi plan', vias: 'Vías', tramites: 'Trámites',
        online: 'Online', preguntas: 'Preguntas', derechos: 'Derechos',
        directorio: 'Dónde ir', consulta: 'Consulta IA', docs: 'Documentos',
        formularios: 'Formularios', ayuda: 'Ayuda'
      },
      heroEyebrow: 'Diagnóstico migratorio · España · 100 % gratuito',
      heroTitle: 'Tu camino hacia una situación legal en España, <em>claro y paso a paso</em>.',
      heroLead: 'Es gratis, es privado y no te pedimos nada. Responde unas preguntas y te diremos qué vías legales encajan contigo, qué te falta, qué documentos necesitas y qué hacer primero. Si ya tienes papeles (NIE, tarjeta roja, hoja blanca, certificado digital…), los tendremos en cuenta para no repetir pasos.',
      start: 'Empezar mi diagnóstico',
      routes: 'Ver las vías disponibles',
      demo: 'Ver un plan de ejemplo →',
      noticeTitle: 'Esto es una ayuda, no asesoramiento jurídico.',
      noticeText: 'No garantizamos que sea ni el mejor ni el único camino: hacemos lo posible por acercarnos a tu caso, pero la normativa cambia y cada expediente tiene matices. Antes de presentar nada, confirma en la fuente oficial y consulta con un abogado de extranjería o una entidad social. <a href="#/ayuda" data-nav="ayuda">Ver recursos gratuitos y aviso legal</a>.',
      langNoticeTitle: 'Interfaz en español',
      langNoticeText: 'Las guías y fichas legales detalladas están en español. La traducción completa se está preparando por fases.'
    },
    ar: {
      tagline: 'إسبانيا، خطوة بخطوة',
      free: 'مجاني',
      private: 'خاص',
      nav: {
        inicio: 'الرئيسية', plan: 'خطتي', vias: 'المسارات', tramites: 'الإجراءات',
        online: 'عبر الإنترنت', preguntas: 'الأسئلة', derechos: 'الحقوق',
        directorio: 'أين أذهب', consulta: 'استشارة الذكاء الاصطناعي', docs: 'الوثائق',
        formularios: 'النماذج', ayuda: 'المساعدة'
      },
      heroEyebrow: 'تشخيص الهجرة · إسبانيا · مجاني 100٪',
      heroTitle: 'طريقك إلى وضع قانوني في إسبانيا، <em>بوضوح وخطوة بخطوة</em>.',
      heroLead: 'مجاني وخاص ولا نطلب منك أي شيء. أجب عن بعض الأسئلة لنوضح لك المسارات القانونية التي تناسبك، وما ينقصك، والوثائق التي تحتاجها، وما يجب فعله أولاً. إذا كانت لديك وثائق (NIE، البطاقة الحمراء، الورقة البيضاء، الشهادة الرقمية…)، سنأخذها في الحسبان.',
      start: 'ابدأ تشخيصي',
      routes: 'عرض المسارات المتاحة',
      demo: 'عرض خطة نموذجية ←',
      noticeTitle: 'هذه مساعدة، وليست استشارة قانونية.',
      noticeText: 'لا نضمن أن يكون هذا أفضل طريق أو الطريق الوحيد. نعمل على الاقتراب من حالتك، لكن القواعد تتغير ولكل ملف تفاصيله. قبل تقديم أي شيء، تحقق من المصدر الرسمي واستشر محامي هجرة أو جهة اجتماعية. <a href="#/ayuda" data-nav="ayuda">الموارد المجانية والإشعار القانوني</a>.',
      langNoticeTitle: 'الواجهة بالعربية',
      langNoticeText: 'الأدلة والبطاقات القانونية التفصيلية لا تزال بالإسبانية. تجري الترجمة الكاملة على مراحل.'
    },
    fr: {
      tagline: "L'Espagne, pas à pas",
      free: 'Gratuit',
      private: 'Privé',
      nav: {
        inicio: 'Accueil', plan: 'Mon plan', vias: 'Voies', tramites: 'Démarches',
        online: 'En ligne', preguntas: 'Questions', derechos: 'Droits',
        directorio: 'Où aller', consulta: 'Consultation IA', docs: 'Documents',
        formularios: 'Formulaires', ayuda: 'Aide'
      },
      heroEyebrow: "Diagnostic migratoire · Espagne · 100 % gratuit",
      heroTitle: "Votre chemin vers une situation légale en Espagne, <em>clair et pas à pas</em>.",
      heroLead: "C'est gratuit, privé et nous ne vous demandons rien. Répondez à quelques questions et nous vous indiquerons les voies légales qui vous correspondent, ce qui vous manque, les documents nécessaires et ce qu'il faut faire en premier. Si vous avez déjà des documents (NIE, carte rouge, feuille blanche, certificat numérique…), nous en tiendrons compte.",
      start: 'Commencer mon diagnostic',
      routes: 'Voir les voies disponibles',
      demo: 'Voir un exemple de plan →',
      noticeTitle: "Ceci est une aide, pas un conseil juridique.",
      noticeText: "Nous ne garantissons pas que ce soit la meilleure ou la seule voie : nous faisons de notre mieux pour nous approcher de votre cas, mais la norme change et chaque dossier a ses nuances. Avant de présenter quoi que ce soit, vérifiez la source officielle et consultez un avocat en immigration ou une association. <a href=\"#/ayuda\" data-nav=\"ayuda\">Ressources gratuites et mentions légales</a>.",
      langNoticeTitle: "Interface en français",
      langNoticeText: "Les guides et fiches juridiques détaillés sont encore en espagnol. La traduction complète se fera par étapes."
    },
    en: {
      tagline: 'Spain, step by step',
      free: 'Free',
      private: 'Private',
      nav: {
        inicio: 'Home', plan: 'My plan', vias: 'Routes', tramites: 'Procedures',
        online: 'Online', preguntas: 'Questions', derechos: 'Rights',
        directorio: 'Where to go', consulta: 'AI consultation', docs: 'Documents',
        formularios: 'Forms', ayuda: 'Help'
      },
      heroEyebrow: 'Immigration assessment · Spain · 100% free',
      heroTitle: 'Your path to a legal status in Spain, <em>clear and step by step</em>.',
      heroLead: 'It is free, private and we ask you for nothing. Answer a few questions and we will show you the legal routes that fit you, what you are missing, which documents you need and what to do first. If you already have documents (NIE, red card, white sheet, digital certificate…), we will take them into account.',
      start: 'Start my assessment',
      routes: 'See available routes',
      demo: 'See a sample plan →',
      noticeTitle: 'This is help, not legal advice.',
      noticeText: 'We do not guarantee that this is the best or the only route: we do our best to get close to your case, but rules change and every file has nuances. Before submitting anything, check the official source and consult an immigration lawyer or a social organisation. <a href="#/ayuda" data-nav="ayuda">Free resources and legal notice</a>.',
      langNoticeTitle: 'Interface in English',
      langNoticeText: 'Detailed legal guides and cards are still in Spanish. Full translation is being prepared in stages.'
    },
    ro: {
      tagline: 'Spania, pas cu pas',
      free: 'Gratuit',
      private: 'Privat',
      nav: {
        inicio: 'Acasă', plan: 'Planul meu', vias: 'Căi', tramites: 'Proceduri',
        online: 'Online', preguntas: 'Întrebări', derechos: 'Drepturi',
        directorio: 'Unde să mergi', consulta: 'Consultație IA', docs: 'Documente',
        formularios: 'Formulare', ayuda: 'Ajutor'
      },
      heroEyebrow: 'Evaluare migratorie · Spania · 100% gratuit',
      heroTitle: 'Drumul tău către o situație legală în Spania, <em>clar și pas cu pas</em>.',
      heroLead: 'Este gratuit, privat și nu îți cerem nimic. Răspunde la câteva întrebări și îți vom arăta căile legale care ți se potrivesc, ce îți lipsește, ce documente ai nevoie și ce trebuie făcut mai întâi. Dacă ai deja documente (NIE, cardul roșu, foaia albă, certificatul digital…), le vom lua în considerare.',
      start: 'Începe evaluarea',
      routes: 'Vezi căile disponibile',
      demo: 'Vezi un plan exemplu →',
      noticeTitle: 'Acesta este un ajutor, nu consultanță juridică.',
      noticeText: 'Nu garantăm că este cea mai bună sau singura cale: facem tot posibilul să ne apropiem de cazul tău, dar normele se schimbă și fiecare dosar are nuanțe. Înainte de a depune ceva, verifică sursa oficială și consultă un avocat de imigrare sau o organizație socială. <a href="#/ayuda" data-nav="ayuda">Resurse gratuite și aviz legal</a>.',
      langNoticeTitle: 'Interfață în română',
      langNoticeText: 'Ghidurile și fișele juridice detaliate sunt încă în spaniolă. Traducerea completă se face pe etape.'
    }
  };

  function current() {
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
    if (el.childNodes && el.childNodes.length) {
      for (var i = 0; i < el.childNodes.length; i++) {
        if (el.childNodes[i].nodeType === 3) {
          el.childNodes[i].nodeValue = value;
          return;
        }
      }
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

    document.querySelectorAll('.nav__link[data-nav]').forEach(function (b) {
      var k = b.getAttribute('data-nav');
      if (s.nav[k]) b.textContent = s.nav[k];
    });
    var tagline = document.querySelector('.brand__text small');
    if (tagline) tagline.textContent = s.tagline;
    var free = document.querySelector('.pill--free');
    if (free) free.textContent = s.free;
    var priv = document.querySelector('.pill--private');
    if (priv) textNode(priv, ' ' + s.private);

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
    try { localStorage.setItem(KEY, lang); } catch (e) {}
    apply();
    if (typeof window.dispatchEvent === 'function' && typeof window.CustomEvent === 'function') {
      window.dispatchEvent(new window.CustomEvent('rl:langchange', { detail: { lang: lang } }));
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    var sel = byId('langSelect');
    if (sel) {
      LANGS.forEach(function (l) {
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

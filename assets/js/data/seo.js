/* ============================================================
   Ruta Legal · SEO por sección
   Títulos, descripciones, palabras clave, Open Graph y JSON-LD.
   ============================================================ */
(function () {
  'use strict';
  var RL = window.RL = window.RL || {};
  var BASE = 'https://markcastelli.github.io/inmigracion-espana/';

  var META = {
    inicio: {
      title: 'Ruta Legal | Residencia, arraigo y nacionalidad en España',
      description: 'Guía gratuita y privada para inmigrantes en España: residencia, arraigo, nacionalidad, asilo, reagrupación familiar, trámites, ayudas y entidades. Prepara tu caso para un abogado.',
      keywords: 'inmigración España, extranjería, residencia en España, arraigo, nacionalidad española, TIE, NIE, asilo, reagrupación familiar, visados'
    },
    antes: {
      title: 'Mi experiencia: inmigrar a España sin idealizarlo | Ruta Legal',
      description: 'Testimonio personal sobre vivir en España: trabajo, alquiler, burocracia, sanidad, educación, discriminación y costes. Una visión realista antes de emigrar.',
      keywords: 'vivir en España, inmigrar a España, experiencia inmigrante, trabajo en España, alquiler España, coste de vida, Galicia'
    },
    diagnostico: {
      title: 'Diagnóstico de residencia en España | Ruta Legal',
      description: 'Responde unas preguntas y ordena tu caso: residencia, arraigo, nacionalidad, asilo, familia, trabajo y documentos. Informe gratuito para revisar con un abogado.',
      keywords: 'diagnóstico extranjería, residencia España, arraigo, nacionalidad, asilo, reagrupación familiar'
    },
    plan: {
      title: 'Informe de tu caso para un abogado | Ruta Legal',
      description: 'Hechos, fechas, familia, documentos y dudas en un informe claro para llevar a un abogado de extranjería. Sin veredicto legal ni promesas.',
      keywords: 'informe extranjería, abogado de extranjería, preparar consulta, documentos residencia'
    },
    vias: {
      title: 'Vías de residencia y nacionalidad en España | Ruta Legal',
      description: 'Catálogo de residencia, visados, nacionalidad y protección internacional, con requisitos, plazos y documentos.',
      keywords: 'vías de residencia, visados España, nacionalidad española, asilo, arraigo, reagrupación'
    },
    tramites: {
      title: 'Trámites de extranjería en España | Ruta Legal',
      description: 'Guías paso a paso: NIE, TIE, empadronamiento, nacionalidad, extranjería, DGT, homologación y documentos.',
      keywords: 'trámites extranjería, NIE, TIE, empadronamiento, nacionalidad, homologación, DGT'
    },
    online: {
      title: 'Sedes y trámites online de extranjería | Ruta Legal',
      description: 'Mercurio, sede de Extranjería, Xunta y comunidades, Registro Civil, Registro General del Estado, Cl@ve, DEHú y modelos EX.',
      keywords: 'trámites online extranjería, Mercurio, sede Xunta, registro electrónico, Registro Civil, modelos EX'
    },
    preguntas: {
      title: 'Preguntas sobre inmigración en España | Ruta Legal',
      description: 'Respuestas claras sobre arraigo, asilo, trabajo, nacionalidad, familia, ayudas, discapacidad, empadronamiento y estafas.',
      keywords: 'preguntas inmigración, arraigo, asilo, nacionalidad, trabajo sin papeles, empadronamiento'
    },
    derechos: {
      title: 'Derechos y ayudas para inmigrantes | Ruta Legal',
      description: 'Discapacidad, dependencia, menores, escolarización, libros, comedor, ayudas y entidades de apoyo por comunidad.',
      keywords: 'ayudas inmigrantes, discapacidad, dependencia, escolarización, libros, comedor, derechos'
    },
    directorio: {
      title: 'Entidades y oficinas de extranjería | Ruta Legal',
      description: 'Direcciones y webs de Extranjería, Policía, Seguridad Social, SEPE, Registro Civil, ayuntamientos y asociaciones de ayuda.',
      keywords: 'directorio extranjería, oficina de extranjería, asociaciones inmigrantes, servicios sociales'
    },
    consulta: {
      title: 'Prepara tu consulta de extranjería | Ruta Legal',
      description: 'Genera un prompt con tu caso para consultar con una IA o preparar la consulta con un abogado, sin enviar datos automáticamente.',
      keywords: 'consulta extranjería, abogado, preparar consulta, IA'
    },
    docs: {
      title: 'Documentos para tu expediente | Ruta Legal',
      description: 'Checklist de documentos para residencia, arraigo, nacionalidad, familia, trabajo y trámites de extranjería.',
      keywords: 'documentos extranjería, checklist, residencia, arraigo, nacionalidad'
    },
    formularios: {
      title: 'Formularios EX y tasas de extranjería | Ruta Legal',
      description: 'Modelos EX, tasas 790 y formularios oficiales para solicitudes y renovaciones de extranjería.',
      keywords: 'formularios EX, EX-10, EX-31, tasas 790, extranjería'
    },
    ayuda: {
      title: 'Ayuda, recursos y aviso legal | Ruta Legal',
      description: 'Recursos oficiales, entidades, canales de YouTube, glosario, preguntas frecuentes, bulos y aviso legal.',
      keywords: 'ayuda inmigrantes, recursos, ONG, YouTube, aviso legal'
    }
  };

  function ensureMeta(selector, attrs) {
    var el = document.head.querySelector(selector);
    if (!el) {
      el = document.createElement('meta');
      Object.keys(attrs).forEach(function (k) { el.setAttribute(k, attrs[k]); });
      document.head.appendChild(el);
    }
    return el;
  }

  function setMeta(name, content) {
    var el = ensureMeta('meta[name="' + name + '"]', { name: name });
    el.setAttribute('content', content);
  }

  function setProp(property, content) {
    var el = ensureMeta('meta[property="' + property + '"]', { property: property });
    el.setAttribute('content', content);
  }

  function apply(view) {
    var m = META[view] || META.inicio;
    document.title = m.title;
    setMeta('description', m.description);
    setMeta('keywords', m.keywords);
    setMeta('robots', 'index, follow, max-image-preview:large');
    var lang = (RL.i18n && RL.i18n.current()) || 'es';
    var locales = { es: 'es_ES', ar: 'ar_AR', fr: 'fr_FR', en: 'en_US', ro: 'ro_RO' };
    setProp('og:locale', locales[lang] || 'es_ES');
    setProp('og:title', m.title);
    setProp('og:description', m.description);
    setProp('og:url', BASE + (view === 'inicio' ? '' : '#/' + view));
    setProp('og:type', 'website');
    setMeta('twitter:title', m.title);
    setMeta('twitter:description', m.description);
    var canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', BASE + (view === 'inicio' ? '' : '#/' + view));

    var page = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: m.title,
      description: m.description,
      url: BASE + (view === 'inicio' ? '' : '#/' + view),
      inLanguage: lang,
      isPartOf: { '@type': 'WebSite', name: 'Ruta Legal', url: BASE }
    };
    var ld = document.getElementById ? document.getElementById('seoJsonLd') : document.querySelector('#seoJsonLd');
    if (!ld) {
      ld = document.createElement('script');
      ld.id = 'seoJsonLd';
      ld.type = 'application/ld+json';
      document.head.appendChild(ld);
    }
    ld.textContent = JSON.stringify(page);
  }

  if (typeof window.addEventListener === 'function') {
    window.addEventListener('rl:langchange', function () {
      if (RL.ui && RL.ui.state) apply(RL.ui.state.view || 'inicio');
    });
  }

  RL.seo = { apply: apply, meta: META, base: BASE };
})();

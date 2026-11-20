/* ============================================================
   Ruta Legal · países y datos que afectan a las vías
   - dos: nacionalidad por residencia en 2 años (art. 22 CC)
   - ue:  ciudadanía de la Unión / EEE
   - visa: exención de visado Schengen para estancias cortas
           true = exento · false = necesita visado · null = verificar
   ============================================================ */
(function () {
  'use strict';
  var RL = window.RL = window.RL || {};

  /* prettier-ignore */
  RL.countries = [
    // ── América Latina ──────────────────────────────────────────
    { c: 'AR', n: 'Argentina',            r: 'latam', dos: true,  ue: false, visa: true  },
    { c: 'BO', n: 'Bolivia',              r: 'latam', dos: true,  ue: false, visa: false },
    { c: 'BR', n: 'Brasil',               r: 'latam', dos: true,  ue: false, visa: true  },
    { c: 'CL', n: 'Chile',                r: 'latam', dos: true,  ue: false, visa: true  },
    { c: 'CO', n: 'Colombia',             r: 'latam', dos: true,  ue: false, visa: true  },
    { c: 'CR', n: 'Costa Rica',           r: 'latam', dos: true,  ue: false, visa: true  },
    { c: 'CU', n: 'Cuba',                 r: 'latam', dos: true,  ue: false, visa: false },
    { c: 'DO', n: 'República Dominicana', r: 'latam', dos: true,  ue: false, visa: false },
    { c: 'EC', n: 'Ecuador',              r: 'latam', dos: true,  ue: false, visa: false },
    { c: 'SV', n: 'El Salvador',          r: 'latam', dos: true,  ue: false, visa: true  },
    { c: 'GT', n: 'Guatemala',            r: 'latam', dos: true,  ue: false, visa: true  },
    { c: 'HN', n: 'Honduras',             r: 'latam', dos: true,  ue: false, visa: true  },
    { c: 'MX', n: 'México',               r: 'latam', dos: true,  ue: false, visa: true  },
    { c: 'NI', n: 'Nicaragua',            r: 'latam', dos: true,  ue: false, visa: true  },
    { c: 'PA', n: 'Panamá',               r: 'latam', dos: true,  ue: false, visa: true  },
    { c: 'PY', n: 'Paraguay',             r: 'latam', dos: true,  ue: false, visa: true  },
    { c: 'PE', n: 'Perú',                 r: 'latam', dos: true,  ue: false, visa: true  },
    { c: 'UY', n: 'Uruguay',              r: 'latam', dos: true,  ue: false, visa: true  },
    { c: 'VE', n: 'Venezuela',            r: 'latam', dos: true,  ue: false, visa: true  },
    { c: 'HT', n: 'Haití',                r: 'latam', dos: true,  ue: false, visa: false },
    { c: 'BZ', n: 'Belice',               r: 'latam', dos: true,  ue: false, visa: true  },

    // ── Península ibérica y vínculos históricos ────────────────
    { c: 'ES', n: 'España',               r: 'ue',    dos: true,  ue: true,  visa: true  },
    { c: 'PT', n: 'Portugal',             r: 'ue',    dos: true,  ue: true,  visa: true  },
    { c: 'AD', n: 'Andorra',              r: 'eu',    dos: true,  ue: false, visa: true  },
    { c: 'PH', n: 'Filipinas',            r: 'asia',  dos: true,  ue: false, visa: false },
    { c: 'GQ', n: 'Guinea Ecuatorial',    r: 'africa',dos: true,  ue: false, visa: false },

    // ── Unión Europea / EEE / Suiza ────────────────────────────
    { c: 'DE', n: 'Alemania',             r: 'ue',    ue: true,  visa: true },
    { c: 'AT', n: 'Austria',              r: 'ue',    ue: true,  visa: true },
    { c: 'BE', n: 'Bélgica',              r: 'ue',    ue: true,  visa: true },
    { c: 'BG', n: 'Bulgaria',             r: 'ue',    ue: true,  visa: true },
    { c: 'CY', n: 'Chipre',               r: 'ue',    ue: true,  visa: true },
    { c: 'HR', n: 'Croacia',              r: 'ue',    ue: true,  visa: true },
    { c: 'DK', n: 'Dinamarca',            r: 'ue',    ue: true,  visa: true },
    { c: 'SK', n: 'Eslovaquia',           r: 'ue',    ue: true,  visa: true },
    { c: 'SI', n: 'Eslovenia',            r: 'ue',    ue: true,  visa: true },
    { c: 'EE', n: 'Estonia',              r: 'ue',    ue: true,  visa: true },
    { c: 'FI', n: 'Finlandia',            r: 'ue',    ue: true,  visa: true },
    { c: 'FR', n: 'Francia',              r: 'ue',    ue: true,  visa: true },
    { c: 'GR', n: 'Grecia',               r: 'ue',    ue: true,  visa: true },
    { c: 'HU', n: 'Hungría',              r: 'ue',    ue: true,  visa: true },
    { c: 'IE', n: 'Irlanda',              r: 'ue',    ue: true,  visa: true },
    { c: 'IT', n: 'Italia',               r: 'ue',    ue: true,  visa: true },
    { c: 'LV', n: 'Letonia',              r: 'ue',    ue: true,  visa: true },
    { c: 'LT', n: 'Lituania',             r: 'ue',    ue: true,  visa: true },
    { c: 'LU', n: 'Luxemburgo',           r: 'ue',    ue: true,  visa: true },
    { c: 'MT', n: 'Malta',                r: 'ue',    ue: true,  visa: true },
    { c: 'NL', n: 'Países Bajos',         r: 'ue',    ue: true,  visa: true },
    { c: 'PL', n: 'Polonia',              r: 'ue',    ue: true,  visa: true },
    { c: 'CZ', n: 'República Checa',      r: 'ue',    ue: true,  visa: true },
    { c: 'RO', n: 'Rumanía',              r: 'ue',    ue: true,  visa: true },
    { c: 'SE', n: 'Suecia',               r: 'ue',    ue: true,  visa: true },
    { c: 'NO', n: 'Noruega',              r: 'eea',   ue: true,  visa: true },
    { c: 'IS', n: 'Islandia',             r: 'eea',   ue: true,  visa: true },
    { c: 'LI', n: 'Liechtenstein',        r: 'eea',   ue: true,  visa: true },
    { c: 'CH', n: 'Suiza',                r: 'eea',   ue: true,  visa: true },
    { c: 'GB', n: 'Reino Unido',          r: 'eu',    ue: false, visa: true  },

    // ── Europa no UE ───────────────────────────────────────────
    { c: 'UA', n: 'Ucrania',              r: 'eu',    ue: false, visa: true  },
    { c: 'RU', n: 'Rusia',                r: 'eu',    ue: false, visa: false },
    { c: 'MD', n: 'Moldavia',             r: 'eu',    ue: false, visa: true  },
    { c: 'RS', n: 'Serbia',               r: 'eu',    ue: false, visa: true  },
    { c: 'AL', n: 'Albania',              r: 'eu',    ue: false, visa: true  },
    { c: 'BA', n: 'Bosnia y Herzegovina', r: 'eu',    ue: false, visa: true  },
    { c: 'GE', n: 'Georgia',              r: 'eu',    ue: false, visa: true  },
    { c: 'TR', n: 'Turquía',              r: 'eu',    ue: false, visa: false },

    // ── África ─────────────────────────────────────────────────
    { c: 'MA', n: 'Marruecos',            r: 'africa', ue: false, visa: false },
    { c: 'DZ', n: 'Argelia',              r: 'africa', ue: false, visa: false },
    { c: 'TN', n: 'Túnez',                r: 'africa', ue: false, visa: false },
    { c: 'SN', n: 'Senegal',              r: 'africa', ue: false, visa: false },
    { c: 'NG', n: 'Nigeria',              r: 'africa', ue: false, visa: false },
    { c: 'ML', n: 'Malí',                 r: 'africa', ue: false, visa: false },
    { c: 'GH', n: 'Ghana',                r: 'africa', ue: false, visa: false },
    { c: 'CM', n: 'Camerún',              r: 'africa', ue: false, visa: false },
    { c: 'CD', n: 'República Democrática del Congo', r: 'africa', ue: false, visa: false },

    // ── Asia y Oceanía ────────────────────────────────────────
    { c: 'CN', n: 'China',                r: 'asia', ue: false, visa: false },
    { c: 'IN', n: 'India',                r: 'asia', ue: false, visa: false },
    { c: 'PK', n: 'Pakistán',             r: 'asia', ue: false, visa: false },
    { c: 'BD', n: 'Bangladés',            r: 'asia', ue: false, visa: false },
    { c: 'JP', n: 'Japón',                r: 'asia', ue: false, visa: true  },
    { c: 'KR', n: 'Corea del Sur',        r: 'asia', ue: false, visa: true  },
    { c: 'US', n: 'Estados Unidos',       r: 'otro', ue: false, visa: true  },
    { c: 'CA', n: 'Canadá',               r: 'otro', ue: false, visa: true  },
    { c: 'AU', n: 'Australia',            r: 'otro', ue: false, visa: true  },
    { c: 'NZ', n: 'Nueva Zelanda',        r: 'otro', ue: false, visa: true  },
    { c: 'IL', n: 'Israel',               r: 'otro', ue: false, visa: true  },
    { c: 'OT', n: 'Otro país',            r: 'otro', ue: false, visa: null  }
  ];

  RL.countryByCode = function (code) {
    for (var i = 0; i < RL.countries.length; i++) {
      if (RL.countries[i].c === code) return RL.countries[i];
    }
    return null;
  };
  RL.countryName = function (code) {
    var c = RL.countryByCode(code);
    return c ? c.n : (code || '');
  };
  RL.countryIsDosAnios = function (code) {
    var c = RL.countryByCode(code);
    return !!(c && c.dos);
  };
  RL.countryNeedsVisa = function (code) {
    var c = RL.countryByCode(code);
    return c ? c.visa : null;
  };
})();

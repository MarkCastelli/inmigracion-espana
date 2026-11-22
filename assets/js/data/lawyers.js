/* Ruta Legal · carga del directorio de abogados desde JSON.
   La base editable está en assets/js/data/lawyers.json.
   Campos públicos: id, demo, nombre, estudio, matricula, colegio, email,
   telefono, whatsapp, web, citas, domicilio, ciudad, provincia, horario,
   especialidad, idiomas, mensaje.
   En el archivo único dist se inyecta window.__RL_LAWYERS__ desde build.py. */
(function () {
  'use strict';
  var RL = window.RL = window.RL || {};

  RL.lawyers = [];
  RL.lawyersLoaded = false;
  RL.lawyersLoading = false;
  RL.lawyersError = '';

  RL.loadLawyers = function () {
    if (RL.lawyersLoaded) return Promise.resolve(RL.lawyers);
    if (Array.isArray(window.__RL_LAWYERS__)) {
      RL.lawyers = window.__RL_LAWYERS__;
      RL.lawyersLoaded = true;
      return Promise.resolve(RL.lawyers);
    }
    if (typeof fetch !== 'function') {
      RL.lawyersError = 'No se pudo cargar la base de datos.';
      return Promise.resolve([]);
    }
    return fetch('assets/js/data/lawyers.json', { cache: 'no-store' })
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (data) {
        RL.lawyers = Array.isArray(data) ? data : [];
        RL.lawyersLoaded = true;
        RL.lawyersError = '';
        return RL.lawyers;
      })
      .catch(function () {
        RL.lawyers = [];
        RL.lawyersLoaded = true;
        RL.lawyersError = 'No se pudo cargar la base de datos de abogados.';
        return [];
      });
  };
})();

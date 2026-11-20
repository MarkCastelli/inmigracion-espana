/* ============================================================
   Ruta Legal · comunidades autónomas, provincias y servicios
   ============================================================ */
(function () {
  'use strict';
  var RL = window.RL = window.RL || {};

  /* prettier-ignore */
  RL.regions = [
    { id:'andalucia', name:'Andalucía', provinces:['Almería','Cádiz','Córdoba','Granada','Huelva','Jaén','Málaga','Sevilla'],
      portal:'https://www.juntadeandalucia.es/', health:'https://www.sspa.juntadeandalucia.es/', healthName:'Servicio Andaluz de Salud',
      education:'https://www.juntadeandalucia.es/educacion/', social:'https://www.juntadeandalucia.es/', employment:'https://www.juntadeandalucia.es/', localLabel:'Ayuntamiento', regionLabel:'Junta de Andalucía' },
    { id:'aragon', name:'Aragón', provinces:['Huesca','Teruel','Zaragoza'],
      portal:'https://www.aragon.es/', health:'https://www.aragon.es/', healthName:'Salud Aragón',
      education:'https://www.aragon.es/', social:'https://www.aragon.es/', employment:'https://www.aragon.es/', localLabel:'Ayuntamiento', regionLabel:'Gobierno de Aragón' },
    { id:'asturias', name:'Principado de Asturias', provinces:['Asturias'],
      portal:'https://www.asturias.es/', health:'https://www.astursalud.es/', healthName:'SESPA',
      education:'https://www.educastur.es/', social:'https://www.asturias.es/', employment:'https://www.asturias.es/', localLabel:'Ayuntamiento', regionLabel:'Principado de Asturias' },
    { id:'baleares', name:'Illes Balears', provinces:['Illes Balears'],
      portal:'https://www.caib.es/', health:'https://www.ibsalut.es/', healthName:'IB-Salut',
      education:'https://www.caib.es/', social:'https://www.caib.es/', employment:'https://www.caib.es/', localLabel:'Ajuntament', regionLabel:'Govern de les Illes Balears' },
    { id:'canarias', name:'Canarias', provinces:['Las Palmas','Santa Cruz de Tenerife'],
      portal:'https://www.gobiernodecanarias.org/', health:'https://www3.gobiernodecanarias.org/sanidad/scs/', healthName:'Servicio Canario de la Salud',
      education:'https://www.gobiernodecanarias.org/educacion/', social:'https://www.gobiernodecanarias.org/', employment:'https://www.gobiernodecanarias.org/', localLabel:'Ayuntamiento', regionLabel:'Gobierno de Canarias' },
    { id:'cantabria', name:'Cantabria', provinces:['Cantabria'],
      portal:'https://www.cantabria.es/', health:'https://www.scsalud.es/', healthName:'SCS',
      education:'https://www.educantabria.es/', social:'https://www.cantabria.es/', employment:'https://www.cantabria.es/', localLabel:'Ayuntamiento', regionLabel:'Gobierno de Cantabria' },
    { id:'castillalamancha', name:'Castilla-La Mancha', provinces:['Albacete','Ciudad Real','Cuenca','Guadalajara','Toledo'],
      portal:'https://www.castillalamancha.es/', health:'https://sanidad.castillalamancha.es/', healthName:'SESCAM',
      education:'https://www.educa.jccm.es/', social:'https://www.castillalamancha.es/', employment:'https://www.castillalamancha.es/', localLabel:'Ayuntamiento', regionLabel:'Junta de Comunidades de Castilla-La Mancha' },
    { id:'castillayleon', name:'Castilla y León', provinces:['Ávila','Burgos','León','Palencia','Salamanca','Segovia','Soria','Valladolid','Zamora'],
      portal:'https://www.jcyl.es/', health:'https://www.saludcastillayleon.es/', healthName:'Sacyl',
      education:'https://www.educa.jcyl.es/', social:'https://www.jcyl.es/', employment:'https://www.jcyl.es/', localLabel:'Ayuntamiento', regionLabel:'Junta de Castilla y León' },
    { id:'cataluna', name:'Cataluña', provinces:['Barcelona','Girona','Lleida','Tarragona'],
      portal:'https://web.gencat.cat/', health:'https://catsalut.gencat.cat/', healthName:'CatSalut',
      education:'https://educacio.gencat.cat/', social:'https://web.gencat.cat/', employment:'https://web.gencat.cat/', localLabel:'Ajuntament', regionLabel:'Generalitat de Catalunya' },
    { id:'extremadura', name:'Extremadura', provinces:['Badajoz','Cáceres'],
      portal:'https://www.juntaex.es/', health:'https://saludextremadura.ses.es/', healthName:'Servicio Extremeño de Salud',
      education:'https://www.educarex.es/', social:'https://www.juntaex.es/', employment:'https://www.juntaex.es/', localLabel:'Ayuntamiento', regionLabel:'Junta de Extremadura' },
    { id:'galicia', name:'Galicia', provinces:['A Coruña','Lugo','Ourense','Pontevedra'],
      portal:'https://www.xunta.gal/', health:'https://www.sergas.gal/', healthName:'SERGAS',
      education:'https://www.edu.xunta.gal/', social:'https://www.xunta.gal/politica-social', employment:'https://conselleriaemprego.xunta.gal/', localLabel:'Concello', regionLabel:'Xunta de Galicia' },
    { id:'larioja', name:'La Rioja', provinces:['La Rioja'],
      portal:'https://www.larioja.org/', health:'https://www.riojasalud.es/', healthName:'Rioja Salud',
      education:'https://www.larioja.org/educacion/', social:'https://www.larioja.org/', employment:'https://www.larioja.org/', localLabel:'Ayuntamiento', regionLabel:'Gobierno de La Rioja' },
    { id:'madrid', name:'Comunidad de Madrid', provinces:['Madrid'],
      portal:'https://www.comunidad.madrid/', health:'https://www.comunidad.madrid/servicios/salud', healthName:'SERMAS',
      education:'https://www.comunidad.madrid/servicios/educacion', social:'https://www.comunidad.madrid/servicios/asuntos-sociales', employment:'https://www.comunidad.madrid/', localLabel:'Ayuntamiento', regionLabel:'Comunidad de Madrid' },
    { id:'murcia', name:'Región de Murcia', provinces:['Murcia'],
      portal:'https://www.carm.es/', health:'https://www.murciasalud.es/', healthName:'Servicio Murciano de Salud',
      education:'https://www.carm.es/', social:'https://www.carm.es/', employment:'https://www.carm.es/', localLabel:'Ayuntamiento', regionLabel:'Comunidad Autónoma de la Región de Murcia' },
    { id:'navarra', name:'Navarra', provinces:['Navarra'],
      portal:'https://www.navarra.es/', health:'https://www.navarra.es/es/salud', healthName:'Servicio Navarro de Salud',
      education:'https://www.navarra.es/es/educacion', social:'https://www.navarra.es/', employment:'https://www.navarra.es/', localLabel:'Ayuntamiento', regionLabel:'Gobierno de Navarra' },
    { id:'paisvasco', name:'País Vasco', provinces:['Álava','Gipuzkoa','Bizkaia'],
      portal:'https://www.euskadi.eus/', health:'https://www.osakidetza.euskadi.eus/', healthName:'Osakidetza',
      education:'https://www.euskadi.eus/educacion/', social:'https://www.euskadi.eus/', employment:'https://www.euskadi.eus/', localLabel:'Udala', regionLabel:'Gobierno Vasco' },
    { id:'valencia', name:'Comunitat Valenciana', provinces:['Alicante','Castellón','Valencia'],
      portal:'https://www.gva.es/', health:'https://www.san.gva.es/', healthName:'Conselleria de Sanitat',
      education:'https://www.gva.es/', social:'https://www.gva.es/', employment:'https://www.gva.es/', localLabel:'Ajuntament', regionLabel:'Generalitat Valenciana' },
    { id:'ceuta', name:'Ceuta', provinces:['Ceuta'],
      portal:'https://www.ceuta.es/', health:'https://www.ceuta.es/', healthName:'Servicio de Salud de Ceuta',
      education:'https://www.ceuta.es/', social:'https://www.ceuta.es/', employment:'https://www.ceuta.es/', localLabel:'Ayuntamiento', regionLabel:'Ciudad de Ceuta' },
    { id:'melilla', name:'Melilla', provinces:['Melilla'],
      portal:'https://www.melilla.es/', health:'https://www.melilla.es/', healthName:'Servicio de Salud de Melilla',
      education:'https://www.melilla.es/', social:'https://www.melilla.es/', employment:'https://www.melilla.es/', localLabel:'Ayuntamiento', regionLabel:'Ciudad de Melilla' }
  ];

  var map = {};
  RL.provinces = [];
  RL.regions.forEach(function (r) {
    r.provinces.forEach(function (p) {
      map[p] = r;
      RL.provinces.push(p);
    });
  });

  RL.regionByProvince = function (province) {
    return map[province] || null;
  };
  RL.regionById = function (id) {
    for (var i = 0; i < RL.regions.length; i++) if (RL.regions[i].id === id) return RL.regions[i];
    return null;
  };
})();

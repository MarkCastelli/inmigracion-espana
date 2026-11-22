/* ============================================================
   Ruta Legal · Formulario guiado 0-11
   Estado propio, separado del diagnóstico antiguo.
   ============================================================ */
(function () {
  'use strict';
  var RL = window.RL = window.RL || {};

  var YESNO = [
    { v: '', l: 'Sin indicar' }, { v: 'si', l: 'Sí' }, { v: 'no', l: 'No' }, { v: 'dontknow', l: 'No lo sé' }
  ];
  var RESIDENCE = [
    { v: '', l: 'Sin indicar' },
    { v: 'irregular', l: 'Irregular / sin autorización' },
    { v: 'temporal', l: 'Residencia temporal' },
    { v: 'estudios', l: 'Residencia por estudios' },
    { v: 'trabajo_estudios', l: 'Residencia por trabajo y estudios' },
    { v: 'cuenta_ajena', l: 'Residencia por cuenta ajena' },
    { v: 'cuenta_propia', l: 'Residencia por cuenta propia' },
    { v: 'familiar', l: 'Residencia como familiar' },
    { v: 'larga_duracion', l: 'Residencia de larga duración' },
    { v: 'asilo', l: 'Solicitante o beneficiario de asilo' },
    { v: 'otra', l: 'Otra situación' },
    { v: 'dontknow', l: 'No lo sé' }
  ];
  var DOCS = [
    { v: 'pasaporte', l: 'Pasaporte de tu país' },
    { v: 'pasaporte_ue', l: 'Pasaporte europeo' },
    { v: 'nie', l: 'Número de NIE' },
    { v: 'tie', l: 'Tarjeta TIE' },
    { v: 'blanca', l: 'Tarjeta blanca' },
    { v: 'roja', l: 'Tarjeta roja' },
    { v: 'seguridad_social', l: 'Tarjeta de la Seguridad Social' },
    { v: 'debito', l: 'Tarjeta de débito' },
    { v: 'digital', l: 'Certificado digital' },
    { v: 'clave', l: 'Cl@ve' },
    { v: 'clave360', l: 'Cl@ve 360' }
  ];
  var AID_TYPES = [
    { v: 'alimentos', l: 'Alimentos' },
    { v: 'economica', l: 'Ayuda económica' },
    { v: 'alquiler', l: 'Alquiler' },
    { v: 'luz', l: 'Luz' },
    { v: 'agua', l: 'Agua' },
    { v: 'gas', l: 'Gas o bombona' },
    { v: 'ropa', l: 'Ropa' },
    { v: 'colegio', l: 'Material escolar' },
    { v: 'comedor', l: 'Comedor escolar' },
    { v: 'salud', l: 'Salud o medicamentos' },
    { v: 'otra', l: 'Otra' }
  ];
  var AID_WHO = [
    { v: 'ayuntamiento', l: 'Ayuntamiento / servicios sociales' },
    { v: 'comunidad', l: 'Comunidad autónoma' },
    { v: 'ong', l: 'ONG o asociación' },
    { v: 'caritas', l: 'Cáritas' },
    { v: 'cruz_roja', l: 'Cruz Roja' },
    { v: 'familia', l: 'Familia o amistades' },
    { v: 'iglesia', l: 'Iglesia o parroquia' },
    { v: 'otra', l: 'Otra' }
  ];
  var GOALS = [
    { v: 'nie', l: 'Obtener el NIE' },
    { v: 'tie', l: 'Obtener o renovar la TIE' },
    { v: 'residencia', l: 'Obtener residencia' },
    { v: 'larga_duracion', l: 'Residencia de larga duración' },
    { v: 'estudios', l: 'Residencia por estudios' },
    { v: 'trabajo_estudios', l: 'Residencia por trabajo y estudios' },
    { v: 'cuenta_ajena', l: 'Trabajo por cuenta ajena' },
    { v: 'cuenta_propia', l: 'Trabajo por cuenta propia' },
    { v: 'nacionalidad', l: 'Nacionalidad española' },
    { v: 'reagrupacion', l: 'Reagrupar a mi familia' },
    { v: 'asilo', l: 'Asilo o protección internacional' },
    { v: 'arraigo', l: 'Arraigo' },
    { v: 'renovar', l: 'Renovar un permiso' },
    { v: 'abogado', l: 'Asesoría legal' },
    { v: 'otra', l: 'Otra' }
  ];

  function person() {
    return {
      name: '', age: '', nationality: '', phone: '', email: '', entryDate: '', familyAbroad: '', bringFamily: '',
      disability: '', residence: '', works: '', legalJob: '', hours: '', netSalary: '', bank: '',
      jobType: '', studies: '', career: '',
      paysHousing: '',
      disabilityRecognized: '', disabilityDegree: '', disabilityExpiryStatus: '', disabilityExpiry: '', dependency: '',
      docs: [], asylumRequested: '', asylumYear: '', asylumStatus: '', asylumDate: '',
      housing: '', housingCost: '', mortgage: '', mortgageAmount: '',
      expenses: { luz: '', agua: '', gas: '', comunidad: '', internet: '' },
      computer: '', education: '', educationLevel: '', aidReceived: '', aidTypes: [], aidWho: [], aidDetail: '', goals: []
    };
  }

  function blank() {
    var out = {
      step: 0,
      mode: '',
      familyCount: 1,
      members: [],
      applicant: person(),
      spouse: person(),
      children: [],
      commonGoalsOn: false,
      commonGoals: [],
      print: { applicant: true, spouse: true, children: true, disability: true, aid: true, housing: true, goals: true, economy: true },
      notes: ''
    };
    out.applicant.paysHousing = 'si';
    return out;
  }

  RL.formulario = {
    blank: blank,
    person: person,
    yesNo: YESNO,
    residence: RESIDENCE,
    docs: DOCS,
    aidTypes: AID_TYPES,
    aidWho: AID_WHO,
    goals: GOALS
  };
})();

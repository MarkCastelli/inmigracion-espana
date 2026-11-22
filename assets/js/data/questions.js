/* ============================================================
   Ruta Legal · cuestionario (esquema declarativo)
   Cada campo: { id, type, label, help, required, showIf, options }
   Los valores se guardan en RL.state.profile
   ============================================================ */
(function () {
  'use strict';
  var RL = window.RL = window.RL || {};
  var inSpain = function (p) { return p.location === 'spain'; };
  var childTotal = function (p) {
    var hasNew = p.childrenCommon != null || p.childrenOwn != null || p.childrenPartner != null;
    var sum = (Number(p.childrenCommon) || 0) + (Number(p.childrenOwn) || 0) + (Number(p.childrenPartner) || 0);
    return hasNew ? sum : (Number(p.childrenCount) || 0);
  };
  var hasKids = function (p) { return childTotal(p) > 0; };
  var couple = function (p) { return p.maritalStatus === 'casado' || p.maritalStatus === 'pareja_registrada' || p.maritalStatus === 'pareja_estable'; };
  var spanishChild = function (p) { return hasKids(p) && (p.childrenSpanish === 'yes' || p.childrenSpanish === 'some'); };
  var ownSpanishChild = function (p) { return spanishChild(p) && p.spanishChildType !== 'partner'; };
  var hasAncestry = function (p) { return p.ancestry && p.ancestry !== 'none' && p.ancestry !== 'dontknow'; };
  var notStudent = function (p) { return p.employment && p.employment !== 'student' && p.employment !== 'retired' && p.employment !== 'none'; };
  var owns = function (p, k) {
    return (Array.isArray(p.docsBase) && p.docsBase.indexOf(k) !== -1) ||
      (Array.isArray(p.docsTramites) && p.docsTramites.indexOf(k) !== -1);
  };
  var ownsCurrent = function (p, k) {
    return Array.isArray(p.docsEnCurso) && p.docsEnCurso.indexOf(k) !== -1;
  };
  var hasAsylumDoc = function (p) { return owns(p, 'cita_asilo') || owns(p, 'hoja_blanca') || owns(p, 'tarjeta_roja') || ownsCurrent(p, 'cita_asilo') || ownsCurrent(p, 'hoja_blanca') || ownsCurrent(p, 'tarjeta_roja'); };
  var asylumHistory = function (p) { return ['solicitado', 'admitido', 'concedido', 'denegado', 'renunciado', 'desistido'].indexOf(p.asylumStage) !== -1; };
  var postAsylumPath = function (p) { return ['renunciado', 'desistido', 'denegado'].indexOf(p.asylumStage) !== -1; };
  var hasResidenceNow = function (p) {
    return p.residenceApproved === 'yes' || owns(p, 'tie') || owns(p, 'tarjeta_ue') ||
      ['studies', 'work', 'family', 'eu_family', 'longterm', 'residencia_temporal', 'expired'].indexOf(p.permitStatus) !== -1;
  };
  var permitExpiringSoon = function (p) {
    if (!p.permitExpiry) return false;
    var days = RL.dates.diff(RL.dates.today(), p.permitExpiry);
    return days != null && days <= 60;
  };

  RL.questions = {
    steps: [
      /* ───────────────────────── 1 ───────────────────────── */
      {
        id: 'yo',
        title: 'Sobre ti y tu familia',
        intro: 'Empezamos por lo básico. Estos datos son los que más cambian el resultado: tu nacionalidad, tu edad, dónde estás y con quién vives. Aquí cargas pareja, hijos y otras personas que conviven contigo; las preguntas de salud posteriores son solo sobre ti.',
        fields: [
          {
            id: 'nationality', type: 'country', label: '¿Cuál es tu nacionalidad?', required: true,
            help: 'La nacionalidad que tienes ahora. Si tienes dos, elige la del pasaporte con el que entraste o piensas entrar.'
          },
          {
            id: 'age', type: 'number', label: '¿Cuántos años tienes?', required: true, min: 0, max: 110, placeholder: 'Ej. 34',
            help: 'Si eres menor de 18 años, el plan cambia por completo: te explicaremos las opciones de tutela y de nacionalidad.'
          },
          {
            id: 'location', type: 'radio', label: '¿Dónde estás ahora?', required: true,
            options: [
              { v: 'spain', l: 'En España', h: 'Vivo o estoy aquí ahora mismo' },
              { v: 'origin', l: 'En mi país de origen', h: 'Todavía no he venido' },
              { v: 'other', l: 'En otro país', h: 'Ni en España ni en mi país' }
            ]
          },
          {
            id: 'province', type: 'select', label: '¿En qué provincia estás?', showIf: inSpain,
            options: (RL.provinces || []).map(function (pr) {
              var r = RL.regionByProvince ? RL.regionByProvince(pr) : null;
              return { v: pr, l: pr + (r ? ' · ' + r.name : '') };
            }),
            help: 'Sirve para mostrarte la oficina de extranjería, el centro de salud y el ayuntamiento de tu zona.'
          },
          {
            id: 'municipality', type: 'text', label: '¿En qué municipio o ciudad?', showIf: inSpain,
            placeholder: 'Ej. Vigo',
            help: 'Con esto adaptamos el directorio: concello, ayuntamiento, centro de salud…'
          },
          {
            id: 'householdSize', type: 'number', label: '¿Con cuántas personas vives, sin incluirte tú?', min: 0, max: 19, placeholder: 'Ej. 3',
            help: 'Incluye pareja, hijos y cualquier familiar o amigo que conviva. No te cuentes a ti. Con este número calculamos cuántas fichas familiares mostrarte.'
          },
          {
            id: 'maritalStatus', type: 'select', label: '¿Cuál es tu situación real de pareja?',
            options: [
              { v: 'soltero', l: 'Soltero/a, sin pareja' },
              { v: 'casado', l: 'Casado/a' },
              { v: 'pareja_registrada', l: 'Pareja de hecho registrada' },
              { v: 'pareja_estable', l: 'Pareja estable o concubinato (sin registrar)' },
              { v: 'divorciado', l: 'Separado/a o divorciado/a' },
              { v: 'viudo', l: 'Viudo/a' },
              { v: 'dontknow', l: 'No lo sé / prefiero no decirlo' }
            ],
            help: 'No es lo mismo estar casado, ser pareja registrada o convivir sin registrar. Para extranjería importa el vínculo legal y la convivencia, no solo cómo lo llaméis.'
          },
          {
            id: 'marriageType', type: 'select', label: 'Si estás casado/a, ¿qué tipo de matrimonio?', showIf: function (p) { return p.maritalStatus === 'casado'; },
            options: [
              { v: 'civil', l: 'Matrimonio civil' },
              { v: 'religious', l: 'Matrimonio religioso sin inscripción civil' },
              { v: 'both', l: 'Civil y religioso' },
              { v: 'dontknow', l: 'No lo sé' }
            ],
            help: 'Para la vía familiar se suele exigir matrimonio civil o inscrito. Un matrimonio solo religioso puede necesitar inscripción en el Registro Civil.'
          },
          {
            id: 'childrenCommon', type: 'number', label: 'Hijos comunes con tu pareja actual', min: 0, max: 12, placeholder: '0', showIf: couple,
            help: 'Hijos biológicos o adoptados de los dos. No los cuentes también en los otros bloques.'
          },
          {
            id: 'childrenOwn', type: 'number', label: 'Hijos solo tuyos', min: 0, max: 12, placeholder: '0',
            help: 'Hijos de una relación anterior, reconocidos solo por ti o que no son hijos de tu pareja actual. Si no tienes pareja, cuenta aquí todos tus hijos.'
          },
          {
            id: 'childrenPartner', type: 'number', label: 'Hijos solo de tu pareja (no tuyos)', min: 0, max: 12, placeholder: '0', showIf: couple,
            help: 'Hijos de tu pareja con otra persona. Conviven o no, pero no son hijos tuyos. No los mezcles con los comunes.'
          },
          {
            id: 'childrenSpanish', type: 'radio', label: '¿Alguno de los hijos es español o hijo/a de un progenitor español?', showIf: hasKids,
            options: [
              { v: 'no', l: 'No' },
              { v: 'yes', l: 'Sí, todos' },
              { v: 'some', l: 'Alguno' },
              { v: 'dontknow', l: 'No lo sé' }
            ],
            help: 'Un hijo español abre la vía de residencia como familiar de español, pero solo si es tu hijo o hijo común; el hijo solo de tu pareja no te da esa vía.'
          },
          {
            id: 'spanishChildType', type: 'select', label: 'Ese hijo/a español, ¿qué vínculo tiene contigo?', showIf: spanishChild,
            options: [
              { v: 'common', l: 'Hijo común de mi pareja y mío' },
              { v: 'own', l: 'Hijo solo mío' },
              { v: 'partner', l: 'Hijo solo de mi pareja (no mío)' },
              { v: 'mixed', l: 'Hay varios casos' },
              { v: 'dontknow', l: 'No lo sé' }
            ],
            help: 'Si es solo de tu pareja, no puedes usar la vía de progenitor de menor español. Si hay varios, marca «varios casos» y explícalo en notas.'
          },
          {
            id: 'spouseSpanish', type: 'radio', label: '¿Tu pareja es española?', showIf: couple,
            options: [{ v: 'yes', l: 'Sí' }, { v: 'no', l: 'No' }, { v: 'dontknow', l: 'No lo sé' }]
          },
          {
            id: 'spouseInSpain', type: 'radio', label: '¿Tu pareja está en España?', showIf: couple,
            options: [{ v: 'yes', l: 'Sí' }, { v: 'no', l: 'No' }, { v: 'dontknow', l: 'No lo sé' }]
          },
          {
            id: 'spouseStatus', type: 'select', label: '¿Cuál es su situación?', showIf: function (p) { return couple(p) && p.spouseInSpain === 'yes'; },
            options: [
              { v: 'spanish', l: 'Es española' },
              { v: 'eu', l: 'Es de otro país de la UE' },
              { v: 'resident', l: 'Tiene residencia en España' },
              { v: 'studies', l: 'Tiene permiso de estudios' },
              { v: 'irregular', l: 'Está en situación irregular' },
              { v: 'asylum', l: 'Tiene protección internacional o asilo' },
              { v: 'dontknow', l: 'No lo sé' }
            ]
          },
          {
            id: 'cohabitation', type: 'select', label: '¿Cuánto tiempo lleváis conviviendo?', showIf: couple,
            options: [
              { v: '12plus', l: '12 meses o más' },
              { v: 'less12', l: 'Menos de 12 meses' },
              { v: 'no', l: 'No convivimos' },
              { v: 'dontknow', l: 'No lo sé' }
            ],
            help: 'Para la pareja estable no registrada se piden 12 meses de convivencia, salvo que tengáis un hijo en común.'
          },
          {
            id: 'partnerDisability', type: 'radio', label: 'Sobre tu pareja: ¿tiene alguna discapacidad?', showIf: couple,
            options: [{ v: 'no', l: 'No' }, { v: 'yes', l: 'Sí' }, { v: 'in_progress', l: 'En trámite' }, { v: 'dontknow', l: 'No lo sé' }],
            help: 'No es sobre ti. La discapacidad de tu pareja puede afectar a la reagrupación, la dependencia y las ayudas familiares.'
          },
          {
            id: 'partnerDisabilityRecognized', type: 'select', label: 'Sobre tu pareja: ¿está reconocida?',
            showIf: function (p) { return couple(p) && (p.partnerDisability === 'yes' || p.partnerDisability === 'in_progress'); },
            options: [
              { v: 'yes', l: 'Sí, reconocida' },
              { v: 'in_progress', l: 'En trámite' },
              { v: 'no', l: 'No está reconocida' },
              { v: 'dontknow', l: 'No lo sé' }
            ]
          },
          {
            id: 'partnerDisabilityDegree', type: 'select', label: 'Sobre tu pareja: ¿qué grado tiene?',
            showIf: function (p) { return couple(p) && p.partnerDisabilityRecognized === 'yes'; },
            options: [
              { v: '33_44', l: 'Del 33 % al 44 %' },
              { v: '45_64', l: 'Del 45 % al 64 %' },
              { v: '65_mas', l: '65 % o más' },
              { v: 'dontknow', l: 'No lo sé' }
            ]
          },
          {
            id: 'partnerDisabilityExpiry', type: 'date', label: 'Sobre tu pareja: ¿cuándo vence el certificado? (opcional)',
            showIf: function (p) { return couple(p) && p.partnerDisabilityRecognized === 'yes'; },
            help: 'Si no caduca o no lo sabes, déjalo vacío.'
          },
          {
            id: 'partnerDependency', type: 'radio', label: 'Sobre tu pareja: ¿tiene reconocida la dependencia?', showIf: couple,
            options: [{ v: 'no', l: 'No' }, { v: 'yes', l: 'Sí' }, { v: 'in_progress', l: 'En trámite' }, { v: 'dontknow', l: 'No lo sé' }]
          },
          {
            id: 'pregnant', type: 'radio', label: '¿Hay un embarazo en curso (tú o tu pareja)?', showIf: inSpain,
            options: [{ v: 'no', l: 'No' }, { v: 'yes', l: 'Sí' }, { v: 'dontknow', l: 'No lo sé' }],
            help: 'El embarazo no regulariza por sí solo. Sirve para explicarte qué pasa con la nacionalidad y la residencia del hijo.'
          },
          {
            id: 'pregnantBySpanish', type: 'radio', label: '¿El otro progenitor es español?', showIf: function (p) { return inSpain(p) && p.pregnant === 'yes'; },
            options: [{ v: 'yes', l: 'Sí' }, { v: 'no', l: 'No' }, { v: 'dontknow', l: 'No lo sé' }]
          },
          {
            id: 'childRecognized', type: 'radio', label: '¿El progenitor español ha reconocido al hijo/a?', showIf: ownSpanishChild,
            options: [{ v: 'yes', l: 'Sí' }, { v: 'no', l: 'No' }, { v: 'dontknow', l: 'No lo sé' }],
            help: 'Si no hay reconocimiento, la nacionalidad española del hijo no está resuelta; puede hacer falta filiación judicial.'
          },
          {
            id: 'childLivesWithYou', type: 'radio', label: '¿El hijo/a español vive contigo?', showIf: ownSpanishChild,
            options: [{ v: 'yes', l: 'Sí' }, { v: 'no', l: 'No' }, { v: 'compartida', l: 'Custodia compartida' }, { v: 'dontknow', l: 'No lo sé' }],
            help: 'La vía del progenitor exige que el menor esté a tu cargo y conviva contigo, o que cumplas tus obligaciones.'
          },
          {
            id: 'childSupport', type: 'radio', label: '¿Estás al corriente de las obligaciones (alimentos, visitas)?', showIf: function (p) { return ownSpanishChild(p) && p.childLivesWithYou === 'no'; },
            options: [{ v: 'yes', l: 'Sí' }, { v: 'no', l: 'No' }, { v: 'dontknow', l: 'No lo sé' }]
          },
          {
            id: 'childrenDisability', type: 'radio', label: 'Sobre los hijos: ¿alguno de los que conviven contigo tiene discapacidad?', showIf: hasKids,
            options: [{ v: 'no', l: 'No' }, { v: 'yes', l: 'Sí, alguno' }, { v: 'in_progress', l: 'En trámite' }, { v: 'dontknow', l: 'No lo sé' }],
            help: 'Incluye a los hijos solo de tu pareja que conviven contigo, aunque no sean hijos tuyos. No marques aquí tu propia discapacidad.'
          },
          {
            id: 'childrenDisabilityRecognized', type: 'select', label: 'Sobre ese hijo/a: ¿está reconocida?',
            showIf: function (p) { return hasKids(p) && (p.childrenDisability === 'yes' || p.childrenDisability === 'in_progress'); },
            options: [
              { v: 'yes', l: 'Sí, reconocida' },
              { v: 'in_progress', l: 'En trámite' },
              { v: 'no', l: 'No está reconocida' },
              { v: 'dontknow', l: 'No lo sé' }
            ]
          },
          {
            id: 'childrenDisabilityDegree', type: 'select', label: 'Sobre ese hijo/a: ¿qué grado tiene?',
            showIf: function (p) { return hasKids(p) && p.childrenDisabilityRecognized === 'yes'; },
            options: [
              { v: '33_44', l: 'Del 33 % al 44 %' },
              { v: '45_64', l: 'Del 45 % al 64 %' },
              { v: '65_mas', l: '65 % o más' },
              { v: 'dontknow', l: 'No lo sé' }
            ],
            help: 'Si hay más de un hijo con discapacidad, indica el grado más alto y detállalos en la ficha de cada hijo.'
          },
          {
            id: 'childrenDisabilityExpiry', type: 'date', label: 'Sobre ese hijo/a: ¿cuándo vence el certificado? (opcional)',
            showIf: function (p) { return hasKids(p) && p.childrenDisabilityRecognized === 'yes'; },
            help: 'Si no caduca o no lo sabes, déjalo vacío.'
          },
          {
            id: 'householdOthers', type: 'number', label: '¿Cuántas personas más conviven contigo, además de tu pareja e hijos?', min: 0, max: 20, placeholder: '0',
            help: 'Ejemplo: tu madre, un hermano, un amigo. Sirve para valorar la unidad familiar y los medios.'
          },
          {
            id: 'householdDetails', type: 'textarea', label: '¿Quiénes son y qué necesitan? (opcional)', showIf: function (p) { return Number(p.householdOthers) > 0; },
            placeholder: 'Ej. mi madre de 70 años, depende de mí; un hermano de 19 años que estudia; el hijo de mi pareja de 8 años con discapacidad.',
            help: 'Nombre, edad, relación, si tienen discapacidad o dependencia y si dependen económicamente de ti. Se guarda solo en este dispositivo.'
          }
        ]
      },

      /* ───────────────────────── 2 ───────────────────────── */
      {
        id: 'familia',
        title: 'Tu pareja y tus hijos',
        intro: 'Estos datos son de tu pareja y de cada hijo, no tuyos. Empieza por tu pareja y sigue por los hijos, preferiblemente de mayor a menor. Los usamos para el vínculo, la reagrupación, la nacionalidad y las ayudas. Si no convives con alguno, indícalo.',
        showIf: function (p) { return p.location === 'spain' && (Number(p.householdSize) > 0 || couple(p) || hasKids(p)); },
        fields: [
          { id: 'familyMembers', type: 'family', label: 'Personas de tu familia' }
        ]
      },

      /* ───────────────────────── 3 ───────────────────────── */
      {
        id: 'situacion',
        title: 'Dónde estás y cómo llegaste',
        intro: 'Aquí está la diferencia entre poder tramitar algo desde dentro de España o tener que hacerlo desde tu país. Responde con lo que sepas; si no estás seguro, marca «no lo sé».',
        fields: [
          /* — en España — */
          {
            id: 'entryMode', type: 'radio', label: '¿Cómo entraste en España?', required: true, showIf: inSpain,
            options: [
              { v: 'tourist_free', l: 'Como turista, sin visado', h: 'Entré con mi pasaporte y los 90 días de estancia' },
              { v: 'tourist_visa', l: 'Con visado de turista', h: 'Visado Schengen de estancia corta' },
              { v: 'irregular', l: 'Sin pasar control o sin visado', h: 'Entrada irregular (por tierra, mar, etc.)' },
              { v: 'studies', l: 'Con visado o permiso de estudios' },
              { v: 'work', l: 'Con visado o permiso de trabajo' },
              { v: 'family', l: 'Con visado de familiar de español o de la UE' },
              { v: 'asylum', l: 'Como solicitante de asilo' },
              { v: 'other', l: 'Otra situación' }
            ]
          },
          {
            id: 'timeInSpain', type: 'select', label: '¿Cuánto tiempo llevas en España?', required: true, showIf: inSpain,
            options: [
              { v: 'lt3m', l: 'Menos de 3 meses' },
              { v: '3to6m', l: 'Entre 3 y 6 meses' },
              { v: '6to12m', l: 'Entre 6 y 12 meses' },
              { v: '1to2y', l: 'Entre 1 y 2 años' },
              { v: '2to3y', l: 'Entre 2 y 3 años' },
              { v: '3to5y', l: 'Entre 3 y 5 años' },
              { v: 'gt5y', l: 'Más de 5 años' },
              { v: 'dontknow', l: 'No lo sé con exactitud' }
            ],
            help: 'Cuenta desde tu última entrada. Es el dato que más influye en los arraigos.'
          },
          {
            id: 'entryDate', type: 'date', label: 'Fecha aproximada de entrada (opcional)', showIf: inSpain,
            help: 'Con una fecha exacta calculamos tus plazos (por ejemplo, cuándo cumples los 2 años de arraigo).'
          },
          {
            id: 'visaExpiry', type: 'date', label: '¿Hasta cuándo era válido tu visado o permiso?', showIf: function (p) { return inSpain(p) && /tourist|studies|work|family/.test(p.entryMode || ''); },
            help: 'Aunque esté caducado, indícalo: la fecha de caducidad es clave.'
          },
          {
            id: 'empadronado', type: 'radio', label: '¿Estás empadronado/a en algún municipio?', required: true, showIf: inSpain,
            options: [{ v: 'yes', l: 'Sí' }, { v: 'no', l: 'No' }, { v: 'dontknow', l: 'No lo sé' }],
            help: 'El padrón es la prueba principal de permanencia en España. Es gratuito y se pide en el ayuntamiento.'
          },
          {
            id: 'empadronamientoSince', type: 'date', label: '¿Desde cuándo estás empadronado/a de forma continuada?', showIf: function (p) { return inSpain(p) && p.empadronado === 'yes'; },
            help: 'Si has cambiado de municipio sin dejar el país, cuenta desde el primer alta.'
          },
          {
            id: 'empadronamientoGaps', type: 'radio', label: '¿Has tenido alguna baja en el padrón?', showIf: function (p) { return inSpain(p) && p.empadronado === 'yes'; },
            options: [
              { v: 'no', l: 'No, siempre he estado empadronado/a' },
              { v: 'small', l: 'Sí, menos de 90 días en total' },
              { v: 'big', l: 'Sí, más de 90 días' },
              { v: 'dontknow', l: 'No lo sé' }
            ]
          },
          {
            id: 'housing', type: 'select', label: '¿Cuál es tu situación de vivienda?', showIf: inSpain,
            options: [
              { v: 'alquiler_piso', l: 'Alquilo un piso entero' },
              { v: 'alquiler_habitacion', l: 'Alquilo una habitación' },
              { v: 'familiar_amigo', l: 'Vivo con un familiar o amigo, sin pagar alquiler' },
              { v: 'propietario_hipoteca', l: 'Soy propietario/a y pago hipoteca' },
              { v: 'propietario', l: 'Soy propietario/a, sin hipoteca' },
              { v: 'pension_albergue', l: 'Pensión, albergue, realojo u otra situación' },
              { v: 'dontknow', l: 'No lo sé / prefiero no decirlo' }
            ],
            help: 'No es lo mismo un contrato de piso que una habitación, vivir con un familiar sin pagar o ser propietario. Cambia el padrón, las pruebas de domicilio y las ayudas.'
          },
          {
            id: 'housingProof', type: 'select', label: '¿Puedes demostrar dónde vives?', showIf: inSpain,
            options: [
              { v: 'contract', l: 'Contrato de alquiler del piso' },
              { v: 'room_contract', l: 'Contrato de alquiler de habitación' },
              { v: 'owner_auth', l: 'Autorización del propietario o del familiar/amigo' },
              { v: 'receipt', l: 'Recibos de alquiler, suministros o transferencias' },
              { v: 'deed', l: 'Escritura o hipoteca' },
              { v: 'none', l: 'No tengo forma de demostrarlo' },
              { v: 'dontknow', l: 'No lo sé' }
            ],
            help: 'Para el padrón y el arraigo no basta con decir que vives ahí: necesitas contrato, autorización, recibo o escritura. Si no lo tienes, pide al titular un documento firmado.'
          },
          {
            id: 'permitStatus', type: 'select', label: '¿Cuál es tu situación de residencia ahora?', showIf: function (p) { return inSpain(p) && !owns(p, 'tie') && !owns(p, 'tarjeta_ue'); },            options: [
              { v: 'none', l: 'Ninguna / estoy irregular' },
              { v: 'studies', l: 'Estancia por estudios' },
              { v: 'residencia_temporal', l: 'Residencia temporal (trabajo, familiar, no lucrativa…)' },
              { v: 'work', l: 'Residencia y trabajo' },
              { v: 'family', l: 'Residencia por familiar de español' },
              { v: 'eu_family', l: 'Tarjeta de familiar de ciudadano de la UE' },
              { v: 'longterm', l: 'Residencia de larga duración' },
              { v: 'asylum', l: 'Solicitante o beneficiario de asilo' },
              { v: 'expired', l: 'Tenía permiso, pero está caducado' },
              { v: 'dontknow', l: 'No lo sé' }
            ]
          },
          {
            id: 'permitKind', type: 'select', label: '¿Qué tipo de autorización es?', showIf: function (p) { return inSpain(p) && ((p.permitStatus && p.permitStatus !== 'none' && p.permitStatus !== 'dontknow') || owns(p, 'tie') || owns(p, 'tarjeta_ue')); },
            options: [
              { v: 'familiar_espanol', l: 'Familiar de persona con nacionalidad española' },
              { v: 'familiar_ue', l: 'Familiar de ciudadano de la UE' },
              { v: 'reagrupacion', l: 'Reagrupación familiar' },
              { v: 'no_lucrativa', l: 'Residencia no lucrativa' },
              { v: 'trabajo_ajena', l: 'Trabajo por cuenta ajena' },
              { v: 'trabajo_propia', l: 'Trabajo por cuenta propia' },
              { v: 'estudios', l: 'Estudios' },
              { v: 'asilo', l: 'Asilo o protección internacional' },
              { v: 'otra', l: 'Otra' },
              { v: 'dontknow', l: 'No lo sé' }
            ],
            help: 'Mira la resolución o el reverso de la TIE. Es clave para saber cómo renovar si no tienes empleo.'
          },
          {
            id: 'familyAbroad', type: 'select', label: 'Si quieres reagrupar a un familiar, ¿dónde está ahora?', showIf: inSpain,
            options: [
              { v: 'no_aplica', l: 'No voy a reagrupar a nadie' },
              { v: 'fuera_espana', l: 'Está fuera de España' },
              { v: 'en_espana', l: 'Ya está en España' },
              { v: 'dontknow', l: 'No lo sé' }
            ],
            help: 'La reagrupación familiar solo sirve si el familiar está fuera de España. Si ya está aquí, aunque sea de turista o en situación irregular, no se puede reagrupar: hay que valorar otra vía.'
          },
          {
            id: 'residenceApproved', type: 'select', label: '¿Tienes una residencia ya aprobada?', showIf: inSpain,
            options: [
              { v: 'yes', l: 'Sí, aprobada' },
              { v: 'in_progress', l: 'En trámite' },
              { v: 'no', l: 'No' },
              { v: 'dontknow', l: 'No lo sé' }
            ],
            help: 'Aprobada no es lo mismo que TIE entregada. Puedes tener la resolución favorable y estar esperando la tarjeta.'
          },
          {
            id: 'residenceApprovedYears', type: 'number', label: '¿Por cuántos años te la aprobaron?', min: 1, max: 10, placeholder: 'Ej. 4',
            showIf: function (p) { return inSpain(p) && p.residenceApproved === 'yes'; }
          },
          {
            id: 'residenceApprovedDate', type: 'date', label: '¿Cuándo te la aprobaron? (opcional)',
            showIf: function (p) { return inSpain(p) && p.residenceApproved === 'yes'; }
          },
          {
            id: 'tieWaitingExpiry', type: 'radio', label: '¿Estás esperando a que venza tu TIE para pedir la nueva?',
            showIf: function (p) { return inSpain(p) && p.residenceApproved === 'yes'; },
            options: [{ v: 'yes', l: 'Sí' }, { v: 'no', l: 'No' }, { v: 'dontknow', l: 'No lo sé' }],
            help: 'Si la residencia ya está aprobada pero la TIE sigue vigente, no tienes que pedir cita de huellas antes del vencimiento.'
          },
          {
            id: 'studyWorkHours', type: 'select', label: 'Si estudias y trabajas, ¿cuántas horas semanales?', showIf: function (p) { return inSpain(p) && (p.permitStatus === 'studies' || p.entryMode === 'studies' || p.permitKind === 'estudios'); },
            options: [
              { v: 'none', l: 'No trabajo' },
              { v: 'upto30', l: '30 horas o menos' },
              { v: 'more30', l: 'Más de 30 horas' },
              { v: 'dontknow', l: 'No lo sé' }
            ],
            help: 'El límite general es 30 h/semana y el trabajo debe ser compatible con los estudios.'
          },
          {
            id: 'permitYears', type: 'select', label: '¿Por cuántos años te concedieron la residencia?', showIf: function (p) { return inSpain(p) && hasResidenceNow(p); },
            options: [
              { v: '1', l: '1 año (autorización inicial)' },
              { v: '2', l: '2 años' },
              { v: '4', l: '4 años' },
              { v: '5', l: '5 años' },
              { v: 'other', l: 'Otro / no lo sé' }
            ],
            help: 'Mira la resolución o el reverso de la TIE. La primera autorización suele ser de 1 año; las renovaciones pueden ser de 2 o 4.'
          },
          {
            id: 'permitExpiry', type: 'date', label: '¿Cuándo vence tu residencia o TIE?', showIf: function (p) { return inSpain(p) && hasResidenceNow(p); },
            help: 'Es la fecha que aparece en la TIE. Si ya venció, indícalo igual.'
          },
          {
            id: 'permitSince', type: 'date', label: '¿Desde cuándo tienes la residencia legal?', showIf: function (p) { return inSpain(p) && (/studies|work|family|eu_family|longterm|residencia_temporal/.test(p.permitStatus || '') || p.residenceApproved === 'yes' || owns(p, 'tie')); },
            help: 'Es la fecha desde la que cuenta la residencia para la nacionalidad. No cuentan el tiempo como turista ni como solicitante de asilo.'
          },
          {
            id: 'renewalMercurio', type: 'select', label: '¿Has presentado la renovación por Mercurio o sede?',
            showIf: function (p) { return inSpain(p) && hasResidenceNow(p) && permitExpiringSoon(p); },
            options: [
              { v: 'yes', l: 'Sí, ya la presenté' },
              { v: 'pending', l: 'La estoy preparando' },
              { v: 'no', l: 'No' },
              { v: 'dontknow', l: 'No lo sé' }
            ],
            help: 'La renovación administrativa se puede presentar hasta 2 meses antes del vencimiento. No es la toma de huellas.'
          },
          {
            id: 'renewalApproved', type: 'select', label: '¿Tienes aprobada la renovación?',
            showIf: function (p) { return p.renewalMercurio === 'yes' || p.renewalMercurio === 'pending'; },
            options: [
              { v: 'yes', l: 'Sí, aprobada' },
              { v: 'pending', l: 'Todavía pendiente' },
              { v: 'no', l: 'No / denegada' },
              { v: 'dontknow', l: 'No lo sé' }
            ]
          },
          {
            id: 'huellasAppointment', type: 'select', label: '¿Has pedido cita para la toma de huellas?',
            showIf: function (p) { return p.renewalApproved === 'yes'; },
            options: [
              { v: 'yes', l: 'Sí, ya tengo cita' },
              { v: 'no', l: 'Todavía no' },
              { v: 'dontknow', l: 'No lo sé' }
            ],
            help: 'La cita de huellas solo puede ser desde el día en que vence la TIE, nunca antes. Si la pides antes, la policía no puede tramitarla.'
          },
          {
            id: 'tiePickupAppointment', type: 'select', label: '¿Has pedido cita para retirar la nueva TIE?',
            showIf: function (p) { return p.huellasAppointment === 'yes'; },
            options: [
              { v: 'yes', l: 'Sí, ya tengo cita' },
              { v: 'no', l: 'Todavía no' },
              { v: 'dontknow', l: 'No lo sé' }
            ],
            help: 'Se pide después de las huellas, normalmente cuando la tarjeta está disponible (30-45 días). Es otra cita distinta.'
          },
          {
            id: 'hasNie', type: 'radio', label: '¿Tienes NIE (número de identidad de extranjero)?', showIf: function (p) { return inSpain(p) && !owns(p, 'nie') && !owns(p, 'tie') && !owns(p, 'tarjeta_ue'); },
            options: [{ v: 'yes', l: 'Sí' }, { v: 'no', l: 'No' }, { v: 'dontknow', l: 'No lo sé' }],
            help: 'El NIE no es un permiso: es un número. Tenerlo no te legaliza, pero hace falta para casi todo.'
          },
          {
            id: 'regularizationApplied', type: 'radio', label: '¿Solicitaste la regularización extraordinaria de 2026?', showIf: inSpain,
            options: [
              { v: 'no', l: 'No' },
              { v: 'pending', l: 'Sí, está en trámite' },
              { v: 'granted', l: 'Sí, me la concedieron' },
              { v: 'dontknow', l: 'No lo sé' }
            ],
            help: 'La ventana de solicitud fue del 16 de abril al 30 de junio de 2026. Si la pediste, tu plan cambia.'
          },
          {
            id: 'asylumRequested', type: 'radio', label: '¿Has solicitado asilo o protección internacional?', showIf: function (p) { return inSpain(p) && !hasAsylumDoc(p) && (!p.asylumStage || p.asylumStage === 'no'); },
            options: [{ v: 'no', l: 'No' }, { v: 'yes', l: 'Sí' }, { v: 'soon', l: 'Estoy pensando en solicitarlo' }, { v: 'dontknow', l: 'No lo sé' }]
          },
          {
            id: 'leftSpain', type: 'radio', label: '¿Has salido de España desde que llegaste?', showIf: inSpain,
            options: [
              { v: 'no', l: 'No, no he salido' },
              { v: 'yes_safe', l: 'Sí, y volví sin problema' },
              { v: 'yes_risk', l: 'Sí, y no sé si afecta a mi situación' }
            ],
            help: 'Si estás en situación irregular, salir puede convertirte en una prohibición de entrada. Lo vemos en el plan.'
          },
          {
            id: 'exitOrder', type: 'radio', label: '¿Tienes una orden de salida o prohibición de entrada?', showIf: inSpain,
            options: [{ v: 'no', l: 'No' }, { v: 'yes', l: 'Sí' }, { v: 'dontknow', l: 'No lo sé' }]
          },
          {
            id: 'hasAppointment', type: 'select', label: '¿Tienes cita para presentar tu solicitud?', showIf: inSpain,
            options: [
              { v: 'yes', l: 'Sí, tengo cita' },
              { v: 'no', l: 'Todavía no' },
              { v: 'not_needed', l: 'No necesito cita / ya presenté' },
              { v: 'dontknow', l: 'No lo sé' }
            ],
            help: 'La fecha decide cuándo pedir antecedentes: caducan a los 3 meses. No los pidas si la cita está muy lejos.'
          },
          {
            id: 'appointmentDate', type: 'date', label: '¿Para qué fecha es la cita?', showIf: function (p) { return inSpain(p) && p.hasAppointment === 'yes'; },
            help: 'Si la cita es dentro de 3 meses, puedes pedir antecedentes ahora; si es más adelante, espera.'
          },

          /* — fuera de España — */
          {
            id: 'outsideGoal', type: 'radio', label: '¿Qué te gustaría hacer?', required: true, showIf: function (p) { return !inSpain(p); },
            options: [
              { v: 'visit', l: 'Visitar o pasar una temporada' },
              { v: 'studies', l: 'Estudiar' },
              { v: 'work', l: 'Trabajar' },
              { v: 'reside', l: 'Residir de forma estable' },
              { v: 'family', l: 'Reunirme con mi familia' },
              { v: 'nationality', l: 'Obtener la nacionalidad' },
              { v: 'dontknow', l: 'No lo tengo claro' }
            ]
          },
          {
            id: 'hasPassport', type: 'radio', label: '¿Tienes pasaporte de tu país en vigor?', showIf: function (p) { return !inSpain(p); },
            options: [{ v: 'yes', l: 'Sí' }, { v: 'no', l: 'No' }, { v: 'in_progress', l: 'Lo estoy tramitando' }],
            help: 'Sin pasaporte válido no se puede pedir visado ni iniciar casi ningún trámite.'
          },
          {
            id: 'beenInSpainBefore', type: 'radio', label: '¿Has estado antes en España o en otro país de la UE?', showIf: function (p) { return !inSpain(p); },
            options: [{ v: 'no', l: 'No' }, { v: 'yes', l: 'Sí' }, { v: 'dontknow', l: 'No lo sé' }]
          },
          {
            id: 'plannedDate', type: 'date', label: '¿Para cuándo te gustaría venir? (opcional)', showIf: function (p) { return !inSpain(p); }
          }
        ]
      },

      /* ───────────────────────── 3 · DOCUMENTOS ───────────────────────── */
      {
        id: 'documentos',
        title: 'Lo que ya tienes',
        intro: 'No empiezas de cero. Marca primero los documentos y trámites que ya terminaste; después, los que están en curso o esperando resolución. Lo pasado explica tu proceso; lo actual dice qué te falta de verdad. Si marcas un documento aquí, la app lo usa para no volver a preguntarte si lo tienes. Si no tienes ninguno, puedes continuar sin marcar nada.',
        showIf: function (p) { return p.location === 'spain'; },
        fields: [
          {
            id: 'docsBase', type: 'checkboxes', label: 'Identidad y vida en España',
            help: 'Marca solo lo que tengas ahora. No comprobamos nada: es para afinar tu plan.',
            options: [
              { v: 'pasaporte', l: 'Pasaporte de tu país (no español)' },
              { v: 'nie', l: 'NIE (el número)', h: 'No es un permiso, pero lo necesitas para casi todo' },
              { v: 'tie', l: 'TIE o tarjeta de residencia' },
              { v: 'tarjeta_ue', l: 'Tarjeta de familiar de la UE' },
              { v: 'certificado_digital', l: 'Certificado digital o Cl@ve', h: 'Permite hacer trámites online' },
              { v: 'cuenta_bancaria', l: 'Cuenta bancaria en España', h: 'Sirve para acreditar medios e ingresos' },
              { v: 'seguridad_social', l: 'Número de la Seguridad Social' },
              { v: 'vida_laboral', l: 'Informe de vida laboral', h: 'Prueba tus cotizaciones' },
              { v: 'tarjeta_sanitaria', l: 'Tarjeta sanitaria' },
              { v: 'contrato_alquiler', l: 'Contrato de alquiler, autorización, recibo o escritura de vivienda' },
              { v: 'nominas', l: 'Nóminas o contrato de trabajo' }
            ]
          },
          {
            id: 'docsTramites', type: 'checkboxes', label: 'Trámites terminados (ya con resolución o documento)',
            help: 'Marca solo lo que ya está hecho o emitido. Si presentaste algo y aún esperas resolución, no lo marques aquí: va en el bloque siguiente.',
            options: [
              { v: 'autorizacion_regreso', l: 'Autorización de regreso', h: 'Documento ya emitido' },
              { v: 'antecedentes', l: 'Certificado de antecedentes penales', h: 'Certificado ya emitido' },
              { v: 'libro_familia', l: 'Libro de familia', h: 'Documento ya emitido' },
              { v: 'demandante_empleo', l: 'Inscripción como demandante de empleo', h: 'Inscripción ya hecha' },
              { v: 'discapacidad', l: 'Certificado de discapacidad', h: 'Certificado ya emitido' },
              { v: 'tie_renovada', l: 'TIE renovada o recibida', h: 'Tarjeta física ya entregada' },
              { v: 'tarjeta_roja_renovada', l: 'Tarjeta roja renovada', h: 'Renovación ya resuelta' },
              { v: 'titulo_homologado', l: 'Título homologado, equivalente o validado', h: 'Resolución ya emitida' },
              { v: 'otro', l: 'Otro trámite terminado' }
            ]
          },
          {
            id: 'docsEnCurso', type: 'checkboxes', label: 'Trámites en curso o esperando resolución',
            help: 'Marca lo que ya presentaste y está pendiente. No marques lo que solo estás pensando hacer. Esto sirve para saber qué te falta y qué no debes duplicar.',
            options: [
              { v: 'cita_asilo', l: 'Cita en policía para solicitar asilo', h: 'Cita pendiente, aún no presentada' },
              { v: 'hoja_blanca', l: 'Hoja blanca (solicitud de asilo presentada)', h: 'En trámite' },
              { v: 'tarjeta_roja', l: 'Tarjeta roja (asilo admitido a trámite)', h: 'En trámite' },
              { v: 'renovacion_tarjeta_roja', l: 'Renovación de tarjeta roja en curso', h: 'Presentada y pendiente de resolución' },
              { v: 'resguardo_nacionalidad', l: 'Resguardo de solicitud de nacionalidad', h: 'Pendiente de resolución' },
              { v: 'resguardo_extranjeria', l: 'Resguardo de un trámite de extranjería', h: 'Pendiente de resolución' },
              { v: 'cita_huellas', l: 'Cita para toma de huellas (TIE)', h: 'Cita pedida, aún sin huellas' },
              { v: 'tie_en_tramite', l: 'Huellas tomadas, esperando la TIE física', h: 'Tarjeta en fabricación o pendiente de entrega' },
              { v: 'cita_retirar_tie', l: 'Esperando cita para retirar la TIE', h: 'TIE aprobada, pendiente de recogida' },
              { v: 'homologacion_titulo', l: 'Homologación o validación de título en curso', h: 'Estudios: pendiente de resolución' },
              { v: 'otro', l: 'Otro trámite en curso' }
            ]
          },
          {
            id: 'asylumStage', type: 'select', label: '¿En qué punto está tu solicitud de asilo?',
            showIf: function (p) { return hasAsylumDoc(p) || p.asylumRequested === 'yes' || p.asylumRequested === 'soon' || p.protectionNeed === 'yes' || !!p.asylumStage; },
            options: [
              { v: 'no', l: 'No he solicitado asilo' },
              { v: 'cita', l: 'Tengo cita en policía para solicitarlo' },
              { v: 'solicitado', l: 'He presentado la solicitud (hoja blanca)' },
              { v: 'admitido', l: 'Admitida a trámite (tarjeta roja)' },
              { v: 'concedido', l: 'Me han concedido protección internacional' },
              { v: 'denegado', l: 'Denegada' },
              { v: 'desistido', l: 'Desistí del asilo o se archivó' },
              { v: 'renunciado', l: 'Renuncié a la protección internacional' },
              { v: 'dontknow', l: 'No lo sé' }
            ],
            help: 'Si no es tu caso, elige la primera opción. Si ya tienes hoja blanca o tarjeta roja, tu situación cambia por completo. Si desististe o renunciaste, no estás en trámite.'
          },
          {
            id: 'asylumBefore90', type: 'radio', label: '¿Solicitaste asilo antes de que se cumplieran los 90 días?',
            showIf: function (p) { return inSpain(p) && asylumHistory(p); },
            options: [{ v: 'yes', l: 'Sí, antes de los 90 días' }, { v: 'no', l: 'No, después' }, { v: 'dontknow', l: 'No lo sé' }],
            help: 'Si pediste asilo dentro de los 90 días, la app no debe tratar tu entrada como una simple sobreestancia turística.'
          },
          {
            id: 'asylumRenouncedDay', type: 'number', label: 'Día en que saliste del asilo (si lo recuerdas)', min: 1, max: 31, placeholder: 'Ej. 12',
            showIf: postAsylumPath,
            help: 'Opcional. Rellena solo lo que recuerdes. Si no sabes el día, déjalo vacío.'
          },
          {
            id: 'asylumRenouncedMonth', type: 'select', label: 'Mes en que saliste del asilo (si lo recuerdas)',
            showIf: postAsylumPath,
            options: [
              { v: 'unknown', l: 'No lo recuerdo' },
              { v: '01', l: 'Enero' }, { v: '02', l: 'Febrero' }, { v: '03', l: 'Marzo' },
              { v: '04', l: 'Abril' }, { v: '05', l: 'Mayo' }, { v: '06', l: 'Junio' },
              { v: '07', l: 'Julio' }, { v: '08', l: 'Agosto' }, { v: '09', l: 'Septiembre' },
              { v: '10', l: 'Octubre' }, { v: '11', l: 'Noviembre' }, { v: '12', l: 'Diciembre' }
            ],
            help: 'Opcional. Si no sabes el mes, elige «No lo recuerdo».'
          },
          {
            id: 'asylumRenouncedYear', type: 'number', label: 'Año en que saliste del asilo (si lo recuerdas)', min: 1900, max: 2100, placeholder: 'Ej. 2024',
            showIf: postAsylumPath,
            help: 'Opcional. Rellena solo lo que recuerdes; no hace falta completar día, mes y año.'
          },
          {
            id: 'postRenunciationOutcome', type: 'select', label: 'Después de salir del asilo, ¿qué pasó?',
            showIf: postAsylumPath,
            options: [
              { v: 'irregular', l: 'Seguí en situación irregular' },
              { v: 'arraigo_formacion_granted', l: 'Arraigo por formación concedido' },
              { v: 'arraigo_cuenta_ajena_granted', l: 'Arraigo por cuenta ajena concedido' },
              { v: 'arraigo_pending', l: 'Solicité arraigo, pendiente de resolución' },
              { v: 'arraigo_granted', l: 'Me concedieron otro arraigo' },
              { v: 'arraigo_denied', l: 'El arraigo fue denegado' },
              { v: 'reg2026_pending', l: 'Solicité la regularización de 2026, pendiente' },
              { v: 'reg2026_granted', l: 'Me concedieron la regularización de 2026' },
              { v: 'reg2026_denied', l: 'La regularización de 2026 fue denegada' },
              { v: 'residencia_aprobada', l: 'Me aprobaron una residencia' },
              { v: 'other_permit', l: 'Obtuve otro permiso o autorización' },
              { v: 'left_spain', l: 'Salí de España' },
              { v: 'dontknow', l: 'No lo sé / no quiero decirlo' }
            ],
            help: 'Cuéntanos la secuencia real: asilo, salida, arraigo por formación, arraigo por cuenta ajena, residencia aprobada… No es lo mismo seguir irregular que haber obtenido una autorización.'
          },
          {
            id: 'postRenunciationDate', type: 'month', label: '¿Cuándo ocurrió? Mes y año (opcional)',
            showIf: function (p) { return postAsylumPath(p) && p.postRenunciationOutcome && p.postRenunciationOutcome !== 'dontknow'; },
            help: 'Si no recuerdas el mes exacto, pon el más aproximado. Sirve para ordenar los hechos, no para inventar una fecha.'
          },
          {
            id: 'asylumCitaDate', type: 'date', label: '¿Para cuándo tienes la cita?',
            showIf: function (p) { return p.asylumStage === 'cita'; },
            help: 'Si es en los próximos días, es prioritario: no faltes y lleva tu documentación.'
          },
          {
            id: 'asylumGrantedDate', type: 'date', label: '¿Cuándo te concedieron la protección?',
            showIf: function (p) { return p.asylumStage === 'concedido'; },
            help: 'Desde la concesión tienes residencia; a los 5 años puedes pedir la nacionalidad.'
          },
          {
            id: 'hojaBlancaDate', type: 'date', label: '¿De cuándo es tu hoja blanca?',
            showIf: function (p) { return p.asylumStage === 'solicitado' || owns(p, 'hoja_blanca'); },
            help: 'A los 6 meses desde la solicitud se puede solicitar autorización de trabajo, si no hay denegación.'
          },
          {
            id: 'tarjetaRojaExpiry', type: 'date', label: '¿Cuándo caduca tu tarjeta roja?',
            showIf: function (p) { return p.asylumStage === 'admitido' || owns(p, 'tarjeta_roja'); },
            help: 'Mira la fecha impresa en la tarjeta. Si caduca pronto, hay que renovarla.'
          },
          {
            id: 'tarjetaRojaRenewed', type: 'radio', label: '¿Has renovado ya la tarjeta roja?',
            showIf: function (p) { return (p.asylumStage === 'admitido' || owns(p, 'tarjeta_roja')) && !owns(p, 'tarjeta_roja_renovada'); },
            options: [{ v: 'yes', l: 'Sí' }, { v: 'no', l: 'No' }, { v: 'dontknow', l: 'No lo sé' }]
          },
          {
            id: 'asylumWorkPermit', type: 'radio', label: '¿Tienes autorización para trabajar?',
            showIf: function (p) { return p.asylumStage === 'solicitado' || p.asylumStage === 'admitido' || owns(p, 'hoja_blanca') || owns(p, 'tarjeta_roja'); },
            options: [{ v: 'yes', l: 'Sí' }, { v: 'pending', l: 'La he solicitado' }, { v: 'no', l: 'No' }, { v: 'dontknow', l: 'No lo sé' }]
          },
          {
            id: 'asylumDeniedDate', type: 'date', label: '¿Cuándo te denegaron el asilo?',
            showIf: function (p) { return p.asylumStage === 'denegado'; }
          },
          {
            id: 'asylumAppeal', type: 'radio', label: '¿Has recurrido la denegación?',
            showIf: function (p) { return p.asylumStage === 'denegado'; },
            options: [{ v: 'yes', l: 'Sí' }, { v: 'no', l: 'No' }, { v: 'dontknow', l: 'No lo sé' }],
            help: 'El plazo de recurso es corto. Si no lo has hecho, busca asesoramiento cuanto antes.'
          },
          {
            id: 'extranjeriaPendingType', type: 'select', label: '¿Qué trámite de extranjería tienes abierto?',
            showIf: function (p) { return owns(p, 'resguardo_extranjeria'); },
            options: [
              { v: 'inicial', l: 'Autorización inicial' },
              { v: 'renovacion', l: 'Renovación' },
              { v: 'modificacion', l: 'Modificación de estatus' },
              { v: 'otro', l: 'Otro' },
              { v: 'dontknow', l: 'No lo sé' }
            ],
            help: 'Mientras tengas un expediente abierto no puedes pedir arraigo (art. 126.h).'
          },
          {
            id: 'extranjeriaPendingDate', type: 'date', label: '¿Cuándo lo presentaste?',
            showIf: function (p) { return owns(p, 'resguardo_extranjeria'); }
          },
          {
            id: 'nationalityPendingStage', type: 'select', label: '¿Cómo va tu solicitud de nacionalidad?',
            showIf: function (p) { return owns(p, 'resguardo_nacionalidad'); },
            options: [
              { v: 'en_tramite', l: 'En trámite' },
              { v: 'requerimiento', l: 'Me han pedido documentación' },
              { v: 'concedida', l: 'Concedida' },
              { v: 'denegada', l: 'Denegada' },
              { v: 'dontknow', l: 'No lo sé' }
            ]
          },
          {
            id: 'nationalityPendingDate', type: 'date', label: '¿Cuándo la presentaste?',
            showIf: function (p) { return owns(p, 'resguardo_nacionalidad'); }
          },
          {
            id: 'digitalCertType', type: 'select', label: '¿Qué certificado digital tienes?',
            showIf: function (p) { return owns(p, 'certificado_digital'); },
            options: [
              { v: 'fnmt', l: 'Certificado de la FNMT' },
              { v: 'clave', l: 'Cl@ve' },
              { v: 'ambos', l: 'Los dos' },
              { v: 'dontknow', l: 'No lo sé' }
            ]
          },
          {
            id: 'antecedentesCertDate', type: 'date', label: '¿De cuándo es tu certificado de antecedentes?',
            showIf: function (p) { return owns(p, 'antecedentes'); },
            help: 'Suele caducar a los 3 meses. Si es antiguo, habrá que pedir otro.'
          },
          {
            id: 'returnAuthExpiry', type: 'date', label: '¿Hasta cuándo es válida tu autorización de regreso?',
            showIf: function (p) { return owns(p, 'autorizacion_regreso'); }
          },
          {
            id: 'discapacidadGrado', type: 'select', label: '¿Qué grado de discapacidad tienes?',
            showIf: function (p) { return owns(p, 'discapacidad'); },
            options: [
              { v: '33_44', l: 'Del 33 % al 44 %' },
              { v: '45_64', l: 'Del 45 % al 64 %' },
              { v: '65_mas', l: '65 % o más' },
              { v: 'no_se', l: 'No lo sé' }
            ]
          },
          {
            id: 'docsOther', type: 'text', label: '¿Otro documento o trámite?',
            showIf: function (p) { return owns(p, 'otro'); },
            placeholder: 'Ej. resguardo de solicitud de nacionalidad de mi hijo'
          }
        ]
      },

      /* ───────────────────────── 4 ───────────────────────── */
      {
        id: 'vinculos',
        title: 'Tus vínculos con España',
        intro: 'La descendencia española es, para mucha gente, la vía más rápida. Pero hay que distinguir bien los casos y saber qué documentos existen.',
        fields: [
          {
            id: 'ancestry', type: 'radio', label: '¿Tienes antepasados españoles?', required: true,
            options: [
              { v: 'none', l: 'No que yo sepa' },
              { v: 'parent', l: 'Padre o madre español/a' },
              { v: 'grandparent', l: 'Abuelo/a español/a' },
              { v: 'both', l: 'Varios (padre/madre y abuelos)' },
              { v: 'dontknow', l: 'No estoy seguro/a' }
            ]
          },
          {
            id: 'ancestorOrigin', type: 'radio', label: '¿Cómo era español ese antepasado?', showIf: hasAncestry,
            options: [
              { v: 'originario', l: 'Español/a de origen', h: 'Nació español/a y lo era desde el principio' },
              { v: 'naturalizado', l: 'Obtuvo la nacionalidad después', h: 'Por residencia, opción o carta de naturaleza' },
              { v: 'lost_marriage', l: 'Mujer española que la perdió al casarse', h: 'Antes de 1978, por matrimonio con un extranjero' },
              { v: 'dontknow', l: 'No lo sé' }
            ],
            help: 'Este matiz decide si encajas en la vía de origen, en la de opción o en ninguna.'
          },
          {
            id: 'ancestorBornSpain', type: 'radio', label: '¿Ese antepasado nació en España?', showIf: hasAncestry,
            options: [{ v: 'yes', l: 'Sí' }, { v: 'no', l: 'No' }, { v: 'dontknow', l: 'No lo sé' }],
            help: 'Si nació en España y era español de origen, se abre la vía de opción sin límite de edad (art. 20.1.b CC).'
          },
          {
            id: 'ancestryDocs', type: 'radio', label: '¿Tienes documentos que lo acrediten?', showIf: hasAncestry,            options: [
              { v: 'complete', l: 'Sí: partidas de nacimiento y demás' },
              { v: 'partial', l: 'Algunos, pero faltan papeles' },
              { v: 'none', l: 'No tengo ninguno' },
              { v: 'dontknow', l: 'No lo sé' }
            ],
            help: 'Sin partida de nacimiento española o certificado del Registro Civil, la vía se complica pero no siempre se cierra.'
          },
          {
            id: 'bornInSpain', type: 'radio', label: '¿Naciste en España?',
            options: [{ v: 'no', l: 'No' }, { v: 'yes', l: 'Sí' }, { v: 'dontknow', l: 'No lo sé' }]
          },
          {
            id: 'bornInSpanishTerritory', type: 'radio', label: '¿Naciste en un territorio que fue español?', showIf: function (p) { return p.bornInSpain === 'no'; },
            options: [
              { v: 'no', l: 'No' },
              { v: 'sahara', l: 'Sáhara Occidental' },
              { v: 'guinea', l: 'Guinea Ecuatorial' },
              { v: 'other', l: 'Otro territorio' },
              { v: 'dontknow', l: 'No lo sé' }
            ],
            help: 'Solo aplica a casos muy concretos de la Ley de Memoria Democrática.'
          },
          {
            id: 'familyInSpain', type: 'checkboxes', label: '¿Qué familiares tienes en España?',
            options: [
              { v: 'none', l: 'Ninguno' },
              { v: 'spouse', l: 'Pareja o cónyuge' },
              { v: 'children', l: 'Hijos' },
              { v: 'parents', l: 'Padres' },
              { v: 'siblings', l: 'Hermanos' },
              { v: 'grandparents', l: 'Abuelos' },
              { v: 'other', l: 'Otros' }
            ]
          },
          {
            id: 'familyStatus', type: 'select', label: '¿Tienen residencia o nacionalidad española?', showIf: function (p) { return Array.isArray(p.familyInSpain) && p.familyInSpain.some(function (v) { return v !== 'none'; }); },
            options: [
              { v: 'all', l: 'Sí, todos' },
              { v: 'some', l: 'Algunos' },
              { v: 'none', l: 'No, ninguno' },
              { v: 'dontknow', l: 'No lo sé' }
            ]
          },
          {
            id: 'spanishRelativeEU', type: 'radio', label: '¿Ese familiar español ha vivido o trabajado en otro país de la UE?', showIf: function (p) { return (p.ancestry === 'none' || p.ancestry === 'dontknow') && Array.isArray(p.familyInSpain) && p.familyInSpain.some(function (v) { return v === 'spouse' || v === 'parents' || v === 'children'; }); },
            options: [{ v: 'no', l: 'No' }, { v: 'yes', l: 'Sí' }, { v: 'dontknow', l: 'No lo sé' }],
            help: 'Si un español ha ejercido la libre circulación, sus familiares pueden acogerse a las normas de la UE.'
          }
        ]
      },

      /* ───────────────────────── 4 ───────────────────────── */
      {
        id: 'recursos',
        title: 'Trabajo, estudios y dinero',
        intro: 'Casi todas las vías piden acreditar medios económicos o un proyecto. No necesitas tenerlo todo: nos sirve saber de dónde partes.',
        fields: [
          {
            id: 'employment', type: 'radio', label: '¿Cuál es tu situación laboral actual?', required: true,
            options: [
              { v: 'none', l: 'Sin trabajo' },
              { v: 'informal', l: 'Trabajo sin contrato' },
              { v: 'temporary', l: 'Contrato temporal' },
              { v: 'permanent', l: 'Contrato indefinido' },
              { v: 'self', l: 'Autónomo/a o empresa' },
              { v: 'remote', l: 'Trabajo en remoto para el extranjero' },
              { v: 'retired', l: 'Jubilado/a o pensionista' },
              { v: 'student', l: 'Estudiando' }
            ]
          },
          {
            id: 'monthsWorked', type: 'number', label: '¿Cuántos meses has trabajado en España en total?', min: 0, max: 400, showIf: notStudent,
            help: 'Cuenta también el trabajo sin contrato. Si nunca has trabajado aquí, pon 0.'
          },
          {
            id: 'cotizaciones', type: 'radio', label: '¿Esos trabajos cotizaron a la Seguridad Social?', showIf: function (p) { return notStudent(p) && Number(p.monthsWorked) > 0; },
            options: [{ v: 'yes', l: 'Sí, la mayoría' }, { v: 'some', l: 'Algunos' }, { v: 'no', l: 'No' }, { v: 'dontknow', l: 'No lo sé' }],
            help: 'Puedes comprobarlo gratis en la sede de la Seguridad Social (Informe de vida laboral).'
          },
          {
            id: 'monthlyIncome', type: 'number', label: 'Ingresos netos mensuales del hogar (€)', min: 0, step: 50, placeholder: 'Ej. 1200',
            help: 'Súmalos todos, incluidos los de tu pareja si los hay. Sirve para valorar medios económicos.'
          },
          {
            id: 'savings', type: 'number', label: 'Ahorros disponibles (€)', min: 0, step: 100, placeholder: 'Ej. 6000',
            help: 'Dinero en cuenta o activos que puedas justificar.'
          },
          {
            id: 'jobOffer', type: 'radio', label: '¿Tienes una oferta o posibilidad de contrato?', showIf: inSpain,
            options: [{ v: 'yes', l: 'Sí, firme' }, { v: 'soon', l: 'Probablemente pronto' }, { v: 'no', l: 'No' }, { v: 'dontknow', l: 'No lo sé' }]
          },
          {
            id: 'sector', type: 'select', label: '¿En qué sector trabajas o podrías trabajar?',
            options: [
              { v: 'hosteleria', l: 'Hostelería y turismo' },
              { v: 'construccion', l: 'Construcción' },
              { v: 'agricultura', l: 'Agricultura y ganadería' },
              { v: 'cuidados', l: 'Cuidados y trabajo doméstico' },
              { v: 'transporte', l: 'Transporte y logística' },
              { v: 'tecnologia', l: 'Tecnología' },
              { v: 'salud', l: 'Salud' },
              { v: 'educacion', l: 'Educación' },
              { v: 'comercio', l: 'Comercio' },
              { v: 'otro', l: 'Otro' }
            ]
          },
          {
            id: 'degree', type: 'select', label: '¿Cuál es tu nivel de estudios?',
            options: [
              { v: 'none', l: 'Sin titulación' },
              { v: 'eso', l: 'ESO o equivalente' },
              { v: 'bachillerato', l: 'Bachillerato / secundaria superior' },
              { v: 'fp_medio', l: 'Formación profesional media' },
              { v: 'fp_superior', l: 'Formación profesional superior' },
              { v: 'grado', l: 'Grado universitario o licenciatura' },
              { v: 'master', l: 'Máster' },
              { v: 'doctorado', l: 'Doctorado' }
            ]
          },
          {
            id: 'sepeCourses', type: 'number', label: '¿Cuántos cursos del SEPE has terminado?', min: 0, max: 30, placeholder: 'Ej. 2', showIf: inSpain,
            help: 'Cursos de formación para el empleo del SEPE o de la comunidad. Cuéntalos aunque no tengan título oficial.'
          },
          {
            id: 'sepeCoursesDetails', type: 'textarea', label: '¿Cuáles y cuánto duraron?', showIf: function (p) { return inSpain(p) && Number(p.sepeCourses) > 0; },
            placeholder: 'Ej. Soldador de TIG, 6 meses; Seguridad informática, 6 meses',
            help: 'Nombre del curso, especialidad y duración. Si tienes certificado o diploma, guárdalo: puede servir para acreditar formación.'
          },
          {
            id: 'sepeCoursesInProgress', type: 'number', label: '¿Cuántos cursos del SEPE tienes en curso?', min: 0, max: 30, placeholder: '0', showIf: inSpain
          },
          {
            id: 'degreeHomologated', type: 'radio', label: '¿Tu título está homologado o reconocido en España?', showIf: function (p) { return p.degree && p.degree !== 'none' && p.degree !== 'eso'; },
            options: [{ v: 'yes', l: 'Sí' }, { v: 'in_progress', l: 'En trámite' }, { v: 'no', l: 'No' }, { v: 'dontknow', l: 'No lo sé' }],
            help: 'La homologación tarda meses. Para algunas vías basta el título sin homologar.'
          },
          {
            id: 'yearsExperience', type: 'number', label: 'Años de experiencia en tu profesión', min: 0, max: 60, placeholder: 'Ej. 5'
          },
          {
            id: 'spanishLevel', type: 'select', label: '¿Cómo te desenvuelves en español?',
            options: [
              { v: 'nativo', l: 'Nativo o bilingüe' },
              { v: 'alto', l: 'Alto' },
              { v: 'medio', l: 'Medio' },
              { v: 'bajo', l: 'Básico' }
            ]
          },
          {
            id: 'remoteIncome', type: 'number', label: 'Facturación media mensual de tu trabajo remoto (€)', min: 0, step: 100, showIf: function (p) { return p.employment === 'remote'; },
            help: 'Para la vía de nómada digital se exige un volumen de ingresos y que la mayoría vengan de fuera de España.'
          },
          {
            id: 'remoteClientsOutside', type: 'radio', label: '¿Más del 80 % de tus ingresos vienen de fuera de España?', showIf: function (p) { return p.employment === 'remote'; },
            options: [{ v: 'yes', l: 'Sí' }, { v: 'no', l: 'No' }, { v: 'dontknow', l: 'No lo sé' }]
          },
          {
            id: 'studiesAdmission', type: 'radio', label: '¿Tienes carta de admisión de un centro español?', showIf: function (p) { return !inSpain(p) && p.outsideGoal === 'studies'; },
            options: [{ v: 'yes', l: 'Sí' }, { v: 'in_progress', l: 'En trámite' }, { v: 'no', l: 'No' }]
          },
          {
            id: 'exams', type: 'select', label: '¿Has aprobado el CCSE y, si te corresponde, el DELE A2?',
            options: [
              { v: 'none', l: 'No, ninguno' },
              { v: 'ccse', l: 'Solo el CCSE (hispanohablante)' },
              { v: 'dele', l: 'Solo el DELE A2' },
              { v: 'both', l: 'Los dos' },
              { v: 'not_needed', l: 'No me hacen falta' }
            ],
            help: 'Para la nacionalidad por residencia el CCSE es obligatorio. Los nacionales de países hispanohablantes están exentos del DELE A2, pero no del CCSE.'
          },
          {
            id: 'hasDisability', type: 'radio', label: 'Sobre ti: ¿tienes alguna discapacidad?', showIf: function (p) { return !owns(p, 'discapacidad'); },
            options: [{ v: 'no', l: 'No' }, { v: 'yes', l: 'Sí' }, { v: 'in_progress', l: 'En trámite' }, { v: 'dontknow', l: 'No lo sé' }],
            help: 'Aunque no esté reconocida. No incluyas aquí a tu pareja o hijos: eso se pregunta en «Sobre ti y tu familia».'
          },
          {
            id: 'disabilityRecognized', type: 'select', label: 'Sobre ti: ¿está reconocida oficialmente?',
            showIf: function (p) { return p.hasDisability === 'yes' || p.hasDisability === 'in_progress'; },
            options: [
              { v: 'yes', l: 'Sí, reconocida' },
              { v: 'in_progress', l: 'En trámite' },
              { v: 'no', l: 'No está reconocida' },
              { v: 'dontknow', l: 'No lo sé' }
            ]
          },
          {
            id: 'disabilityDegree', type: 'select', label: '¿Qué grado tienes reconocido?',
            showIf: function (p) { return owns(p, 'discapacidad') || p.disabilityRecognized === 'yes' || (p.hasDisability === 'yes' && !p.disabilityRecognized); },
            options: [
              { v: '33_44', l: 'Del 33 % al 44 %' },
              { v: '45_64', l: 'Del 45 % al 64 %' },
              { v: '65_mas', l: '65 % o más' },
              { v: 'dontknow', l: 'No lo sé' }
            ]
          },
          {
            id: 'disabilityExpiry', type: 'date', label: '¿Cuándo vence el certificado? (opcional)',
            showIf: function (p) { return owns(p, 'discapacidad') || p.disabilityRecognized === 'yes'; },
            help: 'Si no caduca o no lo sabes, déjalo vacío.'
          },
          {
            id: 'disabilityCertificate', type: 'radio', label: '¿Tienes el certificado de discapacidad?', showIf: function (p) { return owns(p, 'discapacidad') || p.hasDisability === 'yes' || p.hasDisability === 'in_progress' || p.disabilityRecognized === 'yes'; },
            options: [{ v: 'yes', l: 'Sí' }, { v: 'no', l: 'No' }, { v: 'in_progress', l: 'En trámite' }, { v: 'dontknow', l: 'No lo sé' }]
          },
          {
            id: 'dependency', type: 'radio', label: 'Sobre ti: ¿tienes reconocida la situación de dependencia?',
            options: [{ v: 'no', l: 'No' }, { v: 'yes', l: 'Sí' }, { v: 'in_progress', l: 'En trámite' }, { v: 'dontknow', l: 'No lo sé' }],
            help: 'Es distinto de la discapacidad y de la incapacidad laboral. Se reconoce por la comunidad autónoma. No incluyas aquí a tu pareja o hijos.'
          },
          {
            id: 'familyNumerosa', type: 'radio', label: '¿Tenéis título de familia numerosa?',
            options: [{ v: 'no', l: 'No' }, { v: 'yes', l: 'Sí' }, { v: 'in_progress', l: 'En trámite' }, { v: 'dontknow', l: 'No lo sé' }],
            help: 'Se solicita en la comunidad autónoma. Da ventajas en educación, transporte, vivienda y tasas. Si lo marcas, no volveremos a preguntar si sois familia numerosa: revisa que estén cargados todos los hijos. Mínimo 3 hijos, o 2 si uno tiene discapacidad.'
          },
          {
            id: 'foreignStudies', type: 'radio', label: '¿Tienes estudios terminados fuera de España que quieras reconocer?', showIf: function (p) { return !owns(p, 'titulo_homologado') && !ownsCurrent(p, 'homologacion_titulo'); },
            options: [{ v: 'no', l: 'No' }, { v: 'yes', l: 'Sí' }, { v: 'dontknow', l: 'No lo sé' }],
            help: 'Sirve para orientarte sobre homologación, convalidación o acceso a la universidad. El reconocimiento no regulariza tu situación.'
          },
          {
            id: 'studiesLevel', type: 'select', label: '¿Qué nivel terminaste?', showIf: function (p) { return p.foreignStudies === 'yes' || owns(p, 'titulo_homologado') || ownsCurrent(p, 'homologacion_titulo'); },
            options: [
              { v: 'eso', l: 'ESO / secundaria obligatoria' },
              { v: 'bachillerato', l: 'Bachillerato / secundaria superior' },
              { v: 'fp', l: 'Formación profesional' },
              { v: 'grado', l: 'Grado / licenciatura' },
              { v: 'master', l: 'Máster' },
              { v: 'doctorado', l: 'Doctorado' },
              { v: 'otro', l: 'Otro' },
              { v: 'dontknow', l: 'No lo sé' }
            ]
          },
          {
            id: 'studiesHomologated', type: 'radio', label: '¿Ya están homologados o reconocidos en España?', showIf: function (p) { return p.foreignStudies === 'yes' && !owns(p, 'titulo_homologado') && !ownsCurrent(p, 'homologacion_titulo'); },
            options: [{ v: 'yes', l: 'Sí' }, { v: 'in_progress', l: 'En trámite' }, { v: 'no', l: 'No' }, { v: 'dontknow', l: 'No lo sé' }]
          }
        ]
      },

      /* ───────────────────────── 5 ───────────────────────── */
      {
        id: 'legal',
        title: 'Antecedentes, salud y protección',
        intro: 'Son preguntas delicadas, pero muchas vías se caen por un antecedente penal o por no tener seguro médico. Puedes dejar en blanco lo que no quieras responder.',
        fields: [
          {
            id: 'criminalSpain', type: 'radio', label: '¿Tienes antecedentes penales en España?',
            options: [{ v: 'no', l: 'No' }, { v: 'yes', l: 'Sí' }, { v: 'dontknow', l: 'No lo sé' }],
            help: 'Puedes pedir tu certificado de antecedentes penales gratis en el Ministerio de Justicia.'
          },
          {
            id: 'criminalSpainWhen', type: 'select', label: '¿Cuándo fue el antecedente en España?', showIf: function (p) { return p.criminalSpain === 'yes'; },
            options: [
              { v: 'lt1', l: 'Hace menos de 1 año' },
              { v: '1to5', l: 'Entre 1 y 5 años' },
              { v: '5to10', l: 'Entre 5 y 10 años' },
              { v: 'gt10', l: 'Hace más de 10 años' },
              { v: 'dontknow', l: 'No lo sé' }
            ],
            help: 'La fecha importa para la cancelación y para la valoración. No todos los antecedentes bloquean igual.'
          },
          {
            id: 'criminalOrigin', type: 'radio', label: '¿Tienes antecedentes penales en tu país de origen?',
            options: [{ v: 'no', l: 'No' }, { v: 'yes', l: 'Sí' }, { v: 'dontknow', l: 'No lo sé' }]
          },
          {
            id: 'criminalOriginWhen', type: 'select', label: '¿Cuándo fue el antecedente en tu país?', showIf: function (p) { return p.criminalOrigin === 'yes'; },
            options: [
              { v: 'lt1', l: 'Hace menos de 1 año' },
              { v: '1to5', l: 'Entre 1 y 5 años' },
              { v: '5to10', l: 'Entre 5 y 10 años' },
              { v: 'gt10', l: 'Hace más de 10 años' },
              { v: 'dontknow', l: 'No lo sé' }
            ]
          },
          {
            id: 'healthInsurance', type: 'radio', label: '¿Tienes seguro médico?',
            options: [
              { v: 'private', l: 'Seguro privado' },
              { v: 'public', l: 'Sanidad pública (tarjeta sanitaria)' },
              { v: 'none', l: 'Ninguno' },
              { v: 'dontknow', l: 'No lo sé' }
            ]
          },
          {
            id: 'victimViolence', type: 'radio', label: '¿Has sufrido violencia de género o trata de seres humanos?',
            options: [
              { v: 'no', l: 'No' },
              { v: 'yes', l: 'Sí' },
              { v: 'prefer_not', l: 'Prefiero no contestar' }
            ],
            help: 'Si es tu caso, existen autorizaciones de residencia específicas y recursos de protección. No tienes que dar detalles aquí.'
          },
          {
            id: 'protectionNeed', type: 'radio', label: '¿Temes volver a tu país por persecución, conflicto o violencia?',
            options: [{ v: 'no', l: 'No' }, { v: 'yes', l: 'Sí' }, { v: 'dontknow', l: 'No lo sé' }]
          },
          {
            id: 'humanitarianGround', type: 'select', label: '¿Concurre alguna razón humanitaria para residir?',
            showIf: inSpain,
            options: [
              { v: 'serious_illness', l: 'Enfermedad grave o riesgo para la salud' },
              { v: 'integrity', l: 'Riesgo para mi integridad o situación de vulnerabilidad' },
              { v: 'victim', l: 'Víctima de delito, trata o violencia' },
              { v: 'other', l: 'Otra razón humanitaria' },
              { v: 'no', l: 'No' },
              { v: 'dontknow', l: 'No lo sé' }
            ],
            help: 'No es una vía por pobreza ni una autorización automática: exige un supuesto concreto y pruebas (informes médicos o sociales, resolución, denuncia…).'
          },
          {
            id: 'notes', type: 'textarea', label: '¿Algo más que debamos saber? (opcional)', placeholder: 'Ej. tengo una denuncia pendiente, estoy esperando cita en el consulado, mi pareja acaba de obtener la nacionalidad…'
          }
        ]
      },

      /* ───────────────────────── 6 ───────────────────────── */
      {
        id: 'objetivo',
        title: 'Tu objetivo',
        intro: 'Con esto cerramos el diagnóstico. Marca lo que quieres conseguir: no siempre se puede todo a la vez, y a veces conviene un paso intermedio.',
        fields: [
          {
            id: 'goals', type: 'checkboxes', label: '¿Qué quieres conseguir?', required: true,
            options: [
              { v: 'regularizar', l: 'Dejar de estar irregular' },
              { v: 'residencia_estable', l: 'Una residencia estable' },
              { v: 'trabajar', l: 'Trabajar legalmente' },
              { v: 'estudiar', l: 'Estudiar' },
              { v: 'nacionalidad', l: 'La nacionalidad española' },
              { v: 'familia', l: 'Traer o reagrupar a mi familia' },
              { v: 'no_lo_se', l: 'No lo tengo claro' }
            ]
          },
          {
            id: 'horizon', type: 'radio', label: '¿Para cuándo lo necesitas?',
            options: [
              { v: 'urgent', l: 'Ya, es urgente' },
              { v: '6m', l: 'En los próximos 6 meses' },
              { v: '1y', l: 'En el próximo año' },
              { v: 'nopress', l: 'Sin prisa, quiero hacerlo bien' }
            ]
          },
          {
            id: 'canLeaveSpain', type: 'radio', label: 'Si hiciera falta, ¿podrías salir de España para tramitar desde tu país?', showIf: inSpain,
            options: [
              { v: 'yes', l: 'Sí, sin problema' },
              { v: 'hard', l: 'Podría, pero con dificultad' },
              { v: 'no', l: 'No' },
              { v: 'dontknow', l: 'No lo sé' }
            ],
            help: 'Ojo: si estás irregular, salir puede llevar aparejada una prohibición de entrada. Lo analizamos en el plan.'
          },
          {
            id: 'consent', type: 'consent', label: 'Entiendo que Ruta Legal es una herramienta de orientación y no sustituye el asesoramiento de un abogado ni la información oficial.', required: true
          }
        ]
      }
    ]
  };

  RL.questions.allFields = function () {
    var out = [];
    RL.questions.steps.forEach(function (s) {
      s.fields.forEach(function (f) { out.push(f); });
    });
    return out;
  };
  RL.questions.fieldById = function (id) {
    var fields = RL.questions.allFields();
    for (var i = 0; i < fields.length; i++) if (fields[i].id === id) return fields[i];
    return null;
  };
  RL.questions.visibleFields = function (step, profile) {
    return step.fields.filter(function (f) {
      return typeof f.showIf !== 'function' || f.showIf(profile);
    });
  };
  RL.questions.visibleSteps = function (profile) {
    var p = profile || {};
    return RL.questions.steps.filter(function (s) {
      return typeof s.showIf !== 'function' || s.showIf(p);
    });
  };

  /* Orden: titular → datos generales → pareja/hijos → objetivo → resto. */
  (function () {
    var generalIds = [
      'householdSize', 'maritalStatus', 'marriageType', 'childrenCommon', 'childrenOwn',
      'childrenPartner', 'childrenSpanish', 'spanishChildType', 'spouseSpanish',
      'spouseInSpain', 'spouseStatus', 'cohabitation', 'partnerDisability',
      'partnerDisabilityRecognized', 'partnerDisabilityDegree', 'partnerDisabilityExpiry',
      'partnerDependency', 'pregnant', 'pregnantBySpanish', 'childRecognized',
      'childLivesWithYou', 'childSupport', 'childrenDisability', 'childrenDisabilityRecognized',
      'childrenDisabilityDegree', 'childrenDisabilityExpiry', 'householdOthers', 'householdDetails'
    ];
    var generalFields = [];
    var yo = RL.questions.steps.find(function (s) { return s.id === 'yo'; });
    if (yo) {
      yo.intro = 'Primero, tus datos como titular. Después veremos la composición familiar y las preguntas de cada persona.';
      yo.fields = yo.fields.filter(function (f) {
        if (generalIds.indexOf(f.id) !== -1) { generalFields.push(f); return false; }
        return true;
      });
    }
    var yoIndex = RL.questions.steps.findIndex(function (s) { return s.id === 'yo'; });
    RL.questions.steps.splice(yoIndex + 1, 0, {
      id: 'general',
      title: 'Datos generales de la familia',
      intro: 'Estas preguntas afectan a todos: con quién vives, cuántos hijos hay, si alguno es español o tiene discapacidad. No son todavía la ficha individual de cada uno.',
      showIf: function (p) { return p.location === 'spain'; },
      fields: generalFields
    });
    var objetivoIndex = RL.questions.steps.findIndex(function (s) { return s.id === 'objetivo'; });
    var objetivo = objetivoIndex >= 0 ? RL.questions.steps.splice(objetivoIndex, 1)[0] : null;
    if (objetivo) {
      var familyIndex = RL.questions.steps.findIndex(function (s) { return s.id === 'familia'; });
      RL.questions.steps.splice(familyIndex + 1, 0, objetivo);
    }
  })();

  /* Toda la investigación del asilo en una sola página, después de «situación». */
  (function () {
    var ids = [
      'asylumStage', 'asylumBefore90',
      'asylumRenouncedDay', 'asylumRenouncedMonth', 'asylumRenouncedYear',
      'postRenunciationOutcome', 'postRenunciationDate',
      'asylumCitaDate', 'asylumGrantedDate', 'hojaBlancaDate',
      'tarjetaRojaExpiry', 'tarjetaRojaRenewed', 'asylumWorkPermit',
      'asylumDeniedDate', 'asylumAppeal'
    ];
    var asylumFields = [];
    RL.questions.steps.forEach(function (step) {
      if (!step.fields) return;
      step.fields = step.fields.filter(function (f) {
        if (ids.indexOf(f.id) !== -1) { asylumFields.push(f); return false; }
        return true;
      });
    });
    var situation = RL.questions.steps.findIndex(function (s) { return s.id === 'situacion'; });
    var asylumStep = {
      id: 'asilo',
      title: 'Todo sobre tu asilo',
      intro: 'Página única de asilo: qué solicitaste, en qué punto está, qué pasó después y dónde estás ahora. Si no has pedido asilo, esta página no aparece.',
      showIf: function (p) {
        return p.asylumRequested === 'yes' || p.asylumRequested === 'soon' ||
          asylumHistory(p) || !!(p.docsEnCurso && p.docsEnCurso.some(function (x) {
            return ['cita_asilo', 'hoja_blanca', 'tarjeta_roja'].indexOf(x) !== -1;
          }));
      },
      fields: asylumFields
    };
    RL.questions.steps.splice(situation + 1, 0, asylumStep);
  })();

  /* Datos que necesita un abogado para el informe de caso. */
  RL.questions.steps.push({
    id: 'abogado',
    title: 'Datos para tu abogado',
    intro: 'No es un diagnóstico. Son los datos que un abogado de extranjería necesita para revisar tu caso: identificación, contacto, solicitudes anteriores y tus dudas.',
    fields: [
      { id: 'fullName', type: 'text', label: 'Nombre y apellidos', placeholder: 'Solo si quieres incluirlos en el informe' },
      { id: 'birthDate', type: 'date', label: 'Fecha de nacimiento' },
      { id: 'birthPlace', type: 'text', label: 'Lugar de nacimiento' },
      { id: 'contactPhone', type: 'text', label: 'Teléfono de contacto (opcional)' },
      { id: 'contactEmail', type: 'text', label: 'Correo de contacto (opcional)' },
      {
        id: 'urgency', type: 'select', label: '¿Hay algún plazo urgente?',
        options: [
          { v: 'none', l: 'No, puedo esperar' },
          { v: 'days', l: 'Sí, días' },
          { v: 'weeks', l: 'Sí, semanas' },
          { v: 'months', l: 'Sí, meses' },
          { v: 'dontknow', l: 'No lo sé' }
        ]
      },
      { id: 'priorApplications', type: 'textarea', label: 'Solicitudes o expedientes anteriores', placeholder: 'Qué pediste, cuándo y en qué quedó' },
      { id: 'denials', type: 'textarea', label: 'Denegaciones, recursos o problemas', placeholder: 'Denegaciones, recursos, silencios, prohibiciones de entrada…' },
      { id: 'lawyerQuestions', type: 'textarea', label: '¿Qué quieres preguntar al abogado?', placeholder: 'Ej. ¿Me conviene arraigo o nacionalidad? ¿Qué documento pido primero?' }
    ]
  });
})();

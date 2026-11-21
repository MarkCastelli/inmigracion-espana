/* ============================================================
   Ruta Legal · motor de reglas
   Convierte el perfil en un plan: vías que encajan, requisitos
   cumplidos/faltantes, alertas, hitos temporales y acciones.
   ============================================================ */
(function () {
  'use strict';
  var RL = window.RL = window.RL || {};

  var STATUS = RL.STATUS = {
    ready:   { key: 'ready',   label: 'Requisitos cubiertos', tone: 'ok',   order: 0 },
    likely:  { key: 'likely',  label: 'Faltan datos o pruebas', tone: 'ok', order: 1 },
    almost:  { key: 'almost',  label: 'A tu alcance',        tone: 'warn', order: 2 },
    unlikely:{ key: 'unlikely',label: 'No encaja',           tone: 'bad',  order: 3 },
    blocked: { key: 'blocked', label: 'Bloqueada por la ley', tone: 'bad', order: 4 },
    closed:  { key: 'closed',  label: 'Plazo cerrado',       tone: 'neutral', order: 5 }
  };

  function has(arr, v) { return Array.isArray(arr) && arr.indexOf(v) !== -1; }
  function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }

  /* ─────────── hechos derivados del perfil ─────────── */
  var BUCKET_MONTHS = {
    lt3m: 1.5, '3to6m': 4.5, '6to12m': 9, '1to2y': 18,
    '2to3y': 30, '3to5y': 48, gt5y: 72
  };

  RL.derive = function (p) {
    p = p || {};
    var d = {};
    d.age = p.age != null && p.age !== '' ? Number(p.age) : null;
    d.minor = d.age != null && d.age < 18;
    d.inSpain = p.location === 'spain';
    d.outside = !d.inSpain;
    d.country = RL.countryByCode(p.nationality);
    d.ibero = RL.countryIsDosAnios(p.nationality);
    d.euCitizen = !!(d.country && d.country.ue);
    d.visaFree = d.country ? d.country.visa : null;

    d.couple = p.maritalStatus === 'casado' || p.maritalStatus === 'pareja_registrada' || p.maritalStatus === 'pareja_estable';
    var childrenCommon = Number(p.childrenCommon) || 0;
    var childrenOwn = Number(p.childrenOwn) || 0;
    var childrenPartner = Number(p.childrenPartner) || 0;
    var childrenLegacy = Number(p.childrenCount) || 0;
    var hasNewChildren = p.childrenCommon != null || p.childrenOwn != null || p.childrenPartner != null;
    if (!hasNewChildren && childrenLegacy > 0) {
      childrenOwn = childrenLegacy;
    }
    d.childrenCommon = childrenCommon;
    d.childrenOwn = childrenOwn;
    d.childrenPartner = childrenPartner;
    d.childrenCount = childrenCommon + childrenOwn + childrenPartner;
    d.hasKids = d.childrenCount > 0;
    d.hasCommonChild = childrenCommon > 0;
    d.childrenOwnOrCommon = childrenCommon + childrenOwn;
    d.partnerName = p.partnerName || '';
    d.partnerAge = p.partnerAge != null ? Number(p.partnerAge) : null;
    d.partnerNationality = p.partnerNationality || '';
    d.partnerIncome = p.partnerIncome != null ? Number(p.partnerIncome) : null;
    d.familyChildren = [];
    var childAges = [];
    for (var ci = 1; ci <= d.childrenCount; ci++) {
      var child = {
        index: ci,
        name: p['child' + ci + 'Name'] || '',
        age: p['child' + ci + 'Age'] != null ? Number(p['child' + ci + 'Age']) : null,
        nationality: p['child' + ci + 'Nationality'] || '',
        relation: p['child' + ci + 'Relation'] || '',
        disability: p['child' + ci + 'Disability'] || '',
        disabilityRecognized: p['child' + ci + 'DisabilityRecognized'] || '',
        disabilityDegree: p['child' + ci + 'DisabilityDegree'] || '',
        disabilityExpiry: p['child' + ci + 'DisabilityExpiry'] || '',
        legalStatus: p['child' + ci + 'LegalStatus'] || '',
        timeInSpain: p['child' + ci + 'TimeInSpain'] || '',
        need: p['child' + ci + 'Need'] || '',
        lives: p['child' + ci + 'Lives'] || '',
        education: p['child' + ci + 'Education'] || ''
      };
      d.familyChildren.push(child);
      if (child.age != null) childAges.push(String(child.age));
    }
    d.childrenAges = childAges.length ? childAges.join(', ') : (p.childrenAges || '');
    d.spanishChildType = p.spanishChildType || (p.childrenSpanish === 'yes' || p.childrenSpanish === 'some' ? 'own' : '');
    d.hasSpanishChildInHousehold = p.childrenSpanish === 'yes' || p.childrenSpanish === 'some';
    d.hasSpanishChild = d.hasSpanishChildInHousehold && d.spanishChildType !== 'partner';
    d.spanishChildIsOwn = d.hasSpanishChild && d.spanishChildType !== 'partner';
    d.allChildrenSpanish = p.childrenSpanish === 'yes' && d.spanishChildType !== 'partner';
    d.spouseSpanish = p.spouseSpanish === 'yes' || p.spouseStatus === 'spanish';
    d.spouseEU = p.spouseStatus === 'eu';
    d.spouseResident = p.spouseStatus === 'resident' || p.spouseStatus === 'spanish' || p.spouseStatus === 'eu';

    d.marriedToSpanish = p.maritalStatus === 'casado' && d.spouseSpanish;
    d.registeredPartnerSpanish = p.maritalStatus === 'pareja_registrada' && d.spouseSpanish;
    d.stablePartnerSpanish = p.maritalStatus === 'pareja_estable' && d.spouseSpanish;
    d.hasSpanishSpouse = d.marriedToSpanish || d.registeredPartnerSpanish;
    d.cohabitation12 = p.cohabitation === '12plus';
    d.stablePartnerQualifies = d.stablePartnerSpanish
      ? (d.cohabitation12 || d.hasCommonChild ? true : (p.cohabitation === 'dontknow' ? null : false))
      : false;

    d.pregnant = p.pregnant === 'yes';
    d.pregnantBySpanish = d.pregnant && p.pregnantBySpanish === 'yes';
    d.permitKind = p.permitKind || '';
    d.studyWorkHours = p.studyWorkHours || null;
    d.familyAbroad = p.familyAbroad || '';
    var hasDisabilityDoc = Array.isArray(p.docsTramites) && p.docsTramites.indexOf('discapacidad') !== -1;
    d.disabilityClaimed = p.hasDisability === 'yes' || p.hasDisability === 'in_progress';
    d.disabilityRecognized = p.disabilityRecognized || (hasDisabilityDoc ? 'yes' : (p.hasDisability === 'yes' ? 'yes' : (p.hasDisability === 'in_progress' ? 'in_progress' : 'no')));
    d.disabilityInProgress = p.hasDisability === 'in_progress' || d.disabilityRecognized === 'in_progress';
    d.hasDisability = (p.hasDisability === 'yes' && d.disabilityRecognized !== 'no') || hasDisabilityDoc;
    d.disabilityDegree = p.disabilityDegree || null;
    d.disabilityExpiry = p.disabilityExpiry || '';
    d.disabilityCertificate = p.disabilityCertificate || null;
    d.partnerDisability = p.partnerDisability || null;
    d.partnerDisabilityRecognized = p.partnerDisabilityRecognized || (p.partnerDisability === 'yes' ? 'yes' : (p.partnerDisability === 'in_progress' ? 'in_progress' : 'no'));
    d.partnerHasDisability = p.partnerDisability === 'yes' && d.partnerDisabilityRecognized !== 'no';
    d.partnerDisabilityDegree = p.partnerDisabilityDegree || null;
    d.partnerDisabilityExpiry = p.partnerDisabilityExpiry || '';
    d.partnerLegalStatus = p.partnerLegalStatus || '';
    d.partnerTimeInSpain = p.partnerTimeInSpain || '';
    d.partnerNeed = p.partnerNeed || '';
    d.partnerDependency = p.partnerDependency === 'yes';
    d.householdOthers = Number(p.householdOthers) || 0;
    d.householdDetails = p.householdDetails || '';
    d.extraPeople = [];
    var householdSize = Number(p.householdSize) || 0;
    var knownHousehold = (d.couple ? 1 : 0) + d.childrenCount;
    var extraHousehold = Math.max(0, householdSize - knownHousehold);
    for (var ei = 1; ei <= extraHousehold; ei++) {
      d.extraPeople.push({
        index: ei,
        name: p['extra' + ei + 'Name'] || '',
        age: p['extra' + ei + 'Age'] != null ? Number(p['extra' + ei + 'Age']) : null,
        relation: p['extra' + ei + 'Relation'] || '',
        legalStatus: p['extra' + ei + 'LegalStatus'] || '',
        timeInSpain: p['extra' + ei + 'TimeInSpain'] || '',
        need: p['extra' + ei + 'Need'] || ''
      });
    }
    if (extraHousehold > d.householdOthers) d.householdOthers = extraHousehold;
    d.dependency = p.dependency === 'yes';
    d.dependencyInProgress = p.dependency === 'in_progress';
    d.familyNumerosa = p.familyNumerosa === 'yes';
    d.childrenDisabilityRecognized = p.childrenDisabilityRecognized || (p.childrenDisability === 'yes' ? 'yes' : (p.childrenDisability === 'in_progress' ? 'in_progress' : 'no'));
    d.childrenDisabilityDegree = p.childrenDisabilityDegree || null;
    d.childrenDisabilityExpiry = p.childrenDisabilityExpiry || '';
    d.hasDisabledChild = (p.childrenDisability === 'yes' && d.childrenDisabilityRecognized !== 'no') || d.familyChildren.some(function (c) { return c.disability === 'yes' && c.disabilityRecognized !== 'no'; });
    d.familyNumerosaConsistent = !d.familyNumerosa || d.childrenCount >= 3 || (d.childrenCount === 2 && d.hasDisabledChild);
    d.disabledChildInProgress = p.childrenDisability === 'in_progress' || d.familyChildren.some(function (c) { return c.disability === 'in_progress'; });
    d.foreignStudies = p.foreignStudies === 'yes';
    d.studiesLevel = p.studiesLevel || null;
    d.studiesHomologated = p.studiesHomologated || null;
    d.degree = p.degree || '';
    d.sepeCourses = Number(p.sepeCourses) || 0;
    d.sepeCoursesInProgress = Number(p.sepeCoursesInProgress) || 0;
    d.sepeCoursesDetails = p.sepeCoursesDetails || '';
    d.hasSepeCourses = d.sepeCourses > 0 || d.sepeCoursesInProgress > 0;
    d.childRecognized = p.childRecognized === 'yes' ? true : (p.childRecognized === 'no' ? false : null);
    d.childLivesWith = p.childLivesWithYou || null;
    d.childSupport = p.childSupport === 'yes' ? true : (p.childSupport === 'no' ? false : null);
    var ages = String(d.childrenAges || p.childrenAges || '').match(/\d+/g);
    d.hasMinorSpanishChild = d.hasSpanishChild ? (ages ? ages.some(function (n) { return Number(n) < 18; }) : null) : false;
    d.disabledChildAdult = d.hasDisabledChild ? (ages ? ages.some(function (n) { return Number(n) >= 18; }) : null) : false;
    d.disabledChildMinor = d.hasDisabledChild ? (ages ? ages.some(function (n) { return Number(n) < 18; }) : null) : false;
    d.parentSpanishMinor = null;
    if (d.hasSpanishChildInHousehold && !d.hasSpanishChild) d.parentSpanishMinor = false;
    if (d.hasSpanishChild) {
      if (d.childRecognized === false || d.hasMinorSpanishChild === false) d.parentSpanishMinor = false;
      else if (d.childLivesWith === 'yes' && d.childRecognized === true) d.parentSpanishMinor = true;
      else if (d.childLivesWith === 'compartida' && d.childSupport === true) d.parentSpanishMinor = true;
      else if (d.childLivesWith === 'no' && d.childSupport === true) d.parentSpanishMinor = true;
      else if (d.childLivesWith === 'no' && d.childSupport === false) d.parentSpanishMinor = false;
      else d.parentSpanishMinor = null;
    }

    d.hasAncestry = !!p.ancestry && p.ancestry !== 'none' && p.ancestry !== 'dontknow';
    d.ancestryLevel = d.hasAncestry ? p.ancestry : null;
    d.spanishParent = p.ancestry === 'parent' || p.ancestry === 'both';
    d.spanishGrandparent = p.ancestry === 'grandparent' || p.ancestry === 'both';
    d.ancestorOriginario = p.ancestorOrigin === 'originario';
    d.ancestorLostMarriage = p.ancestorOrigin === 'lost_marriage';
    d.ancestorNaturalized = p.ancestorOrigin === 'naturalizado';
    d.ancestryDocs = p.ancestryDocs || null;
    d.ancestryDocsOK = p.ancestryDocs === 'complete' || p.ancestryDocs === 'partial';
    d.ancestorBornSpain = p.ancestorBornSpain === 'yes' ? true : (p.ancestorBornSpain === 'no' ? false : null);
    d.bornInSpain = p.bornInSpain === 'yes';
    d.bornInTerritory = p.bornInSpanishTerritory && p.bornInSpanishTerritory !== 'no';

    d.familyInSpain = Array.isArray(p.familyInSpain) ? p.familyInSpain : [];
    d.hasFamilyInSpain = d.familyInSpain.some(function (v) { return v !== 'none'; });
    d.province = p.province || '';
    d.municipality = p.municipality || '';
    d.region = (RL.regionByProvince ? RL.regionByProvince(d.province) : null);

    /* tiempo en España */
    var now = RL.dates.today();
    d.entryDate = p.entryDate || '';
    var claimMonths = null;
    if (d.entryDate) claimMonths = (RL.dates.diff(d.entryDate, now) || 0) / 30.44;
    if (claimMonths == null && BUCKET_MONTHS[p.timeInSpain]) claimMonths = BUCKET_MONTHS[p.timeInSpain];
    d.monthsClaimed = claimMonths;

    d.empadronado = p.empadronado === 'yes';
    d.padronDate = p.empadronamientoSince || '';
    d.monthsEmpadronado = d.padronDate ? (RL.dates.diff(d.padronDate, now) || 0) / 30.44 : null;
    d.gaps = p.empadronamientoGaps || null;
    d.housing = p.housing || '';
    d.housingProof = p.housingProof || '';
    d.hasHousingProof = ['contract', 'room_contract', 'owner_auth', 'receipt', 'deed'].indexOf(d.housingProof) !== -1;
    d.continuousStay = d.gaps === 'no' || d.gaps === 'small' || d.gaps == null;

    d.monthsInSpain = d.monthsEmpadronado != null && claimMonths != null
      ? Math.min(d.monthsEmpadronado, claimMonths)
      : (d.monthsEmpadronado != null ? d.monthsEmpadronado : claimMonths);
    d.yearsInSpain = d.monthsInSpain == null ? null : d.monthsInSpain / 12;

    /* documentos y trámites que ya tiene */
    d.docsBase = Array.isArray(p.docsBase) ? p.docsBase : [];
    d.docsTramites = Array.isArray(p.docsTramites) ? p.docsTramites : [];
    d.docsEnCurso = Array.isArray(p.docsEnCurso) ? p.docsEnCurso : [];
    d.owns = function (k) {
      return d.docsBase.indexOf(k) !== -1 || d.docsTramites.indexOf(k) !== -1;
    };
    d.ownsCurrent = function (k) {
      return d.docsEnCurso.indexOf(k) !== -1;
    };
    d.hasDigitalCert = d.owns('certificado_digital');
    d.hasBankAccount = d.owns('cuenta_bancaria');
    d.hasSSNumber = d.owns('seguridad_social');
    d.hasVidaLaboral = d.owns('vida_laboral');
    d.hasHealthCard = d.owns('tarjeta_sanitaria');
    d.hasAntecedentesCert = d.owns('antecedentes');
    d.hasLibroFamilia = d.owns('libro_familia');
    d.hasJobSeeker = d.owns('demandante_empleo');
    d.hasRentContract = d.owns('contrato_alquiler');
    d.hasPayslips = d.owns('nominas');
    d.hasDisability = d.owns('discapacidad') || (p.hasDisability === 'yes' && d.disabilityRecognized !== 'no') || p.disabilityRecognized === 'yes';
    d.hasReturnAuth = d.owns('autorizacion_regreso');
    d.hasNieDoc = d.owns('nie') || d.owns('tie') || d.owns('tarjeta_ue') || p.hasNie === 'yes';
    d.hasPassportDoc = d.owns('pasaporte');
    d.pendingExtranjeria = d.owns('resguardo_extranjeria') || d.ownsCurrent('resguardo_extranjeria') || !!p.extranjeriaPendingType;
    d.pendingNationality = d.owns('resguardo_nacionalidad') || d.ownsCurrent('resguardo_nacionalidad') || !!p.nationalityPendingStage;
    d.tieHuellasCita = d.ownsCurrent('cita_huellas') || d.huellasAppointment === 'yes';
    d.tieInProcess = d.tieHuellasCita || d.ownsCurrent('tie_en_tramite');
    d.tieCardPending = d.ownsCurrent('cita_retirar_tie') || d.tiePickupAppointment === 'yes';
    d.tieRenewed = d.owns('tie_renovada');
    d.redCardRenewalPending = d.ownsCurrent('renovacion_tarjeta_roja');
    d.titleValidationPending = d.ownsCurrent('homologacion_titulo');
    d.titleValidated = d.owns('titulo_homologado');
    d.nationalityStage = p.nationalityPendingStage || null;
    d.extranjeriaType = p.extranjeriaPendingType || null;
    d.foreignStudies = d.foreignStudies || d.owns('titulo_homologado') || d.ownsCurrent('homologacion_titulo');
    if (d.owns('titulo_homologado')) d.studiesHomologated = 'yes';
    else if (d.ownsCurrent('homologacion_titulo')) d.studiesHomologated = 'in_progress';

    /* protección internacional */
    var stage = p.asylumStage;
    if (!stage) {
      if (d.ownsCurrent('hoja_blanca')) stage = 'solicitado';
      else if (d.ownsCurrent('tarjeta_roja')) stage = 'admitido';
      else if (d.ownsCurrent('cita_asilo')) stage = 'cita';
      else if (p.asylumRequested === 'yes') stage = 'solicitado';
      else if (p.asylumRequested === 'soon') stage = 'cita';
      else if (p.permitStatus === 'asylum') stage = 'solicitado';
      else stage = 'no';
    }
    d.asylumStage = stage;
    d.asylum = stage === 'solicitado' || stage === 'admitido';
    d.asylumSoon = stage === 'cita';
    d.asylumGranted = stage === 'concedido';
    d.asylumDenied = stage === 'denegado';
    d.asylumRenounced = stage === 'renunciado';
    d.asylumWithdrawn = stage === 'desistido';
    d.asylumExited = d.asylumRenounced || d.asylumWithdrawn;
    d.asylumHistory = ['solicitado', 'admitido', 'concedido', 'denegado', 'renunciado', 'desistido'].indexOf(stage) !== -1;
    d.asylumBefore90 = p.asylumBefore90 || '';
    var renDay = p.asylumRenouncedDay != null ? Number(p.asylumRenouncedDay) : null;
    var renMonth = p.asylumRenouncedMonth && p.asylumRenouncedMonth !== 'unknown' ? p.asylumRenouncedMonth : '';
    var renYear = p.asylumRenouncedYear != null ? Number(p.asylumRenouncedYear) : null;
    var renLegacy = String(p.asylumRenouncedDate || '');
    if (renDay == null && !renMonth && renYear == null && renLegacy) {
      var lm = /^(\d{4})-(\d{2})(?:-(\d{2}))?/.exec(renLegacy);
      if (lm) {
        renYear = Number(lm[1]);
        renMonth = lm[2];
        renDay = lm[3] ? Number(lm[3]) : null;
      }
    }
    d.asylumRenouncedDay = renDay;
    d.asylumRenouncedMonth = renMonth;
    d.asylumRenouncedYear = renYear;
    var two = function (n) { return Number(n) < 10 ? '0' + Number(n) : String(n); };
    d.asylumRenouncedDate = (renYear && renMonth)
      ? renYear + '-' + renMonth + '-' + (renDay ? two(renDay) : '01')
      : '';
    d.asylumRenouncedDateISO = d.asylumRenouncedDate;
    var renParts = [];
    if (renDay) renParts.push(two(renDay));
    if (renMonth) renParts.push(renMonth);
    if (renYear) renParts.push(String(renYear));
    d.asylumRenouncedDateText = renParts.length ? renParts.join('/') : 'fecha no indicada';
    d.hasRedCard = !d.asylumExited && (stage === 'admitido' || d.ownsCurrent('tarjeta_roja') || d.redCardRenewalPending);
    d.hasWhitePaper = !d.asylumExited && (stage === 'solicitado' || d.ownsCurrent('hoja_blanca'));
    d.hasAsylumAppointment = !d.asylumExited && (stage === 'cita' || d.ownsCurrent('cita_asilo'));
    d.asylumInProcess = !d.asylumGranted && !d.asylumDenied && !d.asylumExited &&
      (d.asylum || d.hasRedCard || d.hasWhitePaper || (p.permitStatus === 'asylum' && stage !== 'no'));
    if (!d.asylumInProcess && !d.asylumDenied && !d.asylumExited && d.ownsCurrent('cita_asilo')) d.asylumSoon = true;
    d.asylumProtected = d.asylumInProcess;
    d.asylumGrantedDate = p.asylumGrantedDate || '';
    d.tarjetaRojaExpiry = p.tarjetaRojaExpiry || (stage === 'admitido' ? (p.permitExpiry || '') : '');
    d.hojaBlancaDate = p.hojaBlancaDate || '';
    d.asylumCitaDate = p.asylumCitaDate || '';
    d.asylumWorkPermit = p.asylumWorkPermit || null;
    d.asylumDeniedDate = p.asylumDeniedDate || '';
    d.asylumAppeal = p.asylumAppeal || null;

    /* tiempo computable para arraigo: el tiempo como solicitante de asilo no cuenta */
    d.arraigoMonths = d.monthsInSpain;
    if (d.asylumInProcess) {
      d.arraigoMonths = null;
    } else if (d.asylumDenied) {
      if (d.asylumAppeal === 'yes' || !d.asylumDeniedDate) d.arraigoMonths = null;
      else d.arraigoMonths = Math.max(0, (RL.dates.diff(d.asylumDeniedDate, now) || 0) / 30.44);
    } else if (d.asylumExited) {
      if (d.postRenunciationGranted) {
        d.arraigoMonths = null;
      } else {
        var postBase = d.postRenunciationDateISO || d.asylumRenouncedDateISO;
        d.arraigoMonths = postBase
          ? Math.max(0, (RL.dates.diff(postBase, now) || 0) / 30.44)
          : null;
      }
    }

    /* permisos de residencia */
    d.permit = p.permitStatus || null;
    d.hasPermit = d.inSpain && ((!!p.permitStatus && p.permitStatus !== 'none' &&
      p.permitStatus !== 'expired' && p.permitStatus !== 'asylum') || d.owns('tie') || d.owns('tarjeta_ue'));
    if (d.asylumGranted) d.hasPermit = true;
    d.hasTieDoc = d.owns('tie') || d.hasPermit;
    d.permitExpired = p.permitStatus === 'expired';
    d.permitExpiry = p.permitExpiry || '';
    d.permitYears = p.permitYears || '';
    d.renewalMercurio = p.renewalMercurio || '';
    d.renewalApproved = p.renewalApproved || '';
    d.huellasAppointment = p.huellasAppointment || '';
    d.tiePickupAppointment = p.tiePickupAppointment || '';
    if (d.huellasAppointment === 'yes') d.tieHuellasCita = true;
    if (d.tiePickupAppointment === 'yes') d.tieCardPending = true;
    if (d.permitExpiry) {
      var expiryDays = RL.dates.diff(RL.dates.today(), d.permitExpiry);
      d.permitExpired = d.permitExpired || (expiryDays != null && expiryDays < 0);
      d.renewalDue = expiryDays != null && expiryDays <= 60;
    } else {
      d.renewalDue = false;
    }
    d.permitSince = p.permitSince || p.residenceApprovedDate || (d.asylumGranted ? d.asylumGrantedDate : '');
    d.monthsResident = d.permitSince ? (RL.dates.diff(d.permitSince, now) || 0) / 30.44 : null;
    d.residenceApproved = p.residenceApproved || '';
    d.residenceApprovedYears = p.residenceApprovedYears != null ? Number(p.residenceApprovedYears) : null;
    d.residenceApprovedDate = p.residenceApprovedDate || '';
    d.tieWaitingExpiry = p.tieWaitingExpiry || '';
    if (d.residenceApproved === 'yes') {
      d.hasPermit = true;
      d.irregular = false;
    }

    var touristLegal = (p.entryMode === 'tourist_free' || p.entryMode === 'tourist_visa') &&
      d.monthsInSpain != null && d.monthsInSpain <= 3;
    d.isSpanish = p.nationality === 'ES';
    d.irregular = d.inSpain && !d.hasPermit && !d.asylumInProcess && !d.asylumGranted && !touristLegal &&
      p.regularizationApplied !== 'granted' && !d.euCitizen;

    d.tourist = p.entryMode === 'tourist_free' || p.entryMode === 'tourist_visa';
    d.entryMode = p.entryMode || '';
    d.overstay = d.tourist && !d.asylumInProcess && !d.asylumGranted && d.monthsInSpain != null && d.monthsInSpain > 3;
    d.overstayDays = d.overstay && d.monthsInSpain != null ? Math.round(d.monthsInSpain * 30.44 - 90) : null;

    d.exitOrder = p.exitOrder === 'yes';
    d.leftSpain = p.leftSpain || null;
    d.postRenunciation = p.postRenunciationOutcome || '';
    d.postRenunciationDate = p.postRenunciationDate || '';
    d.postRenunciationDateISO = d.postRenunciationDate && String(d.postRenunciationDate).length === 7
      ? d.postRenunciationDate + '-01'
      : d.postRenunciationDate;
    d.postRenunciationGranted = ['arraigo_granted', 'arraigo_formacion_granted', 'arraigo_cuenta_ajena_granted', 'reg2026_granted', 'residencia_aprobada', 'other_permit'].indexOf(d.postRenunciation) !== -1;
    d.postRenunciationPending = ['arraigo_pending', 'reg2026_pending'].indexOf(d.postRenunciation) !== -1;
    d.postRenunciationDenied = ['arraigo_denied', 'reg2026_denied'].indexOf(d.postRenunciation) !== -1;
    d.regularization = p.regularizationApplied || 'none';
    d.regularizationGranted = p.regularizationApplied === 'granted';
    d.regularizationPending = p.regularizationApplied === 'pending';
    if (d.postRenunciation === 'reg2026_granted') {
      d.regularization = 'granted';
      d.regularizationGranted = true;
      d.regularizationPending = false;
    } else if (d.postRenunciation === 'reg2026_pending') {
      d.regularization = 'pending';
      d.regularizationGranted = false;
      d.regularizationPending = true;
    }
    if (d.postRenunciationGranted) {
      d.hasPermit = true;
      d.irregular = false;
    } else if (d.postRenunciation === 'irregular') {
      d.hasPermit = false;
      d.irregular = true;
    } else if (d.postRenunciationPending) {
      d.irregular = false;
      d.pendingExtranjeria = true;
    }
    if (d.postRenunciationGranted) d.arraigoMonths = null;
    if (d.hasPermit || d.residenceApproved === 'yes' || d.postRenunciationGranted) {
      d.asylumInProcess = false;
      d.asylumSoon = false;
      d.hasRedCard = false;
      d.hasWhitePaper = false;
      d.hasAsylumAppointment = false;
    }
    if (d.hasPermit || d.postRenunciationGranted || d.residenceApproved === 'yes' || d.asylumBefore90 === 'yes') {
      d.overstay = false;
      d.overstayDays = null;
    }

    d.workedMonths = Number(p.monthsWorked) || 0;
    d.hasCotizaciones = p.cotizaciones === 'yes' || p.cotizaciones === 'some';
    d.monthsCotizados = p.cotizaciones === 'yes' ? d.workedMonths : (p.cotizaciones === 'some' ? Math.round(d.workedMonths / 2) : 0);
    d.income = Number(p.monthlyIncome) || 0;
    d.savings = Number(p.savings) || 0;
    d.householdIncome = d.income;
    d.jobOffer = p.jobOffer || null;
    d.employment = p.employment || null;
    d.remoteIncome = Number(p.remoteIncome) || 0;
    d.remoteClientsOutside = p.remoteClientsOutside || null;
    d.studiesAdmission = p.studiesAdmission || null;
    d.exams = p.exams || null;
    d.examsOK = p.exams === 'both' || p.exams === 'not_needed' || (d.ibero && p.exams === 'ccse');
    d.examsPartial = p.exams === 'dele';
    d.outsideGoal = p.outsideGoal || null;
    d.degree = p.degree || null;
    d.hasDegree = !!p.degree && p.degree !== 'none' && p.degree !== 'eso';
    d.hasTertiary = ['fp_superior', 'grado', 'master', 'doctorado'].indexOf(p.degree) !== -1;
    d.homologated = p.degreeHomologated === 'yes';
    d.experience = Number(p.yearsExperience) || 0;
    d.spanishNative = p.spanishLevel === 'nativo';
    d.spanishGood = p.spanishLevel === 'nativo' || p.spanishLevel === 'alto';

    d.criminalSpain = p.criminalSpain || null;
    d.criminalOrigin = p.criminalOrigin || null;
    d.criminalSpainWhen = p.criminalSpainWhen || null;
    d.criminalOriginWhen = p.criminalOriginWhen || null;
    d.cleanSpain = p.criminalSpain === 'no';
    d.cleanOrigin = p.criminalOrigin === 'no';
    d.criminalUnknown = p.criminalSpain === 'dontknow' || p.criminalOrigin === 'dontknow';
    d.insurance = p.healthInsurance || null;
    d.hasInsurance = p.healthInsurance === 'private' || p.healthInsurance === 'public';
    d.victim = p.victimViolence === 'yes';
    d.protectionNeed = p.protectionNeed === 'yes';

    d.goals = Array.isArray(p.goals) ? p.goals : [];
    d.wants = function (g) { return d.goals.indexOf(g) !== -1; };
    d.horizon = p.horizon || null;
    d.urgent = p.horizon === 'urgent';
    d.canLeave = p.canLeaveSpain || null;

    /* IPREM 2026: 600 €/mes · 7.200 €/año (12 pagas) · 8.400 €/año (14 pagas) */
    d.iprem = { month: 600, year12: 7200, year14: 8400 };
    d.nonLucrativeNeed = d.iprem.year12 * 4;           // 28.800 €/año (400 % sobre 12 pagas)
    d.nonLucrativeNeedMonth = d.iprem.month * 4;        // 2.400 €/mes

    d.hasAnyRouteData = !!(p.nationality && (d.inSpain ? p.entryMode : p.outsideGoal));
    d.familyAdvice = [];
    function addFamilyAdvice(role, name, status, time, need, extra, disabled) {
      var label = status || 'sin indicar';
      var text = '';
      var second = '';
      if (status === 'spanish') text = 'No necesita autorización de extranjería: DNI o pasaporte. Su nacionalidad puede abrir la vía de familiar de español a quien cumpla el vínculo.';
      else if (status === 'eu') text = 'No necesita autorización de residencia: certificado de registro y empadronamiento.';
      else if (status === 'residence') text = 'Tiene residencia española: revisa vigencia y renovación. No se reagrupa desde dentro; si quiere cambiar de estatus, hay que modificar.';
      else if (status === 'expired') text = 'Residencia caducada: revisa renovación o recuperación según el caso. No es una reagrupación.';
      else if (status === 'asylum') text = 'Asilo en trámite: seguimiento de la solicitud. Mientras esté abierto no se plantea arraigo.';
      else if (status === 'irregular') text = 'En España sin autorización: valorar arraigo (2 años de permanencia), familiar de español/UE si cumple vínculo, o circunstancias excepcionales. No se puede reagrupar desde dentro.';
      else if (status === 'tourist') text = 'Como turista no puede trabajar ni quedarse indefinidamente. La reagrupación exige estar fuera y obtener visado.';
      else if (status === 'outside') text = 'Está fuera de España: solo se puede reagrupar si el titular es residente y cumple los requisitos; también puede pedir visado propio de estudio o trabajo.';
      else if (status === 'dontknow') text = 'Falta saber su situación legal. Sin ese dato no se pueden valorar sus opciones.';
      else text = 'Falta indicar su situación legal. Sin ese dato no se pueden valorar sus opciones.';
      if (need === 'regularizar') text += ' Quiere regularizarse.';
      else if (need === 'trabajar') text += ' Quiere trabajar: revisa si su autorización lo permite o si necesita modificación.';
      else if (need === 'estudiar') text += ' Quiere estudiar: revisa estancia por estudios o compatibilidad con su permiso.';
      else if (need === 'renovar') text += ' Quiere renovar: prepara la renovación antes del vencimiento.';
      else if (need === 'nacionalidad') text += ' Quiere nacionalidad: revisa el tiempo de residencia legal y los exámenes.';
      else if (need === 'reagrupar') text += ' Quiere venir a España: la reagrupación solo procede desde fuera.';
      if (extra) text += ' ' + extra;
      if (disabled) second = 'Segunda opción a valorar: la discapacidad por sí sola no regulariza, pero puede influir en la valoración de vulnerabilidad, dependencia o ayudas. Revísalo con un abogado o servicios sociales antes de presentar nada.';
      d.familyAdvice.push({ role: role, name: name || 'Sin nombre', status: label, time: time || '', need: need || '', text: text, second: second });
    }
    if (d.couple) addFamilyAdvice('pareja', d.partnerName, d.partnerLegalStatus, d.partnerTimeInSpain, d.partnerNeed, '', d.partnerHasDisability);
    (d.familyChildren || []).forEach(function (c) {
      addFamilyAdvice('hijo', c.name, c.legalStatus, c.timeInSpain, c.need,
        c.education ? 'Estudios: ' + (RL.education.child[c.education] || c.education) + '.' : '',
        c.disability === 'yes');
    });
    (d.extraPeople || []).forEach(function (x) {
      addFamilyAdvice('otro', x.name, x.legalStatus, x.timeInSpain, x.need, x.relation ? 'Relación: ' + x.relation + '.' : '');
    });

    return d;
  };

  /* ─────────── evaluación de una vía ─────────── */
  RL.evalRoute = function (route, p, d) {
    var reqs = (route.requirements || []).map(function (r, i) {
      var val;
      try { val = r.test(p, d); } catch (e) { val = null; }      return {
        id: r.id || (route.id + '_r' + i),
        label: typeof r.label === 'function' ? r.label(p, d) : r.label,
        fix: typeof r.fix === 'function' ? r.fix(p, d) : (r.fix || ''),
        unknown: typeof r.unknown === 'function' ? r.unknown(p, d) : (r.unknown || ''),
        critical: r.critical !== false,
        actionable: r.actionable !== false,
        status: val === true ? 'ok' : (val === false ? 'no' : 'unknown')
      };
    });

    var blockers = (route.blockers || []).filter(function (b) {
      try { return b.test(p, d) === true; } catch (e) { return false; }
    }).map(function (b) { return b.label; });

    if (d.isSpanish && !route.allowSpanish) {
      blockers.push('Ya tienes la nacionalidad española: no necesitas esta vía.');
    } else if (d.euCitizen && !route.allowEU) {
      blockers.push('Como ciudadano/a de la UE/EEE no necesitas autorización de residencia ni visado: te basta el certificado de registro.');
    }

    var crit = reqs.filter(function (r) { return r.critical; });
    var fails = crit.filter(function (r) { return r.status === 'no'; });
    var unknowns = crit.filter(function (r) { return r.status === 'unknown'; });
    var oks = crit.filter(function (r) { return r.status === 'ok'; });

    var status;
    if (route.availability === 'closed') {
      status = 'closed';
    } else if (blockers.length) {
      status = 'blocked';
    } else if (!fails.length && !unknowns.length) {
      status = 'ready';
    } else if (!fails.length) {
      status = 'likely';
    } else if (fails.every(function (r) { return r.actionable; }) && fails.length <= 2) {
      status = 'almost';
    } else {
      status = 'unlikely';
    }

    var base = route.weight || 20;
    var statusPoints = { ready: 55, likely: 42, almost: 26, unlikely: 0, blocked: 0, closed: 0 }[status] || 0;
    var goalBonus = (route.goals || []).some(function (g) { return d.wants(g); }) ? 12 : 0;
    var urgencyBonus = d.urgent ? 3 : 0;
    var score = clamp(base + statusPoints + goalBonus + urgencyBonus - fails.length * 3 - unknowns.length * 1, 0, 95);
    if (status === 'blocked' || status === 'closed') score = 0;

    var fit = '';
    try { fit = route.fit ? route.fit(p, d) : ''; } catch (e) { fit = ''; }

    return {
      route: route,
      status: status,
      score: score,
      reqs: reqs,
      fails: fails,
      unknowns: unknowns,
      oks: oks,
      blockers: blockers,
      fit: fit,
      total: crit.length,
      metCount: oks.length
    };
  };

  RL.evaluate = function (profile) {
    var p = profile || {};
    var d = RL.derive(p);
    var results = (RL.routes || []).map(function (r) { return RL.evalRoute(r, p, d); });
    return { p: p, d: d, results: results };
  };

  /* ─────────── ventanas de oportunidad ─────────── */
  function buildWindows(p, d) {
    var out = [];
    var today = RL.dates.today();
    function add(tone, title, body) { out.push({ tone: tone, title: title, body: body }); }
    function days(date) { return date ? RL.dates.diff(today, date) : null; }

    var vd = days(p.visaExpiry);
    if (vd != null) {
      if (vd >= 0 && vd <= 90) {
        add('warn', 'Tu visado/estancia caduca en ' + vd + ' días',
          'Antes de que caduque, comprueba si puedes renovar o modificar. No esperes a estar irregular. Si tu pareja es española o de la UE, la vía familiar no exige esperar 2 años.');
      } else if (vd < 0 && vd >= -90) {
        add('warn', 'Tu visado/estancia caducó hace ' + Math.abs(vd) + ' días',
          'Puede que aún puedas solicitar alguna vía, pero el margen se estrecha y la sobreestancia queda registrada. Consulta antes de que pase más tiempo.');
      } else if (vd < -90) {
        add('bad', 'Tu visado/estancia caducó hace más de 90 días',
          'No lo ignores: una estancia irregular puede afectar a futuras solicitudes. Revisa las vías posibles y consulta con un abogado o entidad social.');
      }
    }

    var pd = days(p.permitExpiry);
    if (pd != null) {
      if (pd >= 0 && pd <= 60) {
        add('warn', 'Tu TIE caduca en ' + pd + ' días: ya puedes presentar la renovación',
          'Puedes presentar la renovación administrativa por Mercurio o sede hasta 2 meses antes del vencimiento. Eso NO es la TIE física: la toma de huellas y la tarjeta solo se pueden hacer desde el día en que vence la tarjeta, nunca antes. Si te citan antes de esa fecha, no te la hacen.');
      } else if (pd < 0 && pd >= -90) {
        add('warn', 'Tu TIE caducó hace ' + Math.abs(pd) + ' días: aún estás dentro de los 3 meses',
          'Presenta la renovación cuanto antes. La toma de huellas y la TIE física ya se pueden hacer desde que venció; pide cita ICPP y lleva la resolución, la TIE vieja y la tasa 790-012. Si esperas al día 91, el plazo ordinario se complica.');
      } else if (pd < -90) {
        add('bad', 'Tu TIE caducó hace más de 90 días',
          'El plazo ordinario de renovación pasó. Revisa la vía de «segunda oportunidad» y consulta con un abogado; no presentes cualquier cosa.');
      }
    }

    if (d.inSpain && d.arraigoMonths != null && d.arraigoMonths < 24) {
      var falta = Math.ceil(24 - d.arraigoMonths);
      add('info', 'Te faltan ' + falta + ' meses para los 2 años de arraigo',
        'Mantén el padrón, la permanencia y las pruebas. No salgas más de 90 días ni dejes que caduque un permiso. Si tienes pareja española/UE o un hijo español, no esperes: la vía familiar no exige los 2 años. El tiempo como solicitante de asilo no cuenta para el arraigo.');
    }

    if (d.entryMode === 'studies') {
      add('info', 'Con estudios puedes pasar a trabajo antes de que caduque',
        'Trabajo compatible hasta 30 h/semana. La modificación a residencia y trabajo se pide antes de que caduque la estancia o dentro de los 3 meses posteriores. El tiempo de estudios no cuenta al 100 % para la nacionalidad.');
      if (d.studyWorkHours === 'more30') {
        add('bad', 'Trabajas más de 30 h con estudios',
          'Superar el límite puede extinguir la estancia por estudios y generar problemas laborales. Reduce las horas y regulariza la modificación antes de presentar la renovación.');
      }
    }

    if (d.entryMode === 'tourist_free' || d.entryMode === 'tourist_visa') {
      add('warn', 'Con turismo no puedes trabajar ni cambiar a residencia',
        'El turista no tiene una estancia que modificar. No dejes pasar los 90 días: la sobreestancia se registra y complica futuras solicitudes. Si tu pareja es española/UE, la vía familiar no exige 2 años.');
    }

    if (d.asylumStage === 'solicitado' || d.asylumStage === 'admitido') {
      add('info', 'A los 6 meses puedes solicitar autorización de trabajo',
        'Renueva la hoja blanca o la tarjeta roja antes de que caduque y guarda todos los resguardos. Si el expediente sigue vivo, no salgas de España sin asesorarte.');
    }

    if (d.hasSpanishSpouse || d.stablePartnerSpanish) {
      add('ok', 'La vía familiar no exige esperar 2 años',
        'Si estás casado/a, eres pareja registrada/estable o progenitor de un menor español, puedes solicitar la tarjeta de familiar de español ya. No es automática: hay que probar el vínculo y la convivencia.');
    }

    if (d.pregnantBySpanish && !d.hasSpanishChild) {
      add('info', 'Embarazo: el hijo será español si el padre lo reconoce',
        'El embarazo no te regulariza. Cuando nazca, si el padre español reconoce al hijo, podrías solicitar como progenitor de menor español si el niño queda a tu cargo. Ve preparando el reconocimiento y la documentación.');
    }

    return out.slice(0, 8);
  }

  /* ─────────── plan completo ─────────── */
  RL.buildPlan = function (profile) {
    var ev = RL.evaluate(profile);
    var p = ev.p, d = ev.d;
    var results = ev.results;

    var open = results.filter(function (r) { return r.status !== 'blocked' && r.status !== 'closed'; });
    var decision = (RL.decision && RL.decision.decide) ? RL.decision.decide(results, p, d, 60) : null;
    var recommended = decision ? decision.ordered.slice(0, 4) : open.filter(function (r) {
      return !r.route.informational && r.score >= 60 &&
        (r.status === 'ready' || r.status === 'likely' || r.status === 'almost');
    }).sort(function (a, b) { return b.score - a.score; }).slice(0, 4);
    var best = recommended;
    var more = open.filter(function (r) { return best.indexOf(r) === -1 && r.status !== 'unlikely' && !r.route.informational; })
      .sort(function (a, b) { return RL.decision ? RL.decision.compare(a, b, d) : b.score - a.score; }).slice(0, 5);
    var discarded = results.filter(function (r) { return r.status === 'blocked' || r.status === 'unlikely'; })
      .sort(function (a, b) { return a.score - b.score; });

    var alerts = buildAlerts(p, d, results);
    var actions = buildActions(p, d, best);
    var timeline = buildTimeline(p, d, best);
    var checklist = buildChecklist(best);

    return {
      p: p, d: d, results: results,
      recommended: best,
      more: more,
      discarded: discarded,
      alerts: alerts,
      actions: actions,
      timeline: timeline,
      checklist: checklist,
      decision: decision,
      confidence: decision ? decision.confidence : null,
      safety: decision ? decision.safety : [],
      windows: buildWindows(p, d),
      reality: (RL.decision && RL.decision.reality) ? RL.decision.reality({
        recommended: best, confidence: decision ? decision.confidence : null, d: d
      }) : null,
      primaryReason: decision ? decision.primaryReason : '',
      generatedAt: RL.dates.today(),
      summary: buildSummary(p, d, best)
    };
  };

  /* ─────────── resumen en una frase ─────────── */
  function buildSummary(p, d, best) {
    if (d.isSpanish) return 'Eres español/a: no necesitas regularizar nada. Te explicamos qué documentación te sirve si vuelves o te estableces en España.';
    if (!best.length) {
      if (d.inSpain && d.irregular) return 'Con los datos actuales no hay una vía abierta a corto plazo. Hay trabajo de preparación que sí puedes hacer desde ya: empadronarte, reunir documentos y evitar salir de España.';
      return 'Con los datos actuales no aparece una vía clara. Revisa las preguntas marcadas como «no lo sé» y vuelve a calcular el plan.';
    }
    var top = best[0].route;
    var n = best.length;
    if (best[0].status === 'ready' || best[0].status === 'likely') {
      return 'Tu mejor opción ahora mismo es ' + top.title + '.' +
        (n > 1 ? ' Tienes ' + n + ' vías compatibles, ordenadas por encaje y urgencia.' : '');
    }
    return 'Tu camino más claro pasa por ' + top.title + '. Todavía te faltan requisitos, pero puedes empezar a prepararlos desde ya.' +
      (n > 1 ? ' Hay ' + n + ' vías compatibles en total.' : '');
  }

  /* ─────────── alertas ─────────── */
  function buildAlerts(p, d, results) {
    var a = [];
    function add(tone, title, body, tag) { a.push({ tone: tone, title: title, body: body, tag: tag || '' }); }

    if (d.minor) {
      add('warn', 'Eres menor de edad',
        'Las reglas cambian: hay vías de tutela y de nacionalidad específicas. Este plan es orientativo; acude a los servicios sociales o a una entidad especializada antes de nada.', 'prioridad');
    }

    if (d.asylumGranted) {
      add('ok', 'Tienes protección internacional concedida',
        'Tienes residencia como beneficiario de protección internacional. Si eres refugiado, a los 5 años puedes solicitar la nacionalidad por residencia; el resto de protecciones tienen plazos propios.', 'info');
    } else if (d.asylumInProcess) {
      add('info', 'Tu solicitud de asilo está en curso',
        'Mientras se tramita, tu estancia es legal. Controla la caducidad de la hoja blanca o de la tarjeta roja y solicita autorización de trabajo a los 6 meses si no hay denegación.', 'trámite');
      if (d.tarjetaRojaExpiry) {
        var daysRed = RL.dates.diff(RL.dates.today(), d.tarjetaRojaExpiry);
        if (daysRed != null && daysRed <= 60) {
          add(daysRed < 0 ? 'bad' : 'warn',
            daysRed < 0 ? 'Tu tarjeta roja está caducada' : 'Tu tarjeta roja caduca pronto',
            'Fecha: ' + RL.fmt.date(d.tarjetaRojaExpiry) + '. Pide cita para renovarla cuanto antes; sin tarjeta en vigor se bloquean trámites y el trabajo.', 'plazo');
        }
      }
      if (d.hojaBlancaDate) {
        var hbMonths = (RL.dates.diff(d.hojaBlancaDate, RL.dates.today()) || 0) / 30.44;
        if (hbMonths >= 6 && d.asylumWorkPermit !== 'yes') {
          add('info', 'Puedes solicitar autorización de trabajo',
            'Han pasado más de 6 meses desde tu solicitud. Si no hay denegación, puedes pedir autorización de trabajo.', 'plazo');
        }
      }
    } else if (d.asylumSoon) {
      add('warn', 'Tienes cita para solicitar asilo',
        'No faltes. Lleva pasaporte, documentación y pruebas. Si no acudes, puedes perder el turno.', 'prioridad');
    } else if (d.asylumRenounced || d.asylumWithdrawn) {
      add('warn', d.asylumWithdrawn ? 'Desististe del asilo' : 'Renunciaste a la protección internacional',
        'No estás en trámite de asilo. El tiempo como solicitante no cuenta para el arraigo; la referencia es la fecha de salida' +
        (d.asylumRenouncedDateISO ? ': ' + d.asylumRenouncedDateText + ' (aproximada)' : ': ' + d.asylumRenouncedDateText) +
        '. Guarda el documento y revisa qué autorización posterior tienes.', 'plazo');
    } else if (d.asylumDenied && !d.postRenunciationGranted && !d.hasPermit) {
      add('bad', 'Tu solicitud de asilo fue denegada',
        'Revisa el plazo de recurso con un abogado o una entidad especializada. También puedes valorar arraigo o circunstancias excepcionales.', 'riesgo');
    }
    if (d.postRenunciationGranted) {
      add('ok', 'Después del asilo obtuviste una autorización',
        'Ya no estás en trámite de asilo ni en situación irregular. Revisa el tipo, los años aprobados y la vigencia de tu TIE; el tiempo como solicitante no cuenta para el arraigo.', 'info');
    } else if (d.postRenunciationPending) {
      add('info', 'Tienes una solicitud posterior en trámite',
        'Después del asilo presentaste arraigo o regularización. No puedes pedir otro arraigo mientras el expediente esté abierto; controla requerimientos y resolución.', 'trámite');
    } else if (d.postRenunciation === 'irregular') {
      add('warn', 'Sigues irregular después de salir del asilo',
        'El tiempo como solicitante no cuenta para el arraigo. La referencia es la fecha de salida o, si la tienes, la de la resolución posterior. Valora arraigo, regularización cerrada o vía familiar.', 'riesgo');
    } else if (d.postRenunciationDenied) {
      add('warn', 'Tu solicitud posterior fue denegada',
        'Revisa el plazo de recurso y las alternativas. No presentes otra solicitud sin comprobar antes si hay un expediente abierto o una prohibición.', 'riesgo');
    }

    if (d.familyNumerosa && !d.familyNumerosaConsistent) {
      add('warn', 'Familia numerosa: revisa los hijos cargados',
        'Has marcado familia numerosa, pero no constan al menos 3 hijos (o 2 si uno tiene discapacidad). Revisa que estén todos cargados; no volveremos a preguntarte si sois familia numerosa.', 'documentos');
    }
    if (d.pendingExtranjeria) {
      add('info', 'Tienes un expediente de extranjería abierto',
        'Mientras esté abierto no puedes solicitar arraigo (art. 126.h). Sigue el expediente y guarda todos los resguardos.', 'trámite');
    }
    if (d.pendingNationality) {
      add('info', 'Tienes una solicitud de nacionalidad en trámite',
        'Guarda el resguardo y atiende los requerimientos. La resolución legal orientativa es de 1 año.', 'trámite');
    }

    if (d.isSpanish) {
      add('ok', 'Eres español/a',
        'No necesitas visado ni autorización de residencia. Si vuelves a España, te bastan el DNI o pasaporte, el certificado de nacimiento español y el empadronamiento. Para trabajar, alta en la Seguridad Social.', 'info');
    } else if (d.euCitizen) {
      add('info', 'Eres ciudadano/a de la UE/EEE',
        'Tienes derecho de residencia en España sin visado ni autorización. Solo necesitas inscribirte en el Registro Central de Extranjeros (certificado de registro) y empadronarte.', 'info');
    }

    if (d.inSpain && d.irregular) {
      add('bad', 'Estás en situación irregular',
        'No eres «ilegal»: estás en situación irregular. Lo ilegal son las conductas (entrar sin autorización, trabajar sin permiso). Puedes seguir aquí, pero no puedes trabajar legalmente y salir de España te expone a una prohibición de entrada. La prioridad es no salir, empadronarte y construir la vía más corta.', 'riesgo');
    }
    if (d.overstay && d.overstayDays > 0) {
      var yearsOver = Math.floor(d.overstayDays / 365);
      var span = yearsOver >= 1
        ? 'más de ' + yearsOver + (yearsOver === 1 ? ' año' : ' años')
        : RL.fmt.num(d.overstayDays) + ' días';
      add('warn', 'Has superado los 90 días de estancia',
        'Como turista solo puedes estar 90 días en cualquier periodo de 180. Llevas ' + span + ' de sobreestancia: no implica expulsión automática, pero no puedes trabajar y complica cualquier trámite.', 'plazo');
    }
    if (d.exitOrder === 'yes') {
      add('bad', 'Tienes una orden de salida o prohibición de entrada',
        'Antes de cualquier trámite, revisa el alcance y los plazos con un abogado. Algunas solicitudes suspenden la expulsión; otras no.', 'riesgo');
    }
    if (d.inSpain && !d.empadronado && d.irregular) {
      add('warn', 'No estás empadronado/a',
        'Sin padrón no puedes acreditar permanencia ni acceder a casi ninguna vía. Es gratis y se pide en el ayuntamiento; pide un certificado de empadronamiento histórico si llevas tiempo.', 'acción');
    }
    if (d.regularizationPending) {
      add('info', 'Tienes la regularización de 2026 en trámite',
        'Mientras se resuelve, mantén la documentación al día y no salgas de España sin comprobar antes si puedes volver. El silencio y los plazos de subsanación son clave.', 'trámite');
    }
    if (d.regularization === 'no' && d.inSpain && d.irregular && d.monthsInSpain != null && d.monthsInSpain >= 5) {
      add('info', 'La regularización extraordinaria ya cerró',
        'La ventana de solicitud terminó el 30 de junio de 2026 y no se ha reabierto. Si llegaste antes del 1 de enero de 2026 y no la pediste, tu camino pasa por las vías ordinarias (arraigo, familiar, asilo…).', 'plazo');
    }
    if (d.hasAncestry && p.ancestryDocs === 'none') {
      add('warn', 'Tienes ascendencia española pero no documentos',
        'Aun así merece la pena intentarlo: el Registro Civil puede localizar partidas. Empieza por la partida de nacimiento española del antepasado.', 'acción');
    }
    if (d.permitExpired) {
      add('warn', 'Tu permiso está caducado',
        'Renovar fuera de plazo es posible en algunos supuestos (incluida la «segunda oportunidad»), pero el silencio y los efectos cambian. Revisa la fecha exacta.', 'plazo');
    }
    if (d.renewalDue && d.renewalMercurio === 'no') {
      add('warn', 'No has presentado la renovación y tu TIE vence pronto',
        'La renovación administrativa se presenta por Mercurio o sede hasta 2 meses antes. No esperes al vencimiento: si caduca sin renovación, puedes quedarte sin autorización mientras se resuelve.', 'plazo');
    } else if (d.renewalApproved === 'pending') {
      add('info', 'Renovación presentada: pendiente de aprobación',
        'Controla la resolución y los requerimientos. La TIE física y las huellas solo se piden desde el día en que vence la tarjeta, nunca antes.', 'trámite');
    } else if (d.renewalApproved === 'yes' && d.huellasAppointment !== 'yes') {
      add('info', 'Renovación aprobada: pide cita para huellas desde el vencimiento',
        'No pidas huellas antes de que venza la TIE: la policía no puede tramitarlas. Desde el día del vencimiento, pide cita ICPP y lleva resolución, TIE vieja, foto y tasa 790-012.', 'plazo');
    } else if (d.huellasAppointment === 'yes' && d.tiePickupAppointment !== 'yes') {
      add('info', 'Huellas hechas: prepara la cita de retirada de la TIE',
        'La tarjeta suele tardar 30-45 días. Cuando esté disponible, pide otra cita ICPP en la misma comisaría; lleva el resguardo, el pasaporte y la TIE anterior.', 'plazo');
    } else if (d.tiePickupAppointment === 'yes') {
      add('ok', 'Tienes cita para retirar la nueva TIE',
        'Acude con el resguardo de huellas, el pasaporte y la TIE anterior si te la pidieron. Revisa nombre, NIE, tipo y fechas antes de salir.', 'info');
    }
    if (d.criminalSpain === 'yes' || d.criminalOrigin === 'yes') {
      var whenTxt = d.criminalOriginWhen || d.criminalSpainWhen;
      var whenMap = { lt1: 'hace menos de 1 año', '1to5': 'entre 1 y 5 años', '5to10': 'entre 5 y 10 años', gt10: 'hace más de 10 años' };
      var whenLabel = whenMap[whenTxt] || whenTxt;
      add('warn', 'Tienes antecedentes penales declarados' + (whenLabel ? ' (' + whenLabel + ')' : ''),
        'No todas las vías los excluyen ni todos los delitos cuentan igual. Se valora la gravedad, la cancelación y la rehabilitación; un abogado puede revisarlo. No lo ocultes. Los delitos sexuales con menores son especialmente graves.', 'riesgo');
    }
    if (d.protectionNeed) {
      add('info', 'Has indicado que temes volver a tu país',
        'Puede que tengas derecho a protección internacional. Es una vía distinta y urgente: si estás en España, puedes solicitarla aunque estés irregular. Acude a ACNUR o CEAR.', 'prioridad');
    }
    if (d.victim) {
      add('info', 'Has indicado violencia de género o trata',
        'Existen autorizaciones de residencia específicas y recursos de protección. No tienes que denunciar para informarte: llama al 016 o acude a una entidad especializada.', 'prioridad');
    }
    if (d.outside && d.visaFree === false) {
      add('info', 'Necesitas visado para entrar como turista',
        'Tu nacionalidad no está exenta de visado Schengen. Un visado de turista no permite trabajar ni quedarse más de 90 días. Si tu plan es quedarte, hay que diseñarlo antes de entrar.', 'entrada');
    }
    return a;
  }

  /* ─────────── acciones transversales ─────────── */
  function buildActions(p, d, best) {
    var acts = [];
    function add(id, title, body, when, tag) { acts.push({ id: id, title: title, body: body, when: when, tag: tag }); }

    if (d.inSpain) {
      if (!d.empadronado) add('padron', 'Empadrónate cuanto antes',
        'Ve al ayuntamiento con tu pasaporte y, si puedes, un contrato de alquiler o una autorización del dueño. Pide el certificado de empadronamiento y guarda todos los recibos: es tu prueba de permanencia.', 'Esta semana', 'base');
      else add('padron-cert', 'Consigue el certificado de empadronamiento histórico',
        'Pide en el ayuntamiento un certificado con todas tus altas y bajas. Es el documento que más pesa para acreditar permanencia continuada.', 'Este mes', 'base');
      if (p.hasNie !== 'yes') add('nie', 'Saca tu NIE si no lo tienes',
        'Se pide en comisaría con cita previa (o en el consulado, según el caso). No te legaliza, pero lo necesitas para trabajar, alquilar y casi cualquier trámite.', 'Este mes', 'base');
      if (!d.hasDigitalCert) add('digital', 'Saca el certificado digital o Cl@ve',
        'Te permite hacer trámites online sin colas: renovaciones, nacionalidad, consulta de expedientes. Se pide con tu NIE o TIE.', 'Este mes', 'trámite');
      if (!d.hasBankAccount) add('banco', 'Abre una cuenta bancaria',
        'Con pasaporte y NIE puedes abrir una cuenta. Sirve para acreditar medios, cobrar nóminas y guardar los justificantes de ingresos.', 'Este mes', 'documentos');
      if (!d.hasSSNumber && (d.workedMonths > 0 || d.employment === 'temporary' || d.employment === 'permanent' || d.employment === 'self')) add('ss', 'Pide tu número de la Seguridad Social',
        'Lo necesitas para trabajar y cotizar. Se solicita en la Tesorería General de la Seguridad Social con pasaporte y NIE.', 'Antes de trabajar', 'trámite');
      if (d.workedMonths > 0 && !d.hasVidaLaboral) add('vida-laboral', 'Descarga tu informe de vida laboral',
        'Prueba tus cotizaciones para arraigo sociolaboral, nacionalidad o larga duración. Es gratis en la sede de la Seguridad Social.', 'Este mes', 'documentos');
      if (!d.hasHealthCard) add('sanitaria', 'Pide la tarjeta sanitaria',
        'Con el empadronamiento puedes solicitar asistencia sanitaria en tu centro de salud. Es clave para ti y para tus hijos.', 'Este mes', 'base');
      if (d.hasDisability) add('discapacidad', 'Ten a mano tu certificado de discapacidad',
        'Puede abrir vías por circunstancias excepcionales y mejorar la valoración de vulnerabilidad. Lleva una copia a tu cita.', 'Cuando lo necesites', 'documentos');
      if (!d.hasRentContract && !d.hasHousingProof) {
        var housingMsg = 'Contrato de alquiler, autorización del propietario, recibos o certificado de convivencia. Te sirve para el padrón y para acreditar arraigo.';
        if (d.housing === 'alquiler_habitacion') housingMsg = 'Pide el contrato de la habitación y guarda los recibos o transferencias. Para el padrón puede hacer falta también una autorización del titular.';
        else if (d.housing === 'familiar_amigo') housingMsg = 'Pide al familiar o amigo una autorización firmada, el certificado de convivencia y algún recibo. Sin prueba de domicilio, el padrón y el arraigo se complican.';
        else if (d.housing === 'propietario_hipoteca' || d.housing === 'propietario') housingMsg = 'Guarda la escritura, la hipoteca o el recibo del IBI. Si no vives solo, añade la autorización o el certificado de convivencia.';
        add('vivienda', 'Consigue una prueba de domicilio', housingMsg, 'Este mes', 'documentos');
      }
      if (d.tieHuellasCita) add('tie-huellas', 'Prepara la cita de huellas de la TIE',
        'Lleva pasaporte, TIE anterior, foto, resolución y tasa 790-012. La cita es para huellas; la tarjeta física no se puede adelantar al vencimiento.', 'Fecha de la cita', 'documentos');
      else if (d.tieInProcess) add('tie-en-tramite', 'Sigue la TIE física',
        'Ya tienes huellas tomadas o la tarjeta en tramitación. Guarda el resguardo y consulta el estado; no pidas otra cita de huellas.', 'Cada 2-3 semanas', 'trámite');
      if (d.tieCardPending) add('tie-retirar', 'Pide cita para retirar la TIE',
        'La TIE está aprobada y pendiente de recogida. Pide cita ICPP y lleva pasaporte, resguardo y la TIE anterior si te la pidieron.', 'Cuando esté disponible', 'trámite');
      if (d.redCardRenewalPending) add('roja-renovacion', 'Sigue la renovación de la tarjeta roja',
        'Guarda el resguardo de la renovación y controla la resolución. Sin tarjeta en vigor se bloquean trámites y trabajo.', 'Cada 2-3 semanas', 'plazo');
      if (d.titleValidationPending) add('titulo-validacion', 'Sigue la homologación o validación del título',
        'Guarda el resguardo, atiende requerimientos y controla el plazo. No pagues gestores que prometan resolverlo antes.', 'Cada 4-6 semanas', 'formación');
      if (d.workedMonths > 0 && !d.hasPayslips) add('nominas', 'Guarda nóminas y contrato',
        'Las nóminas, el contrato y los justificantes de pago son la prueba de medios y de trabajo que más se usa en extranjería.', 'Continuo', 'documentos');
    }
    if (d.asylumSoon) add('cita-asilo', 'Prepara la cita de asilo',
      'Lleva pasaporte, documentación y cualquier prueba de tu situación. No faltes: si no acudes, puedes perder el turno.', 'Fecha de la cita', 'prioridad');
    if (d.hasWhitePaper) add('trabajo-asilo', 'Solicita autorización de trabajo a los 6 meses',
      'Si han pasado 6 meses desde la solicitud y no hay denegación, puedes pedir autorización de trabajo. Revisa la fecha de tu hoja blanca.', 'A los 6 meses', 'plazo');
    if (d.hasRedCard && d.tarjetaRojaExpiry) add('renueva-roja', 'Renueva la tarjeta roja',
      'Pide cita antes de que caduque. Sin tarjeta en vigor se bloquean trámites y el trabajo.', '60 días antes', 'plazo');
    if (d.asylumDenied && !d.postRenunciationGranted && !d.hasPermit) add('recurso-asilo', 'Revisa el recurso de asilo',
      'El plazo es corto. Consulta con un abogado o una entidad especializada y valora alternativas como el arraigo o las circunstancias excepcionales.', 'Cuanto antes', 'riesgo');
    if (d.pendingExtranjeria) add('expediente-abierto', 'Sigue tu expediente de extranjería',
      'No puedes pedir arraigo mientras esté abierto (art. 126.h). Guarda el resguardo, controla los requerimientos y consulta el estado.', 'Cada 4-6 semanas', 'trámite');
    if (d.pendingNationality) add('nacionalidad-pendiente', 'Sigue tu solicitud de nacionalidad',
      'Guarda el resguardo, atiende requerimientos y controla el plazo. La resolución legal orientativa es de 1 año.', 'Cada 2-3 meses', 'trámite');
    if (d.hasAntecedentesCert && p.antecedentesCertDate) {
      var antDays = RL.dates.diff(p.antecedentesCertDate, RL.dates.today());
      if (antDays != null && antDays > 90) add('antecedentes-cad', 'Pide un certificado de antecedentes actualizado',
        'El que tienes tiene más de 3 meses y suele caducar. Pide uno nuevo antes de presentar la solicitud.', 'Antes de presentar', 'documentos');
    }
    if (d.hasReturnAuth && p.returnAuthExpiry) add('regreso', 'Controla tu autorización de regreso',
      'Sirve para salir y volver mientras se renueva tu permiso. Mira la fecha y no la dejes caducar fuera de España.', 'Antes de viajar', 'plazo');
    if (!d.euCitizen) {
      add('antecedentes', 'Pide tus antecedentes penales',
        'España: certificado del Ministerio de Justicia (gratis, online o presencial). Tu país: en el consulado o ministerio correspondiente, apostillado o legalizado. Suelen caducar a los 3 meses: no los pidas demasiado pronto.', 'Cuando tengas la vía clara', 'documentos');
    }
    if (d.hasAncestry && !d.ancestryDocsOK) add('partidas', 'Busca la partida de nacimiento española',
      'Empieza por el Registro Civil del municipio donde nació tu antepasado. Muchas partidas están digitalizadas; también puedes pedir una búsqueda registral. Sin ese papel no hay vía de nacionalidad.', 'Este mes', 'documentos');
    if (d.hasDegree && !d.homologated) add('homologacion', 'Valora homologar tu título',
      'Para trabajar en profesiones reguladas necesitas homologación o reconocimiento. Tarda meses: si tu vía la exige, empieza ya. Para otras vías basta el título traducido y apostillado.', 'Próximos 3 meses', 'documentos');
    if (!d.hasInsurance && !d.euCitizen && !d.asylumInProcess && !d.asylumSoon) add('seguro', 'Contrata un seguro médico',
      'Casi todos los visados y autorizaciones lo exigen, sin copagos y con cobertura en España. La sanidad pública no siempre cuenta para tu expediente.', 'Antes de solicitar', 'documentos');
    if (!d.spanishNative && !d.euCitizen && !d.asylumInProcess && !d.asylumSoon) add('dele', 'Prepara el DELE A2 y el CCSE',
      'Si tu vía es la nacionalidad por residencia, necesitarás el diploma de español A2 y la prueba de conocimientos constitucionales (CCSE). Los nacionales de países hispanohablantes suelen estar exentos del DELE.', '6-12 meses', 'formación');
    if (d.inSpain && d.irregular) add('no-salir', 'No salgas de España sin asesorarte',
      'Si estás irregular, salir puede activar una prohibición de entrada de 3 años o más. Si necesitas viajar, consulta antes con un abogado o con el consulado.', 'Siempre', 'riesgo');
    if (d.inSpain && d.irregular && d.arraigoMonths != null && d.arraigoMonths < 24) {
      var left = 24 - d.arraigoMonths;
      add('espera', 'Mientras tanto, prepara los 2 años',
        'Te faltan aproximadamente ' + fmtMonths(left) + ' para poder pedir arraigo social. En ese tiempo: mantén el padrón, no salgas, guarda contratos de alquiler, nóminas, recibos y cualquier prueba de integración (cursos, voluntariado, colegio de tus hijos). El tiempo como solicitante de asilo no cuenta para el arraigo.', 'Continuo', 'plazo');
    }
    if (d.inSpain && !d.hasPermit && !d.asylumInProcess && !d.asylumSoon) add('cita', 'Reserva cita en Extranjería',
      'Las citas se piden en la sede electrónica de la provincia o por teléfono. Suelen tardar semanas: pide cita incluso antes de tenerlo todo, y lleva copia de todo.', 'Cuando elijas la vía', 'trámite');
    if (d.outside) add('consulado', 'Comprueba los requisitos en tu consulado',
      'Cada consulado tiene su propia web, tasas y formas de cita (BLS, citaconsular…). Los requisitos cambian: confirma siempre en la fuente oficial antes de pagar nada.', 'Antes de empezar', 'trámite');

    return acts.slice(0, 12);
  }
  function fmtMonths(m) {
    if (m == null) return '';
    if (m < 1) return 'menos de un mes';
    if (m < 12) return Math.round(m) + (Math.round(m) === 1 ? ' mes' : ' meses');
    var y = Math.floor(m / 12), r = Math.round(m % 12);
    return y + (y === 1 ? ' año' : ' años') + (r ? ' y ' + r + (r === 1 ? ' mes' : ' meses') : '');
  }

  /* ─────────── hitos temporales ─────────── */
  function buildTimeline(p, d, best) {
    var t = [];
    var now = RL.dates.today();
    function add(date, title, detail, tone) {
      if (!date) return;
      var days = RL.dates.diff(now, date);
      if (days == null || days < -1) return;
      t.push({ date: date, title: title, detail: detail, tone: tone || 'later', days: days });
    }

    /* Si ya puedes presentar una vía, eso es lo primero. */
    var ready = (best || []).filter(function (r) { return r.status === 'ready'; })[0];
    if (ready) {
      add(now, 'Puedes presentar: ' + ready.route.title, 'La app considera que cumples los requisitos esenciales. Reúne los documentos y pide cita; la concesión no es automática.', 'now');
    }

    if (d.inSpain && d.entryDate) {
      if (d.tourist && !d.hasPermit && !d.asylumHistory && d.asylumBefore90 !== 'yes') add(RL.dates.addDays(d.entryDate, 90), 'Fin de los 90 días de turista', 'Si sigues aquí después de esta fecha, tu estancia pasa a ser irregular. No implica expulsión automática, pero sí impide trabajar.', 'soon');
      if (d.arraigoMonths != null && d.arraigoMonths < 24) {
        var arraigoBase = d.asylumDenied && d.asylumDeniedDate ? d.asylumDeniedDate
          : (d.asylumExited ? (d.asylumRenouncedDateISO || '') : d.entryDate);
        if (arraigoBase) add(RL.dates.addDays(arraigoBase, 730), 'Cumples 2 años computables para el arraigo', 'Fecha de referencia para el arraigo social (si mantienes permanencia continuada y padrón). El tiempo como solicitante de asilo no cuenta.', 'later');
      }
      if (d.monthsInSpain != null && d.monthsInSpain < 60) add(RL.dates.addDays(d.entryDate, 1826), 'Cumples 5 años en España', 'Umbral para la residencia de larga duración.', 'later');
    } else if (d.inSpain && d.padronDate && d.arraigoMonths != null && d.arraigoMonths < 24) {
      add(RL.dates.addYears(d.padronDate, 2), 'Cumples 2 años empadronado/a', 'Fecha de referencia para el arraigo social, si no hay interrupciones.', 'later');
    }

    if (d.asylumCitaDate) {
      add(d.asylumCitaDate, 'Cita para solicitar asilo', 'No faltes. Lleva pasaporte, documentación y pruebas de tu situación.', 'now');
    }
    if (d.hojaBlancaDate) {
      add(RL.dates.addMonths(d.hojaBlancaDate, 6), 'Puedes solicitar autorización de trabajo', 'Si han pasado 6 meses desde la solicitud y no hay denegación, puedes pedir autorización de trabajo.', 'soon');
    }
    if (d.tarjetaRojaExpiry) {
      add(RL.dates.addDays(d.tarjetaRojaExpiry, -60), 'Renueva tu tarjeta roja', 'Pide cita antes de que caduque; sin tarjeta en vigor se bloquean trámites y trabajo.', 'soon');
      add(d.tarjetaRojaExpiry, 'Caduca tu tarjeta roja', 'Si no la renuevas, pierdes el documento que acredita tu condición de solicitante.', 'now');
    }
    if (p.returnAuthExpiry) {
      add(p.returnAuthExpiry, 'Caduca tu autorización de regreso', 'Sirve para salir y volver mientras se renueva tu permiso. No la dejes caducar fuera de España.', 'soon');
    }
    if (p.extranjeriaPendingDate) {
      add(RL.dates.addMonths(p.extranjeriaPendingDate, 3), 'Resolución orientativa de tu expediente', 'El plazo legal suele ser de 3 meses, aunque en la práctica se alarga. Consulta el estado.', 'later');
    }
    if (p.nationalityPendingDate) {
      add(RL.dates.addYears(p.nationalityPendingDate, 1), 'Resolución orientativa de nacionalidad', 'El plazo legal es de 1 año desde la presentación; en la práctica puede ser mayor.', 'later');
    }
    if (p.antecedentesCertDate) {
      add(RL.dates.addMonths(p.antecedentesCertDate, 3), 'Caduca tu certificado de antecedentes', 'Suele tener una validez de 3 meses. Pide otro antes de presentar la solicitud.', 'soon');
    }
    if (d.asylumGrantedDate) {
      add(RL.dates.addYears(d.asylumGrantedDate, 5), 'Puedes pedir la nacionalidad (refugiados)', 'Si tienes condición de refugiado, el plazo de residencia para la nacionalidad es de 5 años.', 'later');
    }

    if (d.permitExpiry) {
      var adminStart = RL.dates.addDays(d.permitExpiry, -60);
      var adminOpen = RL.dates.diff(now, adminStart) < 0;
      add(adminOpen ? now : adminStart, 'Puedes presentar la renovación por Mercurio/sede', 'Se abre la ventana administrativa: puedes presentar la renovación hasta 2 meses antes del vencimiento. Esto NO habilita la TIE física ni la toma de huellas; solo evalúan la renovación y su duración.', 'soon');
      add(d.permitExpiry, 'Desde hoy: huellas y TIE física', 'La toma de huellas y la tarjeta física solo se pueden hacer desde el día en que vence la TIE, nunca antes. Si la renovación ya está aprobada, pide cita ICPP; lleva la resolución, la TIE vieja y la tasa 790-012.', 'now');
    }

    if (d.monthsResident != null && d.monthsResident < 24) {
      add(RL.dates.addYears(d.permitSince, 2), 'Cumples 2 años de residencia legal', 'Si eres de un país iberoamericano (o Portugal, Andorra, Filipinas o Guinea Ecuatorial), podrás pedir la nacionalidad por residencia.', 'later');
    } else if (d.hasPermit && d.permit !== 'longterm' && !d.permitSince) {
      add(RL.dates.addYears(now, 2), 'Revisa tu fecha de residencia', 'Para la nacionalidad por residencia cuentan los años de residencia legal continuada. Indica desde cuándo tienes tu permiso para calcularlo.', 'later');
    }

    if (d.regularizationPending) {
      add(RL.dates.addMonths(now, 3), 'Sigue tu expediente de regularización', 'Comprueba el estado, atiende requerimientos y guarda los justificantes. El plazo máximo de resolución suele ser de 3 meses, pero puede alargarse.', 'soon');
    }

    var dated = best.filter(function (r) { return r.route.deadline; });
    dated.forEach(function (r) {
      add(r.route.deadline, r.route.title + ': fin de plazo', r.route.deadlineNote || 'Último día para presentar la solicitud.', 'now');
    });

    t.sort(function (a, b) { return a.days - b.days; });
    return t.slice(0, 9);
  }

  /* ─────────── checklist de documentos ─────────── */
  function buildChecklist(best) {
    var out = [];
    var seen = {};
    best.forEach(function (r) {
      (r.route.docs || []).forEach(function (doc) {
        var key = doc.id || (r.route.id + '::' + doc.name);
        if (seen[key]) { seen[key].routes.push(r.route.title); return; }
        seen[key] = { key: key, name: doc.name, where: doc.where || '', note: doc.note || '', routes: [r.route.title], routeId: r.route.id };
        out.push(seen[key]);
      });
    });
    return out;
  }

  /* ─────────── utilidades de presentación ─────────── */
  RL.statusOf = function (key) { return STATUS[key] || STATUS.unlikely; };
  RL.scoreTone = function (n) { return n >= 75 ? 'ok' : (n >= 50 ? 'warn' : 'bad'); };
  RL.routeById = function (id) {
    var found = null;
    (RL.routes || []).forEach(function (r) { if (r.id === id) found = r; });
    return found;
  };

  RL.family = {
    status: {
      soltero: 'Soltero/a sin pareja',
      casado: 'Casado/a',
      pareja_registrada: 'Pareja de hecho registrada',
      pareja_estable: 'Pareja estable o concubinato sin registrar',
      divorciado: 'Separado/a o divorciado/a',
      viudo: 'Viudo/a',
      dontknow: 'No lo sé / prefiere no decirlo'
    },
    marriage: {
      civil: 'Matrimonio civil',
      religious: 'Matrimonio religioso sin inscripción civil',
      both: 'Matrimonio civil y religioso',
      dontknow: 'Tipo de matrimonio no indicado'
    },
    spanishChild: {
      common: 'Hijo común de la pareja',
      own: 'Hijo solo del solicitante',
      partner: 'Hijo solo de la pareja (no del solicitante)',
      mixed: 'Varios casos',
      dontknow: 'Vínculo no confirmado'
    },
    relations: {
      common: 'Hijo común',
      own: 'Hijo solo del solicitante',
      partner: 'Hijo solo de la pareja'
    },
    childrenText: function (d) {
      return 'Comunes: ' + (d.childrenCommon || 0) +
        ' · Solo solicitante: ' + (d.childrenOwn || 0) +
        ' · Solo pareja: ' + (d.childrenPartner || 0) +
        ' · Total: ' + (d.childrenCount || 0);
    }
  };

  RL.housing = {
    labels: {
      alquiler_piso: 'Alquilo un piso entero',
      alquiler_habitacion: 'Alquilo una habitación',
      familiar_amigo: 'Vivo con familiar o amigo, sin pagar alquiler',
      propietario_hipoteca: 'Propietario/a con hipoteca',
      propietario: 'Propietario/a sin hipoteca',
      pension_albergue: 'Pensión, albergue, realojo u otra situación',
      dontknow: 'No lo sé / prefiere no decirlo'
    },
    proof: {
      contract: 'Contrato de alquiler del piso',
      room_contract: 'Contrato de alquiler de habitación',
      owner_auth: 'Autorización del propietario o familiar/amigo',
      receipt: 'Recibos de alquiler, suministros o transferencias',
      deed: 'Escritura o hipoteca',
      none: 'Sin prueba de vivienda',
      dontknow: 'No lo sé'
    }
  };

  RL.education = {
    degree: {
      none: 'Sin titulación',
      eso: 'ESO o equivalente',
      bachillerato: 'Bachillerato / secundaria superior',
      fp_medio: 'Formación profesional media',
      fp_superior: 'Formación profesional superior',
      grado: 'Grado universitario o licenciatura',
      master: 'Máster',
      doctorado: 'Doctorado'
    },
    child: {
      no: 'No estudia',
      infantil_primaria: 'Infantil / Primaria',
      eso: 'ESO',
      bachillerato: 'Bachillerato',
      fp_basica: 'FP Básica',
      fp_medio: 'FP de Grado Medio',
      fp_superior: 'FP de Grado Superior (2 años)',
      universidad: 'Universidad',
      otro: 'Otro',
      dontknow: 'No lo sé'
    }
  };

  RL.disability = {
    degree: {
      '33_44': '33 % a 44 %',
      '45_64': '45 % a 64 %',
      '65_mas': '65 % o más',
      '33_64': '33 % a 64 %',
      '65_plus': '65 % o más',
      dontknow: 'No lo sabe'
    },
    recognized: {
      yes: 'Reconocida',
      in_progress: 'En trámite',
      no: 'No reconocida',
      dontknow: 'No lo sabe'
    }
  };
})();

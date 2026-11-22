/* ============================================================
   Ruta Legal · trámites: qué hacer, dónde, con qué cita y qué llevar
   ============================================================ */
(function () {
  'use strict';
  var RL = window.RL = window.RL || {};

  var ICPP = 'https://icp.administracionelectronica.gob.es/icpplus';
  var SEDE = 'https://sede.administracion.gob.es/';
  var INCLUSION = 'https://www.inclusion.gob.es/';
  var JUSTICIA = 'https://sede.mjusticia.gob.es/es/tramites/nacionalidad-espanola';
  var FNMT = 'https://www.sede.fnmt.gob.es/certificados/persona-fisica';
  var SS = 'https://www.seg-social.es/';
  var DGT = 'https://sede.dgt.gob.es/';
  var DGT_CANJE = 'https://sede.dgt.gob.es/es/permisos-de-conducir/canjes-de-permisos/canjes-de-permisos-extranjeros/';
  var DGT_CAP = 'https://www.transportes.gob.es/transporte-terrestre/examenes-y-formacion/examenes-de-formacion-de-conductores-profesionales-cap';

  var P = [
    {
      id: 'nie_tie', scope: 'national', cat: 'documentos', icon: 'shield',
      title: 'NIE, TIE, toma de huellas y recogida',
      when: 'Al llegar, al cambiar de estatus o al renovar. La cita previa es obligatoria. La TIE no se entrega el mismo día de las huellas.',
      where: 'Comisaría de la Policía Nacional de tu provincia',
      appointment: ICPP,
      appointmentLabel: 'Pedir cita en ICPP',
      docs: [
        'Pasaporte completo y en vigor',
        'Impreso EX-15 (NIE) o EX-17 (TIE)',
        'Foto reciente en color, 32 × 26 mm, fondo blanco: la llevas tú, en comisaría no te la hacen',
        'Tasa 790-012 pagada',
        'Resolución, tarjeta anterior o documento que acredite el trámite',
        'Resguardo de la cita'
      ],
      steps: [
        'Distingue qué necesitas: el NIE es un número (EX-15); la TIE es la tarjeta física que acredita tu autorización (EX-17).',
        'Pide cita en ICPP: elige provincia, trámite de Policía y oficina. No vayas sin cita.',
        'Descarga y paga la tasa 790-012: 16,08 € primera TIE; 19,30 € renovación (según el caso).',
        'Lleva la foto tú: reciente, color, 32 × 26 mm, fondo blanco, cabeza descubierta y sin gafas oscuras.',
        'En la comisaría te toman las huellas, no la foto. Guarda el resguardo que te entreguen.',
        'Espera la fabricación: normalmente 30-45 días, y en picos de demanda puede llegar a 60.',
        'Cuando esté disponible, pide una segunda cita ICPP para recogerla en la misma comisaría donde pusiste las huellas.',
        'El día de la recogida lleva el resguardo, el pasaporte y la TIE anterior si te la pidieron. Revisa nombre, NIE, tipo y fechas antes de salir.'
      ],
      fee: '790-012: 16,08 € primera TIE; 19,30 € renovación',
      note: 'No te dan la TIE el mismo día de las huellas y no te hacen la foto. Si vas sin foto o sin cita, pueden rechazarte. La recogida es una cita aparte y se hace en la misma oficina.',
      routeIds: ['arraigo_social', 'arraigo_sociolaboral', 'arraigo_socioformativo', 'arraigo_segunda_oportunidad', 'familiar_espanol', 'familiar_ue', 'reagrupacion', 'renovacion', 'estudios_a_trabajo', 'ciudadano_ue']
    },
    {
      id: 'recogida_tie', scope: 'national', cat: 'documentos', icon: 'clock',
      title: 'Recoger la TIE después de las huellas',
      when: 'Normalmente 30-45 días después de la toma de huellas; en picos de demanda puede tardar hasta 60. No vayas el mismo día ni antes de que esté fabricada.',
      where: 'La misma comisaría donde pusiste las huellas',
      appointment: ICPP,
      appointmentLabel: 'Pedir cita de recogida',
      docs: [
        'Resguardo de la toma de huellas',
        'Pasaporte en vigor',
        'TIE anterior, si te la pidieron',
        'Autorización o poder si recoge otra persona'
      ],
      steps: [
        'Espera el plazo habitual: 30-45 días desde las huellas; algunas provincias tardan más.',
        'Comprueba que tu TIE está disponible antes de pedir cita; no todas avisan por SMS.',
        'Pide cita ICPP para «Recogida de TIE» en la misma oficina donde pusiste las huellas.',
        'Acude con el resguardo, el pasaporte y la TIE anterior si corresponde.',
        'Revisa nombre, NIE, tipo de autorización, fecha de emisión y caducidad antes de salir.',
        'Si hay un error, pide corrección en el mismo momento; no firmes conformidad si los datos no coinciden.'
      ],
      fee: 'Gratuito: la tasa 790-012 se pagó al iniciar la TIE',
      note: 'La TIE no se entrega el día de las huellas. La recogida es una cita aparte y se hace en la misma comisaría; otra oficina no puede entregártela. Si no está fabricada, no te la dan aunque tengas cita.',
      routeIds: []
    },
    {
      id: 'arraigo', scope: 'national', cat: 'documentos', icon: 'route',
      title: 'Arraigo (social, sociolaboral, socioformativo)',
      when: 'Cuando cumples los 2 años de permanencia y no tienes una autorización en vigor ni un expediente abierto que lo impida.',
      where: 'Oficina de Extranjería de tu provincia o sede electrónica',
      appointment: SEDE,
      appointmentLabel: 'Abrir sede de Extranjería',
      docs: [
        'Pasaporte completo',
        'Impreso EX-31',
        'Certificado de empadronamiento histórico',
        'Prueba de permanencia (padrón, contratos, recibos, informes)',
        'Antecedentes penales de España y del país de origen',
        'Medios económicos (100 % IPREM)',
        'Informe de integración solo si no tienes vínculos familiares',
        'Tasa 790-052 pagada (38,28 €)'
      ],
      steps: [
        'Comprueba que no tienes permiso en vigor ni expediente de extranjería abierto: bloquearían el arraigo.',
        'Reúne la permanencia de los 2 años y el certificado histórico de padrón.',
        'Pide el informe de integración si tu vía lo exige (tarda hasta 1 mes).',
        'Paga la tasa 790-052 y presenta el EX-31 en tu Oficina de Extranjería.',
        'Guarda el resguardo: desde la admisión puedes trabajar con habilitación provisional en algunos supuestos.'
      ],
      fee: '38,28 € (790-052)',
      note: 'No salgas de España mientras preparas el arraigo: una salida puede romper la permanencia. Las ausencias deben ser cortas y justificadas.',
      routeIds: ['arraigo_social', 'arraigo_sociolaboral', 'arraigo_socioformativo', 'arraigo_segunda_oportunidad']
    },
    {
      id: 'familiar_espanol', scope: 'national', cat: 'familia', icon: 'family',
      title: 'Familiar de persona con nacionalidad española',
      when: 'Si estás casado/a, tienes pareja registrada o estable, o eres progenitor de un menor español. No hace falta esperar 2 años.',
      where: 'Oficina de Extranjería de tu provincia o sede electrónica',
      appointment: SEDE,
      appointmentLabel: 'Abrir sede de Extranjería',
      docs: [
        'Pasaporte completo',
        'Impreso EX-24',
        'Certificado de matrimonio, pareja registrada o nacimiento del hijo',
        'Prueba de convivencia (padrón conjunto, certificado de convivencia)',
        'Medios económicos y vivienda',
        'Antecedentes penales',
        'Tasa 10,94 € + 12 € de TIE'
      ],
      steps: [
        'Reúne el documento que prueba el vínculo: matrimonio, registro de pareja o nacimiento.',
        'Prepara la convivencia: padrón conjunto, certificado, recibos, fotos o testigos.',
        'Paga la tasa y presenta el EX-24 en Extranjería. Si ambos estáis en España, puede solicitarlo cualquiera de los dos.',
        'Desde la admisión a trámite puedes residir y trabajar de forma provisional.',
        'Recoge la TIE de 5 años y revisa la fecha de caducidad.'
      ],
      fee: '10,94 € + 12 € TIE',
      note: 'Casarse o tener un hijo español no te legaliza por sí solo: hay que solicitar y probar. Si el progenitor español no reconoce al hijo, la nacionalidad no está resuelta.',
      routeIds: ['familiar_espanol']
    },
    {
      id: 'reagrupacion', scope: 'national', cat: 'familia', icon: 'family',
      title: 'Reagrupación familiar (familiar en el extranjero)',
      when: 'Solo si ya resides legalmente en España y el cónyuge, hijos o ascendientes están FUERA de España. Si ya están aquí, aunque sea de turismo, irregulares o indocumentados, no se reagrupan por esta vía.',
      where: 'Oficina de Extranjería (reagrupante) y consulado (familiar)',
      appointment: SEDE,
      appointmentLabel: 'Abrir sede de Extranjería',
      docs: [
        'Pasaporte del reagrupante y del familiar',
        'Impreso EX-02',
        'Certificado de matrimonio, nacimiento o parentesco',
        'Medios económicos y vivienda',
        'Antecedentes penales del familiar',
        'Tasa 10,94 €'
      ],
      steps: [
        'Confirma primero que el familiar está fuera de España. Si ya está aquí, para: esta vía no sirve.',
        'El reagrupante solicita la autorización en Extranjería con el EX-02.',
        'Con la autorización concedida, el familiar pide el visado en el consulado de su país.',
        'El familiar entra en España con el visado y solicita la TIE en 1 mes.',
        'La autorización no sirve sin el visado: son dos fases distintas.'
      ],
      fee: '10,94 € + visado + TIE',
      note: 'No puedes reagrupar a alguien que ya está en España, aunque esté de turismo o en situación irregular. La reagrupación exige que el familiar esté fuera y obtenga visado. Si ya está aquí, valora familiar de español/UE, arraigo u otra vía.',
      routeIds: ['reagrupacion']
    },
    {
      id: 'humanitarias', scope: 'national', cat: 'documentos', icon: 'shield',
      title: 'Residencia por razones humanitarias',
      when: 'Vía excepcional para personas en España que acreditan enfermedad grave, riesgo para la integridad, victimización o vulnerabilidad concreta. No es una vía general ni automática.',
      where: 'Oficina de Extranjería de tu provincia o sede electrónica',
      appointment: SEDE,
      appointmentLabel: 'Abrir sede de Extranjería',
      docs: [
        'Pasaporte completo',
        'Impreso EX-10',
        'Informe médico o social que acredite el supuesto',
        'Resolución, denuncia o prueba de la situación',
        'Certificado de antecedentes penales',
        'Tasa 790-052 pagada'
      ],
      steps: [
        'Identifica el supuesto humanitario concreto y reúne la prueba.',
        'Busca asesoramiento especializado antes de presentar.',
        'Presenta el EX-10 en Extranjería o sede, con informes y antecedentes.',
        'Paga la tasa y guarda el resguardo.',
        'Sigue la resolución: la autorización es temporal y puede incluir trabajo.'
      ],
      fee: 'Tasa 790-052 según el supuesto + TIE',
      note: 'No se concede por pobreza ni por falta de trabajo. Sin informe o prueba del supuesto, se deniega. La valoración es de Extranjería y cada caso es distinto.',
      routeIds: ['humanitarias']
    },
    {
      id: 'asilo', scope: 'national', cat: 'ayuda', icon: 'shield',
      title: 'Solicitud de protección internacional (asilo)',
      when: 'Si temes volver a tu país por persecución o violencia. Cuanto antes, mejor; no esperes a que caduque tu visado.',
      where: 'Oficina de Asilo y Refugio, comisaría o frontera',
      appointment: 'https://www.acnur.org/es-es/',
      appointmentLabel: 'Información de ACNUR',
      docs: [
        'Pasaporte o documento de identidad, si lo tienes',
        'Relato de los motivos de persecución',
        'Pruebas o documentos que apoyen el relato',
        'Datos de familiares y dirección en España'
      ],
      steps: [
        'Pide información gratis a ACNUR, CEAR o una entidad especializada antes de contar tu caso.',
        'Presenta la solicitud en la Oficina de Asilo, comisaría o frontera.',
        'Guarda la hoja blanca y revisa su caducidad; renueva hasta la tarjeta roja.',
        'A los 6 meses desde la solicitud puedes solicitar autorización de trabajo.',
        'No salgas de España mientras el expediente esté vivo sin asesorarte.'
      ],
      fee: 'Gratuito',
      note: 'No hay un impreso EX general para asilo. Si ya tienes una solicitud, la vía de seguimiento es distinta de una solicitud nueva.',
      routeIds: ['asilo', 'asilo_seguimiento']
    },
    {
      id: 'nacionalidad', scope: 'national', cat: 'documentos', icon: 'doc',
      title: 'Nacionalidad por residencia',
      when: 'A los 10 años (regla general), 2 años si eres iberoamericano/a, Andorra, Filipinas, Guinea Ecuatorial o Portugal; 1 año en supuestos especiales. Solo cuenta la residencia legal: no el turismo ni el tiempo como solicitante de asilo.',
      where: 'Sede electrónica del Ministerio de Justicia',
      appointment: JUSTICIA,
      appointmentLabel: 'Abrir solicitud online',
      docs: [
        'Pasaporte y TIE',
        'Certificado de nacimiento apostillado y traducido',
        'Certificado de antecedentes penales',
        'Prueba de residencia legal y continuada',
        'CCSE obligatorio; DELE A2 solo si no eres hispanohablante',
        'Tasa 790-026 (104,05 €)'
      ],
      steps: [
        'Comprueba cuántos años de residencia legal tienes y si son continuos. El turismo y el asilo solicitado no cuentan.',
        'Inscríbete en el CCSE y, solo si no eres hispanohablante, en el DELE A2 del Instituto Cervantes.',
        'Reúne los documentos apostillados y traducidos.',
        'Paga la tasa 790-026 y presenta la solicitud online con certificado digital o Cl@ve.',
        'Cuando te concedan, tienes 180 días para jurar o prometer y luego inscribirte en el Registro Civil.'
      ],
      fee: '104,05 € + 85 € CCSE (+ 138 € DELE si no eres hispanohablante)',
      note: 'Solo cuenta la residencia legal: el tiempo como turista o solicitante de asilo no computa. El CCSE es obligatorio; los hispanohablantes están exentos del DELE A2, no del CCSE. La nacionalidad no regulariza automáticamente a tus familiares.',
      routeIds: ['nac_residencia_2', 'nac_residencia_1', 'nac_residencia_10', 'nac_22_2f', 'nac_origen', 'nac_opcion']
    },
    {
      id: 'canje_permiso_extranjero', scope: 'national', cat: 'documentos', icon: 'route',
      title: 'Canjear el permiso de conducir extranjero',
      when: 'Si eres residente en España y tienes un permiso extranjero. Los permisos de fuera de la UE/EEE suelen poder usarse solo 6 meses desde que obtienes la residencia; después hay que canjearlos o dejar de conducir.',
      where: function (c) { return 'Jefatura Provincial de Tráfico de ' + (c.province || c.regionName || 'tu provincia') + ' (DGT)'; },
      appointment: DGT_CANJE,
      appointmentLabel: 'Consultar canje en la DGT',
      docs: [
        'Permiso extranjero original y copia',
        'Traducción jurada si no está en español o en un idioma aceptado',
        'TIE/NIE o certificado de residencia',
        'Certificado médico de aptitud psicofísica en centro autorizado',
        'Fotografía reciente y tasa DGT',
        'Cita o solicitud según la Jefatura'
      ],
      steps: [
        'Comprueba si tu país tiene convenio de canje con España. No todos los permisos son canjeables.',
        'Si hay convenio, mira si tu categoría exige teoría, práctica o ninguna prueba.',
        'Pasa el reconocimiento médico en un centro autorizado de tu provincia.',
        'Pide cita o inicia el canje en la sede de la DGT; paga la tasa y entrega el permiso original.',
        'Si no hay convenio, tendrás que examinarte en España como cualquier solicitante.',
        'Guarda el resguardo: hasta que salga el permiso español, no conduzcas si ya no tienes autorización.'
      ],
      fee: 'Tasa DGT según el grupo del permiso; el importe se confirma en la sede',
      note: 'El canje es estatal (DGT), pero la cita, el centro médico y los exámenes se hacen en tu provincia. Los permisos profesionales pueden exigir pruebas adicionales y CAP. No conduzcas con un permiso extranjero caducado o fuera de plazo.',
      routeIds: []
    },
    {
      id: 'permiso_b', scope: 'national', cat: 'documentos', icon: 'route',
      title: 'Sacar el permiso B (coche)',
      when: 'Si tienes 18 años o más y no tienes un permiso de conducir español o canjeable. No hace falta residencia para examinarse, pero sí identificación y residencia para el permiso.',
      where: function (c) { return 'Jefatura Provincial de Tráfico de ' + (c.province || c.regionName || 'tu provincia') + ' y autoescuela de tu provincia'; },
      appointment: DGT,
      appointmentLabel: 'Consultar permisos en la DGT',
      docs: [
        'DNI, NIE/TIE o pasaporte con residencia',
        'Certificado médico de aptitud psicofísica',
        'Fotografía reciente',
        'Tasa DGT',
        'Resguardo de matrícula de la autoescuela'
      ],
      steps: [
        'Elige una autoescuela y comprueba que el examen teórico se convoca en tu provincia.',
        'Pasa el reconocimiento médico en un centro autorizado.',
        'Aprueba el teórico común y el específico de la categoría B.',
        'Realiza las prácticas y aprueba el examen práctico en la Jefatura de tu provincia.',
        'Recoge el permiso provisional y después el definitivo.'
      ],
      fee: 'Tasa DGT + autoescuela + reconocimiento médico',
      note: 'Los requisitos de seguridad vial son estatales; lo que cambia por provincia es la autoescuela, el centro médico, las fechas de examen y la oficina. No hay un examen “más fácil” en otra comunidad.',
      routeIds: []
    },
    {
      id: 'permiso_moto', scope: 'national', cat: 'documentos', icon: 'route',
      title: 'Permiso de moto: A1, A2 y A',
      when: 'A1 desde los 16 años, A2 desde los 18 y A desde los 20 con 2 años de A2. También puedes acceder según tu antigüedad y prácticas.',
      where: function (c) { return 'Jefatura Provincial de Tráfico de ' + (c.province || c.regionName || 'tu provincia') + ' y autoescuela de tu provincia'; },
      appointment: DGT,
      appointmentLabel: 'Consultar permisos de moto',
      docs: [
        'DNI, NIE/TIE o pasaporte',
        'Certificado médico de aptitud psicofísica',
        'Fotografía reciente',
        'Tasa DGT',
        'Permiso A2 si solicitas el A'
      ],
      steps: [
        'Elige la categoría: A1 (16), A2 (18) o A (20 con 2 años de A2).',
        'Aprueba el teórico específico de moto y el práctico de circuito y circulación.',
        'Si ya tienes B, consulta qué motos puedes conducir y qué prácticas necesitas.',
        'Pasa el reconocimiento médico y paga la tasa.',
        'Recoge el permiso y revisa las limitaciones (potencia, antigüedad).'
      ],
      fee: 'Tasa DGT + autoescuela + reconocimiento médico',
      note: 'Las edades y pruebas son estatales. La disponibilidad de autoescuelas, circuitos y fechas cambia por provincia. El A1 no es lo mismo que el A2 ni el A: no conduzcas una moto para la que no tengas la categoría.',
      routeIds: []
    },
    {
      id: 'permiso_profesional', scope: 'national', cat: 'trabajo', icon: 'route',
      title: 'Permiso profesional: camión (C) y autobús (D) + CAP',
      when: 'Para conducir camiones C1/C o autobuses D1/D. Además del permiso necesitas el CAP (certificado de aptitud profesional) y, para mercancías peligrosas, formación ADR.',
      where: function (c) { return 'Jefatura Provincial de Tráfico de ' + (c.province || c.regionName || 'tu provincia') + ', centro CAP y centro médico de tu provincia'; },
      appointment: DGT_CAP,
      appointmentLabel: 'Consultar CAP y formación',
      docs: [
        'Permiso B en vigor',
        'Certificado médico de aptitud psicofísica',
        'Fotografía reciente',
        'Tasa DGT',
        'Certificado CAP o resguardo del curso',
        'Formación ADR si transportas mercancías peligrosas'
      ],
      steps: [
        'Comprueba la edad: C1 desde 18; C desde 21 (18 con CAP de cualificación inicial ordinaria); D1 desde 21; D desde 24 (con reducciones según CAP).',
        'Aprueba el permiso C1/C o D1/D en la Jefatura de tu provincia.',
        'Realiza el curso CAP inicial y aprueba su examen; después, formación continua cada 5 años.',
        'Si vas a transportar mercancías peligrosas, añade el ADR.',
        'Para taxi, VTC o transporte público local, comprueba además la autorización municipal o autonómica.'
      ],
      fee: 'Tasa DGT + autoescuela + CAP + reconocimiento médico (y ADR si procede)',
      note: 'El permiso y el CAP son estatales, pero los centros de formación, los exámenes y las autorizaciones de taxi/VTC cambian por provincia o comunidad. No basta con el permiso B para conducir un camión o un autobús.',
      routeIds: []
    },
    {
      id: 'mercurio', scope: 'national', cat: 'documentos', icon: 'globe',
      title: 'Mercurio · extranjería online',
      when: 'Para los procedimientos de extranjería habilitados en Mercurio. Permite presentar sin cita, pero no todos los trámites están disponibles.',
      where: 'Mercurio (sede electrónica de extranjería)',
      appointment: 'https://mercurio.delegaciondelgobierno.gob.es/mercurio/',
      appointmentLabel: 'Abrir Mercurio',
      docs: [
        'Certificado digital o Cl@ve',
        'Formulario del procedimiento concreto',
        'Documentos escaneados en PDF',
        'Tasa pagada, si el trámite la exige',
        'Resguardo o justificante de presentación'
      ],
      steps: [
        'Comprueba si tu procedimiento concreto está habilitado en Mercurio.',
        'Entra con certificado digital o Cl@ve; no uses el certificado de otra persona.',
        'Rellena el formulario y adjunta los documentos en el formato que pida.',
        'Paga la tasa si corresponde y guarda el justificante.',
        'Descarga el resguardo y consulta el estado del expediente.'
      ],
      fee: 'Según la tasa del procedimiento',
      note: 'Mercurio no sirve para nacionalidad ni para todos los trámites. Si tu procedimiento no está habilitado, usa la sede de Extranjería o la cita previa. No pagues a un gestor sin comprobar antes que el trámite se puede presentar por Mercurio.',
      routeIds: []
    },
    {
      id: 'registro_civil', scope: 'national', cat: 'documentos', icon: 'doc',
      title: 'Registro Civil · certificados online',
      when: 'Para certificados de nacimiento, matrimonio, defunción o último testamento. La descarga inmediata requiere identificación electrónica.',
      where: 'Sede del Ministerio de Justicia / Registro Civil',
      appointment: 'https://sede.mjusticia.gob.es/',
      appointmentLabel: 'Abrir sede de Justicia',
      docs: [
        'Cl@ve, certificado digital o DNI electrónico',
        'Datos de la inscripción: nombre, fecha y registro',
        'Libro de familia o datos de los progenitores, si los tienes'
      ],
      steps: [
        'Entra en la sede del Ministerio de Justicia y elige «Certificados del Registro Civil».',
        'Identifícate con Cl@ve, certificado digital o DNI electrónico.',
        'Rellena los datos de la inscripción y solicita el certificado.',
        'Descarga el PDF al momento y guarda una copia.',
        'Si no tienes identificación electrónica, solicita el certificado por correo postal.'
      ],
      fee: 'Certificados gratuitos; otros trámites pueden tener tasa',
      note: 'Los certificados se descargan al momento y son gratuitos. Inscripciones, rectificaciones y otros actos del Registro Civil pueden exigir cita presencial: no todos los trámites son 100 % online.',
      routeIds: []
    },
    {
      id: 'renovacion', scope: 'national', cat: 'documentos', icon: 'clock',
      title: 'Renovar la autorización y la TIE: dos pasos distintos',
      when: 'Renovación administrativa: en los 2 meses anteriores al vencimiento, por Mercurio o sede. Huellas/TIE física: solo desde el día en que vence la tarjeta, nunca antes.',
      where: 'Mercurio/sede para la renovación; comisaría (ICPP) para huellas y TIE física',
      appointment: SEDE,
      appointmentLabel: 'Abrir sede de Extranjería',
      docs: [
        'Pasaporte y TIE actual',
        'Formulario de renovación o EX-26 si es modificación',
        'Medios económicos, contrato o nóminas',
        'Seguro médico si tu autorización lo exige',
        'Tasa 790-052 de renovación',
        'Resolución favorable y tasa 790-012 para la TIE física'
      ],
      steps: [
        'Mira la fecha de caducidad de tu TIE y apunta el día exacto del vencimiento.',
        'Hasta 2 meses antes, presenta la renovación por Mercurio o sede; guarda el resguardo.',
        'Espera la resolución: pueden aprobarla antes de que caduque, pero eso no adelanta la tarjeta.',
        'La toma de huellas y la TIE física solo se piden desde el día del vencimiento. Nunca antes.',
        'Desde esa fecha, pide cita ICPP y lleva pasaporte, TIE vieja, foto, resolución y 790-012.',
        'Si ya caducó, presenta la renovación cuanto antes; no esperes al día 91.'
      ],
      fee: '790-052 (renovación) + 790-012 (TIE física)',
      note: 'No confundas los dos plazos: Mercurio evalúa la renovación hasta 2 meses antes; las huellas y la tarjeta física solo desde el vencimiento. Si la policía te cita antes de esa fecha, no puede tomar huellas ni renovar la TIE.',
      routeIds: ['renovacion', 'larga_duracion']
    },
    {
      id: 'modificacion_estudios', scope: 'national', cat: 'trabajo', icon: 'briefcase',
      title: 'Pasar de estudios a trabajo',
      when: 'Antes de que caduque tu estancia por estudios o, como máximo, en los 3 meses posteriores a su extinción o a obtener el título.',
      where: 'Oficina de Extranjería o sede electrónica',
      appointment: SEDE,
      appointmentLabel: 'Abrir sede de Extranjería',
      docs: [
        'Pasaporte y TIE de estudios',
        'Impreso EX-26',
        'Título o certificado de estudios',
        'Contrato de trabajo u oferta',
        'Medios y antecedentes',
        'Tasa 10,94 €'
      ],
      steps: [
        'No dejes que caduque la estancia: la modificación se pide antes o dentro de los 3 meses posteriores.',
        'Consigue un contrato de trabajo que cumpla el salario y la jornada.',
        'Paga la tasa y presenta el EX-26 con el título y el contrato.',
        'Mientras se resuelve, guarda el resguardo y no trabajes sin autorización.',
        'Si no encuentras trabajo, valora la residencia para búsqueda de empleo.'
      ],
      fee: '10,94 €',
      note: 'Trabajar con estudios permite hasta 30 h/semana, pero no es lo mismo que residencia y trabajo. El tiempo de estudios no cuenta al 100 % para la nacionalidad.',
      routeIds: ['estudios_a_trabajo']
    },
    {
      id: 'padron', scope: 'local', cat: 'documentos', icon: 'home',
      title: 'Empadronamiento y certificado de padrón',
      when: 'Nada más llegar a un municipio, y cada vez que cambies de domicilio. Es gratuito y no es un permiso de residencia.',
      where: function (c) { return c.localLabel + ' de ' + (c.municipality || 'tu municipio'); },
      urlKey: 'portal',
      appointmentLabel: 'Web de tu ayuntamiento',
      docs: [
        'Pasaporte, NIE o TIE',
        'Contrato de alquiler, escritura o autorización del propietario',
        'Si no tienes contrato: certificado de convivencia, recibo o informe de servicios sociales',
        'Último recibo de luz o agua, si lo tienes',
        'Libro de familia o documentación de los menores, si se empadronan contigo'
      ],
      steps: [
        'Pide cita o consulta el horario del ayuntamiento/concello; muchos exigen cita previa.',
        'Lleva identidad y prueba de domicilio. Si vives de alquiler, contrato y autorización; si compartes, certificado de convivencia.',
        'Haz el alta de padrón. Pide el volante o certificado y comprueba que aparecen todos los convivientes.',
        'Si llevas tiempo, pide el certificado histórico con altas y bajas: es la prueba principal de permanencia para el arraigo.',
        'Si te niegan el empadronamiento, pide la denegación por escrito y acude a servicios sociales o a una entidad de apoyo.'
      ],
      fee: 'Gratuito',
      note: 'El padrón no es un permiso de residencia, pero sin él no puedes acreditar permanencia ni acceder a sanidad, escuela o ayudas. Los extranjeros no comunitarios sin residencia permanente deben renovar la inscripción cada 2 años; si no, el ayuntamiento puede dar de baja. La UE/EEE y los residentes permanentes no tienen esa renovación obligatoria, aunque el ayuntamiento puede comprobar el domicilio. No todos los ayuntamientos piden los mismos documentos: confirma en el tuyo.',
      routeIds: ['arraigo_social', 'arraigo_sociolaboral', 'arraigo_socioformativo', 'arraigo_segunda_oportunidad', 'familiar_espanol', 'reagrupacion']
    },
    {
      id: 'tarjeta_sanitaria', scope: 'local', cat: 'salud', icon: 'shield',
      title: 'Tarjeta sanitaria',
      when: 'Cuando te empadronas o cambias de municipio; también si estás embarazada o tienes un menor a cargo.',
      where: function (c) { return 'Centro de salud de ' + (c.municipality || 'tu municipio'); },
      urlKey: 'health',
      appointmentLabel: 'Web de sanidad de tu comunidad',
      docs: [
        'Pasaporte o NIE',
        'Certificado de empadronamiento',
        'Documento que acredite tu situación (resolución, tarjeta, justificante)',
        'Número de la Seguridad Social, si lo tienes'
      ],
      steps: [
        'Pide cita en tu centro de salud o consulta la web de sanidad de tu comunidad.',
        'Lleva el certificado de empadronamiento y el documento de identidad.',
        'Solicita la tarjeta sanitaria y el médico de familia.',
        'Si estás embarazada, pide cita de seguimiento del embarazo.'
      ],
      fee: 'Gratuito',
      note: 'La atención urgente no se puede negar por falta de tarjeta. La tarjeta sanitaria no regulariza tu situación migratoria.',
      routeIds: []
    },
    {
      id: 'seguridad_social', scope: 'national', cat: 'trabajo', icon: 'briefcase',
      title: 'Número de la Seguridad Social y vida laboral',
      when: 'Antes de empezar a trabajar o para acreditar cotizaciones en arraigo, renovación o nacionalidad.',
      where: 'Tesorería General de la Seguridad Social o sede online',
      appointment: SS,
      appointmentLabel: 'Abrir Seguridad Social',
      docs: [
        'Pasaporte o NIE',
        'Contrato de trabajo o datos de la empresa',
        'Certificado de empadronamiento, si te lo piden'
      ],
      steps: [
        'Solicita el número de la Seguridad Social si aún no lo tienes.',
        'Pide el informe de vida laboral por la sede o presencialmente.',
        'Comprueba que todas tus altas y cotizaciones aparecen.',
        'Guarda el informe: es una prueba clave para el arraigo sociolaboral.'
      ],
      fee: 'Gratuito',
      note: 'Trabajar sin alta y sin autorización es una infracción laboral y migratoria. Regulariza primero tu situación o consulta antes de aceptar un trabajo sin contrato.',
      routeIds: ['arraigo_sociolaboral']
    },
    {
      id: 'certificado_digital', scope: 'national', cat: 'documentos', icon: 'doc',
      title: 'Certificado digital FNMT o Cl@ve',
      when: 'Cuando quieras hacer trámites online sin cita presencial: renovaciones, nacionalidad, consulta de expedientes.',
      where: 'Online o en una oficina de registro (AEAT, Seguridad Social…)',
      appointment: FNMT,
      appointmentLabel: 'Solicitar certificado FNMT',
      docs: [
        'DNI o NIE',
        'Correo electrónico',
        'Ordenador con navegador actualizado',
        'Para acreditarse: cita en una oficina de registro'
      ],
      steps: [
        'Solicita el certificado en la sede de la FNMT.',
        'Descarga e instala el certificado en tu navegador.',
        'Acredita tu identidad en una oficina de registro o con vídeo identificación.',
        'Prueba el certificado en la sede de Extranjería o Justicia.'
      ],
      fee: 'Gratuito',
      note: 'La FNMT no expide NIE ni resuelve extranjería. Cl@ve es una alternativa si no quieres instalar el certificado.',
      routeIds: []
    },
    {
      id: 'discapacidad_cert', scope: 'region', cat: 'derechos', icon: 'shield',
      title: 'Certificado de discapacidad',
      when: 'Cuando tengas informes médicos y quieras que la comunidad valore el grado. No es un permiso de residencia.',
      where: function (c) { return 'Servicios Sociales o Centro de Valoración de ' + c.regionName; },
      urlKey: 'social',
      appointmentLabel: 'Web de servicios sociales',
      routeIds: [],
      docs: [
        'DNI/NIE y empadronamiento',
        'Informes médicos, psicológicos y de especialistas',
        'Informe de vida laboral, si procede',
        'Solicitud de valoración de la comunidad',
        'Consentimiento para consultar datos'
      ],
      steps: [
        'Pide cita en servicios sociales o en el centro de valoración de tu comunidad.',
        'Presenta la solicitud con todos los informes médicos; guarda el resguardo.',
        'El equipo de valoración aplica el baremo y puede citarte.',
        'Recibe la resolución con el grado; revisa si es 33 %, 65 % o superior.',
        'Si no estás de acuerdo, consulta el plazo de reclamación o recurso.'
      ],
      fee: 'Gratuito',
      note: 'No lo expide el ayuntamiento ni la Seguridad Social: el certificado lo da la comunidad autónoma. La incapacidad permanente es otro procedimiento. Nadie puede garantizar que salga en un año: depende del baremo y de la lista de espera.'
    },
    {
      id: 'renovacion_discapacidad', scope: 'national', cat: 'documentos', icon: 'clock',
      title: 'Renovar a un hijo adulto con discapacidad',
      when: 'Dos meses antes de que caduque la tarjeta o, como máximo, tres meses después. La vía depende del tipo de autorización.',
      where: 'Oficina de Extranjería de tu provincia o sede electrónica',
      appointment: SEDE,
      appointmentLabel: 'Abrir sede de Extranjería',
      routeIds: ['renovacion', 'familiar_espanol', 'reagrupacion'],
      docs: [
        'Pasaporte y TIE del hijo',
        'Resolución que concedió la tarjeta',
        'Certificado de discapacidad y, si existe, dependencia',
        'Medios económicos: nóminas, pensiones, prestaciones o ingresos del familiar',
        'Certificado de empadronamiento y convivencia',
        'Tasa 790-052 (16,40 € para renovación)'
      ],
      steps: [
        'Mira el tipo de tarjeta en la resolución o en el reverso de la TIE: familiar de español, reagrupación, no lucrativa, trabajo o estudios.',
        'Reúne la prueba de que se mantiene el vínculo o la dependencia y los medios económicos.',
        'Si no hay empleo, aporta ingresos del familiar, pensión, prestación o dependencia; no inventes un contrato.',
        'Presenta la renovación en plazo. Si caducó, hazlo dentro de los 3 meses posteriores.',
        'Si la deniegan, consulta «segunda oportunidad», larga duración o circunstancias excepcionales con abogado.'
      ],
      fee: '16,40 € (790-052)',
      note: 'La discapacidad no sustituye los requisitos de la tarjeta. Si la tarjeta es de familiar de español, la vía ordinaria es de 5 años; si es de reagrupación, la renovación se valora con los medios de la unidad familiar. No dejes caducar sin presentar nada.'
    },
    {
      id: 'dependencia', scope: 'region', cat: 'derechos', icon: 'family',
      title: 'Reconocimiento de dependencia',
      when: 'Cuando necesitas apoyo para actividades básicas de la vida diaria. Es distinto de la discapacidad y de la incapacidad laboral.',
      where: function (c) { return 'Servicios Sociales de ' + c.regionName; },
      urlKey: 'social',
      appointmentLabel: 'Web de servicios sociales',
      routeIds: [],
      docs: [
        'DNI/NIE y empadronamiento',
        'Informes médicos y sociales',
        'Certificado de discapacidad, si lo tienes',
        'Solicitud de valoración de dependencia'
      ],
      steps: [
        'Pide cita en servicios sociales de tu comunidad.',
        'Presenta la solicitud y los informes; puede haber visita domiciliaria.',
        'Recibe la valoración del grado de dependencia.',
        'Si procede, solicita las prestaciones o servicios del catálogo.',
        'Si no estás de acuerdo, consulta el plazo de reclamación.'
      ],
      fee: 'Gratuito',
      note: 'La dependencia no es lo mismo que la discapacidad: puedes tener discapacidad sin dependencia o al revés. Las prestaciones y la lista de espera varían por comunidad.'
    },
    {
      id: 'familia_numerosa', scope: 'region', cat: 'derechos', icon: 'family',
      title: 'Título de familia numerosa',
      when: 'Cuando tu familia cumple los supuestos: 3 o más hijos, o 2 si uno tiene discapacidad, entre otros.',
      where: function (c) { return 'Servicios Sociales o consejería de ' + c.regionName; },
      urlKey: 'social',
      appointmentLabel: 'Web de servicios sociales',
      routeIds: [],
      docs: [
        'DNI/NIE de todos los miembros',
        'Libro de familia o certificados de nacimiento',
        'Certificado de discapacidad, si se alega',
        'Certificado de empadronamiento',
        'Residencia legal de los miembros, si se exige'
      ],
      steps: [
        'Comprueba el supuesto y los requisitos de tu comunidad.',
        'Reúne la documentación de todos los miembros.',
        'Presenta la solicitud en la sede de la comunidad.',
        'Renueva el título cuando caduque y actualiza altas o bajas.',
        'Guarda el título: lo piden para becas, transporte, tasas y vivienda.'
      ],
      fee: 'Gratuito',
      note: 'No es un certificado de discapacidad. Algunas comunidades exigen residencia legal de todos los miembros; comprueba tu caso.'
    },

    {
      id: 'homologacion_no_universitaria', scope: 'national', cat: 'formacion', icon: 'book',
      title: 'Homologar ESO, Bachillerato o FP',
      when: 'Si terminaste estudios no universitarios fuera de España y necesitas el título español para trabajar, seguir estudiando o presentarte a una oposición.',
      where: 'Ministerio de Educación, Formación Profesional y Deportes / comunidad autónoma',
      url: 'https://www.educacionfpydeportes.gob.es/servicios-al-ciudadano/catalogo/gestion-titulos/estudios-no-universitarios/titulos-extranjeros.html',
      appointmentLabel: 'Abrir trámite del Ministerio',
      routeIds: [],
      docs: [
        'Pasaporte o NIE',
        'Título o certificado de estudios terminados',
        'Expediente con asignaturas, cursos y notas',
        'Programa de estudios, si lo piden',
        'Apostilla o legalización y traducción jurada',
        'Tasa 079 pagada'
      ],
      steps: [
        'Decide qué necesitas: homologación (título), convalidación (asignaturas) o equivalencia de escolaridad (nivel para seguir estudiando).',
        'Reúne el título, el expediente y el programa; apostilla/legaliza y traduce si hace falta.',
        'Paga la tasa 079 y presenta la solicitud por la sede del Ministerio o la comunidad.',
        'Consulta el estado del expediente y responde a los requerimientos.',
        'Si te deniegan, revisa el plazo de recurso o pide asesoramiento.'
      ],
      fee: 'Tasa 079 + traducciones/apostillas',
      note: 'No exige residencia legal y no regulariza tu situación. Para 4º de ESO: si terminaste la secundaria, pide homologación al título de Graduado en ESO; si tienes 4º aprobado pero no el título, pide convalidación o equivalencia de escolaridad. Para Bachillerato, homologación y después UNEDasiss/EBAU. La convalidación no te da un título.'
    },
    {
      id: 'homologacion_universitaria', scope: 'national', cat: 'formacion', icon: 'book',
      title: 'Homologar un título universitario',
      when: 'Si tienes un título de educación superior extranjero y quieres equipararlo a un Grado o Máster oficial español, o una declaración de equivalencia.',
      where: 'Ministerio de Ciencia, Innovación y Universidades',
      url: 'https://www.ciencia.gob.es/Universidades/validate/como_reconocer.html',
      appointmentLabel: 'Abrir trámite de Universidades',
      routeIds: [],
      docs: [
        'Pasaporte o NIE',
        'Título o diploma y expediente académico',
        'Programa de estudios y carga horaria',
        'Apostilla o legalización y traducción jurada',
        'Justificante de pago de la tasa'
      ],
      steps: [
        'Distingue homologación (equiparación al título español), equivalencia (nivel académico) y reconocimiento profesional (profesión regulada).',
        'Reúne título, expediente y programa; apostilla/legaliza y traduce.',
        'Presenta la solicitud por la sede de Universidades (Validate-TE) y paga la tasa.',
        'Consulta el estado y responde a los requerimientos.',
        'Si tu objetivo es estudiar un grado, valora UNEDasiss; si es trabajar en profesión regulada, valora reconocimiento profesional.'
      ],
      fee: 'Tasa universitaria correspondiente',
      note: 'No es lo mismo que la credencial UNEDasiss para acceder a la universidad. La homologación no regulariza tu situación migratoria. Algunas profesiones reguladas exigen además reconocimiento profesional.'
    },
    {
      id: 'unedasiss', scope: 'national', cat: 'formacion', icon: 'book',
      title: 'Acceso a la universidad con estudios extranjeros (UNEDasiss)',
      when: 'Si terminaste el bachillerato o secundaria superior fuera de España y quieres estudiar un grado en una universidad española.',
      where: 'UNEDasiss (Universidad Nacional de Educación a Distancia)',
      url: 'https://unedasiss.uned.es/',
      appointmentLabel: 'Abrir UNEDasiss',
      routeIds: [],
      docs: [
        'Pasaporte o NIE',
        'Título de bachillerato o certificado de estudios',
        'Expediente con notas',
        'Traducción jurada y apostilla, si procede',
        'Justificante de pago'
      ],
      steps: [
        'Comprueba si tu título está en el Anexo I de la Orden EFD/550/2025 o si necesitas PCE.',
        'Solicita la acreditación UNEDasiss y paga la tasa.',
        'Si necesitas subir nota, inscríbete en las Pruebas de Competencias Específicas (PCE).',
        'Consulta la nota de acceso y las universidades que la aceptan.',
        'Guarda la credencial para la preinscripción universitaria.'
      ],
      fee: 'Tasas de UNEDasiss y PCE',
      note: 'UNEDasiss no homologa tu título: acredita tu acceso a la universidad. Si necesitas el título español para trabajar u oposición, la vía es la homologación.'
    },

    {
      id: 'pasaporte_consulado', scope: 'national', cat: 'documentos', icon: 'globe',
      title: 'Pasaporte y documentos en tu consulado',
      when: 'Si tu pasaporte caduca, lo pierdes o necesitas antecedentes penales de tu país.',
      where: 'Embajada o consulado de tu país en España',
      url: 'https://www.exteriores.gob.es/',
      appointmentLabel: 'Buscar representación extranjera',
      docs: [
        'Pasaporte anterior o denuncia de pérdida',
        'Fotografías según el país',
        'Documento de identidad de tu país',
        'Justificante de cita y tasa consular'
      ],
      steps: [
        'Busca la embajada o consulado de tu país en España y su web oficial.',
        'Pide cita y revisa los requisitos exactos: cada país cambia fotos, tasas y plazos.',
        'Lleva originales y copias; algunos documentos requieren apostilla o traducción.',
        'Guarda el nuevo pasaporte y actualiza tu NIE/TIE si cambias datos.'
      ],
      fee: 'Según el país',
      note: 'La app no puede enlazar el consulado de cada país: usa el buscador oficial y desconfía de gestores que piden el pasaporte por adelantado.',
      routeIds: []
    },
    {
      id: 'vida_laboral', scope: 'national', cat: 'trabajo', icon: 'briefcase',
      title: 'Informe de vida laboral',
      when: 'Antes de un arraigo sociolaboral, una renovación, la nacionalidad o para comprobar tus cotizaciones.',
      where: 'Tesorería General de la Seguridad Social / Import@ss',
      url: 'https://portal.seg-social.gob.es/wps/portal/importass/importass/Categorias/vida%2blaboral%2be%2binformes',
      appointmentLabel: 'Abrir Import@ss',
      routeIds: ['arraigo_sociolaboral', 'renovacion', 'nac_residencia_2', 'nac_residencia_1', 'nac_residencia_10'],
      docs: [
        'DNI/NIE y número de la Seguridad Social',
        'Cl@ve, certificado digital o acceso con SMS',
        'Datos de la empresa o periodo que quieras comprobar'
      ],
      steps: [
        'Entra en Import@ss o en la sede de la Seguridad Social.',
        'Identifícate con Cl@ve, certificado o el sistema de acceso disponible.',
        'Descarga el informe de vida laboral y revisa altas, bajas y días cotizados.',
        'Si falta una cotización, pide cita en la TGSS con el contrato o las nóminas.',
        'Guarda el PDF: es una prueba clave para el arraigo sociolaboral.'
      ],
      fee: 'Gratuito',
      note: 'El informe recoge lo que la Seguridad Social tiene registrado. Si trabajaste sin alta, no aparecerá: eso no se arregla con el informe, necesita regularización laboral.'
    },
    {
      id: 'antecedentes_espana', scope: 'national', cat: 'documentos', icon: 'doc',
      title: 'Certificado de antecedentes penales de España',
      when: 'Para arraigo, residencia, nacionalidad, reagrupación, trabajo con menores o algunos visados. Suele caducar a los 3 meses.',
      where: 'Ministerio de Justicia, sede electrónica o Registro Civil',
      url: 'https://sede.mjusticia.gob.es/es/tramites/certificado-antecedentes',
      appointmentLabel: 'Pedir certificado',
      routeIds: ['arraigo_social', 'arraigo_sociolaboral', 'arraigo_socioformativo', 'familiar_espanol', 'reagrupacion', 'nac_residencia_2', 'nac_residencia_10'],
      docs: [
        'DNI/NIE o pasaporte',
        'Datos de identidad y fecha de nacimiento',
        'Cl@ve o certificado digital para la sede',
        'Justificante de pago, si el canal lo exige'
      ],
      steps: [
        'Entra en la sede de Justicia y elige «Certificado de antecedentes penales».',
        'Identifícate con Cl@ve o certificado digital; también hay solicitud presencial.',
        'Descarga el certificado y comprueba que no tiene errores.',
        'Guarda el PDF y no lo presentes si han pasado más de 3 meses.',
        'Si aparecen antecedentes que no son tuyos, pide rectificación.'
      ],
      fee: 'Gratuito por sede electrónica; comprueba el canal presencial',
      note: 'No habilita para trabajar con menores: para eso se pide el certificado de delitos de naturaleza sexual. No confundas antecedentes penales con antecedentes policiales.'
    },
    {
      id: 'antecedentes_origen', scope: 'national', cat: 'documentos', icon: 'globe',
      title: 'Antecedentes penales de tu país de origen',
      when: 'Para arraigo, residencia, reagrupación, nacionalidad o visados. Muchas vías miran los últimos 5 años.',
      where: 'Consulado o ministerio de tu país; después apostilla/legalización y traducción',
      url: 'https://www.exteriores.gob.es/',
      appointmentLabel: 'Buscar representación de tu país',
      routeIds: ['arraigo_social', 'arraigo_sociolaboral', 'arraigo_socioformativo', 'familiar_espanol', 'reagrupacion', 'visado_no_lucrativa', 'visado_estudios', 'visado_trabajo_ajena'],
      docs: [
        'Pasaporte o documento de identidad',
        'Certificado de antecedentes del país',
        'Apostilla de La Haya o legalización consular',
        'Traducción jurada al español',
        'Justificante de pago'
      ],
      steps: [
        'Pide el certificado en el consulado o ministerio de tu país.',
        'Apostíllalo si el país es parte del Convenio de La Haya; si no, legalízalo.',
        'Traduce al español con un traductor jurado.',
        'Comprueba la validez (habitualmente 3-6 meses) y presenta el original con copia.',
        'Si el certificado tarda, no esperes al último día: algunas vías admiten resguardo.'
      ],
      fee: 'Según el país + apostilla + traducción',
      note: 'No todos los delitos bloquean, pero no mientas. Un antecedente de hace 1 año suele ser reciente; uno de hace 20 puede estar cancelado o no, según el país y la pena. Consulta con abogado si hay dudas.'
    },
    {
      id: 'delitos_sexuales', scope: 'national', cat: 'documentos', icon: 'shield',
      title: 'Certificado de delitos de naturaleza sexual',
      when: 'Para trabajar habitualmente con menores, voluntariado, educación, sanidad o servicios sociales.',
      where: 'Ministerio de Justicia, Registro Central de Delincuentes Sexuales',
      url: 'https://sede.mjusticia.gob.es/es/tramites/certificado-registro-central',
      appointmentLabel: 'Pedir certificado',
      routeIds: [],
      docs: [
        'DNI/NIE o pasaporte',
        'Cl@ve o certificado digital',
        'Datos de identidad'
      ],
      steps: [
        'Entra en la sede de Justicia y elige el certificado del Registro Central de Delincuentes Sexuales.',
        'Identifícate y solicita el certificado.',
        'Descarga el PDF y entrégalo a la entidad que te lo pida.',
        'Si has residido fuera, puede que te pidan también un certificado del país de origen.'
      ],
      fee: 'Gratuito por sede electrónica',
      note: 'Es el único certificado español para trabajar con menores. No es el certificado de antecedentes penales general. Si tienes antecedentes sexuales, no ocultes: busca abogado antes de solicitar trabajo con menores.'
    },
    {
      id: 'apostilla', scope: 'national', cat: 'documentos', icon: 'doc',
      title: 'Apostilla de La Haya o legalización',
      when: 'Cuando un documento extranjero va a usarse en España, o un documento español en el extranjero.',
      where: 'Autoridad del país que emite el documento; en España, Ministerio de Justicia',
      url: 'https://sede.mjusticia.gob.es/tramites/apostilla-electronica',
      appointmentLabel: 'Apostilla electrónica',
      routeIds: [],
      docs: [
        'Documento original o copia auténtica',
        'Identidad del solicitante',
        'Justificante de pago, si procede',
        'Traducción jurada, si el documento no está en español'
      ],
      steps: [
        'Comprueba si el país emisor está en el Convenio de La Haya.',
        'Si lo está, pide la apostilla a la autoridad competente de ese país.',
        'Si no lo está, pide legalización consular o la vía que corresponda.',
        'Después, traduce el documento con un traductor jurado si hace falta.',
        'No apostilles una fotocopia: debe ser el documento original o copia auténtica.'
      ],
      fee: 'Según el país y el documento',
      note: 'La apostilla no traduce ni valida el contenido: solo acredita la autenticidad de la firma. Si el país no es de La Haya, la apostilla no sirve: necesita legalización.'
    },
    {
      id: 'traduccion_jurada', scope: 'national', cat: 'documentos', icon: 'doc',
      title: 'Traducción jurada',
      when: 'Cuando un documento oficial está en otro idioma y lo presentas en España.',
      where: 'Traductor-intérprete jurado habilitado por el Ministerio de Asuntos Exteriores',
      url: 'https://www.exteriores.gob.es/',
      appointmentLabel: 'Buscar traductor jurado',
      routeIds: [],
      docs: [
        'Documento original completo',
        'Copia legible de todas las páginas',
        'Datos del organismo que lo va a recibir'
      ],
      steps: [
        'Busca un traductor jurado del idioma correspondiente en el buscador oficial.',
        'Envíale el documento completo y confirma precio y plazo.',
        'Revisa que la traducción incluya sello, firma y número del traductor.',
        'Presenta la traducción junto con el original o copia auténtica.',
        'No traduzcas tú mismo ni uses una traducción sin sello jurado.'
      ],
      fee: 'Según idioma, páginas y urgencia',
      note: 'La traducción jurada no sustituye a la apostilla: son pasos distintos. Un traductor jurado no puede arreglar un documento falso o incompleto.'
    },
    {
      id: 'denuncia_fraude_laboral', scope: 'national', cat: 'trabajo', icon: 'briefcase',
      title: 'Denunciar fraude laboral y reclamar salarios',
      when: 'Si trabajas horas no pagadas, te contratan 30 h y haces 50, la nómina no refleja la realidad o te pagan por debajo del convenio.',
      where: 'Inspección de Trabajo / SMAC / juzgado de lo social',
      url: 'https://www.mites.gob.es/itss/web/index.html',
      appointmentLabel: 'Abrir Inspección de Trabajo',
      routeIds: [],
      docs: [
        'Contrato y nóminas',
        'Transferencias o recibos de salario',
        'Horarios, registros de entrada/salida y mensajes',
        'Cálculo de horas y diferencias',
        'DNI/NIE y datos de la empresa'
      ],
      steps: [
        'Reúne pruebas y calcula las horas reales y lo que deberían pagarte.',
        'Pide por escrito a la empresa que regularice jornada y salario; guarda la respuesta.',
        'Acude a un sindicato, abogado laboralista o entidad gratuita.',
        'Denuncia en la Inspección de Trabajo por sede electrónica o por escrito.',
        'Para cobrar: papeleta de conciliación en el SMAC y, si no hay acuerdo, juzgado de lo social.',
        'No firmes un finiquito falso ni uses nóminas falsas para Extranjería.'
      ],
      fee: 'Gratuito',
      note: 'La Inspección puede sancionar a la empresa y regularizar cotizaciones, pero no te concede residencia. El plazo general para reclamar salarios es de 1 año.'
    },
    {
      id: 'solicitar_ayuda_social', scope: 'local', cat: 'ayuda', icon: 'family',
      title: 'Solicitar valoración y ayuda social',
      when: 'Si no tienes ingresos suficientes, riesgo de perder la vivienda, facturas impagadas, comida, menores o una urgencia social.',
      where: function (c) { return 'Servicios Sociales de ' + (c.localLabel || 'tu ayuntamiento') + ' de ' + (c.municipality || 'tu municipio'); },
      urlKey: 'social',
      appointmentLabel: 'Web de servicios sociales',
      routeIds: [],
      docs: [
        'Pasaporte, NIE o documento de identidad',
        'Certificado de empadronamiento',
        'Ingresos, nóminas o justificante de ausencia de ingresos',
        'Contrato de alquiler, facturas o recibos',
        'Libro de familia, informes médicos, discapacidad o dependencia',
        'Cualquier resolución o denegación anterior'
      ],
      steps: [
        'Pide cita en servicios sociales; si no te la dan, presenta un escrito por registro y guarda el resguardo.',
        'Explica tu situación y pide una valoración social y, si procede, ayuda de emergencia.',
        'Lleva toda la documentación y pide copia de lo que presentes.',
        'Si te deniegan, solicita la razón por escrito y el plazo de recurso.',
        'Si no te atienden, reclama en el ayuntamiento, la consejería o el Defensor del Pueblo/autonómico.'
      ],
      fee: 'Gratuito',
      note: 'No es una ayuda automática: depende de requisitos, presupuesto y valoración. Pero tienes derecho a información, valoración y respuesta; no a que te la concedan siempre.'
    },
    {
      id: 'tarjeta_transporte', scope: 'region', cat: 'transporte', icon: 'route',
      title: 'Tarjeta de transporte y abonos',
      when: 'Si eres joven, estudiante, persona con discapacidad, familia numerosa o mayor y quieres descuento en bus, metro o cercanías.',
      where: function (c) { return 'Consorcio de transporte o ayuntamiento de ' + c.regionName; },
      urlKey: 'portal',
      appointmentLabel: 'Web de transporte de tu comunidad',
      routeIds: [],
      docs: [
        'DNI/NIE o pasaporte',
        'Certificado de empadronamiento',
        'Certificado de discapacidad, familia numerosa o matrícula, si procede',
        'Fotografía y formulario de la tarjeta',
        'Justificante de pago, si la tarjeta no es gratuita'
      ],
      steps: [
        'Consulta en tu consorcio/ayuntamiento qué tarjetas hay y cuál te corresponde.',
        'Reúne el documento que acredita tu condición (discapacidad, edad, estudio, familia numerosa).',
        'Solicita la tarjeta online o en la oficina de transporte; paga la tasa si procede.',
        'Actívala o recárgala según el sistema de tu ciudad.',
        'Para media/larga distancia, pregunta en Renfe o en la empresa de autobús por sus descuentos.'
      ],
      fee: 'Gratuito o tarifa reducida según la comunidad',
      note: 'No hay una tarjeta única nacional. La tarjeta de estacionamiento para movilidad reducida es distinta del abono de transporte. Pregunta por el abono social si no puedes pagar.'
    },
    {
      id: 'examen_ccse', scope: 'national', cat: 'formacion', icon: 'doc',
      title: 'Inscribirse al examen CCSE',
      when: 'Si vas a solicitar la nacionalidad española por residencia y no estás exento (por ejemplo, por haber cursado la ESO en España).',
      where: 'Centro del Instituto Cervantes o centro acreditado de tu ciudad',
      url: 'https://cervantes.org/es/examenes/ccse',
      appointmentLabel: 'Inscripción CCSE',
      routeIds: ['nac_residencia_2', 'nac_residencia_1', 'nac_residencia_10', 'nac_22_2f'],
      docs: [
        'NIE o pasaporte',
        'Resguardo de inscripción y pago',
        'Dos documentos de identidad el día del examen',
        'Certificado o título de ESO en España si estás exento'
      ],
      steps: [
        'Entra en la web del Instituto Cervantes y elige centro y convocatoria.',
        'Inscríbete y paga la tasa (85 €); guarda el resguardo.',
        'Prepara las 25 preguntas y las tareas del examen.',
        'Acude el día asignado con dos documentos de identidad.',
        'Consulta el resultado en tu espacio privado; si apruebas, descarga el certificado.',
        'Si suspendes, tienes una segunda convocatoria incluida; pídela en el plazo.'
      ],
      fee: '85 € (incluye hasta dos convocatorias)',
      note: '25 preguntas, 45 minutos, 15 aciertos para aprobar. El certificado suele valer 4 años. No esperes al último día: las plazas son limitadas.'
    },
    {
      id: 'examen_dele', scope: 'national', cat: 'formacion', icon: 'book',
      title: 'Inscribirse al DELE A2',
      when: 'Si vas a solicitar la nacionalidad por residencia y no eres nacional de un país hispanohablante ni estás exento.',
      where: 'Centro del Instituto Cervantes, universidad o centro acreditado',
      url: 'https://cervantes.org/es/examenes/dele',
      appointmentLabel: 'Inscripción DELE',
      routeIds: ['nac_residencia_2', 'nac_residencia_1', 'nac_residencia_10', 'nac_22_2f'],
      docs: [
        'Pasaporte o NIE',
        'Resguardo de inscripción y pago',
        'Documento de identidad el día del examen'
      ],
      steps: [
        'Elige centro, nivel A2 y convocatoria en la web del Instituto Cervantes.',
        'Inscríbete y paga la tasa (aproximadamente 138 €, según centro).',
        'Prepara las pruebas de lectura, escritura, audición y expresión oral.',
        'Acude el día asignado; el examen dura unas 2,5 horas.',
        'Consulta el resultado y descarga el diploma si eres apto.',
        'Presenta el diploma con la solicitud de nacionalidad.'
      ],
      fee: 'Aproximadamente 138 € (varía por centro)',
      note: 'Se aprueba con 60/100 y apto en los grupos. El diploma no caduca. Los nacionales de países hispanohablantes están exentos; Brasil, Portugal, Andorra y Filipinas no lo están.'
    },
    {
      id: 'declaracion_renta', scope: 'national', cat: 'trabajo', icon: 'doc',
      title: 'Declaración de la renta (IRPF)',
      when: 'Si eres residente fiscal y tus rentas superan los umbrales, tienes alquileres, actividad económica o varias pagas; también si quieres recuperar retenciones.',
      where: 'AEAT · Renta WEB, teléfono o oficina con cita',
      url: 'https://sede.agenciatributaria.gob.es/',
      appointmentLabel: 'Abrir AEAT',
      routeIds: [],
      docs: [
        'Certificado de retenciones del trabajo',
        'Nóminas, pensión o prestaciones',
        'Datos de alquileres, actividad económica o capital',
        'DNI/NIE y referencia del borrador',
        'Cuenta bancaria para devolución o pago'
      ],
      steps: [
        'Comprueba si estás obligado según tus rentas anuales, no solo los meses trabajados.',
        'Entra en Renta WEB con Cl@ve o certificado y revisa el borrador.',
        'Confirma o corrige datos, y presenta online.',
        'Si sale a ingresar, elige pago o domiciliación antes del 25 de junio.',
        'Si no estás obligado pero te retuvieron, presenta para recuperar.',
        'Guarda el justificante y la declaración.'
      ],
      fee: 'Gratuito; si sale a ingresar, paga la cuota',
      note: 'Campaña: 8 de abril a 30 de junio del año siguiente. Residencia fiscal = más de 183 días o centro de intereses; la residencia legal no basta. Con 3 meses de trabajo, el total anual suele quedar por debajo de 22.000 €, pero depende.'
    }
  ];

  function resolveUrl(proc, region) {
    if (proc.url) return proc.url;
    if (proc.urlKey && region && region[proc.urlKey]) return region[proc.urlKey];
    return region ? region.portal : INCLUSION;
  }
  function forRoute(routeId) {
    return P.filter(function (p) { return p.routeIds.indexOf(routeId) !== -1; });
  }
  function forRoutes(routeIds) {
    var out = [], seen = {};
    (routeIds || []).forEach(function (rid) {
      forRoute(rid).forEach(function (p) {
        if (!seen[p.id]) { seen[p.id] = true; out.push(p); }
      });
    });
    return out;
  }

  RL.procedures = {
    all: P,
    resolveUrl: resolveUrl,
    forRoute: forRoute,
    forRoutes: forRoutes,
    categories: [
      { id: 'todas', label: 'Todo' },
      { id: 'documentos', label: 'Documentos' },
      { id: 'familia', label: 'Familia' },
      { id: 'trabajo', label: 'Trabajo' },
      { id: 'salud', label: 'Salud' },
      { id: 'derechos', label: 'Discapacidad y derechos' },
      { id: 'formacion', label: 'Estudios' },
      { id: 'transporte', label: 'Transporte' },
      { id: 'ayuda', label: 'Ayuda' }
    ]
  };
})();

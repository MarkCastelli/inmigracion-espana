/* Pruebas de las ventanas de oportunidad. */
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const { loadRL } = require('./harness');

const RL = loadRL();

function base(extra) {
  return Object.assign({
    nationality: 'CO', age: 32, location: 'spain', entryMode: 'tourist_free',
    timeInSpain: '1to2y', permitStatus: 'none', empadronado: 'yes',
    criminalSpain: 'no', criminalOrigin: 'no', monthlyIncome: 900,
    childrenCount: 0, goals: ['regularizar']
  }, extra || {});
}

test('con residencia no se muestran avisos históricos de visa o turismo', () => {
  const plan = RL.buildPlan(base({
    entryMode: 'tourist_free', visaExpiry: RL.dates.addDays(RL.dates.today(), -500),
    permitStatus: 'work', permitExpiry: RL.dates.addDays(RL.dates.today(), 30),
    residenceApproved: 'yes', residenceApprovedYears: 4
  }));
  assert.ok(!plan.windows.some(w => /visado\/estancia/i.test(w.title)), 'no debe mostrar la visa vieja');
  assert.ok(!plan.windows.some(w => /Con turismo no puedes/i.test(w.title)), 'no debe mostrar el aviso turista');
  assert.ok(plan.windows.some(w => /TIE caduca/i.test(w.title)), 'sí debe mostrar el vencimiento actual de la TIE');
});

test('las acciones se adaptan a una familia con TIE, ESO y cónyuge peruana', () => {
  const plan = RL.buildPlan(base({
    nationality: 'AR', permitStatus: 'work', permitExpiry: RL.dates.addYears(RL.dates.today(), 1),
    docsBase: ['tie'], empadronado: 'yes', exams: 'none',
    maritalStatus: 'casado', partnerNationality: 'PE', partnerLegalStatus: 'residence',
    partnerNeed: 'nacionalidad', childrenCommon: 2,
    child1Education: 'eso', child2Education: 'eso'
  }));
  const ids = plan.actions.map(a => a.id);
  assert.ok(!ids.includes('padron-cert'), 'con TIE no debe pedir padrón histórico');
  assert.ok(!ids.includes('antecedentes'), 'sin trámite abierto no debe pedir antecedentes');
  assert.ok(!ids.includes('dele'), 'un argentino no debe preparar DELE');
  assert.ok(ids.includes('ccse'), 'debe preparar solo CCSE');
  assert.ok(plan.d.familyAdvice.some(x => /solo necesita el CCSE/i.test(x.text)), 'la pareja peruana solo CCSE');
  assert.ok(plan.d.familyAdvice.some(x => /ESO en España/i.test(x.text)), 'los hijos con ESO no necesitan exámenes');
});

test('los antecedentes dependen de la fecha de la cita', () => {
  const noCita = RL.buildPlan(base({ permitStatus: 'none', hasAppointment: 'no' }));
  assert.ok(noCita.actions.some(a => a.id === 'antecedentes-cita'), 'sin cita no debe pedirlos');

  const far = RL.buildPlan(base({
    permitStatus: 'none', hasAppointment: 'yes',
    appointmentDate: RL.dates.addDays(RL.dates.today(), 120)
  }));
  assert.ok(far.actions.some(a => a.id === 'antecedentes-espera'), 'con cita lejana debe esperar');

  const near = RL.buildPlan(base({
    permitStatus: 'none', hasAppointment: 'yes',
    appointmentDate: RL.dates.addDays(RL.dates.today(), 30)
  }));
  assert.ok(near.actions.some(a => a.id === 'antecedentes'), 'con cita cercana debe pedirlos');
});

test('el certificado de padrón también depende de la cita', () => {
  const noCita = RL.buildPlan(base({ permitStatus: 'none', empadronado: 'yes', hasAppointment: 'no' }));
  assert.ok(noCita.actions.some(a => a.id === 'padron-cita'), 'sin cita no debe pedir padrón');

  const far = RL.buildPlan(base({
    permitStatus: 'none', empadronado: 'yes', hasAppointment: 'yes',
    appointmentDate: RL.dates.addDays(RL.dates.today(), 120)
  }));
  assert.ok(far.actions.some(a => a.id === 'padron-espera'), 'con cita lejana debe esperar');

  const near = RL.buildPlan(base({
    permitStatus: 'none', empadronado: 'yes', hasAppointment: 'yes',
    appointmentDate: RL.dates.addDays(RL.dates.today(), 30)
  }));
  assert.ok(near.actions.some(a => a.id === 'padron-cert'), 'con cita cercana debe pedirlo');
});

test('no se recomienda pagar homologación sin trámite concreto', () => {
  const sin = RL.buildPlan(base({ degree: 'grado', hasAppointment: 'no' }));
  assert.ok(!sin.actions.some(a => a.id === 'homologacion'), 'sin trámite no debe pedir homologación');
  const con = RL.buildPlan(base({ degree: 'grado', hasAppointment: 'yes', appointmentDate: RL.dates.addDays(RL.dates.today(), 30) }));
  assert.ok(con.actions.some(a => a.id === 'homologacion'), 'con trámite puedo valorarla');
});

test('un visado que caduca pronto genera una ventana', () => {
  const plan = RL.buildPlan(base({ visaExpiry: RL.dates.addDays(RL.dates.today(), 30) }));
  assert.ok(plan.windows.some(w => /caduca en 30 días/i.test(w.title)));
});

test('la renovación administrativa y la TIE física tienen fechas distintas', () => {
  const expiry = RL.dates.addDays(RL.dates.today(), 45);
  const plan = RL.buildPlan(base({ permitStatus: 'work', permitExpiry: expiry }));
  const admin = plan.timeline.find(w => /Mercurio\/sede/i.test(w.title));
  const physical = plan.timeline.find(w => /huellas y TIE f[ií]sica/i.test(w.title));
  assert.ok(admin, 'falta la ventana administrativa');
  assert.ok(physical, 'falta la ventana de huellas/TIE');
  assert.ok(/NO habilita la TIE f[ií]sica/i.test(admin.detail));
  assert.ok(/nunca antes/i.test(physical.detail));
  assert.strictEqual(physical.date, expiry);
  const alert = plan.windows.find(a => /TIE caduca/i.test(a.title));
  assert.ok(alert && /nunca antes/i.test(alert.body));
});

test('una renuncia a la protección internacional no cuenta como asilo en trámite', () => {
  const renounced = RL.dates.addMonths(RL.dates.today(), -6).slice(0, 7);
  const [ry, rm] = renounced.split('-');
  const plan = RL.buildPlan(base({
    entryMode: 'asylum', permitStatus: 'asylum', asylumStage: 'renunciado',
    asylumRenouncedMonth: rm, asylumRenouncedYear: Number(ry), timeInSpain: '2to3y'
  }));
  assert.strictEqual(plan.d.asylumRenounced, true);
  assert.strictEqual(plan.d.asylumInProcess, false);
  assert.ok(plan.d.arraigoMonths != null && plan.d.arraigoMonths < 12);
  assert.ok(plan.alerts.some(a => /Renunciaste a la protección internacional/i.test(a.title)));
  const fields = RL.questions.steps.flatMap(s => s.fields || []);
  for (const id of ['asylumRenouncedDay', 'asylumRenouncedMonth', 'asylumRenouncedYear']) {
    const field = fields.find(f => f.id === id);
    assert.ok(field, 'falta ' + id);
    assert.ok(!field.required, id + ' no debe ser obligatorio');
  }
});

test('la renuncia se guarda aunque solo se recuerde el año', () => {
  const plan = RL.buildPlan(base({
    entryMode: 'asylum', permitStatus: 'asylum', asylumStage: 'renunciado',
    asylumRenouncedYear: 2024, entryDate: '2024-01-01'
  }));
  assert.strictEqual(plan.d.asylumRenouncedDateISO, '');
  assert.strictEqual(plan.d.asylumRenouncedDateText, '2024');
  assert.strictEqual(plan.d.arraigoMonths, null);
  assert.ok(!plan.timeline.some(t => /2 años computables para el arraigo/i.test(t.title)), 'sin mes no debe inventar la fecha de arraigo');
});

test('después de renunciar se distingue arraigo concedido de seguir irregular', () => {
  const granted = RL.buildPlan(base({
    entryMode: 'asylum', permitStatus: 'asylum', asylumStage: 'renunciado',
    asylumRenouncedYear: 2024, asylumRenouncedMonth: '03',
    postRenunciationOutcome: 'arraigo_granted', postRenunciationDate: '2025-06'
  }));
  assert.strictEqual(granted.d.postRenunciationGranted, true);
  assert.strictEqual(granted.d.hasPermit, true);
  assert.strictEqual(granted.d.irregular, false);
  assert.strictEqual(granted.d.arraigoMonths, null);
  assert.ok(granted.alerts.some(a => /Después del asilo obtuviste/i.test(a.title)));

  const irregular = RL.buildPlan(base({
    entryMode: 'asylum', permitStatus: 'asylum', asylumStage: 'renunciado',
    asylumRenouncedYear: 2024, asylumRenouncedMonth: '03',
    postRenunciationOutcome: 'irregular'
  }));
  assert.strictEqual(irregular.d.irregular, true);
  assert.ok(irregular.d.arraigoMonths != null);
});

test('el asilo antes de 90 días y la residencia posterior no se tratan como sobreestancia', () => {
  const plan = RL.buildPlan(base({
    entryMode: 'tourist_free', timeInSpain: '3plus', permitStatus: 'none',
    asylumStage: 'denegado', asylumBefore90: 'yes',
    postRenunciationOutcome: 'arraigo_formacion_granted', residenceApproved: 'yes',
    residenceApprovedYears: 4, tieWaitingExpiry: 'yes', docsBase: ['tie']
  }));
  assert.strictEqual(plan.d.overstay, false);
  assert.strictEqual(plan.d.hasPermit, true);
  assert.strictEqual(plan.d.irregular, false);
  assert.strictEqual(plan.d.residenceApprovedYears, 4);
  assert.ok(!plan.alerts.some(a => /Has superado los 90/i.test(a.title)), 'no debe avisar de sobreestancia');
  assert.ok(!plan.alerts.some(a => /Tu solicitud de asilo fue denegada/i.test(a.title)), 'no debe quedarse en la denegación');
  assert.ok(plan.alerts.some(a => /Después del asilo/i.test(a.title)));
});

test('con residencia posterior no se recomienda seguir el asilo', () => {
  const plan = RL.buildPlan(base({
    entryMode: 'tourist_free', timeInSpain: '3plus', asylumStage: 'denegado',
    asylumBefore90: 'yes', postRenunciationOutcome: 'arraigo_formacion_granted',
    residenceApproved: 'yes', residenceApprovedYears: 4, docsBase: ['tie']
  }));
  const r = plan.results.find(x => x.route.id === 'asilo_seguimiento');
  assert.ok(r, 'falta la ficha de seguimiento');
  assert.ok(r.blockers.some(b => /no estás en trámite|autorización posterior/i.test(b)), 'debe bloquear el seguimiento');
  assert.match(r.fit || '', /No es tu vía/i);
  assert.ok(!plan.timeline.some(t => /Fin de los 90 días de turista/i.test(t.title)), 'no debe mostrar el fin de 90 días');
});

test('el asilo está en una sola página y no pregunta la denegación si renunciaste', () => {
  const asylo = RL.questions.steps.find(s => s.id === 'asilo');
  assert.ok(asylo, 'falta la página de asilo');
  const ids = asylo.fields.map(f => f.id);
  for (const id of ['asylumStage', 'asylumBefore90', 'asylumDeniedDate', 'postRenunciationOutcome']) {
    assert.ok(ids.includes(id), 'falta ' + id);
  }
  const elsewhere = RL.questions.steps.filter(s => s.id !== 'asilo')
    .flatMap(s => s.fields || []).map(f => f.id);
  assert.ok(!elsewhere.includes('asylumStage'), 'el asilo no debe estar repartido');
  const visible = RL.questions.visibleFields(asylo, base({ asylumStage: 'renunciado' })).map(f => f.id);
  assert.ok(!visible.includes('asylumDeniedDate'), 'si renunció no se pregunta la fecha de denegación');
  assert.ok(!visible.includes('asylumAppeal'), 'si renunció no se pregunta el recurso');
});

test('el tiempo en España se pregunta una sola vez', () => {
  const ids = RL.questions.steps.flatMap(s => s.fields || []).map(f => f.id);
  assert.strictEqual(ids.filter(id => id === 'timeInSpain').length, 1);
});

test('el turismo no abre la nacionalidad de 2 años', () => {
  const plan = RL.buildPlan(base({
    nationality: 'AR', entryMode: 'tourist_free', timeInSpain: '2to3y',
    permitStatus: 'none', goals: ['nacionalidad']
  }));
  const n2 = plan.results.find(x => x.route.id === 'nac_residencia_2');
  assert.ok(n2, 'falta nacionalidad de 2 años');
  assert.strictEqual(n2.status, 'blocked');
});

test('desistir del asilo no se registra como denegación', () => {
  const d = RL.derive(base({ asylumStage: 'desistido', asylumBefore90: 'yes' }));
  assert.strictEqual(d.asylumWithdrawn, true);
  assert.strictEqual(d.asylumDenied, false);
  assert.strictEqual(d.asylumExited, true);
});

test('la renovación de la TIE es dinámica: Mercurio, aprobación, huellas y retirada', () => {
  const expiring = RL.dates.addDays(RL.dates.today(), 30);
  const baseProfile = {
    location: 'spain',
    permitStatus: 'residencia_temporal', permitYears: '4', permitExpiry: expiring,
    renewalMercurio: 'yes', renewalApproved: 'pending'
  };
  const situacion = RL.questions.steps.find(s => s.id === 'situacion');
  let ids = RL.questions.visibleFields(situacion, baseProfile).map(f => f.id);
  assert.ok(ids.includes('renewalMercurio'));
  assert.ok(ids.includes('renewalApproved'));
  assert.ok(!ids.includes('huellasAppointment'), 'sin aprobación no se piden huellas');

  const planPending = RL.buildPlan(base(baseProfile));
  assert.ok(planPending.alerts.some(a => /pendiente de aprobación/i.test(a.title)));

  const approved = Object.assign({}, baseProfile, { renewalApproved: 'yes', huellasAppointment: 'no' });
  ids = RL.questions.visibleFields(situacion, approved).map(f => f.id);
  assert.ok(ids.includes('huellasAppointment'));
  const planApproved = RL.buildPlan(base(approved));
  assert.ok(planApproved.alerts.some(a => /pide cita para huellas/i.test(a.title)));

  const fingerprints = Object.assign({}, approved, { huellasAppointment: 'yes', tiePickupAppointment: 'no' });
  const planFingerprints = RL.buildPlan(base(fingerprints));
  assert.strictEqual(planFingerprints.d.tieHuellasCita, true);
  assert.ok(planFingerprints.alerts.some(a => /cita de retirada/i.test(a.title)));

  const pickup = Object.assign({}, fingerprints, { tiePickupAppointment: 'yes' });
  assert.strictEqual(RL.derive(base(pickup)).tieCardPending, true);
});

test('un permiso caducado hace poco avisa de los 3 meses', () => {
  const plan = RL.buildPlan(base({
    permitStatus: 'work', permitExpiry: RL.dates.addDays(RL.dates.today(), -20)
  }));
  assert.ok(plan.windows.some(w => /3 meses/i.test(w.title)));
});

test('a quien le faltan 12 meses para el arraigo se le dice', () => {
  const plan = RL.buildPlan(base({ timeInSpain: '1to2y' }));
  assert.ok(plan.windows.some(w => /2 años de arraigo/i.test(w.title)));
});

test('estudios y turismo tienen ventanas distintas', () => {
  const estudios = RL.buildPlan(base({ entryMode: 'studies', permitStatus: 'studies' }));
  assert.ok(estudios.windows.some(w => /pasar a trabajo/i.test(w.title)));
  const turista = RL.buildPlan(base({ entryMode: 'tourist_visa' }));
  assert.ok(turista.windows.some(w => /no puedes trabajar/i.test(w.title)));
});

test('el tiempo como solicitante de asilo no cuenta para el arraigo', () => {
  const plan = RL.buildPlan(base({
    entryMode: 'asylum', timeInSpain: '2to3y', permitStatus: 'asylum',
    asylumStage: 'denegado', asylumDeniedDate: RL.dates.addDays(RL.dates.today(), -30)
  }));
  assert.ok(plan.d.arraigoMonths != null);
  assert.ok(plan.d.arraigoMonths < 2, 'no debe contar los años de asilo');
  assert.notStrictEqual(plan.reality.level, 'solid');
});

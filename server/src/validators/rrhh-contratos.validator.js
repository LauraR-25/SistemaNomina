const SEXOS = new Set(['M', 'F']);
const ESTADOS_CIVILES = new Set(['SOLTERO', 'CASADO', 'DIVORCIADO', 'VIUDO', 'CONCUBINO']);
const ESTADOS_PERSONA = new Set(['ACTIVO', 'INACTIVO']);
const TIPOS_PAGO = new Set(['POR_HORA', 'SALARIO_FIJO']);
const FRECUENCIAS = new Set(['SEMANAL', 'QUINCENAL', 'MENSUAL']);
const ESTADOS_CONTRATO = new Set(['VIGENTE', 'SUSPENDIDO', 'FINALIZADO']);

function texto(v) { return String(v ?? '').trim(); }
function numero(v) { if (v === '' || v === null || v === undefined) return null; const n = Number(v); return Number.isFinite(n) ? n : null; }
function fechaValida(v) { return /^\d{4}-\d{2}-\d{2}$/.test(texto(v)); }
function tiene(body, ...ks) { return ks.some((k) => Object.prototype.hasOwnProperty.call(body, k)); }

export function validarCrearPersona(body = {}) {
  const errores = [];
  const cedula = texto(body.cedula);
  const primerNombre = texto(body.primerNombre ?? body.primer_nombre);
  const segundoNombre = texto(body.segundoNombre ?? body.segundo_nombre);
  const primerApellido = texto(body.primerApellido ?? body.primer_apellido);
  const segundoApellido = texto(body.segundoApellido ?? body.segundo_apellido);
  const rif = texto(body.rif);
  const email = texto(body.email);
  const nroTlf = texto(body.nroTlf ?? body.nro_tlf);
  const direccion = texto(body.direccion);
  const sexo = texto(body.sexo).toUpperCase();
  const estadoCivil = texto(body.estadoCivil ?? body.estado_civil).toUpperCase();
  const estado = texto(body.estado || 'ACTIVO').toUpperCase();
  const fechaNacimiento = texto(body.fechaNacimiento ?? body.fecha_nacimiento);

  if (!cedula) errores.push('La cédula es obligatoria.');
  else if (cedula.length > 20) errores.push('La cédula no puede exceder 20 caracteres.');
  if (!primerNombre) errores.push('El primer nombre es obligatorio.');
  if (!primerApellido) errores.push('El primer apellido es obligatorio.');
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errores.push('El correo electrónico no es válido.');
  if (sexo && !SEXOS.has(sexo)) errores.push('El sexo indicado no es válido.');
  if (estadoCivil && !ESTADOS_CIVILES.has(estadoCivil)) errores.push('El estado civil indicado no es válido.');
  if (!ESTADOS_PERSONA.has(estado)) errores.push('El estado de la persona no es válido.');
  if (fechaNacimiento && !fechaValida(fechaNacimiento)) errores.push('La fecha de nacimiento no es válida.');

  return {
    valido: errores.length === 0,
    errores,
    datos: {
      empresaId: body.empresaId || body.empresa_id,
      cedula, rif: rif || null, primerNombre, segundoNombre: segundoNombre || null,
      primerApellido, segundoApellido: segundoApellido || null,
      fechaNacimiento: fechaNacimiento || null, sexo: sexo || null, estadoCivil: estadoCivil || null,
      nroTlf: nroTlf || null, email: email || null, direccion: direccion || null, estado,
    },
  };
}

export function validarActualizarPersona(body = {}) {
  const errores = [];
  const datos = {};
  if (tiene(body, 'cedula')) { const v = texto(body.cedula); if (!v) errores.push('La cédula es obligatoria.'); else if (v.length > 20) errores.push('La cédula no puede exceder 20 caracteres.'); else datos.cedula = v; }
  if (tiene(body, 'primer_nombre', 'primerNombre')) { const v = texto(body.primerNombre ?? body.primer_nombre); if (!v) errores.push('El primer nombre es obligatorio.'); else datos.primerNombre = v; }
  if (tiene(body, 'primer_apellido', 'primerApellido')) { const v = texto(body.primerApellido ?? body.primer_apellido); if (!v) errores.push('El primer apellido es obligatorio.'); else datos.primerApellido = v; }
  if (tiene(body, 'segundo_nombre', 'segundoNombre')) datos.segundoNombre = texto(body.segundoNombre ?? body.segundo_nombre) || null;
  if (tiene(body, 'segundo_apellido', 'segundoApellido')) datos.segundoApellido = texto(body.segundoApellido ?? body.segundo_apellido) || null;
  if (tiene(body, 'rif')) datos.rif = texto(body.rif) || null;
  if (tiene(body, 'email')) { const v = texto(body.email); if (v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) errores.push('El correo electrónico no es válido.'); else datos.email = v || null; }
  if (tiene(body, 'nro_tlf', 'nroTlf')) datos.nroTlf = texto(body.nroTlf ?? body.nro_tlf) || null;
  if (tiene(body, 'direccion')) datos.direccion = texto(body.direccion) || null;
  if (tiene(body, 'fecha_nacimiento', 'fechaNacimiento')) { const v = texto(body.fechaNacimiento ?? body.fecha_nacimiento); if (v && !fechaValida(v)) errores.push('La fecha de nacimiento no es válida.'); else datos.fechaNacimiento = v || null; }
  if (tiene(body, 'sexo')) { const v = texto(body.sexo).toUpperCase(); if (v && !SEXOS.has(v)) errores.push('El sexo indicado no es válido.'); else datos.sexo = v || null; }
  if (tiene(body, 'estado_civil', 'estadoCivil')) { const v = texto(body.estadoCivil ?? body.estado_civil).toUpperCase(); if (v && !ESTADOS_CIVILES.has(v)) errores.push('El estado civil indicado no es válido.'); else datos.estadoCivil = v || null; }
  if (tiene(body, 'estado')) { const v = texto(body.estado).toUpperCase(); if (!ESTADOS_PERSONA.has(v)) errores.push('El estado de la persona no es válido.'); else datos.estado = v; }
  if (errores.length === 0 && Object.keys(datos).length === 0) errores.push('Debes enviar al menos un campo para actualizar.');
  return { valido: errores.length === 0, errores, datos };
}

export function validarCrearCargo(body = {}) {
  const errores = [];
  const nombre = texto(body.nombre);
  const descripcion = texto(body.descripcion);
  if (!nombre) errores.push('El nombre del cargo es obligatorio.');
  else if (nombre.length > 100) errores.push('El nombre del cargo no puede exceder 100 caracteres.');
  if (descripcion.length > 200) errores.push('La descripción no puede exceder 200 caracteres.');
  return { valido: errores.length === 0, errores, datos: { nombre, descripcion: descripcion || null, activo: body.activo !== false } };
}

export function validarActualizarCargo(body = {}) {
  const errores = [];
  const datos = {};
  if (Object.prototype.hasOwnProperty.call(body, 'nombre')) { const nombre = texto(body.nombre); if (!nombre) errores.push('El nombre del cargo es obligatorio.'); else if (nombre.length > 100) errores.push('El nombre del cargo no puede exceder 100 caracteres.'); else datos.nombre = nombre; }
  if (Object.prototype.hasOwnProperty.call(body, 'descripcion')) { const descripcion = texto(body.descripcion); if (descripcion.length > 200) errores.push('La descripción no puede exceder 200 caracteres.'); else datos.descripcion = descripcion || null; }
  if (Object.prototype.hasOwnProperty.call(body, 'activo')) datos.activo = Boolean(body.activo);
  if (errores.length === 0 && Object.keys(datos).length === 0) errores.push('Debes enviar al menos un campo para actualizar.');
  return { valido: errores.length === 0, errores, datos };
}

export function validarCrearContrato(body = {}) {
  const errores = [];
  const personaId = texto(body.persona_id ?? body.personaId);
  const cargoId = numero(body.cargo_id ?? body.cargoId);
  const fechaInicio = texto(body.fecha_inicio ?? body.fechaInicio ?? body.fecha_ingreso);
  const fechaFin = texto(body.fecha_fin ?? body.fechaFin);
  const tipoPago = texto(body.tipo_pago ?? body.tipoPago).toUpperCase();
  const frecuenciaPago = texto(body.frecuencia_pago ?? body.frecuenciaPago).toUpperCase();
  const horasSemanales = numero(body.horas_semanales ?? body.horasSemanales);
  const estado = texto(body.estado || 'VIGENTE').toUpperCase();
  const monto = numero(body.salario_base ?? body.salario ?? body.monto);

  if (!personaId) errores.push('La persona es obligatoria.');
  if (!cargoId) errores.push('El cargo es obligatorio.');
  if (!fechaValida(fechaInicio)) errores.push('La fecha de inicio es obligatoria y debe ser válida.');
  if (fechaFin && !fechaValida(fechaFin)) errores.push('La fecha de fin no es válida.');
  if (fechaFin && fechaValida(fechaInicio) && fechaFin < fechaInicio) errores.push('La fecha de fin no puede ser anterior a la fecha de inicio.');
  if (!TIPOS_PAGO.has(tipoPago)) errores.push('El tipo de pago no es válido.');
  if (!FRECUENCIAS.has(frecuenciaPago)) errores.push('La frecuencia de pago no es válida.');
  if (!ESTADOS_CONTRATO.has(estado)) errores.push('El estado del contrato no es válido.');
  if (horasSemanales !== null && horasSemanales < 0) errores.push('Las horas semanales no pueden ser negativas.');
  if (monto === null || monto < 0) errores.push('El salario inicial es obligatorio y no puede ser negativo.');

  return {
    valido: errores.length === 0, errores,
    datos: { personaId, cargoId, fechaInicio, fechaFin: fechaFin || null, tipoPago, frecuenciaPago, horasSemanales, estado, monto },
  };
}

export function validarActualizarContrato(body = {}) {
  const errores = [];
  const datos = {};
  if (tiene(body, 'persona_id', 'personaId')) { const v = texto(body.persona_id ?? body.personaId); if (!v) errores.push('La persona es obligatoria.'); else datos.personaId = v; }
  if (tiene(body, 'cargo_id', 'cargoId')) { const v = numero(body.cargo_id ?? body.cargoId); if (!v) errores.push('El cargo es obligatorio.'); else datos.cargoId = v; }
  if (tiene(body, 'fecha_inicio', 'fechaInicio', 'fecha_ingreso')) { const v = texto(body.fecha_inicio ?? body.fechaInicio ?? body.fecha_ingreso); if (!fechaValida(v)) errores.push('La fecha de inicio no es válida.'); else datos.fechaInicio = v; }
  if (tiene(body, 'fecha_fin', 'fechaFin')) { const v = texto(body.fecha_fin ?? body.fechaFin); if (v && !fechaValida(v)) errores.push('La fecha de fin no es válida.'); else datos.fechaFin = v || null; }
  if (tiene(body, 'tipo_pago', 'tipoPago')) { const v = texto(body.tipo_pago ?? body.tipoPago).toUpperCase(); if (!TIPOS_PAGO.has(v)) errores.push('El tipo de pago no es válido.'); else datos.tipoPago = v; }
  if (tiene(body, 'frecuencia_pago', 'frecuenciaPago')) { const v = texto(body.frecuencia_pago ?? body.frecuenciaPago).toUpperCase(); if (!FRECUENCIAS.has(v)) errores.push('La frecuencia de pago no es válida.'); else datos.frecuenciaPago = v; }
  if (tiene(body, 'horas_semanales', 'horasSemanales')) { const v = numero(body.horas_semanales ?? body.horasSemanales); if (v !== null && v < 0) errores.push('Las horas semanales no pueden ser negativas.'); else datos.horasSemanales = v; }
  if (tiene(body, 'estado')) { const v = texto(body.estado).toUpperCase(); if (!ESTADOS_CONTRATO.has(v)) errores.push('El estado del contrato no es válido.'); else datos.estado = v; }
  if (errores.length === 0 && Object.keys(datos).length === 0) errores.push('Debes enviar al menos un campo para actualizar.');
  return { valido: errores.length === 0, errores, datos };
}

export function validarCambioSalario(body = {}) {
  const errores = [];
  const monto = numero(body.monto ?? body.salario_base ?? body.salario);
  const vigenteDesde = texto(body.vigente_desde ?? body.vigenteDesde);
  const motivo = texto(body.motivo);
  if (monto === null || monto < 0) errores.push('El monto es obligatorio y no puede ser negativo.');
  if (!fechaValida(vigenteDesde)) errores.push('La fecha vigente desde es obligatoria y debe ser válida.');
  if (motivo.length > 150) errores.push('El motivo no puede exceder 150 caracteres.');
  return { valido: errores.length === 0, errores, datos: { monto, vigenteDesde, motivo: motivo || null } };
}

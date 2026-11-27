const TIPOS_CONCEPTO = new Set(['ASIGNACION', 'DEDUCCION', 'APORTE_PATRONAL']);
const CATEGORIAS_CONCEPTO = new Set([
  'LEY',
  'OPCIONAL',
  'BONO',
  'PRESTAMO',
  'HORA_EXTRA',
  'AJUSTE',
  'SALARIO_BASE',
]);
const NATURALEZAS_CONCEPTO = new Set(['CREDITO', 'DEBITO']);
const UNIDADES_CONCEPTO = new Set(['HORAS', 'DIAS', 'MONTO']);
const TIPOS_VALOR = new Set(['MONTO_FIJO', 'PORCENTAJE_SALDO']);

function texto(valor) {
  return String(valor ?? '').trim();
}

function tiene(body, snake, camel) {
  return (
    Object.prototype.hasOwnProperty.call(body, snake) ||
    Object.prototype.hasOwnProperty.call(body, camel)
  );
}

function uuidValido(valor) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    texto(valor)
  );
}

function fechaValida(valor) {
  const fechaTexto = texto(valor);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaTexto)) return null;
  const fecha = new Date(`${fechaTexto}T00:00:00Z`);
  if (Number.isNaN(fecha.getTime())) return null;
  return fecha.toISOString().slice(0, 10) === fechaTexto ? fechaTexto : null;
}

export function naturalezaEsperada(tipoConcepto) {
  return tipoConcepto === 'ASIGNACION' ? 'CREDITO' : 'DEBITO';
}

function validarCoherencia(tipoConcepto, naturaleza, errores) {
  if (!TIPOS_CONCEPTO.has(tipoConcepto)) return;

  const esperada = naturalezaEsperada(tipoConcepto);
  if (NATURALEZAS_CONCEPTO.has(naturaleza) && naturaleza !== esperada) {
    errores.push(
      `La naturaleza debe ser ${esperada} cuando tipo_concepto es ${tipoConcepto}.`
    );
  }
}

function validarConceptoBase(body = {}, { parcial = false } = {}) {
  const errores = [];
  const datos = {};

  if (!parcial || tiene(body, 'codigo', 'codigo')) {
    const codigo = texto(body.codigo);
    if (!codigo) errores.push('El código del concepto es obligatorio.');
    else if (codigo.length > 30)
      errores.push('El código del concepto no puede exceder 30 caracteres.');
    else datos.codigo = codigo;
  }

  if (!parcial || tiene(body, 'nombre', 'nombre')) {
    const nombre = texto(body.nombre);
    if (!nombre) errores.push('El nombre del concepto es obligatorio.');
    else if (nombre.length > 120)
      errores.push('El nombre del concepto no puede exceder 120 caracteres.');
    else datos.nombre = nombre;
  }

  if (!parcial || tiene(body, 'tipo_concepto', 'tipoConcepto')) {
    const tipoConcepto = texto(body.tipoConcepto ?? body.tipo_concepto ?? 'ASIGNACION');
    if (!TIPOS_CONCEPTO.has(tipoConcepto)) {
      errores.push('tipo_concepto debe ser ASIGNACION, DEDUCCION o APORTE_PATRONAL.');
    } else {
      datos.tipoConcepto = tipoConcepto;
    }
  }

  if (!parcial || tiene(body, 'categoria', 'categoria')) {
    const categoria = texto(body.categoria ?? 'BONO');
    if (!CATEGORIAS_CONCEPTO.has(categoria)) {
      errores.push(
        'categoria debe ser LEY, OPCIONAL, BONO, PRESTAMO, HORA_EXTRA, AJUSTE o SALARIO_BASE.'
      );
    } else {
      datos.categoria = categoria;
    }
  }

  if (!parcial || tiene(body, 'naturaleza', 'naturaleza')) {
    const tipoParaNatural = datos.tipoConcepto ?? texto(body.tipoConcepto ?? body.tipo_concepto ?? 'ASIGNACION');
    const naturaleza = texto(
      body.naturaleza ?? naturalezaEsperada(tipoParaNatural)
    );
    if (!NATURALEZAS_CONCEPTO.has(naturaleza)) {
      errores.push('naturaleza debe ser CREDITO o DEBITO.');
    } else {
      datos.naturaleza = naturaleza;
    }
  }

  if (!parcial || tiene(body, 'unidad', 'unidad')) {
    const unidad = texto(body.unidad ?? 'MONTO');
    if (!UNIDADES_CONCEPTO.has(unidad)) {
      errores.push('unidad debe ser HORAS, DIAS o MONTO.');
    } else {
      datos.unidad = unidad;
    }
  }

  if (!parcial || tiene(body, 'es_fijo', 'esFijo')) {
    datos.esFijo = Boolean(body.esFijo ?? body.es_fijo ?? false);
  }

  if (!parcial || tiene(body, 'es_imponible', 'esImponible')) {
    datos.esImponible = Boolean(body.esImponible ?? body.es_imponible ?? false);
  }

  if (!parcial || tiene(body, 'activo', 'activo')) {
    datos.activo = Boolean(body.activo ?? true);
  }

  const tipoFinal = datos.tipoConcepto ?? texto(body.tipoConcepto ?? body.tipo_concepto);
  const naturalezaFinal = datos.naturaleza ?? texto(body.naturaleza);
  validarCoherencia(tipoFinal, naturalezaFinal, errores);

  return { valido: errores.length === 0, errores, datos };
}

export function validarCrearConcepto(body = {}) {
  return validarConceptoBase(body, { parcial: false });
}

export function validarActualizarConcepto(body = {}) {
  const base = validarConceptoBase(body, { parcial: true });
  if (base.valido && Object.keys(base.datos).length === 0) {
    return {
      valido: false,
      errores: ['Debes enviar al menos un campo para actualizar.'],
      datos: {},
    };
  }
  return base;
}

export function validarConsultaAsignaciones(query = {}) {
  const contratoId = texto(query.contrato_id ?? query.contratoId);
  if (!uuidValido(contratoId)) {
    return {
      valido: false,
      errores: ['Debes indicar un contrato_id válido.'],
      datos: { contratoId: null },
    };
  }
  return { valido: true, errores: [], datos: { contratoId } };
}

function validarAsignacionBase(body = {}, { parcial = false } = {}) {
  const errores = [];
  const datos = {};

  if (!parcial || tiene(body, 'contrato_id', 'contratoId')) {
    const contratoId = texto(body.contratoId ?? body.contrato_id);
    if (!uuidValido(contratoId)) errores.push('El contrato es obligatorio y debe ser válido.');
    else datos.contratoId = contratoId;
  }

  if (!parcial || tiene(body, 'concepto_id', 'conceptoId')) {
    const conceptoId = texto(body.conceptoId ?? body.concepto_id);
    if (!uuidValido(conceptoId)) errores.push('El concepto es obligatorio y debe ser válido.');
    else datos.conceptoId = conceptoId;
  }

  if (!parcial || tiene(body, 'tipo_valor', 'tipoValor')) {
    const tipoValor = texto(body.tipoValor ?? body.tipo_valor);
    if (!TIPOS_VALOR.has(tipoValor)) {
      errores.push('tipo_valor debe ser MONTO_FIJO o PORCENTAJE_SALDO.');
    } else {
      datos.tipoValor = tipoValor;
    }
  }

  if (!parcial || tiene(body, 'valor', 'valor')) {
    const valor = Number(body.valor);
    if (body.valor === '' || body.valor == null || !Number.isFinite(valor)) {
      errores.push('El valor debe ser un número.');
    } else if (valor < 0) {
      errores.push('El valor debe ser mayor o igual a cero.');
    } else {
      datos.valor = valor;
    }
  }

  if (!parcial || tiene(body, 'fecha_inicio', 'fechaInicio')) {
    const fechaInicio = fechaValida(body.fechaInicio ?? body.fecha_inicio);
    if (!fechaInicio) errores.push('La fecha_inicio debe tener formato YYYY-MM-DD.');
    else datos.fechaInicio = fechaInicio;
  }

  if (!parcial || tiene(body, 'fecha_fin', 'fechaFin')) {
    const valorFin = body.fechaFin ?? body.fecha_fin;
    if (valorFin === null || valorFin === '') {
      datos.fechaFin = null;
    } else {
      const fechaFin = fechaValida(valorFin);
      if (!fechaFin) errores.push('La fecha_fin debe tener formato YYYY-MM-DD o ser nula.');
      else datos.fechaFin = fechaFin;
    }
  }

  if (!parcial || tiene(body, 'activo', 'activo')) {
    datos.activo = Boolean(body.activo ?? true);
  }

  const tipoValorFinal = datos.tipoValor ?? texto(body.tipoValor ?? body.tipo_valor);
  const valorFinal = Number(datos.valor ?? body.valor);
  if (tipoValorFinal === 'PORCENTAJE_SALDO' && Number.isFinite(valorFinal) && valorFinal > 100) {
    errores.push('El porcentaje no puede ser mayor a 100.');
  }

  const fechaInicioFinal = datos.fechaInicio ?? texto(body.fechaInicio ?? body.fecha_inicio);
  const fechaFinFinal =
    datos.fechaFin !== undefined
      ? datos.fechaFin
      : texto(body.fechaFin ?? body.fecha_fin) || null;
  if (fechaInicioFinal && fechaFinFinal && fechaFinFinal < fechaInicioFinal) {
    errores.push('La fecha_fin no puede ser anterior a la fecha_inicio.');
  }

  return { valido: errores.length === 0, errores, datos };
}

export function validarCrearAsignacionConcepto(body = {}) {
  return validarAsignacionBase(body, { parcial: false });
}

export function validarActualizarAsignacionConcepto(body = {}) {
  const base = validarAsignacionBase(body, { parcial: true });
  if (base.valido && Object.keys(base.datos).length === 0) {
    return {
      valido: false,
      errores: ['Debes enviar al menos un campo para actualizar.'],
      datos: {},
    };
  }
  return base;
}

export function validarTerminarAsignacionConcepto(body = {}) {
  const errores = [];
  const datos = {};
  const valorFin = body.fechaFin ?? body.fecha_fin;

  if (valorFin !== undefined && valorFin !== null && valorFin !== '') {
    const fechaFin = fechaValida(valorFin);
    if (!fechaFin) errores.push('La fecha_fin debe tener formato YYYY-MM-DD.');
    else datos.fechaFin = fechaFin;
  } else {
    datos.fechaFin = null;
  }

  return { valido: errores.length === 0, errores, datos };
}

export default {
  validarCrearConcepto,
  validarActualizarConcepto,
  validarConsultaAsignaciones,
  validarCrearAsignacionConcepto,
  validarActualizarAsignacionConcepto,
  validarTerminarAsignacionConcepto,
  naturalezaEsperada,
};

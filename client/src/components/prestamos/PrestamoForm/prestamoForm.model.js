function texto(valor) {
  return String(valor ?? '').trim();
}

function numero(valor, predeterminado = 0) {
  if (valor === '' || valor === null || valor === undefined) return predeterminado;
  const resultado = Number(valor);
  return Number.isFinite(resultado) ? resultado : predeterminado;
}

export const MODALIDADES_DESCUENTO = [
  { value: 'PORCENTAJE_SALARIO', label: 'Porcentaje del salario' },
  { value: 'PORCENTAJE_SALDO', label: 'Porcentaje del saldo' },
  { value: 'CUOTA_FIJA', label: 'Cuota fija' },
];

export const ESTADOS_PRESTAMO = [
  { value: 'SOLICITADO', label: 'Solicitado' },
  { value: 'ACTIVO', label: 'Activo' },
  { value: 'PAGADO', label: 'Pagado' },
  { value: 'ANULADO', label: 'Anulado' },
];

export function crearEstadoPrestamo(initialData = {}) {
  const persona = initialData.persona_id ?? initialData.contrato_id ?? '';
  const monto =
    initialData.monto_aprobado ?? initialData.monto_total ?? initialData.monto ?? '';
  const cuotas = initialData.nro_cuotas ?? initialData.cuotas ?? 1;

  return {
    persona_id: persona,
    contrato_id: initialData.contrato_id ?? persona,
    concepto_id: initialData.concepto_id || '',
    monto_aprobado: monto,
    monto_total: monto,
    cuotas,
    nro_cuotas: cuotas,
    modalidad_descuento:
      initialData.modalidad_descuento || 'PORCENTAJE_SALARIO',
    valor_cuota: initialData.valor_cuota ?? '',
    fecha_aprobacion: initialData.fecha_aprobacion ?? initialData.fecha_solicitud ?? '',
    fecha_solicitud: initialData.fecha_solicitud ?? initialData.fecha_aprobacion ?? '',
    fecha_inicio_descuento: initialData.fecha_inicio_descuento || '',
    estado: initialData.estado || 'SOLICITADO',
    observacion: initialData.observacion || '',
  };
}

export function prepararPayloadPrestamo(estado) {
  const monto = numero(estado.monto_aprobado ?? estado.monto_total ?? estado.monto, 0);
  const cuotas = Math.max(
    1,
    Math.round(numero(estado.nro_cuotas ?? estado.cuotas, 1))
  );
  const valorCuota = numero(estado.valor_cuota, 0) || Math.round((monto / cuotas) * 100) / 100;

  return {
    persona_id: estado.persona_id || estado.contrato_id || null,
    contrato_id: estado.contrato_id || estado.persona_id || null,
    concepto_id: estado.concepto_id || null,
    monto_aprobado: monto,
    monto_total: monto,
    saldo_pendiente: numero(estado.saldo_pendiente, monto),
    nro_cuotas: cuotas,
    cuotas,
    modalidad_descuento: estado.modalidad_descuento || 'PORCENTAJE_SALARIO',
    valor_cuota: valorCuota,
    fecha_aprobacion: estado.fecha_aprobacion || estado.fecha_solicitud || null,
    fecha_solicitud: estado.fecha_solicitud || estado.fecha_aprobacion || null,
    fecha_inicio_descuento: estado.fecha_inicio_descuento || null,
    estado: estado.estado || 'SOLICITADO',
    observacion: texto(estado.observacion).slice(0, 250),
  };
}

export default {
  crearEstadoPrestamo,
  prepararPayloadPrestamo,
  MODALIDADES_DESCUENTO,
  ESTADOS_PRESTAMO,
};

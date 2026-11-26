function texto(valor) {
  return String(valor ?? '').trim();
}

function numero(valor, predeterminado = 0) {
  if (valor === '' || valor === null || valor === undefined) return predeterminado;
  const resultado = Number(valor);
  return Number.isFinite(resultado) ? resultado : predeterminado;
}

export const ESTADOS_NOVEDAD = [
  { value: 'PENDIENTE', label: 'Pendiente' },
  { value: 'APROBADA', label: 'Aprobada' },
  { value: 'RECHAZADA', label: 'Rechazada' },
  { value: 'APLICADA', label: 'Aplicada' },
];

export function crearEstadoNovedad(initialData = {}) {
  const persona = initialData.persona_id ?? initialData.contrato_id ?? '';
  const valor = initialData.monto_unitario ?? initialData.monto ?? initialData.valor ?? '';

  return {
    persona_id: persona,
    contrato_id: initialData.contrato_id ?? persona,
    concepto_id: initialData.concepto_id || '',
    periodo_id: initialData.periodo_id || '',
    cantidad: initialData.cantidad ?? 1,
    valor,
    monto_unitario: valor,
    observacion: initialData.observacion || '',
    fecha_novedad: initialData.fecha_novedad || '',
    estado: initialData.estado || 'PENDIENTE',
  };
}

export function prepararPayloadNovedad(estado) {
  const cantidad = numero(estado.cantidad, 1);
  const unitario = numero(
    estado.monto_unitario ?? estado.valor ?? estado.monto,
    0
  );
  const total = Math.round(cantidad * unitario * 100) / 100;

  return {
    persona_id: estado.persona_id || estado.contrato_id || null,
    contrato_id: estado.contrato_id || estado.persona_id || null,
    concepto_id: estado.concepto_id || null,
    periodo_id: estado.periodo_id || null,
    cantidad,
    valor: unitario,
    monto_unitario: unitario,
    monto: total,
    monto_total: total,
    observacion: texto(estado.observacion).slice(0, 250),
    fecha_novedad: estado.fecha_novedad || null,
    estado: estado.estado || 'PENDIENTE',
  };
}

export default {
  crearEstadoNovedad,
  prepararPayloadNovedad,
  ESTADOS_NOVEDAD,
};

export const TIPOS_VALOR = [
  { value: 'MONTO_FIJO', label: 'Monto fijo' },
  { value: 'PORCENTAJE_SALDO', label: 'Porcentaje del saldo' },
];

export function crearEstadoAsignacion(initialData = {}) {
  return {
    contrato_id: initialData.contrato_id ?? '',
    concepto_id: initialData.concepto_id ?? '',
    tipo_valor: initialData.tipo_valor ?? 'MONTO_FIJO',
    valor: initialData.valor ?? '',
    fecha_inicio: initialData.fecha_inicio ?? '',
    fecha_fin: initialData.fecha_fin ?? '',
    activo: initialData.activo ?? true,
  };
}

export function prepararPayloadAsignacion(
  estado,
  { contratoId, modo = 'crear' } = {}
) {
  if (modo === 'terminar') {
    return { fecha_fin: estado.fecha_fin || null };
  }

  return {
    contrato_id: contratoId ?? estado.contrato_id,
    concepto_id: estado.concepto_id,
    tipo_valor: estado.tipo_valor || 'MONTO_FIJO',
    valor: Number(estado.valor),
    fecha_inicio: estado.fecha_inicio,
    fecha_fin: estado.fecha_fin || null,
    activo: estado.activo !== false,
  };
}

export default {
  TIPOS_VALOR,
  crearEstadoAsignacion,
  prepararPayloadAsignacion,
};

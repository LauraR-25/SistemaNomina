function texto(valor) {
  return String(valor ?? '').trim();
}

function numero(valor, predeterminado = 0) {
  if (valor === '' || valor === null || valor === undefined) return predeterminado;
  const resultado = Number(valor);
  return Number.isFinite(resultado) ? resultado : predeterminado;
}

export const TIPOS_HORA = [
  { value: 'ORDINARIA', label: 'Ordinaria' },
  { value: 'EXTRA', label: 'Extra' },
];

export const ESTADOS_HORA = [
  { value: 'PENDIENTE', label: 'Pendiente' },
  { value: 'APROBADO', label: 'Aprobado' },
  { value: 'RECHAZADO', label: 'Rechazado' },
  { value: 'PROCESADO', label: 'Procesado' },
];

export function crearEstadoHoras(initialData = {}) {
  const persona = initialData.persona_id ?? initialData.contrato_id ?? '';
  const cantidad = initialData.horas ?? initialData.cantidad ?? '';

  return {
    persona_id: persona,
    contrato_id: initialData.contrato_id ?? persona,
    periodo_id: initialData.periodo_id || '',
    tipo_hora: initialData.tipo_hora || 'ORDINARIA',
    fecha: initialData.fecha || '',
    horas: cantidad,
    cantidad,
    factor_recargo: initialData.factor_recargo ?? 1,
    descripcion: initialData.descripcion || '',
    estado: initialData.estado || 'PENDIENTE',
  };
}

export function prepararPayloadHoras(estado) {
  const horas = numero(estado.horas ?? estado.cantidad, 0);

  return {
    persona_id: estado.persona_id || estado.contrato_id || null,
    contrato_id: estado.contrato_id || estado.persona_id || null,
    periodo_id: estado.periodo_id || null,
    tipo_hora: estado.tipo_hora || 'ORDINARIA',
    fecha: estado.fecha || null,
    horas,
    cantidad: horas,
    factor_recargo: numero(estado.factor_recargo, 1),
    descripcion: texto(estado.descripcion).slice(0, 200),
    estado: estado.estado || 'PENDIENTE',
  };
}

export default {
  crearEstadoHoras,
  prepararPayloadHoras,
  TIPOS_HORA,
  ESTADOS_HORA,
};

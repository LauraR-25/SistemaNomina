export function crearEstadoNovedad(initialData = {}) {
  return {
    concepto_id: initialData.concepto_id || '',
    monto: initialData.monto || '',
    observacion: initialData.observacion || '',
  };
}

export function prepararPayloadNovedad(estado) {
  return {
    concepto_id: estado.concepto_id,
    monto: Number(estado.monto),
    observacion: String(estado.observacion || '').trim(),
  };
}
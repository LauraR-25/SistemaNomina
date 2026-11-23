export function crearEstadoPrestamo(initialData = {}) {
  return {
    monto_total: initialData.monto_total || '',
    cuotas: initialData.cuotas || 1,
    fecha_solicitud: initialData.fecha_solicitud || '',
  };
}

export function prepararPayloadPrestamo(estado) {
  return {
    monto_total: Number(estado.monto_total),
    cuotas: Number(estado.cuotas),
    fecha_solicitud: estado.fecha_solicitud,
  };
}
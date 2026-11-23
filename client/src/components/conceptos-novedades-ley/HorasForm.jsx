export function crearEstadoHoras(initialData = {}) {
  return {
    fecha: initialData.fecha || '',
    horas: initialData.horas || '',
    tipo_hora: initialData.tipo_hora || 'EXTRA_DIURNA',
  };
}

export function prepararPayloadHoras(estado) {
  return {
    fecha: estado.fecha,
    horas: Number(estado.horas),
    tipo_hora: estado.tipo_hora,
  };
}
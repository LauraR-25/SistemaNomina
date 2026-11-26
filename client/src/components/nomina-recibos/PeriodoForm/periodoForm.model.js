export function crearEstadoPeriodo(initialData = {}) {
  return {
    descripcion: initialData.descripcion || '',
    fecha_inicio: initialData.fecha_inicio || '',
    fecha_fin: initialData.fecha_fin || '',
  };
}

export function prepararPayloadPeriodo(estado) {
  return {
    descripcion: String(estado.descripcion || '').trim(),
    fecha_inicio: estado.fecha_inicio,
    fecha_fin: estado.fecha_fin,
  };
}

export default {
  crearEstadoPeriodo,
  prepararPayloadPeriodo,
};

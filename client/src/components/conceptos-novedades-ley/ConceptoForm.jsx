export function crearEstadoConcepto(initialData = {}) {
  return {
    codigo: initialData.codigo || '',
    nombre: initialData.nombre || '',
    tipo_concepto: initialData.tipo_concepto || 'ASIGNACION',
    naturaleza: initialData.naturaleza || 'CREDITO',
  };
}

export function prepararPayloadConcepto(estado) {
  return {
    codigo: String(estado.codigo || '').trim(),
    nombre: String(estado.nombre || '').trim(),
    tipo_concepto: estado.tipo_concepto,
    naturaleza: estado.naturaleza,
  };
}
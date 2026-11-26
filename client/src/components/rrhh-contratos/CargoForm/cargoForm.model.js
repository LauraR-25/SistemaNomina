export function crearEstadoCargo(initialData = {}) {
  return {
    nombre: initialData.nombre || '',
    descripcion: initialData.descripcion || '',
    activo: initialData.activo ?? true,
  };
}

export function prepararPayloadCargo(estado) {
  return {
    nombre: String(estado.nombre || '').trim(),
    descripcion: String(estado.descripcion || '').trim() || null,
    activo: estado.activo !== false,
  };
}

export default {
  crearEstadoCargo,
  prepararPayloadCargo,
};

export function crearEstadoPerfil(initialData = {}) {
  return {
    nombre_perfil: initialData.nombre_perfil || '',
    descripcion: initialData.descripcion || '',
    activo: initialData.activo ?? true,
  };
}

export function prepararPayloadPerfil(estado) {
  return {
    nombre_perfil: String(estado.nombre_perfil || '').trim(),
    descripcion: String(estado.descripcion || '').trim(),
    activo: Boolean(estado.activo),
  };
}
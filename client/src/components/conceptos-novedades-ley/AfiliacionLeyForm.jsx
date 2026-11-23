export function crearEstadoAfiliacionLey(initialData = {}) {
  return {
    regimen: initialData.regimen || 'IVSS',
    fecha_afiliacion: initialData.fecha_afiliacion || '',
    activo: initialData.activo ?? true,
  };
}

export function prepararPayloadAfiliacionLey(estado) {
  return {
    regimen: estado.regimen,
    fecha_afiliacion: estado.fecha_afiliacion,
    activo: Boolean(estado.activo),
  };
}
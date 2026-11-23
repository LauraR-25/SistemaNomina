export function crearEstadoPersona(initialData = {}) {
  return {
    cedula: initialData.cedula || '',
    primer_nombre: initialData.primer_nombre || '',
    primer_apellido: initialData.primer_apellido || '',
    email: initialData.email || '',
  };
}

export function prepararPayloadPersona(estado) {
  return {
    cedula: String(estado.cedula || '').trim(),
    primer_nombre: String(estado.primer_nombre || '').trim(),
    primer_apellido: String(estado.primer_apellido || '').trim(),
    email: String(estado.email || '').trim() || null,
  };
}
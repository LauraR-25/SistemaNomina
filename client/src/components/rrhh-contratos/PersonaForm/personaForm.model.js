export function crearEstadoPersona(initialData = {}) {
  return {
    cedula: initialData.cedula || '',
    rif: initialData.rif || '',
    primer_nombre: initialData.primer_nombre || '',
    segundo_nombre: initialData.segundo_nombre || '',
    primer_apellido: initialData.primer_apellido || '',
    segundo_apellido: initialData.segundo_apellido || '',
    fecha_nacimiento: initialData.fecha_nacimiento || '',
    sexo: initialData.sexo || '',
    estado_civil: initialData.estado_civil || '',
    nro_tlf: initialData.nro_tlf || '',
    email: initialData.email || '',
    direccion: initialData.direccion || '',
    estado: initialData.estado || 'ACTIVO',
  };
}

function texto(valor) {
  return String(valor ?? '').trim();
}

export function prepararPayloadPersona(estado) {
  return {
    cedula: texto(estado.cedula),
    rif: texto(estado.rif) || null,
    primer_nombre: texto(estado.primer_nombre),
    segundo_nombre: texto(estado.segundo_nombre) || null,
    primer_apellido: texto(estado.primer_apellido),
    segundo_apellido: texto(estado.segundo_apellido) || null,
    fecha_nacimiento: estado.fecha_nacimiento || null,
    sexo: estado.sexo || null,
    estado_civil: estado.estado_civil || null,
    nro_tlf: texto(estado.nro_tlf) || null,
    email: texto(estado.email) || null,
    direccion: texto(estado.direccion) || null,
    estado: estado.estado || 'ACTIVO',
  };
}

export default {
  crearEstadoPersona,
  prepararPayloadPersona,
};

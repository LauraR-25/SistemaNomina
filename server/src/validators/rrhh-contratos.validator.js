export function validarCrearPersona(body = {}) {
  const errores = [];
  if (!body.cedula || !String(body.cedula).trim()) {
    errores.push('La cédula es obligatoria.');
  }
  if (!body.primerNombre && !body.primer_nombre) {
    errores.push('El primer nombre es obligatorio.');
  }
  if (!body.primerApellido && !body.primer_apellido) {
    errores.push('El primer apellido es obligatorio.');
  }
  return {
    valido: errores.length === 0,
    errores,
    datos: {
      empresaId: body.empresaId || body.empresa_id,
      cedula: String(body.cedula || '').trim(),
      primerNombre: String(body.primerNombre || body.primer_nombre || '').trim(),
      primerApellido: String(body.primerApellido || body.primer_apellido || '').trim(),
      email: body.email ? String(body.email).trim() : null,
      nroTlf: body.nroTlf || body.nro_tlf || null,
    },
  };
}
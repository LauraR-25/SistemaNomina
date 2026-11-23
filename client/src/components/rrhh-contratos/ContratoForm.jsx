export function crearEstadoContrato(initialData = {}) {
  return {
    cargo: initialData.cargo || '',
    fecha_ingreso: initialData.fecha_ingreso || '',
    salario_base: initialData.salario_base || '',
  };
}

export function prepararPayloadContrato(estado) {
  return {
    cargo: String(estado.cargo || '').trim(),
    fecha_ingreso: estado.fecha_ingreso,
    salario_base: Number(estado.salario_base),
  };
}
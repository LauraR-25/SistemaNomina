export function crearEstadoContrato(initialData = {}) {
  return {
    cargo_id: initialData.cargo_id ?? initialData.cargoId ?? '',
    cargo: initialData.cargo || '',
    persona_id: initialData.persona_id ?? initialData.personaId ?? '',
    fecha_inicio: initialData.fecha_inicio || initialData.fecha_ingreso || '',
    fecha_ingreso: initialData.fecha_ingreso || initialData.fecha_inicio || '',
    fecha_fin: initialData.fecha_fin || '',
    tipo_pago: initialData.tipo_pago || 'SALARIO_FIJO',
    frecuencia_pago: initialData.frecuencia_pago || 'MENSUAL',
    horas_semanales: initialData.horas_semanales ?? '',
    estado: initialData.estado || 'VIGENTE',
    salario_base: initialData.salario_base ?? initialData.salario ?? '',
    moneda_codigo: initialData.moneda_codigo || 'VES',
  };
}

function numeroOpcional(valor) {
  if (valor === '' || valor === null || valor === undefined) return null;
  const numero = Number(valor);
  return Number.isFinite(numero) ? numero : null;
}

export function prepararPayloadContrato(estado) {
  const salario = numeroOpcional(estado.salario_base);

  return {
    cargo_id: numeroOpcional(estado.cargo_id),
    cargo: String(estado.cargo || '').trim(),
    persona_id: (numeroOpcional(estado.persona_id) ?? estado.persona_id) || null,
    fecha_inicio: estado.fecha_inicio || estado.fecha_ingreso || null,
    fecha_ingreso: estado.fecha_ingreso || estado.fecha_inicio || null,
    fecha_fin: estado.fecha_fin || null,
    tipo_pago: estado.tipo_pago || 'SALARIO_FIJO',
    frecuencia_pago: estado.frecuencia_pago || 'MENSUAL',
    horas_semanales: numeroOpcional(estado.horas_semanales),
    estado: estado.estado || 'VIGENTE',
    salario_base: salario,
    salario,
    moneda_codigo: estado.moneda_codigo || 'VES',
  };
}

export default {
  crearEstadoContrato,
  prepararPayloadContrato,
};

export function crearEstadoCuentaBancaria(initialData = {}) {
  return {
    banco_id: initialData.banco_id ?? initialData.bancoId ?? '',
    persona_id: initialData.persona_id ?? initialData.personaId ?? '',
    titular: initialData.titular || '',
    numero_cuenta: initialData.numero_cuenta ?? initialData.nro_cuenta ?? '',
    tipo_cuenta: initialData.tipo_cuenta || 'CORRIENTE',
    es_principal: initialData.es_principal ?? false,
    activa: initialData.activa ?? true,
  };
}

export function prepararPayloadCuentaBancaria(estado) {
  const numeroCuenta = String(
    estado.numero_cuenta ?? estado.nro_cuenta ?? ''
  ).trim();

  return {
    banco_id: estado.banco_id,
    persona_id: estado.persona_id || null,
    titular: String(estado.titular || '').trim(),
    numero_cuenta: numeroCuenta,
    nro_cuenta: numeroCuenta,
    tipo_cuenta: estado.tipo_cuenta || 'CORRIENTE',
    es_principal: Boolean(estado.es_principal),
    activa: estado.activa !== false,
  };
}

export default {
  crearEstadoCuentaBancaria,
  prepararPayloadCuentaBancaria,
};

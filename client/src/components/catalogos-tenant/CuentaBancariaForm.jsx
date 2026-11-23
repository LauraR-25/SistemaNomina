export function crearEstadoCuentaBancaria(initialData = {}) {
  return {
    banco_id: initialData.banco_id || '',
    numero_cuenta: initialData.numero_cuenta || '',
    tipo_cuenta: initialData.tipo_cuenta || 'CORRIENTE',
  };
}

export function prepararPayloadCuentaBancaria(estado) {
  return {
    banco_id: estado.banco_id,
    numero_cuenta: String(estado.numero_cuenta || '').trim(),
    tipo_cuenta: estado.tipo_cuenta || 'CORRIENTE',
  };
}
export function crearEstadoEmpresa(initialData = {}) {
  return {
    rif: initialData.rif || '',
    razon_social: initialData.razon_social || '',
    nombre_comercial: initialData.nombre_comercial || '',
    moneda_codigo: initialData.moneda_codigo || 'VES',
  };
}

export function prepararPayloadEmpresa(estado) {
  return {
    rif: String(estado.rif || '').trim(),
    razon_social: String(estado.razon_social || '').trim(),
    nombre_comercial: String(estado.nombre_comercial || '').trim() || null,
    moneda_codigo: estado.moneda_codigo || 'VES',
  };
}
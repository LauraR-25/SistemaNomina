export function validarCrearEmpresa(body = {}) {
  const errores = [];
  if (!body.rif || typeof body.rif !== 'string' || !body.rif.trim()) {
    errores.push('El RIF de la empresa es obligatorio.');
  }
  if (!body.razonSocial && !body.razon_social) {
    errores.push('La razón social es obligatoria.');
  }
  return {
    valido: errores.length === 0,
    errores,
    datos: {
      paisId: Number(body.paisId || body.pais_id || 1),
      rif: (body.rif || '').trim(),
      razonSocial: (body.razonSocial || body.razon_social || '').trim(),
      nombreComercial: (body.nombreComercial || body.nombre_comercial || '').trim() || null,
      monedaCodigo: (body.monedaCodigo || body.moneda_codigo || 'VES').trim(),
    },
  };
}
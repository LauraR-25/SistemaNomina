export function validarConsultaPrestamos(query = {}) {
  const errores = [];
  if (query.empresaId && typeof query.empresaId !== 'string') {
    errores.push('empresaId debe ser un texto válido.');
  }
  return {
    valido: errores.length === 0,
    errores,
    datos: {
      empresaId: query.empresaId || null,
    },
  };
}
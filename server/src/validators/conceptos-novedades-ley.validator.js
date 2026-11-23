export function validarCrearConcepto(body = {}) {
  const errores = [];
  if (!body.codigo || !String(body.codigo).trim()) {
    errores.push('El código del concepto es obligatorio.');
  }
  if (!body.nombre || !String(body.nombre).trim()) {
    errores.push('El nombre del concepto es obligatorio.');
  }
  return {
    valido: errores.length === 0,
    errores,
    datos: {
      empresaId: body.empresaId || body.empresa_id,
      codigo: String(body.codigo || '').trim(),
      nombre: String(body.nombre || '').trim(),
      tipoConcepto: body.tipoConcepto || body.tipo_concepto || 'ASIGNACION',
      categoria: body.categoria || 'BONO',
      naturaleza: body.naturaleza || 'CREDITO',
      unidad: body.unidad || 'MONTO',
      esFijo: Boolean(body.esFijo ?? body.es_fijo ?? false),
      esImponible: Boolean(body.esImponible ?? body.es_imponible ?? false),
    },
  };
}
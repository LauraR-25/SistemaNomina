export const TIPOS_CONCEPTO = [
  { value: 'ASIGNACION', label: 'Asignación' },
  { value: 'DEDUCCION', label: 'Deducción' },
  { value: 'APORTE_PATRONAL', label: 'Aporte patronal' },
];

export const CATEGORIAS_CONCEPTO = [
  { value: 'SALARIO_BASE', label: 'Salario base' },
  { value: 'LEY', label: 'Ley' },
  { value: 'OPCIONAL', label: 'Opcional' },
  { value: 'BONO', label: 'Bono' },
  { value: 'PRESTAMO', label: 'Préstamo' },
  { value: 'HORA_EXTRA', label: 'Hora extra' },
  { value: 'AJUSTE', label: 'Ajuste' },
];

export const NATURALEZAS_CONCEPTO = [
  { value: 'CREDITO', label: 'Crédito' },
  { value: 'DEBITO', label: 'Débito' },
];

export const UNIDADES_CONCEPTO = [
  { value: 'HORAS', label: 'Horas' },
  { value: 'DIAS', label: 'Días' },
  { value: 'MONTO', label: 'Monto' },
];

export function crearEstadoConcepto(initialData = {}) {
  return {
    codigo: initialData.codigo || '',
    nombre: initialData.nombre || '',
    tipo_concepto: initialData.tipo_concepto || 'ASIGNACION',
    categoria: initialData.categoria || 'BONO',
    naturaleza: initialData.naturaleza || 'CREDITO',
    unidad: initialData.unidad || 'MONTO',
    es_fijo: initialData.es_fijo ?? false,
    es_imponible: initialData.es_imponible ?? false,
    activo: initialData.activo ?? true,
  };
}

export function prepararPayloadConcepto(estado) {
  return {
    codigo: String(estado.codigo || '').trim(),
    nombre: String(estado.nombre || '').trim(),
    tipo_concepto: estado.tipo_concepto || 'ASIGNACION',
    categoria: estado.categoria || 'BONO',
    naturaleza: estado.naturaleza || 'CREDITO',
    unidad: estado.unidad || 'MONTO',
    es_fijo: Boolean(estado.es_fijo),
    es_imponible: Boolean(estado.es_imponible),
    activo: estado.activo !== false,
  };
}

export default {
  crearEstadoConcepto,
  prepararPayloadConcepto,
  TIPOS_CONCEPTO,
  CATEGORIAS_CONCEPTO,
  NATURALEZAS_CONCEPTO,
  UNIDADES_CONCEPTO,
};

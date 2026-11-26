export const ESTADOS_POR_ENUM = {
  estado_periodo: {
    BORRADOR: { etiqueta: 'Borrador', variante: 'neutral' },
    PRENOMINA: { etiqueta: 'Prenómina', variante: 'info' },
    PROCESADO: { etiqueta: 'Procesado', variante: 'info' },
    PAGADO: { etiqueta: 'Pagado', variante: 'success' },
    ANULADO: { etiqueta: 'Anulado', variante: 'danger' },
  },
  estado_recibo: {
    PENDIENTE: { etiqueta: 'Pendiente', variante: 'warning' },
    PAGADO: { etiqueta: 'Pagado', variante: 'success' },
    ANULADO: { etiqueta: 'Anulado', variante: 'danger' },
  },
  estado_prestamo: {
    SOLICITADO: { etiqueta: 'Solicitado', variante: 'info' },
    ACTIVO: { etiqueta: 'Activo', variante: 'success' },
    PAGADO: { etiqueta: 'Pagado', variante: 'success' },
    ANULADO: { etiqueta: 'Anulado', variante: 'danger' },
  },
  estado_cuota: {
    PENDIENTE: { etiqueta: 'Pendiente', variante: 'warning' },
    DESCONTADA: { etiqueta: 'Descontada', variante: 'success' },
    CONDONADA: { etiqueta: 'Condonada', variante: 'neutral' },
  },
  estado_novedad: {
    PENDIENTE: { etiqueta: 'Pendiente', variante: 'warning' },
    APROBADA: { etiqueta: 'Aprobada', variante: 'success' },
    RECHAZADA: { etiqueta: 'Rechazada', variante: 'danger' },
    APLICADA: { etiqueta: 'Aplicada', variante: 'success' },
  },
  estado_registro_horas: {
    PENDIENTE: { etiqueta: 'Pendiente', variante: 'warning' },
    APROBADO: { etiqueta: 'Aprobado', variante: 'success' },
    RECHAZADO: { etiqueta: 'Rechazado', variante: 'danger' },
    PROCESADO: { etiqueta: 'Procesado', variante: 'info' },
  },
  estado_contrato: {
    VIGENTE: { etiqueta: 'Vigente', variante: 'success' },
    SUSPENDIDO: { etiqueta: 'Suspendido', variante: 'warning' },
    FINALIZADO: { etiqueta: 'Finalizado', variante: 'neutral' },
  },
  estado_persona: {
    ACTIVO: { etiqueta: 'Activo', variante: 'success' },
    INACTIVO: { etiqueta: 'Inactivo', variante: 'neutral' },
  },
  estado_afiliacion: {
    ACTIVO: { etiqueta: 'Activo', variante: 'success' },
    SUSPENDIDO: { etiqueta: 'Suspendido', variante: 'warning' },
    BAJA: { etiqueta: 'Baja', variante: 'danger' },
  },
  estado_ejecucion: {
    CALCULADA: { etiqueta: 'Calculada', variante: 'info' },
    DESCARTADA: { etiqueta: 'Descartada', variante: 'neutral' },
    APROBADA: { etiqueta: 'Aprobada', variante: 'success' },
  },
};

export const ESTADOS = Object.values(ESTADOS_POR_ENUM).reduce(
  (mapa, estados) => ({ ...mapa, ...estados }),
  {}
);

export const VARIANTES_ESTADO = [
  'neutral',
  'accent',
  'success',
  'warning',
  'danger',
  'info',
];

function textoLegible(valor) {
  return String(valor ?? '')
    .replace(/_/g, ' ')
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
    .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
    .join(' ');
}

export function obtenerEstado(enumNombre, valor) {
  const claveEnum = String(enumNombre ?? '').toLowerCase();
  const mapaEnum =
    ESTADOS_POR_ENUM[claveEnum] ||
    ESTADOS_POR_ENUM[String(enumNombre ?? '').toUpperCase()] ||
    {};
  const claveValor = String(valor ?? '').toUpperCase();
  const entrada = mapaEnum[claveValor] ?? mapaEnum[valor];

  if (entrada) return entrada;

  return {
    etiqueta: textoLegible(valor) || 'Sin estado',
    variante: 'neutral',
  };
}

export default ESTADOS_POR_ENUM;

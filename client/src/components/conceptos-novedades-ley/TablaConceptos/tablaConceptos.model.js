const ETIQUETAS_TIPO = {
  ASIGNACION: 'Asignación',
  DEDUCCION: 'Deducción',
  APORTE_PATRONAL: 'Aporte patronal',
};

const VARIANTES_NATURALEZA = {
  CREDITO: 'info',
  DEBITO: 'danger',
};

export function etiquetaTipoConcepto(tipo) {
  return ETIQUETAS_TIPO[tipo] ?? String(tipo ?? '—');
}

export function varianteNaturaleza(naturaleza) {
  return VARIANTES_NATURALEZA[naturaleza] ?? 'neutral';
}

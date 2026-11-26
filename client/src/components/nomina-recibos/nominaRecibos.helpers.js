import { formatFecha } from '../../utils/formatters.js';

export function numero(valor) {
  const resultado = Number(valor);
  return Number.isFinite(resultado) ? resultado : 0;
}

export function nombreEmpleado(empleado) {
  if (!empleado) return '—';

  const completo = [
    empleado.primer_nombre,
    empleado.segundo_nombre,
    empleado.primer_apellido,
    empleado.segundo_apellido,
  ]
    .filter(Boolean)
    .join(' ');

  if (completo) return completo;

  return empleado.nombre ?? empleado.nombre_completo ?? String(empleado.id ?? '—');
}

export function etiquetaPeriodo(periodo) {
  if (!periodo) return '—';
  if (periodo.descripcion) return periodo.descripcion;

  const inicio = formatFecha(periodo.fecha_inicio);
  const fin = formatFecha(periodo.fecha_fin);
  const rango =
    inicio !== '—' || fin !== '—' ? `${inicio} – ${fin}` : 'Sin fechas';

  return [periodo.frecuencia, rango].filter(Boolean).join(' · ');
}

export function monedaDe(empresa, fallback = 'VES') {
  return empresa?.moneda_codigo ?? empresa?.moneda ?? fallback;
}

export function etiquetaMetodoPago(metodo) {
  const etiquetas = {
    TRANSFERENCIA: 'Transferencia',
    PAGO_MOVIL: 'Pago móvil',
    EFECTIVO: 'Efectivo',
    CHEQUE: 'Cheque',
  };

  return etiquetas[metodo] ?? metodo ?? '—';
}

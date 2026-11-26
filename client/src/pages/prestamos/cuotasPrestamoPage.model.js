import { calcularSaldoPendienteCuotas } from '../../components/prestamos/TablaCuotas/index.js';

export function crearModeloCuotasPrestamoPage(cuotas = []) {
  return {
    titulo: 'Cuotas de Préstamo',
    cuotas,
    saldoPendiente: calcularSaldoPendienteCuotas(cuotas),
  };
}

export function actualizarCuotasPrestamoModelo(modeloActual, cuotas = []) {
  return {
    ...modeloActual,
    cuotas,
    saldoPendiente: calcularSaldoPendienteCuotas(cuotas),
  };
}

function sumarMeses(fecha, meses) {
  if (!fecha) return '';

  const fechaBase = new Date(`${fecha}T00:00:00`);
  if (Number.isNaN(fechaBase.getTime())) return '';

  fechaBase.setMonth(fechaBase.getMonth() + meses);
  const anio = fechaBase.getFullYear();
  const mes = String(fechaBase.getMonth() + 1).padStart(2, '0');
  const dia = String(fechaBase.getDate()).padStart(2, '0');

  return `${anio}-${mes}-${dia}`;
}

export function generarCuotasPrestamo(prestamo = {}) {
  const cantidad = Number(prestamo.nro_cuotas ?? prestamo.cuotas ?? 0);
  const montoTotal = Number(
    prestamo.monto_aprobado ?? prestamo.monto_total ?? prestamo.monto ?? 0
  );
  const cuotaCalculada = Number(prestamo.valor_cuota ?? 0);

  if (!Number.isFinite(cantidad) || cantidad <= 0) return [];

  const montoCuota =
    cuotaCalculada > 0
      ? cuotaCalculada
      : Math.round((montoTotal / cantidad) * 100) / 100;
  const inicio =
    prestamo.fecha_inicio_descuento ??
    prestamo.fecha_aprobacion ??
    prestamo.fecha_solicitud ??
    '';

  return Array.from({ length: cantidad }, (_, indice) => ({
    id: `cuota-${prestamo.id ?? 'prestamo'}-${indice + 1}`,
    prestamo_id: prestamo.id ?? null,
    nro_cuota: indice + 1,
    numero: indice + 1,
    fecha_vencimiento: sumarMeses(inicio, indice),
    monto_cuota: montoCuota,
    monto: montoCuota,
    monto_descontado: 0,
    estado: 'PENDIENTE',
  }));
}

export function actualizarCuotaModelo(modeloActual, id, cambios = {}) {
  const cuotas = modeloActual.cuotas.map((cuota) =>
    String(cuota.id) === String(id) ? { ...cuota, ...cambios } : cuota
  );

  return actualizarCuotasPrestamoModelo(modeloActual, cuotas);
}

export default {
  crearModeloCuotasPrestamoPage,
  actualizarCuotasPrestamoModelo,
  generarCuotasPrestamo,
  actualizarCuotaModelo,
};

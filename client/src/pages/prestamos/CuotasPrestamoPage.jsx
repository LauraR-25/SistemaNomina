import { calcularSaldoPendienteCuotas } from '../../components/prestamos/TablaCuotas.jsx';

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

export default {
  crearModeloCuotasPrestamoPage,
  actualizarCuotasPrestamoModelo,
};
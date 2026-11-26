const ESTADOS_SALDADAS = new Set(['DESCONTADA', 'CONDONADA', 'PAGADA']);

export function calcularSaldoPendienteCuotas(cuotas = []) {
  const lista = Array.isArray(cuotas) ? cuotas : [];

  return lista
    .filter((cuota) => !ESTADOS_SALDADAS.has(cuota?.estado))
    .reduce(
      (acumulado, cuota) =>
        acumulado + Number(cuota?.monto_cuota ?? cuota?.monto ?? 0),
      0
    );
}

export function contarCuotasPendientes(cuotas = []) {
  const lista = Array.isArray(cuotas) ? cuotas : [];

  return lista.filter((cuota) => !ESTADOS_SALDADAS.has(cuota?.estado)).length;
}

export default {
  calcularSaldoPendienteCuotas,
  contarCuotasPendientes,
};

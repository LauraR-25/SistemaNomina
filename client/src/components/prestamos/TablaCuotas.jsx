export function calcularSaldoPendienteCuotas(cuotas = []) {
  return cuotas
    .filter((c) => c.estado !== 'PAGADA')
    .reduce((acc, c) => acc + Number(c.monto || 0), 0);
}
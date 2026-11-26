function numero(valor) {
  const resultado = Number(valor);
  return Number.isFinite(resultado) ? resultado : 0;
}

export function porcentajePagado(prestamo) {
  const monto = numero(prestamo.monto_aprobado ?? prestamo.monto_total);
  if (monto <= 0) return 0;

  const saldo = numero(prestamo.saldo_pendiente ?? monto);
  const pagado = Math.max(0, monto - saldo);

  return Math.min(100, Math.round((pagado / monto) * 100));
}

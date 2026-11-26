function numero(valor) {
  const resultado = Number(valor);
  return Number.isFinite(resultado) ? resultado : 0;
}

export function calcularResumenPrestamo(prestamo = {}, cuotas = []) {
  const total = numero(
    prestamo.monto_aprobado ?? prestamo.monto_total ?? prestamo.monto
  );
  const saldo = numero(prestamo.saldo_pendiente ?? total);
  const pagado = Math.max(0, total - saldo);
  const listaCuotas = Array.isArray(cuotas) ? cuotas : [];
  const restantes = listaCuotas.length
    ? listaCuotas.filter(
        (cuota) =>
          !['DESCONTADA', 'CONDONADA', 'PAGADA'].includes(cuota.estado)
      ).length
    : Math.max(0, numero(prestamo.nro_cuotas ?? prestamo.cuotas));

  return {
    total,
    pagado,
    saldo,
    cuotasRestantes: restantes,
  };
}

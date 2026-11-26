import { StatCard } from '../../common/ui/StatCard/index.js';
import { formatMoneda, formatNumero } from '../../../utils/formatters.js';
import styles from './ResumenPrestamo.module.css';

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

export function ResumenPrestamo({ prestamo = {}, cuotas = [], loading = false }) {
  const resumen = calcularResumenPrestamo(prestamo, cuotas);
  const moneda = prestamo.moneda_codigo ?? 'VES';

  return (
    <div className={styles.tarjetas}>
      <StatCard
        titulo="Monto total"
        valor={formatMoneda(resumen.total, moneda)}
        icono="wallet"
        loading={loading}
      />
      <StatCard
        titulo="Pagado"
        valor={formatMoneda(resumen.pagado, moneda)}
        icono="check"
        loading={loading}
      />
      <StatCard
        titulo="Saldo pendiente"
        valor={formatMoneda(resumen.saldo, moneda)}
        icono="credit-card"
        loading={loading}
      />
      <StatCard
        titulo="Cuotas restantes"
        valor={formatNumero(resumen.cuotasRestantes)}
        icono="calendar"
        loading={loading}
      />
    </div>
  );
}

export default ResumenPrestamo;

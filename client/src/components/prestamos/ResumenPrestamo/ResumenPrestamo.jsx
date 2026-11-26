import { StatCard } from '../../common/ui/StatCard/index.js';
import { formatMoneda, formatNumero } from '../../../utils/formatters.js';
import { calcularResumenPrestamo } from './resumenPrestamo.model.js';
import styles from './ResumenPrestamo.module.css';

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

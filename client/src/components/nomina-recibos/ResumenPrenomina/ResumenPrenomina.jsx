import { SummaryBar } from '../../common/data/SummaryBar/index.js';
import { StatCard } from '../../common/ui/StatCard/index.js';
import { StatusBadge } from '../../common/ui/StatusBadge/index.js';
import { formatMoneda, formatNumero } from '../../../utils/formatters.js';
import { resumirPrenomina } from '../TablaPrenomina/tablaPrenomina.model.js';
import styles from './ResumenPrenomina.module.css';

export function ResumenPrenomina({
  filas = [],
  resumen,
  ejecucion = null,
  moneda = 'VES',
  loading = false,
}) {
  const totales = resumen ?? resumirPrenomina(filas);
  const estado = ejecucion?.estado ?? null;

  return (
    <div className={styles.resumen}>
      <div className={styles.tarjetas}>
        <StatCard
          titulo="Asignaciones"
          valor={formatMoneda(totales.totalAsignaciones, moneda)}
          icono="wallet"
          loading={loading}
        />
        <StatCard
          titulo="Deducciones"
          valor={formatMoneda(totales.totalDeducciones, moneda)}
          icono="percent"
          loading={loading}
        />
        <StatCard
          titulo="Empleados"
          valor={formatNumero(filas.length)}
          icono="users"
          loading={loading}
        />
        <StatCard
          titulo="Estado de ejecución"
          valor={
            estado ? (
              <StatusBadge estado={estado} size="sm" />
            ) : (
              'Sin ejecutar'
            )
          }
          icono="clipboard"
          loading={loading}
        />
      </div>

      <SummaryBar
        titulo="Resumen de la prenómina"
        items={[
          {
            label: 'Asignaciones',
            value: totales.totalAsignaciones,
          },
          {
            label: 'Deducciones',
            value: totales.totalDeducciones,
          },
        ]}
        neto={totales.totalNeto}
        moneda={moneda}
      />
    </div>
  );
}

export default ResumenPrenomina;

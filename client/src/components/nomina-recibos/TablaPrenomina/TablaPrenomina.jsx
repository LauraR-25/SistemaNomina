import { DataTable } from '../../common/data/DataTable/index.js';
import { formatMoneda } from '../../../utils/formatters.js';
import { nombreEmpleado } from '../nominaRecibos.helpers.js';
import { resumirPrenomina } from './tablaPrenomina.model.js';
import cx from '../../../utils/cx.js';
import styles from './TablaPrenomina.module.css';

export function TablaPrenomina({
  datos = [],
  filas,
  totales: totalesProp,
  moneda = 'VES',
  loading = false,
  error = null,
  onRetry,
  orden,
  onSort,
}) {
  const registros = filas ?? datos;
  const totales = totalesProp ?? resumirPrenomina(registros);

  const columnas = [
    {
      key: 'nombre',
      header: 'Empleado',
      sortable: true,
      render: (valor, fila) => (
        <div className={styles.empleado}>
          <span className={styles.principal}>
            {valor || nombreEmpleado(fila.empleado ?? fila)}
          </span>
          <span className={styles.secundario}>
            {fila.empleado?.cedula ??
              (fila.contrato_id ? `Contrato ${fila.contrato_id}` : '—')}
          </span>
        </div>
      ),
    },
    {
      key: 'asignaciones',
      header: 'Asignaciones',
      align: 'right',
      sortable: true,
      render: (valor) => formatMoneda(valor, moneda),
    },
    {
      key: 'deducciones',
      header: 'Deducciones',
      align: 'right',
      sortable: true,
      render: (valor) => formatMoneda(valor, moneda),
    },
    {
      key: 'neto',
      header: 'Neto',
      align: 'right',
      sortable: true,
      render: (valor) => (
        <span className={styles.neto}>{formatMoneda(valor, moneda)}</span>
      ),
    },
  ];

  const pie = (
    <div className={styles.pie}>
      <span>Totales ({registros.length})</span>
      <span className="tabular">
        {formatMoneda(totales.totalAsignaciones, moneda)}
      </span>
      <span className="tabular">
        {formatMoneda(totales.totalDeducciones, moneda)}
      </span>
      <span className={cx('tabular', styles.neto)}>
        {formatMoneda(totales.totalNeto, moneda)}
      </span>
    </div>
  );

  return (
    <DataTable
      datos={registros}
      columnas={columnas}
      loading={loading}
      error={error}
      onRetry={onRetry}
      sort={orden}
      onSort={onSort}
      footer={pie}
      maxHeight="420px"
      className={styles.tabla}
      emptyTitle="Sin filas de prenómina"
      emptyMessage="Selecciona un período con empleados para ver el cálculo."
      ariaLabel="Prenómina por empleado"
    />
  );
}

export default TablaPrenomina;

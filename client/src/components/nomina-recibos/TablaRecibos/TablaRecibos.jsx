import { DataTable } from '../../common/data/DataTable/index.js';
import { Badge } from '../../common/ui/Badge/index.js';
import { StatusBadge } from '../../common/ui/StatusBadge/index.js';
import { formatMoneda } from '../../../utils/formatters.js';
import {
  etiquetaMetodoPago,
  etiquetaPeriodo,
  nombreEmpleado,
} from '../nominaRecibos.helpers.js';
import styles from './TablaRecibos.module.css';

function periodoDe(recibo, periodos) {
  if (recibo.periodo) return recibo.periodo;

  return (
    periodos.find(
      (periodo) => String(periodo.id) === String(recibo.periodo_id)
    ) ?? null
  );
}

export function TablaRecibos({
  datos = [],
  filas,
  periodos = [],
  moneda = 'VES',
  loading = false,
  error = null,
  onRetry,
  onVer,
  orden,
  onSort,
}) {
  const registros = filas ?? datos;

  const columnas = [
    {
      key: 'nombre',
      header: 'Empleado',
      sortable: true,
      render: (valor, recibo) => (
        <div className={styles.empleado}>
          <span className={styles.principal}>
            {valor ||
              nombreEmpleado(
                recibo.empleado ?? recibo.persona ?? recibo.contrato?.persona
              )}
          </span>
          <span className={styles.secundario}>
            {recibo.empleado?.cedula ??
              recibo.persona?.cedula ??
              recibo.contrato?.persona?.cedula ??
              '—'}
          </span>
        </div>
      ),
    },
    {
      key: 'periodo_id',
      header: 'Período',
      sortable: true,
      render: (valor, recibo) => etiquetaPeriodo(periodoDe(recibo, periodos)),
    },
    {
      key: 'neto_pagar',
      header: 'Neto',
      align: 'right',
      sortable: true,
      render: (valor, recibo) =>
        formatMoneda(valor ?? recibo.neto ?? recibo.neto_pagar, moneda),
    },
    {
      key: 'metodo_pago',
      header: 'Método de pago',
      sortable: true,
      render: (valor) => (
        <Badge variant="info" size="sm">
          {etiquetaMetodoPago(valor)}
        </Badge>
      ),
    },
    {
      key: 'estado',
      header: 'Estado',
      sortable: true,
      render: (valor) => (
        <StatusBadge estado={valor ?? 'PENDIENTE'} size="sm" />
      ),
    },
  ];

  return (
    <DataTable
      datos={registros}
      columnas={columnas}
      loading={loading}
      error={error}
      onRetry={onRetry}
      sort={orden}
      onSort={onSort}
      rowActions={
        onVer
          ? (recibo) => [
              {
                id: `ver-${recibo.id}`,
                label: 'Ver recibo',
                icon: 'eye',
                onClick: () => onVer(recibo),
              },
            ]
          : undefined
      }
      emptyTitle="Sin recibos para mostrar"
      emptyMessage="Selecciona un período para consultar sus recibos de pago."
      ariaLabel="Listado de recibos de pago"
    />
  );
}

export default TablaRecibos;

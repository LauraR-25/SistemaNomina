import { DataTable } from '../../common/data/DataTable/index.js';
import { Badge } from '../../common/ui/Badge/index.js';
import { StatusBadge } from '../../common/ui/StatusBadge/index.js';
import {
  formatFecha,
  formatMoneda,
  formatNumero,
} from '../../../utils/formatters.js';
import styles from './TablaAsignacionesConcepto.module.css';

function mostrarValor(fila, moneda) {
  const valor = fila.valor;
  const unidad = fila.concepto?.unidad;

  if (fila.tipo_valor === 'PORCENTAJE_SALDO') {
    return `${formatNumero(valor)} %`;
  }
  if (unidad === 'MONTO') return formatMoneda(valor, moneda);
  if (unidad === 'HORAS' || unidad === 'DIAS') {
    return `${formatNumero(valor)} ${unidad.toLowerCase()}`;
  }
  return formatNumero(valor);
}

export function TablaAsignacionesConcepto({
  datos = [],
  filas,
  moneda = 'VES',
  loading = false,
  error = null,
  onRetry,
  onEditar,
  onTerminar,
  emptyAction,
  orden,
  onSort,
}) {
  const registros = filas ?? datos;

  const columnas = [
    {
      key: 'concepto.codigo',
      header: 'Concepto',
      sortable: true,
      render: (valor, fila) => (
        <div className={styles.identificador}>
          <span className={styles.principal}>{valor ?? '—'}</span>
          <span className={styles.secundario}>
            {fila.concepto?.nombre ?? '—'}
          </span>
        </div>
      ),
    },
    {
      key: 'tipo_valor',
      header: 'Tipo de valor',
      sortable: true,
      render: (valor) => (
        <Badge variant={valor === 'PORCENTAJE_SALDO' ? 'info' : 'accent'} size="sm">
          {valor === 'PORCENTAJE_SALDO' ? 'Porcentaje' : 'Monto fijo'}
        </Badge>
      ),
    },
    {
      key: 'valor',
      header: 'Valor',
      sortable: true,
      align: 'right',
      render: (valor, fila) => mostrarValor(fila, moneda),
    },
    {
      key: 'fecha_inicio',
      header: 'Vigencia',
      sortable: true,
      render: (valor, fila) => (
        <div className={styles.vigencia}>
          <span>{formatFecha(valor)}</span>
          <span className={styles.secundario}>
            {fila.fecha_fin ? `hasta ${formatFecha(fila.fecha_fin)}` : 'Abierta'}
          </span>
        </div>
      ),
    },
    {
      key: 'activo',
      header: 'Estado',
      sortable: true,
      render: (valor) => (
        <StatusBadge
          estado={valor === false ? 'INACTIVO' : 'ACTIVO'}
          size="sm"
          variant={valor === false ? 'neutral' : 'success'}
        />
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
      rowActions={(fila) =>
        [
          onEditar && {
            id: `editar-${fila.id}`,
            label: 'Editar',
            icon: 'edit',
            onClick: () => onEditar(fila),
          },
          onTerminar &&
            fila.activo !== false && {
              id: `terminar-${fila.id}`,
              label: 'Terminar',
              icon: 'clock',
              danger: true,
              onClick: () => onTerminar(fila),
            },
        ].filter(Boolean)
      }
      emptyTitle="Sin conceptos asignados"
      emptyMessage="Este contrato todavía no tiene conceptos asignados."
      emptyAction={emptyAction}
      ariaLabel="Conceptos asignados al contrato"
    />
  );
}

export default TablaAsignacionesConcepto;

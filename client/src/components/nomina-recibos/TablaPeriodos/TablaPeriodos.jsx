import { DataTable } from '../../common/data/DataTable/index.js';
import { StatusBadge } from '../../common/ui/StatusBadge/index.js';
import { formatFecha } from '../../../utils/formatters.js';
import { etiquetaPeriodo } from '../nominaRecibos.helpers.js';
import styles from './TablaPeriodos.module.css';

function accionesPorEstado(periodo, handlers) {
  const estado = periodo.estado ?? 'BORRADOR';
  const acciones = [
    handlers.onVerDetalle && {
      id: `detalle-${periodo.id}`,
      label: 'Ver detalle',
      icon: 'eye',
      onClick: () => handlers.onVerDetalle(periodo),
    },
  ];

  if (estado === 'PRENOMINA' && handlers.onVerPrenomina) {
    acciones.push({
      id: `prenomina-${periodo.id}`,
      label: 'Ver prenómina',
      icon: 'clipboard',
      onClick: () => handlers.onVerPrenomina(periodo),
    });
  }

  if (estado === 'BORRADOR' && handlers.onEditar) {
    acciones.push({
      id: `editar-${periodo.id}`,
      label: 'Editar',
      icon: 'edit',
      onClick: () => handlers.onEditar(periodo),
    });
  }

  if (['BORRADOR', 'PRENOMINA'].includes(estado) && handlers.onAnular) {
    acciones.push({
      id: `anular-${periodo.id}`,
      label: 'Anular',
      icon: 'trash',
      danger: true,
      onClick: () => handlers.onAnular(periodo),
    });
  }

  if (['PROCESADO', 'PAGADO'].includes(estado) && handlers.onVerRecibos) {
    acciones.push({
      id: `recibos-${periodo.id}`,
      label: 'Ver recibos',
      icon: 'receipt',
      onClick: () => handlers.onVerRecibos(periodo),
    });
  }

  return acciones.filter(Boolean);
}

export function TablaPeriodos({
  datos = [],
  filas,
  loading = false,
  error = null,
  onRetry,
  onVerDetalle,
  onEditar,
  onAnular,
  onVerPrenomina,
  onVerRecibos,
  orden,
  onSort,
}) {
  const registros = filas ?? datos;

  const columnas = [
    {
      key: 'descripcion',
      header: 'Período',
      sortable: true,
      render: (valor, periodo) => (
        <div className={styles.periodo}>
          <span className={styles.principal}>
            {valor || etiquetaPeriodo(periodo)}
          </span>
          <span className={styles.secundario}>
            {periodo.frecuencia ?? 'Frecuencia no indicada'}
          </span>
        </div>
      ),
    },
    {
      key: 'fecha_inicio',
      header: 'Inicio',
      sortable: true,
      render: (valor) => formatFecha(valor),
    },
    {
      key: 'fecha_fin',
      header: 'Fin',
      sortable: true,
      render: (valor) => formatFecha(valor),
    },
    {
      key: 'fecha_pago',
      header: 'Pago',
      sortable: true,
      render: (valor) => formatFecha(valor),
    },
    {
      key: 'estado',
      header: 'Estado',
      sortable: true,
      render: (valor) => (
        <StatusBadge estado={valor ?? 'BORRADOR'} size="sm" />
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
      rowActions={(periodo) =>
        accionesPorEstado(periodo, {
          onVerDetalle,
          onEditar,
          onAnular,
          onVerPrenomina,
          onVerRecibos,
        })
      }
      emptyTitle="Sin períodos registrados"
      emptyMessage="Crea el primer período de nómina para comenzar."
      ariaLabel="Listado de períodos de nómina"
    />
  );
}

export default TablaPeriodos;

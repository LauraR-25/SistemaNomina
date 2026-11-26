import { DataTable } from '../../common/data/DataTable/index.js';
import { StatusBadge } from '../../common/ui/StatusBadge/index.js';
import { formatRif } from '../../../utils/formatters.js';
import styles from './TablaEmpresas.module.css';

export function TablaEmpresas({
  datos = [],
  filas,
  loading = false,
  error = null,
  onRetry,
  onEditar,
  onEliminar,
  orden,
  onSort,
}) {
  const registros = filas ?? datos;
  const conAcciones = Boolean(onEditar || onEliminar);

  const columnas = [
    {
      key: 'rif',
      header: 'RIF',
      sortable: true,
      render: (valor) => <span className="tabular">{formatRif(valor)}</span>,
    },
    {
      key: 'razon_social',
      header: 'Empresa',
      sortable: true,
      render: (valor, fila) => (
        <div className={styles.empresa}>
          <span className={styles.principal}>{valor || '—'}</span>
          {fila.nombre_comercial && (
            <span className={styles.secundario}>{fila.nombre_comercial}</span>
          )}
        </div>
      ),
    },
    {
      key: 'moneda_codigo',
      header: 'Moneda',
      sortable: true,
      render: (valor) => valor || '—',
    },
    {
      key: 'activo',
      header: 'Estado',
      sortable: true,
      render: (valor) => (
        <StatusBadge estado={valor === false ? 'INACTIVO' : 'ACTIVO'} size="sm" />
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
        conAcciones
          ? (fila) =>
              [
                onEditar && {
                  id: `editar-${fila.id}`,
                  label: 'Editar',
                  icon: 'edit',
                  onClick: () => onEditar(fila),
                },
                onEliminar && {
                  id: `eliminar-${fila.id}`,
                  label: 'Eliminar',
                  icon: 'trash',
                  danger: true,
                  onClick: () => onEliminar(fila),
                },
              ].filter(Boolean)
          : undefined
      }
      emptyTitle="Sin empresas registradas"
      emptyMessage="No hay empresas que coincidan con los filtros aplicados."
      ariaLabel="Listado de empresas"
    />
  );
}

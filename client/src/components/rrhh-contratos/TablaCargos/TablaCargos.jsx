import { DataTable } from '../../common/data/DataTable/index.js';
import { StatusBadge } from '../../common/ui/StatusBadge/index.js';

export function TablaCargos({
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

  const columnas = [
    {
      key: 'nombre',
      header: 'Cargo',
      sortable: true,
    },
    {
      key: 'descripcion',
      header: 'Descripción',
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
      rowActions={(fila) =>
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
      }
      emptyTitle="Sin cargos registrados"
      emptyMessage="Crea el primer cargo para asociarlo a los contratos."
      ariaLabel="Listado de cargos"
    />
  );
}

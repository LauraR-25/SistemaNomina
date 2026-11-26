import { DataTable } from '../../common/data/DataTable/index.js';
import { StatusBadge } from '../../common/ui/StatusBadge/index.js';

export function TablaBancos({
  datos = [],
  filas,
  loading = false,
  error = null,
  onRetry,
  orden,
  onSort,
}) {
  const registros = filas ?? datos;

  const columnas = [
    {
      key: 'codigo',
      header: 'Código',
      sortable: true,
      render: (valor) => <span className="tabular">{valor || '—'}</span>,
    },
    {
      key: 'nombre',
      header: 'Banco',
      sortable: true,
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
      emptyTitle="Sin bancos disponibles"
      emptyMessage="El catálogo de bancos no tiene registros para mostrar."
      ariaLabel="Listado de bancos"
    />
  );
}

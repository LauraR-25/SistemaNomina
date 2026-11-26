import { DataTable } from '../../common/data/DataTable/index.js';
import { StatusBadge } from '../../common/ui/StatusBadge/index.js';
import { formatFecha, formatMoneda } from '../../../utils/formatters.js';

export function TablaCuotas({
  datos = [],
  filas,
  moneda = 'VES',
  loading = false,
  error = null,
  onRetry,
  onEditar,
  onDescontar,
  onCondonar,
  orden,
  onSort,
}) {
  const registros = filas ?? datos;

  const columnas = [
    {
      key: 'nro_cuota',
      header: 'N.º',
      align: 'right',
      sortable: true,
      render: (valor, cuota) => valor ?? cuota.numero ?? '—',
    },
    {
      key: 'fecha_vencimiento',
      header: 'Vencimiento',
      sortable: true,
      render: (valor) => formatFecha(valor),
    },
    {
      key: 'monto_cuota',
      header: 'Monto',
      align: 'right',
      sortable: true,
      render: (valor, cuota) =>
        formatMoneda(valor ?? cuota.monto, moneda),
    },
    {
      key: 'monto_descontado',
      header: 'Descontado',
      align: 'right',
      sortable: true,
      render: (valor) => formatMoneda(valor, moneda),
    },
    {
      key: 'periodo_id',
      header: 'Período',
      sortable: true,
      render: (valor, cuota) =>
        cuota.periodo?.nombre ?? valor ?? '—',
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
      rowActions={(fila) =>
        [
          fila.estado === 'PENDIENTE' &&
            onDescontar && {
              id: `descontar-${fila.id}`,
              label: 'Marcar descontada',
              icon: 'check',
              onClick: () => onDescontar(fila),
            },
          fila.estado === 'PENDIENTE' &&
            onCondonar && {
              id: `condonar-${fila.id}`,
              label: 'Condonar',
              icon: 'x',
              onClick: () => onCondonar(fila),
            },
          onEditar && {
            id: `editar-${fila.id}`,
            label: 'Editar',
            icon: 'edit',
            onClick: () => onEditar(fila),
          },
        ].filter(Boolean)
      }
      emptyTitle="Sin cuotas registradas"
      emptyMessage="Este préstamo aún no tiene cuotas generadas."
      ariaLabel="Listado de cuotas del préstamo"
    />
  );
}

export default TablaCuotas;

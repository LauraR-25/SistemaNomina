import { DataTable } from '../../common/data/DataTable/index.js';
import { StatusBadge } from '../../common/ui/StatusBadge/index.js';
import {
  formatFecha,
  formatMoneda,
  formatNumero,
} from '../../../utils/formatters.js';
import styles from './TablaNovedades.module.css';

function nombrePersona(persona) {
  if (!persona) return '—';

  return [persona.primer_nombre, persona.primer_apellido]
    .filter(Boolean)
    .join(' ');
}

export function TablaNovedades({
  datos = [],
  filas,
  personas = [],
  conceptos = [],
  periodos = [],
  loading = false,
  error = null,
  onRetry,
  onEditar,
  onEliminar,
  onAprobar,
  orden,
  onSort,
}) {
  const registros = filas ?? datos;

  function buscar(lista, id) {
    return lista.find((item) => String(item.id) === String(id));
  }

  const columnas = [
    {
      key: 'persona_id',
      header: 'Persona',
      sortable: true,
      render: (valor, novedad) => {
        const persona = novedad.persona ?? buscar(personas, valor);

        return (
          <div className={styles.identificador}>
            <span className={styles.principal}>{nombrePersona(persona)}</span>
            <span className={styles.secundario}>{persona?.cedula ?? '—'}</span>
          </div>
        );
      },
    },
    {
      key: 'concepto_id',
      header: 'Concepto',
      sortable: true,
      render: (valor, novedad) =>
        novedad.concepto?.nombre ?? buscar(conceptos, valor)?.nombre ?? '—',
    },
    {
      key: 'periodo_id',
      header: 'Período',
      sortable: true,
      render: (valor, novedad) =>
        novedad.periodo?.nombre ??
        buscar(periodos, valor)?.nombre ??
        valor ??
        '—',
    },
    {
      key: 'fecha_novedad',
      header: 'Fecha',
      sortable: true,
      render: (valor) => formatFecha(valor),
    },
    {
      key: 'cantidad',
      header: 'Cantidad',
      align: 'right',
      sortable: true,
      render: (valor) => formatNumero(valor),
    },
    {
      key: 'monto_total',
      header: 'Valor',
      align: 'right',
      sortable: true,
      render: (valor, novedad) =>
        formatMoneda(
          valor ?? novedad.monto ?? novedad.valor,
          novedad.moneda_codigo ?? 'VES'
        ),
    },
    {
      key: 'estado',
      header: 'Estado',
      sortable: true,
      render: (valor) => <StatusBadge estado={valor ?? 'PENDIENTE'} size="sm" />,
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
            onAprobar && {
              id: `aprobar-${fila.id}`,
              label: 'Aprobar',
              icon: 'check',
              onClick: () => onAprobar(fila),
            },
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
      emptyTitle="Sin novedades registradas"
      emptyMessage="Registra la primera novedad de nómina para comenzar."
      ariaLabel="Listado de novedades de nómina"
    />
  );
}

export default TablaNovedades;

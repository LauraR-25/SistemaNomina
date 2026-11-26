import { DataTable } from '../../common/data/DataTable/index.js';
import { Badge } from '../../common/ui/Badge/index.js';
import { StatusBadge } from '../../common/ui/StatusBadge/index.js';
import { formatFecha, formatNumero } from '../../../utils/formatters.js';
import styles from './TablaHoras.module.css';

function nombrePersona(persona) {
  if (!persona) return '—';

  return [persona.primer_nombre, persona.primer_apellido]
    .filter(Boolean)
    .join(' ');
}

export function TablaHoras({
  datos = [],
  filas,
  personas = [],
  periodos = [],
  loading = false,
  error = null,
  onRetry,
  onEditar,
  onEliminar,
  onAprobar,
  onRechazar,
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
      render: (valor, registro) => {
        const persona = registro.persona ?? buscar(personas, valor);

        return (
          <div className={styles.identificador}>
            <span className={styles.principal}>{nombrePersona(persona)}</span>
            <span className={styles.secundario}>{persona?.cedula ?? '—'}</span>
          </div>
        );
      },
    },
    {
      key: 'fecha',
      header: 'Fecha',
      sortable: true,
      render: (valor) => formatFecha(valor),
    },
    {
      key: 'tipo_hora',
      header: 'Tipo',
      sortable: true,
      render: (valor) => (
        <Badge variant={valor === 'EXTRA' ? 'warning' : 'info'} size="sm">
          {valor === 'EXTRA' ? 'Extra' : 'Ordinaria'}
        </Badge>
      ),
    },
    {
      key: 'horas',
      header: 'Horas',
      align: 'right',
      sortable: true,
      render: (valor, registro) =>
        formatNumero(valor ?? registro.cantidad, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
    },
    {
      key: 'factor_recargo',
      header: 'Recargo',
      align: 'right',
      sortable: true,
      render: (valor) => formatNumero(valor ?? 1),
    },
    {
      key: 'periodo_id',
      header: 'Período',
      sortable: true,
      render: (valor, registro) =>
        registro.periodo?.nombre ?? buscar(periodos, valor)?.nombre ?? valor ?? '—',
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
            onAprobar && {
              id: `aprobar-${fila.id}`,
              label: 'Aprobar',
              icon: 'check',
              onClick: () => onAprobar(fila),
            },
          fila.estado === 'PENDIENTE' &&
            onRechazar && {
              id: `rechazar-${fila.id}`,
              label: 'Rechazar',
              icon: 'x',
              danger: true,
              onClick: () => onRechazar(fila),
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
      emptyTitle="Sin registros de horas"
      emptyMessage="Registra la primera jornada para comenzar."
      ariaLabel="Listado de registro de horas"
    />
  );
}

export default TablaHoras;

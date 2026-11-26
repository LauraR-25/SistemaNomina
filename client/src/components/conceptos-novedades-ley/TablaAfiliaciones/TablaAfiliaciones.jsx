import { DataTable } from '../../common/data/DataTable/index.js';
import { Badge } from '../../common/ui/Badge/index.js';
import { StatusBadge } from '../../common/ui/StatusBadge/index.js';
import { formatFecha } from '../../../utils/formatters.js';
import styles from './TablaAfiliaciones.module.css';

function nombrePersona(persona) {
  if (!persona) return '—';

  return [persona.primer_nombre, persona.primer_apellido]
    .filter(Boolean)
    .join(' ');
}

export function TablaAfiliaciones({
  datos = [],
  filas,
  personas = [],
  tiposAporte = [],
  loading = false,
  error = null,
  onRetry,
  onEditar,
  onEliminar,
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
      render: (valor, afiliacion) => {
        const persona = afiliacion.persona ?? buscar(personas, valor);

        return (
          <div className={styles.identificador}>
            <span className={styles.principal}>{nombrePersona(persona)}</span>
            <span className={styles.secundario}>{persona?.cedula ?? '—'}</span>
          </div>
        );
      },
    },
    {
      key: 'tipo_aporte_id',
      header: 'Tipo de aporte',
      sortable: true,
      render: (valor, afiliacion) => {
        const tipo =
          afiliacion.tipo_aporte ??
          buscar(tiposAporte, valor) ??
          (afiliacion.regimen ? { nombre: afiliacion.regimen } : null);

        return (
          <Badge variant="accent" size="sm">
            {tipo?.nombre ?? tipo?.codigo ?? valor ?? '—'}
          </Badge>
        );
      },
    },
    {
      key: 'nro_afiliacion',
      header: 'N.º de afiliación',
      sortable: true,
      render: (valor) => valor ?? '—',
    },
    {
      key: 'fecha_afiliacion',
      header: 'Afiliación',
      sortable: true,
      render: (valor) => formatFecha(valor),
    },
    {
      key: 'fecha_baja',
      header: 'Baja',
      sortable: true,
      render: (valor) => formatFecha(valor),
    },
    {
      key: 'estado',
      header: 'Estado',
      sortable: true,
      render: (valor) => (
        <StatusBadge estado={valor ?? 'ACTIVO'} size="sm" />
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
      emptyTitle="Sin afiliaciones registradas"
      emptyMessage="Registra la primera afiliación de ley para comenzar."
      ariaLabel="Listado de afiliaciones de ley"
    />
  );
}

export default TablaAfiliaciones;

import { DataTable } from '../../common/data/DataTable/index.js';
import { StatusBadge } from '../../common/ui/StatusBadge/index.js';
import { formatCedula } from '../../../utils/formatters.js';
import styles from './TablaPersonas.module.css';

function nombreCompleto(persona) {
  return [persona.primer_nombre, persona.segundo_nombre, persona.primer_apellido, persona.segundo_apellido]
    .filter(Boolean)
    .join(' ');
}

export function TablaPersonas({
  datos = [],
  filas,
  loading = false,
  error = null,
  onRetry,
  onEditar,
  onEliminar,
  onVerDetalle,
  orden,
  onSort,
}) {
  const registros = filas ?? datos;

  const columnas = [
    {
      key: 'cedula',
      header: 'Cédula',
      sortable: true,
      render: (valor) => <span className="tabular">{formatCedula(valor)}</span>,
    },
    {
      key: 'primer_nombre',
      header: 'Persona',
      sortable: true,
      render: (valor, persona) => (
        <div className={styles.persona}>
          <span className={styles.principal}>{nombreCompleto(persona)}</span>
          {persona.email && <span className={styles.secundario}>{persona.email}</span>}
        </div>
      ),
    },
    {
      key: 'nro_tlf',
      header: 'Teléfono',
      sortable: true,
      render: (valor) => <span className="tabular">{valor || '—'}</span>,
    },
    {
      key: 'sexo',
      header: 'Sexo',
      render: (valor) => (valor === 'M' ? 'Masculino' : valor === 'F' ? 'Femenino' : '—'),
    },
    {
      key: 'estado_civil',
      header: 'Estado civil',
      render: (valor) =>
        valor
          ? String(valor)
              .toLowerCase()
              .replace(/^./, (letra) => letra.toUpperCase())
          : '—',
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
      onRowClick={onVerDetalle}
      rowActions={(fila) =>
        [
          onVerDetalle && {
            id: `detalle-${fila.id}`,
            label: 'Ver historial',
            icon: 'eye',
            onClick: () => onVerDetalle(fila),
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
      emptyTitle="Sin personas registradas"
      emptyMessage="Registra una persona para comenzar a gestionar sus contratos."
      ariaLabel="Listado de personas"
    />
  );
}

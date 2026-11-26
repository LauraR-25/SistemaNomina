import { DataTable } from '../../common/data/DataTable/index.js';
import { Badge } from '../../common/ui/Badge/index.js';
import { StatusBadge } from '../../common/ui/StatusBadge/index.js';
import { formatFecha, formatMoneda } from '../../../utils/formatters.js';
import styles from './TablaContratos.module.css';

function nombrePersona(persona) {
  if (!persona) return '—';

  return [persona.primer_nombre, persona.primer_apellido]
    .filter(Boolean)
    .join(' ');
}

export function TablaContratos({
  datos = [],
  filas,
  personas = [],
  cargos = [],
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

  function personaDe(contrato) {
    return (
      contrato.persona ??
      personas.find((persona) => String(persona.id) === String(contrato.persona_id))
    );
  }

  function cargoDe(contrato) {
    return (
      contrato.cargo ??
      cargos.find((cargo) => String(cargo.id) === String(contrato.cargo_id))
    );
  }

  const columnas = [
    {
      key: 'persona_id',
      header: 'Persona',
      sortable: true,
      render: (valor, contrato) => (
        <div className={styles.contrato}>
          <span className={styles.principal}>{nombrePersona(personaDe(contrato))}</span>
          <span className={styles.secundario}>{personaDe(contrato)?.cedula ?? '—'}</span>
        </div>
      ),
    },
    {
      key: 'cargo_id',
      header: 'Cargo',
      sortable: true,
      render: (valor, contrato) => cargoDe(contrato)?.nombre ?? contrato.cargo ?? '—',
    },
    {
      key: 'tipo_pago',
      header: 'Tipo de pago',
      sortable: true,
      render: (valor) => (
        <Badge variant="neutral" size="sm">
          {valor === 'POR_HORA' ? 'Por hora' : 'Salario fijo'}
        </Badge>
      ),
    },
    {
      key: 'frecuencia_pago',
      header: 'Frecuencia',
      sortable: true,
      render: (valor) =>
        valor
          ? String(valor)
              .toLowerCase()
              .replace(/^./, (letra) => letra.toUpperCase())
          : '—',
    },
    {
      key: 'fecha_inicio',
      header: 'Inicio',
      sortable: true,
      render: (valor, contrato) =>
        formatFecha(valor ?? contrato.fecha_ingreso),
    },
    {
      key: 'salario',
      header: 'Salario',
      align: 'right',
      render: (valor, contrato) =>
        formatMoneda(
          valor ?? contrato.salario_base,
          contrato.moneda_codigo ?? 'VES'
        ),
    },
    {
      key: 'estado',
      header: 'Estado',
      sortable: true,
      render: (valor) => (
        <StatusBadge estado={valor ?? 'VIGENTE'} size="sm" />
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
            label: 'Ver detalle',
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
      emptyTitle="Sin contratos registrados"
      emptyMessage="Registra el primer contrato laboral para comenzar."
      ariaLabel="Listado de contratos"
    />
  );
}

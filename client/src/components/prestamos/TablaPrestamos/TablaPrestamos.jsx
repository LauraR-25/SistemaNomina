import { DataTable } from '../../common/data/DataTable/index.js';
import { Badge } from '../../common/ui/Badge/index.js';
import { ProgressBar } from '../../common/feedback/ProgressBar/index.js';
import { StatusBadge } from '../../common/ui/StatusBadge/index.js';
import { formatFecha, formatMoneda } from '../../../utils/formatters.js';
import { porcentajePagado } from './tablaPrestamos.model.js';
import styles from './TablaPrestamos.module.css';

const ETIQUETAS_MODALIDAD = {
  PORCENTAJE_SALARIO: 'Salario',
  PORCENTAJE_SALDO: 'Saldo',
  CUOTA_FIJA: 'Cuota fija',
};

function nombrePersona(persona) {
  if (!persona) return '—';

  return [persona.primer_nombre, persona.primer_apellido]
    .filter(Boolean)
    .join(' ');
}

export function TablaPrestamos({
  datos = [],
  filas,
  personas = [],
  loading = false,
  error = null,
  onRetry,
  onEditar,
  onEliminar,
  onVerCuotas,
  orden,
  onSort,
}) {
  const registros = filas ?? datos;

  function personaDe(prestamo) {
    return (
      prestamo.persona ??
      personas.find((persona) => String(persona.id) === String(prestamo.persona_id))
    );
  }

  const columnas = [
    {
      key: 'persona_id',
      header: 'Persona',
      sortable: true,
      render: (valor, prestamo) => {
        const persona = personaDe(prestamo);

        return (
          <div className={styles.prestamo}>
            <span className={styles.principal}>{nombrePersona(persona)}</span>
            <span className={styles.secundario}>{persona?.cedula ?? '—'}</span>
          </div>
        );
      },
    },
    {
      key: 'monto_aprobado',
      header: 'Monto',
      align: 'right',
      sortable: true,
      render: (valor, prestamo) =>
        formatMoneda(valor ?? prestamo.monto_total, prestamo.moneda_codigo ?? 'VES'),
    },
    {
      key: 'modalidad_descuento',
      header: 'Modalidad',
      sortable: true,
      render: (valor) => (
        <Badge variant="info" size="sm">
          {ETIQUETAS_MODALIDAD[valor] ?? valor ?? '—'}
        </Badge>
      ),
    },
    {
      key: 'nro_cuotas',
      header: 'Cuotas',
      align: 'right',
      sortable: true,
      render: (valor, prestamo) => valor ?? prestamo.cuotas ?? '—',
    },
    {
      key: 'saldo_pendiente',
      header: 'Saldo',
      align: 'right',
      sortable: true,
      render: (valor, prestamo) =>
        formatMoneda(
          valor ?? prestamo.monto_aprobado ?? prestamo.monto_total,
          prestamo.moneda_codigo ?? 'VES'
        ),
    },
    {
      key: 'progreso',
      header: 'Progreso',
      sortable: false,
      render: (valor, prestamo) => (
        <div className={styles.progreso}>
          <ProgressBar
            valor={porcentajePagado(prestamo)}
            max={100}
            etiqueta="Pagado"
            ariaLabel={`Progreso del préstamo de ${nombrePersona(personaDe(prestamo))}`}
          />
        </div>
      ),
    },
    {
      key: 'fecha_inicio_descuento',
      header: 'Inicio',
      sortable: true,
      render: (valor) => formatFecha(valor),
    },
    {
      key: 'estado',
      header: 'Estado',
      sortable: true,
      render: (valor) => (
        <StatusBadge estado={valor ?? 'SOLICITADO'} size="sm" />
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
          onVerCuotas && {
            id: `cuotas-${fila.id}`,
            label: 'Ver cuotas',
            icon: 'calendar',
            onClick: () => onVerCuotas(fila),
          },
          onEditar && {
            id: `editar-${fila.id}`,
            label: 'Editar',
            icon: 'edit',
            onClick: () => onEditar(fila),
          },
          onEliminar && {
            id: `eliminar-${fila.id}`,
            label: 'Anular',
            icon: 'trash',
            danger: true,
            onClick: () => onEliminar(fila),
          },
        ].filter(Boolean)
      }
      emptyTitle="Sin préstamos registrados"
      emptyMessage="Registra el primer préstamo para comenzar."
      ariaLabel="Listado de préstamos al personal"
    />
  );
}

export default TablaPrestamos;

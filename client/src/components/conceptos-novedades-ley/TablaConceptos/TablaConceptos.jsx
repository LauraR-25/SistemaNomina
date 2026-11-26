import { DataTable } from '../../common/data/DataTable/index.js';
import { Badge } from '../../common/ui/Badge/index.js';
import { formatFecha } from '../../../utils/formatters.js';
import styles from './TablaConceptos.module.css';

const VARIANTES_TIPO = {
  ASIGNACION: 'success',
  DEDUCCION: 'warning',
  APORTE_PATRONAL: 'accent',
};

const ETIQUETAS_TIPO = {
  ASIGNACION: 'Asignación',
  DEDUCCION: 'Deducción',
  APORTE_PATRONAL: 'Aporte patronal',
};

const VARIANTES_NATURALEZA = {
  CREDITO: 'info',
  DEBITO: 'danger',
};

export function etiquetaTipoConcepto(tipo) {
  return ETIQUETAS_TIPO[tipo] ?? String(tipo ?? '—');
}

export function varianteNaturaleza(naturaleza) {
  return VARIANTES_NATURALEZA[naturaleza] ?? 'neutral';
}

export function TablaConceptos({
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
      key: 'codigo',
      header: 'Código',
      sortable: true,
      render: (valor, concepto) => (
        <div className={styles.identificador}>
          <span className={styles.principal}>{valor ?? '—'}</span>
          <span className={styles.secundario}>
            {formatFecha(concepto.created_at)}
          </span>
        </div>
      ),
    },
    {
      key: 'nombre',
      header: 'Nombre',
      sortable: true,
    },
    {
      key: 'tipo_concepto',
      header: 'Tipo',
      sortable: true,
      render: (valor) => (
        <Badge variant={VARIANTES_TIPO[valor] ?? 'neutral'} size="sm">
          {etiquetaTipoConcepto(valor)}
        </Badge>
      ),
    },
    {
      key: 'categoria',
      header: 'Categoría',
      sortable: true,
      render: (valor) => (
        <Badge variant={valor === 'LEY' ? 'accent' : 'neutral'} size="sm">
          {String(valor ?? '—').replace(/_/g, ' ')}
        </Badge>
      ),
    },
    {
      key: 'naturaleza',
      header: 'Naturaleza',
      sortable: true,
      render: (valor, concepto) => (
        <div className={styles.badges}>
          <Badge variant={varianteNaturaleza(valor)} size="sm">
            {valor ?? '—'}
          </Badge>
          {concepto.tipo_concepto === 'APORTE_PATRONAL' && (
            <Badge variant="accent" size="sm" dot>
              Patronal
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: 'unidad',
      header: 'Unidad',
      sortable: true,
      render: (valor) => String(valor ?? '—').replace(/_/g, ' '),
    },
    {
      key: 'es_fijo',
      header: 'Configuración',
      sortable: true,
      render: (valor, concepto) => (
        <div className={styles.badges}>
          <Badge variant={valor ? 'info' : 'neutral'} size="sm">
            {valor ? 'Fijo' : 'Variable'}
          </Badge>
          <Badge
            variant={concepto.es_imponible ? 'warning' : 'neutral'}
            size="sm"
          >
            {concepto.es_imponible ? 'Imponible' : 'No imponible'}
          </Badge>
        </div>
      ),
    },
    {
      key: 'activo',
      header: 'Estado',
      sortable: true,
      render: (valor) => (
        <Badge variant={valor === false ? 'neutral' : 'success'} size="sm" dot>
          {valor === false ? 'Inactivo' : 'Activo'}
        </Badge>
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
            label: 'Desactivar',
            icon: 'trash',
            danger: true,
            onClick: () => onEliminar(fila),
          },
        ].filter(Boolean)
      }
      emptyTitle="Sin conceptos registrados"
      emptyMessage="Registra el primer concepto de nómina para comenzar."
      ariaLabel="Listado de conceptos de nómina"
    />
  );
}

export default TablaConceptos;

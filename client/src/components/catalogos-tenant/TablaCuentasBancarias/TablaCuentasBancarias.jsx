import { DataTable } from '../../common/data/DataTable/index.js';
import { Badge } from '../../common/ui/Badge/index.js';
import { StatusBadge } from '../../common/ui/StatusBadge/index.js';
import styles from './TablaCuentasBancarias.module.css';

function nombreBanco(cuenta) {
  return cuenta.banco?.nombre ?? cuenta.nombre_banco ?? '—';
}

function numeroCuenta(cuenta) {
  return cuenta.nro_cuenta ?? cuenta.numero_cuenta ?? '—';
}

export function TablaCuentasBancarias({
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
      key: 'banco',
      header: 'Banco',
      sortable: true,
      render: (valor, fila) => nombreBanco(fila),
    },
    {
      key: 'numero_cuenta',
      header: 'Número',
      sortable: true,
      render: (valor, fila) => (
        <span className="tabular">{numeroCuenta(fila)}</span>
      ),
    },
    {
      key: 'tipo_cuenta',
      header: 'Tipo',
      sortable: true,
      render: (valor) => (
        <Badge variant="neutral" size="sm">
          {valor === 'AHORRO' ? 'Ahorro' : 'Corriente'}
        </Badge>
      ),
    },
    {
      key: 'titular',
      header: 'Persona',
      sortable: true,
      render: (valor, fila) => valor || fila.persona?.nombre || '—',
    },
    {
      key: 'es_principal',
      header: 'Principal',
      render: (valor) =>
        valor ? (
          <Badge variant="accent" size="sm" dot>
            Principal
          </Badge>
        ) : (
          <span className={styles.secundario}>Secundaria</span>
        ),
    },
    {
      key: 'activa',
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
      rowActions={(fila) => [
        {
          id: `editar-${fila.id}`,
          label: 'Editar',
          icon: 'edit',
          onClick: () => onEditar?.(fila),
        },
        {
          id: `eliminar-${fila.id}`,
          label: 'Eliminar',
          icon: 'trash',
          danger: true,
          onClick: () => onEliminar?.(fila),
        },
      ]}
      emptyTitle="Sin cuentas bancarias"
      emptyMessage="Registra la primera cuenta bancaria para comenzar."
      ariaLabel="Listado de cuentas bancarias"
    />
  );
}

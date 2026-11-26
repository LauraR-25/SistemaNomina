import { Badge, DataTable } from '../../common/index.js';
import styles from './TablaPerfiles.module.css';

export function TablaPerfiles({
  datos,
  filas,
  onEditar,
  onCambiarEstado,
  ...props
}) {
  const registros = datos ?? filas ?? [];

  const columnas = [
    {
      key: 'nombre_perfil',
      header: 'Perfil',
      sortable: true,
      render: (valor) => (
        <strong className={styles.perfil}>{valor || '—'}</strong>
      ),
    },
    {
      key: 'descripcion',
      header: 'Descripción',
      render: (valor) => valor || '—',
    },
    {
      key: 'activo',
      header: 'Estado',
      sortable: true,
      render: (valor) => (
        <Badge variant={valor ? 'success' : 'neutral'} size="sm" dot>
          {valor ? 'Activo' : 'Inactivo'}
        </Badge>
      ),
    },
  ];

  const accionesFila = (fila) =>
    [
      onEditar && {
        id: 'editar',
        label: 'Editar perfil',
        icon: 'edit',
        onClick: () => onEditar(fila),
      },
      onCambiarEstado && {
        id: 'estado',
        label: fila.activo ? 'Desactivar' : 'Activar',
        icon: fila.activo ? 'lock' : 'check',
        onClick: () => onCambiarEstado(fila),
      },
    ].filter(Boolean);

  return (
    <DataTable
      datos={registros}
      columnas={columnas}
      accionesFila={accionesFila}
      emptyTitle="Sin perfiles"
      emptyMessage="No hay perfiles que coincidan con la búsqueda."
      ariaLabel="Tabla de perfiles"
      {...props}
    />
  );
}

export default TablaPerfiles;

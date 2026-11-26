import {
  Badge,
  DataTable,
} from '../../common/index.js';
import { formatFechaHora } from '../../../utils/formatters.js';
import {
  nombrePersona,
} from '../UsuarioForm/usuarioForm.model.js';
import styles from './TablaUsuarios.module.css';

function idsPerfiles(usuario = {}) {
  return (usuario.perfiles ?? usuario.perfil_ids ?? [])
    .map((perfil) => String(perfil?.id ?? perfil?.perfil_id ?? perfil))
    .filter(Boolean);
}

function resolverPerfiles(usuario = {}, perfiles = []) {
  const ids = idsPerfiles(usuario);
  const nombres = perfiles
    .filter((perfil) => ids.includes(String(perfil.id ?? perfil.perfil_id)))
    .map((perfil) => perfil.nombre_perfil ?? perfil.nombre ?? perfil.id);

  return nombres.length > 0
    ? nombres
    : ids.map((id) => `Perfil ${id}`);
}

export function TablaUsuarios({
  datos,
  filas,
  personas = [],
  perfiles = [],
  onEditar,
  onCambiarEstado,
  ...props
}) {
  const registros = datos ?? filas ?? [];

  const columnas = [
    {
      key: 'username',
      header: 'Usuario',
      sortable: true,
      render: (valor) => (
        <strong className={styles.usuario}>{valor || '—'}</strong>
      ),
    },
    {
      key: 'persona_id',
      header: 'Nombre',
      render: (valor, fila) => {
        const persona = fila.persona ?? personas.find(
          (item) => String(item.id) === String(valor ?? fila.persona_id)
        );

        return persona ? nombrePersona(persona) : '—';
      },
    },
    {
      key: 'perfiles',
      header: 'Perfiles',
      render: (valor, fila) => {
        const nombres = resolverPerfiles(fila, perfiles);

        if (nombres.length === 0) return '—';

        return (
          <div className={styles.perfiles}>
            {nombres.map((nombre) => (
              <Badge key={nombre} variant="accent" size="sm">
                {nombre}
              </Badge>
            ))}
          </div>
        );
      },
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
    {
      key: 'ultimo_acceso',
      header: 'Último acceso',
      sortable: true,
      render: (valor) => formatFechaHora(valor),
    },
    {
      key: 'bloqueado_hasta',
      header: 'Bloqueo',
      render: (valor) =>
        valor ? (
          <div className={styles.bloqueo}>
            <Badge variant="danger" size="sm" dot>
              Bloqueado
            </Badge>
            <span className={styles.fechaBloqueo}>
              {formatFechaHora(valor)}
            </span>
          </div>
        ) : (
          <span className={styles.sinBloqueo}>Sin bloqueo</span>
        ),
    },
  ];

  const accionesFila = (fila) =>
    [
      onEditar && {
        id: 'editar',
        label: 'Editar usuario',
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
      emptyTitle="Sin usuarios"
      emptyMessage="No hay usuarios que coincidan con los filtros."
      ariaLabel="Tabla de usuarios"
      {...props}
    />
  );
}

export default TablaUsuarios;

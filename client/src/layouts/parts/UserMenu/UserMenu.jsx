import { Avatar } from '../../../components/common/ui/Avatar/index.js';
import { Dropdown } from '../../../components/common/overlays/Dropdown/index.js';
import { useAuth } from '../../../hooks/auth-rbac/useAuth.js';
import cx from '../../../utils/cx.js';
import styles from './UserMenu.module.css';

export function UserMenu({ onCerrarSesion, className }) {
  const { usuario, perfiles } = useAuth();

  const nombre = usuario?.nombreCompleto || usuario?.username || 'Usuario';
  const nombreUsuario = usuario?.username || '';
  const listaPerfiles = Array.isArray(perfiles) ? perfiles : [];
  const perfilPrincipal =
    listaPerfiles.find((perfil) => perfil.esPrincipal || perfil.principal) ||
    listaPerfiles[0];
  const perfil = perfilPrincipal?.nombre_perfil || 'Sin perfil asignado';

  const items = [
    {
      id: 'mi-perfil',
      label: 'Mi perfil',
      icon: 'user',
      disabled: true,
    },
    {
      id: 'cerrar-sesion',
      label: 'Cerrar sesión',
      icon: 'logout',
      danger: true,
      onClick: onCerrarSesion,
    },
  ];

  return (
    <Dropdown
      className={cx(styles.contenedor, className)}
      items={items}
      disparador={
        <button type="button" className={styles.disparador}>
          <Avatar nombre={nombre} size="sm" conBorde />
          <span className={styles.datos}>
            <span className={styles.nombre}>{nombre}</span>
            <span className={styles.perfil}>
              {perfil}
              {nombreUsuario && (
                <span className={styles.usuario}> · {nombreUsuario}</span>
              )}
            </span>
          </span>
        </button>
      }
    />
  );
}

export default UserMenu;

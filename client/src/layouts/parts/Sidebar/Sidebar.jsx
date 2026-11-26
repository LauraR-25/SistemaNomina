import { useMemo } from 'react';
import { IconButton } from '../../../components/common/ui/IconButton/index.js';
import { Logo } from '../../../components/common/ui/Logo/index.js';
import { obtenerMenuParaSesion } from '../../../config/navigation.config.js';
import { useAuth } from '../../../hooks/auth-rbac/useAuth.js';
import cx from '../../../utils/cx.js';
import SidebarGroup from './SidebarGroup.jsx';
import styles from './Sidebar.module.css';

const VERSION = 'v1.0.0';

function normalizarGrupos(menu) {
  const entradas = Array.isArray(menu) ? menu.filter(Boolean) : [];

  if (entradas.length === 0) return [];

  if (entradas.every((entrada) => Array.isArray(entrada.modulos))) {
    return entradas;
  }

  return [
    {
      id: 'general',
      subsistema: 'General',
      etiqueta: 'General',
      modulos: entradas,
    },
  ];
}

export function Sidebar({
  rutaActual = '/inicio',
  subrutaActual = null,
  onNavegar,
  colapsado = false,
  movilAbierto = false,
  onCerrarMovil,
}) {
  const { sesion } = useAuth();
  const menu = useMemo(() => normalizarGrupos(obtenerMenuParaSesion(sesion)), [sesion]);
  const mostrarEtiquetasGrupo = menu.length > 1;

  return (
    <aside
      className={cx(
        styles.sidebar,
        colapsado && styles.colapsado,
        movilAbierto && styles.abierto
      )}
      aria-label="Navegación principal"
    >
      <div className={styles.cabecera}>
        <Logo collapsed={colapsado} />

        <IconButton
          icon="x"
          ariaLabel="Cerrar menú"
          className={styles.cerrarMovil}
          onClick={onCerrarMovil}
        />
      </div>

      <nav className={styles.navegacion}>
        {menu.map((grupo) => (
          <div key={grupo.id ?? grupo.subsistema} className={styles.seccion}>
            {mostrarEtiquetasGrupo && !colapsado && grupo.etiqueta && (
              <p className={styles.etiquetaGrupo}>{grupo.etiqueta}</p>
            )}

            {grupo.modulos.map((modulo) => (
              <SidebarGroup
                key={modulo.id}
                modulo={modulo}
                rutaActual={rutaActual}
                subrutaActual={subrutaActual}
                colapsado={colapsado}
                onNavegar={onNavegar}
              />
            ))}
          </div>
        ))}
      </nav>

      <div className={styles.pie}>
        {!colapsado && <span>Nómina Multiempresa</span>}
        <span className={styles.version}>{VERSION}</span>
      </div>
    </aside>
  );
}

export default Sidebar;

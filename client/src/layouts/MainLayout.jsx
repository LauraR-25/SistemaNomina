import { useAuth } from '../hooks/auth-rbac/useAuth.js';
import { useLayout } from '../hooks/ui/useLayout.js';
import cx from '../utils/cx.js';
import Sidebar from './parts/Sidebar/Sidebar.jsx';
import Topbar from './parts/Topbar/Topbar.jsx';
import styles from './MainLayout.module.css';

export function MainLayout({
  children,
  rutaActual = '/inicio',
  subrutaActual = null,
  onNavegar,
  onCerrarSesion,
}) {
  const { sesion } = useAuth();
  const {
    sidebarColapsado,
    sidebarMovilAbierto,
    alternarSidebar,
    cerrarSidebarMovil,
  } = useLayout();

  function navegar(destino) {
    if (typeof onNavegar === 'function') {
      onNavegar(destino);
    }
    cerrarSidebarMovil();
  }

  return (
    <div className={cx(styles.layout, sidebarColapsado && styles.colapsado)}>
      <Sidebar
        rutaActual={rutaActual}
        subrutaActual={subrutaActual}
        onNavegar={navegar}
        colapsado={sidebarColapsado}
        movilAbierto={sidebarMovilAbierto}
        onCerrarMovil={cerrarSidebarMovil}
      />

      {sidebarMovilAbierto && (
        <button
          type="button"
          className={styles.velo}
          aria-label="Cerrar menú de navegación"
          onClick={cerrarSidebarMovil}
        />
      )}

      <div className={styles.marco}>
        <Topbar
          rutaActual={rutaActual}
          subrutaActual={subrutaActual}
          onNavegar={navegar}
          onCerrarSesion={onCerrarSesion}
          onAlternarSidebar={alternarSidebar}
          sesion={sesion}
        />

        <main className={styles.contenido}>{children}</main>
      </div>
    </div>
  );
}

export default MainLayout;

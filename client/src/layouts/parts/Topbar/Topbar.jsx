import { IconButton } from '../../../components/common/ui/IconButton/index.js';
import { Breadcrumbs } from '../../../components/common/navigation/Breadcrumbs/index.js';
import { MODULOS_NAVEGACION } from '../../../config/navigation.config.js';
import { useLayout } from '../../../hooks/ui/useLayout.js';
import { useMediaQuery } from '../../../hooks/ui/useMediaQuery.js';
import CompanyBadge from '../CompanyBadge/CompanyBadge.jsx';
import NotificationsPanel from '../NotificationsPanel/NotificationsPanel.jsx';
import UserMenu from '../UserMenu/UserMenu.jsx';
import styles from './Topbar.module.css';

function construirMigas(rutaActual = '/inicio', subrutaActual, onNavegar) {
  const migas = [{ id: 'inicio', label: 'Inicio', ruta: '/inicio' }];

  if (rutaActual && rutaActual !== '/inicio') {
    const modulo = MODULOS_NAVEGACION.find((m) => m.ruta === rutaActual);

    migas.push({
      id: modulo?.id ?? rutaActual,
      label: modulo?.etiqueta ?? rutaActual,
      ruta: rutaActual,
    });

    if (subrutaActual) {
      const subitem = modulo?.subitems?.find(
        (item) =>
          item.id === subrutaActual ||
          `${modulo.ruta}/${item.id}` === subrutaActual
      );

      migas.push({
        id: subitem?.id ?? subrutaActual,
        label: subitem?.etiqueta ?? subrutaActual,
        ruta: subitem ? `${modulo.ruta}/${subitem.id}` : rutaActual,
      });
    }
  }

  return migas.map((miga, indice) =>
    indice < migas.length - 1
      ? { ...miga, onClick: () => onNavegar?.(miga.ruta) }
      : { id: miga.id, label: miga.label }
  );
}

export function Topbar({
  rutaActual = '/inicio',
  subrutaActual = null,
  onNavegar,
  onCerrarSesion,
  onAlternarSidebar,
}) {
  const esMovil = useMediaQuery('(max-width: 1023px)');
  const {
    sidebarColapsado,
    alternarSidebar,
    abrirSidebarMovil,
  } = useLayout();
  const migas = construirMigas(rutaActual, subrutaActual, onNavegar);

  function manejarMenu() {
    if (esMovil) {
      abrirSidebarMovil();
      return;
    }

    if (typeof onAlternarSidebar === 'function') {
      onAlternarSidebar();
    } else {
      alternarSidebar();
    }
  }

  return (
    <header className={styles.topbar}>
      <div className={styles.izquierda}>
        <IconButton icon="menu" ariaLabel="Abrir menú" onClick={manejarMenu} />

        {!esMovil && (
          <IconButton
            icon={sidebarColapsado ? 'chevron-right' : 'chevron-left'}
            ariaLabel={sidebarColapsado ? 'Expandir menú' : 'Colapsar menú'}
            onClick={alternarSidebar}
          />
        )}

        <Breadcrumbs items={migas} className={styles.migas} />
      </div>

      <div className={styles.derecha}>
        <CompanyBadge />
        <NotificationsPanel />
        <UserMenu onCerrarSesion={onCerrarSesion} />
      </div>
    </header>
  );
}

export default Topbar;

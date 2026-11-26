import { useState } from 'react';
import { Icon } from '../../../assets/icons/Icon.jsx';
import cx from '../../../utils/cx.js';
import SidebarItem from './SidebarItem.jsx';
import styles from './Sidebar.module.css';

export function SidebarGroup({
  modulo,
  rutaActual,
  subrutaActual,
  colapsado = false,
  onNavegar,
}) {
  const subitems = Array.isArray(modulo.subitems) ? modulo.subitems : [];
  const rutaDeSubitem = (subitem) => `${modulo.ruta}/${subitem.id}`;
  const subitemActivo = (subitem) =>
    subrutaActual === subitem.id || subrutaActual === rutaDeSubitem(subitem);

  const [abierto, setAbierto] = useState(
    () =>
      rutaActual === modulo.ruta || subitems.some((subitem) => subitemActivo(subitem))
  );

  const activo =
    rutaActual === modulo.ruta || subitems.some((subitem) => subitemActivo(subitem));

  if (subitems.length === 0 || colapsado) {
    return (
      <SidebarItem
        item={{ ...modulo, ruta: modulo.ruta }}
        activo={activo}
        colapsado={colapsado}
        onNavegar={onNavegar}
      />
    );
  }

  return (
    <div className={styles.grupoModulo}>
      <button
        type="button"
        className={cx(styles.item, styles.agrupador, activo && styles.activo)}
        aria-expanded={abierto}
        aria-current={activo && !abierto ? 'page' : undefined}
        onClick={() => setAbierto((valor) => !valor)}
      >
        <span className={styles.barra} aria-hidden="true" />

        {modulo.icono && (
          <span className={styles.iconoItem} aria-hidden="true">
            <Icon name={modulo.icono} size={18} />
          </span>
        )}

        <span className={styles.etiquetaItem}>{modulo.etiqueta}</span>

        <Icon
          name="chevron-down"
          size={14}
          className={cx(styles.chevron, abierto && styles.chevronAbierto)}
        />
      </button>

      {abierto && (
        <div className={styles.subitems}>
          {subitems.map((subitem) => (
            <SidebarItem
              key={subitem.id}
              item={{ ...subitem, ruta: rutaDeSubitem(subitem) }}
              activo={subitemActivo(subitem)}
              anidado
              onNavegar={onNavegar}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default SidebarGroup;

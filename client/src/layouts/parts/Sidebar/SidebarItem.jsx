import { Tooltip } from '../../../components/common/ui/Tooltip/index.js';
import { Icon } from '../../../assets/icons/Icon.jsx';
import cx from '../../../utils/cx.js';
import styles from './Sidebar.module.css';

export function SidebarItem({
  item,
  activo = false,
  colapsado = false,
  anidado = false,
  onNavegar,
}) {
  const etiqueta = item.etiqueta ?? item.label ?? '';
  const icono = item.icono ?? item.icon;
  const destino = item.ruta ?? item.id;

  const boton = (
    <button
      type="button"
      className={cx(
        styles.item,
        anidado && styles.anidado,
        activo && styles.activo
      )}
      aria-current={activo ? 'page' : undefined}
      onClick={() => onNavegar?.(destino)}
    >
      <span className={styles.barra} aria-hidden="true" />

      {icono && (
        <span className={styles.iconoItem} aria-hidden="true">
          <Icon name={icono} size={18} />
        </span>
      )}

      {!colapsado && <span className={styles.etiquetaItem}>{etiqueta}</span>}
    </button>
  );

  return colapsado ? (
    <Tooltip contenido={etiqueta} position="right">
      {boton}
    </Tooltip>
  ) : (
    boton
  );
}

export default SidebarItem;

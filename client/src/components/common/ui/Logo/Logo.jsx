import logoCompleto from '../../../../assets/brand/logo.svg';
import logoIcono from '../../../../assets/brand/logo-icon.svg';
import cx from '../../../../utils/cx.js';
import styles from './Logo.module.css';

/**
 * @param {{ collapsed?: boolean, className?: string }} props
 */
export function Logo({ collapsed = false, className }) {
  return (
    <span className={cx(styles.contenedor, collapsed && styles.colapsado, className)}>
      <img
        className={styles.imagen}
        src={collapsed ? logoIcono : logoCompleto}
        alt="Nómina Multiempresa"
      />
    </span>
  );
}

export default Logo;

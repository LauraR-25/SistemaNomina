import cx from '../../../../utils/cx.js';
import styles from './FilterBar.module.css';

/**
 * @param {{ search?: React.ReactNode, busqueda?: React.ReactNode, actions?: React.ReactNode, acciones?: React.ReactNode, children?: React.ReactNode, className?: string }} props
 */
export function FilterBar({
  search,
  busqueda,
  actions,
  acciones,
  children,
  className,
  ...props
}) {
  const buscador = search ?? busqueda;
  const botones = actions ?? acciones;

  return (
    <div className={cx(styles.barra, className)} {...props}>
      {buscador && <div className={styles.busqueda}>{buscador}</div>}
      {children && <div className={styles.filtros}>{children}</div>}
      {botones && <div className={styles.acciones}>{botones}</div>}
    </div>
  );
}

export default FilterBar;

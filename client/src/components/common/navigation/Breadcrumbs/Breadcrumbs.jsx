import { Icon } from '../../../../assets/icons/Icon.jsx';
import cx from '../../../../utils/cx.js';
import styles from './Breadcrumbs.module.css';

export function Breadcrumbs({ items = [], separador, className }) {
  const lista = Array.isArray(items) ? items.filter(Boolean) : [];

  return (
    <nav aria-label="Ruta de navegación" className={cx(styles.nav, className)}>
      <ol className={styles.lista}>
        {lista.map((item, indice) => {
          const esActual = indice === lista.length - 1;

          return (
            <li key={item.id ?? indice} className={styles.item}>
              {esActual ? (
                <span aria-current="page" className={cx(styles.etiqueta, styles.actual)}>
                  {item.label}
                </span>
              ) : item.onClick ? (
                <button type="button" className={styles.enlace} onClick={item.onClick}>
                  {item.label}
                </button>
              ) : (
                <span className={styles.etiqueta}>{item.label}</span>
              )}

              {!esActual && (
                <span className={styles.separador} aria-hidden="true">
                  {separador ?? <Icon name="chevron-right" size={14} />}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;

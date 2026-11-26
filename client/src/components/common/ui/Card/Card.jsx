import cx from '../../../../utils/cx.js';
import styles from './Card.module.css';

function claseRelleno(padding) {
  if (padding === false) return styles.paddingNone;
  if (padding === true) return styles.paddingMd;

  return styles[`padding${String(padding).charAt(0).toUpperCase()}${String(padding).slice(1)}`];
}

/**
 * @param {{ title?: React.ReactNode, actions?: React.ReactNode, footer?: React.ReactNode, padding?: 'none'|'sm'|'md'|'lg'|boolean, children?: React.ReactNode, className?: string }} props
 */
export function Card({
  title,
  actions,
  footer,
  padding = 'md',
  children,
  className,
  ...props
}) {
  return (
    <section className={cx(styles.tarjeta, claseRelleno(padding), className)} {...props}>
      {(title || actions) && (
        <header className={styles.cabecera}>
          {title && <div className={styles.titulo}>{title}</div>}
          {actions && <div className={styles.acciones}>{actions}</div>}
        </header>
      )}
      {children && <div className={styles.cuerpo}>{children}</div>}
      {footer && <footer className={styles.pie}>{footer}</footer>}
    </section>
  );
}

export default Card;

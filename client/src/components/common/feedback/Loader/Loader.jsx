import { createPortal } from 'react-dom';
import cx from '../../../../utils/cx.js';
import styles from './Loader.module.css';

const VARIANTES = {
  inline: 'inline',
  bloque: 'bloque',
  block: 'bloque',
  pantalla: 'pantalla',
  screen: 'pantalla',
  overlay: 'pantalla',
  fullscreen: 'pantalla',
};

export function Loader({
  variant = 'inline',
  size = 'md',
  mensaje,
  label,
  className,
  ...props
}) {
  const variante = VARIANTES[variant] ?? 'inline';
  const texto = mensaje ?? label;

  const elemento = (
    <div
      className={cx(styles.loader, styles[variante], className)}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={texto ?? 'Cargando'}
      {...props}
    >
      <span className={cx(styles.spinner, styles[size])} aria-hidden="true" />
      {texto && <span className={styles.mensaje}>{texto}</span>}
    </div>
  );

  if (variante === 'pantalla' && typeof document !== 'undefined') {
    return createPortal(elemento, document.body);
  }

  return elemento;
}

export default Loader;

import { Icon } from '../../../../assets/icons/Icon.jsx';
import cx from '../../../../utils/cx.js';
import styles from './Alert.module.css';

const ICONOS = {
  success: 'check',
  exito: 'check',
  error: 'alert',
  warning: 'alert',
  advertencia: 'alert',
  info: 'info',
};

const VARIANTES = {
  success: 'success',
  exito: 'success',
  error: 'error',
  warning: 'warning',
  advertencia: 'warning',
  info: 'info',
};

export function Alert({
  variant = 'info',
  titulo,
  descripcion,
  children,
  icono,
  cerrable = false,
  onCerrar,
  className,
  ...props
}) {
  const variante = VARIANTES[variant] ?? 'info';
  const contenido = descripcion ?? children;
  const iconoFinal = icono === undefined ? ICONOS[variant] ?? 'info' : icono;

  return (
    <div
      className={cx(styles.alerta, styles[variante], className)}
      role={variante === 'error' ? 'alert' : undefined}
      {...props}
    >
      {iconoFinal && (
        <span className={styles.icono} aria-hidden="true">
          {typeof iconoFinal === 'string' ? (
            <Icon name={iconoFinal} size={18} />
          ) : (
            iconoFinal
          )}
        </span>
      )}

      <div className={styles.contenido}>
        {titulo && <p className={styles.titulo}>{titulo}</p>}
        {contenido && <div className={styles.descripcion}>{contenido}</div>}
      </div>

      {cerrable && (
        <button
          type="button"
          className={styles.cerrar}
          onClick={onCerrar}
          aria-label="Cerrar alerta"
        >
          <Icon name="x" size={16} />
        </button>
      )}
    </div>
  );
}

export default Alert;

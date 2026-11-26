import { Icon } from '../../../../assets/icons/Icon.jsx';
import cx from '../../../../utils/cx.js';
import styles from './Input.module.css';

/**
 * @param {{ iconLeft?: string|React.ReactNode, iconRight?: string|React.ReactNode, iconoIzquierdo?: string|React.ReactNode, iconoDerecho?: string|React.ReactNode, prefix?: React.ReactNode, suffix?: React.ReactNode, prefijo?: React.ReactNode, sufijo?: React.ReactNode, size?: 'sm'|'md'|'lg', error?: boolean, disabled?: boolean, fullWidth?: boolean, wrapperClassName?: string, className?: string }} props
 */
export function Input({
  iconLeft,
  iconRight,
  iconoIzquierdo,
  iconoDerecho,
  prefix,
  suffix,
  prefijo,
  sufijo,
  size = 'md',
  error = false,
  disabled = false,
  fullWidth = true,
  wrapperClassName,
  className,
  type = 'text',
  ...props
}) {
  const izquierdo = iconLeft ?? iconoIzquierdo;
  const derecho = iconRight ?? iconoDerecho;
  const antes = prefix ?? prefijo;
  const despues = suffix ?? sufijo;

  function renderIcono(valor, clase) {
    if (!valor) return null;

    return typeof valor === 'string' ? (
      <Icon name={valor} size={16} className={clase} />
    ) : (
      <span className={clase}>{valor}</span>
    );
  }

  return (
    <div
      className={cx(
        styles.envoltorio,
        styles[size],
        error && styles.error,
        disabled && styles.deshabilitado,
        fullWidth && styles.anchoCompleto,
        wrapperClassName
      )}
    >
      {antes && <span className={styles.afijo}>{antes}</span>}
      {renderIcono(izquierdo, styles.icono)}
      <input
        type={type}
        className={cx(styles.input, className)}
        disabled={disabled}
        aria-invalid={error || undefined}
        {...props}
      />
      {renderIcono(derecho, styles.icono)}
      {despues && <span className={styles.afijo}>{despues}</span>}
    </div>
  );
}

export default Input;

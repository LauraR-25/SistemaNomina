import { Icon } from '../../../../assets/icons/Icon.jsx';
import cx from '../../../../utils/cx.js';
import styles from './Button.module.css';

/**
 * @param {{ children?: React.ReactNode, variant?: 'primary'|'secondary'|'danger'|'ghost', size?: 'sm'|'md'|'lg', loading?: boolean, disabled?: boolean, iconLeft?: string|React.ReactNode, iconRight?: string|React.ReactNode, fullWidth?: boolean, className?: string }} props
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  iconLeft,
  iconRight,
  fullWidth = false,
  type = 'button',
  className,
  ...props
}) {
  const tamanoIcono = size === 'sm' ? 14 : size === 'lg' ? 18 : 16;

  function renderIcono(valor, clase) {
    if (!valor) return null;

    if (typeof valor === 'string') {
      return <Icon name={valor} size={tamanoIcono} className={clase} />;
    }

    return (
      <span className={clase} aria-hidden="true">
        {valor}
      </span>
    );
  }

  return (
    <button
      type={type}
      className={cx(
        styles.boton,
        styles[variant],
        styles[size],
        fullWidth && styles.anchoCompleto,
        className
      )}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <span className={styles.spinner} aria-hidden="true" />}
      {renderIcono(iconLeft, styles.icono)}
      {children && <span className={styles.etiqueta}>{children}</span>}
      {renderIcono(iconRight, styles.icono)}
    </button>
  );
}

export default Button;

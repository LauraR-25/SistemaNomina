import { Icon } from '../../../../assets/icons/Icon.jsx';
import cx from '../../../../utils/cx.js';
import styles from './IconButton.module.css';

/**
 * @param {{ icon: string|React.ReactNode, ariaLabel: string, variant?: 'ghost'|'danger', size?: 'sm'|'md'|'lg', disabled?: boolean, className?: string }} props
 */
export function IconButton({
  icon,
  ariaLabel,
  variant = 'ghost',
  size = 'md',
  disabled = false,
  type = 'button',
  className,
  ...props
}) {
  const tamanoIcono = size === 'sm' ? 16 : size === 'lg' ? 20 : 18;

  return (
    <button
      type={type}
      aria-label={ariaLabel}
      className={cx(styles.boton, styles[variant], styles[size], className)}
      disabled={disabled}
      {...props}
    >
      {typeof icon === 'string' ? (
        <Icon name={icon} size={tamanoIcono} />
      ) : (
        <span className={styles.icono} aria-hidden="true">
          {icon}
        </span>
      )}
    </button>
  );
}

export default IconButton;

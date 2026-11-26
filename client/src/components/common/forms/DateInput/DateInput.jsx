import { Icon } from '../../../../assets/icons/Icon.jsx';
import cx from '../../../../utils/cx.js';
import styles from './DateInput.module.css';

/**
 * @param {{ size?: 'sm'|'md'|'lg', error?: boolean, disabled?: boolean, fullWidth?: boolean, wrapperClassName?: string, className?: string }} props
 */
export function DateInput({
  size = 'md',
  error = false,
  disabled = false,
  fullWidth = true,
  wrapperClassName,
  className,
  ...props
}) {
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
      <Icon name="calendar" size={16} className={styles.icono} />
      <input
        type="date"
        className={cx(styles.input, className)}
        disabled={disabled}
        aria-invalid={error || undefined}
        {...props}
      />
    </div>
  );
}

export default DateInput;

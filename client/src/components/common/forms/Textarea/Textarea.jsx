import cx from '../../../../utils/cx.js';
import styles from './Textarea.module.css';

/**
 * @param {{ rows?: number, error?: boolean, disabled?: boolean, fullWidth?: boolean, className?: string }} props
 */
export function Textarea({
  rows = 4,
  error = false,
  disabled = false,
  fullWidth = true,
  className,
  ...props
}) {
  return (
    <textarea
      rows={rows}
      className={cx(
        styles.textarea,
        error && styles.error,
        disabled && styles.deshabilitado,
        fullWidth && styles.anchoCompleto,
        className
      )}
      disabled={disabled}
      aria-invalid={error || undefined}
      {...props}
    />
  );
}

export default Textarea;

import { Icon } from '../../../../assets/icons/Icon.jsx';
import cx from '../../../../utils/cx.js';
import styles from './Select.module.css';

/**
 * @param {{ options?: Array<{ value: string, label: string, disabled?: boolean }>, placeholder?: string, value?: string, size?: 'sm'|'md'|'lg', error?: boolean, disabled?: boolean, className?: string }} props
 */
export function Select({
  options = [],
  placeholder = 'Seleccione una opción',
  value,
  size = 'md',
  error = false,
  disabled = false,
  fullWidth = true,
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
        className
      )}
    >
      <select
        className={styles.select}
        value={value === undefined ? undefined : value}
        disabled={disabled}
        aria-invalid={error || undefined}
        {...props}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opcion) => (
          <option key={opcion.value} value={opcion.value} disabled={opcion.disabled}>
            {opcion.label}
          </option>
        ))}
      </select>
      <Icon name="chevron-down" size={16} className={styles.chevron} />
    </div>
  );
}

export default Select;

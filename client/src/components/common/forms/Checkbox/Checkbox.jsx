import { useId } from 'react';
import { Icon } from '../../../../assets/icons/Icon.jsx';
import cx from '../../../../utils/cx.js';
import styles from './Checkbox.module.css';

/**
 * @param {{ label?: React.ReactNode, children?: React.ReactNode, checked?: boolean, disabled?: boolean, error?: boolean, id?: string, className?: string }} props
 */
export function Checkbox({
  label,
  children,
  checked,
  disabled = false,
  error = false,
  id,
  className,
  ...props
}) {
  const generado = useId();
  const idFinal = id ?? generado;
  const texto = label ?? children;

  return (
    <label
      htmlFor={idFinal}
      className={cx(styles.etiqueta, disabled && styles.deshabilitado, className)}
    >
      <input
        id={idFinal}
        type="checkbox"
        className={styles.nativo}
        checked={checked}
        disabled={disabled}
        aria-invalid={error || undefined}
        {...props}
      />
      <span className={styles.caja} aria-hidden="true">
        <Icon name="check" size={12} className={styles.marca} />
      </span>
      {texto && <span className={styles.texto}>{texto}</span>}
    </label>
  );
}

export default Checkbox;

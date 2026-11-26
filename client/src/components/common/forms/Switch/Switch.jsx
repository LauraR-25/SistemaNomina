import { useId } from 'react';
import cx from '../../../../utils/cx.js';
import styles from './Switch.module.css';

/**
 * @param {{ label?: React.ReactNode, description?: React.ReactNode, checked?: boolean, disabled?: boolean, id?: string, className?: string }} props
 */
export function Switch({
  label,
  description,
  checked,
  disabled = false,
  id,
  className,
  ...props
}) {
  const generado = useId();
  const idFinal = id ?? generado;

  return (
    <div className={cx(styles.contenedor, disabled && styles.deshabilitado, className)}>
      <label className={styles.etiqueta} htmlFor={idFinal}>
        <input
          id={idFinal}
          type="checkbox"
          role="switch"
          className={styles.nativo}
          checked={checked}
          disabled={disabled}
          aria-checked={checked === undefined ? undefined : checked}
          {...props}
        />
        <span className={styles.pista} aria-hidden="true">
          <span className={styles.boton} />
        </span>
        {label && <span className={styles.texto}>{label}</span>}
      </label>
      {description && <span className={styles.descripcion}>{description}</span>}
    </div>
  );
}

export default Switch;

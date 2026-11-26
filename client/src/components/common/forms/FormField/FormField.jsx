import { cloneElement, isValidElement, useId } from 'react';
import cx from '../../../../utils/cx.js';
import styles from './FormField.module.css';

/**
 * @param {{ label?: React.ReactNode, hint?: React.ReactNode, error?: React.ReactNode, required?: boolean, htmlFor?: string, id?: string, children?: React.ReactNode, className?: string }} props
 */
export function FormField({
  label,
  hint,
  error,
  required = false,
  htmlFor,
  id,
  children,
  className,
  ...props
}) {
  const generado = useId();
  const esControl = isValidElement(children);
  const idControl = esControl
    ? children.props.id ?? htmlFor ?? id ?? generado
    : htmlFor ?? id ?? generado;
  const idAyuda = hint ? `${idControl}-hint` : null;
  const idError = error ? `${idControl}-error` : null;
  const descrito = [
    esControl ? children.props['aria-describedby'] : null,
    idAyuda,
    idError,
  ]
    .filter(Boolean)
    .join(' ');

  const control = esControl
    ? cloneElement(children, {
        id: idControl,
        'aria-describedby': descrito || undefined,
        'aria-invalid': error ? true : children.props['aria-invalid'],
      })
    : children;

  return (
    <div className={cx(styles.campo, className)} {...props}>
      {label && (
        <label className={styles.etiqueta} htmlFor={idControl}>
          {label}
          {required && (
            <>
              <span className={styles.asterisco} aria-hidden="true">
                *
              </span>
              <span className={styles.srOnly}>(obligatorio)</span>
            </>
          )}
        </label>
      )}
      {control}
      {hint && (
        <span className={styles.ayuda} id={idAyuda ?? undefined}>
          {hint}
        </span>
      )}
      {error && (
        <span className={styles.error} id={idError ?? undefined} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

export default FormField;

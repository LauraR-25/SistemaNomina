import { Children, cloneElement, isValidElement, useId } from 'react';
import cx from '../../../../utils/cx.js';
import styles from './Radio.module.css';

/**
 * @param {{ label?: React.ReactNode, children?: React.ReactNode, value?: string, name?: string, checked?: boolean, disabled?: boolean, description?: React.ReactNode, id?: string, className?: string }} props
 */
export function Radio({
  label,
  children,
  value,
  name,
  checked,
  disabled = false,
  description,
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
      className={cx(styles.opcion, disabled && styles.deshabilitado, className)}
    >
      <input
        id={idFinal}
        type="radio"
        className={styles.nativo}
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        {...props}
      />
      <span className={styles.circulo} aria-hidden="true">
        <span className={styles.punto} />
      </span>
      <span className={styles.texto}>
        {texto}
        {description && <span className={styles.descripcion}>{description}</span>}
      </span>
    </label>
  );
}

/**
 * @param {{ options?: Array<{ value: string, label: string, description?: string, disabled?: boolean }>, children?: React.ReactNode, value?: string, onChange?: (value: string, event: React.ChangeEvent) => void, name?: string, label?: React.ReactNode, orientation?: 'vertical'|'horizontal', className?: string }} props
 */
export function RadioGroup({
  options = [],
  children,
  value,
  onChange,
  name,
  label,
  orientation = 'vertical',
  className,
  ...props
}) {
  const generado = useId();
  const nombre = name ?? generado;
  const elementos = children ??
    options.map((opcion) => (
      <Radio
        key={opcion.value}
        label={opcion.label}
        description={opcion.description}
        disabled={opcion.disabled}
        value={opcion.value}
      />
    ));

  return (
    <fieldset
      className={cx(styles.grupo, styles[orientation], className)}
      {...props}
    >
      {label && <legend className={styles.legend}>{label}</legend>}
      <div className={styles.opciones}>
        {Children.map(elementos, (elemento) =>
          isValidElement(elemento)
            ? cloneElement(elemento, {
                name: nombre,
                checked: elemento.props.value === value,
                onChange: (evento) => {
                  onChange?.(elemento.props.value, evento);
                  elemento.props.onChange?.(evento);
                },
              })
            : elemento
        )}
      </div>
    </fieldset>
  );
}

export default Radio;

import { useEffect, useRef, useState } from 'react';
import { Icon } from '../../../../assets/icons/Icon.jsx';
import { Input } from '../Input/Input.jsx';
import cx from '../../../../utils/cx.js';
import styles from './SearchInput.module.css';

/**
 * @param {{ value?: string, defaultValue?: string, onChange?: (evento: { target: { value: string } }) => void, onValueChange?: (valor: string) => void, onClear?: () => void, debounce?: number, placeholder?: string, ariaLabel?: string, disabled?: boolean, size?: 'sm'|'md'|'lg', className?: string }} props
 */
export function SearchInput({
  value,
  defaultValue = '',
  onChange,
  onValueChange,
  onClear,
  debounce = 0,
  placeholder = 'Buscar...',
  ariaLabel = 'Buscar',
  disabled = false,
  size = 'md',
  className,
  ...props
}) {
  const [texto, setTexto] = useState(value ?? defaultValue);
  const temporizador = useRef(null);

  useEffect(() => () => clearTimeout(temporizador.current), []);

  function notificar(nuevoTexto) {
    onChange?.({ target: { value: nuevoTexto } });
    onValueChange?.(nuevoTexto);
  }

  function manejarCambio(evento) {
    const nuevoTexto = evento.target.value;

    setTexto(nuevoTexto);
    clearTimeout(temporizador.current);

    if (debounce > 0) {
      temporizador.current = setTimeout(() => notificar(nuevoTexto), debounce);
      return;
    }

    notificar(nuevoTexto);
  }

  function limpiar() {
    clearTimeout(temporizador.current);
    setTexto('');
    notificar('');
    onClear?.();
  }

  const valorMostrado = value !== undefined ? value : texto;

  const botonLimpiar = valorMostrado ? (
    <button
      type="button"
      className={styles.limpiar}
      onClick={limpiar}
      aria-label="Limpiar búsqueda"
      disabled={disabled}
    >
      <Icon name="x" size={16} />
    </button>
  ) : null;

  return (
    <Input
      {...props}
      type="search"
      value={valorMostrado}
      onChange={manejarCambio}
      placeholder={placeholder}
      aria-label={props['aria-label'] ?? ariaLabel}
      iconLeft="search"
      iconRight={botonLimpiar}
      disabled={disabled}
      size={size}
      className={cx(styles.input, className)}
    />
  );
}

export default SearchInput;

import { useState } from 'react';
import { Icon } from '../../../../assets/icons/Icon.jsx';
import { Input } from '../Input/Input.jsx';
import cx from '../../../../utils/cx.js';
import styles from './PasswordField.module.css';

/**
 * @param {{ autoComplete?: string, disabled?: boolean, error?: boolean, size?: 'sm'|'md'|'lg', className?: string }} props
 */
export function PasswordField({
  autoComplete = 'current-password',
  disabled = false,
  size = 'md',
  className,
  ...props
}) {
  const [visible, setVisible] = useState(false);

  const boton = (
    <button
      type="button"
      className={styles.alternar}
      onClick={() => setVisible((valor) => !valor)}
      aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
      aria-pressed={visible}
      disabled={disabled}
    >
      <Icon name={visible ? 'eye-off' : 'eye'} size={16} />
    </button>
  );

  return (
    <Input
      {...props}
      type={visible ? 'text' : 'password'}
      autoComplete={autoComplete}
      disabled={disabled}
      size={size}
      iconRight={boton}
      className={cx(styles.input, className)}
    />
  );
}

export default PasswordField;

import imagenError from '../../../../assets/images/error-connection.svg';
import { Button } from '../../ui/Button/Button.jsx';
import cx from '../../../../utils/cx.js';
import styles from './ErrorState.module.css';

export function ErrorState({
  title,
  titulo,
  message,
  mensaje,
  error,
  onRetry,
  onReintentar,
  retryLabel = 'Reintentar',
  action,
  children,
  className,
  ...props
}) {
  const mensajeFinal =
    message ??
    mensaje ??
    (typeof error === 'string'
      ? error
      : error?.message ?? 'Ocurrió un problema al cargar la información.');
  const manejador = onRetry ?? onReintentar;
  const boton =
    action ??
    (manejador && (
      <Button variant="secondary" onClick={manejador}>
        {retryLabel}
      </Button>
    ));

  return (
    <div
      className={cx(styles.estado, className)}
      role="alert"
      aria-live="assertive"
      {...props}
    >
      <img className={styles.imagen} src={imagenError} alt="" aria-hidden="true" />

      <div className={styles.contenido}>
        <h3 className={styles.titulo}>{title ?? titulo ?? 'Error de conexión'}</h3>
        <p className={styles.mensaje}>{mensajeFinal}</p>
        {boton && <div className={styles.accion}>{boton}</div>}
        {children}
      </div>
    </div>
  );
}

export default ErrorState;

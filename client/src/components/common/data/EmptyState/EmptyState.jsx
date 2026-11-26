import { isValidElement } from 'react';
import imagenVacia from '../../../../assets/images/empty-state.svg';
import imagenSinResultados from '../../../../assets/images/no-results.svg';
import { Button } from '../../ui/Button/Button.jsx';
import cx from '../../../../utils/cx.js';
import styles from './EmptyState.module.css';

const VARIANTES_BUSQUEDA = new Set([
  'search',
  'busqueda',
  'búsqueda',
  'no-results',
  'sin-resultados',
  'sinResultados',
  'resultados',
]);

function resolverAccion(accion, onAction, actionLabel) {
  if (isValidElement(accion)) return accion;

  if (accion && typeof accion === 'object') {
    return (
      <Button
        variant={accion.variant ?? accion.variante ?? 'secondary'}
        size={accion.size}
        onClick={accion.onClick ?? accion.onAction ?? onAction}
      >
        {accion.label ?? accion.etiqueta ?? accion.texto ?? actionLabel}
      </Button>
    );
  }

  if (typeof accion === 'string') {
    return <Button onClick={onAction}>{accion}</Button>;
  }

  if (onAction && actionLabel) {
    return <Button onClick={onAction}>{actionLabel}</Button>;
  }

  return null;
}

export function EmptyState({
  title,
  titulo,
  message,
  mensaje,
  description,
  action,
  accion,
  onAction,
  actionLabel,
  image,
  imagen,
  variant,
  variante,
  compact = false,
  children,
  className,
  ...props
}) {
  const nombreVariante = String(variant ?? variante ?? '').toLowerCase();
  const esBusqueda =
    VARIANTES_BUSQUEDA.has(nombreVariante) ||
    nombreVariante.includes('resultado') ||
    nombreVariante.includes('search');

  const origen = image ?? imagen ?? (esBusqueda ? imagenSinResultados : imagenVacia);
  const tituloFinal =
    title ??
    titulo ??
    (esBusqueda ? 'Sin resultados' : 'No hay datos para mostrar');
  const mensajeFinal =
    message ??
    mensaje ??
    description ??
    (esBusqueda
      ? 'No encontramos registros que coincidan con tu búsqueda. Prueba con otros filtros.'
      : 'Cuando haya información disponible, podrás consultarla aquí.');
  const boton = resolverAccion(action ?? accion, onAction, actionLabel);

  return (
    <div
      className={cx(styles.estado, compact && styles.compacto, className)}
      role="status"
      aria-live="polite"
      {...props}
    >
      {origen !== false && origen !== null && (
        <img className={styles.imagen} src={origen} alt="" aria-hidden="true" />
      )}

      <div className={styles.contenido}>
        <h3 className={styles.titulo}>{tituloFinal}</h3>
        <p className={styles.mensaje}>{mensajeFinal}</p>
        {boton && <div className={styles.accion}>{boton}</div>}
        {children}
      </div>
    </div>
  );
}

export default EmptyState;

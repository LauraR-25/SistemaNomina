import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '../../../../assets/icons/Icon.jsx';
import cx from '../../../../utils/cx.js';
import styles from './Modal.module.css';

const SELECTOR_ENFOCABLES = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

const TAMANOS = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  small: 'sm',
  medium: 'md',
  large: 'lg',
};

function obtenerEnfocables(contenedor) {
  if (!contenedor) return [];

  return Array.from(contenedor.querySelectorAll(SELECTOR_ENFOCABLES)).filter(
    (elemento) =>
      !elemento.hasAttribute('disabled') &&
      elemento.getAttribute('aria-hidden') !== 'true'
  );
}

export function Modal({
  abierto = true,
  open,
  onClose,
  titulo,
  descripcion,
  header,
  body,
  children,
  footer,
  size = 'md',
  tamaño,
  cerrarAlEscape = true,
  cerrarAlClicFuera = true,
  closeOnEscape,
  closeOnOutsideClick,
  ocultarBotonCerrar = false,
  className,
}) {
  const estaAbierto = open ?? abierto;
  const dialogRef = useRef(null);
  const onCloseRef = useRef(onClose);
  const tituloId = useId();
  const descripcionId = useId();

  const permitirEscape = closeOnEscape ?? cerrarAlEscape;
  const permitirClicFuera = closeOnOutsideClick ?? cerrarAlClicFuera;

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!estaAbierto || typeof document === 'undefined') return undefined;

    const elementoAnterior = document.activeElement;
    const dialogo = dialogRef.current;
    const enfocables = obtenerEnfocables(dialogo);
    (enfocables[0] ?? dialogo)?.focus?.();

    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function manejarTeclado(evento) {
      if (evento.key === 'Escape' && permitirEscape) {
        evento.preventDefault();
        onCloseRef.current?.();
        return;
      }

      if (evento.key !== 'Tab') return;

      const actuales = obtenerEnfocables(dialogRef.current);
      const primero = actuales[0];
      const ultimo = actuales[actuales.length - 1];

      if (!primero) {
        evento.preventDefault();
        dialogRef.current?.focus();
        return;
      }

      if (
        !dialogRef.current?.contains(document.activeElement) ||
        (evento.shiftKey &&
          (document.activeElement === primero ||
            document.activeElement === dialogRef.current))
      ) {
        evento.preventDefault();
        (evento.shiftKey ? ultimo : primero).focus();
        return;
      }

      if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault();
        primero.focus();
      }
    }

    document.addEventListener('keydown', manejarTeclado);

    return () => {
      document.removeEventListener('keydown', manejarTeclado);
      document.body.style.overflow = overflowAnterior;
      elementoAnterior?.focus?.();
    };
  }, [estaAbierto, permitirEscape]);

  if (!estaAbierto || typeof document === 'undefined') return null;

  const tamano = TAMANOS[tamaño ?? size] ?? 'md';
  const mostrarCerrar = !ocultarBotonCerrar && Boolean(onClose);
  const mostrarHeader = Boolean(header || titulo || descripcion || mostrarCerrar);

  function manejarClicFuera(evento) {
    if (permitirClicFuera && evento.target === evento.currentTarget) {
      onCloseRef.current?.();
    }
  }

  return createPortal(
    <div className={styles.overlay} onMouseDown={manejarClicFuera}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={header || titulo ? tituloId : undefined}
        aria-describedby={descripcion ? descripcionId : undefined}
        tabIndex={-1}
        className={cx(styles.modal, styles[tamano], className)}
      >
        {mostrarHeader && (
          <header className={styles.header}>
            <div className={styles.cabecera} id={tituloId}>
              {header ?? (titulo && <h2 className={styles.titulo}>{titulo}</h2>)}
              {descripcion && (
                <p id={descripcionId} className={styles.descripcion}>
                  {descripcion}
                </p>
              )}
            </div>

            {mostrarCerrar && (
              <button
                type="button"
                className={styles.cerrar}
                onClick={() => onCloseRef.current?.()}
                aria-label="Cerrar modal"
              >
                <Icon name="x" size={18} />
              </button>
            )}
          </header>
        )}

        <div className={styles.body}>{body ?? children}</div>

        {footer && <footer className={styles.footer}>{footer}</footer>}
      </div>
    </div>,
    document.body
  );
}

export default Modal;

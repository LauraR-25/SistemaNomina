import { useEffect, useRef, useState } from 'react';
import { Icon } from '../../../../assets/icons/Icon.jsx';
import cx from '../../../../utils/cx.js';
import styles from './Toast.module.css';

const ICONOS = {
  exito: 'check',
  success: 'check',
  error: 'alert',
  advertencia: 'alert',
  warning: 'alert',
  info: 'info',
};

const VARIANTES = {
  exito: 'exito',
  success: 'exito',
  error: 'error',
  advertencia: 'advertencia',
  warning: 'advertencia',
  info: 'info',
};

export function Toast({
  id,
  tipo = 'info',
  titulo,
  mensaje,
  descripcion,
  duracion = 5000,
  onClose,
  onDescartar,
  className,
}) {
  const [pausado, setPausado] = useState(false);
  const restanteRef = useRef(Math.max(0, Number(duracion) || 0));
  const inicioRef = useRef(null);
  const onCloseRef = useRef(onClose ?? onDescartar);

  useEffect(() => {
    onCloseRef.current = onClose ?? onDescartar;
  }, [onClose, onDescartar]);

  useEffect(() => {
    restanteRef.current = Math.max(0, Number(duracion) || 0);
    inicioRef.current = null;
  }, [duracion]);

  useEffect(() => {
    if (pausado || restanteRef.current <= 0) return undefined;

    inicioRef.current = Date.now();
    const temporizador = setTimeout(
      () => onCloseRef.current?.(id),
      restanteRef.current
    );

    return () => {
      clearTimeout(temporizador);
      if (inicioRef.current !== null) {
        restanteRef.current = Math.max(
          0,
          restanteRef.current - (Date.now() - inicioRef.current)
        );
        inicioRef.current = null;
      }
    };
  }, [pausado, duracion, id]);

  const variante = VARIANTES[tipo] ?? 'info';
  const contenido = mensaje ?? descripcion;
  const duracionBarra = Math.max(0, Number(duracion) || 0);

  function perderFoco(evento) {
    if (!evento.currentTarget.contains(evento.relatedTarget)) {
      setPausado(false);
    }
  }

  return (
    <div
      className={cx(
        styles.toast,
        styles[variante],
        pausado && styles.pausado,
        className
      )}
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      onFocusCapture={() => setPausado(true)}
      onBlurCapture={perderFoco}
    >
      <span className={styles.icono} aria-hidden="true">
        <Icon name={ICONOS[tipo] ?? 'info'} size={18} />
      </span>

      <div className={styles.contenido}>
        {titulo && <p className={styles.titulo}>{titulo}</p>}
        {contenido && <div className={styles.mensaje}>{contenido}</div>}
      </div>

      <button
        type="button"
        className={styles.cerrar}
        onClick={() => onCloseRef.current?.(id)}
        aria-label="Descartar notificación"
      >
        <Icon name="x" size={15} />
      </button>

      {duracionBarra > 0 && (
        <span
          className={styles.progreso}
          style={{ animationDuration: `${duracionBarra}ms` }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

export default Toast;

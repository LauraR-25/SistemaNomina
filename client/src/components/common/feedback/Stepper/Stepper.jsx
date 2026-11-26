import { Icon } from '../../../../assets/icons/Icon.jsx';
import cx from '../../../../utils/cx.js';
import styles from './Stepper.module.css';

const ESTADOS = {
  complete: 'completado',
  completed: 'completado',
  done: 'completado',
  active: 'activo',
  current: 'activo',
  pending: 'pendiente',
  error: 'error',
};

export function Stepper({
  steps = [],
  activeId,
  estados = {},
  errorIds = [],
  onChange,
  className,
}) {
  const pasos = Array.isArray(steps) ? steps.filter(Boolean) : [];
  const indiceActivo = pasos.findIndex((paso) => paso.id === activeId);
  const errores = Array.isArray(errorIds) ? errorIds : [];

  return (
    <ol className={cx(styles.stepper, className)} aria-label="Progreso de pasos">
      {pasos.map((paso, indice) => {
        const valorEstado =
          estados[paso.id] ??
          paso.estado ??
          (errores.includes(paso.id)
            ? 'error'
            : indice < indiceActivo
              ? 'completado'
              : indice === indiceActivo
                ? 'activo'
                : 'pendiente');
        const estado = ESTADOS[valorEstado] ?? valorEstado;

        const contenido = (
          <>
            <span className={styles.marcador} aria-hidden="true">
              {estado === 'completado' ? (
                <Icon name="check" size={14} />
              ) : estado === 'error' ? (
                '!'
              ) : (
                indice + 1
              )}
            </span>
            <span className={styles.etiqueta}>{paso.label}</span>
          </>
        );

        return (
          <li
            key={paso.id ?? indice}
            className={cx(styles.paso, styles[estado])}
            aria-current={estado === 'activo' ? 'step' : undefined}
          >
            {onChange ? (
              <button
                type="button"
                className={styles.boton}
                onClick={() => onChange(paso.id)}
              >
                {contenido}
              </button>
            ) : (
              <div className={styles.boton}>{contenido}</div>
            )}
          </li>
        );
      })}
    </ol>
  );
}

export default Stepper;

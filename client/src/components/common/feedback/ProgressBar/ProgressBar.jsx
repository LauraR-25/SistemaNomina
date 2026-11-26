import cx from '../../../../utils/cx.js';
import styles from './ProgressBar.module.css';

export function ProgressBar({
  valor,
  value,
  max = 100,
  etiqueta,
  label,
  mostrarPorcentaje = true,
  showPercentage,
  indeterminada = false,
  indeterminate,
  className,
  ariaLabel,
}) {
  const esIndeterminada =
    indeterminada || indeterminate || (valor ?? value) == null;
  const texto = etiqueta ?? label;
  const maximo = Number(max) > 0 ? Number(max) : 100;
  const valorActual = Math.min(
    maximo,
    Math.max(0, Number(valor ?? value) || 0)
  );
  const porcentaje = Math.round((valorActual / maximo) * 100);
  const mostrar = showPercentage ?? mostrarPorcentaje;

  return (
    <div className={cx(styles.contenedor, className)}>
      {(texto || mostrar) && (
        <div className={styles.cabecera}>
          {texto && <span className={styles.etiqueta}>{texto}</span>}
          {mostrar && !esIndeterminada && (
            <span className={styles.porcentaje}>{porcentaje}%</span>
          )}
        </div>
      )}

      <div
        className={styles.pista}
        role="progressbar"
        aria-label={ariaLabel ?? texto ?? 'Progreso'}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={esIndeterminada ? undefined : porcentaje}
      >
        <div
          className={cx(styles.barra, esIndeterminada && styles.indeterminada)}
          style={esIndeterminada ? undefined : { width: `${porcentaje}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;

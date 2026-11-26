import { Icon } from '../../../../assets/icons/Icon.jsx';
import cx from '../../../../utils/cx.js';
import styles from './StatCard.module.css';

function normalizarVariacion(variacion) {
  if (variacion && typeof variacion === 'object') {
    return {
      texto: variacion.valor ?? variacion.texto ?? variacion.text,
      positiva: variacion.positiva ?? variacion.positive ?? String(variacion.valor ?? '').startsWith('+'),
    };
  }

  return {
    texto: variacion,
    positiva: String(variacion ?? '').trim().startsWith('+'),
  };
}

/**
 * @param {{ titulo?: string, title?: string, valor?: React.ReactNode, value?: React.ReactNode, icono?: string|React.ReactNode, icon?: string|React.ReactNode, variacion?: string|{ valor?: string, positiva?: boolean }, positiva?: boolean, sparkline?: React.ReactNode, loading?: boolean, className?: string }} props
 */
export function StatCard({
  titulo,
  title,
  valor,
  value,
  icono,
  icon,
  variacion,
  positiva,
  sparkline,
  loading = false,
  className,
}) {
  const etiqueta = titulo ?? title;
  const contenido = valor ?? value;
  const dibujo = icono ?? icon;
  const cambio = normalizarVariacion(variacion);
  const esPositiva = positiva ?? cambio.positiva;

  return (
    <article className={cx(styles.tarjeta, className)} aria-busy={loading || undefined}>
      <header className={styles.cabecera}>
        <span className={styles.titulo}>{etiqueta}</span>
        {dibujo && (
          <span className={styles.icono} aria-hidden="true">
            {typeof dibujo === 'string' ? <Icon name={dibujo} size={18} /> : dibujo}
          </span>
        )}
      </header>

      {loading ? (
        <div className={styles.cargando} role="status" aria-label="Cargando indicador">
          <span className={cx(styles.skeleton, styles.skeletonValor)} />
          <span className={cx(styles.skeleton, styles.skeletonTexto)} />
        </div>
      ) : (
        <>
          <div className={styles.valor}>{contenido}</div>
          {cambio.texto && (
            <div
              className={cx(
                styles.variacion,
                esPositiva ? styles.positiva : styles.negativa
              )}
            >
              <Icon
                name="trending-up"
                size={14}
                className={esPositiva ? styles.flecha : styles.flechaNegativa}
              />
              <span className="tabular">{cambio.texto}</span>
            </div>
          )}
        </>
      )}

      {sparkline && !loading && <div className={styles.sparkline}>{sparkline}</div>}
    </article>
  );
}

export default StatCard;

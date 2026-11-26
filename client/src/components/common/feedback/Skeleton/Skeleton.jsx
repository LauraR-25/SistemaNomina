import cx from '../../../../utils/cx.js';
import styles from './Skeleton.module.css';

const VARIANTES = {
  line: 'linea',
  texto: 'linea',
  circle: 'circulo',
  circulo: 'circulo',
  rect: 'rectangulo',
  bloque: 'bloque',
  block: 'bloque',
};

export function Skeleton({
  variant = 'line',
  ancho,
  width,
  alto,
  height,
  filas = 3,
  rows,
  tipo = 'tarjeta',
  className,
  style,
}) {
  const variante = VARIANTES[variant] ?? 'linea';
  const estilo = {
    ...style,
    width: ancho ?? width,
    height: alto ?? height,
  };

  if (variante === 'bloque') {
    const cantidad = Math.max(1, Number(rows ?? filas) || 1);

    return (
      <div
        className={cx(
          styles.bloque,
          styles[tipo] ?? styles.tarjeta,
          className
        )}
        style={estilo}
        aria-hidden="true"
      >
        {Array.from({ length: cantidad }, (_, indice) => (
          <span
            key={indice}
            className={styles.linea}
            style={{ width: `${88 - (indice % 3) * 14}%` }}
          />
        ))}
      </div>
    );
  }

  return (
    <span
      className={cx(styles.skeleton, styles[variante], className)}
      style={estilo}
      aria-hidden="true"
    />
  );
}

export function SkeletonBloque({ tipo = 'tarjeta', filas = 3, ...props }) {
  return <Skeleton variant="bloque" tipo={tipo} filas={filas} {...props} />;
}

export default Skeleton;

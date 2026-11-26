import { useId } from 'react';
import { EmptyState } from '../../data/EmptyState/EmptyState.jsx';
import {
  colorSerie,
  formatearValor,
  idUnico,
  normalizarSerie,
  rutaSuave,
} from '../chartUtils.js';
import cx from '../../../../utils/cx.js';
import styles from './Sparkline.module.css';

export function Sparkline({
  data,
  values,
  datos,
  height = 48,
  color,
  area = true,
  point = true,
  ariaLabel,
  label,
  formatValue,
  className,
  ...props
}) {
  const puntos = normalizarSerie(data ?? values ?? datos);
  const gradienteId = `spark-${idUnico(useId())}`;
  const ancho = 160;
  const alto = Math.max(24, Number(height) || 48);
  const relleno = 4;
  const colorLinea = color ?? colorSerie(0);

  if (puntos.length < 2) {
    return (
      <div className={cx(styles.vacio, className)}>
        <EmptyState
          compact
          image={false}
          title="Sin datos"
          message="No hay valores suficientes para mostrar la tendencia."
        />
      </div>
    );
  }

  const valores = puntos.map((punto) => punto.valor);
  const minimo = Math.min(...valores);
  const maximo = Math.max(...valores);
  const rango = maximo - minimo || 1;
  const coordenadas = puntos.map((punto, indice) => ({
    x: relleno + (indice * (ancho - relleno * 2)) / (puntos.length - 1),
    y:
      relleno +
      ((maximo - punto.valor) / rango) * (alto - relleno * 2),
  }));

  const trayecto = rutaSuave(coordenadas);
  const ultimo = coordenadas[coordenadas.length - 1];
  const areaTrayecto = `${trayecto} L ${ultimo.x} ${alto} L ${coordenadas[0].x} ${alto} Z`;
  const descripcion =
    ariaLabel ??
    label ??
    `Tendencia de ${formatearValor(valores[0], formatValue)} a ${formatearValor(
      valores[valores.length - 1],
      formatValue
    )}`;

  return (
    <div className={cx(styles.contenedor, className)} {...props}>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${ancho} ${alto}`}
        preserveAspectRatio="none"
        role="img"
        aria-label={descripcion}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={gradienteId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colorLinea} stopOpacity="0.28" />
            <stop offset="100%" stopColor={colorLinea} stopOpacity="0" />
          </linearGradient>
        </defs>

        {area && <path d={areaTrayecto} fill={`url(#${gradienteId})`} stroke="none" />}
        <path
          d={trayecto}
          fill="none"
          stroke={colorLinea}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />

        {point && (
          <>
            <circle cx={ultimo.x} cy={ultimo.y} r="3.2" fill={colorLinea} />
            <circle
              cx={ultimo.x}
              cy={ultimo.y}
              r="1.4"
              fill="var(--bg-surface)"
            />
          </>
        )}
      </svg>
    </div>
  );
}

export default Sparkline;

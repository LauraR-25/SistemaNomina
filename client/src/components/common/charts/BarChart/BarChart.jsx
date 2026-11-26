import { useState } from 'react';
import { EmptyState } from '../../data/EmptyState/EmptyState.jsx';
import {
  colorSerie,
  escalaEje,
  formatearValor,
  normalizarSerie,
} from '../chartUtils.js';
import cx from '../../../../utils/cx.js';
import styles from './BarChart.module.css';

export function BarChart({
  data,
  datos,
  height = 240,
  color,
  colors,
  colores,
  ariaLabel,
  label,
  formatValue,
  showGrid = true,
  className,
  ...props
}) {
  const [activo, setActivo] = useState(null);
  const puntos = normalizarSerie(data ?? datos);

  if (puntos.length === 0) {
    return (
      <div className={cx(styles.vacio, className)} {...props}>
        <EmptyState
          compact
          image={false}
          title="Sin datos"
          message="No hay valores para mostrar en el gráfico."
        />
      </div>
    );
  }

  const ancho = Math.max(320, puntos.length * 56);
  const alto = Math.max(160, Number(height) || 240);
  const margen = { superior: 16, derecho: 12, inferior: 36, izquierdo: 48 };
  const areaAncho = ancho - margen.izquierdo - margen.derecho;
  const areaAlto = alto - margen.superior - margen.inferior;
  const maximo = Math.max(...puntos.map((punto) => punto.valor), 0);
  const { techo, paso } = escalaEje(maximo, 4);
  const divisiones = [];

  for (let valor = 0; valor <= techo + paso / 2; valor += paso) {
    divisiones.push(Math.min(valor, techo));
  }

  const pasoColumna = areaAncho / puntos.length;
  const anchoBarra = Math.min(36, pasoColumna * 0.56);

  function posicionBarra(punto, indice) {
    const altura = techo > 0 ? (punto.valor / techo) * areaAlto : 0;

    return {
      x: margen.izquierdo + indice * pasoColumna + (pasoColumna - anchoBarra) / 2,
      y: margen.superior + areaAlto - altura,
      altura,
    };
  }

  const barraActiva = activo !== null ? puntos[activo] : null;
  const textoActivo = barraActiva
    ? `${barraActiva.etiqueta}: ${formatearValor(barraActiva.valor, formatValue)}`
    : '';
  const anchoTooltip = Math.max(74, textoActivo.length * 6 + 18);
  const posicionTooltip = activo !== null ? posicionBarra(puntos[activo], activo) : null;
  const xTooltip = posicionTooltip
    ? Math.min(
        Math.max(posicionTooltip.x + anchoBarra / 2 - anchoTooltip / 2, 4),
        ancho - anchoTooltip - 4
      )
    : 0;
  const yTooltip = posicionTooltip ? Math.max(4, posicionTooltip.y - 28) : 0;
  const descripcion =
    ariaLabel ??
    label ??
    `Gráfico de barras: ${puntos
      .map((punto) => `${punto.etiqueta} ${formatearValor(punto.valor, formatValue)}`)
      .join(', ')}`;

  return (
    <div className={cx(styles.contenedor, className)} {...props}>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${ancho} ${alto}`}
        role="img"
        aria-label={descripcion}
        xmlns="http://www.w3.org/2000/svg"
      >
        {showGrid &&
          divisiones.map((valor) => {
            const y = margen.superior + areaAlto - (valor / techo) * areaAlto;

            return (
              <g key={valor}>
                <line
                  x1={margen.izquierdo}
                  x2={ancho - margen.derecho}
                  y1={y}
                  y2={y}
                  className={styles.rejilla}
                />
                <text x={margen.izquierdo - 8} y={y + 4} className={styles.eje}>
                  {formatearValor(valor, formatValue)}
                </text>
              </g>
            );
          })}

        <line
          x1={margen.izquierdo}
          x2={ancho - margen.derecho}
          y1={margen.superior + areaAlto}
          y2={margen.superior + areaAlto}
          className={styles.ejeLinea}
        />

        {puntos.map((punto, indice) => {
          const posicion = posicionBarra(punto, indice);

          return (
            <g
              key={`${punto.etiqueta}-${indice}`}
              className={styles.grupo}
              tabIndex={0}
              role="img"
              aria-label={`${punto.etiqueta}: ${formatearValor(punto.valor, formatValue)}`}
              onMouseEnter={() => setActivo(indice)}
              onMouseLeave={() => setActivo(null)}
              onFocus={() => setActivo(indice)}
              onBlur={() => setActivo(null)}
            >
              <rect
                x={margen.izquierdo + indice * pasoColumna}
                y={margen.superior}
                width={pasoColumna}
                height={areaAlto}
                fill="transparent"
              />
              <rect
                className={cx(styles.barra, activo === indice && styles.barraActiva)}
                x={posicion.x}
                y={posicion.y}
                width={anchoBarra}
                height={Math.max(posicion.altura, 1)}
                rx="4"
                fill={colorSerie(indice, colors ?? colores ?? (color ? [color] : undefined))}
              />
              <text
                x={margen.izquierdo + indice * pasoColumna + pasoColumna / 2}
                y={alto - 12}
                className={styles.etiqueta}
              >
                {punto.etiqueta}
              </text>
            </g>
          );
        })}

        {barraActiva && (
          <g className={styles.tooltip} pointerEvents="none">
            <rect
              x={xTooltip}
              y={yTooltip}
              width={anchoTooltip}
              height="22"
              rx="5"
              className={styles.tooltipFondo}
            />
            <text
              x={xTooltip + anchoTooltip / 2}
              y={yTooltip + 15}
              className={styles.tooltipTexto}
            >
              {textoActivo}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}

export default BarChart;

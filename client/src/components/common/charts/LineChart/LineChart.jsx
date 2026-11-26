import { useState } from 'react';
import { EmptyState } from '../../data/EmptyState/EmptyState.jsx';
import {
  colorSerie,
  formatearValor,
  normalizarSerie,
  rutaSuave,
} from '../chartUtils.js';
import cx from '../../../../utils/cx.js';
import styles from './LineChart.module.css';

function extraerSeries(series, datos, colores) {
  const origen =
    Array.isArray(series) && series.length > 0
      ? series
      : [{ label: 'Serie 1', data: datos }];

  return origen
    .map((entrada, indice) => {
      const valores = normalizarSerie(
        entrada?.data ?? entrada?.values ?? entrada?.valores ?? entrada?.datos ?? entrada ?? []
      );

      return {
        id: indice,
        etiqueta:
          entrada?.label ?? entrada?.name ?? entrada?.nombre ?? `Serie ${indice + 1}`,
        color: entrada?.color ?? colorSerie(indice, colores),
        puntos: valores,
      };
    })
    .filter((serie) => serie.puntos.length > 0);
}

export function LineChart({
  series,
  data,
  datos,
  labels,
  etiquetas,
  height = 240,
  colors,
  colores,
  ariaLabel,
  label,
  formatValue,
  showLegend,
  showGrid = true,
  className,
  ...props
}) {
  const [activo, setActivo] = useState(null);
  const lista = extraerSeries(series, data ?? datos, colors ?? colores);

  if (lista.length === 0) {
    return (
      <div className={cx(styles.vacio, className)} {...props}>
        <EmptyState
          compact
          image={false}
          title="Sin datos"
          message="No hay series válidas para mostrar en el gráfico."
        />
      </div>
    );
  }

  const ancho = Math.max(360, lista[0].puntos.length * 64);
  const alto = Math.max(160, Number(height) || 240);
  const margen = { superior: 16, derecho: 16, inferior: 36, izquierdo: 48 };
  const areaAncho = ancho - margen.izquierdo - margen.derecho;
  const areaAlto = alto - margen.superior - margen.inferior;
  const cantidad = Math.max(...lista.map((serie) => serie.puntos.length));
  const todosLosValores = lista.flatMap((serie) => serie.puntos.map((punto) => punto.valor));
  const minimo = Math.min(...todosLosValores, 0);
  const maximo = Math.max(...todosLosValores, 0);
  const limiteInferior = minimo === maximo ? minimo - 1 : minimo;
  const limiteSuperior = minimo === maximo ? maximo + 1 : maximo;
  const pasoY = (limiteSuperior - limiteInferior) / 4;
  const etiquetasEje = labels ?? etiquetas ?? lista[0].puntos.map((punto) => punto.etiqueta);

  function posicionX(indice) {
    if (cantidad <= 1) return margen.izquierdo + areaAncho / 2;
    return margen.izquierdo + (indice * areaAncho) / (cantidad - 1);
  }

  function posicionY(valor) {
    return (
      margen.superior +
      areaAlto -
      ((valor - limiteInferior) / (limiteSuperior - limiteInferior)) * areaAlto
    );
  }

  function coordenadas(serie) {
    return serie.puntos.map((punto, indice) => ({
      x: posicionX(indice),
      y: posicionY(punto.valor),
    }));
  }

  const lineasActivas = activo !== null ? lista.filter((serie) => serie.puntos[activo]) : [];
  const textosTooltip = lineasActivas.map(
    (serie) =>
      `${serie.etiqueta}: ${formatearValor(serie.puntos[activo].valor, formatValue)}`
  );
  const anchoTooltip = Math.max(
    92,
    ...textosTooltip.map((texto) => texto.length * 6 + 18)
  );
  const xTooltip = activo !== null
    ? Math.min(Math.max(posicionX(activo) - anchoTooltip / 2, 4), ancho - anchoTooltip - 4)
    : 0;
  const altoTooltip = 12 + textosTooltip.length * 16;
  const descripcion =
    ariaLabel ??
    label ??
    `Gráfico de líneas de ${lista.map((serie) => serie.etiqueta).join(', ')}`;

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
          Array.from({ length: 5 }, (_, indice) => {
            const valor = limiteInferior + pasoY * indice;
            const y = posicionY(valor);

            return (
              <g key={indice}>
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

        {etiquetasEje.map((texto, indice) => (
          <text
            key={`${texto}-${indice}`}
            x={posicionX(indice)}
            y={alto - 12}
            className={styles.etiqueta}
          >
            {texto}
          </text>
        ))}

        {lista.map((serie) => (
          <path
            key={serie.id}
            d={rutaSuave(coordenadas(serie))}
            fill="none"
            stroke={serie.color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        ))}

        {lista.map((serie) =>
          coordenadas(serie).map((punto, indice) => (
            <circle
              key={`${serie.id}-${indice}`}
              cx={punto.x}
              cy={punto.y}
              r={activo === indice ? 4.5 : 3}
              fill="var(--bg-surface)"
              stroke={serie.color}
              strokeWidth="2"
            />
          ))
        )}

        {Array.from({ length: cantidad }, (_, indice) => {
          const paso = cantidad > 1 ? areaAncho / (cantidad - 1) : areaAncho;
          const x = posicionX(indice) - paso / 2;

          return (
            <rect
              key={`area-${indice}`}
              x={Math.max(margen.izquierdo, x)}
              y={margen.superior}
              width={paso}
              height={areaAlto}
              fill="transparent"
              tabIndex={0}
              role="img"
              aria-label={`Valores en ${etiquetasEje[indice] ?? indice + 1}`}
              onMouseEnter={() => setActivo(indice)}
              onMouseLeave={() => setActivo(null)}
              onFocus={() => setActivo(indice)}
              onBlur={() => setActivo(null)}
            />
          );
        })}

        {textosTooltip.length > 0 && (
          <g className={styles.tooltip} pointerEvents="none">
            <rect
              x={xTooltip}
              y="4"
              width={anchoTooltip}
              height={altoTooltip}
              rx="6"
              className={styles.tooltipFondo}
            />
            {textosTooltip.map((texto, indice) => (
              <text
                key={texto}
                x={xTooltip + 10}
                y={22 + indice * 16}
                className={styles.tooltipTexto}
              >
                {texto}
              </text>
            ))}
          </g>
        )}
      </svg>

      {(showLegend ?? lista.length > 1) && (
        <ul className={styles.leyenda}>
          {lista.map((serie) => (
            <li key={serie.id} className={styles.leyendaItem}>
              <span className={styles.muestra} style={{ background: serie.color }} aria-hidden="true" />
              {serie.etiqueta}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default LineChart;

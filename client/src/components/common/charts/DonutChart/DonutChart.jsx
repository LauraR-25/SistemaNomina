import { useState } from 'react';
import { EmptyState } from '../../data/EmptyState/EmptyState.jsx';
import {
  colorSerie,
  formatearValor,
  valorNumerico,
} from '../chartUtils.js';
import cx from '../../../../utils/cx.js';
import styles from './DonutChart.module.css';

function puntoAngulo(angulo, radio) {
  const radianes = (angulo * Math.PI) / 180;
  return {
    x: 100 + radio * Math.cos(radianes),
    y: 100 + radio * Math.sin(radianes),
  };
}

function trazarPortion(inicio, fin, radioExterior, radioInterior) {
  const gran = fin - inicio > 180 ? 1 : 0;
  const exteriorInicio = puntoAngulo(inicio, radioExterior);
  const exteriorFin = puntoAngulo(fin, radioExterior);
  const interiorFin = puntoAngulo(fin, radioInterior);
  const interiorInicio = puntoAngulo(inicio, radioInterior);

  return [
    `M ${exteriorInicio.x} ${exteriorInicio.y}`,
    `A ${radioExterior} ${radioExterior} 0 ${gran} 1 ${exteriorFin.x} ${exteriorFin.y}`,
    `L ${interiorFin.x} ${interiorFin.y}`,
    `A ${radioInterior} ${radioInterior} 0 ${gran} 0 ${interiorInicio.x} ${interiorInicio.y}`,
    'Z',
  ].join(' ');
}

export function DonutChart({
  data,
  datos,
  colors,
  colores,
  centerValue,
  valorCentral,
  centerLabel,
  etiquetaCentral,
  height = 200,
  ariaLabel,
  label,
  formatValue,
  className,
  ...props
}) {
  const [activo, setActivo] = useState(null);
  const porciones = (data ?? datos ?? [])
    .map((entrada, indice) => ({
      id: indice,
      etiqueta:
        entrada?.label ??
        entrada?.etiqueta ??
        entrada?.name ??
        entrada?.nombre ??
        `Porción ${indice + 1}`,
      valor: valorNumerico(entrada),
      color: entrada?.color ?? colorSerie(indice, colors ?? colores),
    }))
    .filter((porcion) => porcion.valor !== null && porcion.valor > 0);
  const total = porciones.reduce((acumulado, porcion) => acumulado + porcion.valor, 0);

  if (porciones.length === 0 || total <= 0) {
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

  const radio = 78;
  const radioInterior = 52;
  const separacion = porciones.length > 1 ? 1.2 : 0;
  const arcos = porciones.reduce(
    (acumulado, porcion) => {
      const grados = (porcion.valor / total) * 360;
      const inicio = -90 + acumulado.grados + separacion / 2;
      const fin = -90 + acumulado.grados + grados - separacion / 2;

      return {
        grados: acumulado.grados + grados,
        arcos: [
          ...acumulado.arcos,
          {
            ...porcion,
            inicio,
            fin: fin > inicio ? fin : inicio + 0.1,
            porcentaje: (porcion.valor / total) * 100,
          },
        ],
      };
    },
    { grados: 0, arcos: [] }
  ).arcos;
  const porcionActiva = activo !== null ? arcos[activo] : null;
  const valorCentro = centerValue ?? valorCentral ?? total;
  const etiquetaCentro = porcionActiva
    ? porcionActiva.etiqueta
    : centerLabel ?? etiquetaCentral ?? 'Total';
  const descripcion =
    ariaLabel ??
    label ??
    `Gráfico de dona: ${arcos
      .map((porcion) => `${porcion.etiqueta} ${formatearValor(porcion.valor, formatValue)}`)
      .join(', ')}`;

  return (
    <div className={cx(styles.contenedor, className)} {...props}>
      <div className={styles.grafico} style={{ maxWidth: Math.max(120, Number(height) || 200) }}>
        <svg
          className={styles.svg}
          viewBox="0 0 200 200"
          role="img"
          aria-label={descripcion}
          xmlns="http://www.w3.org/2000/svg"
        >
          {arcos.map((porcion, indice) =>
            porciones.length === 1 ? (
              <circle
                key={porcion.id}
                cx="100"
                cy="100"
                r={(radio + radioInterior) / 2}
                fill="none"
                stroke={porcion.color}
                strokeWidth={radio - radioInterior}
                className={cx(styles.portcion, activo === indice && styles.portcionActiva)}
                onMouseEnter={() => setActivo(indice)}
                onMouseLeave={() => setActivo(null)}
              >
                <title>{`${porcion.etiqueta}: ${formatearValor(porcion.valor, formatValue)}`}</title>
              </circle>
            ) : (
              <path
                key={porcion.id}
                d={trazarPortion(porcion.inicio, porcion.fin, radio, radioInterior)}
                fill={porcion.color}
                className={cx(styles.portcion, activo === indice && styles.portcionActiva)}
                onMouseEnter={() => setActivo(indice)}
                onMouseLeave={() => setActivo(null)}
              >
                <title>{`${porcion.etiqueta}: ${formatearValor(porcion.valor, formatValue)}`}</title>
              </path>
            )
          )}
        </svg>

        <div className={styles.centro} aria-hidden="true">
          <span className={styles.centroValor}>
            {formatearValor(porcionActiva ? porcionActiva.valor : valorCentro, formatValue)}
          </span>
          <span className={styles.centroEtiqueta}>{etiquetaCentro}</span>
        </div>
      </div>

      <ul className={styles.leyenda}>
        {arcos.map((porcion, indice) => (
          <li
            key={porcion.id}
            className={cx(styles.leyendaItem, activo === indice && styles.leyendaActiva)}
            onMouseEnter={() => setActivo(indice)}
            onMouseLeave={() => setActivo(null)}
          >
            <span className={styles.muestra} style={{ background: porcion.color }} aria-hidden="true" />
            <span className={styles.leyendaEtiqueta}>{porcion.etiqueta}</span>
            <span className={cx(styles.leyendaValor, 'tabular')}>
              {formatearValor(porcion.valor, formatValue)}
            </span>
            <span className={cx(styles.porcentaje, 'tabular')}>
              {formatearValor(porcion.porcentaje, (valor) => `${Math.round(valor)}%`)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DonutChart;

import { formatMoneda, formatNumero } from '../../../../utils/formatters.js';
import cx from '../../../../utils/cx.js';
import styles from './SummaryBar.module.css';

function esNeto(etiqueta) {
  return /neto/i.test(String(etiqueta ?? ''));
}

export function SummaryBar({
  items,
  totales,
  neto,
  totalNeto,
  moneda,
  label,
  titulo,
  children,
  className,
  ...props
}) {
  const listaBase = Array.isArray(items ?? totales) ? items ?? totales : [];

  const valorNeto = neto ?? totalNeto;
  const listaExtra =
    valorNeto === undefined || valorNeto === null
      ? []
      : [{ label: 'Neto', value: valorNeto, highlight: true }];

  const elementos = [...listaBase, ...listaExtra].map((item, indice) => {
    const etiqueta = item.label ?? item.etiqueta ?? item.title ?? '';
    const valor =
      item.value ?? item.valor ?? item.total ?? (item.monto !== undefined ? item.monto : item.importe);

    return {
      ...item,
      key: item.id ?? item.key ?? `${etiqueta}-${indice}`,
      etiqueta,
      contenido:
        typeof valor === 'number'
          ? moneda
            ? formatMoneda(valor, moneda)
            : formatNumero(valor)
          : valor,
      destacado: item.highlight ?? item.destacado ?? esNeto(etiqueta),
    };
  });

  return (
    <div
      className={cx(styles.barra, className)}
      role="group"
      aria-label={label ?? titulo ?? 'Resumen de totales'}
      {...props}
    >
      {(label ?? titulo) && <span className={styles.etiquetaGrupo}>{label ?? titulo}</span>}
      <dl className={styles.lista}>
        {elementos.map((item) => (
          <div
            key={item.key}
            className={cx(
              styles.elemento,
              item.destacado && styles.destacado,
              item.align === 'right' && styles.derecha
            )}
          >
            <dt className={styles.etiqueta}>{item.etiqueta}</dt>
            <dd className={cx(styles.valor, 'tabular')}>{item.contenido}</dd>
          </div>
        ))}
      </dl>
      {children}
    </div>
  );
}

export default SummaryBar;

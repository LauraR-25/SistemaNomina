import { useEffect, useRef } from 'react';
import { Icon } from '../../../../assets/icons/Icon.jsx';
import { Checkbox } from '../../forms/Checkbox/Checkbox.jsx';
import { Dropdown } from '../../overlays/Dropdown/Dropdown.jsx';
import { IconButton } from '../../ui/IconButton/IconButton.jsx';
import { Skeleton } from '../../feedback/Skeleton/Skeleton.jsx';
import { EmptyState } from '../EmptyState/EmptyState.jsx';
import { ErrorState } from '../ErrorState/ErrorState.jsx';
import cx from '../../../../utils/cx.js';
import styles from './DataTable.module.css';

function valorCelda(fila, clave) {
  return String(clave ?? '')
    .split('.')
    .reduce((acumulado, parte) => acumulado?.[parte], fila);
}

function contenidoCelda(columna, fila, indice) {
  const valor = valorCelda(fila, columna.key);

  if (typeof columna.render !== 'function') return valor ?? '';
  if (columna.render.length >= 2) return columna.render(valor, fila, indice);

  return columna.render(fila, indice, valor);
}

function aArreglo(valor) {
  if (valor instanceof Set) return [...valor];
  return Array.isArray(valor) ? valor : [];
}

export function DataTable({
  columns = [],
  rows = [],
  datos,
  columnas,
  getRowId,
  loading = false,
  cargando: cargandoAlias,
  error,
  onRetry,
  emptyTitle,
  tituloVacio,
  emptyMessage,
  mensajeVacio,
  emptyAction,
  onEmptyAction,
  onSort,
  sort,
  orden,
  selectable = false,
  seleccionable,
  selectedIds,
  idsSeleccionados,
  onSelectionChange: notificarSeleccion,
  rowActions,
  accionesFila,
  onRowClick,
  dense = false,
  compacto,
  footer,
  pie,
  maxHeight,
  ariaLabel = 'Tabla de datos',
  caption,
  className,
  ...props
}) {
  const columnasFinales = columnas ?? columns;
  const filas = datos ?? rows;
  const esDensa = compacto ?? dense;
  const esSeleccionable = seleccionable ?? selectable;
  const ordenActual = orden ?? sort;
  const obtenerId = (fila, indice) =>
    (getRowId ?? ((fil) => fil?.id ?? fil?._id ?? fil?.key))(fila, indice) ??
    `fila-${indice}`;
  const obtenerAcciones = rowActions ?? accionesFila;
  const cabeceraRef = useRef(null);
  const seleccionados = new Set(aArreglo(idsSeleccionados ?? selectedIds));
  const idsVisibles = filas.map((fila, indice) => obtenerId(fila, indice));
  const todosSeleccionados =
    idsVisibles.length > 0 && idsVisibles.every((id) => seleccionados.has(id));
  const algunosSeleccionados =
    !todosSeleccionados && idsVisibles.some((id) => seleccionados.has(id));
  const cargando = cargandoAlias ?? loading;
  const colSpan = columnasFinales.length + (esSeleccionable ? 1 : 0) + (obtenerAcciones ? 1 : 0);

  useEffect(() => {
    if (cabeceraRef.current) {
      cabeceraRef.current.indeterminate = algunosSeleccionados;
    }
  }, [algunosSeleccionados]);

  function cambiarSeleccion(id, marcado) {
    const nuevos = new Set(seleccionados);

    if (marcado) nuevos.add(id);
    else nuevos.delete(id);

    notificarSeleccion?.(nuevos);
  }

  function cambiarTodos(marcado) {
    const nuevos = new Set(seleccionados);

    idsVisibles.forEach((id) => {
      if (marcado) nuevos.add(id);
      else nuevos.delete(id);
    });

    notificarSeleccion?.(nuevos);
  }

  function alternarOrden(columna) {
    if (!columna.sortable && !columna.ordenable) return;

    const clave = columna.key;
    const direccion = ordenActual?.key === clave && ordenActual.dir === 'asc' ? 'desc' : 'asc';

    onSort?.({ key: clave, dir: direccion });
  }

  function manejarTecladoFila(evento, fila, indice) {
    if (evento.target !== evento.currentTarget) return;

    if (evento.key === 'Enter' || evento.key === ' ') {
      evento.preventDefault();
      onRowClick?.(fila, indice, evento);
    }
  }

  const estado =
    error && !cargando ? (
      <ErrorState error={error} onRetry={onRetry} />
    ) : (
      <EmptyState
        title={emptyTitle ?? tituloVacio}
        message={emptyMessage ?? mensajeVacio}
        action={emptyAction}
        onAction={onEmptyAction}
      />
    );

  return (
    <div
      className={cx(styles.contenedor, className)}
      style={maxHeight ? { maxHeight } : undefined}
      {...props}
    >
      {cargando ? (
        <div className={styles.cargando} role="status" aria-label="Cargando datos">
          {Array.from({ length: 5 }, (_, indice) => (
            <div className={styles.filaCarga} key={indice}>
              {columnasFinales.map((columna, columnaIndice) => (
                <Skeleton
                  key={columna.key ?? columnaIndice}
                  variant="linea"
                  width={columnaIndice === 0 ? '30%' : `${Math.max(12, 24 - columnaIndice * 2)}%`}
                />
              ))}
            </div>
          ))}
        </div>
      ) : error || filas.length === 0 ? (
        estado
      ) : (
        <div className={styles.desplazamiento}>
          <table
            className={cx(styles.tabla, esDensa && styles.densa)}
            aria-label={ariaLabel}
            aria-busy={cargando || undefined}
          >
            {caption && <caption className={styles.oculto}>{caption}</caption>}

            <thead className={styles.cabeceraTabla}>
              <tr>
                {esSeleccionable && (
                  <th scope="col" className={cx(styles.celda, styles.seleccion)}>
                    <input
                      ref={cabeceraRef}
                      type="checkbox"
                      className={styles.nativo}
                      checked={todosSeleccionados}
                      onChange={(evento) => cambiarTodos(evento.target.checked)}
                      aria-label="Seleccionar todas las filas"
                    />
                  </th>
                )}

                {columnasFinales.map((columna) => {
                  const esOrdenable = columna.sortable || columna.ordenable;
                  const activo = ordenActual?.key === columna.key;
                  const direccion = activo ? ordenActual.dir : undefined;

                  return (
                    <th
                      key={columna.key}
                      scope="col"
                      aria-sort={
                        activo
                          ? direccion === 'desc'
                            ? 'descending'
                            : 'ascending'
                          : undefined
                      }
                      className={cx(
                        styles.celda,
                        styles.cabecera,
                        (columna.align === 'right' || columna.align === 'derecha') &&
                          styles.derecha
                      )}
                      style={columna.width !== undefined ? { width: columna.width } : undefined}
                    >
                      {esOrdenable ? (
                        <button
                          type="button"
                          className={cx(styles.orden, activo && styles.ordenActivo)}
                          onClick={() => alternarOrden(columna)}
                          aria-label={`Ordenar por ${columna.header}`}
                        >
                          <span>{columna.header}</span>
                          <Icon
                            name="chevron-down"
                            size={14}
                            className={cx(
                              styles.flecha,
                              direccion === 'asc' && styles.flechaArriba
                            )}
                          />
                        </button>
                      ) : (
                        columna.header
                      )}
                    </th>
                  );
                })}

                {obtenerAcciones && (
                  <th scope="col" className={cx(styles.celda, styles.cabecera, styles.columnaAcciones)}>
                    <span className={styles.oculto}>Acciones</span>
                  </th>
                )}
              </tr>
            </thead>

            <tbody>
              {filas.map((fila, indice) => {
                const id = obtenerId(fila, indice);
                const itemsAccion = obtenerAcciones?.(fila, indice) ?? [];

                return (
                  <tr
                    key={id}
                    className={cx(
                      styles.fila,
                      onRowClick && styles.filaClicable,
                      seleccionados.has(id) && styles.filaSeleccionada
                    )}
                    aria-selected={esSeleccionable ? seleccionados.has(id) : undefined}
                    tabIndex={onRowClick ? 0 : undefined}
                    onClick={onRowClick ? (evento) => onRowClick(fila, indice, evento) : undefined}
                    onKeyDown={
                      onRowClick ? (evento) => manejarTecladoFila(evento, fila, indice) : undefined
                    }
                  >
                    {esSeleccionable && (
                      <td
                        className={cx(styles.celda, styles.seleccion)}
                        data-label="Seleccionar"
                        onClick={(evento) => evento.stopPropagation()}
                      >
                        <Checkbox
                          checked={seleccionados.has(id)}
                          onChange={(evento) => cambiarSeleccion(id, evento.target.checked)}
                          aria-label={`Seleccionar fila ${indice + 1}`}
                        />
                      </td>
                    )}

                    {columnasFinales.map((columna) => {
                      const esNumerica =
                        columna.align === 'right' || columna.align === 'derecha';

                      return (
                        <td
                          key={columna.key}
                          className={cx(
                            styles.celda,
                            esNumerica && styles.derecha,
                            esNumerica && styles.tabular
                          )}
                          data-label={columna.header}
                        >
                          {contenidoCelda(columna, fila, indice)}
                        </td>
                      );
                    })}

                    {obtenerAcciones && (
                      <td
                        className={cx(styles.celda, styles.columnaAcciones)}
                        data-label="Acciones"
                        onClick={(evento) => evento.stopPropagation()}
                      >
                        {itemsAccion.length > 0 && (
                          <Dropdown
                            items={itemsAccion}
                            disparador={
                              <IconButton
                                icon="menu"
                                size="sm"
                                ariaLabel={`Acciones de la fila ${indice + 1}`}
                              />
                            }
                          />
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>

            {(footer ?? pie) && (
              <tfoot className={styles.pieTabla}>
                <tr>
                  <td colSpan={colSpan} className={styles.celdaPie}>
                    {footer ?? pie}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      )}
    </div>
  );
}

export default DataTable;

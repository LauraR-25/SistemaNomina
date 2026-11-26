import { Button } from '../../ui/Button/Button.jsx';
import { Select } from '../../forms/Select/Select.jsx';
import cx from '../../../../utils/cx.js';
import styles from './Pagination.module.css';

const TAMANOS = [5, 10, 20, 50, 100];

export function Pagination({
  page,
  pagina,
  total = 0,
  pageSize,
  tamPagina,
  perPage,
  onChange,
  onPageChange,
  onPageSizeChange,
  onTamPaginaChange,
  pageSizeOptions = TAMANOS,
  showSizeSelector = true,
  showRange = true,
  className,
  ...props
}) {
  const numeroTotal = Math.max(0, Number(total) || 0);
  const tamanio = Math.max(1, Number(pageSize ?? tamPagina ?? perPage) || 10);
  const paginaActual = Math.max(1, Number(page ?? pagina) || 1);
  const totalPaginas = Math.max(1, Math.ceil(numeroTotal / tamanio));
  const paginaSegura = Math.min(paginaActual, totalPaginas);
  const inicio = numeroTotal === 0 ? 0 : (paginaSegura - 1) * tamanio + 1;
  const fin = Math.min(paginaSegura * tamanio, numeroTotal);
  const cambiarPagina = onChange ?? onPageChange;
  const cambiarTamano = onPageSizeChange ?? onTamPaginaChange;
  const opciones = pageSizeOptions.map((opcion) => ({
    value: String(opcion),
    label: String(opcion),
  }));

  function irAPagina(destino) {
    if (!cambiarPagina) return;

    const destinoSeguro = Math.min(Math.max(1, destino), totalPaginas);
    if (destinoSeguro !== paginaSegura) cambiarPagina(destinoSeguro);
  }

  return (
    <nav
      className={cx(styles.paginacion, className)}
      aria-label="Paginación de resultados"
      {...props}
    >
      {showRange && (
        <p className={styles.rango} aria-live="polite">
          Mostrando <span className="tabular">{inicio}</span>–
          <span className="tabular">{fin}</span> de{' '}
          <span className="tabular">{numeroTotal}</span>
        </p>
      )}

      <div className={styles.controles}>
        {showSizeSelector && (
          <label className={styles.tamano}>
            <span>Filas por página</span>
            <Select
              size="sm"
              fullWidth={false}
              options={opciones}
              value={String(tamanio)}
              onChange={(evento) => cambiarTamano?.(Number(evento.target.value))}
              aria-label="Filas por página"
              className={styles.select}
            />
          </label>
        )}

        <span className={styles.indicador} aria-live="polite">
          Página <span className="tabular">{paginaSegura}</span> de{' '}
          <span className="tabular">{totalPaginas}</span>
        </span>

        <div className={styles.botones}>
          <Button
            variant="secondary"
            size="sm"
            iconLeft="chevron-left"
            aria-label="Ir a la página anterior"
            disabled={paginaSegura <= 1}
            onClick={() => irAPagina(paginaSegura - 1)}
          />
          <Button
            variant="secondary"
            size="sm"
            iconRight="chevron-right"
            aria-label="Ir a la página siguiente"
            disabled={paginaSegura >= totalPaginas}
            onClick={() => irAPagina(paginaSegura + 1)}
          />
        </div>
      </div>
    </nav>
  );
}

export default Pagination;

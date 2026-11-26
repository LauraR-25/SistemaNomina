import { Button } from '../../ui/Button/Button.jsx';
import { FilterBar } from '../../forms/FilterBar/FilterBar.jsx';
import cx from '../../../../utils/cx.js';
import styles from './Toolbar.module.css';

export function Toolbar({
  search,
  busqueda,
  filters,
  filtros,
  children,
  actions,
  acciones,
  onCreate,
  onCrear,
  createLabel = 'Crear',
  onExport,
  onExportar,
  exportLabel = 'Exportar',
  ariaLabel = 'Barra de herramientas',
  className,
  ...props
}) {
  const crear = onCreate ?? onCrear;
  const exportar = onExport ?? onExportar;
  const botones =
    actions ??
    acciones ??
    [
      crear && (
        <Button key="crear" iconLeft="plus" onClick={crear}>
          {createLabel}
        </Button>
      ),
      exportar && (
        <Button key="exportar" variant="secondary" iconLeft="download" onClick={exportar}>
          {exportLabel}
        </Button>
      ),
    ].filter(Boolean);

  return (
    <div
      className={cx(styles.barra, className)}
      role="toolbar"
      aria-label={ariaLabel}
      {...props}
    >
      <FilterBar search={search} busqueda={busqueda} className={styles.filtros}>
        {filters ?? filtros ?? children}
      </FilterBar>

      {botones && <div className={styles.acciones}>{botones}</div>}
    </div>
  );
}

export default Toolbar;

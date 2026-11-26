import { useEffect, useMemo, useState } from 'react';
import { TablaBancos } from '../../components/catalogos-tenant/TablaBancos/index.js';
import {
  PageHeader,
  Pagination,
  SearchInput,
  Select,
  Toolbar,
} from '../../components/common/index.js';
import { useCatalogos } from '../../hooks/catalogos-tenant/useCatalogos.js';
import { useTablaControles } from '../../hooks/ui/useTablaControles.js';
import {
  crearModeloBancosPage,
  establecerBancosModelo,
} from './bancosPage.model.js';
import styles from './BancosPage.module.css';

const FILTROS_ESTADO = [
  { value: 'ACTIVO', label: 'Activos' },
  { value: 'INACTIVO', label: 'Inactivos' },
];

export function BancosPage({ onNavegar }) {
  const [filtroEstado, setFiltroEstado] = useState('');
  const {
    bancos,
    loading,
    error,
    cargarCatalogos,
  } = useCatalogos();
  const modelo = useMemo(
    () => establecerBancosModelo(crearModeloBancosPage(), bancos),
    [bancos]
  );

  useEffect(() => {
    cargarCatalogos();
  }, [cargarCatalogos]);

  const registros = useMemo(() => {
    if (!filtroEstado) return modelo.bancos;

    return modelo.bancos.filter((banco) =>
      filtroEstado === 'ACTIVO' ? banco.activo !== false : banco.activo === false
    );
  }, [filtroEstado, modelo.bancos]);

  const tabla = useTablaControles(registros, {
    campos: ['codigo', 'nombre'],
  });

  return (
    <div className={styles.pagina}>
      <PageHeader
        titulo={modelo.titulo}
        descripcion="Consulta el catálogo de bancos disponible para las cuentas bancarias."
        breadcrumbs={[
          {
            label: 'Catálogos',
            onClick: onNavegar ? () => onNavegar('/catalogos') : undefined,
          },
          { label: 'Bancos' },
        ]}
        badge={{ etiqueta: 'Solo lectura', variante: 'info' }}
      />

      <Toolbar
        search={
          <SearchInput
            value={tabla.busqueda}
            onValueChange={tabla.setBusqueda}
            placeholder="Buscar por código o nombre"
            ariaLabel="Buscar bancos"
          />
        }
        filters={
          <Select
            size="sm"
            value={filtroEstado}
            onChange={(evento) => setFiltroEstado(evento.target.value)}
            options={FILTROS_ESTADO}
            placeholder="Todos los estados"
            aria-label="Filtrar bancos por estado"
          />
        }
      />

      <div className={styles.contenido}>
        <TablaBancos
          filas={tabla.filasVisibles}
          loading={loading}
          error={error}
          onRetry={cargarCatalogos}
          orden={{ key: tabla.orden.campo, dir: tabla.orden.direccion }}
          onSort={({ key }) => tabla.cambiarOrden(key)}
        />

        <Pagination
          page={tabla.pagina}
          total={tabla.total}
          pageSize={tabla.tamPagina}
          onChange={tabla.setPagina}
          onPageSizeChange={tabla.setTamPagina}
        />
      </div>
    </div>
  );
}

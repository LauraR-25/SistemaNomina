import { useEffect } from 'react';
import { Icon } from '../../assets/icons/Icon.jsx';
import { BarChart } from '../../components/common/charts/BarChart/index.js';
import { DonutChart } from '../../components/common/charts/DonutChart/index.js';
import { EmptyState } from '../../components/common/data/EmptyState/index.js';
import { Skeleton } from '../../components/common/feedback/Skeleton/index.js';
import { PageHeader } from '../../components/common/page/PageHeader/index.js';
import { PageSection } from '../../components/common/page/PageSection/index.js';
import { StatCard } from '../../components/common/ui/StatCard/index.js';
import { useAuth } from '../../hooks/auth-rbac/useAuth.js';
import { useCatalogos } from '../../hooks/catalogos-tenant/useCatalogos.js';
import { usePersonas } from '../../hooks/rrhh-contratos/usePersonas.js';
import { usePeriodos } from '../../hooks/nomina-recibos/usePeriodos.js';
import { usePrestamos } from '../../hooks/prestamos/usePrestamos.js';
import {
  agruparPorEstado,
  crearIndicadores,
  obtenerAccesosRapidos,
  obtenerNombreEmpresa,
  obtenerNombreUsuario,
} from './dashboardPage.model.js';
import styles from './DashboardPage.module.css';

export function DashboardPage({ onNavegar }) {
  const { sesion } = useAuth();
  const empresaId = sesion?.empresa?.id ?? null;

  const {
    bancos,
    loading: cargandoCatalogos,
    cargarCatalogos,
  } = useCatalogos();
  const {
    personas,
    loading: cargandoPersonas,
    cargarPersonas,
  } = usePersonas(empresaId);
  const {
    periodos,
    loading: cargandoPeriodos,
    cargarPeriodos,
  } = usePeriodos(empresaId);
  const {
    prestamos,
    loading: cargandoPrestamos,
    cargarPrestamos,
  } = usePrestamos(empresaId);

  useEffect(() => {
    cargarCatalogos();
  }, [cargarCatalogos]);

  useEffect(() => {
    cargarPersonas();
  }, [cargarPersonas]);

  useEffect(() => {
    cargarPeriodos();
  }, [cargarPeriodos]);

  useEffect(() => {
    cargarPrestamos();
  }, [cargarPrestamos]);

  const nombreUsuario = obtenerNombreUsuario(sesion);
  const nombreEmpresa = obtenerNombreEmpresa(sesion);
  const indicadores = crearIndicadores({
    personas,
    periodos,
    prestamos,
    bancos,
    cargando: {
      catalogos: cargandoCatalogos,
      personas: cargandoPersonas,
      periodos: cargandoPeriodos,
      prestamos: cargandoPrestamos,
    },
  });
  const personasPorEstado = agruparPorEstado(personas);
  const prestamosPorEstado = agruparPorEstado(prestamos);
  const accesos = obtenerAccesosRapidos(sesion);

  return (
    <div className={styles.pagina}>
      <PageHeader
        titulo={`Bienvenido, ${nombreUsuario}`}
        descripcion={
          nombreEmpresa
            ? `Empresa: ${nombreEmpresa}`
            : 'No hay una empresa asociada a la sesión.'
        }
      />

      <div className={styles.indicadores}>
        {indicadores.map((indicador) => (
          <StatCard
            key={indicador.id}
            titulo={indicador.titulo}
            valor={indicador.valor}
            icono={indicador.icono}
            loading={indicador.loading}
          />
        ))}
      </div>

      <div className={styles.graficos}>
        <PageSection
          titulo="Personas por estado"
          descripcion="Distribución de las personas registradas."
        >
          {cargandoPersonas ? (
            <Skeleton variant="rect" height={200} />
          ) : personasPorEstado.length > 0 ? (
            <DonutChart
              data={personasPorEstado}
              height={200}
              ariaLabel="Distribución de personas por estado"
            />
          ) : (
            <EmptyState
              compact
              image={false}
              titulo="Sin datos"
              mensaje="No hay personas registradas para mostrar en el gráfico."
            />
          )}
        </PageSection>

        <PageSection
          titulo="Préstamos por estado"
          descripcion="Distribución de los préstamos registrados."
        >
          {cargandoPrestamos ? (
            <Skeleton variant="rect" height={200} />
          ) : prestamosPorEstado.length > 0 ? (
            <BarChart
              data={prestamosPorEstado}
              height={240}
              ariaLabel="Distribución de préstamos por estado"
            />
          ) : (
            <EmptyState
              compact
              image={false}
              titulo="Sin datos"
              mensaje="No hay préstamos registrados para mostrar en el gráfico."
            />
          )}
        </PageSection>
      </div>

      <PageSection
        titulo="Accesos rápidos"
        descripcion="Módulos habilitados para tu usuario."
      >
        {accesos.length > 0 ? (
          <div className={styles.accesos}>
            {accesos.map((acceso) => (
              <button
                key={acceso.id}
                type="button"
                className={styles.acceso}
                onClick={() => onNavegar?.(acceso.ruta)}
              >
                <span className={styles.iconoAcceso} aria-hidden="true">
                  <Icon name={acceso.icono} size={20} />
                </span>
                <span className={styles.textoAcceso}>
                  <strong>{acceso.etiqueta}</strong>
                  {acceso.descripcion && (
                    <small>{acceso.descripcion}</small>
                  )}
                </span>
                <Icon
                  name="chevron-right"
                  size={16}
                  className={styles.flechaAcceso}
                />
              </button>
            ))}
          </div>
        ) : (
          <EmptyState
            compact
            image={false}
            titulo="Sin accesos disponibles"
            mensaje="Tu usuario no tiene módulos habilitados en este momento."
          />
        )}
      </PageSection>

      <PageSection titulo="Actividad reciente">
        <EmptyState
          compact
          image={false}
          titulo="Próximamente"
          mensaje="Aquí podrás consultar los movimientos recientes de tu empresa."
        />
      </PageSection>
    </div>
  );
}

export default DashboardPage;

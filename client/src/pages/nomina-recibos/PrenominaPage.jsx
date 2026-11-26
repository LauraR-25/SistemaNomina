import { useEffect, useMemo, useRef, useState } from 'react';
import { ProcesarNominaDialog } from '../../components/nomina-recibos/ProcesarNominaDialog/index.js';
import { ResumenPrenomina } from '../../components/nomina-recibos/ResumenPrenomina/index.js';
import { TablaPrenomina } from '../../components/nomina-recibos/TablaPrenomina/index.js';
import {
  etiquetaPeriodo,
  monedaDe,
} from '../../components/nomina-recibos/nominaRecibos.helpers.js';
import {
  Button,
  EmptyState,
  PageHeader,
  Pagination,
  SearchInput,
  Select,
  Toolbar,
} from '../../components/common/index.js';
import { useAuth } from '../../hooks/auth-rbac/useAuth.js';
import { usePeriodos } from '../../hooks/nomina-recibos/usePeriodos.js';
import { usePrenomina } from '../../hooks/nomina-recibos/usePrenomina.js';
import { usePersonas } from '../../hooks/rrhh-contratos/usePersonas.js';
import { useNotificacion } from '../../hooks/ui/useNotificacion.js';
import { useTablaControles } from '../../hooks/ui/useTablaControles.js';
import {
  actualizarPrenominaModelo,
  crearModeloPrenominaPage,
  generarPrenominaLocal,
} from './prenominaPage.model.js';
import styles from './PrenominaPage.module.css';

export function PrenominaPage({ onNavegar }) {
  const { notificar } = useNotificacion();
  const { empresa } = useAuth();
  const { periodos, cargarPeriodos } = usePeriodos(empresa?.id);
  const { personas, cargarPersonas } = usePersonas(empresa?.id);
  const { loading, error, cargarPrenomina } = usePrenomina();
  const [periodoId, setPeriodoId] = useState(
    () => sessionStorage.getItem('periodoActivoId') ?? ''
  );
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [procesando, setProcesando] = useState(false);
  const temporizador = useRef(null);

  useEffect(() => {
    cargarPeriodos();
    cargarPersonas();
  }, [cargarPeriodos, cargarPersonas]);

  useEffect(
    () => () => window.clearTimeout(temporizador.current),
    []
  );

  const { periodoActivo, periodoIdValido } = useMemo(() => {
    const periodo =
      periodos.find(
        (item) => String(item.id) === String(periodoId)
      ) ?? periodos[0] ?? null;

    return {
      periodoActivo: periodo,
      periodoIdValido: periodo ? String(periodo.id) : periodoId,
    };
  }, [periodos, periodoId]);

  const filasGeneradas = useMemo(
    () =>
      periodoActivo
        ? generarPrenominaLocal(periodoActivo, [], personas)
        : [],
    [periodoActivo, personas]
  );

  const modeloPagina = useMemo(() => {
    const ejecucion = periodoActivo
      ? periodoActivo.ejecucion ?? {
          estado: 'CALCULADA',
          numero_ejecucion: 1,
        }
      : null;

    return actualizarPrenominaModelo(
      crearModeloPrenominaPage(),
      filasGeneradas,
      ejecucion
    );
  }, [filasGeneradas, periodoActivo]);

  const tabla = useTablaControles(filasGeneradas, {
    campos: ['nombre', 'empleado.cedula', 'asignaciones', 'deducciones', 'neto'],
  });

  const moneda = monedaDe(empresa);

  function cambiarPeriodo(id) {
    setPeriodoId(id);
    sessionStorage.setItem('periodoActivoId', id);
    tabla.setPagina(1);
    tabla.setBusqueda('');
  }

  function procesarNomina() {
    setProcesando(true);
    temporizador.current = window.setTimeout(() => {
      setProcesando(false);
      setDialogoAbierto(false);
      notificar({
        tipo: 'info',
        titulo: 'Nómina procesada localmente',
        mensaje: 'El endpoint para procesar la nómina aún está pendiente.',
      });
    }, 900);
  }

  const opcionesPeriodos = periodos.map((periodo) => ({
    value: String(periodo.id),
    label: etiquetaPeriodo(periodo),
  }));

  return (
    <div className={styles.pagina}>
      <PageHeader
        titulo={modeloPagina.titulo}
        descripcion="Revisa el cálculo de asignaciones, deducciones y neto antes de procesar la nómina."
        breadcrumbs={[
          {
            label: 'Nómina',
            onClick: onNavegar ? () => onNavegar('/nomina') : undefined,
          },
          { label: 'Prenómina' },
        ]}
        badge={{ etiqueta: 'Cálculo local', variante: 'warning' }}
        actions={
          <Button
            iconLeft="clipboard"
            disabled={
              !periodoActivo || filasGeneradas.length === 0 || procesando
            }
            loading={procesando}
            onClick={() => setDialogoAbierto(true)}
          >
            Procesar nómina
          </Button>
        }
      />

      <Toolbar
        search={
          <SearchInput
            value={tabla.busqueda}
            onValueChange={tabla.setBusqueda}
            placeholder="Buscar por empleado o monto"
            ariaLabel="Buscar en la prenómina"
          />
        }
        filters={
          <Select
            size="sm"
            value={periodoIdValido}
            onChange={(evento) => cambiarPeriodo(evento.target.value)}
            options={opcionesPeriodos}
            placeholder="Seleccione un período"
            aria-label="Seleccionar período de nómina"
          />
        }
      />

      {filasGeneradas.length === 0 ? (
        <EmptyState
          titulo="Selecciona un período para ver su prenómina"
          mensaje="El cálculo se muestra localmente mientras el endpoint de prenómina está pendiente."
          image={false}
        />
      ) : (
        <div className={styles.contenido}>
          <ResumenPrenomina
            filas={filasGeneradas}
            resumen={modeloPagina.resumen}
            ejecucion={modeloPagina.ejecucion}
            moneda={moneda}
            loading={loading}
          />

          <TablaPrenomina
            filas={tabla.filasVisibles}
            totales={modeloPagina.resumen}
            moneda={moneda}
            loading={loading}
            error={error}
            onRetry={() => cargarPrenomina(filasGeneradas)}
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
      )}

      <ProcesarNominaDialog
        abierto={dialogoAbierto}
        periodo={periodoActivo}
        empleados={filasGeneradas.length}
        netoTotal={modeloPagina.resumen.totalNeto}
        moneda={moneda}
        procesando={procesando}
        onConfirmar={procesarNomina}
        onCancelar={() => setDialogoAbierto(false)}
      />
    </div>
  );
}

export default PrenominaPage;

import { useEffect, useMemo, useState } from 'react';
import { ReciboDetalle } from '../../components/nomina-recibos/ReciboDetalle.jsx';
import { TablaRecibos } from '../../components/nomina-recibos/TablaRecibos/index.js';
import {
  etiquetaPeriodo,
  monedaDe,
} from '../../components/nomina-recibos/nominaRecibos.helpers.js';
import {
  EmptyState,
  Modal,
  PageHeader,
  Pagination,
  SearchInput,
  Select,
  Toolbar,
} from '../../components/common/index.js';
import { useAuth } from '../../hooks/auth-rbac/useAuth.js';
import { usePeriodos } from '../../hooks/nomina-recibos/usePeriodos.js';
import { useRecibos } from '../../hooks/nomina-recibos/useRecibos.js';
import { usePersonas } from '../../hooks/rrhh-contratos/usePersonas.js';
import { useNotificacion } from '../../hooks/ui/useNotificacion.js';
import { useTablaControles } from '../../hooks/ui/useTablaControles.js';
import {
  crearModeloRecibosPage,
  establecerRecibosModelo,
  generarRecibosLocales,
  seleccionarReciboModelo,
} from './recibosPage.model.js';
import modelo from './recibosPage.model.js';
import styles from './RecibosPage.module.css';

export {
  crearModeloRecibosPage,
  establecerRecibosModelo,
  seleccionarReciboModelo,
} from './recibosPage.model.js';

const FILTROS_ESTADO = [
  { value: 'PENDIENTE', label: 'Pendientes' },
  { value: 'PAGADO', label: 'Pagados' },
  { value: 'ANULADO', label: 'Anulados' },
];

export function RecibosPage({ onNavegar }) {
  const { notificar } = useNotificacion();
  const { empresa } = useAuth();
  const { periodos, cargarPeriodos } = usePeriodos(empresa?.id);
  const { personas, cargarPersonas } = usePersonas(empresa?.id);
  const { reciboSeleccionado, seleccionarRecibo, limpiarRecibo } =
    useRecibos();
  const [modeloPagina, setModelo] = useState(() => crearModeloRecibosPage());
  const [filtroPeriodo, setFiltroPeriodo] = useState(
    () => sessionStorage.getItem('periodoActivoId') ?? ''
  );
  const [filtroEstado, setFiltroEstado] = useState('');
  const [avisoLocal, setAvisoLocal] = useState(false);

  useEffect(() => {
    cargarPeriodos();
    cargarPersonas();
  }, [cargarPeriodos, cargarPersonas]);

  useEffect(() => {
    if (periodos.length === 0) return;
    if (
      !periodos.some(
        (periodo) => String(periodo.id) === String(filtroPeriodo)
      )
    ) {
      setFiltroPeriodo(String(periodos[0].id));
    }
  }, [periodos, filtroPeriodo]);

  const periodoActivo = useMemo(
    () =>
      periodos.find(
        (periodo) => String(periodo.id) === String(filtroPeriodo)
      ) ?? null,
    [periodos, filtroPeriodo]
  );

  const recibosGenerados = useMemo(
    () => (periodoActivo ? generarRecibosLocales(periodoActivo, personas) : []),
    [periodoActivo, personas]
  );

  useEffect(() => {
    limpiarRecibo();
    setModelo((actual) =>
      seleccionarReciboModelo(
        establecerRecibosModelo(actual, recibosGenerados),
        null
      )
    );
  }, [recibosGenerados, limpiarRecibo]);

  useEffect(() => {
    if (avisoLocal || recibosGenerados.length === 0) return;

    notificar({
      tipo: 'info',
      titulo: 'Recibos generados localmente',
      mensaje: 'El endpoint de recibos aún está pendiente.',
    });
    setAvisoLocal(true);
  }, [recibosGenerados.length, avisoLocal, notificar]);

  const registros = useMemo(() => {
    return modeloPagina.recibos.filter((recibo) => {
      const coincidePeriodo =
        !filtroPeriodo || String(recibo.periodo_id) === String(filtroPeriodo);
      const coincideEstado =
        !filtroEstado || recibo.estado === filtroEstado;

      return coincidePeriodo && coincideEstado;
    });
  }, [modeloPagina.recibos, filtroPeriodo, filtroEstado]);

  const tabla = useTablaControles(registros, {
    campos: [
      'nombre',
      'empleado.cedula',
      'persona.cedula',
      'periodo_id',
      'metodo_pago',
      'estado',
    ],
  });

  const moneda = monedaDe(empresa);

  function cambiarPeriodo(id) {
    setFiltroPeriodo(id);
    sessionStorage.setItem('periodoActivoId', id);
    tabla.setPagina(1);
    tabla.setBusqueda('');
  }

  function abrirRecibo(recibo) {
    seleccionarRecibo(recibo);
    setModelo((actual) => seleccionarReciboModelo(actual, recibo));
  }

  function cerrarRecibo() {
    limpiarRecibo();
    setModelo((actual) => seleccionarReciboModelo(actual, null));
  }

  const opcionesPeriodos = periodos.map((periodo) => ({
    value: String(periodo.id),
    label: etiquetaPeriodo(periodo),
  }));

  return (
    <div className={styles.pagina}>
      <PageHeader
        titulo={modeloPagina.titulo}
        descripcion="Consulta los comprobantes de pago, su método y su estado por período."
        breadcrumbs={[
          {
            label: 'Nómina',
            onClick: onNavegar ? () => onNavegar('/nomina') : undefined,
          },
          { label: 'Recibos' },
        ]}
        badge={{ etiqueta: 'Datos locales', variante: 'warning' }}
      />

      <Toolbar
        search={
          <SearchInput
            value={tabla.busqueda}
            onValueChange={tabla.setBusqueda}
            placeholder="Buscar por empleado, método o estado"
            ariaLabel="Buscar recibos"
          />
        }
        filters={
          <>
            <Select
              size="sm"
              value={filtroPeriodo}
              onChange={(evento) => cambiarPeriodo(evento.target.value)}
              options={opcionesPeriodos}
              placeholder="Seleccione un período"
              aria-label="Filtrar recibos por período"
            />
            <Select
              size="sm"
              value={filtroEstado}
              onChange={(evento) => setFiltroEstado(evento.target.value)}
              options={FILTROS_ESTADO}
              placeholder="Todos los estados"
              aria-label="Filtrar recibos por estado"
            />
          </>
        }
      />

      <div className={styles.contenido}>
        {registros.length === 0 ? (
          <EmptyState
            titulo="Sin recibos para mostrar"
            mensaje="No hay recibos que coincidan con los filtros seleccionados."
            image={false}
          />
        ) : (
          <>
            <TablaRecibos
              filas={tabla.filasVisibles}
              periodos={periodos}
              moneda={moneda}
              onVer={abrirRecibo}
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
          </>
        )}
      </div>

      <Modal
        abierto={Boolean(reciboSeleccionado)}
        onClose={cerrarRecibo}
        titulo="Detalle del recibo"
        descripcion="Documento de pago del empleado seleccionado."
        size="lg"
      >
        {reciboSeleccionado && (
          <ReciboDetalle
            recibo={reciboSeleccionado}
            empresa={empresa}
            periodo={periodoActivo}
            moneda={moneda}
          />
        )}
      </Modal>
    </div>
  );
}

export default modelo;

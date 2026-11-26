import { useEffect, useMemo, useRef, useState } from 'react';
import { ReciboDetalle } from '../../components/nomina-recibos/ReciboDetalle/index.js';
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
import styles from './RecibosPage.module.css';

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
  const modeloBase = useMemo(() => crearModeloRecibosPage(), []);
  const [filtroPeriodo, setFiltroPeriodo] = useState(
    () => sessionStorage.getItem('periodoActivoId') ?? ''
  );
  const [filtroEstado, setFiltroEstado] = useState('');
  const avisoLocal = useRef(false);

  useEffect(() => {
    cargarPeriodos();
    cargarPersonas();
  }, [cargarPeriodos, cargarPersonas]);

  const { periodoActivo, filtroPeriodoValido } = useMemo(() => {
    const periodo =
      periodos.find(
        (item) => String(item.id) === String(filtroPeriodo)
      ) ?? periodos[0] ?? null;

    return {
      periodoActivo: periodo,
      filtroPeriodoValido: periodo ? String(periodo.id) : filtroPeriodo,
    };
  }, [periodos, filtroPeriodo]);

  const recibosGenerados = useMemo(
    () => (periodoActivo ? generarRecibosLocales(periodoActivo, personas) : []),
    [periodoActivo, personas]
  );

  const modeloPagina = useMemo(
    () =>
      seleccionarReciboModelo(
        establecerRecibosModelo(modeloBase, recibosGenerados),
        reciboSeleccionado
      ),
    [modeloBase, recibosGenerados, reciboSeleccionado]
  );

  useEffect(() => {
    limpiarRecibo();
  }, [recibosGenerados, limpiarRecibo]);

  useEffect(() => {
    if (avisoLocal.current || recibosGenerados.length === 0) return;

    avisoLocal.current = true;
    notificar({
      tipo: 'info',
      titulo: 'Recibos generados localmente',
      mensaje: 'El endpoint de recibos aún está pendiente.',
    });
  }, [recibosGenerados.length, notificar]);

  const registros = useMemo(() => {
    return modeloPagina.recibos.filter((recibo) => {
      const coincidePeriodo =
        !filtroPeriodoValido ||
        String(recibo.periodo_id) === String(filtroPeriodoValido);
      const coincideEstado =
        !filtroEstado || recibo.estado === filtroEstado;

      return coincidePeriodo && coincideEstado;
    });
  }, [modeloPagina.recibos, filtroPeriodoValido, filtroEstado]);

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
  }

  function cerrarRecibo() {
    limpiarRecibo();
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
              value={filtroPeriodoValido}
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

export default RecibosPage;

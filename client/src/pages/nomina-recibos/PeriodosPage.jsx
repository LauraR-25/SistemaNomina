import { useEffect, useMemo, useState } from 'react';
import { CicloPeriodoStepper } from '../../components/nomina-recibos/CicloPeriodoStepper/index.js';
import { PeriodoForm } from '../../components/nomina-recibos/PeriodoForm/index.js';
import { TablaPeriodos } from '../../components/nomina-recibos/TablaPeriodos/index.js';
import { etiquetaPeriodo } from '../../components/nomina-recibos/nominaRecibos.helpers.js';
import {
  Badge,
  Button,
  ConfirmDialog,
  Modal,
  PageHeader,
  Pagination,
  SearchInput,
  Select,
  StatusBadge,
  Toolbar,
} from '../../components/common/index.js';
import { useAuth } from '../../hooks/auth-rbac/useAuth.js';
import { usePeriodos } from '../../hooks/nomina-recibos/usePeriodos.js';
import { useNotificacion } from '../../hooks/ui/useNotificacion.js';
import { useTablaControles } from '../../hooks/ui/useTablaControles.js';
import { formatFecha } from '../../utils/formatters.js';
import {
  actualizarPeriodoModelo,
  agregarPeriodoModelo,
  anularPeriodoModelo,
  crearModeloPeriodosPage,
  establecerPeriodosModelo,
} from './periodosPage.model.js';
import modelo from './periodosPage.model.js';
import styles from './PeriodosPage.module.css';

export {
  crearModeloPeriodosPage,
  establecerPeriodosModelo,
  agregarPeriodoModelo,
  actualizarPeriodoModelo,
  anularPeriodoModelo,
} from './periodosPage.model.js';

const FILTROS_ESTADO = [
  { value: 'BORRADOR', label: 'Borradores' },
  { value: 'PRENOMINA', label: 'En prenómina' },
  { value: 'PROCESADO', label: 'Procesados' },
  { value: 'PAGADO', label: 'Pagados' },
  { value: 'ANULADO', label: 'Anulados' },
];

export function PeriodosPage({ onNavegar }) {
  const { notificar } = useNotificacion();
  const { empresa } = useAuth();
  const { periodos, loading, error, cargarPeriodos } = usePeriodos(
    empresa?.id
  );
  const [modeloPagina, setModelo] = useState(() => crearModeloPeriodosPage());
  const [filtroEstado, setFiltroEstado] = useState('');
  const [modal, setModal] = useState({ abierto: false, registro: null });
  const [detalle, setDetalle] = useState(null);
  const [confirmacion, setConfirmacion] = useState(null);

  useEffect(() => {
    cargarPeriodos();
  }, [cargarPeriodos]);

  useEffect(() => {
    if (periodos.length > 0 && modeloPagina.periodos.length === 0) {
      setModelo((actual) => establecerPeriodosModelo(actual, periodos));
    }
  }, [periodos, modeloPagina.periodos.length]);

  const fuentePeriodos =
    modeloPagina.periodos.length > 0 ? modeloPagina.periodos : periodos;

  const registros = useMemo(() => {
    if (!filtroEstado) return fuentePeriodos;

    return fuentePeriodos.filter(
      (periodo) => periodo.estado === filtroEstado
    );
  }, [filtroEstado, fuentePeriodos]);

  const tabla = useTablaControles(registros, {
    campos: ['descripcion', 'frecuencia', 'estado', 'fecha_inicio', 'fecha_fin'],
  });

  async function recargar() {
    setModelo((actual) => establecerPeriodosModelo(actual, []));
    await cargarPeriodos();
  }

  function abrirNuevo() {
    setModal({ abierto: true, registro: null });
  }

  function abrirEditar(registro) {
    setModal({ abierto: true, registro });
  }

  function cerrarModal() {
    setModal({ abierto: false, registro: null });
  }

  function guardar(datos) {
    if (modal.registro) {
      setModelo((actual) =>
        actualizarPeriodoModelo(actual, {
          ...datos,
          id: modal.registro.id,
        })
      );
      cerrarModal();
      notificar({
        tipo: 'info',
        titulo: 'Período actualizado localmente',
        mensaje: 'El endpoint para actualizar períodos aún está pendiente.',
      });
      return;
    }

    setModelo((actual) => agregarPeriodoModelo(actual, datos));
    cerrarModal();
    notificar({
      tipo: 'info',
      titulo: 'Período registrado localmente',
      mensaje: 'El endpoint para crear períodos aún está pendiente.',
    });
  }

  function confirmarAnulacion() {
    setModelo((actual) => anularPeriodoModelo(actual, confirmacion.id));
    setConfirmacion(null);
    notificar({
      tipo: 'info',
      titulo: 'Período anulado localmente',
      mensaje: 'El endpoint para anular períodos aún está pendiente.',
    });
  }

  function irAPrenomina(periodo) {
    sessionStorage.setItem('periodoActivoId', String(periodo.id));
    onNavegar?.({ ruta: '/nomina', subruta: 'prenomina' });
  }

  function irARecibos(periodo) {
    sessionStorage.setItem('periodoActivoId', String(periodo.id));
    onNavegar?.({ ruta: '/nomina', subruta: 'recibos' });
  }

  return (
    <div className={styles.pagina}>
      <PageHeader
        titulo={modeloPagina.titulo}
        descripcion="Planifica, controla y da seguimiento a los períodos de pago de nómina."
        breadcrumbs={[
          {
            label: 'Nómina',
            onClick: onNavegar ? () => onNavegar('/nomina') : undefined,
          },
          { label: 'Períodos' },
        ]}
        badge={{ etiqueta: 'Escrituras locales', variante: 'warning' }}
        actions={
          <Button iconLeft="plus" onClick={abrirNuevo}>
            Nuevo período
          </Button>
        }
      />

      <Toolbar
        search={
          <SearchInput
            value={tabla.busqueda}
            onValueChange={tabla.setBusqueda}
            placeholder="Buscar por descripción, frecuencia o estado"
            ariaLabel="Buscar períodos"
          />
        }
        filters={
          <Select
            size="sm"
            value={filtroEstado}
            onChange={(evento) => setFiltroEstado(evento.target.value)}
            options={FILTROS_ESTADO}
            placeholder="Todos los estados"
            aria-label="Filtrar períodos por estado"
          />
        }
      />

      <div className={styles.contenido}>
        <TablaPeriodos
          filas={tabla.filasVisibles}
          loading={loading}
          error={error}
          onRetry={recargar}
          onVerDetalle={setDetalle}
          onEditar={abrirEditar}
          onAnular={setConfirmacion}
          onVerPrenomina={irAPrenomina}
          onVerRecibos={irARecibos}
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

      <Modal
        abierto={modal.abierto}
        onClose={cerrarModal}
        titulo={modal.registro ? 'Editar período' : 'Nuevo período'}
        descripcion="El registro se guardará localmente hasta que el endpoint esté disponible."
        size="md"
      >
        <div className={styles.formulario}>
          <Badge variant="warning" size="sm">
            Endpoint pendiente
          </Badge>
          <PeriodoForm
            key={modal.registro?.id ?? 'nuevo'}
            initialData={modal.registro ?? undefined}
            onSubmit={guardar}
            onCancel={cerrarModal}
            submitLabel={modal.registro ? 'Guardar cambios' : 'Registrar período'}
          />
        </div>
      </Modal>

      <Modal
        abierto={Boolean(detalle)}
        onClose={() => setDetalle(null)}
        titulo="Detalle del período"
        descripcion={etiquetaPeriodo(detalle)}
        size="lg"
      >
        {detalle && (
          <div className={styles.detalle}>
            <CicloPeriodoStepper estado={detalle.estado ?? 'BORRADOR'} />

            <dl className={styles.resumen}>
              <div>
                <dt>Período</dt>
                <dd>{etiquetaPeriodo(detalle)}</dd>
              </div>
              <div>
                <dt>Frecuencia</dt>
                <dd>{detalle.frecuencia ?? '—'}</dd>
              </div>
              <div>
                <dt>Inicio</dt>
                <dd>{formatFecha(detalle.fecha_inicio)}</dd>
              </div>
              <div>
                <dt>Fin</dt>
                <dd>{formatFecha(detalle.fecha_fin)}</dd>
              </div>
              <div>
                <dt>Fecha de pago</dt>
                <dd>{formatFecha(detalle.fecha_pago)}</dd>
              </div>
              <div>
                <dt>Estado</dt>
                <dd>
                  <StatusBadge
                    estado={detalle.estado ?? 'BORRADOR'}
                    size="sm"
                  />
                </dd>
              </div>
            </dl>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        abierto={Boolean(confirmacion)}
        titulo="¿Anular período?"
        mensaje="El período se marcará como anulado en el listado local."
        textoConfirmar="Anular"
        variante="peligro"
        onConfirmar={confirmarAnulacion}
        onCancelar={() => setConfirmacion(null)}
      />
    </div>
  );
}

export default modelo;

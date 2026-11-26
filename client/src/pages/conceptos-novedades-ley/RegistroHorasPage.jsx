import { useEffect, useMemo, useState } from 'react';
import { HorasForm } from '../../components/conceptos-novedades-ley/HorasForm/index.js';
import { TablaHoras } from '../../components/conceptos-novedades-ley/TablaHoras/index.js';
import {
  Badge,
  Button,
  ConfirmDialog,
  Modal,
  PageHeader,
  Pagination,
  SearchInput,
  Select,
  StatCard,
  Toolbar,
} from '../../components/common/index.js';
import { useAuth } from '../../hooks/auth-rbac/useAuth.js';
import { useHoras } from '../../hooks/conceptos-novedades-ley/useHoras.js';
import { usePeriodos } from '../../hooks/nomina-recibos/usePeriodos.js';
import { usePersonas } from '../../hooks/rrhh-contratos/usePersonas.js';
import { useNotificacion } from '../../hooks/ui/useNotificacion.js';
import { useTablaControles } from '../../hooks/ui/useTablaControles.js';
import { formatNumero } from '../../utils/formatters.js';
import {
  actualizarRegistroHorasModelo,
  agregarRegistroHorasModelo,
  cambiarEstadoHoraModelo,
  crearModeloRegistroHorasPage,
  eliminarRegistroHorasModelo,
} from './registroHorasPage.model.js';
import styles from './RegistroHorasPage.module.css';

export {
  crearModeloRegistroHorasPage,
  agregarRegistroHorasModelo,
} from './registroHorasPage.model.js';

const FILTROS_ESTADO = [
  { value: 'PENDIENTE', label: 'Pendientes' },
  { value: 'APROBADO', label: 'Aprobados' },
  { value: 'RECHAZADO', label: 'Rechazados' },
  { value: 'PROCESADO', label: 'Procesados' },
];

export function RegistroHorasPage({ onNavegar }) {
  const { notificar } = useNotificacion();
  const { empresa } = useAuth();
  const { horas: horasLocales, registrarHora } = useHoras();
  const { personas, cargarPersonas } = usePersonas(empresa?.id);
  const { periodos, cargarPeriodos } = usePeriodos(empresa?.id);
  const [modelo, setModelo] = useState(() => crearModeloRegistroHorasPage());
  const [filtroEstado, setFiltroEstado] = useState('');
  const [modal, setModal] = useState({ abierto: false, registro: null });
  const [confirmacion, setConfirmacion] = useState(null);

  useEffect(() => {
    cargarPersonas();
    cargarPeriodos();
  }, [cargarPersonas, cargarPeriodos]);

  const fuenteRegistros =
    modelo.registros.length > 0 ? modelo.registros : horasLocales;

  const registros = useMemo(() => {
    if (!filtroEstado) return fuenteRegistros;

    return fuenteRegistros.filter(
      (registro) => registro.estado === filtroEstado
    );
  }, [filtroEstado, fuenteRegistros]);

  const totales = useMemo(
    () => ({
      ORDINARIA: fuenteRegistros.reduce(
        (suma, registro) =>
          registro.tipo_hora === 'ORDINARIA'
            ? suma + Number(registro.horas ?? registro.cantidad ?? 0)
            : suma,
        0
      ),
      EXTRA: fuenteRegistros.reduce(
        (suma, registro) =>
          registro.tipo_hora === 'EXTRA'
            ? suma + Number(registro.horas ?? registro.cantidad ?? 0)
            : suma,
        0
      ),
      total: fuenteRegistros.reduce(
        (suma, registro) =>
          suma + Number(registro.horas ?? registro.cantidad ?? 0),
        0
      ),
    }),
    [fuenteRegistros]
  );

  const tabla = useTablaControles(registros, {
    campos: ['persona_id', 'tipo_hora', 'descripcion', 'estado'],
  });

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
        actualizarRegistroHorasModelo(actual, {
          ...datos,
          id: modal.registro.id,
        })
      );
      cerrarModal();
      notificar({
        tipo: 'info',
        titulo: 'Edición local',
        mensaje: 'El endpoint de registro de horas aún está pendiente.',
      });
      return;
    }

    setModelo((actual) => agregarRegistroHorasModelo(actual, datos));
    registrarHora(datos);
    cerrarModal();
    notificar({
      tipo: 'info',
      titulo: 'Horas registradas localmente',
      mensaje: 'El endpoint de registro de horas aún está pendiente.',
    });
  }

  function cambiarEstado(registro, estado) {
    setModelo((actual) =>
      cambiarEstadoHoraModelo(actual, registro.id, estado)
    );
    notificar({
      tipo: 'info',
      titulo: `Registro ${estado.toLowerCase()}`,
      mensaje: 'El cambio se registró localmente.',
    });
  }

  function confirmarEliminacion() {
    setModelo((actual) =>
      eliminarRegistroHorasModelo(actual, confirmacion.id)
    );
    setConfirmacion(null);
    notificar({
      tipo: 'info',
      titulo: 'Registro eliminado localmente',
      mensaje: 'El endpoint de registro de horas aún está pendiente.',
    });
  }

  return (
    <div className={styles.pagina}>
      <PageHeader
        titulo={modelo.titulo}
        descripcion="Controla las jornadas ordinarias y extras antes de su procesamiento."
        breadcrumbs={[
          {
            label: 'Conceptos',
            onClick: onNavegar ? () => onNavegar('/conceptos') : undefined,
          },
          { label: 'Registro de horas' },
        ]}
        badge={{ etiqueta: 'Pendiente', variante: 'warning' }}
        actions={
          <Button iconLeft="plus" onClick={abrirNuevo}>
            Registrar horas
          </Button>
        }
      />

      <div className={styles.totales}>
        <StatCard
          titulo="Horas ordinarias"
          valor={formatNumero(totales.ORDINARIA, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
          icono="clock"
        />
        <StatCard
          titulo="Horas extras"
          valor={formatNumero(totales.EXTRA, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
          icono="calendar"
        />
        <StatCard
          titulo="Total de horas"
          valor={formatNumero(totales.total, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
          icono="dashboard"
        />
      </div>

      <Toolbar
        search={
          <SearchInput
            value={tabla.busqueda}
            onValueChange={tabla.setBusqueda}
            placeholder="Buscar por persona, tipo u observación"
            ariaLabel="Buscar registros de horas"
          />
        }
        filters={
          <Select
            size="sm"
            value={filtroEstado}
            onChange={(evento) => setFiltroEstado(evento.target.value)}
            options={FILTROS_ESTADO}
            placeholder="Todos los estados"
            aria-label="Filtrar horas por estado"
          />
        }
      />

      <div className={styles.contenido}>
        <TablaHoras
          filas={tabla.filasVisibles}
          personas={personas}
          periodos={periodos}
          onEditar={abrirEditar}
          onEliminar={setConfirmacion}
          onAprobar={(registro) => cambiarEstado(registro, 'APROBADO')}
          onRechazar={(registro) => cambiarEstado(registro, 'RECHAZADO')}
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
        titulo={modal.registro ? 'Editar registro de horas' : 'Registrar horas'}
        descripcion="El registro se guardará localmente hasta que el endpoint esté disponible."
        size="lg"
      >
        <div className={styles.formulario}>
          <Badge variant="warning" size="sm">
            Endpoint pendiente
          </Badge>
          <HorasForm
            key={modal.registro?.id ?? 'nueva'}
            initialData={modal.registro ?? undefined}
            personas={personas}
            periodos={periodos}
            onSubmit={guardar}
            onCancel={cerrarModal}
            submitLabel={modal.registro ? 'Guardar cambios' : 'Registrar horas'}
          />
        </div>
      </Modal>

      <ConfirmDialog
        abierto={Boolean(confirmacion)}
        titulo="¿Eliminar registro de horas?"
        mensaje="El registro se eliminará del listado local."
        textoConfirmar="Eliminar"
        variante="peligro"
        onConfirmar={confirmarEliminacion}
        onCancelar={() => setConfirmacion(null)}
      />
    </div>
  );
}

export default RegistroHorasPage;

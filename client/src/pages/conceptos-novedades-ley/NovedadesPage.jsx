import { useEffect, useMemo, useState } from 'react';
import { NovedadForm } from '../../components/conceptos-novedades-ley/NovedadForm/index.js';
import { TablaNovedades } from '../../components/conceptos-novedades-ley/TablaNovedades/index.js';
import {
  Badge,
  Button,
  ConfirmDialog,
  Modal,
  PageHeader,
  Pagination,
  SearchInput,
  Select,
  Toolbar,
} from '../../components/common/index.js';
import { useAuth } from '../../hooks/auth-rbac/useAuth.js';
import { useConceptos } from '../../hooks/conceptos-novedades-ley/useConceptos.js';
import { useNovedades } from '../../hooks/conceptos-novedades-ley/useNovedades.js';
import { usePeriodos } from '../../hooks/nomina-recibos/usePeriodos.js';
import { usePersonas } from '../../hooks/rrhh-contratos/usePersonas.js';
import { useNotificacion } from '../../hooks/ui/useNotificacion.js';
import { useTablaControles } from '../../hooks/ui/useTablaControles.js';
import {
  actualizarNovedadModelo,
  agregarNovedadModelo,
  cambiarEstadoNovedadModelo,
  crearModeloNovedadesPage,
  eliminarNovedadModelo,
} from './novedadesPage.model.js';
import styles from './NovedadesPage.module.css';

const FILTROS_ESTADO = [
  { value: 'PENDIENTE', label: 'Pendientes' },
  { value: 'APROBADA', label: 'Aprobadas' },
  { value: 'RECHAZADA', label: 'Rechazadas' },
  { value: 'APLICADA', label: 'Aplicadas' },
];

export function NovedadesPage({ onNavegar }) {
  const { notificar } = useNotificacion();
  const { empresa } = useAuth();
  const { novedades: novedadesLocales, agregarNovedad } = useNovedades();
  const { personas, cargarPersonas } = usePersonas(empresa?.id);
  const { conceptos, cargarConceptos } = useConceptos(empresa?.id);
  const { periodos, cargarPeriodos } = usePeriodos(empresa?.id);
  const [modelo, setModelo] = useState(() => crearModeloNovedadesPage());
  const [filtroEstado, setFiltroEstado] = useState('');
  const [modal, setModal] = useState({ abierto: false, registro: null });
  const [confirmacion, setConfirmacion] = useState(null);

  useEffect(() => {
    cargarPersonas();
    cargarConceptos();
    cargarPeriodos();
  }, [cargarPersonas, cargarConceptos, cargarPeriodos]);

  const fuenteNovedades =
    modelo.novedades.length > 0 ? modelo.novedades : novedadesLocales;

  const registros = useMemo(() => {
    if (!filtroEstado) return fuenteNovedades;

    return fuenteNovedades.filter(
      (novedad) => novedad.estado === filtroEstado
    );
  }, [filtroEstado, fuenteNovedades]);

  const tabla = useTablaControles(registros, {
    campos: [
      'persona_id',
      'concepto_id',
      'periodo_id',
      'observacion',
      'estado',
    ],
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
        actualizarNovedadModelo(actual, { ...datos, id: modal.registro.id })
      );
      cerrarModal();
      notificar({
        tipo: 'info',
        titulo: 'Edición local',
        mensaje: 'El endpoint de novedades aún está pendiente.',
      });
      return;
    }

    setModelo((actual) => agregarNovedadModelo(actual, datos));
    agregarNovedad(datos);
    cerrarModal();
    notificar({
      tipo: 'info',
      titulo: 'Novedad registrada localmente',
      mensaje: 'El endpoint de novedades aún está pendiente.',
    });
  }

  function cambiarEstado(registro, estado) {
    setModelo((actual) =>
      cambiarEstadoNovedadModelo(actual, registro.id, estado)
    );
    notificar({
      tipo: 'info',
      titulo: `Novedad ${estado.toLowerCase()}`,
      mensaje: 'El cambio se registró localmente.',
    });
  }

  function confirmarEliminacion() {
    setModelo((actual) => eliminarNovedadModelo(actual, confirmacion.id));
    setConfirmacion(null);
    notificar({
      tipo: 'info',
      titulo: 'Novedad eliminada localmente',
      mensaje: 'El endpoint de novedades aún está pendiente.',
    });
  }

  return (
    <div className={styles.pagina}>
      <PageHeader
        titulo={modelo.titulo}
        descripcion="Registra y aprueba novedades salariales asociadas a conceptos y períodos."
        breadcrumbs={[
          {
            label: 'Conceptos',
            onClick: onNavegar ? () => onNavegar('/conceptos') : undefined,
          },
          { label: 'Novedades' },
        ]}
        badge={{ etiqueta: 'Pendiente', variante: 'warning' }}
        actions={
          <Button iconLeft="plus" onClick={abrirNuevo}>
            Nueva novedad
          </Button>
        }
      />

      <Toolbar
        search={
          <SearchInput
            value={tabla.busqueda}
            onValueChange={tabla.setBusqueda}
            placeholder="Buscar por persona, concepto u observación"
            ariaLabel="Buscar novedades"
          />
        }
        filters={
          <Select
            size="sm"
            value={filtroEstado}
            onChange={(evento) => setFiltroEstado(evento.target.value)}
            options={FILTROS_ESTADO}
            placeholder="Todos los estados"
            aria-label="Filtrar novedades por estado"
          />
        }
      />

      <div className={styles.contenido}>
        <TablaNovedades
          filas={tabla.filasVisibles}
          personas={personas}
          conceptos={conceptos}
          periodos={periodos}
          onEditar={abrirEditar}
          onEliminar={setConfirmacion}
          onAprobar={(registro) => cambiarEstado(registro, 'APROBADA')}
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
        titulo={modal.registro ? 'Editar novedad' : 'Nueva novedad'}
        descripcion="El registro se guardará localmente hasta que el endpoint esté disponible."
        size="lg"
      >
        <div className={styles.formulario}>
          <Badge variant="warning" size="sm">
            Endpoint pendiente
          </Badge>
          <NovedadForm
            key={modal.registro?.id ?? 'nueva'}
            initialData={modal.registro ?? undefined}
            personas={personas}
            conceptos={conceptos}
            periodos={periodos}
            onSubmit={guardar}
            onCancel={cerrarModal}
            submitLabel={modal.registro ? 'Guardar cambios' : 'Registrar novedad'}
          />
        </div>
      </Modal>

      <ConfirmDialog
        abierto={Boolean(confirmacion)}
        titulo="¿Eliminar novedad?"
        mensaje="La novedad se eliminará del listado local."
        textoConfirmar="Eliminar"
        variante="peligro"
        onConfirmar={confirmarEliminacion}
        onCancelar={() => setConfirmacion(null)}
      />
    </div>
  );
}

export default NovedadesPage;

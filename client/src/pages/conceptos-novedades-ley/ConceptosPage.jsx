import { useEffect, useMemo, useState } from 'react';
import { ConceptoForm } from '../../components/conceptos-novedades-ley/ConceptoForm/index.js';
import { TablaConceptos } from '../../components/conceptos-novedades-ley/TablaConceptos/index.js';
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
import { useNotificacion } from '../../hooks/ui/useNotificacion.js';
import { useTablaControles } from '../../hooks/ui/useTablaControles.js';
import {
  actualizarConceptoModelo,
  crearModeloConceptosPage,
  desactivarConceptoModelo,
  registrarConceptoPage,
} from './conceptosPage.model.js';
import styles from './ConceptosPage.module.css';

const FILTROS_TIPO = [
  { value: 'ASIGNACION', label: 'Asignaciones' },
  { value: 'DEDUCCION', label: 'Deducciones' },
  { value: 'APORTE_PATRONAL', label: 'Aportes patronales' },
];

export function ConceptosPage({ onNavegar }) {
  const { notificar } = useNotificacion();
  const { empresa } = useAuth();
  const {
    conceptos,
    loading,
    error,
    cargarConceptos,
  } = useConceptos(empresa?.id);
  const [modelo, setModelo] = useState(() => crearModeloConceptosPage());
  const [filtroTipo, setFiltroTipo] = useState('');
  const [modal, setModal] = useState({ abierto: false, registro: null });
  const [confirmacion, setConfirmacion] = useState(null);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    cargarConceptos();
  }, [cargarConceptos]);

  const fuenteConceptos =
    modelo.conceptos.length > 0 ? modelo.conceptos : conceptos;

  const registros = useMemo(() => {
    if (!filtroTipo) return fuenteConceptos;

    return fuenteConceptos.filter(
      (concepto) => concepto.tipo_concepto === filtroTipo
    );
  }, [filtroTipo, fuenteConceptos]);

  const tabla = useTablaControles(registros, {
    campos: ['codigo', 'nombre', 'tipo_concepto', 'categoria', 'naturaleza'],
  });

  async function recargar() {
    setModelo((actual) => ({ ...actual, conceptos: [] }));
    await cargarConceptos();
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

  async function guardar(datos) {
    if (modal.registro) {
      setModelo((actual) =>
        actualizarConceptoModelo(actual, { ...datos, id: modal.registro.id })
      );
      cerrarModal();
      notificar({
        tipo: 'info',
        titulo: 'Edición pendiente',
        mensaje: 'El endpoint para actualizar conceptos aún no está disponible.',
      });
      return;
    }

    setGuardando(true);
    const siguiente = await registrarConceptoPage(
      { ...modelo, conceptos: fuenteConceptos },
      datos
    );
    setGuardando(false);
    setModelo(siguiente);

    if (siguiente.mensaje?.tipo === 'exito') {
      notificar({
        tipo: 'exito',
        titulo: 'Concepto registrado',
        mensaje: siguiente.mensaje.texto,
      });
      cerrarModal();
      recargar();
      return;
    }

    notificar({
      tipo: 'error',
      titulo: 'No se pudo registrar el concepto',
      mensaje: siguiente.mensaje?.texto,
    });
  }

  function confirmarDesactivacion() {
    setModelo((actual) =>
      desactivarConceptoModelo(actual, confirmacion.id)
    );
    setConfirmacion(null);
    notificar({
      tipo: 'info',
      titulo: 'Concepto desactivado localmente',
      mensaje: 'El endpoint para desactivar conceptos aún está pendiente.',
    });
  }

  return (
    <div className={styles.pagina}>
      <PageHeader
        titulo={modelo.titulo}
        descripcion="Administra los conceptos de asignación, deducción y aporte patronal de la nómina."
        breadcrumbs={[
          {
            label: 'Conceptos',
            onClick: onNavegar ? () => onNavegar('/conceptos') : undefined,
          },
          { label: 'Conceptos' },
        ]}
        badge={{
          etiqueta: `${registros.length} registros`,
          variante: 'neutral',
        }}
        actions={
          <Button iconLeft="plus" onClick={abrirNuevo}>
            Nuevo concepto
          </Button>
        }
      />

      <Toolbar
        search={
          <SearchInput
            value={tabla.busqueda}
            onValueChange={tabla.setBusqueda}
            placeholder="Buscar por código, nombre, tipo o categoría"
            ariaLabel="Buscar conceptos"
          />
        }
        filters={
          <Select
            size="sm"
            value={filtroTipo}
            onChange={(evento) => setFiltroTipo(evento.target.value)}
            options={FILTROS_TIPO}
            placeholder="Todos los tipos"
            aria-label="Filtrar conceptos por tipo"
          />
        }
      />

      <div className={styles.contenido}>
        <TablaConceptos
          filas={tabla.filasVisibles}
          loading={loading || guardando}
          error={error}
          onRetry={recargar}
          onEditar={abrirEditar}
          onEliminar={setConfirmacion}
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
        titulo={modal.registro ? 'Editar concepto' : 'Nuevo concepto'}
        descripcion="Define la naturaleza contable y la configuración del concepto."
        size="lg"
      >
        <div className={styles.formulario}>
          {modal.registro && (
            <Badge variant="warning" size="sm">
              Edición pendiente de endpoint
            </Badge>
          )}
          <ConceptoForm
            key={modal.registro?.id ?? 'nuevo'}
            initialData={modal.registro ?? undefined}
            onSubmit={guardar}
            onCancel={cerrarModal}
            loading={guardando}
            submitLabel={modal.registro ? 'Guardar cambios' : 'Registrar concepto'}
          />
        </div>
      </Modal>

      <ConfirmDialog
        abierto={Boolean(confirmacion)}
        titulo="¿Desactivar concepto?"
        mensaje="El concepto dejará de estar activo en el listado local."
        textoConfirmar="Desactivar"
        variante="peligro"
        onConfirmar={confirmarDesactivacion}
        onCancelar={() => setConfirmacion(null)}
      />
    </div>
  );
}

export default ConceptosPage;

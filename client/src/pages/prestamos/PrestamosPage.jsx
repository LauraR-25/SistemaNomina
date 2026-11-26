import { useEffect, useMemo, useState } from 'react';
import { TablaPrestamos } from '../../components/prestamos/TablaPrestamos/index.js';
import { PrestamoForm } from '../../components/prestamos/PrestamoForm/index.js';
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
import { usePersonas } from '../../hooks/rrhh-contratos/usePersonas.js';
import { usePrestamos } from '../../hooks/prestamos/usePrestamos.js';
import { useNotificacion } from '../../hooks/ui/useNotificacion.js';
import { useTablaControles } from '../../hooks/ui/useTablaControles.js';
import {
  anularPrestamoModelo,
  actualizarPrestamoModelo,
  agregarPrestamoModelo,
  crearModeloPrestamosPage,
} from './prestamosPage.model.js';
import styles from './PrestamosPage.module.css';

const FILTROS_ESTADO = [
  { value: 'SOLICITADO', label: 'Solicitados' },
  { value: 'ACTIVO', label: 'Activos' },
  { value: 'PAGADO', label: 'Pagados' },
  { value: 'ANULADO', label: 'Anulados' },
];

export function PrestamosPage({ onNavegar }) {
  const { notificar } = useNotificacion();
  const { empresa } = useAuth();
  const {
    prestamos,
    loading,
    error,
    cargarPrestamos,
  } = usePrestamos(empresa?.id);
  const { personas, cargarPersonas } = usePersonas(empresa?.id);
  const { conceptos, cargarConceptos } = useConceptos(empresa?.id);
  const [modelo, setModelo] = useState(() => crearModeloPrestamosPage());
  const [filtroEstado, setFiltroEstado] = useState('');
  const [modal, setModal] = useState({ abierto: false, registro: null });
  const [confirmacion, setConfirmacion] = useState(null);

  useEffect(() => {
    cargarPrestamos();
    cargarPersonas();
    cargarConceptos();
  }, [cargarPrestamos, cargarPersonas, cargarConceptos]);

  const fuentePrestamos =
    modelo.prestamos.length > 0 ? modelo.prestamos : prestamos;

  const registros = useMemo(() => {
    if (!filtroEstado) return fuentePrestamos;

    return fuentePrestamos.filter(
      (prestamo) => prestamo.estado === filtroEstado
    );
  }, [filtroEstado, fuentePrestamos]);

  const tabla = useTablaControles(registros, {
    campos: [
      'persona_id',
      'monto_aprobado',
      'modalidad_descuento',
      'nro_cuotas',
      'estado',
    ],
  });

  async function recargar() {
    setModelo((actual) => ({ ...actual, prestamos: [] }));
    await cargarPrestamos();
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
        actualizarPrestamoModelo(actual, { ...datos, id: modal.registro.id })
      );
      cerrarModal();
      notificar({
        tipo: 'info',
        titulo: 'Préstamo actualizado localmente',
        mensaje: 'El endpoint para actualizar préstamos aún está pendiente.',
      });
      return;
    }

    setModelo((actual) => agregarPrestamoModelo(actual, datos));
    cerrarModal();
    notificar({
      tipo: 'info',
      titulo: 'Préstamo registrado localmente',
      mensaje: 'El endpoint para registrar préstamos aún está pendiente.',
    });
  }

  function confirmarAnulacion() {
    setModelo((actual) => anularPrestamoModelo(actual, confirmacion.id));
    setConfirmacion(null);
    notificar({
      tipo: 'info',
      titulo: 'Préstamo anulado localmente',
      mensaje: 'El endpoint para anular préstamos aún está pendiente.',
    });
  }

  function verCuotas(prestamo) {
    sessionStorage.setItem('prestamoActivoId', String(prestamo.id));
    onNavegar?.({ ruta: '/prestamos', subruta: 'cuotas' });
  }

  return (
    <div className={styles.pagina}>
      <PageHeader
        titulo={modelo.titulo}
        descripcion="Solicita, controla y da seguimiento a los préstamos del personal."
        breadcrumbs={[
          {
            label: 'Préstamos',
            onClick: onNavegar ? () => onNavegar('/prestamos') : undefined,
          },
          { label: 'Préstamos' },
        ]}
        badge={{
          etiqueta: `${registros.length} registros`,
          variante: 'neutral',
        }}
        actions={
          <Button iconLeft="plus" onClick={abrirNuevo}>
            Nuevo préstamo
          </Button>
        }
      />

      <Toolbar
        search={
          <SearchInput
            value={tabla.busqueda}
            onValueChange={tabla.setBusqueda}
            placeholder="Buscar por persona, monto o estado"
            ariaLabel="Buscar préstamos"
          />
        }
        filters={
          <Select
            size="sm"
            value={filtroEstado}
            onChange={(evento) => setFiltroEstado(evento.target.value)}
            options={FILTROS_ESTADO}
            placeholder="Todos los estados"
            aria-label="Filtrar préstamos por estado"
          />
        }
      />

      <div className={styles.contenido}>
        <TablaPrestamos
          filas={tabla.filasVisibles}
          personas={personas}
          loading={loading}
          error={error}
          onRetry={recargar}
          onEditar={abrirEditar}
          onEliminar={setConfirmacion}
          onVerCuotas={verCuotas}
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
        titulo={modal.registro ? 'Editar préstamo' : 'Nuevo préstamo'}
        descripcion="El registro se guardará localmente hasta que el endpoint esté disponible."
        size="lg"
      >
        <div className={styles.formulario}>
          <Badge variant="warning" size="sm">
            Endpoint pendiente
          </Badge>
          <PrestamoForm
            key={modal.registro?.id ?? 'nuevo'}
            initialData={modal.registro ?? undefined}
            personas={personas}
            conceptos={conceptos}
            onSubmit={guardar}
            onCancel={cerrarModal}
            submitLabel={modal.registro ? 'Guardar cambios' : 'Registrar préstamo'}
          />
        </div>
      </Modal>

      <ConfirmDialog
        abierto={Boolean(confirmacion)}
        titulo="¿Anular préstamo?"
        mensaje="El préstamo se marcará como anulado en el listado local."
        textoConfirmar="Anular"
        variante="peligro"
        onConfirmar={confirmarAnulacion}
        onCancelar={() => setConfirmacion(null)}
      />
    </div>
  );
}

export default PrestamosPage;

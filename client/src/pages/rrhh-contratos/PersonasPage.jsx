import { useEffect, useMemo, useState } from 'react';
import { PersonaForm } from '../../components/rrhh-contratos/PersonaForm/index.js';
import { SalarioHistorial } from '../../components/rrhh-contratos/SalarioHistorial/index.js';
import { TablaPersonas } from '../../components/rrhh-contratos/TablaPersonas/index.js';
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
import { usePersonas } from '../../hooks/rrhh-contratos/usePersonas.js';
import { useNotificacion } from '../../hooks/ui/useNotificacion.js';
import { useTablaControles } from '../../hooks/ui/useTablaControles.js';
import {
  crearModeloPersonasPage,
  registrarPersonaPage,
} from './personasPage.model.js';
import styles from './PersonasPage.module.css';

export {
  crearModeloPersonasPage,
  registrarPersonaPage,
} from './personasPage.model.js';

const FILTROS_ESTADO = [
  { value: 'ACTIVO', label: 'Activos' },
  { value: 'INACTIVO', label: 'Inactivos' },
];

function nombreCompleto(persona) {
  return [persona.primer_nombre, persona.primer_apellido]
    .filter(Boolean)
    .join(' ');
}

export function PersonasPage({ onNavegar }) {
  const { notificar } = useNotificacion();
  const { empresa } = useAuth();
  const {
    personas,
    loading,
    error,
    cargarPersonas,
  } = usePersonas(empresa?.id);
  const [modelo, setModelo] = useState(() => crearModeloPersonasPage());
  const [filtroEstado, setFiltroEstado] = useState('');
  const [modal, setModal] = useState({ abierto: false, registro: null });
  const [detalle, setDetalle] = useState(null);
  const [confirmacion, setConfirmacion] = useState(null);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    cargarPersonas();
  }, [cargarPersonas]);

  const fuentePersonas = modelo.personas.length > 0 ? modelo.personas : personas;

  const registros = useMemo(() => {
    if (!filtroEstado) return fuentePersonas;

    return fuentePersonas.filter((persona) => persona.estado === filtroEstado);
  }, [filtroEstado, fuentePersonas]);

  const tabla = useTablaControles(registros, {
    campos: [
      'cedula',
      'primer_nombre',
      'segundo_nombre',
      'primer_apellido',
      'segundo_apellido',
      'email',
      'nro_tlf',
    ],
  });

  async function recargar() {
    setModelo((actual) => ({ ...actual, personas: [] }));
    await cargarPersonas();
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
      notificar({
        tipo: 'info',
        titulo: 'Edición pendiente',
        mensaje: 'El endpoint para actualizar personas aún no está disponible.',
      });
      cerrarModal();
      return;
    }

    setGuardando(true);
    const siguiente = await registrarPersonaPage(
      { ...modelo, personas: fuentePersonas },
      datos
    );
    setGuardando(false);
    setModelo(siguiente);

    if (siguiente.mensaje?.tipo === 'exito') {
      notificar({
        tipo: 'exito',
        titulo: 'Persona registrada',
        mensaje: siguiente.mensaje.texto,
      });
      cerrarModal();
      recargar();
      return;
    }

    notificar({
      tipo: 'error',
      titulo: 'No se pudo registrar la persona',
      mensaje: siguiente.mensaje?.texto,
    });
  }

  function confirmarEliminacion() {
    notificar({
      tipo: 'info',
      titulo: 'Eliminación pendiente',
      mensaje: 'El endpoint para eliminar personas aún no está disponible.',
    });
    setConfirmacion(null);
  }

  return (
    <div className={styles.pagina}>
      <PageHeader
        titulo={modelo.titulo}
        descripcion="Gestiona las personas y consulta su historial salarial."
        breadcrumbs={[
          { label: 'RRHH', onClick: onNavegar ? () => onNavegar('/rrhh') : undefined },
          { label: 'Personas' },
        ]}
        badge={{ etiqueta: `${registros.length} registros`, variante: 'neutral' }}
        actions={
          <Button iconLeft="plus" onClick={abrirNuevo}>
            Nueva persona
          </Button>
        }
      />

      <Toolbar
        search={
          <SearchInput
            value={tabla.busqueda}
            onValueChange={tabla.setBusqueda}
            placeholder="Buscar por cédula, nombre, correo o teléfono"
            ariaLabel="Buscar personas"
          />
        }
        filters={
          <Select
            size="sm"
            value={filtroEstado}
            onChange={(evento) => setFiltroEstado(evento.target.value)}
            options={FILTROS_ESTADO}
            placeholder="Todos los estados"
            aria-label="Filtrar personas por estado"
          />
        }
      />

      <div className={styles.contenido}>
        <TablaPersonas
          filas={tabla.filasVisibles}
          loading={loading || guardando}
          error={error}
          onRetry={recargar}
          onEditar={abrirEditar}
          onEliminar={setConfirmacion}
          onVerDetalle={setDetalle}
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
        titulo={modal.registro ? 'Editar persona' : 'Nueva persona'}
        descripcion="Los datos personales se ajustan a los catálogos de RRHH."
        size="lg"
      >
        <PersonaForm
          key={modal.registro?.id ?? 'nueva'}
          initialData={modal.registro ?? undefined}
          onSubmit={guardar}
          onCancel={cerrarModal}
          loading={guardando}
          submitLabel={modal.registro ? 'Guardar cambios' : 'Registrar persona'}
        />
      </Modal>

      <Modal
        abierto={Boolean(detalle)}
        onClose={() => setDetalle(null)}
        titulo={detalle ? nombreCompleto(detalle) : 'Detalle de persona'}
        descripcion="Historial de salarios registrado para la persona seleccionada."
        size="lg"
      >
        <div className={styles.detalle}>
          {detalle && (
            <div className={styles.datos}>
              <Badge variant="neutral" size="sm">
                {detalle.cedula}
              </Badge>
              <Badge variant="accent" size="sm">
                {detalle.estado ?? 'ACTIVO'}
              </Badge>
            </div>
          )}
          <SalarioHistorial
            historial={modelo.historialSalarios}
            personaId={detalle?.id}
            moneda="VES"
          />
        </div>
      </Modal>

      <ConfirmDialog
        abierto={Boolean(confirmacion)}
        titulo="¿Eliminar persona?"
        mensaje={`Se eliminará a "${nombreCompleto(confirmacion ?? {})}". Esta acción no se puede deshacer.`}
        textoConfirmar="Eliminar"
        variante="peligro"
        onConfirmar={confirmarEliminacion}
        onCancelar={() => setConfirmacion(null)}
      />
    </div>
  );
}

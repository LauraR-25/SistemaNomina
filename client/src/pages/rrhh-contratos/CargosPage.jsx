import { useMemo, useState } from 'react';
import { CargoForm } from '../../components/rrhh-contratos/CargoForm/index.js';
import { TablaCargos } from '../../components/rrhh-contratos/TablaCargos/index.js';
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
import { useNotificacion } from '../../hooks/ui/useNotificacion.js';
import { useTablaControles } from '../../hooks/ui/useTablaControles.js';
import {
  actualizarCargoModelo,
  agregarCargoModelo,
  crearModeloCargosPage,
  eliminarCargoModelo,
} from './cargosPage.model.js';
import styles from './CargosPage.module.css';

export {
  crearModeloCargosPage,
  agregarCargoModelo,
} from './cargosPage.model.js';

const FILTROS_ESTADO = [
  { value: 'ACTIVO', label: 'Activos' },
  { value: 'INACTIVO', label: 'Inactivos' },
];

export function CargosPage({ onNavegar }) {
  const { notificar } = useNotificacion();
  const [modelo, setModelo] = useState(() => crearModeloCargosPage());
  const [filtroEstado, setFiltroEstado] = useState('');
  const [modal, setModal] = useState({ abierto: false, registro: null });
  const [confirmacion, setConfirmacion] = useState(null);

  const registros = useMemo(() => {
    if (!filtroEstado) return modelo.cargos;

    return modelo.cargos.filter((cargo) =>
      filtroEstado === 'ACTIVO' ? cargo.activo !== false : cargo.activo === false
    );
  }, [filtroEstado, modelo.cargos]);

  const tabla = useTablaControles(registros, {
    campos: ['nombre', 'descripcion'],
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
        actualizarCargoModelo(actual, { ...datos, id: modal.registro.id })
      );
    } else {
      setModelo((actual) => agregarCargoModelo(actual, { id: Date.now(), ...datos }));
    }

    cerrarModal();
    notificar({
      tipo: 'info',
      titulo: 'Cambio registrado localmente',
      mensaje: 'El endpoint de cargos aún está pendiente.',
    });
  }

  function confirmarEliminacion() {
    setModelo((actual) => eliminarCargoModelo(actual, confirmacion.id));
    setConfirmacion(null);
    notificar({
      tipo: 'info',
      titulo: 'Cargo eliminado localmente',
      mensaje: 'El endpoint de cargos aún está pendiente.',
    });
  }

  return (
    <div className={styles.pagina}>
      <PageHeader
        titulo={modelo.titulo}
        descripcion="Administra los cargos que se asocian a los contratos laborales."
        breadcrumbs={[
          { label: 'RRHH', onClick: onNavegar ? () => onNavegar('/rrhh') : undefined },
          { label: 'Cargos' },
        ]}
        badge={{ etiqueta: 'Pendiente', variante: 'warning' }}
        actions={
          <Button iconLeft="plus" onClick={abrirNuevo}>
            Nuevo cargo
          </Button>
        }
      />

      <Toolbar
        search={
          <SearchInput
            value={tabla.busqueda}
            onValueChange={tabla.setBusqueda}
            placeholder="Buscar por nombre o descripción"
            ariaLabel="Buscar cargos"
          />
        }
        filters={
          <Select
            size="sm"
            value={filtroEstado}
            onChange={(evento) => setFiltroEstado(evento.target.value)}
            options={FILTROS_ESTADO}
            placeholder="Todos los estados"
            aria-label="Filtrar cargos por estado"
          />
        }
      />

      <div className={styles.contenido}>
        <TablaCargos
          filas={tabla.filasVisibles}
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
        titulo={modal.registro ? 'Editar cargo' : 'Nuevo cargo'}
        descripcion="El registro se guardará localmente hasta que el endpoint esté disponible."
        size="sm"
      >
        <div className={styles.formulario}>
          <Badge variant="warning" size="sm">
            Endpoint pendiente
          </Badge>
          <CargoForm
            key={modal.registro?.id ?? 'nuevo'}
            initialData={modal.registro ?? undefined}
            onSubmit={guardar}
            onCancel={cerrarModal}
            submitLabel={modal.registro ? 'Guardar cambios' : 'Registrar cargo'}
          />
        </div>
      </Modal>

      <ConfirmDialog
        abierto={Boolean(confirmacion)}
        titulo="¿Eliminar cargo?"
        mensaje={`Se eliminará "${confirmacion?.nombre ?? ''}" del listado local.`}
        textoConfirmar="Eliminar"
        variante="peligro"
        onConfirmar={confirmarEliminacion}
        onCancelar={() => setConfirmacion(null)}
      />
    </div>
  );
}

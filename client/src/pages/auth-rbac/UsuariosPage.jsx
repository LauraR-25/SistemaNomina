import { useEffect, useMemo, useState } from 'react';
import { TablaUsuarios } from '../../components/auth-rbac/TablaUsuarios/index.js';
import { UsuarioForm } from '../../components/auth-rbac/UsuarioForm/index.js';
import {
  Modal,
  PageHeader,
  Pagination,
  SearchInput,
  Select,
  Toolbar,
} from '../../components/common/index.js';
import { useAuth } from '../../hooks/auth-rbac/useAuth.js';
import { usePermisos } from '../../hooks/auth-rbac/usePermisos.js';
import { usePersonas } from '../../hooks/rrhh-contratos/usePersonas.js';
import { useNotificacion } from '../../hooks/ui/useNotificacion.js';
import { useTablaControles } from '../../hooks/ui/useTablaControles.js';
import {
  actualizarUsuarioModelo,
  crearModeloUsuariosPage,
  establecerUsuariosModelo,
  filtrarUsuariosModelo,
  generarUsuariosLocales,
} from './usuariosPage.model.js';
import { generarPerfilesLocales } from './perfilesPage.model.js';
import modelo from './usuariosPage.model.js';
import styles from './UsuariosPage.module.css';

export {
  crearModeloUsuariosPage,
  filtrarUsuariosModelo,
} from './usuariosPage.model.js';

const FILTROS_ESTADO = [
  { value: 'ACTIVO', label: 'Activos' },
  { value: 'INACTIVO', label: 'Inactivos' },
];

export function UsuariosPage({ onNavegar }) {
  const { notificar } = useNotificacion();
  const { usuario, empresa } = useAuth();
  const { perfiles } = usePermisos();
  const { personas, cargarPersonas } = usePersonas(empresa?.id);
  const [modeloPagina, setModelo] = useState(() => crearModeloUsuariosPage());
  const [filtroTexto, setFiltroTexto] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('');
  const [usuarioEditado, setUsuarioEditado] = useState(null);

  useEffect(() => {
    cargarPersonas();
  }, [cargarPersonas]);

  const perfilesDisponibles = useMemo(
    () => generarPerfilesLocales(perfiles),
    [perfiles]
  );

  useEffect(() => {
    const generados = generarUsuariosLocales({
      usuario,
      perfiles: perfilesDisponibles,
      personas,
    });

    setModelo((actual) => establecerUsuariosModelo(actual, generados));
  }, [usuario, perfilesDisponibles, personas]);

  const registros = useMemo(
    () =>
      filtrarUsuariosModelo(
        modeloPagina,
        filtroTexto,
        estadoFiltro
      ).usuariosFiltrados,
    [modeloPagina, filtroTexto, estadoFiltro]
  );

  const tabla = useTablaControles(registros, { busqueda: '', campos: [] });

  function abrirCrear() {
    setUsuarioEditado({ id: null, datos: {} });
  }

  function abrirEditar(fila) {
    setUsuarioEditado({ id: fila.id, datos: fila });
  }

  function cerrarFormulario() {
    setUsuarioEditado(null);
  }

  function guardarUsuario(payload) {
    const esNuevo = !usuarioEditado?.id;

    setModelo((actual) =>
      actualizarUsuarioModelo(
        actual,
        usuarioEditado?.id ?? null,
        payload
      )
    );
    cerrarFormulario();

    notificar({
      tipo: 'info',
      titulo: esNuevo
        ? 'Usuario creado localmente'
        : 'Usuario actualizado localmente',
      mensaje: 'El endpoint de usuarios aún está pendiente.',
    });
  }

  function cambiarEstado(fila) {
    setModelo((actual) =>
      actualizarUsuarioModelo(actual, fila.id, { activo: !fila.activo })
    );

    notificar({
      tipo: 'info',
      titulo: 'Estado actualizado localmente',
      mensaje: 'El endpoint de usuarios aún está pendiente.',
    });
  }

  return (
    <div className={styles.pagina}>
      <PageHeader
        titulo={modeloPagina.titulo}
        descripcion="Administra usuarios, su persona asociada y los perfiles asignados."
        breadcrumbs={[
          {
            label: 'Seguridad',
            onClick: onNavegar ? () => onNavegar('/seguridad') : undefined,
          },
          { label: 'Usuarios' },
        ]}
        badge={{ etiqueta: 'Datos locales', variante: 'warning' }}
      />

      <Toolbar
        search={
          <SearchInput
            value={filtroTexto}
            onValueChange={(valor) => {
              setFiltroTexto(valor);
              tabla.setPagina(1);
            }}
            placeholder="Buscar por usuario, persona o perfil"
            ariaLabel="Buscar usuarios"
          />
        }
        filters={
          <Select
            size="sm"
            value={estadoFiltro}
            onChange={(evento) => {
              setEstadoFiltro(evento.target.value);
              tabla.setPagina(1);
            }}
            options={FILTROS_ESTADO}
            placeholder="Todos los estados"
            aria-label="Filtrar usuarios por estado"
          />
        }
        onCreate={abrirCrear}
        createLabel="Nuevo usuario"
      />

      <div className={styles.contenido}>
        <TablaUsuarios
          datos={tabla.filasVisibles}
          personas={personas}
          perfiles={perfilesDisponibles}
          onEditar={abrirEditar}
          onCambiarEstado={cambiarEstado}
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
        abierto={Boolean(usuarioEditado)}
        onClose={cerrarFormulario}
        titulo={
          usuarioEditado?.id ? 'Editar usuario' : 'Nuevo usuario'
        }
        descripcion="La contraseña inicial solo se solicita al crear el usuario."
        size="lg"
      >
        {usuarioEditado && (
          <UsuarioForm
            initialData={usuarioEditado.datos}
            personas={personas}
            perfiles={perfilesDisponibles}
            onSubmit={guardarUsuario}
            onCancel={cerrarFormulario}
            submitLabel={
              usuarioEditado.id ? 'Guardar cambios' : 'Crear usuario'
            }
          />
        )}
      </Modal>
    </div>
  );
}

export default modelo;

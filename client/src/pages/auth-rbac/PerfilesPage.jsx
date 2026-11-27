import { useMemo, useState } from 'react';
import { PerfilForm } from '../../components/auth-rbac/PerfilForm/index.js';
import { TablaPerfiles } from '../../components/auth-rbac/TablaPerfiles/index.js';
import {
  Modal,
  PageHeader,
  Pagination,
  SearchInput,
  Toolbar,
} from '../../components/common/index.js';
import { usePermisos } from '../../hooks/auth-rbac/usePermisos.js';
import { useNotificacion } from '../../hooks/ui/useNotificacion.js';
import { useTablaControles } from '../../hooks/ui/useTablaControles.js';
import {
  actualizarPerfilModelo,
  agregarPerfilModelo,
  crearModeloPerfilesPage,
  establecerPerfilesModelo,
  generarPerfilesLocales,
} from './perfilesPage.model.js';
import styles from './PerfilesPage.module.css';

export function PerfilesPage({ onNavegar }) {
  const { notificar } = useNotificacion();
  const { perfiles } = usePermisos();
  const generados = useMemo(
    () => generarPerfilesLocales(perfiles),
    [perfiles]
  );
  const [estadoModelo, setEstadoModelo] = useState(() => ({
    fuente: perfiles,
    modelo: crearModeloPerfilesPage(generados),
  }));
  const [filtroTexto, setFiltroTexto] = useState('');
  const [perfilEditado, setPerfilEditado] = useState(null);

  const modeloPagina = useMemo(
    () =>
      estadoModelo.fuente === perfiles
        ? estadoModelo.modelo
        : establecerPerfilesModelo(estadoModelo.modelo, generados),
    [estadoModelo, perfiles, generados]
  );

  const registros = useMemo(() => {
    const termino = String(filtroTexto ?? '').trim().toLowerCase();

    if (!termino) return modeloPagina.perfiles;

    return modeloPagina.perfiles.filter((perfil) =>
      [
        perfil.nombre_perfil,
        perfil.descripcion,
      ]
        .join(' ')
        .toLowerCase()
        .includes(termino)
    );
  }, [modeloPagina.perfiles, filtroTexto]);

  const tabla = useTablaControles(registros, { busqueda: '', campos: [] });

  function abrirCrear() {
    setPerfilEditado({ id: null, datos: {} });
  }

  function abrirEditar(fila) {
    setPerfilEditado({ id: fila.id, datos: fila });
  }

  function cerrarFormulario() {
    setPerfilEditado(null);
  }

  function actualizarModelo(transformar) {
    setEstadoModelo((actual) => ({
      fuente: perfiles,
      modelo: transformar(
        actual.fuente === perfiles
          ? actual.modelo
          : establecerPerfilesModelo(actual.modelo, generados)
      ),
    }));
  }

  function guardarPerfil(payload) {
    const esNuevo = !perfilEditado?.id;

    actualizarModelo((actual) =>
      esNuevo
        ? agregarPerfilModelo(actual, payload)
        : actualizarPerfilModelo(actual, perfilEditado.id, payload)
    );
    cerrarFormulario();

    notificar({
      tipo: 'info',
      titulo: esNuevo
        ? 'Perfil creado localmente'
        : 'Perfil actualizado localmente',
      mensaje: 'El endpoint de perfiles aún está pendiente.',
    });
  }

  function cambiarEstado(fila) {
    actualizarModelo((actual) =>
      actualizarPerfilModelo(actual, fila.id, { activo: !fila.activo })
    );

    notificar({
      tipo: 'info',
      titulo: 'Estado actualizado localmente',
      mensaje: 'El endpoint de perfiles aún está pendiente.',
    });
  }

  return (
    <div className={styles.pagina}>
      <PageHeader
        titulo={modeloPagina.titulo}
        descripcion="Define perfiles de acceso y mantén su información actualizada."
        breadcrumbs={[
          {
            label: 'Seguridad',
            onClick: onNavegar ? () => onNavegar('/seguridad') : undefined,
          },
          { label: 'Perfiles' },
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
            placeholder="Buscar por nombre o descripción"
            ariaLabel="Buscar perfiles"
          />
        }
        onCreate={abrirCrear}
        createLabel="Nuevo perfil"
      />

      <div className={styles.contenido}>
        <TablaPerfiles
          datos={tabla.filasVisibles}
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
        abierto={Boolean(perfilEditado)}
        onClose={cerrarFormulario}
        titulo={perfilEditado?.id ? 'Editar perfil' : 'Nuevo perfil'}
        descripcion="Los cambios se aplican localmente hasta que exista el endpoint."
      >
        {perfilEditado && (
          <PerfilForm
            initialData={perfilEditado.datos}
            onSubmit={guardarPerfil}
            onCancel={cerrarFormulario}
            submitLabel={
              perfilEditado.id ? 'Guardar cambios' : 'Crear perfil'
            }
          />
        )}
      </Modal>
    </div>
  );
}

export default PerfilesPage;

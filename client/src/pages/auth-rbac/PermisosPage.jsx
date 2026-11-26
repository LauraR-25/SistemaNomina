import { useEffect, useMemo, useState } from 'react';
import { PermisosTree } from '../../components/auth-rbac/PermisosTree/index.js';
import {
  Badge,
  Button,
  PageHeader,
  Switch,
} from '../../components/common/index.js';
import { usePermisos } from '../../hooks/auth-rbac/usePermisos.js';
import { useNotificacion } from '../../hooks/ui/useNotificacion.js';
import cx from '../../utils/cx.js';
import {
  crearModeloPermisosPage,
  generarOpcionesLocales,
  reemplazarSeleccionPermisos,
  seleccionDemostracionPermisos,
} from './permisosPage.model.js';
import modelo from './permisosPage.model.js';
import styles from './PermisosPage.module.css';

export {
  crearModeloPermisosPage,
  actualizarPermisoSeleccionado,
} from './permisosPage.model.js';

export function PermisosPage({ onNavegar }) {
  const { notificar } = useNotificacion();
  const { perfiles, opciones } = usePermisos();
  const [modeloPagina, setModelo] = useState(() =>
    crearModeloPermisosPage()
  );
  const [perfilId, setPerfilId] = useState(null);
  const [seleccionados, setSeleccionados] = useState([]);
  const [soloLectura, setSoloLectura] = useState(false);

  const perfilesDisponibles = useMemo(
    () => generarPerfilesLocales(perfiles),
    [perfiles]
  );
  const opcionesLocales = useMemo(
    () => generarOpcionesLocales(opciones),
    [opciones]
  );

  const indicePerfil = perfilesDisponibles.findIndex(
    (perfil) => String(perfil.id) === String(perfilId)
  );

  useEffect(() => {
    if (perfilesDisponibles.length === 0) return;
    if (
      !perfilesDisponibles.some(
        (perfil) => String(perfil.id) === String(perfilId)
      )
    ) {
      setPerfilId(String(perfilesDisponibles[0].id));
    }
  }, [perfilesDisponibles, perfilId]);

  const seleccionInicial = useMemo(
    () =>
      seleccionDemostracionPermisos(
        opcionesLocales,
        indicePerfil >= 0 ? indicePerfil : 0
      ),
    [opcionesLocales, indicePerfil]
  );

  useEffect(() => {
    const normalizados = Array.from(
      new Set(seleccionInicial.map(String))
    );
    setSeleccionados(normalizados);
  }, [seleccionInicial]);

  useEffect(() => {
    setModelo(
      crearModeloPermisosPage(opcionesLocales, seleccionados)
    );
  }, [opcionesLocales, seleccionados]);

  const perfilActivo =
    indicePerfil >= 0 ? perfilesDisponibles[indicePerfil] : null;

  function cambiarSeleccion(nuevos) {
    const normalizados = Array.from(
      new Set((nuevos ?? []).map(String))
    );

    setSeleccionados(normalizados);
    setModelo((actual) =>
      reemplazarSeleccionPermisos(actual, normalizados)
    );
  }

  function guardarPermisos() {
    notificar({
      tipo: 'info',
      titulo: 'Permisos pendientes de guardar',
      mensaje: `El endpoint de permisos del perfil "${
        perfilActivo?.nombre_perfil ?? '—'
      }" aún está pendiente.`,
    });
  }

  return (
    <div className={styles.pagina}>
      <PageHeader
        titulo={modeloPagina.titulo}
        descripcion="Selecciona un perfil y marca las opciones a las que podrá acceder."
        breadcrumbs={[
          {
            label: 'Seguridad',
            onClick: onNavegar ? () => onNavegar('/seguridad') : undefined,
          },
          { label: 'Permisos' },
        ]}
        badge={{ etiqueta: 'Datos locales', variante: 'warning' }}
      />

      <div className={styles.diseno}>
        <aside className={styles.selector} aria-label="Selector de perfiles">
          <div className={styles.selectorHeader}>
            <h3 className={styles.tituloSeccion}>Perfiles</h3>
            <Badge size="sm">{perfilesDisponibles.length}</Badge>
          </div>

          <div className={styles.lista}>
            {perfilesDisponibles.map((perfil) => {
              const activo = String(perfil.id) === String(perfilId);

              return (
                <button
                  key={perfil.id}
                  type="button"
                  className={cx(
                    styles.perfil,
                    activo && styles.perfilActivo
                  )}
                  onClick={() => setPerfilId(String(perfil.id))}
                  aria-pressed={activo}
                >
                  <strong>{perfil.nombre_perfil}</strong>
                  <small>
                    {perfil.descripcion || 'Sin descripción'}
                  </small>
                </button>
              );
            })}
          </div>
        </aside>

        <section className={styles.editor}>
          <div className={styles.barra}>
            <div className={styles.perfilSeleccionado}>
              <span>Perfil seleccionado</span>
              <strong>{perfilActivo?.nombre_perfil ?? '—'}</strong>
            </div>

            <div className={styles.acciones}>
              <Switch
                checked={soloLectura}
                label="Solo lectura"
                onChange={(evento) =>
                  setSoloLectura(evento.target.checked)
                }
              />
              <Button
                iconLeft="check"
                onClick={guardarPermisos}
                disabled={soloLectura}
              >
                Guardar permisos
              </Button>
            </div>
          </div>

          <PermisosTree
            opciones={opcionesLocales}
            seleccionados={seleccionados}
            onSeleccionChange={cambiarSeleccion}
            soloLectura={soloLectura}
            titulo="Opciones por subsistema"
          />
        </section>
      </div>
    </div>
  );
}

export default modelo;

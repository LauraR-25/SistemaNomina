import { useMemo, useState } from 'react';
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
  seleccionDemostracionPermisos,
} from './permisosPage.model.js';
import { generarPerfilesLocales } from './perfilesPage.model.js';
import styles from './PermisosPage.module.css';

export function PermisosPage({ onNavegar }) {
  const { notificar } = useNotificacion();
  const { perfiles, opciones } = usePermisos();

  const perfilesDisponibles = useMemo(
    () => generarPerfilesLocales(perfiles),
    [perfiles]
  );
  const opcionesLocales = useMemo(
    () => generarOpcionesLocales(opciones),
    [opciones]
  );

  const indicePerfilInicial = perfilesDisponibles.length > 0 ? 0 : -1;
  const [perfilId, setPerfilId] = useState(() =>
    indicePerfilInicial >= 0
      ? String(perfilesDisponibles[0].id)
      : null
  );
  const [seleccionados, setSeleccionados] = useState(() =>
    Array.from(
      new Set(
        seleccionDemostracionPermisos(
          opcionesLocales,
          indicePerfilInicial
        ).map(String)
      )
    )
  );
  const [soloLectura, setSoloLectura] = useState(false);

  const indicePerfil = perfilesDisponibles.findIndex(
    (perfil) => String(perfil.id) === String(perfilId)
  );
  const indicePerfilActivo = indicePerfil >= 0 ? indicePerfil : 0;

  const modeloPagina = useMemo(
    () => crearModeloPermisosPage(opcionesLocales, seleccionados),
    [opcionesLocales, seleccionados]
  );

  const perfilActivo = perfilesDisponibles[indicePerfilActivo] ?? null;

  function cambiarPerfil(indice, id) {
    const idTexto = String(id);
    setPerfilId(idTexto);
    if (idTexto === String(perfilId)) return;

    setSeleccionados(
      Array.from(
        new Set(
          seleccionDemostracionPermisos(opcionesLocales, indice).map(String)
        )
      )
    );
  }

  function cambiarSeleccion(nuevos) {
    const normalizados = Array.from(
      new Set((nuevos ?? []).map(String))
    );

    setSeleccionados(normalizados);
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
            {perfilesDisponibles.map((perfil, indice) => {
              const activo = String(perfil.id) === String(perfilId);

              return (
                <button
                  key={perfil.id}
                  type="button"
                  className={cx(
                    styles.perfil,
                    activo && styles.perfilActivo
                  )}
                  onClick={() => cambiarPerfil(indice, perfil.id)}
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

export default PermisosPage;

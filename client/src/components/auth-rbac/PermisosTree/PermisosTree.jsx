import { useEffect, useMemo, useRef } from 'react';
import { Badge, Checkbox } from '../../common/index.js';
import {
  agruparOpcionesPorSubsistema,
  alternarSeleccionGrupo,
  alternarSeleccionOpcion,
  contarOpcionesSeleccionadas,
} from './permisosTree.model.js';
import styles from './PermisosTree.module.css';

function CheckboxGrupo({ ids, seleccionados, deshabilitado, onChange }) {
  const referencia = useRef(null);
  const marcadas = ids.filter((id) =>
    seleccionados.has(String(id))
  ).length;
  const todas = ids.length > 0 && marcadas === ids.length;
  const parcial = marcadas > 0 && !todas;

  useEffect(() => {
    if (referencia.current) {
      referencia.current.indeterminate = parcial;
    }
  }, [parcial]);

  return (
    <Checkbox
      ref={referencia}
      checked={todas}
      disabled={deshabilitado}
      label={`Seleccionar grupo (${marcadas}/${ids.length})`}
      className={styles.grupoCheck}
      onChange={(evento) => onChange(evento.target.checked)}
    />
  );
}

export function PermisosTree({
  opciones = [],
  seleccionados = [],
  onSeleccionChange,
  soloLectura = false,
  readonly = false,
  titulo = 'Permisos del perfil',
}) {
  const esSoloLectura = soloLectura || readonly;
  const grupos = useMemo(
    () => agruparOpcionesPorSubsistema(opciones),
    [opciones]
  );
  const seleccionadosSet = useMemo(
    () => new Set(seleccionados.map(String)),
    [seleccionados]
  );
  const cantidadSeleccionadas = contarOpcionesSeleccionadas(
    opciones,
    seleccionados
  );

  function cambiarOpcion(opcion) {
    if (esSoloLectura) return;

    onSeleccionChange?.(
      alternarSeleccionOpcion(seleccionados, opcion.id)
    );
  }

  function cambiarGrupo(ids, marcado) {
    if (esSoloLectura) return;

    onSeleccionChange?.(
      alternarSeleccionGrupo(seleccionados, ids, marcado)
    );
  }

  const nombresGrupos = Object.keys(grupos);

  return (
    <section className={styles.arbol} aria-label={titulo}>
      <header className={styles.cabecera}>
        <div>
          <h3 className={styles.titulo}>{titulo}</h3>
          <p className={styles.descripcion}>
            {nombresGrupos.length} subsistemas · {opciones.length} opciones
          </p>
        </div>
        <Badge variant={esSoloLectura ? 'neutral' : 'accent'} size="sm">
          {cantidadSeleccionadas}/{opciones.length} seleccionadas
        </Badge>
      </header>

      {nombresGrupos.length === 0 ? (
        <p className={styles.vacio}>No hay opciones disponibles.</p>
      ) : (
        <div className={styles.grupos}>
          {nombresGrupos.map((nombreGrupo) => {
            const opcionesGrupo = grupos[nombreGrupo];
            const ids = opcionesGrupo.map((opcion) => opcion.id);

            return (
              <article key={nombreGrupo} className={styles.grupo}>
                <div className={styles.grupoHeader}>
                  <CheckboxGrupo
                    ids={ids}
                    seleccionados={seleccionadosSet}
                    deshabilitado={esSoloLectura}
                    onChange={(marcado) => cambiarGrupo(ids, marcado)}
                  />
                  <Badge variant="info" size="sm">
                    {nombreGrupo}
                  </Badge>
                </div>

                <div className={styles.opciones}>
                  {opcionesGrupo.map((opcion) => (
                    <div key={opcion.id} className={styles.opcion}>
                      <Checkbox
                        checked={seleccionadosSet.has(String(opcion.id))}
                        disabled={esSoloLectura}
                        label={
                          <span className={styles.etiquetaOpcion}>
                            <strong>{opcion.nombre}</strong>
                            {opcion.descripcion && (
                              <small>{opcion.descripcion}</small>
                            )}
                          </span>
                        }
                        onChange={() => cambiarOpcion(opcion)}
                      />
                    </div>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default PermisosTree;

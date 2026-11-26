import { useRef } from 'react';
import { Icon } from '../../../../assets/icons/Icon.jsx';
import cx from '../../../../utils/cx.js';
import styles from './Tabs.module.css';

export function Tabs({
  tabs = [],
  activeId,
  onChange,
  ariaLabel = 'Secciones',
  className,
}) {
  const lista = Array.isArray(tabs) ? tabs.filter(Boolean) : [];
  const botonesRef = useRef([]);
  const idActivo = activeId ?? lista[0]?.id;

  function seleccionar(indice) {
    const tab = lista[indice];
    if (!tab || tab.disabled) return;
    onChange?.(tab.id);
    botonesRef.current[indice]?.focus?.();
  }

  function buscarHabilitado(indice, paso) {
    if (lista.length === 0) return indice;

    let candidato = indice;
    for (let intento = 0; intento < lista.length; intento += 1) {
      candidato =
        (candidato + paso + lista.length) % lista.length;
      if (!lista[candidato].disabled) return candidato;
    }
    return indice;
  }

  function manejarTeclado(evento, indice) {
    if (evento.key === 'ArrowRight') {
      evento.preventDefault();
      seleccionar(buscarHabilitado(indice, 1));
    } else if (evento.key === 'ArrowLeft') {
      evento.preventDefault();
      seleccionar(buscarHabilitado(indice, -1));
    } else if (evento.key === 'Home') {
      evento.preventDefault();
      seleccionar(buscarHabilitado(lista.length - 1, 1));
    } else if (evento.key === 'End') {
      evento.preventDefault();
      seleccionar(buscarHabilitado(0, -1));
    }
  }

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cx(styles.tabs, className)}
    >
      {lista.map((tab, indice) => {
        const activo = tab.id === idActivo;

        return (
          <button
            key={tab.id ?? indice}
            ref={(nodo) => {
              botonesRef.current[indice] = nodo;
            }}
            type="button"
            role="tab"
            aria-selected={activo}
            tabIndex={activo ? 0 : -1}
            disabled={tab.disabled}
            className={cx(styles.tab, activo && styles.activo)}
            onClick={() => seleccionar(indice)}
            onKeyDown={(evento) => manejarTeclado(evento, indice)}
          >
            {tab.icon && (
              <span className={styles.icono} aria-hidden="true">
                {typeof tab.icon === 'string' ? (
                  <Icon name={tab.icon} size={16} />
                ) : (
                  tab.icon
                )}
              </span>
            )}
            <span>{tab.label}</span>
            {tab.badge != null && (
              <span className={styles.badge}>{tab.badge}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default Tabs;

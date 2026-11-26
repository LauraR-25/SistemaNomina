import { isValidElement, useId, useRef, useState } from 'react';
import { Icon } from '../../../../assets/icons/Icon.jsx';
import { useClickOutside } from '../../../../hooks/ui/useClickOutside.js';
import { useDisclosure } from '../../../../hooks/ui/useDisclosure.js';
import cx from '../../../../utils/cx.js';
import styles from './Dropdown.module.css';

export function Dropdown({
  disparador,
  trigger,
  items = [],
  children,
  alineacion = 'end',
  align,
  className,
}) {
  const elementoDisparador = disparador ?? trigger;
  const { abierto, abrir, cerrar } = useDisclosure(false);
  const contenedorRef = useRef(null);
  const itemsRef = useRef([]);
  const [indiceActivo, setIndiceActivo] = useState(-1);
  const menuId = useId();

  const lista = Array.isArray(items) ? items.filter(Boolean) : [];
  const habilitados = lista.reduce(
    (acumulado, item, indice) =>
      item.disabled ? acumulado : [...acumulado, indice],
    []
  );

  useClickOutside(contenedorRef, () => {
    if (abierto) {
      setIndiceActivo(-1);
      cerrar();
    }
  });

  function enfocarDisparador() {
    const raiz = contenedorRef.current?.firstElementChild;
    if (!raiz) return;

    const objetivo = raiz.matches?.('button, a, [tabindex]')
      ? raiz
      : raiz.querySelector?.('button, a, [tabindex]');
    objetivo?.focus?.();
  }

  function enfocarItem(indice) {
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(() => itemsRef.current[indice]?.focus?.());
    } else {
      setTimeout(() => itemsRef.current[indice]?.focus?.(), 0);
    }
  }

  function abrirMenu() {
    const primero = lista.findIndex((item) => !item.disabled);
    setIndiceActivo(primero);
    abrir();
    if (primero !== -1) enfocarItem(primero);
  }

  function cerrarMenu() {
    setIndiceActivo(-1);
    cerrar();
  }

  function alternarMenu() {
    if (abierto) cerrarMenu();
    else abrirMenu();
  }

  function mover(paso) {
    if (habilitados.length === 0) return;

    const posicion = habilitados.indexOf(indiceActivo);
    const siguiente =
      posicion === -1
        ? habilitados[paso > 0 ? 0 : habilitados.length - 1]
        : habilitados[
            (posicion + paso + habilitados.length) % habilitados.length
          ];

    setIndiceActivo(siguiente);
    itemsRef.current[siguiente]?.focus?.();
  }

  function manejarTeclado(evento) {
    if (evento.key === 'Escape' && abierto) {
      evento.stopPropagation();
      cerrarMenu();
      enfocarDisparador();
      return;
    }

    const esBotonNativo = evento.target?.tagName === 'BUTTON';
    const abrirConTexto =
      evento.key === 'Enter' || evento.key === ' ' || evento.key === 'Spacebar';

    if (
      !abierto &&
      (evento.key === 'ArrowDown' || (abrirConTexto && !esBotonNativo))
    ) {
      evento.preventDefault();
      abrirMenu();
      return;
    }

    if (!abierto) return;

    if (evento.key === 'ArrowDown') {
      evento.preventDefault();
      mover(1);
    } else if (evento.key === 'ArrowUp') {
      evento.preventDefault();
      mover(-1);
    } else if (evento.key === 'Home' && habilitados.length > 0) {
      evento.preventDefault();
      mover(-habilitados.length);
    } else if (evento.key === 'End' && habilitados.length > 0) {
      evento.preventDefault();
      mover(habilitados.length);
    }
  }

  let nodoDisparador;

  if (isValidElement(elementoDisparador)) {
    nodoDisparador = (
      <div
        className={styles.envoltorio}
        onClick={alternarMenu}
        aria-haspopup="menu"
        aria-expanded={abierto}
        aria-controls={abierto ? menuId : undefined}
      >
        {elementoDisparador}
      </div>
    );
  } else {
    nodoDisparador = (
      <button
        type="button"
        className={styles.disparador}
        onClick={alternarMenu}
        aria-haspopup="menu"
        aria-expanded={abierto}
        aria-controls={abierto ? menuId : undefined}
      >
        {elementoDisparador ?? 'Opciones'}
        <Icon name="chevron-down" size={14} />
      </button>
    );
  }

  const posicion = align ?? alineacion;

  return (
    <div
      ref={contenedorRef}
      className={cx(styles.contenedor, className)}
      onKeyDown={manejarTeclado}
    >
      {nodoDisparador}

      {abierto && (
        <div
          id={menuId}
          role="menu"
          aria-orientation="vertical"
          className={cx(
            styles.menu,
            posicion === 'start' ? styles.inicio : styles.fin
          )}
        >
          {children ??
            lista.map((item, indice) => (
              <button
                key={item.id ?? indice}
                ref={(nodo) => {
                  itemsRef.current[indice] = nodo;
                }}
                type="button"
                role="menuitem"
                tabIndex={indice === indiceActivo ? 0 : -1}
                disabled={item.disabled}
                className={cx(styles.item, item.danger && styles.peligro)}
                onClick={() => {
                  item.onClick?.();
                  cerrarMenu();
                  enfocarDisparador();
                }}
              >
                {item.icon && (
                  <span className={styles.icono} aria-hidden="true">
                    {typeof item.icon === 'string' ? (
                      <Icon name={item.icon} size={16} />
                    ) : (
                      item.icon
                    )}
                  </span>
                )}
                <span>{item.label}</span>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}

export default Dropdown;

import { cloneElement, isValidElement, useId, useState } from 'react';
import cx from '../../../../utils/cx.js';
import styles from './Tooltip.module.css';

/**
 * @param {{ contenido?: React.ReactNode, content?: React.ReactNode, position?: 'top'|'bottom'|'left'|'right', children?: React.ReactNode, className?: string }} props
 */
export function Tooltip({
  contenido,
  content,
  position = 'top',
  children,
  className,
}) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  const texto = contenido ?? content;

  function combinar(propia, externa) {
    return (evento) => {
      propia();
      externa?.(evento);
    };
  }

  const manejadores = {
    onMouseEnter: combinar(() => setVisible(true)),
    onMouseLeave: combinar(() => setVisible(false)),
    onFocus: combinar(() => setVisible(true)),
    onBlur: combinar(() => setVisible(false)),
  };

  const elemento = isValidElement(children)
    ? cloneElement(children, {
        'aria-describedby': [children.props['aria-describedby'], id]
          .filter(Boolean)
          .join(' '),
        tabIndex: children.props.tabIndex ?? 0,
        onMouseEnter: combinar(
          () => setVisible(true),
          children.props.onMouseEnter
        ),
        onMouseLeave: combinar(
          () => setVisible(false),
          children.props.onMouseLeave
        ),
        onFocus: combinar(() => setVisible(true), children.props.onFocus),
        onBlur: combinar(() => setVisible(false), children.props.onBlur),
      })
    : (
      <span tabIndex={0} aria-describedby={id} {...manejadores}>
        {children}
      </span>
    );

  return (
    <span className={cx(styles.contenedor, className)}>
      <span
        role="tooltip"
        id={id}
        aria-hidden={!visible}
        className={cx(styles.tooltip, styles[position], visible && styles.visible)}
      >
        {texto}
      </span>
      {elemento}
    </span>
  );
}

export default Tooltip;

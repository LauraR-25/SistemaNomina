import { isValidElement } from 'react';
import { Breadcrumbs } from '../../navigation/Breadcrumbs/Breadcrumbs.jsx';
import { Badge } from '../../ui/Badge/Badge.jsx';
import cx from '../../../../utils/cx.js';
import styles from './PageHeader.module.css';

function contenidoBadge(badge) {
  if (!badge) return null;

  if (isValidElement(badge) || typeof badge === 'string' || typeof badge === 'number') {
    return <Badge variant="accent">{badge}</Badge>;
  }

  return (
    <Badge
      variant={badge.variant ?? badge.variante ?? 'accent'}
      size={badge.size ?? badge.tamano}
      dot={badge.dot ?? badge.punto}
    >
      {badge.label ?? badge.etiqueta ?? badge.texto ?? badge.children}
    </Badge>
  );
}

export function PageHeader({
  title,
  titulo,
  description,
  descripcion,
  breadcrumbs,
  migas,
  actions,
  acciones,
  badge,
  etiqueta,
  children,
  className,
  ...props
}) {
  const ruta = breadcrumbs ?? migas;
  const etiquetaFinal = badge ?? etiqueta;
  const tituloFinal = title ?? titulo;
  const descripcionFinal = description ?? descripcion;

  return (
    <header className={cx(styles.cabecera, className)} {...props}>
      {Array.isArray(ruta) && ruta.length > 0 ? (
        <Breadcrumbs items={ruta} className={styles.ruta} />
      ) : (
        ruta && <div className={styles.ruta}>{ruta}</div>
      )}

      <div className={styles.fila}>
        <div className={styles.informacion}>
          <div className={styles.titulo}>
            <h1>{tituloFinal}</h1>
            {contenidoBadge(etiquetaFinal)}
          </div>
          {descripcionFinal && <p className={styles.descripcion}>{descripcionFinal}</p>}
          {children}
        </div>

        {(actions ?? acciones) && <div className={styles.acciones}>{actions ?? acciones}</div>}
      </div>
    </header>
  );
}

export default PageHeader;

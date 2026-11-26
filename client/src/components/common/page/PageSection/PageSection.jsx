import { Card } from '../../ui/Card/Card.jsx';
import cx from '../../../../utils/cx.js';
import styles from './PageSection.module.css';

export function PageSection({
  title,
  titulo,
  description,
  descripcion,
  actions,
  acciones,
  footer,
  pie,
  padding = 'md',
  children,
  className,
  ...props
}) {
  const encabezado = (
    <div className={styles.encabezado}>
      <h2>{title ?? titulo}</h2>
      {(description ?? descripcion) && <p>{description ?? descripcion}</p>}
    </div>
  );
  const tieneEncabezado = Boolean(title ?? titulo ?? description ?? descripcion);

  return (
    <Card
      padding={padding}
      className={cx(styles.seccion, className)}
      title={tieneEncabezado ? encabezado : undefined}
      actions={actions ?? acciones}
      footer={footer ?? pie}
      {...props}
    >
      {children}
    </Card>
  );
}

export default PageSection;

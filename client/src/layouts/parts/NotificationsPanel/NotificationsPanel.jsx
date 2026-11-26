import { Alert } from '../../../components/common/feedback/Alert/index.js';
import { EmptyState } from '../../../components/common/data/EmptyState/index.js';
import { Badge } from '../../../components/common/ui/Badge/index.js';
import { Dropdown } from '../../../components/common/overlays/Dropdown/index.js';
import { IconButton } from '../../../components/common/ui/IconButton/index.js';
import cx from '../../../utils/cx.js';
import styles from './NotificationsPanel.module.css';

export function NotificationsPanel({ className }) {
  return (
    <Dropdown
      className={cx(styles.contenedor, className)}
      disparador={
        <IconButton icon="bell" ariaLabel="Ver notificaciones" />
      }
    >
      <div className={styles.panel}>
        <div className={styles.cabecera}>
          <span className={styles.titulo}>Notificaciones</span>
          <Badge variant="accent" size="sm">
            Próximamente
          </Badge>
        </div>

        <EmptyState
          compact
          image={false}
          title="Sin notificaciones"
          message="No hay alertas disponibles en este momento."
        />

        <Alert
          variant="info"
          titulo="Próximamente"
          descripcion="Las notificaciones estarán disponibles cuando se conecte el servicio de alertas."
        />
      </div>
    </Dropdown>
  );
}

export default NotificationsPanel;

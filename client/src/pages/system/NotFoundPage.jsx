import { EmptyState } from '../../components/common/data/EmptyState/index.js';
import { Button } from '../../components/common/ui/Button/index.js';
import styles from './NotFoundPage.module.css';

export function NotFoundPage({ onVolver }) {
  return (
    <div className={styles.pagina}>
      <EmptyState
        className={styles.estado}
        variant="search"
        title="Página no encontrada"
        message="La ruta que intentas abrir no existe o ya no está disponible."
        action={
          <Button iconLeft="chevron-left" onClick={onVolver}>
            Volver al inicio
          </Button>
        }
      >
        <span className={styles.codigo}>Código: 404</span>
      </EmptyState>
    </div>
  );
}

export default NotFoundPage;

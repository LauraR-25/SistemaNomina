import { EmptyState } from '../../components/common/data/EmptyState/index.js';
import { Button } from '../../components/common/ui/Button/index.js';
import styles from './AccesoDenegadoPage.module.css';

export function AccesoDenegadoPage({ onVolver }) {
  return (
    <div className={styles.pagina}>
      <EmptyState
        className={styles.estado}
        title="Acceso denegado"
        message="Tu usuario no tiene habilitada esta opción del sistema. Si crees que es un error, contacta al administrador."
        action={
          <Button iconLeft="chevron-left" onClick={onVolver}>
            Volver al inicio
          </Button>
        }
      >
        <span className={styles.codigo}>Código: 403</span>
      </EmptyState>
    </div>
  );
}

export default AccesoDenegadoPage;

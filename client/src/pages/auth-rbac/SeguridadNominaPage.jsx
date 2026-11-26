import { SeguridadNominaPanel } from '../../components/auth-rbac/SeguridadNominaPanel/index.js';
import { AuthLayout } from '../../layouts/AuthLayout.jsx';
import styles from './SeguridadNominaPage.module.css';

export function SeguridadNominaPage({ onContinuar }) {
  return (
    <AuthLayout>
      <div className={styles.pagina}>
        <SeguridadNominaPanel onContinuar={onContinuar} />
      </div>
    </AuthLayout>
  );
}

export default SeguridadNominaPage;

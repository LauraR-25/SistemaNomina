import { Icon } from '../../../assets/icons/Icon.jsx';
import { useAuth } from '../../../hooks/auth-rbac/useAuth.js';
import cx from '../../../utils/cx.js';
import styles from './CompanyBadge.module.css';

export function CompanyBadge({ className }) {
  const { empresa } = useAuth();

  const nombre =
    empresa?.nombreComercial || empresa?.razonSocial || 'Sin empresa asignada';
  const rif = empresa?.rif || '';
  const moneda = empresa?.monedaCodigo || 'VES';

  return (
    <div className={cx(styles.badge, className)} title={nombre}>
      <span className={styles.icono} aria-hidden="true">
        <Icon name="building" size={18} />
      </span>

      <span className={styles.datos}>
        <span className={styles.nombre}>{nombre}</span>
        <span className={styles.detalle}>
          {rif && <span className={styles.rif}>RIF {rif}</span>}
          <span className={styles.moneda}>{moneda}</span>
        </span>
      </span>
    </div>
  );
}

export default CompanyBadge;

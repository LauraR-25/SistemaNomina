import { Icon } from '../assets/icons/Icon.jsx';
import { Logo } from '../components/common/ui/Logo/index.js';
import cx from '../utils/cx.js';
import styles from './AuthLayout.module.css';

const PUNTOS_VALOR = [
  {
    id: 'control',
    icono: 'shield-check',
    titulo: 'Control por empresa',
    descripcion: 'Una sola sesión para administrar cada compañía.',
  },
  {
    id: 'trazabilidad',
    icono: 'clipboard',
    titulo: 'Procesos trazables',
    descripcion: 'Cada movimiento de nómina queda registrado.',
  },
  {
    id: 'decisiones',
    icono: 'trending-up',
    titulo: 'Decisiones ágiles',
    descripcion: 'Indicadores claros para el área de RRHH.',
  },
];

export function AuthLayout({ children }) {
  return (
    <div className={styles.pantalla}>
      <aside className={styles.marca} aria-label="Acerca del sistema">
        <div className={styles.reticula} aria-hidden="true" />
        <div className={styles.contenidoMarca}>
          <Logo className={styles.logo} />

          <div className={styles.espaciado}>
            <h1 className={styles.lema}>
              La nómina de todas tus empresas, en un solo lugar.
            </h1>
            <p className={styles.introduccion}>
              Administra personas, conceptos y pagos con la misma claridad en
              cada ciclo.
            </p>
          </div>

          <ul className={styles.valores}>
            {PUNTOS_VALOR.map((punto) => (
              <li key={punto.id} className={styles.valor}>
                <span className={styles.iconoValor} aria-hidden="true">
                  <Icon name={punto.icono} size={20} />
                </span>
                <span>
                  <strong className={styles.tituloValor}>{punto.titulo}</strong>
                  <span className={styles.descripcionValor}>
                    {punto.descripcion}
                  </span>
                </span>
              </li>
            ))}
          </ul>

          <p className={styles.pieMarca}>Sistema de Nómina Multiempresa</p>
        </div>
      </aside>

      <section className={cx(styles.panel, styles.contenidoPanel)}>
        <div className={styles.tarjeta}>{children}</div>
      </section>
    </div>
  );
}

export default AuthLayout;

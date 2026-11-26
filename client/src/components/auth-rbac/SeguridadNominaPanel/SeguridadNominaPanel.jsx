import { useState } from 'react';
import { Alert } from '../../common/feedback/Alert/index.js';
import { Checkbox } from '../../common/forms/Checkbox/index.js';
import { Button } from '../../common/ui/Button/index.js';
import { useAuth } from '../../../hooks/auth-rbac/useAuth.js';
import styles from './SeguridadNominaPanel.module.css';

const COMPROMISOS = [
  'Usaré la información únicamente para fines laborales y de nómina.',
  'No compartiré datos personales, salarios ni documentos con personas no autorizadas.',
  'Reportaré cualquier incidencia de seguridad al administrador del sistema.',
];

export function SeguridadNominaPanel({ onContinuar }) {
  const { usuario, empresa, aceptarSeguridadNomina } = useAuth();
  const [aceptado, setAceptado] = useState(false);

  const nombreUsuario = usuario?.nombreCompleto || usuario?.username || '—';
  const nombreEmpresa = empresa?.nombreComercial || empresa?.razonSocial || '—';

  function continuar() {
    if (!aceptado) return;

    if (aceptarSeguridadNomina()) {
      onContinuar?.();
    }
  }

  return (
    <section className={styles.panel}>
      <header className={styles.cabecera}>
        <p className={styles.etiqueta}>Paso obligatorio</p>
        <h2 className={styles.titulo}>Seguridad de la información de nómina</h2>
        <p className={styles.descripcion}>
          Antes de ingresar, confirma que conoces tus responsabilidades sobre
          la información confidencial a la que tendrás acceso.
        </p>
      </header>

      <div className={styles.sesion}>
        <div className={styles.dato}>
          <span className={styles.etiquetaDato}>Usuario</span>
          <strong className={styles.valorDato}>{nombreUsuario}</strong>
        </div>
        <div className={styles.dato}>
          <span className={styles.etiquetaDato}>Empresa</span>
          <strong className={styles.valorDato}>{nombreEmpresa}</strong>
        </div>
      </div>

      <Alert
        variant="warning"
        titulo="Confidencialidad y responsabilidad"
        descripcion="La información de nómina es confidencial. Tu acceso queda registrado y cualquier uso indebido puede generar responsabilidades legales y laborales."
      />

      <ul className={styles.compromisos}>
        {COMPROMISOS.map((compromiso) => (
          <li key={compromiso} className={styles.compromiso}>
            {compromiso}
          </li>
        ))}
      </ul>

      <div className={styles.acciones}>
        <Checkbox
          id="seguridad-nomina-aceptada"
          checked={aceptado}
          label="He leído y acepto"
          onChange={(evento) => setAceptado(evento.target.checked)}
        />

        <Button
          type="button"
          variant="primary"
          fullWidth
          disabled={!aceptado}
          onClick={continuar}
        >
          Continuar
        </Button>
      </div>
    </section>
  );
}

export default SeguridadNominaPanel;

import { Stepper } from '../../common/feedback/Stepper/index.js';
import { StatusBadge } from '../../common/ui/StatusBadge/index.js';
import cx from '../../../utils/cx.js';
import styles from './CicloPeriodoStepper.module.css';

const PASOS = [
  { id: 'BORRADOR', label: 'Borrador' },
  { id: 'PRENOMINA', label: 'Prenómina' },
  { id: 'PROCESADO', label: 'Procesado' },
  { id: 'PAGADO', label: 'Pagado' },
];

export function CicloPeriodoStepper({ estado = 'BORRADOR' }) {
  const anulado = estado === 'ANULADO';
  const estados = anulado
    ? Object.fromEntries(PASOS.map((paso) => [paso.id, 'completado']))
    : undefined;

  return (
    <div className={cx(styles.ciclo, anulado && styles.anulado)}>
      <Stepper
        steps={PASOS}
        activeId={anulado ? 'PAGADO' : estado}
        estados={estados}
      />

      {anulado && (
        <div className={styles.terminal}>
          <StatusBadge estado="ANULADO" size="sm" />
          <span>Estado terminal del ciclo.</span>
        </div>
      )}
    </div>
  );
}

export default CicloPeriodoStepper;

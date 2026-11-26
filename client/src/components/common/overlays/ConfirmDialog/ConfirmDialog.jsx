import { Button } from '../../ui/Button/index.js';
import { Modal } from '../Modal/index.js';
import styles from './ConfirmDialog.module.css';

export function ConfirmDialog({
  titulo = '¿Confirmar acción?',
  mensaje,
  textoConfirmar = 'Confirmar',
  textoCancelar = 'Cancelar',
  variante = 'primario',
  variant,
  loading = false,
  onConfirmar,
  onCancelar,
  onClose,
  abierto = true,
}) {
  const esPeligro =
    variante === 'peligro' || variante === 'danger' || variant === 'danger';

  function cancelar() {
    if (!loading) {
      (onCancelar ?? onClose)?.();
    }
  }

  return (
    <Modal
      abierto={abierto}
      onClose={cancelar}
      titulo={titulo}
      size="sm"
      footer={
        <div className={styles.acciones}>
          <Button variant="secondary" onClick={cancelar} disabled={loading}>
            {textoCancelar}
          </Button>
          <Button
            variant={esPeligro ? 'danger' : 'primary'}
            iconLeft={esPeligro ? 'trash' : undefined}
            onClick={onConfirmar}
            loading={loading}
          >
            {textoConfirmar}
          </Button>
        </div>
      }
    >
      <p className={styles.mensaje}>{mensaje}</p>
    </Modal>
  );
}

export default ConfirmDialog;

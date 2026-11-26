import { useState } from 'react';
import { ConfirmDialog } from '../../common/overlays/ConfirmDialog/index.js';
import { Modal } from '../../common/overlays/Modal/index.js';
import { ProgressBar } from '../../common/feedback/ProgressBar/index.js';
import { Button } from '../../common/ui/Button/index.js';
import { formatMoneda } from '../../../utils/formatters.js';
import { etiquetaPeriodo, numero } from '../nominaRecibos.helpers.js';
import styles from './ProcesarNominaDialog.module.css';

export function ProcesarNominaDialog(props) {
  return (
    <ProcesarNominaDialogContenido
      key={props.abierto ? 'abierto' : 'cerrado'}
      {...props}
    />
  );
}

function ProcesarNominaDialogContenido({
  abierto = false,
  periodo,
  empleados = 0,
  netoTotal = 0,
  moneda = 'VES',
  procesando = false,
  onConfirmar,
  onCancelar,
}) {
  const [confirmado, setConfirmado] = useState(false);
  const [intento, setIntento] = useState(false);
  const cantidadEmpleados = Array.isArray(empleados)
    ? empleados.length
    : numero(empleados);

  function confirmar() {
    if (procesando) return;

    if (!confirmado) {
      setIntento(true);
      return;
    }

    onConfirmar?.();
  }

  const mensaje = (
    <>
      <span className={styles.resumen}>
        <strong>Período:</strong> {etiquetaPeriodo(periodo)}
        <br />
        <strong>Empleados:</strong>{' '}
        <span className="tabular">{cantidadEmpleados}</span>
        <br />
        <strong>Neto total:</strong>{' '}
        <span className="tabular">{formatMoneda(netoTotal, moneda)}</span>
      </span>

      <label className={styles.confirmacion}>
        <input
          type="checkbox"
          checked={confirmado}
          onChange={(evento) => {
            setConfirmado(evento.target.checked);
            setIntento(false);
          }}
          disabled={procesando}
        />
        Confirmo que deseo procesar la nómina
      </label>

      {intento && !confirmado && (
        <span className={styles.error} role="alert">
          Marca la confirmación para continuar.
        </span>
      )}
    </>
  );

  return (
    <>
      <ConfirmDialog
        abierto={abierto && !procesando}
        titulo="Procesar nómina"
        mensaje={mensaje}
        textoConfirmar="Procesar nómina"
        textoCancelar="Cancelar"
        loading={procesando}
        onConfirmar={confirmar}
        onCancelar={onCancelar}
      />

      <Modal
        abierto={abierto && procesando}
        onClose={undefined}
        titulo="Procesando nómina"
        descripcion="Estamos calculando el total de la nómina del período seleccionado."
        size="sm"
        closeOnEscape={false}
        closeOnOutsideClick={false}
      >
        <div className={styles.procesando}>
          <ProgressBar
            indeterminada
            etiqueta="Calculando asignaciones, deducciones y neto"
            mostrarPorcentaje={false}
            ariaLabel="Progreso del procesamiento de nómina"
          />
          <Button loading fullWidth disabled>
            Procesando…
          </Button>
        </div>
      </Modal>
    </>
  );
}

export default ProcesarNominaDialog;

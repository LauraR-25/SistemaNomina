import { useState } from 'react';
import { Button } from '../../common/ui/Button/index.js';
import { DateInput } from '../../common/forms/DateInput/index.js';
import { FormField } from '../../common/forms/FormField/index.js';
import { Input } from '../../common/forms/Input/index.js';
import {
  crearEstadoPeriodo,
  prepararPayloadPeriodo,
} from './periodoForm.model.js';
import styles from './PeriodoForm.module.css';

export function PeriodoForm({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
  submitLabel = 'Guardar',
}) {
  const [estado, setEstado] = useState(() =>
    crearEstadoPeriodo(initialData ?? {})
  );
  const [errorFechas, setErrorFechas] = useState('');

  function actualizar(campo, valor) {
    setEstado((actual) => ({ ...actual, [campo]: valor }));
    if (campo === 'fecha_inicio' || campo === 'fecha_fin') setErrorFechas('');
  }

  function manejarEnvio(evento) {
    evento.preventDefault();

    if (
      estado.fecha_inicio &&
      estado.fecha_fin &&
      estado.fecha_fin < estado.fecha_inicio
    ) {
      setErrorFechas('La fecha de fin debe ser igual o posterior a la de inicio.');
      return;
    }

    onSubmit?.(prepararPayloadPeriodo(estado), estado);
  }

  return (
    <form className={styles.formulario} onSubmit={manejarEnvio}>
      <FormField label="Descripción" required className={styles.completo}>
        <Input
          name="descripcion"
          value={estado.descripcion}
          onChange={(evento) => actualizar('descripcion', evento.target.value)}
          placeholder="Ej. Quincena de enero"
          required
          disabled={loading}
        />
      </FormField>

      <FormField label="Fecha de inicio" required>
        <DateInput
          name="fecha_inicio"
          value={estado.fecha_inicio}
          onChange={(evento) => actualizar('fecha_inicio', evento.target.value)}
          required
          disabled={loading}
        />
      </FormField>

      <FormField label="Fecha de fin" required error={errorFechas}>
        <DateInput
          name="fecha_fin"
          value={estado.fecha_fin}
          onChange={(evento) => actualizar('fecha_fin', evento.target.value)}
          error={Boolean(errorFechas)}
          required
          disabled={loading}
        />
      </FormField>

      <div className={styles.acciones}>
        <Button
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button type="submit" loading={loading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

export default PeriodoForm;

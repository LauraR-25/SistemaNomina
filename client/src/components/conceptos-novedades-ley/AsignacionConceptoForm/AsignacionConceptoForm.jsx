import { useState } from 'react';
import { Button } from '../../common/ui/Button/index.js';
import { Checkbox } from '../../common/forms/Checkbox/index.js';
import { DateInput } from '../../common/forms/DateInput/index.js';
import { FormField } from '../../common/forms/FormField/index.js';
import { Input } from '../../common/forms/Input/index.js';
import { Select } from '../../common/forms/Select/index.js';
import {
  TIPOS_VALOR,
  crearEstadoAsignacion,
  prepararPayloadAsignacion,
} from './asignacionConceptoForm.model.js';
import styles from './AsignacionConceptoForm.module.css';

export function AsignacionConceptoForm({
  contratoId,
  initialData,
  conceptos = [],
  onSubmit,
  onCancel,
  loading = false,
  submitLabel = 'Guardar',
  modo = 'crear',
}) {
  const [estado, setEstado] = useState(() =>
    crearEstadoAsignacion(initialData ?? {})
  );
  const esTerminacion = modo === 'terminar';

  function actualizar(campo, valor) {
    setEstado((actual) => ({ ...actual, [campo]: valor }));
  }

  function manejarEnvio(evento) {
    evento.preventDefault();
    onSubmit?.(
      prepararPayloadAsignacion(estado, { contratoId, modo }),
      estado
    );
  }

  const opcionesConceptos = conceptos.map((concepto) => ({
    value: concepto.id,
    label: `${concepto.codigo} — ${concepto.nombre}`,
  }));

  return (
    <form className={styles.formulario} onSubmit={manejarEnvio}>
      {esTerminacion ? (
        <FormField
          label="Fecha de fin"
          hint="La asignación quedará inactiva en esa fecha."
          required
        >
          <DateInput
            name="fecha_fin"
            value={estado.fecha_fin}
            min={estado.fecha_inicio || undefined}
            onChange={(evento) => actualizar('fecha_fin', evento.target.value)}
            required
            disabled={loading}
          />
        </FormField>
      ) : (
        <>
          <FormField label="Concepto" required>
            <Select
              name="concepto_id"
              value={estado.concepto_id}
              onChange={(evento) => actualizar('concepto_id', evento.target.value)}
              options={opcionesConceptos}
              placeholder="Selecciona un concepto activo"
              required
              disabled={loading || opcionesConceptos.length === 0}
            />
          </FormField>

          <FormField label="Tipo de valor" required>
            <Select
              name="tipo_valor"
              value={estado.tipo_valor}
              onChange={(evento) => actualizar('tipo_valor', evento.target.value)}
              options={TIPOS_VALOR}
              required
              disabled={loading}
            />
          </FormField>

          <FormField
            label="Valor"
            hint={
              estado.tipo_valor === 'PORCENTAJE_SALDO'
                ? 'Porcentaje entre 0 y 100.'
                : 'Cantidad expresada en la unidad del concepto.'
            }
            required
          >
            <Input
              name="valor"
              type="number"
              min="0"
              max={estado.tipo_valor === 'PORCENTAJE_SALDO' ? 100 : undefined}
              step="0.0001"
              value={estado.valor}
              onChange={(evento) => actualizar('valor', evento.target.value)}
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

          <FormField label="Fecha de fin" hint="Déjala vacía para una vigencia abierta.">
            <DateInput
              name="fecha_fin"
              value={estado.fecha_fin}
              min={estado.fecha_inicio || undefined}
              onChange={(evento) => actualizar('fecha_fin', evento.target.value)}
              disabled={loading}
            />
          </FormField>

          <Checkbox
            name="activo"
            checked={estado.activo !== false}
            onChange={(evento) => actualizar('activo', evento.target.checked)}
            disabled={loading}
          >
            Asignación activa
          </Checkbox>
        </>
      )}

      <div className={styles.acciones}>
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" loading={loading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

export default AsignacionConceptoForm;

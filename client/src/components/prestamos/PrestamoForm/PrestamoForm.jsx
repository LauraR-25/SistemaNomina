import { useState } from 'react';
import { Button } from '../../common/ui/Button/index.js';
import { DateInput } from '../../common/forms/DateInput/index.js';
import { FormField } from '../../common/forms/FormField/index.js';
import { Input } from '../../common/forms/Input/index.js';
import { Select } from '../../common/forms/Select/index.js';
import { Textarea } from '../../common/forms/Textarea/index.js';
import {
  ESTADOS_PRESTAMO,
  MODALIDADES_DESCUENTO,
  crearEstadoPrestamo,
  prepararPayloadPrestamo,
} from './prestamoForm.model.js';
import styles from './PrestamoForm.module.css';

function nombrePersona(persona) {
  return [persona.primer_nombre, persona.primer_apellido]
    .filter(Boolean)
    .join(' ');
}

export function PrestamoForm({
  initialData,
  personas = [],
  conceptos = [],
  onSubmit,
  onCancel,
  loading = false,
  submitLabel = 'Guardar',
}) {
  const [estado, setEstado] = useState(() =>
    crearEstadoPrestamo(initialData ?? {})
  );

  function actualizar(campo, valor) {
    setEstado((actual) => ({ ...actual, [campo]: valor }));
  }

  function manejarEnvio(evento) {
    evento.preventDefault();
    onSubmit?.(prepararPayloadPrestamo(estado), estado);
  }

  return (
    <form className={styles.formulario} onSubmit={manejarEnvio}>
      <FormField label="Persona" required className={styles.completo}>
        {personas.length > 0 ? (
          <Select
            name="persona_id"
            value={estado.persona_id}
            onChange={(evento) => {
              actualizar('persona_id', evento.target.value);
              actualizar('contrato_id', evento.target.value);
            }}
            options={personas.map((persona) => ({
              value: String(persona.id),
              label: `${nombrePersona(persona)} · ${persona.cedula ?? ''}`,
            }))}
            placeholder="Seleccione una persona"
            required
            disabled={loading}
          />
        ) : (
          <Input
            name="persona_id"
            value={estado.persona_id}
            onChange={(evento) => actualizar('persona_id', evento.target.value)}
            placeholder="Identificador de la persona"
            required
            disabled={loading}
          />
        )}
      </FormField>

      <FormField label="Concepto de descuento" required>
        {conceptos.length > 0 ? (
          <Select
            name="concepto_id"
            value={estado.concepto_id}
            onChange={(evento) => actualizar('concepto_id', evento.target.value)}
            options={conceptos.map((concepto) => ({
              value: String(concepto.id),
              label: concepto.nombre,
            }))}
            placeholder="Seleccione un concepto"
            required
            disabled={loading}
          />
        ) : (
          <Input
            name="concepto_id"
            value={estado.concepto_id}
            onChange={(evento) => actualizar('concepto_id', evento.target.value)}
            placeholder="Identificador del concepto"
            required
            disabled={loading}
          />
        )}
      </FormField>

      <FormField label="Monto aprobado" required>
        <Input
          name="monto_aprobado"
          type="number"
          min="0.01"
          step="0.01"
          value={estado.monto_aprobado}
          onChange={(evento) => {
            actualizar('monto_aprobado', evento.target.value);
            actualizar('monto_total', evento.target.value);
          }}
          placeholder="0.00"
          required
          disabled={loading}
        />
      </FormField>

      <FormField label="Modalidad de descuento" required>
        <Select
          name="modalidad_descuento"
          value={estado.modalidad_descuento}
          onChange={(evento) =>
            actualizar('modalidad_descuento', evento.target.value)
          }
          options={MODALIDADES_DESCUENTO}
          required
          disabled={loading}
        />
      </FormField>

      <FormField label="Número de cuotas" required>
        <Input
          name="nro_cuotas"
          type="number"
          min="1"
          step="1"
          value={estado.nro_cuotas}
          onChange={(evento) => {
            actualizar('nro_cuotas', evento.target.value);
            actualizar('cuotas', evento.target.value);
          }}
          required
          disabled={loading}
        />
      </FormField>

      <FormField label="Valor de cuota">
        <Input
          name="valor_cuota"
          type="number"
          min="0"
          step="0.01"
          value={estado.valor_cuota}
          onChange={(evento) => actualizar('valor_cuota', evento.target.value)}
          placeholder="Se calcula automáticamente"
          disabled={loading}
        />
      </FormField>

      <FormField label="Fecha de aprobación" required>
        <DateInput
          name="fecha_aprobacion"
          value={estado.fecha_aprobacion}
          onChange={(evento) => {
            actualizar('fecha_aprobacion', evento.target.value);
            actualizar('fecha_solicitud', evento.target.value);
          }}
          required
          disabled={loading}
        />
      </FormField>

      <FormField label="Inicio del descuento" required>
        <DateInput
          name="fecha_inicio_descuento"
          value={estado.fecha_inicio_descuento}
          onChange={(evento) =>
            actualizar('fecha_inicio_descuento', evento.target.value)
          }
          required
          disabled={loading}
        />
      </FormField>

      <FormField label="Estado">
        <Select
          name="estado"
          value={estado.estado}
          onChange={(evento) => actualizar('estado', evento.target.value)}
          options={ESTADOS_PRESTAMO}
          disabled={loading}
        />
      </FormField>

      <FormField label="Observación" className={styles.completo}>
        <Textarea
          name="observacion"
          value={estado.observacion}
          onChange={(evento) => actualizar('observacion', evento.target.value)}
          maxLength={250}
          rows={3}
          disabled={loading}
        />
      </FormField>

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

export default PrestamoForm;

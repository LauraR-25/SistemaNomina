import { useState } from 'react';
import { Button } from '../../common/ui/Button/index.js';
import { DateInput } from '../../common/forms/DateInput/index.js';
import { FormField } from '../../common/forms/FormField/index.js';
import { Input } from '../../common/forms/Input/index.js';
import { Select } from '../../common/forms/Select/index.js';
import { Textarea } from '../../common/forms/Textarea/index.js';
import {
  ESTADOS_HORA,
  TIPOS_HORA,
  crearEstadoHoras,
  prepararPayloadHoras,
} from './horasForm.model.js';
import styles from './HorasForm.module.css';

function nombrePersona(persona) {
  return [persona.primer_nombre, persona.primer_apellido]
    .filter(Boolean)
    .join(' ');
}

export function HorasForm({
  initialData,
  personas = [],
  periodos = [],
  onSubmit,
  onCancel,
  loading = false,
  submitLabel = 'Guardar',
}) {
  const [estado, setEstado] = useState(() =>
    crearEstadoHoras(initialData ?? {})
  );

  function actualizar(campo, valor) {
    setEstado((actual) => ({ ...actual, [campo]: valor }));
  }

  function manejarEnvio(evento) {
    evento.preventDefault();
    onSubmit?.(prepararPayloadHoras(estado), estado);
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

      <FormField label="Tipo de hora" required>
        <Select
          name="tipo_hora"
          value={estado.tipo_hora}
          onChange={(evento) => actualizar('tipo_hora', evento.target.value)}
          options={TIPOS_HORA}
          required
          disabled={loading}
        />
      </FormField>

      <FormField label="Fecha" required>
        <DateInput
          name="fecha"
          value={estado.fecha}
          onChange={(evento) => actualizar('fecha', evento.target.value)}
          required
          disabled={loading}
        />
      </FormField>

      <FormField label="Cantidad de horas" required>
        <Input
          name="horas"
          type="number"
          min="0.01"
          step="0.25"
          value={estado.horas}
          onChange={(evento) => {
            actualizar('horas', evento.target.value);
            actualizar('cantidad', evento.target.value);
          }}
          placeholder="0.00"
          required
          disabled={loading}
        />
      </FormField>

      <FormField label="Factor de recargo">
        <Input
          name="factor_recargo"
          type="number"
          min="0.0001"
          step="0.01"
          value={estado.factor_recargo}
          onChange={(evento) => actualizar('factor_recargo', evento.target.value)}
          disabled={loading}
        />
      </FormField>

      <FormField label="Período">
        {periodos.length > 0 ? (
          <Select
            name="periodo_id"
            value={estado.periodo_id}
            onChange={(evento) => actualizar('periodo_id', evento.target.value)}
            options={periodos.map((periodo) => ({
              value: String(periodo.id),
              label: periodo.nombre ?? periodo.descripcion ?? String(periodo.id),
            }))}
            placeholder="Sin período"
            disabled={loading}
          />
        ) : (
          <Input
            name="periodo_id"
            value={estado.periodo_id}
            onChange={(evento) => actualizar('periodo_id', evento.target.value)}
            placeholder="Identificador del período (opcional)"
            disabled={loading}
          />
        )}
      </FormField>

      <FormField label="Estado">
        <Select
          name="estado"
          value={estado.estado}
          onChange={(evento) => actualizar('estado', evento.target.value)}
          options={ESTADOS_HORA}
          disabled={loading}
        />
      </FormField>

      <FormField label="Descripción" className={styles.completo}>
        <Textarea
          name="descripcion"
          value={estado.descripcion}
          onChange={(evento) => actualizar('descripcion', evento.target.value)}
          maxLength={200}
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

export default HorasForm;

import { useState } from 'react';
import { Button } from '../../common/ui/Button/index.js';
import { DateInput } from '../../common/forms/DateInput/index.js';
import { FormField } from '../../common/forms/FormField/index.js';
import { Input } from '../../common/forms/Input/index.js';
import { Select } from '../../common/forms/Select/index.js';
import {
  ESTADOS_AFILIACION,
  crearEstadoAfiliacionLey,
  prepararPayloadAfiliacionLey,
} from './afiliacionLeyForm.model.js';
import styles from './AfiliacionLeyForm.module.css';

function nombrePersona(persona) {
  return [persona.primer_nombre, persona.primer_apellido]
    .filter(Boolean)
    .join(' ');
}

export function AfiliacionLeyForm({
  initialData,
  personas = [],
  tiposAporte = [],
  onSubmit,
  onCancel,
  loading = false,
  submitLabel = 'Guardar',
}) {
  const [estado, setEstado] = useState(() =>
    crearEstadoAfiliacionLey(initialData ?? {})
  );

  function actualizar(campo, valor) {
    setEstado((actual) => ({ ...actual, [campo]: valor }));
  }

  function manejarEnvio(evento) {
    evento.preventDefault();
    onSubmit?.(prepararPayloadAfiliacionLey(estado), estado);
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

      <FormField label="Tipo de aporte" required>
        {tiposAporte.length > 0 ? (
          <Select
            name="tipo_aporte_id"
            value={String(estado.tipo_aporte_id ?? '')}
            onChange={(evento) => {
              actualizar('tipo_aporte_id', evento.target.value);
              actualizar('regimen', evento.target.value);
            }}
            options={tiposAporte.map((tipo) => ({
              value: String(tipo.id),
              label: `${tipo.codigo} · ${tipo.nombre}`,
            }))}
            placeholder="Seleccione un tipo de aporte"
            required
            disabled={loading}
          />
        ) : (
          <Input
            name="regimen"
            value={estado.regimen}
            onChange={(evento) => {
              actualizar('regimen', evento.target.value);
              actualizar('tipo_aporte_id', evento.target.value);
            }}
            placeholder="Ej. IVSS"
            required
            disabled={loading}
          />
        )}
      </FormField>

      <FormField label="Número de afiliación">
        <Input
          name="nro_afiliacion"
          value={estado.nro_afiliacion}
          onChange={(evento) => actualizar('nro_afiliacion', evento.target.value)}
          placeholder="Opcional"
          maxLength={50}
          disabled={loading}
        />
      </FormField>

      <FormField label="Fecha de afiliación" required>
        <DateInput
          name="fecha_afiliacion"
          value={estado.fecha_afiliacion}
          onChange={(evento) => actualizar('fecha_afiliacion', evento.target.value)}
          required
          disabled={loading}
        />
      </FormField>

      <FormField label="Fecha de baja">
        <DateInput
          name="fecha_baja"
          value={estado.fecha_baja}
          onChange={(evento) => actualizar('fecha_baja', evento.target.value)}
          disabled={loading}
        />
      </FormField>

      <FormField label="Estado">
        <Select
          name="estado"
          value={estado.estado}
          onChange={(evento) => actualizar('estado', evento.target.value)}
          options={ESTADOS_AFILIACION}
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

export default AfiliacionLeyForm;

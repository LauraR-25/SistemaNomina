import { useState } from 'react';
import { Button } from '../../common/ui/Button/index.js';
import { DateInput } from '../../common/forms/DateInput/index.js';
import { FormField } from '../../common/forms/FormField/index.js';
import { Input } from '../../common/forms/Input/index.js';
import { Select } from '../../common/forms/Select/index.js';
import { Textarea } from '../../common/forms/Textarea/index.js';
import {
  ESTADOS_NOVEDAD,
  crearEstadoNovedad,
  prepararPayloadNovedad,
} from './novedadForm.model.js';
import styles from './NovedadForm.module.css';

function nombrePersona(persona) {
  return [persona.primer_nombre, persona.primer_apellido]
    .filter(Boolean)
    .join(' ');
}

export function NovedadForm({
  initialData,
  personas = [],
  conceptos = [],
  periodos = [],
  onSubmit,
  onCancel,
  loading = false,
  submitLabel = 'Guardar',
}) {
  const [estado, setEstado] = useState(() =>
    crearEstadoNovedad(initialData ?? {})
  );

  function actualizar(campo, valor) {
    setEstado((actual) => ({ ...actual, [campo]: valor }));
  }

  function manejarEnvio(evento) {
    evento.preventDefault();
    onSubmit?.(prepararPayloadNovedad(estado), estado);
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

      <FormField label="Concepto" required>
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

      <FormField label="Fecha de la novedad" required>
        <DateInput
          name="fecha_novedad"
          value={estado.fecha_novedad}
          onChange={(evento) => actualizar('fecha_novedad', evento.target.value)}
          required
          disabled={loading}
        />
      </FormField>

      <FormField label="Valor unitario" required>
        <Input
          name="valor"
          type="number"
          min="0"
          step="0.01"
          value={estado.valor}
          onChange={(evento) => {
            actualizar('valor', evento.target.value);
            actualizar('monto_unitario', evento.target.value);
          }}
          placeholder="0.00"
          required
          disabled={loading}
        />
      </FormField>

      <FormField label="Cantidad" required>
        <Input
          name="cantidad"
          type="number"
          min="1"
          step="1"
          value={estado.cantidad}
          onChange={(evento) => actualizar('cantidad', evento.target.value)}
          required
          disabled={loading}
        />
      </FormField>

      <FormField label="Estado">
        <Select
          name="estado"
          value={estado.estado}
          onChange={(evento) => actualizar('estado', evento.target.value)}
          options={ESTADOS_NOVEDAD}
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

export default NovedadForm;

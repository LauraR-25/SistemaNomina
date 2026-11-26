import { useState } from 'react';
import { Button } from '../../common/ui/Button/index.js';
import { DateInput } from '../../common/forms/DateInput/index.js';
import { FormField } from '../../common/forms/FormField/index.js';
import { Input } from '../../common/forms/Input/index.js';
import { Select } from '../../common/forms/Select/index.js';
import {
  crearEstadoContrato,
  prepararPayloadContrato,
} from './contratoForm.model.js';
import styles from './ContratoForm.module.css';

const TIPOS_PAGO = [
  { value: 'POR_HORA', label: 'Por hora' },
  { value: 'SALARIO_FIJO', label: 'Salario fijo' },
];

const FRECUENCIAS = [
  { value: 'SEMANAL', label: 'Semanal' },
  { value: 'QUINCENAL', label: 'Quincenal' },
  { value: 'MENSUAL', label: 'Mensual' },
];

const ESTADOS = [
  { value: 'VIGENTE', label: 'Vigente' },
  { value: 'SUSPENDIDO', label: 'Suspendido' },
  { value: 'FINALIZADO', label: 'Finalizado' },
];

const MONEDAS = [
  { value: 'VES', label: 'VES' },
  { value: 'USD', label: 'USD' },
];

function nombrePersona(persona) {
  return [persona.primer_nombre, persona.primer_apellido]
    .filter(Boolean)
    .join(' ');
}

export function ContratoForm({
  initialData,
  cargos = [],
  personas = [],
  onSubmit,
  onCancel,
  loading = false,
  submitLabel = 'Guardar',
}) {
  const [estado, setEstado] = useState(() =>
    crearEstadoContrato(initialData ?? {})
  );

  function actualizar(campo, valor) {
    setEstado((actual) => ({ ...actual, [campo]: valor }));
  }

  function cambiarCargo(evento) {
    const id = evento.target.value;
    const cargo = cargos.find((item) => String(item.id) === String(id));

    setEstado((actual) => ({
      ...actual,
      cargo_id: id,
      cargo: cargo?.nombre ?? '',
    }));
  }

  function cambiarFechaInicio(valor) {
    setEstado((actual) => ({
      ...actual,
      fecha_inicio: valor,
      fecha_ingreso: valor,
    }));
  }

  function manejarEnvio(evento) {
    evento.preventDefault();
    onSubmit?.(prepararPayloadContrato(estado), estado);
  }

  return (
    <form className={styles.formulario} onSubmit={manejarEnvio}>
      <FormField label="Persona" required className={styles.completo}>
        {personas.length > 0 ? (
          <Select
            name="persona_id"
            value={String(estado.persona_id ?? '')}
            onChange={(evento) => actualizar('persona_id', evento.target.value)}
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
            placeholder="Identificador o cédula de la persona"
            required
            disabled={loading}
          />
        )}
      </FormField>

      <FormField label="Cargo" required>
        {cargos.length > 0 ? (
          <Select
            name="cargo_id"
            value={String(estado.cargo_id ?? '')}
            onChange={cambiarCargo}
            options={cargos.map((cargo) => ({
              value: String(cargo.id),
              label: cargo.nombre,
            }))}
            placeholder="Seleccione un cargo"
            required
            disabled={loading}
          />
        ) : (
          <Input
            name="cargo"
            value={estado.cargo}
            onChange={(evento) => actualizar('cargo', evento.target.value)}
            placeholder="Nombre del cargo"
            required
            disabled={loading}
          />
        )}
      </FormField>

      <FormField label="Estado">
        <Select
          name="estado"
          value={estado.estado}
          onChange={(evento) => actualizar('estado', evento.target.value)}
          options={ESTADOS}
          disabled={loading}
        />
      </FormField>

      <FormField label="Fecha de inicio" required>
        <DateInput
          name="fecha_inicio"
          value={estado.fecha_inicio}
          onChange={(evento) => cambiarFechaInicio(evento.target.value)}
          required
          disabled={loading}
        />
      </FormField>

      <FormField label="Fecha de fin">
        <DateInput
          name="fecha_fin"
          value={estado.fecha_fin}
          onChange={(evento) => actualizar('fecha_fin', evento.target.value)}
          disabled={loading}
        />
      </FormField>

      <FormField label="Tipo de pago" required>
        <Select
          name="tipo_pago"
          value={estado.tipo_pago}
          onChange={(evento) => actualizar('tipo_pago', evento.target.value)}
          options={TIPOS_PAGO}
          required
          disabled={loading}
        />
      </FormField>

      <FormField label="Frecuencia de pago" required>
        <Select
          name="frecuencia_pago"
          value={estado.frecuencia_pago}
          onChange={(evento) => actualizar('frecuencia_pago', evento.target.value)}
          options={FRECUENCIAS}
          required
          disabled={loading}
        />
      </FormField>

      <FormField label="Horas semanales">
        <Input
          name="horas_semanales"
          type="number"
          min="0"
          step="0.25"
          value={estado.horas_semanales}
          onChange={(evento) => actualizar('horas_semanales', evento.target.value)}
          placeholder="40"
          disabled={loading}
        />
      </FormField>

      <FormField label="Salario" required>
        <Input
          name="salario_base"
          type="number"
          min="0"
          step="0.01"
          value={estado.salario_base}
          onChange={(evento) => actualizar('salario_base', evento.target.value)}
          placeholder="0.00"
          required
          disabled={loading}
        />
      </FormField>

      <FormField label="Moneda">
        <Select
          name="moneda_codigo"
          value={estado.moneda_codigo}
          onChange={(evento) => actualizar('moneda_codigo', evento.target.value)}
          options={MONEDAS}
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

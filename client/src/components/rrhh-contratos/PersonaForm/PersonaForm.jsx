import { useState } from 'react';
import { Button } from '../../common/ui/Button/index.js';
import { DateInput } from '../../common/forms/DateInput/index.js';
import { FormField } from '../../common/forms/FormField/index.js';
import { Input } from '../../common/forms/Input/index.js';
import { Select } from '../../common/forms/Select/index.js';
import {
  crearEstadoPersona,
  prepararPayloadPersona,
} from './personaForm.model.js';
import styles from './PersonaForm.module.css';

const SEXO = [
  { value: 'M', label: 'Masculino' },
  { value: 'F', label: 'Femenino' },
];

const ESTADO_CIVIL = [
  { value: 'SOLTERO', label: 'Soltero' },
  { value: 'CASADO', label: 'Casado' },
  { value: 'DIVORCIADO', label: 'Divorciado' },
  { value: 'VIUDO', label: 'Viudo' },
  { value: 'CONCUBINO', label: 'Concubino' },
];

const ESTADOS = [
  { value: 'ACTIVO', label: 'Activo' },
  { value: 'INACTIVO', label: 'Inactivo' },
];

export function PersonaForm({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
  submitLabel = 'Guardar',
}) {
  const [estado, setEstado] = useState(() =>
    crearEstadoPersona(initialData ?? {})
  );

  function actualizar(campo, valor) {
    setEstado((actual) => ({ ...actual, [campo]: valor }));
  }

  function manejarEnvio(evento) {
    evento.preventDefault();
    onSubmit?.(prepararPayloadPersona(estado), estado);
  }

  return (
    <form className={styles.formulario} onSubmit={manejarEnvio}>
      <FormField label="Cédula" required>
        <Input
          name="cedula"
          value={estado.cedula}
          onChange={(evento) => actualizar('cedula', evento.target.value)}
          placeholder="V-12345678"
          maxLength={20}
          required
          disabled={loading}
        />
      </FormField>

      <FormField label="RIF">
        <Input
          name="rif"
          value={estado.rif}
          onChange={(evento) => actualizar('rif', evento.target.value)}
          placeholder="V-12345678-0"
          maxLength={20}
          disabled={loading}
        />
      </FormField>

      <FormField label="Primer nombre" required>
        <Input
          name="primer_nombre"
          value={estado.primer_nombre}
          onChange={(evento) => actualizar('primer_nombre', evento.target.value)}
          required
          disabled={loading}
        />
      </FormField>

      <FormField label="Segundo nombre">
        <Input
          name="segundo_nombre"
          value={estado.segundo_nombre}
          onChange={(evento) => actualizar('segundo_nombre', evento.target.value)}
          disabled={loading}
        />
      </FormField>

      <FormField label="Primer apellido" required>
        <Input
          name="primer_apellido"
          value={estado.primer_apellido}
          onChange={(evento) => actualizar('primer_apellido', evento.target.value)}
          required
          disabled={loading}
        />
      </FormField>

      <FormField label="Segundo apellido">
        <Input
          name="segundo_apellido"
          value={estado.segundo_apellido}
          onChange={(evento) => actualizar('segundo_apellido', evento.target.value)}
          disabled={loading}
        />
      </FormField>

      <FormField label="Fecha de nacimiento">
        <DateInput
          name="fecha_nacimiento"
          value={estado.fecha_nacimiento}
          onChange={(evento) => actualizar('fecha_nacimiento', evento.target.value)}
          disabled={loading}
        />
      </FormField>

      <FormField label="Sexo">
        <Select
          name="sexo"
          value={estado.sexo}
          onChange={(evento) => actualizar('sexo', evento.target.value)}
          options={SEXO}
          placeholder="Seleccione el sexo"
          disabled={loading}
        />
      </FormField>

      <FormField label="Estado civil">
        <Select
          name="estado_civil"
          value={estado.estado_civil}
          onChange={(evento) => actualizar('estado_civil', evento.target.value)}
          options={ESTADO_CIVIL}
          placeholder="Seleccione el estado civil"
          disabled={loading}
        />
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

      <FormField label="Teléfono">
        <Input
          name="nro_tlf"
          value={estado.nro_tlf}
          onChange={(evento) => actualizar('nro_tlf', evento.target.value)}
          placeholder="0412-1234567"
          maxLength={20}
          disabled={loading}
        />
      </FormField>

      <FormField label="Correo electrónico">
        <Input
          name="email"
          type="email"
          value={estado.email}
          onChange={(evento) => actualizar('email', evento.target.value)}
          placeholder="nombre@correo.com"
          maxLength={120}
          disabled={loading}
        />
      </FormField>

      <FormField label="Dirección" className={styles.completo}>
        <Input
          name="direccion"
          value={estado.direccion}
          onChange={(evento) => actualizar('direccion', evento.target.value)}
          placeholder="Dirección de residencia"
          maxLength={250}
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

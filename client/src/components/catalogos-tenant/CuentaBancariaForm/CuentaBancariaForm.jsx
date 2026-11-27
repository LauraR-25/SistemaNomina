import { useState } from 'react';
import { Button } from '../../common/ui/Button/index.js';
import { Checkbox } from '../../common/forms/Checkbox/index.js';
import { FormField } from '../../common/forms/FormField/index.js';
import { Input } from '../../common/forms/Input/index.js';
import { Select } from '../../common/forms/Select/index.js';
import {
  crearEstadoCuentaBancaria,
  prepararPayloadCuentaBancaria,
} from './cuentaBancariaForm.model.js';
import styles from './CuentaBancariaForm.module.css';

const TIPOS_CUENTA = [
  { value: 'AHORRO', label: 'Ahorro' },
  { value: 'CORRIENTE', label: 'Corriente' },
];

export function CuentaBancariaForm({
  initialData,
  bancos = [],
  personas = [],
  onSubmit,
  onCancel,
  loading = false,
  submitLabel = 'Guardar',
}) {
  const [estado, setEstado] = useState(() =>
    crearEstadoCuentaBancaria(initialData ?? {})
  );

  function actualizar(campo, valor) {
    setEstado((actual) => ({ ...actual, [campo]: valor }));
  }

  function manejarEnvio(evento) {
    evento.preventDefault();
    onSubmit?.(prepararPayloadCuentaBancaria(estado), estado);
  }

  return (
    <form className={styles.formulario} onSubmit={manejarEnvio}>
      <FormField label="Persona" required>
        <Select
          name="persona_id"
          value={String(estado.persona_id ?? '')}
          onChange={(evento) => actualizar('persona_id', evento.target.value)}
          options={personas.map((persona) => ({
            value: String(persona.id),
            label: [persona.primer_nombre, persona.primer_apellido].filter(Boolean).join(' ') || persona.cedula || 'Persona',
          }))}
          placeholder="Seleccione una persona"
          required
          disabled={loading}
        />
      </FormField>

      <FormField label="Banco" required>
        <Select
          name="banco_id"
          value={String(estado.banco_id ?? '')}
          onChange={(evento) => actualizar('banco_id', evento.target.value)}
          options={bancos.map((banco) => ({
            value: String(banco.id),
            label: banco.nombre,
          }))}
          placeholder="Seleccione un banco"
          required
          disabled={loading}
        />
      </FormField>

      <FormField label="Tipo de cuenta" required>
        <Select
          name="tipo_cuenta"
          value={estado.tipo_cuenta}
          onChange={(evento) => actualizar('tipo_cuenta', evento.target.value)}
          options={TIPOS_CUENTA}
          required
          disabled={loading}
        />
      </FormField>

      <FormField label="Número de cuenta" required>
        <Input
          name="numero_cuenta"
          value={estado.numero_cuenta}
          onChange={(evento) => actualizar('numero_cuenta', evento.target.value)}
          placeholder="Número de cuenta"
          maxLength={30}
          required
          disabled={loading}
        />
      </FormField>



      <div className={styles.opciones}>
        <Checkbox
          label="Cuenta principal"
          checked={Boolean(estado.es_principal)}
          onChange={(evento) => actualizar('es_principal', evento.target.checked)}
          disabled={loading}
        />
        <Checkbox
          label="Cuenta activa"
          checked={estado.activa !== false}
          onChange={(evento) => actualizar('activa', evento.target.checked)}
          disabled={loading}
        />
      </div>

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

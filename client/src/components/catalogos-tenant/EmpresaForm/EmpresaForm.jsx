import { useState } from 'react';
import { Button } from '../../common/ui/Button/index.js';
import { FormField } from '../../common/forms/FormField/index.js';
import { Input } from '../../common/forms/Input/index.js';
import { Select } from '../../common/forms/Select/index.js';
import {
  crearEstadoEmpresa,
  prepararPayloadEmpresa,
} from './empresaForm.model.js';
import styles from './EmpresaForm.module.css';

const MONEDAS = [
  { value: 'VES', label: 'VES - Bolívar' },
  { value: 'USD', label: 'USD - Dólar' },
  { value: 'EUR', label: 'EUR - Euro' },
];

export function EmpresaForm({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
  submitLabel = 'Guardar',
}) {
  const [estado, setEstado] = useState(() => crearEstadoEmpresa(initialData ?? {}));

  function actualizar(campo, valor) {
    setEstado((actual) => ({ ...actual, [campo]: valor }));
  }

  function manejarEnvio(evento) {
    evento.preventDefault();
    onSubmit?.(prepararPayloadEmpresa(estado), estado);
  }

  return (
    <form className={styles.formulario} onSubmit={manejarEnvio}>
      <FormField label="RIF" required>
        <Input
          name="rif"
          value={estado.rif}
          onChange={(evento) => actualizar('rif', evento.target.value)}
          placeholder="J-123456789-0"
          maxLength={30}
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

      <FormField label="Razón social" required className={styles.completo}>
        <Input
          name="razon_social"
          value={estado.razon_social}
          onChange={(evento) => actualizar('razon_social', evento.target.value)}
          placeholder="Razón social de la empresa"
          maxLength={150}
          required
          disabled={loading}
        />
      </FormField>

      <FormField label="Nombre comercial" className={styles.completo}>
        <Input
          name="nombre_comercial"
          value={estado.nombre_comercial}
          onChange={(evento) => actualizar('nombre_comercial', evento.target.value)}
          placeholder="Nombre con el que opera la empresa"
          maxLength={100}
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

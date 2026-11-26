import { useState } from 'react';
import { Button } from '../../common/ui/Button/index.js';
import { Checkbox } from '../../common/forms/Checkbox/index.js';
import { FormField } from '../../common/forms/FormField/index.js';
import { Input } from '../../common/forms/Input/index.js';
import { Textarea } from '../../common/forms/Textarea/index.js';
import {
  crearEstadoCargo,
  prepararPayloadCargo,
} from './cargoForm.model.js';
import styles from './CargoForm.module.css';

export function CargoForm({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
  submitLabel = 'Guardar',
}) {
  const [estado, setEstado] = useState(() => crearEstadoCargo(initialData ?? {}));

  function actualizar(campo, valor) {
    setEstado((actual) => ({ ...actual, [campo]: valor }));
  }

  function manejarEnvio(evento) {
    evento.preventDefault();
    onSubmit?.(prepararPayloadCargo(estado), estado);
  }

  return (
    <form className={styles.formulario} onSubmit={manejarEnvio}>
      <FormField label="Nombre del cargo" required className={styles.completo}>
        <Input
          name="nombre"
          value={estado.nombre}
          onChange={(evento) => actualizar('nombre', evento.target.value)}
          placeholder="Ej. Analista de nómina"
          maxLength={100}
          required
          disabled={loading}
        />
      </FormField>

      <FormField label="Descripción" className={styles.completo}>
        <Textarea
          name="descripcion"
          rows={3}
          value={estado.descripcion}
          onChange={(evento) => actualizar('descripcion', evento.target.value)}
          placeholder="Responsabilidades principales del cargo"
          maxLength={200}
          disabled={loading}
        />
      </FormField>

      <div className={styles.opciones}>
        <Checkbox
          label="Cargo activo"
          checked={estado.activo !== false}
          onChange={(evento) => actualizar('activo', evento.target.checked)}
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

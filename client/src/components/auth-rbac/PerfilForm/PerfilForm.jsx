import { useState } from 'react';
import { FormField } from '../../common/forms/FormField/index.js';
import { Input } from '../../common/forms/Input/index.js';
import { Switch } from '../../common/forms/Switch/index.js';
import { Textarea } from '../../common/forms/Textarea/index.js';
import { Button } from '../../common/ui/Button/index.js';
import {
  crearEstadoPerfil,
  prepararPayloadPerfil,
} from './perfilForm.model.js';
import styles from './PerfilForm.module.css';

export function PerfilForm({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
  submitLabel = 'Guardar',
}) {
  const [estado, setEstado] = useState(() =>
    crearEstadoPerfil(initialData ?? {})
  );

  function actualizar(campo, valor) {
    setEstado((actual) => ({ ...actual, [campo]: valor }));
  }

  function manejarEnvio(evento) {
    evento.preventDefault();
    onSubmit?.(prepararPayloadPerfil(estado), estado);
  }

  return (
    <form className={styles.formulario} onSubmit={manejarEnvio}>
      <FormField label="Nombre del perfil" required>
        <Input
          name="nombre_perfil"
          value={estado.nombre_perfil}
          onChange={(evento) =>
            actualizar('nombre_perfil', evento.target.value)
          }
          placeholder="Ej. Analista de nómina"
          maxLength={50}
          required
          disabled={loading}
        />
      </FormField>

      <FormField label="Descripción">
        <Textarea
          name="descripcion"
          value={estado.descripcion}
          onChange={(evento) => actualizar('descripcion', evento.target.value)}
          placeholder="Describe las responsabilidades del perfil"
          maxLength={200}
          rows={3}
          disabled={loading}
        />
      </FormField>

      <Switch
        checked={estado.activo}
        disabled={loading}
        label="Perfil activo"
        description="El perfil podrá asignarse a usuarios."
        onChange={(evento) => actualizar('activo', evento.target.checked)}
      />

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

export default PerfilForm;

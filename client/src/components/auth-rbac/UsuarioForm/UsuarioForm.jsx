import { useState } from 'react';
import { Checkbox } from '../../common/forms/Checkbox/index.js';
import { FormField } from '../../common/forms/FormField/index.js';
import { Input } from '../../common/forms/Input/index.js';
import { PasswordField } from '../../common/forms/PasswordField/index.js';
import { Select } from '../../common/forms/Select/index.js';
import { Switch } from '../../common/forms/Switch/index.js';
import { Button } from '../../common/ui/Button/index.js';
import {
  alternarPerfilSeleccionado,
  crearEstadoUsuario,
  esCreacion,
  nombrePersona,
  prepararPayloadUsuario,
} from './usuarioForm.model.js';
import styles from './UsuarioForm.module.css';

export function UsuarioForm({
  initialData,
  personas = [],
  perfiles = [],
  onSubmit,
  onCancel,
  loading = false,
  submitLabel = 'Guardar',
}) {
  const [estado, setEstado] = useState(() =>
    crearEstadoUsuario(initialData ?? {})
  );
  const creando = esCreacion(estado);

  function actualizar(campo, valor) {
    setEstado((actual) => ({ ...actual, [campo]: valor }));
  }

  function manejarEnvio(evento) {
    evento.preventDefault();
    onSubmit?.(prepararPayloadUsuario(estado), estado);
  }

  const opcionesPersonas = personas.map((persona) => ({
    value: String(persona.id),
    label: persona.cedula
      ? `${nombrePersona(persona)} · ${persona.cedula}`
      : nombrePersona(persona),
  }));

  return (
    <form className={styles.formulario} onSubmit={manejarEnvio}>
      <div className={styles.rejilla}>
        <FormField label="Usuario" required>
          <Input
            name="username"
            value={estado.username}
            onChange={(evento) => actualizar('username', evento.target.value)}
            placeholder="Nombre de usuario"
            maxLength={60}
            autoComplete="username"
            required
            disabled={loading}
          />
        </FormField>

        <FormField label="Persona asociada">
          <Select
            name="persona_id"
            value={String(estado.persona_id ?? '')}
            onChange={(evento) => actualizar('persona_id', evento.target.value)}
            options={opcionesPersonas}
            placeholder="Sin persona asociada"
            disabled={loading}
          />
        </FormField>

        {creando && (
          <FormField
            label="Contraseña inicial"
            required
            hint="Solicita el cambio de clave en el primer ingreso."
            className={styles.completo}
          >
            <PasswordField
              name="password"
              value={estado.password}
              onChange={(evento) => actualizar('password', evento.target.value)}
              placeholder="Contraseña inicial"
              autoComplete="new-password"
              maxLength={72}
              required
              disabled={loading}
            />
          </FormField>
        )}
      </div>

      <div className={styles.grupo}>
        <p className={styles.tituloGrupo}>Perfiles asignados</p>

        {perfiles.length === 0 ? (
          <p className={styles.vacio}>No hay perfiles disponibles.</p>
        ) : (
          <div className={styles.perfiles}>
            {perfiles.map((perfil) => {
              const id = String(perfil.id ?? perfil.perfil_id);

              return (
                <Checkbox
                  key={id}
                  checked={estado.perfiles.includes(id)}
                  disabled={loading}
                  label={perfil.nombre_perfil ?? perfil.nombre ?? id}
                  onChange={() =>
                    setEstado((actual) => ({
                      ...actual,
                      perfiles: alternarPerfilSeleccionado(actual.perfiles, id),
                    }))
                  }
                />
              );
            })}
          </div>
        )}
      </div>

      <div className={styles.grupo}>
        <Switch
          checked={estado.activo}
          disabled={loading}
          label="Usuario activo"
          description="Permite el ingreso al sistema."
          onChange={(evento) => actualizar('activo', evento.target.checked)}
        />
        <Switch
          checked={estado.debe_cambiar_clave}
          disabled={loading}
          label="Debe cambiar la clave"
          description="Exige una nueva contraseña en el primer ingreso."
          onChange={(evento) =>
            actualizar('debe_cambiar_clave', evento.target.checked)
          }
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

export default UsuarioForm;

import { useState } from 'react';
import { Alert } from '../../common/feedback/Alert/index.js';
import { FormField } from '../../common/forms/FormField/index.js';
import { Input } from '../../common/forms/Input/index.js';
import { PasswordField } from '../../common/forms/PasswordField/index.js';
import { Button } from '../../common/ui/Button/index.js';
import {
  crearErroresLogin,
  crearEstadoLoginInicial,
  esEstadoValido,
  validarCredenciales,
} from './loginForm.model.js';
import styles from './LoginForm.module.css';

export function LoginForm({ onSubmit, loading = false, notificacion = null }) {
  const [credenciales, setCredenciales] = useState(crearEstadoLoginInicial);
  const [errores, setErrores] = useState(crearErroresLogin);

  const cargando = loading || credenciales.loading;

  function actualizarCampo(campo, valor) {
    setCredenciales((actuales) => ({ ...actuales, [campo]: valor }));

    if (errores[campo]) {
      setErrores((actuales) => ({ ...actuales, [campo]: '' }));
    }
  }

  function manejarEnvio(evento) {
    evento.preventDefault();

    const nuevosErrores = validarCredenciales(credenciales);
    setErrores(nuevosErrores);

    if (!esEstadoValido(nuevosErrores)) return;

    onSubmit?.({
      username: credenciales.username.trim(),
      password: credenciales.password,
    });
  }

  return (
    <form className={styles.formulario} onSubmit={manejarEnvio} noValidate>
      <div className={styles.cabecera}>
        <p className={styles.etiqueta}>Acceso al sistema</p>
        <h2 className={styles.titulo}>Inicia sesión</h2>
        <p className={styles.descripcion}>
          Ingresa tus credenciales para continuar con tu jornada.
        </p>
      </div>

      <div className={styles.campos}>
        <FormField label="Usuario" required error={errores.username}>
          <Input
            name="username"
            type="text"
            iconLeft="user"
            autoComplete="username"
            placeholder="Nombre de usuario"
            value={credenciales.username}
            disabled={cargando}
            error={Boolean(errores.username)}
            onChange={(evento) => actualizarCampo('username', evento.target.value)}
          />
        </FormField>

        <FormField label="Contraseña" required error={errores.password}>
          <PasswordField
            name="password"
            iconLeft="lock"
            autoComplete="current-password"
            placeholder="Tu contraseña"
            value={credenciales.password}
            disabled={cargando}
            error={Boolean(errores.password)}
            onChange={(evento) => actualizarCampo('password', evento.target.value)}
          />
        </FormField>
      </div>

      {notificacion?.mensaje && (
        <Alert
          className={styles.alerta}
          variant={notificacion.tipo === 'exito' ? 'success' : 'error'}
          titulo={notificacion.tipo === 'exito' ? 'Autenticación exitosa' : 'No se pudo acceder'}
          descripcion={notificacion.mensaje}
        />
      )}

      <Button type="submit" variant="primary" fullWidth loading={cargando}>
        {cargando ? 'Ingresando...' : 'Ingresar'}
      </Button>
    </form>
  );
}

export default LoginForm;

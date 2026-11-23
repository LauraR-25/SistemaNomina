import {
  enviarLogin,
  crearEstadoLoginInicial,
} from './components/auth-rbac/LoginForms.jsx';

export function crearEstadoAppInicial() {
  return {
    login: crearEstadoLoginInicial(),
    sesion: null,
    seguridadNominaAceptada: false,
  };
}

export async function ejecutarFlujoLogin(estadoActual, credenciales) {
  const { username, password } = credenciales;

  const estadoCargando = {
    ...estadoActual,
    login: {
      ...estadoActual.login,
      username,
      password,
      loading: true,
      notificacion: null,
    },
  };

  const resultado = await enviarLogin({ username, password });

  if (!resultado.ok) {
    return {
      ...estadoCargando,
      sesion: null,
      seguridadNominaAceptada: false,
      login: {
        ...estadoCargando.login,
        loading: false,
        notificacion: {
          tipo: 'error',
          mensaje: resultado.message,
        },
      },
    };
  }

  return {
    ...estadoCargando,
    sesion: resultado.sesion,
    seguridadNominaAceptada: false,
    login: {
      ...estadoCargando.login,
      loading: false,
      notificacion: {
        tipo: 'exito',
        mensaje: resultado.message,
      },
    },
  };
}

export function aceptarSeguridadNomina(estadoActual) {
  if (!estadoActual.sesion) {
    return estadoActual;
  }

  return {
    ...estadoActual,
    seguridadNominaAceptada: true,
  };
}

export default {
  crearEstadoAppInicial,
  ejecutarFlujoLogin,
  aceptarSeguridadNomina,
};
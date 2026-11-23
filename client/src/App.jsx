import {
  enviarLogin,
  crearEstadoLoginInicial,
} from './components/auth-rbac/LoginForms.jsx';
import { resolverRuta } from './router/AppRouter.jsx';

export function crearEstadoAppInicial(rutaInicial = '/login') {
  const login = crearEstadoLoginInicial();
  const sesion = null;
  const seguridadNominaAceptada = false;

  return {
    login,
    sesion,
    seguridadNominaAceptada,
    navegacion: resolverRuta({
      path: rutaInicial,
      sesion,
      seguridadNominaAceptada,
    }),
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
    const sesionNula = null;
    const seguridadAceptada = false;

    return {
      ...estadoCargando,
      sesion: sesionNula,
      seguridadNominaAceptada: seguridadAceptada,
      login: {
        ...estadoCargando.login,
        loading: false,
        notificacion: {
          tipo: 'error',
          mensaje: resultado.message,
        },
      },
      navegacion: resolverRuta({
        path: '/login',
        sesion: sesionNula,
        seguridadNominaAceptada: seguridadAceptada,
      }),
    };
  }

  const seguridadAceptada = false;

  return {
    ...estadoCargando,
    sesion: resultado.sesion,
    seguridadNominaAceptada: seguridadAceptada,
    login: {
      ...estadoCargando.login,
      loading: false,
      notificacion: {
        tipo: 'exito',
        mensaje: resultado.message,
      },
    },
    navegacion: resolverRuta({
      path: '/seguridad-nomina',
      sesion: resultado.sesion,
      seguridadNominaAceptada: seguridadAceptada,
    }),
  };
}

export function aceptarSeguridadNomina(estadoActual) {
  if (!estadoActual.sesion) {
    return estadoActual;
  }

  const seguridadNominaAceptada = true;

  return {
    ...estadoActual,
    seguridadNominaAceptada,
    navegacion: resolverRuta({
      path: '/inicio',
      sesion: estadoActual.sesion,
      seguridadNominaAceptada,
    }),
  };
}

export function navegarEnApp(estadoActual, rutaDestino) {
  return {
    ...estadoActual,
    navegacion: resolverRuta({
      path: rutaDestino,
      sesion: estadoActual.sesion,
      seguridadNominaAceptada: estadoActual.seguridadNominaAceptada,
    }),
  };
}

export default {
  crearEstadoAppInicial,
  ejecutarFlujoLogin,
  aceptarSeguridadNomina,
  navegarEnApp,
};
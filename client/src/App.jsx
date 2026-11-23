import {
  enviarLogin,
  crearEstadoLoginInicial,
} from './components/auth-rbac/LoginForm.jsx';
import { resolverRuta } from './router/AppRouter.jsx';
import { construirModeloLayout } from './layouts/MainLayout.jsx';
import { configurarSesionApi } from './services/api.js';

export function crearEstadoAppInicial(rutaInicial = '/login') {
  const login = crearEstadoLoginInicial();
  const sesion = null;
  const seguridadNominaAceptada = false;

  configurarSesionApi(sesion);

  const navegacion = resolverRuta({
    path: rutaInicial,
    sesion,
    seguridadNominaAceptada,
  });

  return {
    login,
    sesion,
    seguridadNominaAceptada,
    navegacion,
    layout: construirModeloLayout({
      sesion,
      seguridadNominaAceptada,
      rutaActual: navegacion.ruta,
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
    configurarSesionApi(sesionNula);

    const navegacion = resolverRuta({
      path: '/login',
      sesion: sesionNula,
      seguridadNominaAceptada: seguridadAceptada,
    });

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
      navegacion,
      layout: construirModeloLayout({
        sesion: sesionNula,
        seguridadNominaAceptada: seguridadAceptada,
        rutaActual: navegacion.ruta,
      }),
    };
  }

  const seguridadAceptada = false;
  configurarSesionApi(resultado.sesion);

  const navegacion = resolverRuta({
    path: '/seguridad-nomina',
    sesion: resultado.sesion,
    seguridadNominaAceptada: seguridadAceptada,
  });

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
    navegacion,
    layout: construirModeloLayout({
      sesion: resultado.sesion,
      seguridadNominaAceptada: seguridadAceptada,
      rutaActual: navegacion.ruta,
    }),
  };
}

export function aceptarSeguridadNomina(estadoActual) {
  if (!estadoActual.sesion) {
    return estadoActual;
  }

  const seguridadNominaAceptada = true;
  const navegacion = resolverRuta({
    path: '/inicio',
    sesion: estadoActual.sesion,
    seguridadNominaAceptada,
  });

  return {
    ...estadoActual,
    seguridadNominaAceptada,
    navegacion,
    layout: construirModeloLayout({
      sesion: estadoActual.sesion,
      seguridadNominaAceptada,
      rutaActual: navegacion.ruta,
    }),
  };
}

export function navegarEnApp(estadoActual, rutaDestino) {
  const navegacion = resolverRuta({
    path: rutaDestino,
    sesion: estadoActual.sesion,
    seguridadNominaAceptada: estadoActual.seguridadNominaAceptada,
  });

  return {
    ...estadoActual,
    navegacion,
    layout: construirModeloLayout({
      sesion: estadoActual.sesion,
      seguridadNominaAceptada: estadoActual.seguridadNominaAceptada,
      rutaActual: navegacion.ruta,
    }),
  };
}

export function cerrarSesionEnApp(rutaInicial = '/login') {
  return crearEstadoAppInicial(rutaInicial);
}

export default {
  crearEstadoAppInicial,
  ejecutarFlujoLogin,
  aceptarSeguridadNomina,
  navegarEnApp,
  cerrarSesionEnApp,
};
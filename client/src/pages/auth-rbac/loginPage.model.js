import { crearEstadoLoginInicial } from '../../components/auth-rbac/LoginForm/loginForm.model.js';
import { enviarLogin } from '../../services/auth-rbac.service.js';

export function crearModeloLoginPage() {
  return {
    titulo: 'Acceso al Sistema',
    formulario: crearEstadoLoginInicial(),
    seguridadNominaVisible: false,
    seguridadNominaAceptada: false,
    sesion: null,
  };
}

export async function procesarLoginPage(modeloActual, { username, password }) {
  const cargando = {
    ...modeloActual,
    formulario: {
      ...modeloActual.formulario,
      username,
      password,
      loading: true,
      notificacion: null,
    },
  };

  const resultado = await enviarLogin({ username, password });

  if (!resultado.ok) {
    return {
      ...cargando,
      sesion: null,
      seguridadNominaVisible: false,
      seguridadNominaAceptada: false,
      formulario: {
        ...cargando.formulario,
        loading: false,
        notificacion: {
          tipo: 'error',
          status: resultado.status,
          mensaje: resultado.message,
        },
      },
    };
  }

  return {
    ...cargando,
    sesion: resultado.sesion,
    seguridadNominaVisible: true,
    seguridadNominaAceptada: false,
    formulario: {
      ...cargando.formulario,
      loading: false,
      notificacion: {
        tipo: 'exito',
        mensaje: resultado.message,
      },
    },
  };
}

export function confirmarSeguridadNominaPage(modeloActual) {
  if (!modeloActual.sesion) {
    return modeloActual;
  }

  return {
    ...modeloActual,
    seguridadNominaVisible: false,
    seguridadNominaAceptada: true,
  };
}

export function obtenerMensajeLogin(mensaje, status) {
  if (status === 401) {
    return 'Usuario o clave incorrectos. Revisa tus credenciales e inténtalo nuevamente.';
  }

  if (status === 403) {
    return 'El usuario se encuentra inactivo. Contacta al administrador para reactivarlo.';
  }

  if (status === 423) {
    return 'Tu usuario está bloqueado temporalmente por 15 minutos tras varios intentos fallidos. Inténtalo de nuevo más tarde.';
  }

  const texto = String(mensaje ?? '').trim();

  if (/bloque|intentos fallidos|15 minutos/i.test(texto)) {
    return 'Tu usuario está bloqueado temporalmente por 15 minutos tras varios intentos fallidos. Inténtalo de nuevo más tarde.';
  }

  if (/inactiv/i.test(texto)) {
    return 'El usuario se encuentra inactivo. Contacta al administrador para reactivarlo.';
  }

  if (/incorrect|credencial|usuario|clave/i.test(texto)) {
    return 'Usuario o clave incorrectos. Revisa tus credenciales e inténtalo nuevamente.';
  }

  if (/conexi[oó]n|servidor|network|fetch|failed/i.test(texto)) {
    return 'No fue posible conectar con el servidor. Verifica tu conexión e inténtalo de nuevo.';
  }

  return texto || 'No se pudo iniciar sesión. Inténtalo de nuevo.';
}

export function resolverNotificacionLogin(notificacion, status) {
  if (!notificacion?.mensaje) return null;

  if (notificacion.tipo === 'exito') {
    return { tipo: 'exito', mensaje: 'Autenticación exitosa' };
  }

  const codigo = status ?? notificacion.status;

  return {
    tipo: 'error',
    mensaje: obtenerMensajeLogin(notificacion.mensaje, codigo),
  };
}

export default {
  crearModeloLoginPage,
  procesarLoginPage,
  confirmarSeguridadNominaPage,
  obtenerMensajeLogin,
  resolverNotificacionLogin,
};

import {
  crearEstadoLoginInicial,
  enviarLogin,
} from '../../components/auth-rbac/LoginForm.jsx';

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

export default {
  crearModeloLoginPage,
  procesarLoginPage,
  confirmarSeguridadNominaPage,
};
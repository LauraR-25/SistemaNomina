export function crearEstadoLoginInicial() {
  return {
    username: '',
    password: '',
    loading: false,
    notificacion: null,
  };
}

export function crearErroresLogin() {
  return {
    username: '',
    password: '',
  };
}

export function validarCredenciales({ username = '', password = '' }) {
  const errores = crearErroresLogin();

  if (!String(username).trim()) {
    errores.username = 'Ingresa tu usuario.';
  }

  if (!String(password).trim()) {
    errores.password = 'Ingresa tu contraseña.';
  }

  return errores;
}

export function esEstadoValido(errores) {
  return !errores.username && !errores.password;
}

export default crearEstadoLoginInicial;

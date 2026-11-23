export function validarLogin(body = {}) {
  const { username, password, empresaId } = body;
  const errores = [];

  if (!username || typeof username !== 'string' || !username.trim()) {
    errores.push('Debes ingresar el nombre de usuario.');
  }

  if (!password || typeof password !== 'string' || password.length === 0) {
    errores.push('Debes ingresar la clave.');
  }

  return {
    valido: errores.length === 0,
    errores,
    datos: {
      username: typeof username === 'string' ? username.trim() : '',
      password: password || '',
      empresaId: empresaId || null,
    },
  };
}
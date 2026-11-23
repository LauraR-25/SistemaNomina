const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function enviarLogin({ username, password }) {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();

  if (!response.ok || !data.ok) {
    return {
      ok: false,
      message: data.message || 'No se pudo iniciar sesión.',
      sesion: null,
    };
  }

  return {
    ok: true,
    message: data.message || 'Autenticación exitosa.',
    sesion: data.sesion,
  };
}

export function crearEstadoLoginInicial() {
  return {
    username: '',
    password: '',
    loading: false,
    notificacion: null,
  };
}
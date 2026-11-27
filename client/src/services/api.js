const BASE_URL =
  import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api`
    : 'http://localhost:3000/api';

let sesionActiva = null;

export function configurarSesionApi(sesion) {
  sesionActiva = sesion || null;
}

export async function peticionApi(endpoint, opciones = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(opciones.headers || {}),
  };

  if (sesionActiva?.usuario?.id) {
    headers['x-usuario-id'] = String(sesionActiva.usuario.id);
  }

  if (sesionActiva?.empresa?.id) {
    headers['x-empresa-id'] = String(sesionActiva.empresa.id);
  }

  const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const response = await fetch(url, {
    ...opciones,
    headers,
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok || (data && data.ok === false)) {
    return {
      ok: false,
      status: response.status,
      message: data?.message || 'Error en la solicitud al servidor.',
      data: data?.data ?? null,
    };
  }

  return {
    ok: true,
    status: response.status,
    message: data?.message || 'Operación exitosa.',
    data: data?.data ?? data,
  };
}

export const api = {
  get: (endpoint, headers) =>
    peticionApi(endpoint, { method: 'GET', headers }),
  post: (endpoint, body, headers) =>
    peticionApi(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
      headers,
    }),
  put: (endpoint, body, headers) =>
    peticionApi(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers,
    }),
  patch: (endpoint, body, headers) =>
    peticionApi(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
      headers,
    }),
  delete: (endpoint, headers) =>
    peticionApi(endpoint, { method: 'DELETE', headers }),
};

export default api;
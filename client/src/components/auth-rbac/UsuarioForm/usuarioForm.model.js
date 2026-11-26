export function nombrePersona(persona = {}) {
  const nombre = [
    persona.primer_nombre,
    persona.segundo_nombre,
    persona.primer_apellido,
    persona.segundo_apellido,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    nombre ||
    persona.nombre ||
    persona.nombreCompleto ||
    persona.nombre_completo ||
    persona.email ||
    '—'
  );
}

function normalizarIds(ids = []) {
  const lista = Array.isArray(ids) ? ids : [];
  const vistos = new Set();

  return lista
    .map((item) => item?.id ?? item?.perfil_id ?? item)
    .map((id) => String(id))
    .filter((id) => {
      if (!id || id === 'null' || id === 'undefined' || vistos.has(id)) {
        return false;
      }
      vistos.add(id);
      return true;
    });
}

export function crearEstadoUsuario(initialData = {}) {
  return {
    id: initialData.id ?? null,
    username: initialData.username || '',
    persona_id:
      initialData.persona_id ?? initialData.persona?.id ?? '',
    perfiles: normalizarIds(initialData.perfiles),
    activo: initialData.activo ?? true,
    debe_cambiar_clave: initialData.debe_cambiar_clave ?? true,
    password: '',
  };
}

export function esCreacion(estado = {}) {
  return !estado.id;
}

export function alternarPerfilSeleccionado(seleccionados = [], perfilId) {
  const id = String(perfilId);
  const actuales = normalizarIds(seleccionados);

  if (actuales.includes(id)) {
    return actuales.filter((item) => item !== id);
  }

  return [...actuales, id];
}

export function prepararPayloadUsuario(estado = {}) {
  const payload = {
    username: String(estado.username || '').trim(),
    persona_id: estado.persona_id || null,
    perfiles: normalizarIds(estado.perfiles),
    activo: Boolean(estado.activo),
    debe_cambiar_clave: Boolean(estado.debe_cambiar_clave),
  };

  const password = String(estado.password || '').trim();
  if (password) payload.password = password;

  return payload;
}

export default {
  nombrePersona,
  crearEstadoUsuario,
  esCreacion,
  alternarPerfilSeleccionado,
  prepararPayloadUsuario,
};

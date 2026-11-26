import { nombrePersona } from '../../components/auth-rbac/UsuarioForm/usuarioForm.model.js';

const PERFILES_PREDETERMINADOS = [
  { id: 1, nombre_perfil: 'Administrador' },
  { id: 2, nombre_perfil: 'Analista de nómina' },
  { id: 3, nombre_perfil: 'Consultor' },
];

export function crearModeloUsuariosPage(usuariosIniciales = []) {
  return {
    titulo: 'Gestión de Usuarios',
    usuarios: usuariosIniciales,
    filtro: '',
  };
}

export function filtrarUsuariosModelo(
  modeloActual,
  textoFiltro = '',
  estadoFiltro = ''
) {
  const termino = String(textoFiltro ?? '').trim().toLowerCase();
  const estado = String(estadoFiltro ?? '').trim().toUpperCase();

  const filtrados = (modeloActual?.usuarios ?? []).filter((usuario) => {
    const coincideEstado =
      !estado ||
      (estado === 'ACTIVO' && Boolean(usuario.activo)) ||
      (estado === 'INACTIVO' && !usuario.activo);

    if (!coincideEstado) return false;
    if (!termino) return true;

    const persona = usuario.persona ?? {};
    const contenido = [
      usuario.username,
      nombrePersona(persona),
      persona.cedula,
      ...(usuario.perfiles ?? []).map(
        (perfil) => perfil?.nombre_perfil ?? perfil?.nombre ?? perfil
      ),
    ]
      .join(' ')
      .toLowerCase();

    return contenido.includes(termino);
  });

  return {
    ...modeloActual,
    filtro: textoFiltro,
    usuariosFiltrados: filtrados,
  };
}

export function establecerUsuariosModelo(modeloActual, usuarios = []) {
  return {
    ...modeloActual,
    usuarios: Array.isArray(usuarios) ? usuarios : [],
  };
}

export function actualizarUsuarioModelo(modeloActual, id, cambios = {}) {
  const usuarios = Array.isArray(modeloActual?.usuarios)
    ? modeloActual.usuarios
    : [];

  if (id === null || id === undefined || id === '') {
    return {
      ...modeloActual,
      usuarios: [
        ...usuarios,
        {
          id: `usuario-local-${Date.now()}`,
          intentos_fallidos: 0,
          bloqueado_hasta: null,
          ultimo_acceso: null,
          ...cambios,
        },
      ],
    };
  }

  return {
    ...modeloActual,
    usuarios: usuarios.map((usuario) =>
      String(usuario.id) === String(id) ? { ...usuario, ...cambios } : usuario
    ),
  };
}

export function generarUsuariosLocales({
  usuario = {},
  perfiles = [],
  personas = [],
} = {}) {
  const perfilesBase =
    Array.isArray(perfiles) && perfiles.length > 0
      ? perfiles
      : PERFILES_PREDETERMINADOS;
  const idsPerfiles = perfilesBase
    .map((perfil) => perfil?.id ?? perfil?.perfil_id ?? perfil)
    .filter((id) => id !== undefined && id !== null);
  const personaUno = personas[0] ?? null;
  const personaDos = personas[1] ?? null;
  const personaTres = personas[2] ?? null;

  return [
    {
      id: 'usuario-local-1',
      username: usuario?.username || 'administrador',
      persona_id: personaUno?.id ?? null,
      persona: personaUno,
      perfiles: idsPerfiles,
      activo: true,
      debe_cambiar_clave: false,
      intentos_fallidos: 0,
      bloqueado_hasta: null,
      ultimo_acceso: '2026-11-25T10:24:00',
    },
    {
      id: 'usuario-local-2',
      username: 'analista.nomina',
      persona_id: personaDos?.id ?? null,
      persona: personaDos,
      perfiles: idsPerfiles.slice(0, 1),
      activo: true,
      debe_cambiar_clave: true,
      intentos_fallidos: 3,
      bloqueado_hasta: '2026-11-26T18:30:00',
      ultimo_acceso: '2026-11-24T16:05:00',
    },
    {
      id: 'usuario-local-3',
      username: 'auditor',
      persona_id: personaTres?.id ?? null,
      persona: personaTres,
      perfiles: [],
      activo: false,
      debe_cambiar_clave: false,
      intentos_fallidos: 0,
      bloqueado_hasta: null,
      ultimo_acceso: '2026-10-30T09:12:00',
    },
  ];
}

export default {
  crearModeloUsuariosPage,
  filtrarUsuariosModelo,
  establecerUsuariosModelo,
  actualizarUsuarioModelo,
  generarUsuariosLocales,
};

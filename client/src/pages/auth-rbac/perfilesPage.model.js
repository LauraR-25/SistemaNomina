import {
  crearEstadoPerfil,
  prepararPayloadPerfil,
} from '../../components/auth-rbac/PerfilForm/perfilForm.model.js';

const PERFILES_PREDETERMINADOS = [
  {
    id: 1,
    nombre_perfil: 'Administrador',
    descripcion: 'Acceso completo a la configuración del sistema.',
    activo: true,
  },
  {
    id: 2,
    nombre_perfil: 'Analista de nómina',
    descripcion: 'Gestión de períodos, prenómina y recibos.',
    activo: true,
  },
  {
    id: 3,
    nombre_perfil: 'Consultor',
    descripcion: 'Consulta de información sin permisos de escritura.',
    activo: true,
  },
];

export function crearModeloPerfilesPage(perfilesIniciales = []) {
  return {
    titulo: 'Gestión de Perfiles',
    perfiles: perfilesIniciales,
    formulario: crearEstadoPerfil(),
  };
}

export function agregarPerfilModelo(modeloActual, datosFormulario) {
  const nuevoPerfil = {
    id: Date.now(),
    ...prepararPayloadPerfil(datosFormulario),
  };

  return {
    ...modeloActual,
    perfiles: [...modeloActual.perfiles, nuevoPerfil],
    formulario: crearEstadoPerfil(),
  };
}

export function establecerPerfilesModelo(modeloActual, perfiles = []) {
  return {
    ...modeloActual,
    perfiles: Array.isArray(perfiles) ? perfiles : [],
  };
}

export function actualizarPerfilModelo(modeloActual, id, cambios = {}) {
  const perfiles = Array.isArray(modeloActual?.perfiles)
    ? modeloActual.perfiles
    : [];

  if (id === null || id === undefined || id === '') {
    return agregarPerfilModelo(modeloActual, cambios);
  }

  return {
    ...modeloActual,
    perfiles: perfiles.map((perfil) =>
      String(perfil.id) === String(id)
        ? { ...perfil, ...prepararPayloadPerfil({ ...perfil, ...cambios }) }
        : perfil
    ),
  };
}

export function generarPerfilesLocales(perfilesSesion = []) {
  const origen =
    Array.isArray(perfilesSesion) && perfilesSesion.length > 0
      ? perfilesSesion
      : PERFILES_PREDETERMINADOS;

  return origen.map((perfil, indice) => ({
    id: perfil.id ?? perfil.perfil_id ?? indice + 1,
    nombre_perfil:
      perfil.nombre_perfil ?? perfil.nombre ?? `Perfil ${indice + 1}`,
    descripcion: perfil.descripcion ?? '',
    activo: perfil.activo ?? true,
  }));
}

export default {
  crearModeloPerfilesPage,
  agregarPerfilModelo,
  establecerPerfilesModelo,
  actualizarPerfilModelo,
  generarPerfilesLocales,
};

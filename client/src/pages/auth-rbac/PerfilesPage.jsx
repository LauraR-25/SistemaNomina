import {
  crearEstadoPerfil,
  prepararPayloadPerfil,
} from '../../components/auth-rbac/PerfilForm.jsx';

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

export default {
  crearModeloPerfilesPage,
  agregarPerfilModelo,
};
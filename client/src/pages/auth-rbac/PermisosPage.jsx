import {
  agruparOpcionesPorSubsistema,
  alternarSeleccionOpcion,
} from '../../components/auth-rbac/PermisosTree.jsx';

export function crearModeloPermisosPage(opciones = [], seleccionados = []) {
  return {
    titulo: 'Asignación de Permisos',
    opciones,
    grupos: agruparOpcionesPorSubsistema(opciones),
    seleccionados,
  };
}

export function actualizarPermisoSeleccionado(modeloActual, opcionId) {
  const seleccionados = alternarSeleccionOpcion(
    modeloActual.seleccionados,
    opcionId
  );

  return {
    ...modeloActual,
    seleccionados,
  };
}

export default {
  crearModeloPermisosPage,
  actualizarPermisoSeleccionado,
};
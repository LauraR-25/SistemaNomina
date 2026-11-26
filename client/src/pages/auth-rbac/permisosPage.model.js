import {
  agruparOpcionesPorSubsistema,
  alternarSeleccionOpcion,
} from '../../components/auth-rbac/PermisosTree/permisosTree.model.js';

const OPCIONES_PREDETERMINADAS = [
  {
    id: 1,
    nombre: 'USUARIOS',
    descripcion: 'Consultar y administrar usuarios.',
    subsistema: 'Seguridad',
    orden: 1,
  },
  {
    id: 2,
    nombre: 'PERFILES',
    descripcion: 'Consultar y administrar perfiles.',
    subsistema: 'Seguridad',
    orden: 2,
  },
  {
    id: 3,
    nombre: 'PERMISOS',
    descripcion: 'Asignar opciones a los perfiles.',
    subsistema: 'Seguridad',
    orden: 3,
  },
  {
    id: 4,
    nombre: 'CATALOGOS',
    descripcion: 'Administrar catálogos de la empresa.',
    subsistema: 'Configuración',
    orden: 4,
  },
  {
    id: 5,
    nombre: 'RRHH',
    descripcion: 'Gestionar personal y contratos.',
    subsistema: 'Configuración',
    orden: 5,
  },
  {
    id: 6,
    nombre: 'NOMINA',
    descripcion: 'Procesar períodos y recibos.',
    subsistema: 'Operaciones',
    orden: 6,
  },
  {
    id: 7,
    nombre: 'PRESTAMOS',
    descripcion: 'Gestionar préstamos y cuotas.',
    subsistema: 'Operaciones',
    orden: 7,
  },
];

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

export function reemplazarSeleccionPermisos(modeloActual, seleccionados = []) {
  return {
    ...modeloActual,
    seleccionados: Array.isArray(seleccionados) ? [...seleccionados] : [],
  };
}

export function generarOpcionesLocales(opcionesSesion = []) {
  const origen =
    Array.isArray(opcionesSesion) && opcionesSesion.length > 0
      ? opcionesSesion
      : OPCIONES_PREDETERMINADAS;

  return origen.map((opcion, indice) => ({
    id: opcion.id ?? indice + 1,
    nombre:
      opcion.nombre ?? opcion.etiqueta ?? `Opción ${indice + 1}`,
    descripcion: opcion.descripcion ?? '',
    subsistema: opcion.subsistema ?? 'General',
    orden: opcion.orden ?? indice,
    activo: opcion.activo ?? true,
  }));
}

export function seleccionDemostracionPermisos(opciones = [], indicePerfil = 0) {
  if (indicePerfil === 0) {
    return opciones.map((opcion) => opcion.id);
  }

  if (indicePerfil === 1) {
    return opciones
      .filter((opcion, indice) => indice % 2 === 0)
      .map((opcion) => opcion.id);
  }

  return [];
}

export default {
  crearModeloPermisosPage,
  actualizarPermisoSeleccionado,
  reemplazarSeleccionPermisos,
  generarOpcionesLocales,
  seleccionDemostracionPermisos,
};

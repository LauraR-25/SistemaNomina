import { evaluarAccesoRuta } from './ProtectedRoute.jsx';

export const RUTAS_APP = [
  {
    path: '/login',
    vista: 'LoginPage',
    protegida: false,
    requiereSeguridadNomina: false,
  },
  {
    path: '/seguridad-nomina',
    vista: 'SeguridadNominaPage',
    protegida: true,
    requiereSeguridadNomina: false,
  },
  {
    path: '/inicio',
    vista: 'DashboardPage',
    protegida: true,
    requiereSeguridadNomina: true,
  },
  {
    path: '/catalogos',
    vista: 'CatalogosPage',
    protegida: true,
    requiereSeguridadNomina: true,
    opcionRequerida: 'CATALOGOS',
  },
  {
    path: '/rrhh',
    vista: 'RrhhPage',
    protegida: true,
    requiereSeguridadNomina: true,
    opcionRequerida: 'RRHH',
  },
  {
    path: '/conceptos',
    vista: 'ConceptosPage',
    protegida: true,
    requiereSeguridadNomina: true,
    opcionRequerida: 'CONCEPTOS',
  },
  {
    path: '/nomina',
    vista: 'NominaPage',
    protegida: true,
    requiereSeguridadNomina: true,
    opcionRequerida: 'NOMINA',
  },
  {
    path: '/prestamos',
    vista: 'PrestamosPage',
    protegida: true,
    requiereSeguridadNomina: true,
    opcionRequerida: 'PRESTAMOS',
  },
];

export function resolverRuta({
  path = '/login',
  sesion = null,
  seguridadNominaAceptada = false,
}) {
  const rutaEncontrada =
    RUTAS_APP.find((r) => r.path === path) || RUTAS_APP[0];

  if (!rutaEncontrada.protegida) {
    return {
      ruta: rutaEncontrada.path,
      vista: rutaEncontrada.vista,
      acceso: { permitido: true, motivo: 'PUBLICA' },
    };
  }

  const acceso = evaluarAccesoRuta({
    sesion,
    seguridadNominaAceptada,
    requiereSeguridadNomina: rutaEncontrada.requiereSeguridadNomina,
    perfilesRequeridos: rutaEncontrada.perfilesRequeridos || [],
    opcionRequerida: rutaEncontrada.opcionRequerida || null,
  });

  if (!acceso.permitido) {
    const fallback =
      RUTAS_APP.find((r) => r.path === acceso.redirigirA) || RUTAS_APP[0];
    return {
      ruta: fallback.path,
      vista: fallback.vista,
      acceso,
    };
  }

  return {
    ruta: rutaEncontrada.path,
    vista: rutaEncontrada.vista,
    acceso,
  };
}

export default resolverRuta;
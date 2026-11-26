export const ENTRADA_INICIO = {
  id: 'inicio',
  opcionRequerida: null,
  ruta: '/inicio',
  etiqueta: 'Inicio',
  icono: 'dashboard',
  subitems: [],
};

export const MODULOS_NAVEGACION = [
  {
    id: 'catalogos',
    opcionRequerida: 'CATALOGOS',
    ruta: '/catalogos',
    etiqueta: 'Catálogos',
    icono: 'building',
    subitems: [
      { id: 'empresas', etiqueta: 'Empresas', icono: 'building' },
      { id: 'bancos', etiqueta: 'Bancos', icono: 'bank' },
      { id: 'cuentas-bancarias', etiqueta: 'Cuentas bancarias', icono: 'credit-card' },
    ],
  },
  {
    id: 'rrhh',
    opcionRequerida: 'RRHH',
    ruta: '/rrhh',
    etiqueta: 'RRHH',
    icono: 'users',
    subitems: [
      { id: 'personas', etiqueta: 'Personas', icono: 'users' },
      { id: 'cargos', etiqueta: 'Cargos', icono: 'briefcase' },
      { id: 'contratos', etiqueta: 'Contratos', icono: 'file-text' },
    ],
  },
  {
    id: 'conceptos',
    opcionRequerida: 'CONCEPTOS',
    ruta: '/conceptos',
    etiqueta: 'Conceptos',
    icono: 'clipboard',
    subitems: [
      { id: 'conceptos', etiqueta: 'Conceptos', icono: 'clipboard' },
      { id: 'novedades', etiqueta: 'Novedades', icono: 'file-text' },
      { id: 'registro-horas', etiqueta: 'Registro de horas', icono: 'clock' },
      { id: 'aportes-ley', etiqueta: 'Aportes de ley', icono: 'percent' },
    ],
  },
  {
    id: 'nomina',
    opcionRequerida: 'NOMINA',
    ruta: '/nomina',
    etiqueta: 'Nómina',
    icono: 'wallet',
    subitems: [
      { id: 'periodos', etiqueta: 'Períodos', icono: 'calendar' },
      { id: 'prenomina', etiqueta: 'Prenómina', icono: 'clipboard' },
      { id: 'recibos', etiqueta: 'Recibos', icono: 'receipt' },
    ],
  },
  {
    id: 'prestamos',
    opcionRequerida: 'PRESTAMOS',
    ruta: '/prestamos',
    etiqueta: 'Préstamos',
    icono: 'credit-card',
    subitems: [
      { id: 'prestamos', etiqueta: 'Préstamos', icono: 'wallet' },
      { id: 'cuotas', etiqueta: 'Cuotas', icono: 'calendar' },
    ],
  },
  // TODO: el nombre real de la opción debe confirmarse con la tabla opcion; aún no existe en RUTAS_APP y no debes modificar RUTAS_APP.
  {
    id: 'seguridad',
    opcionRequerida: 'SEGURIDAD',
    ruta: '/seguridad',
    etiqueta: 'Seguridad',
    icono: 'shield',
    subitems: [
      { id: 'usuarios', etiqueta: 'Usuarios', icono: 'user' },
      { id: 'perfiles', etiqueta: 'Perfiles', icono: 'users' },
      { id: 'permisos', etiqueta: 'Permisos', icono: 'key' },
    ],
  },
];

export const INICIO = ENTRADA_INICIO;
export const MODULOS = MODULOS_NAVEGACION;
export const NAVEGACION = MODULOS_NAVEGACION;

export function obtenerMenuParaSesion(sesion) {
  const opciones = Array.isArray(sesion?.opciones)
    ? sesion.opciones.filter(Boolean)
    : [];

  const opcionesPorNombre = new Map();
  opciones.forEach((opcion) => {
    if (opcion?.nombre) {
      opcionesPorNombre.set(opcion.nombre, opcion);
    }
  });

  const modulosPermitidos = MODULOS_NAVEGACION.filter((modulo) =>
    opcionesPorNombre.has(modulo.opcionRequerida)
  ).map((modulo) => {
    const opcion = opcionesPorNombre.get(modulo.opcionRequerida);
    const orden = Number(opcion.orden);

    return {
      ...modulo,
      subsistema: opcion.subsistema || modulo.etiqueta,
      descripcion: opcion.descripcion || '',
      orden: Number.isFinite(orden) ? orden : 0,
    };
  });

  const menu = [
    { ...ENTRADA_INICIO, subsistema: 'General', descripcion: '', orden: -1 },
    ...modulosPermitidos,
  ];

  const haySubsistemas = opciones.some((opcion) => Boolean(opcion.subsistema));

  if (!haySubsistemas) return menu;

  const grupos = new Map();

  menu.forEach((modulo) => {
    const nombre = modulo.subsistema || 'General';

    if (!grupos.has(nombre)) {
      grupos.set(nombre, {
        id: nombre,
        subsistema: nombre,
        etiqueta: nombre,
        modulos: [],
      });
    }

    grupos.get(nombre).modulos.push(modulo);
  });

  return [...grupos.values()]
    .map((grupo) => ({
      ...grupo,
      modulos: [...grupo.modulos].sort(
        (a, b) => a.orden - b.orden || a.etiqueta.localeCompare(b.etiqueta, 'es')
      ),
    }))
    .sort(
      (a, b) =>
        Math.min(...a.modulos.map((modulo) => modulo.orden)) -
        Math.min(...b.modulos.map((modulo) => modulo.orden))
    );
}

export default {
  ENTRADA_INICIO,
  MODULOS_NAVEGACION,
  obtenerMenuParaSesion,
};

import {
  crearEstadoAfiliacionLey,
  prepararPayloadAfiliacionLey,
} from '../../components/conceptos-novedades-ley/AfiliacionLeyForm/index.js';

export const TIPOS_APORTE_INICIALES = [
  {
    id: 1,
    codigo: 'IVSS',
    nombre: 'Instituto Venezolano de los Seguros Sociales',
    activo: true,
  },
  {
    id: 2,
    codigo: 'FAOV',
    nombre: 'Fondo de Ahorro Obligatorio para la Vivienda',
    activo: true,
  },
  {
    id: 3,
    codigo: 'INCES',
    nombre: 'Instituto Nacional de Capacitación y Educación Socialista',
    activo: true,
  },
];

export const PARAMETROS_APORTE_INICIALES = [
  {
    id: 1,
    tipo_aporte_id: 1,
    tipo: 'IVSS',
    vigente_desde: '2024-01-01',
    vigente_hasta: null,
    porcentaje_empleado: 4,
    porcentaje_patronal: 9,
    tope_salario_base: null,
    activo: true,
  },
  {
    id: 2,
    tipo_aporte_id: 2,
    tipo: 'FAOV',
    vigente_desde: '2024-01-01',
    vigente_hasta: null,
    porcentaje_empleado: 1,
    porcentaje_patronal: 2,
    tope_salario_base: null,
    activo: true,
  },
];

export function crearModeloAportesLeyPage(
  afiliaciones = [],
  tiposAporte = TIPOS_APORTE_INICIALES,
  parametrosAporte = PARAMETROS_APORTE_INICIALES
) {
  return {
    titulo: 'Aportes y Afiliaciones de Ley',
    afiliaciones,
    tiposAporte,
    parametrosAporte,
    formulario: crearEstadoAfiliacionLey(),
  };
}

export function agregarAfiliacionLeyModelo(modeloActual, datosFormulario) {
  const nuevaAfiliacion = {
    id: `afiliacion-local-${Date.now()}`,
    ...prepararPayloadAfiliacionLey(datosFormulario),
  };

  return {
    ...modeloActual,
    afiliaciones: [...modeloActual.afiliaciones, nuevaAfiliacion],
    formulario: crearEstadoAfiliacionLey(),
  };
}

export function actualizarAfiliacionLeyModelo(modeloActual, datosFormulario) {
  return {
    ...modeloActual,
    afiliaciones: modeloActual.afiliaciones.map((afiliacion) =>
      String(afiliacion.id) === String(datosFormulario.id)
        ? {
            ...afiliacion,
            ...prepararPayloadAfiliacionLey(datosFormulario),
          }
        : afiliacion
    ),
    formulario: crearEstadoAfiliacionLey(),
  };
}

export function eliminarAfiliacionLeyModelo(modeloActual, id) {
  return {
    ...modeloActual,
    afiliaciones: modeloActual.afiliaciones.filter(
      (afiliacion) => String(afiliacion.id) !== String(id)
    ),
  };
}

export default {
  crearModeloAportesLeyPage,
  agregarAfiliacionLeyModelo,
  actualizarAfiliacionLeyModelo,
  eliminarAfiliacionLeyModelo,
  TIPOS_APORTE_INICIALES,
  PARAMETROS_APORTE_INICIALES,
};

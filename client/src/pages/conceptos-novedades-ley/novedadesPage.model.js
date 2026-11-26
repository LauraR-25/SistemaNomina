import {
  crearEstadoNovedad,
  prepararPayloadNovedad,
} from '../../components/conceptos-novedades-ley/NovedadForm/index.js';

export function crearModeloNovedadesPage(novedades = []) {
  return {
    titulo: 'Novedades de Nómina',
    novedades,
    formulario: crearEstadoNovedad(),
  };
}

export function agregarNovedadModelo(modeloActual, datosFormulario) {
  const nuevaNovedad = {
    id: `novedad-local-${Date.now()}`,
    ...prepararPayloadNovedad(datosFormulario),
  };

  return {
    ...modeloActual,
    novedades: [...modeloActual.novedades, nuevaNovedad],
    formulario: crearEstadoNovedad(),
  };
}

export function actualizarNovedadModelo(modeloActual, datosFormulario) {
  return {
    ...modeloActual,
    novedades: modeloActual.novedades.map((novedad) =>
      String(novedad.id) === String(datosFormulario.id)
        ? { ...novedad, ...prepararPayloadNovedad(datosFormulario) }
        : novedad
    ),
    formulario: crearEstadoNovedad(),
  };
}

export function cambiarEstadoNovedadModelo(modeloActual, id, estado) {
  return {
    ...modeloActual,
    novedades: modeloActual.novedades.map((novedad) =>
      String(novedad.id) === String(id) ? { ...novedad, estado } : novedad
    ),
  };
}

export function eliminarNovedadModelo(modeloActual, id) {
  return {
    ...modeloActual,
    novedades: modeloActual.novedades.filter(
      (novedad) => String(novedad.id) !== String(id)
    ),
  };
}

export default {
  crearModeloNovedadesPage,
  agregarNovedadModelo,
  actualizarNovedadModelo,
  cambiarEstadoNovedadModelo,
  eliminarNovedadModelo,
};

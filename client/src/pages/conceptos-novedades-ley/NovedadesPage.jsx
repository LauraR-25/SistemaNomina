import {
  crearEstadoNovedad,
  prepararPayloadNovedad,
} from '../../components/conceptos-novedades-ley/NovedadForm.jsx';

export function crearModeloNovedadesPage(novedades = []) {
  return {
    titulo: 'Novedades de Nómina',
    novedades,
    formulario: crearEstadoNovedad(),
  };
}

export function agregarNovedadModelo(modeloActual, datosFormulario) {
  const nuevaNovedad = {
    id: Date.now(),
    ...prepararPayloadNovedad(datosFormulario),
  };

  return {
    ...modeloActual,
    novedades: [...modeloActual.novedades, nuevaNovedad],
    formulario: crearEstadoNovedad(),
  };
}

export default {
  crearModeloNovedadesPage,
  agregarNovedadModelo,
};
import {
  crearEstadoAfiliacionLey,
  prepararPayloadAfiliacionLey,
} from '../../components/conceptos-novedades-ley/AfiliacionLeyForm.jsx';

export function crearModeloAportesLeyPage(afiliaciones = []) {
  return {
    titulo: 'Aportes y Afiliaciones de Ley',
    afiliaciones,
    formulario: crearEstadoAfiliacionLey(),
  };
}

export function agregarAfiliacionLeyModelo(modeloActual, datosFormulario) {
  const nuevaAfiliacion = {
    id: Date.now(),
    ...prepararPayloadAfiliacionLey(datosFormulario),
  };

  return {
    ...modeloActual,
    afiliaciones: [...modeloActual.afiliaciones, nuevaAfiliacion],
    formulario: crearEstadoAfiliacionLey(),
  };
}

export default {
  crearModeloAportesLeyPage,
  agregarAfiliacionLeyModelo,
};
import {
  crearEstadoHoras,
  prepararPayloadHoras,
} from '../../components/conceptos-novedades-ley/HorasForm.jsx';

export function crearModeloRegistroHorasPage(registros = []) {
  return {
    titulo: 'Registro de Horas',
    registros,
    formulario: crearEstadoHoras(),
  };
}

export function agregarRegistroHorasModelo(modeloActual, datosFormulario) {
  const nuevoRegistro = {
    id: Date.now(),
    ...prepararPayloadHoras(datosFormulario),
  };

  return {
    ...modeloActual,
    registros: [...modeloActual.registros, nuevoRegistro],
    formulario: crearEstadoHoras(),
  };
}

export default {
  crearModeloRegistroHorasPage,
  agregarRegistroHorasModelo,
};
import {
  crearEstadoHoras,
  prepararPayloadHoras,
} from '../../components/conceptos-novedades-ley/HorasForm/index.js';

export function crearModeloRegistroHorasPage(registros = []) {
  return {
    titulo: 'Registro de Horas',
    registros,
    formulario: crearEstadoHoras(),
  };
}

export function agregarRegistroHorasModelo(modeloActual, datosFormulario) {
  const nuevoRegistro = {
    id: `hora-local-${Date.now()}`,
    ...prepararPayloadHoras(datosFormulario),
  };

  return {
    ...modeloActual,
    registros: [...modeloActual.registros, nuevoRegistro],
    formulario: crearEstadoHoras(),
  };
}

export function actualizarRegistroHorasModelo(modeloActual, datosFormulario) {
  return {
    ...modeloActual,
    registros: modeloActual.registros.map((registro) =>
      String(registro.id) === String(datosFormulario.id)
        ? { ...registro, ...prepararPayloadHoras(datosFormulario) }
        : registro
    ),
    formulario: crearEstadoHoras(),
  };
}

export function cambiarEstadoHoraModelo(modeloActual, id, estado) {
  return {
    ...modeloActual,
    registros: modeloActual.registros.map((registro) =>
      String(registro.id) === String(id) ? { ...registro, estado } : registro
    ),
  };
}

export function eliminarRegistroHorasModelo(modeloActual, id) {
  return {
    ...modeloActual,
    registros: modeloActual.registros.filter(
      (registro) => String(registro.id) !== String(id)
    ),
  };
}

export function calcularTotalesHoras(registros = []) {
  const lista = Array.isArray(registros) ? registros : [];

  return lista.reduce(
    (totales, registro) => {
      const horas = Number(registro.horas ?? registro.cantidad ?? 0);
      const tipo = registro.tipo_hora === 'EXTRA' ? 'EXTRA' : 'ORDINARIA';

      return {
        ...totales,
        [tipo]: totales[tipo] + (Number.isFinite(horas) ? horas : 0),
        total: totales.total + (Number.isFinite(horas) ? horas : 0),
      };
    },
    { ORDINARIA: 0, EXTRA: 0, total: 0 }
  );
}

export default {
  crearModeloRegistroHorasPage,
  agregarRegistroHorasModelo,
  actualizarRegistroHorasModelo,
  cambiarEstadoHoraModelo,
  eliminarRegistroHorasModelo,
  calcularTotalesHoras,
};

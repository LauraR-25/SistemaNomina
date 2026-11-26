import { api } from '../../services/api.js';
import {
  crearEstadoConcepto,
  prepararPayloadConcepto,
} from '../../components/conceptos-novedades-ley/ConceptoForm/index.js';

export function crearModeloConceptosPage(conceptos = []) {
  return {
    titulo: 'Conceptos de Nómina',
    conceptos,
    formulario: crearEstadoConcepto(),
    mensaje: null,
  };
}

export function establecerConceptosModelo(modeloActual, conceptos = []) {
  return {
    ...modeloActual,
    conceptos,
  };
}

export function agregarConceptoModelo(modeloActual, datosFormulario) {
  return {
    ...modeloActual,
    conceptos: [
      ...modeloActual.conceptos,
      { id: `concepto-local-${Date.now()}`, ...datosFormulario },
    ],
    formulario: crearEstadoConcepto(),
  };
}

export function actualizarConceptoModelo(modeloActual, datosFormulario) {
  return {
    ...modeloActual,
    conceptos: modeloActual.conceptos.map((concepto) =>
      String(concepto.id) === String(datosFormulario.id)
        ? { ...concepto, ...datosFormulario }
        : concepto
    ),
    formulario: crearEstadoConcepto(),
  };
}

export function desactivarConceptoModelo(modeloActual, id) {
  return {
    ...modeloActual,
    conceptos: modeloActual.conceptos.map((concepto) =>
      String(concepto.id) === String(id)
        ? { ...concepto, activo: false }
        : concepto
    ),
  };
}

export async function registrarConceptoPage(modeloActual, datosFormulario) {
  const payload = prepararPayloadConcepto(datosFormulario);
  const respuesta = await api.post('/conceptos/conceptos', payload);

  if (!respuesta.ok) {
    return {
      ...modeloActual,
      mensaje: { tipo: 'error', texto: respuesta.message },
    };
  }

  return {
    ...modeloActual,
    conceptos: [...modeloActual.conceptos, respuesta.data],
    formulario: crearEstadoConcepto(),
    mensaje: { tipo: 'exito', texto: respuesta.message },
  };
}

export default {
  crearModeloConceptosPage,
  establecerConceptosModelo,
  agregarConceptoModelo,
  actualizarConceptoModelo,
  desactivarConceptoModelo,
  registrarConceptoPage,
};

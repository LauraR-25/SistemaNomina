import {
  crearEstadoConcepto,
  prepararPayloadConcepto,
} from '../../components/conceptos-novedades-ley/ConceptoForm.jsx';
import { api } from '../../services/api.js';

export function crearModeloConceptosPage(conceptos = []) {
  return {
    titulo: 'Conceptos de Nómina',
    conceptos,
    formulario: crearEstadoConcepto(),
    mensaje: null,
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
  registrarConceptoPage,
};
import {
  crearEstadoPersona,
  prepararPayloadPersona,
} from '../../components/rrhh-contratos/PersonaForm.jsx';
import { ordenarHistorialSalarios } from '../../components/rrhh-contratos/SalarioHistorial.jsx';
import { api } from '../../services/api.js';

export function crearModeloPersonasPage(personas = [], historialSalarios = []) {
  return {
    titulo: 'Personas y Empleados',
    personas,
    historialSalarios: ordenarHistorialSalarios(historialSalarios),
    formulario: crearEstadoPersona(),
    mensaje: null,
  };
}

export async function registrarPersonaPage(modeloActual, datosFormulario) {
  const payload = prepararPayloadPersona(datosFormulario);
  const respuesta = await api.post('/rrhh/personas', payload);

  if (!respuesta.ok) {
    return {
      ...modeloActual,
      mensaje: { tipo: 'error', texto: respuesta.message },
    };
  }

  return {
    ...modeloActual,
    personas: [...modeloActual.personas, respuesta.data],
    formulario: crearEstadoPersona(),
    mensaje: { tipo: 'exito', texto: respuesta.message },
  };
}

export default {
  crearModeloPersonasPage,
  registrarPersonaPage,
};
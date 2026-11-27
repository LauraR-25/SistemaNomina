import { crearEstadoPersona, prepararPayloadPersona } from '../../components/rrhh-contratos/PersonaForm/index.js';
import { ordenarHistorialSalarios } from '../../components/rrhh-contratos/SalarioHistorial/index.js';

export function crearModeloPersonasPage(personas = [], historialSalarios = []) {
  return {
    titulo: 'Personas y Empleados',
    personas,
    historialSalarios: ordenarHistorialSalarios(historialSalarios),
    formulario: crearEstadoPersona(),
    mensaje: null,
  };
}

export async function registrarPersonaPage(modeloActual, datosFormulario, crearPersona) {
  const payload = prepararPayloadPersona(datosFormulario);
  try {
    const respuesta = await crearPersona(payload);
    return {
      ...modeloActual,
      personas: respuesta?.data ? [...modeloActual.personas, respuesta.data] : modeloActual.personas,
      formulario: crearEstadoPersona(),
      mensaje: { tipo: 'exito', texto: respuesta?.message || 'Persona registrada.' },
    };
  } catch (err) {
    return { ...modeloActual, mensaje: { tipo: 'error', texto: err.message || 'No se pudo registrar la persona.' } };
  }
}

export default { crearModeloPersonasPage, registrarPersonaPage };

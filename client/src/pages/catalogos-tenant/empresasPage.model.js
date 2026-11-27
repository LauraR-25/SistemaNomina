import {
  crearEstadoEmpresa,
  prepararPayloadEmpresa,
} from '../../components/catalogos-tenant/EmpresaForm/index.js';
import { api } from '../../services/api.js';

export function crearModeloEmpresasPage(empresas = []) {
  return {
    titulo: 'Empresas Multiempresa',
    empresas,
    formulario: crearEstadoEmpresa(),
    mensaje: null,
  };
}

export async function registrarEmpresaPage(modeloActual, datosFormulario) {
  const payload = prepararPayloadEmpresa(datosFormulario);
  const respuesta = await api.post('/catalogos/empresas', payload);

  if (!respuesta.ok) {
    return {
      ...modeloActual,
      mensaje: { tipo: 'error', texto: respuesta.message },
    };
  }

  return {
    ...modeloActual,
    empresas: [respuesta.data, ...modeloActual.empresas],
    formulario: crearEstadoEmpresa(),
    mensaje: { tipo: 'exito', texto: respuesta.message },
  };
}

export async function actualizarEmpresaPage(modeloActual, id, datosFormulario) {
  const payload = prepararPayloadEmpresa(datosFormulario);
  const respuesta = await api.patch(`/catalogos/empresas/${id}`, payload);

  if (!respuesta.ok) {
    return {
      ...modeloActual,
      mensaje: { tipo: 'error', texto: respuesta.message },
    };
  }

  return {
    ...modeloActual,
    empresas: modeloActual.empresas.map((empresa) =>
      String(empresa.id) === String(id) ? respuesta.data : empresa
    ),
    formulario: crearEstadoEmpresa(),
    mensaje: { tipo: 'exito', texto: respuesta.message },
  };
}

export default {
  crearModeloEmpresasPage,
  registrarEmpresaPage,
  actualizarEmpresaPage,
};

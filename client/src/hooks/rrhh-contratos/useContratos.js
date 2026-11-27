import { useCallback, useState } from 'react';
import { get, patch, post } from '../../services/api';

const API_URL = '/rrhh/contratos';

export function useContratos({ empresaId } = {}) {
  const [contratos, setContratos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const cargarContratos = useCallback(async () => {
    if (!empresaId) { setContratos([]); setCargando(false); setError(''); return; }
    setCargando(true);
    setError('');
    try {
      const respuesta = await get(API_URL);
      setContratos(Array.isArray(respuesta?.data) ? respuesta.data : []);
    } catch (err) {
      setError(err.message || 'No fue posible cargar contratos.');
      setContratos([]);
    } finally { setCargando(false); }
  }, [empresaId]);

  const obtenerContrato = useCallback(async (id) => {
    const respuesta = await get(`${API_URL}/${id}`);
    return respuesta?.data;
  }, []);
  const crearContrato = useCallback(async (datos) => { const r = await post(API_URL, datos); await cargarContratos(); return r; }, [cargarContratos]);
  const actualizarContrato = useCallback(async (id, datos) => { const r = await patch(`${API_URL}/${id}`, datos); await cargarContratos(); return r; }, [cargarContratos]);
  const cambiarEstadoContrato = useCallback(async (id, estado) => { const r = await patch(`${API_URL}/${id}/estado`, { estado }); await cargarContratos(); return r; }, [cargarContratos]);
  const registrarCambioSalario = useCallback(async (id, datos) => { const r = await post(`${API_URL}/${id}/salarios`, datos); await cargarContratos(); return r; }, [cargarContratos]);

  return { contratos: empresaId ? contratos : [], cargando, error, cargarContratos, obtenerContrato, crearContrato, actualizarContrato, cambiarEstadoContrato, registrarCambioSalario };
}

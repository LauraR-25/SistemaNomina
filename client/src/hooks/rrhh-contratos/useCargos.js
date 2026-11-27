import { useCallback, useState } from 'react';
import { del, get, patch, post } from '../../services/api';

const API_URL = '/rrhh/cargos';

export function useCargos({ empresaId } = {}) {
  const [cargos, setCargos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const cargarCargos = useCallback(async () => {
    if (!empresaId) { setCargos([]); setCargando(false); setError(''); return; }
    setCargando(true);
    setError('');
    try {
      const respuesta = await get(API_URL);
      setCargos(Array.isArray(respuesta?.data) ? respuesta.data : []);
    } catch (err) {
      setError(err.message || 'No fue posible cargar cargos.');
      setCargos([]);
    } finally { setCargando(false); }
  }, [empresaId]);

  const crearCargo = useCallback(async (datos) => { const r = await post(API_URL, datos); await cargarCargos(); return r; }, [cargarCargos]);
  const actualizarCargo = useCallback(async (id, datos) => { const r = await patch(`${API_URL}/${id}`, datos); await cargarCargos(); return r; }, [cargarCargos]);
  const eliminarCargo = useCallback(async (id) => { const r = await del(`${API_URL}/${id}`); await cargarCargos(); return r; }, [cargarCargos]);
  const desactivarCargo = useCallback(async (id) => { const r = await patch(`${API_URL}/${id}`, { activo: false }); await cargarCargos(); return r; }, [cargarCargos]);

  return { cargos: empresaId ? cargos : [], cargando, error, cargarCargos, crearCargo, actualizarCargo, eliminarCargo, desactivarCargo };
}

import { useCallback, useState } from 'react';
import { api, del, patch, post } from '../../services/api.js';

export function usePersonas(arg = {}) {
  // Compat: soporta uso anterior usePersonas(empresaId)
  const empresa = typeof arg === 'string' || arg === null ? arg : arg?.empresaId;
  const [personas, setPersonas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const cargarPersonas = useCallback(async () => {
    if (!empresa) { setPersonas([]); setLoading(false); setCargando(false); setError(null); return; }
    setLoading(true); setCargando(true); setError(null);
    try {
      const res = await api.get('/rrhh/personas');
      if (!res.ok) { setError(res.message || 'Error al cargar las personas.'); setPersonas([]); return; }
      setPersonas(Array.isArray(res.data) ? res.data : []);
    } catch (err) { setError(err.message || 'Error al cargar las personas.'); setPersonas([]); }
    finally { setLoading(false); setCargando(false); }
  }, [empresa]);

  const crearPersona = useCallback(async (datos) => { const r = await post('/rrhh/personas', datos); await cargarPersonas(); return r; }, [cargarPersonas]);
  const actualizarPersona = useCallback(async (id, datos) => { const r = await patch(`/rrhh/personas/${id}`, datos); await cargarPersonas(); return r; }, [cargarPersonas]);
  const eliminarPersona = useCallback(async (id) => { const r = await del(`/rrhh/personas/${id}`); await cargarPersonas(); return r; }, [cargarPersonas]);

  return { personas: empresa ? personas : [], loading, cargando, error, cargarPersonas, crearPersona, actualizarPersona, eliminarPersona };
}

export default usePersonas;

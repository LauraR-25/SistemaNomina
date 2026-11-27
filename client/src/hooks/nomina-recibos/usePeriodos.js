import { useState, useCallback } from 'react';
import { api } from '../../services/api.js';

export function usePeriodos(empresaId) {
  const [periodos, setPeriodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cargarPeriodos = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const query = empresaId ? `?empresaId=${encodeURIComponent(empresaId)}` : '';
      const res = await api.get(`/nomina/periodos${query}`);
      if (!res.ok) {
        setError(res.message || 'Error al cargar los períodos de nómina.');
        setPeriodos([]);
        return;
      }
      setPeriodos(Array.isArray(res.data) ? res.data : []);
    } catch {
      setError('Error al cargar los períodos de nómina.');
      setPeriodos([]);
    } finally {
      setLoading(false);
    }
  }, [empresaId]);

  return {
    periodos,
    loading,
    error,
    cargarPeriodos,
  };
}

export default usePeriodos;
import { useState, useCallback } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function usePeriodos(empresaId) {
  const [periodos, setPeriodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cargarPeriodos = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const query = empresaId ? `?empresaId=${encodeURIComponent(empresaId)}` : '';
      const res = await fetch(`${API_URL}/api/nomina/periodos${query}`);
      const data = await res.json();
      setPeriodos(data.data || []);
    } catch {
      setError('Error al cargar los períodos de nómina.');
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
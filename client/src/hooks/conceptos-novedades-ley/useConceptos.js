import { useState, useCallback } from 'react';
import { api } from '../../services/api.js';

export function useConceptos(empresaId) {
  const [conceptos, setConceptos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cargarConceptos = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const query = empresaId ? `?empresaId=${encodeURIComponent(empresaId)}` : '';
      const res = await api.get(`/conceptos/conceptos${query}`);
      if (!res.ok) {
        setError(res.message || 'Error al cargar los conceptos.');
        setConceptos([]);
        return;
      }
      setConceptos(Array.isArray(res.data) ? res.data : []);
    } catch {
      setError('Error al cargar los conceptos.');
      setConceptos([]);
    } finally {
      setLoading(false);
    }
  }, [empresaId]);

  return {
    conceptos,
    loading,
    error,
    cargarConceptos,
  };
}

export default useConceptos;
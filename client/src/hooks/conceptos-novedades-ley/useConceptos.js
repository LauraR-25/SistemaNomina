import { useState, useCallback } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function useConceptos(empresaId) {
  const [conceptos, setConceptos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cargarConceptos = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const query = empresaId ? `?empresaId=${encodeURIComponent(empresaId)}` : '';
      const res = await fetch(`${API_URL}/api/conceptos/conceptos${query}`);
      const data = await res.json();
      setConceptos(data.data || []);
    } catch {
      setError('Error al cargar los conceptos.');
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
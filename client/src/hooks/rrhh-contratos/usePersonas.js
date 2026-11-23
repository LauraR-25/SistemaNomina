import { useState, useCallback } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function usePersonas(empresaId) {
  const [personas, setPersonas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cargarPersonas = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const query = empresaId ? `?empresaId=${encodeURIComponent(empresaId)}` : '';
      const res = await fetch(`${API_URL}/api/rrhh/personas${query}`);
      const data = await res.json();
      setPersonas(data.data || []);
    } catch {
      setError('Error al cargar las personas.');
    } finally {
      setLoading(false);
    }
  }, [empresaId]);

  return {
    personas,
    loading,
    error,
    cargarPersonas,
  };
}

export default usePersonas;
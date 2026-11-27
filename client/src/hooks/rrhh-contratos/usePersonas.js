import { useState, useCallback } from 'react';
import { api } from '../../services/api.js';

export function usePersonas(empresaId) {
  const [personas, setPersonas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cargarPersonas = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const query = empresaId ? `?empresaId=${encodeURIComponent(empresaId)}` : '';
      const res = await api.get(`/rrhh/personas${query}`);
      if (!res.ok) {
        setError(res.message || 'Error al cargar las personas.');
        setPersonas([]);
        return;
      }
      setPersonas(Array.isArray(res.data) ? res.data : []);
    } catch {
      setError('Error al cargar las personas.');
      setPersonas([]);
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
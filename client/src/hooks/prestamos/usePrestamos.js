import { useState, useCallback } from 'react';
import { api } from '../../services/api.js';

export function usePrestamos(empresaId) {
  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cargarPrestamos = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const query = empresaId ? `?empresaId=${encodeURIComponent(empresaId)}` : '';
      const res = await api.get(`/prestamos${query}`);
      if (!res.ok) {
        setError(res.message || 'Error al cargar los préstamos.');
        setPrestamos([]);
        return;
      }
      setPrestamos(Array.isArray(res.data) ? res.data : []);
    } catch {
      setError('Error al cargar los préstamos.');
      setPrestamos([]);
    } finally {
      setLoading(false);
    }
  }, [empresaId]);

  return {
    prestamos,
    loading,
    error,
    cargarPrestamos,
  };
}

export default usePrestamos;
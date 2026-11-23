import { useState, useCallback } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function usePrestamos(empresaId) {
  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cargarPrestamos = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const query = empresaId ? `?empresaId=${encodeURIComponent(empresaId)}` : '';
      const res = await fetch(`${API_URL}/api/prestamos${query}`);
      const data = await res.json();
      setPrestamos(data.data || []);
    } catch {
      setError('Error al cargar los préstamos.');
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
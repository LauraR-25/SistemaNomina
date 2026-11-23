import { useState, useCallback } from 'react';

export function useNovedades() {
  const [novedades, setNovedades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const agregarNovedad = useCallback((novedad) => {
    setLoading(true);
    setError(null);
    try {
      setNovedades((prev) => [...prev, { id: Date.now(), ...novedad }]);
    } catch {
      setError('Error al registrar novedad.');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    novedades,
    loading,
    error,
    agregarNovedad,
  };
}

export default useNovedades;
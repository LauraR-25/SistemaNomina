import { useState, useCallback } from 'react';

export function useHoras() {
  const [horas, setHoras] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const registrarHora = useCallback((registro) => {
    setLoading(true);
    setError(null);
    try {
      setHoras((prev) => [...prev, { id: Date.now(), ...registro }]);
    } catch {
      setError('Error al registrar horas.');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    horas,
    loading,
    error,
    registrarHora,
  };
}

export default useHoras;
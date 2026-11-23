import { useState, useCallback } from 'react';

export function usePrenomina() {
  const [filas, setFilas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cargarPrenomina = useCallback((datos = []) => {
    setLoading(true);
    setError(null);
    try {
      setFilas(datos);
    } catch {
      setError('Error al cargar la prenómina.');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    filas,
    loading,
    error,
    cargarPrenomina,
  };
}

export default usePrenomina;
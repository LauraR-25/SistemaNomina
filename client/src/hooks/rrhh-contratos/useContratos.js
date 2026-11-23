import { useState, useCallback } from 'react';

export function useContratos() {
  const [contratos, setContratos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const agregarContrato = useCallback((contrato) => {
    setLoading(true);
    setError(null);
    try {
      setContratos((prev) => [...prev, { id: Date.now(), ...contrato }]);
    } catch {
      setError('Error al registrar contrato.');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    contratos,
    loading,
    error,
    agregarContrato,
  };
}

export default useContratos;
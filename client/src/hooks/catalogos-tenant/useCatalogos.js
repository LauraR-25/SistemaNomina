import { useState, useCallback } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function useCatalogos() {
  const [paises, setPaises] = useState([]);
  const [bancos, setBancos] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cargarCatalogos = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [resPaises, resBancos, resEmpresas] = await Promise.all([
        fetch(`${API_URL}/api/catalogos/paises`).then((r) => r.json()),
        fetch(`${API_URL}/api/catalogos/bancos`).then((r) => r.json()),
        fetch(`${API_URL}/api/catalogos/empresas`).then((r) => r.json()),
      ]);

      setPaises(resPaises.data || []);
      setBancos(resBancos.data || []);
      setEmpresas(resEmpresas.data || []);
    } catch {
      setError('Error al cargar los catálogos.');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    paises,
    bancos,
    empresas,
    loading,
    error,
    cargarCatalogos,
  };
}

export default useCatalogos;
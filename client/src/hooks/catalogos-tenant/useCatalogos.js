import { useState, useCallback } from 'react';
import { api } from '../../services/api.js';

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
        api.get('/catalogos/paises'),
        api.get('/catalogos/bancos'),
        api.get('/catalogos/empresas'),
      ]);

      if (!resPaises.ok || !resBancos.ok || !resEmpresas.ok) {
        setError(
          resEmpresas.message || resPaises.message || resBancos.message || 'Error al cargar los catálogos.'
        );
      }

      setPaises(resPaises.ok && Array.isArray(resPaises.data) ? resPaises.data : []);
      setBancos(resBancos.ok && Array.isArray(resBancos.data) ? resBancos.data : []);
      setEmpresas(resEmpresas.ok && Array.isArray(resEmpresas.data) ? resEmpresas.data : []);
    } catch {
      setError('Error al cargar los catálogos.');
      setPaises([]);
      setBancos([]);
      setEmpresas([]);
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
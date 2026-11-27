import { useState, useCallback } from 'react';
import { api } from '../../services/api.js';

function headersEmpresa(empresaId) {
  return empresaId ? { 'x-empresa-id': String(empresaId) } : undefined;
}

export function useConceptos(empresaId) {
  const [conceptos, setConceptos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cargarConceptos = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.get('/conceptos/conceptos', headersEmpresa(empresaId));
      if (!res.ok) {
        setError(res.message || 'Error al cargar los conceptos.');
        setConceptos([]);
        return res;
      }
      setConceptos(Array.isArray(res.data) ? res.data : []);
      return res;
    } catch {
      setError('Error al cargar los conceptos.');
      setConceptos([]);
      return { ok: false, message: 'Error al cargar los conceptos.' };
    } finally {
      setLoading(false);
    }
  }, [empresaId]);

  const crearConcepto = useCallback(
    async (payload) => {
      const res = await api.post('/conceptos/conceptos', payload, headersEmpresa(empresaId));
      if (res.ok) setConceptos((actual) => [...actual, res.data]);
      return res;
    },
    [empresaId]
  );

  const obtenerConcepto = useCallback(
    async (id) => api.get(`/conceptos/conceptos/${encodeURIComponent(id)}`, headersEmpresa(empresaId)),
    [empresaId]
  );

  const actualizarConcepto = useCallback(
    async (id, payload) => {
      const res = await api.patch(
        `/conceptos/conceptos/${encodeURIComponent(id)}`,
        payload,
        headersEmpresa(empresaId)
      );
      if (res.ok) {
        setConceptos((actual) =>
          actual.map((concepto) =>
            String(concepto.id) === String(id) ? res.data : concepto
          )
        );
      }
      return res;
    },
    [empresaId]
  );

  const desactivarConcepto = useCallback(
    async (id) => {
      const res = await api.patch(
        `/conceptos/conceptos/${encodeURIComponent(id)}/desactivar`,
        {},
        headersEmpresa(empresaId)
      );
      if (res.ok) {
        setConceptos((actual) =>
          actual.map((concepto) =>
            String(concepto.id) === String(id) ? res.data : concepto
          )
        );
      }
      return res;
    },
    [empresaId]
  );

  const eliminarConcepto = useCallback(
    async (id) => {
      const res = await api.delete(
        `/conceptos/conceptos/${encodeURIComponent(id)}`,
        headersEmpresa(empresaId)
      );
      if (res.ok) {
        setConceptos((actual) =>
          actual.filter((concepto) => String(concepto.id) !== String(id))
        );
      }
      return res;
    },
    [empresaId]
  );

  return {
    conceptos,
    loading,
    error,
    cargarConceptos,
    crearConcepto,
    obtenerConcepto,
    actualizarConcepto,
    desactivarConcepto,
    eliminarConcepto,
  };
}

export default useConceptos;

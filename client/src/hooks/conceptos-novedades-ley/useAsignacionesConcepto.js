import { useState, useCallback } from 'react';
import { api } from '../../services/api.js';

function headersEmpresa(empresaId) {
  return empresaId ? { 'x-empresa-id': String(empresaId) } : undefined;
}

export function useAsignacionesConcepto(empresaId, contratoId) {
  const [asignaciones, setAsignaciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cargarAsignaciones = useCallback(async () => {
    if (!contratoId) {
      setAsignaciones([]);
      return { ok: true, data: [] };
    }

    setLoading(true);
    setError(null);

    try {
      const query = `?contrato_id=${encodeURIComponent(contratoId)}`;
      const res = await api.get(
        `/conceptos/asignaciones${query}`,
        headersEmpresa(empresaId)
      );
      if (!res.ok) {
        setError(res.message || 'Error al cargar los conceptos asignados.');
        setAsignaciones([]);
        return res;
      }
      const datos = Array.isArray(res.data) ? res.data : [];
      setAsignaciones(datos);
      return { ...res, data: datos };
    } catch {
      const mensaje = 'Error al cargar los conceptos asignados.';
      setError(mensaje);
      setAsignaciones([]);
      return { ok: false, message: mensaje };
    } finally {
      setLoading(false);
    }
  }, [contratoId, empresaId]);

  const crearAsignacion = useCallback(
    async (payload) => {
      const res = await api.post(
        '/conceptos/asignaciones',
        payload,
        headersEmpresa(empresaId)
      );
      if (res.ok) setAsignaciones((actual) => [res.data, ...actual]);
      return res;
    },
    [empresaId]
  );

  const obtenerAsignacion = useCallback(
    async (id) =>
      api.get(
        `/conceptos/asignaciones/${encodeURIComponent(id)}`,
        headersEmpresa(empresaId)
      ),
    [empresaId]
  );

  const actualizarAsignacion = useCallback(
    async (id, payload) => {
      const res = await api.patch(
        `/conceptos/asignaciones/${encodeURIComponent(id)}`,
        payload,
        headersEmpresa(empresaId)
      );
      if (res.ok) {
        setAsignaciones((actual) =>
          actual.map((asignacion) =>
            String(asignacion.id) === String(id) ? res.data : asignacion
          )
        );
      }
      return res;
    },
    [empresaId]
  );

  const terminarAsignacion = useCallback(
    async (id, payload = {}) => {
      const res = await api.patch(
        `/conceptos/asignaciones/${encodeURIComponent(id)}/terminar`,
        payload,
        headersEmpresa(empresaId)
      );
      if (res.ok) {
        setAsignaciones((actual) =>
          actual.map((asignacion) =>
            String(asignacion.id) === String(id) ? res.data : asignacion
          )
        );
      }
      return res;
    },
    [empresaId]
  );

  const eliminarAsignacion = useCallback(
    async (id) => {
      const res = await api.delete(
        `/conceptos/asignaciones/${encodeURIComponent(id)}`,
        headersEmpresa(empresaId)
      );
      if (res.ok) {
        setAsignaciones((actual) =>
          actual.filter((asignacion) => String(asignacion.id) !== String(id))
        );
      }
      return res;
    },
    [empresaId]
  );

  return {
    asignaciones,
    loading,
    error,
    cargarAsignaciones,
    crearAsignacion,
    obtenerAsignacion,
    actualizarAsignacion,
    terminarAsignacion,
    eliminarAsignacion,
  };
}

export default useAsignacionesConcepto;

import { useCallback, useState } from 'react';
import { api } from '../../services/api.js';

function normalizarCuenta(cuenta = {}) {
  return {
    ...cuenta,
    banco: cuenta.banco || (cuenta.banco_nombre ? { id: cuenta.banco_id, nombre: cuenta.banco_nombre, codigo: cuenta.banco_codigo } : null),
  };
}

export function useCuentasBancarias() {
  const [cuentas, setCuentas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cargarCuentas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/catalogos/cuentas-bancarias');
      if (!res.ok) {
        setError(res.message || 'Error al cargar las cuentas bancarias.');
        setCuentas([]);
        return { ok: false, message: res.message };
      }
      const data = Array.isArray(res.data) ? res.data.map(normalizarCuenta) : [];
      setCuentas(data);
      return { ok: true, data };
    } catch {
      const message = 'Error al cargar las cuentas bancarias.';
      setError(message);
      setCuentas([]);
      return { ok: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  const crearCuenta = useCallback(async (payload) => {
    const res = await api.post('/catalogos/cuentas-bancarias', payload);
    if (res.ok) setCuentas((actual) => [normalizarCuenta(res.data), ...actual]);
    return res;
  }, []);

  const actualizarCuenta = useCallback(async (id, payload) => {
    const res = await api.patch(`/catalogos/cuentas-bancarias/${id}`, payload);
    if (res.ok) {
      setCuentas((actual) =>
        actual.map((item) => (String(item.id) === String(id) ? normalizarCuenta(res.data) : item))
      );
    }
    return res;
  }, []);

  const eliminarCuenta = useCallback(async (id) => {
    const res = await api.delete(`/catalogos/cuentas-bancarias/${id}`);
    if (res.ok) setCuentas((actual) => actual.filter((item) => String(item.id) !== String(id)));
    return res;
  }, []);

  return {
    cuentas,
    loading,
    error,
    cargarCuentas,
    crearCuenta,
    actualizarCuenta,
    eliminarCuenta,
  };
}

export default useCuentasBancarias;

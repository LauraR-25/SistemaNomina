import { useState, useCallback } from 'react';

export function useRecibos() {
  const [reciboSeleccionado, setReciboSeleccionado] = useState(null);

  const seleccionarRecibo = useCallback((recibo) => {
    setReciboSeleccionado(recibo);
  }, []);

  const limpiarRecibo = useCallback(() => {
    setReciboSeleccionado(null);
  }, []);

  return {
    reciboSeleccionado,
    seleccionarRecibo,
    limpiarRecibo,
  };
}

export default useRecibos;
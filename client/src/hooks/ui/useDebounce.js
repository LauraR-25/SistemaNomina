import { useEffect, useState } from 'react';

export function useDebounce(valor, ms = 300) {
  const [valorDebounced, setValorDebounced] = useState(valor);

  useEffect(() => {
    const temporizador = setTimeout(() => setValorDebounced(valor), ms);
    return () => clearTimeout(temporizador);
  }, [valor, ms]);

  return valorDebounced;
}

export default useDebounce;

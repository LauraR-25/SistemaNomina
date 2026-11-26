import { useCallback, useState } from 'react';

export function useDisclosure(inicial = false) {
  const [abierto, setAbierto] = useState(Boolean(inicial));

  const abrir = useCallback(() => setAbierto(true), []);
  const cerrar = useCallback(() => setAbierto(false), []);
  const alternar = useCallback(() => setAbierto((valor) => !valor), []);

  return { abierto, abrir, cerrar, alternar };
}

export default useDisclosure;

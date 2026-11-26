import { useCallback, useMemo, useState } from 'react';

function normalizar(valor) {
  return String(valor ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function obtenerValor(fila, campo) {
  return String(campo)
    .split('.')
    .reduce(
      (actual, parte) => (actual == null ? undefined : actual[parte]),
      fila
    );
}

function comparar(primero, segundo) {
  if (primero === segundo) return 0;
  if (primero == null) return -1;
  if (segundo == null) return 1;

  if (typeof primero === 'number' && typeof segundo === 'number') {
    return primero - segundo;
  }

  return String(primero).localeCompare(String(segundo), 'es', {
    numeric: true,
    sensitivity: 'base',
  });
}

export function useTablaControles(filas, opciones = {}) {
  const {
    busqueda: busquedaControlada,
    campos,
    tamPagina: tamPaginaControlada,
    onBusquedaChange,
    onTamPaginaChange,
  } = opciones ?? {};

  const [busquedaInterna, setBusquedaInterna] = useState(busquedaControlada ?? '');
  const [tamPaginaInterno, setTamPaginaInterno] = useState(
    Number(tamPaginaControlada) || 10
  );

  const busqueda = busquedaControlada ?? busquedaInterna;
  const [estadoPagina, setEstadoPagina] = useState({
    clave: busqueda,
    pagina: 1,
  });

  const filasSeguras = useMemo(
    () => (Array.isArray(filas) ? filas : []),
    [filas]
  );

  const tamPagina = Math.max(
    1,
    Number(tamPaginaControlada ?? tamPaginaInterno) || 10
  );

  const camposBusqueda = useMemo(() => {
    const lista = Array.isArray(campos)
      ? campos
      : Object.keys(filasSeguras[0] ?? {});
    return lista.filter(Boolean);
  }, [campos, filasSeguras]);

  const [orden, setOrden] = useState({ campo: null, direccion: 'asc' });

  const filasFiltradas = useMemo(() => {
    const texto = normalizar(busqueda);

    if (!texto || camposBusqueda.length === 0) return filasSeguras;

    return filasSeguras.filter((fila) =>
      camposBusqueda.some((campo) =>
        normalizar(obtenerValor(fila, campo)).includes(texto)
      )
    );
  }, [filasSeguras, busqueda, camposBusqueda]);

  const filasOrdenadas = useMemo(() => {
    if (!orden.campo) return filasFiltradas;

    const factor = orden.direccion === 'desc' ? -1 : 1;

    return filasFiltradas
      .map((fila, indice) => ({ fila, indice }))
      .sort((primero, segundo) => {
        const resultado = comparar(
          obtenerValor(primero.fila, orden.campo),
          obtenerValor(segundo.fila, orden.campo)
        );
        return resultado !== 0 ? resultado * factor : primero.indice - segundo.indice;
      })
      .map(({ fila }) => fila);
  }, [filasFiltradas, orden]);

  const total = filasFiltradas.length;
  const totalPaginas = Math.max(1, Math.ceil(total / tamPagina));

  const paginaBase = estadoPagina.clave === busqueda ? estadoPagina.pagina : 1;
  const pagina = Math.min(Math.max(paginaBase, 1), totalPaginas);

  const setPagina = useCallback(
    (valor) => {
      setEstadoPagina((actual) => ({
        clave: busqueda,
        pagina:
          typeof valor === 'function'
            ? valor(actual.clave === busqueda ? actual.pagina : 1)
            : valor,
      }));
    },
    [busqueda]
  );

  const setBusqueda = useCallback(
    (valor) => {
      if (onBusquedaChange) onBusquedaChange(valor);
      else setBusquedaInterna(valor);
    },
    [onBusquedaChange]
  );

  const setTamPagina = useCallback(
    (valor) => {
      const siguiente = Math.max(1, Number(valor) || 10);
      if (onTamPaginaChange) onTamPaginaChange(siguiente);
      else setTamPaginaInterno(siguiente);
      setPagina(1);
    },
    [onTamPaginaChange, setPagina]
  );

  const cambiarOrden = useCallback((campo) => {
    setOrden((actual) =>
      actual.campo === campo
        ? { campo, direccion: actual.direccion === 'asc' ? 'desc' : 'asc' }
        : { campo, direccion: 'asc' }
    );
  }, []);

  const limpiarOrden = useCallback(() => {
    setOrden({ campo: null, direccion: 'asc' });
  }, []);

  const filasVisibles = useMemo(
    () => filasOrdenadas.slice((pagina - 1) * tamPagina, pagina * tamPagina),
    [filasOrdenadas, pagina, tamPagina]
  );

  const irPrimeraPagina = useCallback(() => setPagina(1), [setPagina]);
  const irUltimaPagina = useCallback(
    () => setPagina(totalPaginas),
    [setPagina, totalPaginas]
  );
  const irPaginaAnterior = useCallback(
    () => setPagina((actual) => Math.max(1, actual - 1)),
    [setPagina]
  );
  const irPaginaSiguiente = useCallback(
    () => setPagina((actual) => Math.min(totalPaginas, actual + 1)),
    [setPagina, totalPaginas]
  );

  return {
    pagina,
    setPagina,
    filasVisibles,
    filasFiltradas,
    filasOrdenadas,
    orden,
    setOrden,
    cambiarOrden,
    limpiarOrden,
    total,
    totalPaginas,
    busqueda,
    setBusqueda,
    camposBusqueda,
    tamPagina,
    setTamPagina,
    puedeAnterior: pagina > 1,
    puedeSiguiente: pagina < totalPaginas,
    irPrimeraPagina,
    irPaginaAnterior,
    irPaginaSiguiente,
    irUltimaPagina,
    page: pagina,
    visibleRows: filasVisibles,
    totalRows: total,
    totalPages: totalPaginas,
  };
}

export default useTablaControles;

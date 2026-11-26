import { useCallback, useSyncExternalStore } from 'react';

function obtenerCoincidencia(query) {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia(query).matches;
}

function suscribirse(query, callback) {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {};

  const media = window.matchMedia(query);

  if (media.addEventListener) {
    media.addEventListener('change', callback);
    return () => media.removeEventListener('change', callback);
  }

  media.addListener(callback);
  return () => media.removeListener(callback);
}

function obtenerSnapshotServidor() {
  return false;
}

export function useMediaQuery(query) {
  const subscribe = useCallback(
    (callback) => suscribirse(query, callback),
    [query]
  );
  const getSnapshot = useCallback(() => obtenerCoincidencia(query), [query]);

  return useSyncExternalStore(subscribe, getSnapshot, obtenerSnapshotServidor);
}

export default useMediaQuery;

import { useEffect, useRef } from 'react';

export function useClickOutside(ref, handler) {
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (typeof document === 'undefined' || !ref) return undefined;

    const escuchar = (evento) => {
      const elemento = ref.current;
      const objetivo = evento.target;

      if (!elemento || !objetivo) return;
      if (elemento === objetivo || elemento.contains(objetivo)) return;

      handlerRef.current?.(evento);
    };

    document.addEventListener('mousedown', escuchar);
    document.addEventListener('touchstart', escuchar);

    return () => {
      document.removeEventListener('mousedown', escuchar);
      document.removeEventListener('touchstart', escuchar);
    };
  }, [ref]);

  return ref;
}

export default useClickOutside;

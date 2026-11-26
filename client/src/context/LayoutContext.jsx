import {
  createContext,
  createElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

export const LayoutContext = createContext(null);

const STORAGE_KEY = 'nomina_sidebar_colapsado';

export function LayoutProvider({ children }) {
  const [sidebarColapsado, setSidebarColapsado] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [sidebarMovilAbierto, setSidebarMovilAbierto] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(sidebarColapsado));
    } catch {}
  }, [sidebarColapsado]);

  const alternarSidebar = useCallback(() => {
    setSidebarColapsado((colapsado) => !colapsado);
  }, []);

  const abrirSidebarMovil = useCallback(() => {
    setSidebarMovilAbierto(true);
  }, []);

  const cerrarSidebarMovil = useCallback(() => {
    setSidebarMovilAbierto(false);
  }, []);

  const valor = useMemo(
    () => ({
      sidebarColapsado,
      sidebarMovilAbierto,
      alternarSidebar,
      abrirSidebarMovil,
      cerrarSidebarMovil,
    }),
    [
      sidebarColapsado,
      sidebarMovilAbierto,
      alternarSidebar,
      abrirSidebarMovil,
      cerrarSidebarMovil,
    ]
  );

  return createElement(LayoutContext.Provider, { value: valor }, children);
}

export default LayoutContext;

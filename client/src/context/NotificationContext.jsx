import {
  createContext,
  createElement,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { ToastContainer } from '../components/common/feedback/Toast/index.js';

export const NotificationContext = createContext(null);

const DURACION_PREDETERMINADA = 5000;
const TIPOS_VALIDOS = new Set(['exito', 'error', 'info', 'advertencia']);

export function NotificationProvider({ children }) {
  const [notificaciones, setNotificaciones] = useState([]);

  const descartar = useCallback((id) => {
    setNotificaciones((actuales) => actuales.filter((item) => item.id !== id));
  }, []);

  const notificar = useCallback(
    ({
      tipo = 'info',
      titulo,
      mensaje,
      duracion = DURACION_PREDETERMINADA,
    } = {}) => {
      const id = `notificacion-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}`;

      setNotificaciones((actuales) => [
        ...actuales,
        {
          id,
          tipo: TIPOS_VALIDOS.has(tipo) ? tipo : 'info',
          titulo,
          mensaje,
          duracion: duracion ?? DURACION_PREDETERMINADA,
        },
      ]);

      return id;
    },
    []
  );

  const valor = useMemo(
    () => ({ notificaciones, notificar, descartar }),
    [notificaciones, notificar, descartar]
  );

  return createElement(
    NotificationContext.Provider,
    { value: valor },
    children,
    createElement(ToastContainer, {
      toasts: notificaciones,
      onClose: descartar,
    })
  );
}

export default NotificationContext;

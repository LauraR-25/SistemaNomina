import { createPortal } from 'react-dom';
import { Toast } from './Toast.jsx';
import styles from './Toast.module.css';

export function ToastContainer({ toasts, notificaciones, onClose, onDescartar }) {
  const lista = toasts ?? notificaciones ?? [];
  const descartar = onClose ?? onDescartar;

  if (typeof document === 'undefined' || lista.length === 0) return null;

  return createPortal(
    <div
      className={styles.contenedor}
      aria-live="polite"
      aria-atomic="false"
    >
      {lista.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={descartar} />
      ))}
    </div>,
    document.body
  );
}

export default ToastContainer;

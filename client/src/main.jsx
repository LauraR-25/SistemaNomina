import './styles/index.css';
import { createRoot } from 'react-dom/client';
import AppShell from './AppShell.jsx';
import app, {
  crearEstadoAppInicial,
  ejecutarFlujoLogin,
  aceptarSeguridadNomina,
  navegarEnApp,
  cerrarSesionEnApp,
} from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { LayoutProvider } from './context/LayoutContext.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';

export const estadoInicial = crearEstadoAppInicial('/login');

export async function iniciarSesionApp(username, password, estadoPrevio = estadoInicial) {
  return ejecutarFlujoLogin(estadoPrevio, { username, password });
}

export function confirmarSeguridadNominaApp(estadoPrevio) {
  return aceptarSeguridadNomina(estadoPrevio);
}

export function cambiarRutaApp(estadoPrevio, rutaDestino) {
  return navegarEnApp(estadoPrevio, rutaDestino);
}

export function salirApp() {
  return cerrarSesionEnApp('/login');
}

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <AuthProvider>
      <NotificationProvider>
        <LayoutProvider>
          <AppShell />
        </LayoutProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export { AuthProvider, AppShell as VistaBase };
export default app;

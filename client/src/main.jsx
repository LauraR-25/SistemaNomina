import app, {
  crearEstadoAppInicial,
  ejecutarFlujoLogin,
  aceptarSeguridadNomina,
  navegarEnApp,
  cerrarSesionEnApp,
} from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

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

export { AuthProvider };
export default app;
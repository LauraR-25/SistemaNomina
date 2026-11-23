import app, {
  crearEstadoAppInicial,
  ejecutarFlujoLogin,
  aceptarSeguridadNomina,
} from './App.jsx';

export const estadoInicial = crearEstadoAppInicial();

export async function iniciarSesionApp(username, password, estadoPrevio = estadoInicial) {
  return ejecutarFlujoLogin(estadoPrevio, { username, password });
}

export function confirmarSeguridadNominaApp(estadoPrevio) {
  return aceptarSeguridadNomina(estadoPrevio);
}

export default app;
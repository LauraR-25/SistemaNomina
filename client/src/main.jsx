import './styles/index.css';
import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import app, {
  crearEstadoAppInicial,
  ejecutarFlujoLogin,
  aceptarSeguridadNomina,
  navegarEnApp,
  cerrarSesionEnApp,
} from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { useAuth } from './hooks/auth-rbac/useAuth.js';

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

function VistaBase() {
  const {
    sesion,
    usuario,
    empresa,
    notificacion,
    loading,
    iniciarSesion,
    cerrarSesion,
  } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  function manejarEnvio(evento) {
    evento.preventDefault();
    iniciarSesion({ username, password });
  }

  const estilo = {
    fontFamily: 'system-ui, sans-serif',
    maxWidth: '480px',
    margin: '3rem auto',
    padding: '1.5rem',
    border: '1px solid #d0d7de',
    borderRadius: '8px',
  };

  return (
    <main style={estilo}>
      <h1>Sistema de Nómina Multiempresa</h1>
      {sesion ? (
        <section>
          <p>Sesión iniciada como {usuario?.username || 'usuario'}.</p>
          {empresa?.nombreComercial && <p>Empresa: {empresa.nombreComercial}</p>}
          <button type="button" onClick={cerrarSesion}>
            Cerrar sesión
          </button>
        </section>
      ) : (
        <form onSubmit={manejarEnvio}>
          <label>
            Usuario
            <input
              type="text"
              value={username}
              onChange={(evento) => setUsername(evento.target.value)}
              required
              style={{ display: 'block', margin: '0.5rem 0 1rem' }}
            />
          </label>
          <label>
            Contraseña
            <input
              type="password"
              value={password}
              onChange={(evento) => setPassword(evento.target.value)}
              required
              style={{ display: 'block', margin: '0.5rem 0 1rem' }}
            />
          </label>
          <button type="submit" disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      )}
      {notificacion && (
        <p role="status" style={{ marginTop: '1rem' }}>
          {notificacion.mensaje}
        </p>
      )}
    </main>
  );
}

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <AuthProvider>
      <VistaBase />
    </AuthProvider>
  );
}

export { AuthProvider, VistaBase };
export default app;

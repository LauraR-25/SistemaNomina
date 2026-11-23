import { createContext, useState, useEffect, createElement } from 'react';
import { enviarLogin } from '../components/auth-rbac/LoginForm.jsx';

const STORAGE_KEY = 'nomina_sesion';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [sesion, setSesion] = useState(() => {
    try {
      const guardada = localStorage.getItem(STORAGE_KEY);
      return guardada ? JSON.parse(guardada) : null;
    } catch {
      return null;
    }
  });

  const [seguridadNominaAceptada, setSeguridadNominaAceptada] = useState(false);
  const [notificacion, setNotificacion] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      if (sesion) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sesion));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Ignorar errores de almacenamiento
    }
  }, [sesion]);

  async function iniciarSesion({ username, password }) {
    setLoading(true);
    setNotificacion(null);

    try {
      const resultado = await enviarLogin({ username, password });

      if (!resultado.ok) {
        setSesion(null);
        setSeguridadNominaAceptada(false);
        setNotificacion({
          tipo: 'error',
          mensaje: resultado.message,
        });
        return resultado;
      }

      setSesion(resultado.sesion);
      setSeguridadNominaAceptada(false);
      setNotificacion({
        tipo: 'exito',
        mensaje: resultado.message,
      });

      return resultado;
    } catch {
      const errorRes = {
        ok: false,
        message: 'Error de conexión con el servidor.',
        sesion: null,
      };
      setNotificacion({
        tipo: 'error',
        mensaje: errorRes.message,
      });
      return errorRes;
    } finally {
      setLoading(false);
    }
  }

  function aceptarSeguridadNomina() {
    if (!sesion) return false;
    setSeguridadNominaAceptada(true);
    return true;
  }

  function cerrarSesion() {
    setSesion(null);
    setSeguridadNominaAceptada(false);
    setNotificacion(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  function tienePerfil(nombrePerfil) {
    if (!sesion?.perfiles) return false;
    return sesion.perfiles.some((p) => p.nombre_perfil === nombrePerfil);
  }

  function tieneOpcion(nombreOpcion) {
    if (!sesion?.opciones) return false;
    return sesion.opciones.some((o) => o.nombre === nombreOpcion);
  }

  return createElement(
    AuthContext.Provider,
    {
      value: {
        sesion,
        usuario: sesion?.usuario || null,
        empresa: sesion?.empresa || null,
        perfiles: sesion?.perfiles || [],
        opciones: sesion?.opciones || [],
        seguridadNominaAceptada,
        notificacion,
        loading,
        iniciarSesion,
        aceptarSeguridadNomina,
        cerrarSesion,
        tienePerfil,
        tieneOpcion,
      },
    },
    children
  );
}

export default AuthContext;
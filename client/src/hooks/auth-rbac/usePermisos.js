import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';

export function usePermisos() {
  const context = useContext(AuthContext);

  const perfiles = context?.perfiles || [];
  const opciones = context?.opciones || [];

  function tienePerfil(nombrePerfil) {
    return perfiles.some((p) => p.nombre_perfil === nombrePerfil);
  }

  function tieneOpcion(nombreOpcion) {
    return opciones.some((o) => o.nombre === nombreOpcion);
  }

  return {
    perfiles,
    opciones,
    tienePerfil,
    tieneOpcion,
  };
}

export default usePermisos;
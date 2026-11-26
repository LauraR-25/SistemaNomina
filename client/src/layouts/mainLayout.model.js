import { MODULOS_NAVEGACION } from '../config/navigation.config.js';

export function construirModeloLayout({
  sesion,
  seguridadNominaAceptada,
  rutaActual = '/',
  onNavegar,
  onCerrarSesion,
}) {
  const usuario = sesion?.usuario || null;
  const empresa = sesion?.empresa || null;
  const opciones = Array.isArray(sesion?.opciones) ? sesion.opciones : [];

  const menuOpciones = opciones.map((op) => {
    const modulo = MODULOS_NAVEGACION.find(
      (moduloConfig) => moduloConfig.opcionRequerida === op.nombre
    );

    return {
      id: op.id,
      nombre: op.nombre,
      descripcion: op.descripcion || '',
      subsistema: op.subsistema || 'General',
      orden: op.orden ?? 0,
      activa: modulo ? rutaActual === modulo.ruta : false,
    };
  });

  return {
    autenticado: Boolean(usuario),
    seguridadNominaAceptada: Boolean(seguridadNominaAceptada),
    encabezado: {
      usuario: usuario?.nombreCompleto || usuario?.username || '',
      username: usuario?.username || '',
      empresa: empresa?.nombreComercial || empresa?.razonSocial || '',
      rif: empresa?.rif || '',
      moneda: empresa?.monedaCodigo || 'VES',
    },
    menuOpciones,
    navegar: (destino) => {
      if (typeof onNavegar === 'function') {
        onNavegar(destino);
      }
    },
    cerrarSesion: () => {
      if (typeof onCerrarSesion === 'function') {
        onCerrarSesion();
      }
    },
  };
}

export default construirModeloLayout;

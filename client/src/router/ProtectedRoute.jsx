export function evaluarAccesoRuta({
  sesion,
  seguridadNominaAceptada = false,
  requiereSeguridadNomina = true,
  perfilesRequeridos = [],
  opcionRequerida = null,
}) {
  if (!sesion || !sesion.usuario) {
    return {
      permitido: false,
      motivo: 'NO_AUTENTICADO',
      redirigirA: '/login',
      mensaje: 'Debes iniciar sesión para continuar.',
    };
  }

  if (requiereSeguridadNomina && !seguridadNominaAceptada) {
    return {
      permitido: false,
      motivo: 'SEGURIDAD_NOMINA_PENDIENTE',
      redirigirA: '/seguridad-nomina',
      mensaje: 'Debes confirmar la seguridad de nómina para acceder.',
    };
  }

  const perfilesUsuario = Array.isArray(sesion.perfiles)
    ? sesion.perfiles.map((p) => p.nombre_perfil)
    : [];

  if (perfilesRequeridos.length > 0) {
    const tienePerfil = perfilesRequeridos.some((p) =>
      perfilesUsuario.includes(p)
    );
    if (!tienePerfil) {
      return {
        permitido: false,
        motivo: 'SIN_PERFIL',
        redirigirA: '/acceso-denegado',
        mensaje: 'Tu perfil no tiene permiso para esta sección.',
      };
    }
  }

  if (opcionRequerida) {
    const opcionesUsuario = Array.isArray(sesion.opciones)
      ? sesion.opciones.map((o) => o.nombre)
      : [];
    if (!opcionesUsuario.includes(opcionRequerida)) {
      return {
        permitido: false,
        motivo: 'SIN_OPCION',
        redirigirA: '/acceso-denegado',
        mensaje: 'No tienes habilitada esta opción en el sistema.',
      };
    }
  }

  return {
    permitido: true,
    motivo: 'AUTORIZADO',
    redirigirA: null,
    mensaje: 'Acceso concedido.',
  };
}

export default evaluarAccesoRuta;
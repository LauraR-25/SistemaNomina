export function agruparOpcionesPorSubsistema(opciones = []) {
  return opciones.reduce((acc, item) => {
    const grupo = item.subsistema || 'General';
    if (!acc[grupo]) acc[grupo] = [];
    acc[grupo].push(item);
    return acc;
  }, {});
}

export function alternarSeleccionOpcion(seleccionados = [], opcionId) {
  if (seleccionados.includes(opcionId)) {
    return seleccionados.filter((id) => id !== opcionId);
  }
  return [...seleccionados, opcionId];
}

export function alternarSeleccionGrupo(seleccionados = [], ids = [], marcado) {
  const resultado = new Set(
    (Array.isArray(seleccionados) ? seleccionados : []).map(String)
  );

  (Array.isArray(ids) ? ids : []).forEach((id) => {
    const clave = String(id);
    if (marcado) resultado.add(clave);
    else resultado.delete(clave);
  });

  return [...resultado];
}

export function contarOpcionesSeleccionadas(opciones = [], seleccionados = []) {
  const disponibles = new Set(
    (Array.isArray(opciones) ? opciones : []).map((opcion) => String(opcion.id))
  );

  const marcadas = new Set(
    (Array.isArray(seleccionados) ? seleccionados : [])
      .map(String)
      .filter((id) => disponibles.has(id))
  );

  return marcadas.size;
}

export default {
  agruparOpcionesPorSubsistema,
  alternarSeleccionOpcion,
  alternarSeleccionGrupo,
  contarOpcionesSeleccionadas,
};

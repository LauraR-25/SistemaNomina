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
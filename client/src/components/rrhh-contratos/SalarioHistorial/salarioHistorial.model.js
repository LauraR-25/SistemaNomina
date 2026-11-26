function fechaHistorial(registro) {
  return registro.vigente_desde ?? registro.fecha ?? registro.created_at ?? null;
}

export function ordenarHistorialSalarios(historial = []) {
  return [...(historial ?? [])].sort((primero, segundo) => {
    const diferencia =
      new Date(fechaHistorial(segundo) || 0) -
      new Date(fechaHistorial(primero) || 0);

    return Number.isNaN(diferencia) ? 0 : diferencia;
  });
}

export function esSalarioVigente(registro, fechaReferencia = new Date()) {
  if (!registro) return false;

  const referencia = new Date(fechaReferencia);
  const desde = fechaHistorial(registro);
  const hasta = registro.vigente_hasta ?? registro.fecha_hasta ?? null;

  if (desde && new Date(desde) > referencia) return false;
  if (hasta && new Date(hasta) < referencia) return false;

  return true;
}

export function filtrarHistorialSalarios(
  historial = [],
  { contratoId, personaId } = {}
) {
  return ordenarHistorialSalarios(historial).filter((registro) => {
    const porContrato =
      !contratoId || String(registro.contrato_id) === String(contratoId);
    const porPersona =
      !personaId ||
      String(registro.persona_id) === String(personaId) ||
      String(registro.contrato?.persona_id) === String(personaId);

    return porContrato && porPersona;
  });
}

export default {
  ordenarHistorialSalarios,
  esSalarioVigente,
  filtrarHistorialSalarios,
};

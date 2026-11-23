export function calcularTotalesRecibo(conceptos = []) {
  const asignaciones = conceptos
    .filter((c) => c.naturaleza === 'CREDITO' || c.tipo === 'ASIGNACION')
    .reduce((acc, c) => acc + Number(c.monto || 0), 0);

  const deducciones = conceptos
    .filter((c) => c.naturaleza === 'DEBITO' || c.tipo === 'DEDUCCION')
    .reduce((acc, c) => acc + Number(c.monto || 0), 0);

  return {
    asignaciones,
    deducciones,
    neto: asignaciones - deducciones,
  };
}
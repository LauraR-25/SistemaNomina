export function resumirPrenomina(filas = []) {
  return filas.reduce(
    (acc, fila) => {
      acc.totalAsignaciones += Number(fila.asignaciones || 0);
      acc.totalDeducciones += Number(fila.deducciones || 0);
      acc.totalNeto += Number(fila.neto || 0);
      return acc;
    },
    { totalAsignaciones: 0, totalDeducciones: 0, totalNeto: 0 }
  );
}

export default {
  resumirPrenomina,
};

export function ordenarHistorialSalarios(historial = []) {
  return [...historial].sort(
    (a, b) => new Date(b.fecha || 0) - new Date(a.fecha || 0)
  );
}
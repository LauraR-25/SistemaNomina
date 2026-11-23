export function crearModeloBancosPage(bancos = []) {
  return {
    titulo: 'Catálogo de Bancos',
    bancos,
  };
}

export function establecerBancosModelo(modeloActual, bancos = []) {
  return {
    ...modeloActual,
    bancos,
  };
}

export default {
  crearModeloBancosPage,
  establecerBancosModelo,
};
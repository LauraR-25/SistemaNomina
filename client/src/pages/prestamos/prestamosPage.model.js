import {
  crearEstadoPrestamo,
  prepararPayloadPrestamo,
} from '../../components/prestamos/PrestamoForm/index.js';

export function crearModeloPrestamosPage(prestamos = []) {
  return {
    titulo: 'Préstamos al Personal',
    prestamos,
    formulario: crearEstadoPrestamo(),
  };
}

export function establecerPrestamosModelo(modeloActual, prestamos = []) {
  return {
    ...modeloActual,
    prestamos,
  };
}

export function agregarPrestamoModelo(modeloActual, datosFormulario) {
  const nuevoPrestamo = {
    id: `prestamo-local-${Date.now()}`,
    ...prepararPayloadPrestamo(datosFormulario),
  };

  return {
    ...modeloActual,
    prestamos: [nuevoPrestamo, ...modeloActual.prestamos],
    formulario: crearEstadoPrestamo(),
  };
}

export function actualizarPrestamoModelo(modeloActual, datosFormulario) {
  const payload = prepararPayloadPrestamo(datosFormulario);

  return {
    ...modeloActual,
    prestamos: modeloActual.prestamos.map((prestamo) =>
      String(prestamo.id) === String(datosFormulario.id)
        ? { ...prestamo, ...payload }
        : prestamo
    ),
    formulario: crearEstadoPrestamo(),
  };
}

export function anularPrestamoModelo(modeloActual, id) {
  return {
    ...modeloActual,
    prestamos: modeloActual.prestamos.map((prestamo) =>
      String(prestamo.id) === String(id)
        ? { ...prestamo, estado: 'ANULADO' }
        : prestamo
    ),
  };
}

export default {
  crearModeloPrestamosPage,
  establecerPrestamosModelo,
  agregarPrestamoModelo,
  actualizarPrestamoModelo,
  anularPrestamoModelo,
};

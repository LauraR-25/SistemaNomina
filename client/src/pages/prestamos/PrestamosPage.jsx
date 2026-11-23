import {
  crearEstadoPrestamo,
  prepararPayloadPrestamo,
} from '../../components/prestamos/PrestamoForm.jsx';

export function crearModeloPrestamosPage(prestamos = []) {
  return {
    titulo: 'Préstamos al Personal',
    prestamos,
    formulario: crearEstadoPrestamo(),
  };
}

export function agregarPrestamoModelo(modeloActual, datosFormulario) {
  const nuevoPrestamo = {
    id: Date.now(),
    ...prepararPayloadPrestamo(datosFormulario),
  };

  return {
    ...modeloActual,
    prestamos: [nuevoPrestamo, ...modeloActual.prestamos],
    formulario: crearEstadoPrestamo(),
  };
}

export default {
  crearModeloPrestamosPage,
  agregarPrestamoModelo,
};
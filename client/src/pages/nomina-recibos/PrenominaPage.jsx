import { resumirPrenomina } from '../../components/nomina-recibos/TablaPrenomina.jsx';

export function crearModeloPrenominaPage(filas = []) {
  return {
    titulo: 'Prenómina',
    filas,
    resumen: resumirPrenomina(filas),
  };
}

export function actualizarPrenominaModelo(modeloActual, filas = []) {
  return {
    ...modeloActual,
    filas,
    resumen: resumirPrenomina(filas),
  };
}

export default {
  crearModeloPrenominaPage,
  actualizarPrenominaModelo,
};
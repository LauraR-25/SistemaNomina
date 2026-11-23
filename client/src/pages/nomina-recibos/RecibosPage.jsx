import { calcularTotalesRecibo } from '../../components/nomina-recibos/ReciboDetalle.jsx';

export function crearModeloRecibosPage(recibos = [], reciboActivo = null) {
  const totales = reciboActivo
    ? calcularTotalesRecibo(reciboActivo.conceptos || [])
    : { asignaciones: 0, deducciones: 0, neto: 0 };

  return {
    titulo: 'Recibos de Pago',
    recibos,
    reciboActivo,
    totales,
  };
}

export function seleccionarReciboModelo(modeloActual, recibo) {
  return {
    ...modeloActual,
    reciboActivo: recibo,
    totales: calcularTotalesRecibo(recibo?.conceptos || []),
  };
}

export default {
  crearModeloRecibosPage,
  seleccionarReciboModelo,
};
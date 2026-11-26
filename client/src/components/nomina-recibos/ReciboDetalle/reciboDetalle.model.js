import { numero } from '../nominaRecibos.helpers.js';

function esAporte(concepto) {
  return Boolean(
    concepto &&
      (concepto.tipo === 'APORTE_PATRONAL' ||
        concepto.naturaleza === 'APORTE_PATRONAL' ||
        concepto.aporte_patronal === true)
  );
}

function esCredito(concepto) {
  return (
    concepto?.naturaleza === 'CREDITO' || concepto?.tipo === 'ASIGNACION'
  );
}

function esDebito(concepto) {
  return concepto?.naturaleza === 'DEBITO' || concepto?.tipo === 'DEDUCCION';
}

function montoDe(concepto) {
  return numero(concepto?.monto ?? concepto?.monto_total ?? concepto?.total ?? 0);
}

export function clasificarConceptosRecibo(conceptos = []) {
  const lista = Array.isArray(conceptos) ? conceptos : [];

  return {
    asignaciones: lista.filter(
      (concepto) => !esAporte(concepto) && esCredito(concepto)
    ),
    deducciones: lista.filter(
      (concepto) => !esAporte(concepto) && esDebito(concepto)
    ),
    aportesPatronales: lista.filter(esAporte),
  };
}

export function calcularTotalesRecibo(conceptos = []) {
  const { asignaciones, deducciones } = clasificarConceptosRecibo(conceptos);

  const totalAsignaciones = asignaciones.reduce(
    (acc, concepto) => acc + montoDe(concepto),
    0
  );
  const totalDeducciones = deducciones.reduce(
    (acc, concepto) => acc + montoDe(concepto),
    0
  );

  return {
    asignaciones: totalAsignaciones,
    deducciones: totalDeducciones,
    neto: totalAsignaciones - totalDeducciones,
  };
}

export default {
  clasificarConceptosRecibo,
  calcularTotalesRecibo,
};

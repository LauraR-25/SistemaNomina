import {
  nombreEmpleado,
  numero,
} from '../../components/nomina-recibos/nominaRecibos.helpers.js';
import { calcularTotalesRecibo } from '../../components/nomina-recibos/ReciboDetalle/reciboDetalle.model.js';

const METODOS_PAGO = [
  'TRANSFERENCIA',
  'PAGO_MOVIL',
  'EFECTIVO',
  'CHEQUE',
];

function contratoDe(item, contratos) {
  if (!item) return null;
  if (item.contrato) return item.contrato;

  const id = item.contrato_id ?? item.id;

  return (
    contratos.find((contrato) => String(contrato.id) === String(id)) ?? null
  );
}

function personaDe(item, contrato, personas) {
  const candidata =
    item?.persona ?? item?.empleado ?? contrato?.persona ?? contrato?.empleado;

  if (candidata) return candidata;

  const id = item?.persona_id ?? contrato?.persona_id ?? item?.id;

  return personas.find((persona) => String(persona.id) === String(id)) ?? null;
}

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

export function establecerRecibosModelo(modeloActual, recibos = []) {
  return {
    ...modeloActual,
    recibos,
  };
}

export function seleccionarReciboModelo(modeloActual, recibo) {
  return {
    ...modeloActual,
    reciboActivo: recibo,
    totales: calcularTotalesRecibo(recibo?.conceptos || []),
  };
}

export function generarRecibosLocales(periodo, personas = [], contratos = []) {
  const listaPersonas = Array.isArray(personas) ? personas : [];
  const listaContratos = Array.isArray(contratos) ? contratos : [];
  const propios = periodo?.recibos;

  if (Array.isArray(propios) && propios.length > 0) return propios;

  const origen =
    listaContratos.length > 0 ? listaContratos : listaPersonas;

  return origen.map((item, indice) => {
    const contrato = contratoDe(item, listaContratos);
    const persona = personaDe(item, contrato, listaPersonas);
    const salario = numero(
      item.salario ?? contrato?.salario ?? contrato?.salario_base ?? 0
    );
    const asignaciones = numero(item.asignaciones ?? salario);
    const deducciones = numero(item.deducciones ?? 0);
    const aportesPatronales = Math.round(asignaciones * 0.12 * 100) / 100;
    const neto = Math.max(0, asignaciones - deducciones);
    const sufijo = `${periodo?.id ?? 'local'}-${indice + 1}`;

    const conceptos = [
      {
        id: `asignacion-${sufijo}`,
        nombre: 'Salario base',
        tipo: 'ASIGNACION',
        naturaleza: 'CREDITO',
        cantidad: 1,
        monto: asignaciones,
        monto_total: asignaciones,
      },
      {
        id: `deduccion-${sufijo}`,
        nombre: 'Deducciones legales',
        tipo: 'DEDUCCION',
        naturaleza: 'DEBITO',
        cantidad: 1,
        monto: deducciones,
        monto_total: deducciones,
      },
      {
        id: `aporte-${sufijo}`,
        nombre: 'Aportes patronales',
        tipo: 'APORTE_PATRONAL',
        naturaleza: 'CREDITO',
        cantidad: 1,
        monto: aportesPatronales,
        monto_total: aportesPatronales,
      },
    ];

    return {
      id: `recibo-${sufijo}`,
      empresa_id: periodo?.empresa_id,
      periodo_id: periodo?.id,
      periodo,
      contrato_id: contrato?.id ?? item.contrato_id ?? item.id,
      contrato,
      persona,
      empleado: persona,
      nombre: nombreEmpleado(persona ?? item.empleado ?? item),
      total_asignaciones: asignaciones,
      total_deducciones: deducciones,
      total_aportes_patronales: aportesPatronales,
      neto_pagar: neto,
      metodo_pago: METODOS_PAGO[indice % METODOS_PAGO.length],
      referencia_pago: '',
      fecha_pago: null,
      estado: periodo?.estado === 'PAGADO' ? 'PAGADO' : 'PENDIENTE',
      conceptos,
    };
  });
}

export default {
  crearModeloRecibosPage,
  establecerRecibosModelo,
  seleccionarReciboModelo,
  generarRecibosLocales,
};

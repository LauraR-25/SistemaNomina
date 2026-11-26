import { nombreEmpleado, numero } from '../../components/nomina-recibos/nominaRecibos.helpers.js';
import { resumirPrenomina } from '../../components/nomina-recibos/TablaPrenomina/tablaPrenomina.model.js';

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

function obtenerOrigen(periodo, contratos, personas) {
  const propias = periodo?.empleados ?? periodo?.filas ?? periodo?.prenomina;

  if (Array.isArray(propias) && propias.length > 0) return propias;
  if (Array.isArray(contratos) && contratos.length > 0) return contratos;

  return Array.isArray(personas) ? personas : [];
}

export function crearModeloPrenominaPage(filas = [], ejecucion = null) {
  return {
    titulo: 'Prenómina',
    filas,
    resumen: resumirPrenomina(filas),
    ejecucion,
  };
}

export function actualizarPrenominaModelo(
  modeloActual,
  filas = [],
  ejecucion
) {
  return {
    ...modeloActual,
    filas,
    resumen: resumirPrenomina(filas),
    ejecucion:
      ejecucion === undefined ? modeloActual.ejecucion ?? null : ejecucion,
  };
}

export function generarPrenominaLocal(
  periodo,
  contratos = [],
  personas = []
) {
  const listaContratos = Array.isArray(contratos) ? contratos : [];
  const listaPersonas = Array.isArray(personas) ? personas : [];
  const origen = obtenerOrigen(periodo, listaContratos, listaPersonas);

  return origen.map((item, indice) => {
    const contrato = contratoDe(item, listaContratos);
    const persona = personaDe(item, contrato, listaPersonas);
    const salario = numero(
      item.salario ??
        item.salario_base_periodo ??
        contrato?.salario ??
        contrato?.salario_base ??
        0
    );
    const asignaciones = numero(item.asignaciones ?? salario);
    const deducciones = numero(item.deducciones ?? 0);
    const neto = numero(
      item.neto ?? Math.max(0, asignaciones - deducciones)
    );

    return {
      id: item.id ?? `prenomina-${indice + 1}`,
      empleado: persona ?? item.empleado ?? item,
      nombre: nombreEmpleado(persona ?? item.empleado ?? item),
      contrato_id: contrato?.id ?? item.contrato_id ?? item.id,
      salario_base_periodo: salario,
      asignaciones,
      deducciones,
      neto,
      observacion: item.observacion ?? '',
    };
  });
}

export default {
  crearModeloPrenominaPage,
  actualizarPrenominaModelo,
  generarPrenominaLocal,
};

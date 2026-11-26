export const ESTADOS_AFILIACION = [
  { value: 'ACTIVO', label: 'Activo' },
  { value: 'SUSPENDIDO', label: 'Suspendido' },
  { value: 'BAJA', label: 'Baja' },
];

function texto(valor) {
  return String(valor ?? '').trim();
}

function numeroOpcional(valor) {
  if (valor === '' || valor === null || valor === undefined) return null;
  const numero = Number(valor);
  return Number.isFinite(numero) ? numero : null;
}

export function crearEstadoAfiliacionLey(initialData = {}) {
  const persona = initialData.persona_id ?? initialData.contrato_id ?? '';

  return {
    persona_id: persona,
    contrato_id: initialData.contrato_id ?? persona,
    tipo_aporte_id: initialData.tipo_aporte_id ?? initialData.regimen ?? '',
    regimen: initialData.regimen ?? initialData.tipo_aporte_id ?? '',
    nro_afiliacion: initialData.nro_afiliacion || '',
    fecha_afiliacion: initialData.fecha_afiliacion || '',
    fecha_baja: initialData.fecha_baja || '',
    estado: initialData.estado || 'ACTIVO',
    activo: initialData.activo ?? true,
  };
}

export function prepararPayloadAfiliacionLey(estado) {
  const tipoAporte = estado.tipo_aporte_id ?? estado.regimen ?? null;
  const estadoFinal = estado.estado || 'ACTIVO';

  return {
    persona_id: estado.persona_id || estado.contrato_id || null,
    contrato_id: estado.contrato_id || estado.persona_id || null,
    tipo_aporte_id: numeroOpcional(tipoAporte),
    regimen: texto(estado.regimen ?? tipoAporte),
    nro_afiliacion: texto(estado.nro_afiliacion).slice(0, 50),
    fecha_afiliacion: estado.fecha_afiliacion || null,
    fecha_baja: estado.fecha_baja || null,
    estado: estadoFinal,
    activo: estado.activo !== false && estadoFinal === 'ACTIVO',
  };
}

export default {
  crearEstadoAfiliacionLey,
  prepararPayloadAfiliacionLey,
  ESTADOS_AFILIACION,
};

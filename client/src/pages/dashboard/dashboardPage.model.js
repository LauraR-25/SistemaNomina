import { obtenerMenuParaSesion } from '../../config/navigation.config.js';
import { formatNumero } from '../../utils/formatters.js';

export const SIN_DATOS = 'Sin datos';

const ETIQUETAS_ESTADO = {
  ACTIVO: 'Activo',
  INACTIVO: 'Inactivo',
  SOLICITADO: 'Solicitado',
  PAGADO: 'Pagado',
  ANULADO: 'Anulado',
  APROBADO: 'Aprobado',
  RECHAZADO: 'Rechazado',
  APLICADO: 'Aplicado',
  PENDIENTE: 'Pendiente',
  DESCONTADO: 'Descontado',
};

export function obtenerNombreUsuario(sesion) {
  const usuario = sesion?.usuario;

  return usuario?.nombreCompleto || usuario?.username || 'usuario';
}

export function obtenerNombreEmpresa(sesion) {
  const empresa = sesion?.empresa;

  return empresa?.nombreComercial || empresa?.razonSocial || '';
}

export function crearValorIndicador(registros) {
  if (!Array.isArray(registros) || registros.length === 0) {
    return SIN_DATOS;
  }

  return formatNumero(registros.length);
}

export function crearIndicadores({
  personas = [],
  periodos = [],
  prestamos = [],
  bancos = [],
  cargando = {},
}) {
  return [
    {
      id: 'personas',
      titulo: 'Personas registradas',
      icono: 'users',
      valor: crearValorIndicador(personas),
      loading: Boolean(cargando.personas),
    },
    {
      id: 'periodos',
      titulo: 'Períodos de nómina',
      icono: 'calendar',
      valor: crearValorIndicador(periodos),
      loading: Boolean(cargando.periodos),
    },
    {
      id: 'prestamos',
      titulo: 'Préstamos',
      icono: 'wallet',
      valor: crearValorIndicador(prestamos),
      loading: Boolean(cargando.prestamos),
    },
    {
      id: 'bancos',
      titulo: 'Bancos disponibles',
      icono: 'bank',
      valor: crearValorIndicador(bancos),
      loading: Boolean(cargando.catalogos),
    },
  ];
}

export function agruparPorEstado(registros) {
  if (!Array.isArray(registros) || registros.length === 0) return [];

  const conteos = new Map();

  registros.forEach((registro) => {
    const estado = String(registro?.estado ?? '').trim();

    if (!estado) return;

    conteos.set(estado, (conteos.get(estado) ?? 0) + 1);
  });

  return [...conteos.entries()]
    .map(([estado, valor]) => ({
      etiqueta: ETIQUETAS_ESTADO[estado] ?? estado,
      valor,
    }))
    .sort(
      (a, b) =>
        b.valor - a.valor || a.etiqueta.localeCompare(b.etiqueta, 'es')
    );
}

export function obtenerAccesosRapidos(sesion) {
  const menu = obtenerMenuParaSesion(sesion);
  const entradas = Array.isArray(menu)
    ? menu.flatMap((entrada) =>
        Array.isArray(entrada?.modulos) ? entrada.modulos : [entrada]
      )
    : [];

  return entradas
    .filter((entrada) => entrada?.ruta && entrada.id !== 'inicio')
    .map((entrada) => ({
      id: entrada.id,
      etiqueta: entrada.etiqueta,
      ruta: entrada.ruta,
      icono: entrada.icono || 'dashboard',
      descripcion: entrada.descripcion || entrada.subsistema || '',
      orden: entrada.orden ?? 0,
    }));
}

export default {
  SIN_DATOS,
  obtenerNombreUsuario,
  obtenerNombreEmpresa,
  crearValorIndicador,
  crearIndicadores,
  agruparPorEstado,
  obtenerAccesosRapidos,
};

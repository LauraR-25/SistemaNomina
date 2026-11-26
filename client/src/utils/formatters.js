const GUION = '—';

function esVacio(valor) {
  return valor === null || valor === undefined || (typeof valor === 'string' && valor.trim() === '');
}

function dosDigitos(valor) {
  return String(valor).padStart(2, '0');
}

function obtenerPartesFecha(fecha) {
  if (typeof fecha === 'string') {
    const coincidencia = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}))?/.exec(fecha.trim());

    if (coincidencia) {
      return {
        anio: coincidencia[1],
        mes: coincidencia[2],
        dia: coincidencia[3],
        hora: coincidencia[4] || '00',
        minuto: coincidencia[5] || '00',
      };
    }
  }

  if (!(fecha instanceof Date) && typeof fecha !== 'number') return null;

  const fechaObjeto = new Date(fecha);

  if (Number.isNaN(fechaObjeto.getTime())) return null;

  return {
    anio: fechaObjeto.getFullYear(),
    mes: dosDigitos(fechaObjeto.getMonth() + 1),
    dia: dosDigitos(fechaObjeto.getDate()),
    hora: dosDigitos(fechaObjeto.getHours()),
    minuto: dosDigitos(fechaObjeto.getMinutes()),
  };
}

export function formatMoneda(valor, moneda = 'VES') {
  if (esVacio(valor)) return GUION;

  const numero = Number(valor);

  if (!Number.isFinite(numero)) return GUION;

  try {
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency: moneda,
    }).format(numero);
  } catch {
    return `${formatNumero(numero)} ${moneda}`;
  }
}

export function formatNumero(valor, opciones = {}) {
  if (esVacio(valor)) return GUION;

  const numero = Number(valor);

  if (!Number.isFinite(numero)) return GUION;

  return new Intl.NumberFormat('es-VE', opciones).format(numero);
}

export function formatFecha(fecha) {
  const partes = obtenerPartesFecha(fecha);

  if (!partes) return GUION;

  return `${partes.dia}/${partes.mes}/${partes.anio}`;
}

export function formatFechaHora(fecha) {
  const partes = obtenerPartesFecha(fecha);

  if (!partes) return GUION;

  return `${partes.dia}/${partes.mes}/${partes.anio} ${partes.hora}:${partes.minuto}`;
}

export function formatRif(valor) {
  if (esVacio(valor)) return GUION;

  const texto = String(valor).replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  const coincidencia = /^([A-Z])(\d{8})(\d)$/.exec(texto);

  return coincidencia
    ? `${coincidencia[1]}-${coincidencia[2]}-${coincidencia[3]}`
    : texto;
}

export function formatCedula(valor) {
  if (esVacio(valor)) return GUION;

  const texto = String(valor).replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  const coincidencia = /^([VE])(\d{7,8})$/.exec(texto);

  if (!coincidencia) return texto;

  const numeros = coincidencia[2].replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return `${coincidencia[1]}-${numeros}`;
}

import { COLORES_GRAFICO } from '../../../config/theme.config.js';
import { formatNumero } from '../../../utils/formatters.js';

export function colorSerie(indice, colores) {
  const paleta = Array.isArray(colores) && colores.length > 0 ? colores : COLORES_GRAFICO;
  return paleta[indice % paleta.length];
}

export function valorNumerico(valor) {
  if (typeof valor === 'number') return Number.isFinite(valor) ? valor : null;

  if (valor && typeof valor === 'object') {
    return valorNumerico(valor.value ?? valor.valor ?? valor.monto ?? valor.total);
  }

  if (valor === null || valor === undefined || valor === '') return null;

  const numero = Number(valor);
  return Number.isFinite(numero) ? numero : null;
}

export function etiquetaDato(entrada, indice) {
  if (entrada && typeof entrada === 'object') {
    return entrada.label ?? entrada.etiqueta ?? entrada.name ?? entrada.nombre ?? String(indice + 1);
  }

  return String(indice + 1);
}

export function normalizarSerie(datos) {
  return (Array.isArray(datos) ? datos : [])
    .map((entrada, indice) => ({
      indice,
      etiqueta: etiquetaDato(entrada, indice),
      valor: valorNumerico(entrada),
    }))
    .filter((punto) => punto.valor !== null);
}

export function rutaSuave(puntos) {
  if (puntos.length === 0) return '';
  if (puntos.length === 1) return `M ${puntos[0].x} ${puntos[0].y}`;

  let trayecto = `M ${puntos[0].x} ${puntos[0].y}`;

  for (let indice = 0; indice < puntos.length - 1; indice += 1) {
    const anterior = puntos[indice - 1] ?? puntos[indice];
    const actual = puntos[indice];
    const siguiente = puntos[indice + 1];
    const posterior = puntos[indice + 2] ?? siguiente;

    const c1x = actual.x + (siguiente.x - anterior.x) / 6;
    const c1y = actual.y + (siguiente.y - anterior.y) / 6;
    const c2x = siguiente.x - (posterior.x - actual.x) / 6;
    const c2y = siguiente.y - (posterior.y - actual.y) / 6;

    trayecto += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${siguiente.x} ${siguiente.y}`;
  }

  return trayecto;
}

export function escalaEje(maximo, divisiones = 4) {
  if (!Number.isFinite(maximo) || maximo <= 0) {
    return { techo: divisiones, paso: 1 };
  }

  const magnitud = 10 ** Math.floor(Math.log10(maximo));
  const objetivo = maximo / divisiones / magnitud;
  const multiplo = [1, 2, 2.5, 5, 10].find((valor) => valor >= objetivo) ?? 10;
  const paso = multiplo * magnitud;

  return { techo: Math.ceil(maximo / paso) * paso, paso };
}

export function formatearValor(valor, formateador) {
  if (typeof formateador === 'function') return formateador(valor);
  return formatNumero(valor, { maximumFractionDigits: 2 });
}

export function idUnico(valor) {
  return String(valor ?? '').replace(/[^a-zA-Z0-9_-]/g, '');
}

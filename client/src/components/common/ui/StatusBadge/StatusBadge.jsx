import * as configuracionEstado from '../../../../config/status.config.js';
import cx from '../../../../utils/cx.js';
import { Badge } from '../Badge/Badge.jsx';
import styles from './StatusBadge.module.css';

const VARIANTES = ['neutral', 'accent', 'success', 'warning', 'danger', 'info'];

const CLAVES_MAPA = [
  'ESTADOS',
  'ESTADOS_APP',
  'ESTADOS_NOMINA',
  'ESTADOS_POR_MODULO',
  'MAPEO_ESTADOS',
  'CONFIG_ESTADOS',
  'mapaEstados',
  'default',
];

const ETIQUETAS = {
  PRENOMINA: 'Prenómina',
  NOMINA: 'Nómina',
  NOMINA_PROCESADA: 'Nómina procesada',
  RECIBO: 'Recibo',
  CUOTA: 'Cuota',
  RIF: 'RIF',
};

function obtenerMapa() {
  for (const clave of CLAVES_MAPA) {
    const valor = configuracionEstado[clave];

    if (valor && typeof valor === 'object') return valor;
  }

  return {};
}

function textoLegible(estado) {
  const texto = String(estado ?? '').replace(/_/g, ' ').trim();

  if (!texto) return 'Sin estado';

  return texto
    .toLowerCase()
    .split(/\s+/)
    .map((palabra) => {
      const clave = palabra.toUpperCase();

      return ETIQUETAS[clave] ?? palabra.charAt(0).toUpperCase() + palabra.slice(1);
    })
    .join(' ');
}

function resolverEstado(estado) {
  const texto = String(estado ?? '');
  const mapa = obtenerMapa();
  const entrada = mapa[texto.toUpperCase()] ?? mapa[texto];

  if (entrada && typeof entrada === 'object') {
    const variante = entrada.variante ?? entrada.variant;

    return {
      etiqueta: entrada.etiqueta ?? entrada.label ?? entrada.texto ?? textoLegible(estado),
      variante: VARIANTES.includes(variante) ? variante : 'neutral',
    };
  }

  return {
    etiqueta: typeof entrada === 'string' ? entrada : textoLegible(estado),
    variante: 'neutral',
  };
}

/**
 * @param {{ estado?: string, status?: string, size?: 'sm'|'md', dot?: boolean, className?: string }} props
 */
export function StatusBadge({ estado, status, size = 'md', dot = true, className, ...props }) {
  const { etiqueta, variante } = resolverEstado(estado ?? status);

  return (
    <Badge
      className={cx(styles.estado, className)}
      variant={variante}
      size={size}
      dot={dot}
      {...props}
    >
      {etiqueta}
    </Badge>
  );
}

export default StatusBadge;

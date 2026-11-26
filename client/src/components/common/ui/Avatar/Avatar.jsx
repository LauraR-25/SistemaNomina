import { useState } from 'react';
import cx from '../../../../utils/cx.js';
import styles from './Avatar.module.css';

function obtenerIniciales(nombre) {
  const palabras = String(nombre ?? '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!palabras.length) return '?';

  return (palabras[0].charAt(0) + (palabras[1]?.charAt(0) ?? ''))
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * @param {{ nombre?: string, src?: string, size?: 'sm'|'md'|'lg', conBorde?: boolean, className?: string }} props
 */
export function Avatar({ nombre = '', src, size = 'md', conBorde = false, className }) {
  const [srcFallido, setSrcFallido] = useState(null);

  const mostrarImagen = src && src !== srcFallido;

  return (
    <span
      className={cx(
        styles.avatar,
        styles[size],
        conBorde && styles.conBorde,
        className
      )}
      title={nombre || undefined}
    >
      {mostrarImagen ? (
        <img
          className={styles.imagen}
          src={src}
          alt={nombre ? `Avatar de ${nombre}` : 'Avatar'}
          onError={() => setSrcFallido(src)}
        />
      ) : (
        <span className={styles.iniciales} aria-hidden="true">
          {obtenerIniciales(nombre)}
        </span>
      )}
    </span>
  );
}

export default Avatar;

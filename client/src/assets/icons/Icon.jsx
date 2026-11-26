import { ICONOS } from './index.js';

/**
 * @param {{ name: string, size?: number, strokeWidth?: number, className?: string }} props
 */
export function Icon({ name, size = 20, strokeWidth = 1.75, className }) {
  const icono = ICONOS[name];

  if (!icono) return null;

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox={icono.viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
    >
      {icono.paths.map((trazo) => (
        <path key={trazo} d={trazo} />
      ))}
    </svg>
  );
}

export default Icon;

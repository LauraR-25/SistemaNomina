import cx from '../../../../utils/cx.js';
import styles from './Badge.module.css';

/**
 * @param {{ children?: React.ReactNode, variant?: 'neutral'|'accent'|'success'|'warning'|'danger'|'info', size?: 'sm'|'md', dot?: boolean, className?: string }} props
 */
export function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  className,
  ...props
}) {
  return (
    <span
      className={cx(styles.badge, styles[variant], styles[size], className)}
      {...props}
    >
      {dot && <span className={styles.punto} aria-hidden="true" />}
      {children}
    </span>
  );
}

export default Badge;

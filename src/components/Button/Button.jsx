// src/components/Button/Button.jsx
import styles from './Button.module.css';
import clsx from 'clsx'; 

export function Button({
  children,
  variant = 'primary',
  size,
  disabled,
  onClick,
  type = 'button'
}) {
  return (
    <button
      type={type}
      className={clsx(styles.btn, styles[variant], size && styles[size])}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
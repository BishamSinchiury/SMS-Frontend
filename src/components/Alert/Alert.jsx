// src/components/Alert/Alert.jsx
import styles from './Alert.module.css';

const ICONS = { error: '✕', success: '✓', warning: '⚠', info: 'ℹ' };

export function Alert({ type = 'info', title, message }) {
  return (
    <div className={`${styles.alert} ${styles[type]}`}>
      <span className={styles.icon}>{ICONS[type]}</span>
      <div className={styles.message}>
        {title && <div className={styles.title}>{title}</div>}
        <div>{message}</div>
      </div>
    </div>
  );
}
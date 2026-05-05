// src/components/Modal/Modal.jsx
import { createPortal } from 'react-dom';
import { useEffect } from 'react';
import styles from './Modal.module.css';
import { Button } from '../Button/Button';

export function Modal({ isOpen, title, children, actions, onClose }) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {title && (
          <div className={styles.header}>
            <h2 className={styles.title}>{title}</h2>
          </div>
        )}
        <div className={styles.body}>{children}</div>
        {actions && <div className={styles.footer}>{actions}</div>}
      </div>
    </div>,
    document.body
  );
}

// Pre-built action sets
export function ModalActions({ onOk, onCancel, onDelete, onDone, danger }) {
  return (
    <>
      {onDelete && <Button variant="danger" onClick={onDelete}>Delete</Button>}
      {onCancel && <Button variant="ghost" onClick={onCancel}>Cancel</Button>}
      {onOk && <Button variant="primary" onClick={onOk}>OK</Button>}
      {onDone && <Button variant="primary" onClick={onDone}>Done</Button>}
    </>
  );
}
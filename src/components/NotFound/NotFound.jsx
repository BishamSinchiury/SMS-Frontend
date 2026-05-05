// src/pages/NotFound/NotFound.jsx
import styles from './NotFound.module.css';
import { Button } from '../../components/Button/Button';

export default function NotFound() {
  return (
    <div className={styles.page}>
      <div className={styles.code}>404</div>
      <h1 className={styles.title}>Page not found</h1>
      <p className={styles.subtitle}>
        The page you're looking for doesn't exist or was moved.
      </p>
      <Button onClick={() => window.history.back()}>Go back</Button>
    </div>
  );
}
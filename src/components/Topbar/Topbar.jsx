// src/components/TopBar/TopBar.jsx
import styles from './TopBar.module.css';

export default function TopBar({ onMenuClick, isMenuOpen }) {
  return (
    <header className={styles.topbar}>

      {/* Hamburger — only visible on mobile via CSS */}
      <button
        className={`${styles.hamburger} ${isMenuOpen ? styles.active : ''}`}
        onClick={onMenuClick}
        aria-label="Toggle navigation"
        aria-expanded={isMenuOpen}
      >
        <span />
        <span />
        <span />
      </button>

      {/* Logo / school name */}
      <div className={styles.logo}>EduCore</div>

      {/* Right side actions */}
      <div className={styles.actions}>
        <button className={styles.iconBtn} aria-label="Notifications">
          🔔
        </button>
        <div className={styles.avatar}>AK</div>
      </div>

    </header>
  );
}
// src/components/Layout/Layout.jsx
import { useState } from 'react';
import styles from './Layout.module.css';
import TopBar  from '@/components/Topbar/Topbar';

export function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);
  const closeSidebar  = () => setSidebarOpen(false);

  return (
    <div className={styles.wrapper}>

      <TopBar
        onMenuClick={toggleSidebar}
        isMenuOpen={sidebarOpen}
      />

      <div className={styles.body}>

        {/* Overlay — tap to close sidebar on mobile */}
        {sidebarOpen && (
          <div
            className={styles.sidebarOverlay}
            onClick={closeSidebar}
          />
        )}

        {/* Sidebar */}
        <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : ''}`}>
          {/* nav items go here */}
        </aside>

        {/* Page content */}
        <main className={styles.main}>
          {children}
        </main>

      </div>
    </div>
  );
}
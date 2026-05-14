import { useState, useEffect, useRef } from 'react'
import { NavLink, Outlet, useNavigate, useLocation, Navigate } from 'react-router-dom'
import { useSysadmin } from '@/context/SysadminAuthContext'
import { adminLogout } from '@/api/services/adminAuthService'
import styles from './AdminLayout.module.css'

const NAV_SECTIONS = [
  {
    group: 'Management',
    items: [
      { label: 'Organizations',     path: '/admin/organizations',     icon: 'ti-building'          },
      { label: 'Sub-organizations', path: '/admin/sub-organizations', icon: 'ti-building-community' },
      { label: 'User Roles',        path: '/admin/user-roles',        icon: 'ti-shield-half'       },
    ],
  },
  {
    group: 'System',
    items: [
      { label: 'App Logs', path: '/admin/logs', icon: 'ti-terminal-2' },
    ],
  },
]

export default function AdminLayout() {
  const { sysadmin, setSysadmin, loading } = useSysadmin()
  const navigate  = useNavigate()
  const location  = useLocation()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const drawerRef = useRef(null)

  // Close drawer on route change
  useEffect(() => { setDrawerOpen(false) }, [location.pathname])

  // Close drawer on outside click
  useEffect(() => {
    if (!drawerOpen) return
    function handleClick(e) {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        setDrawerOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [drawerOpen])

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  async function handleLogout() {
    try {
      await adminLogout()   // flushes the session cookie server-side
    } catch {
      // even if the request fails, clear local state and redirect
    } finally {
      setSysadmin(null)
      navigate('/admin/login', { replace: true })
    }
  }

  // All hooks are above — safe to return early now
  // While session check is still running, render nothing — don't flash or redirect prematurely
  if (loading) return null

  // Session check done and no valid sysadmin — redirect to login
  if (!sysadmin) return <Navigate to="/admin/login" replace />

  const initials = sysadmin?.name
    ? sysadmin.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'SA'

  // Shared sidebar content — used in both desktop sidebar and mobile drawer
  function SidebarContent() {
    return (
      <>
        <div className={styles.brand}>
          <div className={styles.brandIcon}>S</div>
          <div>
            <p className={styles.brandName}>SchoolMS</p>
            <p className={styles.brandRole}>Sysadmin Panel</p>
          </div>
        </div>

        <nav className={styles.nav} aria-label="Admin navigation">
          {NAV_SECTIONS.map(section => (
            <div key={section.group} className={styles.navGroup}>
              <p className={styles.navGroupLabel}>{section.group}</p>
              {section.items.map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
                  }
                >
                  <i className={`ti ${item.icon}`} aria-hidden="true" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className={styles.userBlock}>
          <div className={styles.avatar} aria-hidden="true">{initials}</div>
          <div className={styles.userInfo}>
            <p className={styles.userName}>{sysadmin?.name ?? 'Administrator'}</p>
            <p className={styles.userEmail}>{sysadmin?.email ?? ''}</p>
          </div>
          <button
            className={styles.logoutBtn}
            onClick={handleLogout}
            aria-label="Log out"
            title="Log out"
          >
            <i className="ti ti-logout" aria-hidden="true" />
          </button>
        </div>
      </>
    )
  }

  return (
    <div className={styles.shell}>

      {/* ── Desktop sidebar ───────────────────────────────────── */}
      <aside className={styles.sidebar}>
        <SidebarContent />
      </aside>

      {/* ── Mobile: backdrop + slide-in drawer ───────────────── */}
      <div
        className={`${styles.backdrop} ${drawerOpen ? styles.backdropVisible : ''}`}
        aria-hidden="true"
        onClick={() => setDrawerOpen(false)}
      />

      <aside
        ref={drawerRef}
        className={`${styles.drawer} ${drawerOpen ? styles.drawerOpen : ''}`}
        aria-modal="true"
        aria-label="Mobile admin navigation"
      >
        <SidebarContent />
      </aside>

      {/* ── Right pane: topbar + content ─────────────────────── */}
      <div className={styles.rightPane}>

        {/* Mobile topbar (hidden on desktop) */}
        <header className={styles.topbar}>
          <button
            className={styles.hamburger}
            onClick={() => setDrawerOpen(o => !o)}
            aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={drawerOpen}
          >
            <i className={`ti ${drawerOpen ? 'ti-x' : 'ti-menu-2'}`} aria-hidden="true" />
          </button>

          <div className={styles.topbarBrand}>
            <div className={styles.brandIconSm}>S</div>
            <span className={styles.brandName}>SchoolMS</span>
          </div>

          <div className={styles.topbarAvatar} aria-hidden="true">{initials}</div>
        </header>

        <main className={styles.main}>
          <Outlet />
        </main>

      </div>

    </div>
  )
}
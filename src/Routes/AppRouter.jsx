// src/Routes/AppRouter.jsx
import { Routes, Route, Outlet } from 'react-router-dom'

import publicRoutes                              from './public.routes'
import { userAuthRoutes, userDashboardRoutes }   from './user.routes'
import { adminAuthRoutes, adminDashboardRoutes } from './admin.routes'

import UserLayout  from '@/layouts/UserLayout'
import AdminLayout from '@/layouts/AdminLayout'
import NotFound    from '@/components/NotFound/NotFound'
import { SysadminAuthProvider } from '@/context/SysadminAuthContext'  // ← add this

export default function AppRouter() {
  return (
    <Routes>

      {/* ── GROUP 1: Public ─────────────────────────────────────────────
          No layout, no context, no guards.
          Anyone can see these pages.                                    */}
      {publicRoutes.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ))}


      {/* ── GROUP 2A: User Auth (login, register) ───────────────────────
          No layout — user sees a full-screen login/register page.       */}
      {userAuthRoutes.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ))}


      {/* ── GROUP 2B: User Dashboard ────────────────────────────────────
          Wrapped with UserLayout.
          UserLayout has <Outlet /> so child pages render inside it.     */}
      <Route element={<UserLayout />}>
        {userDashboardRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Route>


      <Route
        element={<SysadminAuthProvider><Outlet /></SysadminAuthProvider>}
      >
        {adminAuthRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}

        <Route element={<AdminLayout />}>
          {adminDashboardRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Route>
      </Route>


      {/* ── 404 ─────────────────────────────────────────────────────────
          Catches any path not matched above.                            */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  )
}
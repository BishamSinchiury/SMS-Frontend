// src/Routes/index.jsx
import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/Layout/Layout.jsx'

import websiterouts from './website/websiteRoutes'
import authrouts from './webapp/public/auth/authroutes'
import privateRoutes from './webapp/private/privateRoutes'
import AdminRoutes from './webapp/adminroutes/AdminRoutes'
import { SysadminAuthLayout } from './webapp/adminroutes/SysadminAuthLayout'

import Notfound from '@/components/NotFound/NotFound.jsx'
import AdminLogin from '@/pages/Website/auth/adminlogin/AdminLogin.jsx'

export default function AppRouter() {
  return (
    <Routes>

      {/* ── Website routes — no layout, no context ─────────────────────── */}
      {websiterouts.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ))}

      {/* ── Regular auth routes — no sysadmin context ──────────────────── */}
      {authrouts.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ))}

      {/* ── Sysadmin boundary — provides SysadminAuthContext ───────────── */}
      {/* Both /admin/login AND the dashboard live here so both             */}
      {/* can consume useSysadmin()                                         */}
      <Route element={<SysadminAuthLayout />}>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route element={<Layout />}>
          {AdminRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Route>
      </Route>

      {/* ── Private user routes — no sysadmin context ──────────────────── */}
      {/* UserAuthLayout will wrap this later when you build regular auth   */}
      <Route element={<Layout />}>
        {privateRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Route>

      <Route path="*" element={<Notfound />} />

    </Routes>
  )
}
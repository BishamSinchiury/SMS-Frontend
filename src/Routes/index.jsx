// routes/index.jsx
import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/Layout/Layout.jsx'

// Feature route arrays
import websiterouts from './website/websiteRoutes'
import Notfound from '@/components/NotFound/NotFound.jsx'
import authrouts from './webapp/public/auth/authroutes'


export default function AppRouter() {
  return (
    <Routes>
       {/* ── Website routes — NO layout ─────────────────────────────────── */}
      {websiteRoutes.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ))}

      {/* ── Auth routes — NO layout (login, register etc) ──────────────── */}
      {authRoutes.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ))}
      <Route path="*" element={<Notfound />} />
      
    </Routes>
  )
}
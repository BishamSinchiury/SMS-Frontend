// src/Routes/webapp/adminroutes/SysadminAuthLayout.jsx
import { SysadminAuthProvider } from '@/context/SysadminAuthContext'
import { Outlet } from 'react-router-dom'

export function SysadminAuthLayout() {
  return (
    <SysadminAuthProvider>
      <Outlet />
    </SysadminAuthProvider>
  )
}
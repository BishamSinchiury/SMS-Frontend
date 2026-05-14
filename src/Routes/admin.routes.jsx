import AdminLogin     from '@/pages/admin/auth/AdminLogin.jsx'
import AdminDashboard from '@/pages/admin/dashboard/AdminDashboard.jsx'

// Admin auth routes — no layout wrapper
export const adminAuthRoutes = [
  { path: '/admin/login', element: <AdminLogin /> },
]

// Admin dashboard routes — these will be wrapped with AdminLayout in AppRouter
export const adminDashboardRoutes = [
  { path: '/admin/dashboard', element: <AdminDashboard /> },
]
import Login         from '@/pages/user/auth/Login.jsx'
import Register      from '@/pages/user/auth/Register.jsx'
import UserDashboard from '@/pages/user/dashboard/UserDashboard.jsx'

// Auth routes — no layout wrapper
// User sees just the login/register page, no sidebar/header
export const userAuthRoutes = [
  { path: '/login',    element: <Login />    },
  { path: '/register', element: <Register /> },
]

// Dashboard routes — these will be wrapped with UserLayout in AppRouter
export const userDashboardRoutes = [
  { path: '/dashboard', element: <UserDashboard /> },
]
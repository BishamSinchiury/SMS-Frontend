
import Landing from '../../pages/Website/Landing/Landing.jsx'
import AdminLogin from '@/pages/Website/auth/adminlogin/AdminLogin.jsx'

const websiterouts = [
  { path: '', element: <Landing /> },
  { path: '/admin/login', element: <AdminLogin /> },
]
export default websiterouts
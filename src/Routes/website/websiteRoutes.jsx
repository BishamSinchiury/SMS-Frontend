
import ServerDown from '@/pages/Website/ServerDown/ServerDown.jsx'
import Landing from '../../pages/Website/Landing/Landing.jsx'
const websiterouts = [
  { path: '', element: <Landing /> },
  { path: '/server-down', element: <ServerDown /> },
]
export default websiterouts
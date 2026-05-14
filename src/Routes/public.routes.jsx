import Landing    from '@/pages/public/Landing/Landing.jsx'
import ServerDown from '@/pages/public/ServerDown/ServerDown.jsx'

// No layout, no context, no guards
// Anyone can visit these pages
const publicRoutes = [
  { path: '/',            element: <Landing />    },
  { path: '/server-down', element: <ServerDown /> },
]

export default publicRoutes
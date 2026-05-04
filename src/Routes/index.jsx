// routes/index.jsx
import { Routes, Route } from 'react-router-dom'

// Feature route arrays
import websiterouts from './website/websiteRoutes'
import Notfound from './Notfound'


// Combine all into one array
const allRoutes = [
  ...websiterouts,
]

export default function AppRouter() {
  return (
    <Routes>
      {allRoutes.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ))}

      {/* Always last — catches unmatched URLs */}
      <Route path="*" element={<Notfound />} />
    </Routes>
  )
}
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import AppRouter from './Routes'

const App = () => {
  return (
    <React.StrictMode>
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  </React.StrictMode>
  )
}

export default App
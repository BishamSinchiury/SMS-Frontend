import { createContext, useContext, useEffect, useState } from 'react'
import { isSessionValid } from '@/api/sessionHandler'

const SysadminAuthContext = createContext(null)

export function SysadminAuthProvider({ children }) {
  const [sysadmin, setSysadmin] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log("this ran")
    isSessionValid()
      .then(user => {
        console.log("user", user)
        if (user?.is_sysadmin) setSysadmin(user)
      })
      .finally(() => setLoading(false))
  }, [])
  return (
    <SysadminAuthContext.Provider value={{ sysadmin, setSysadmin, loading }}>
      {children}
    </SysadminAuthContext.Provider>
  )
}

export function useSysadmin() {
  const ctx = useContext(SysadminAuthContext)
  if (!ctx) throw new Error('useSysadmin must be used inside SysadminAuthProvider')
  return ctx
}
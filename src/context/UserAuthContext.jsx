import { createContext, useContext, useEffect, useState } from 'react'
import { isSessionValid } from '@/api/sessionHandler'

const UserAuthContext = createContext(null)

export function UserAuthProvider({ children }) {
  const [user, setUser]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    isSessionValid()
      .then(data => {
        // only accept regular users, not sysadmins
        if (data && !data.is_sysadmin) setUser(data)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <UserAuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserAuthContext.Provider>
  )
}

export function useUser() {
  const ctx = useContext(UserAuthContext)
  if (!ctx) throw new Error('useUser must be used inside UserAuthProvider')
  return ctx
}
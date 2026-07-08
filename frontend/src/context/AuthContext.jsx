import { createContext, useState, useContext, useEffect } from 'react'
import { authService } from '../services/auth'
import { storage } from '../utils/storage'

const AuthContext = createContext(null)

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      const token = await storage.getItem('token')
      if (token) {
        try {
          const user = await authService.getUser()
          setUser(user)
        } catch {
          await storage.removeItem('token')
        }
      }
      setLoading(false)
    })()
  }, [])

  const login = async (username, pin) => {
    try {
      const { token } = await authService.login(username, pin)
      await storage.setItem('token', token)
      const user = await authService.getUser()
      setUser(user)
      return user
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    await storage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

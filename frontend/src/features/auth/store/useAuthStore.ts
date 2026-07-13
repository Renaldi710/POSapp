import { create } from 'zustand'
import { getToken, removeToken } from '../../../lib/storage'
import type { User } from '../../../api/types'

interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  isHydrated: boolean
  setToken: (token: string) => void
  setUser: (user: User) => void
  logout: () => Promise<void>
  hydrate: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  isHydrated: false,
  setToken: (token) => set({ token, isAuthenticated: true }),
  setUser: (user) => set({ user }),
  logout: async () => {
    await removeToken()
    set({ token: null, user: null, isAuthenticated: false })
  },
  hydrate: async () => {
    const token = await getToken()
    set({ token, isAuthenticated: !!token, isHydrated: true })
  },
}))

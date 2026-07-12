import { create } from 'zustand'
import { getToken } from '../../../lib/storage'
import type { User } from '../../../api/types'

interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  isHydrated: boolean
  setToken: (token: string) => void
  setUser: (user: User) => void
  logout: () => void
  hydrate: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  isHydrated: false,
  setToken: (token) => set({ token, isAuthenticated: true }),
  setUser: (user) => set({ user }),
  logout: () => set({ token: null, user: null, isAuthenticated: false }),
  hydrate: async () => {
    const token = await getToken()
    set({ token, isAuthenticated: !!token, isHydrated: true })
  },
}))

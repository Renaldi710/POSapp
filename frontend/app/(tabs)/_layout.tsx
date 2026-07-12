import { Redirect, Tabs } from 'expo-router'
import { useAuthStore } from '../../src/features/auth/store/useAuthStore'

export default function TabLayout() {
  const { isAuthenticated, isHydrated } = useAuthStore()

  if (!isHydrated) return null
  if (!isAuthenticated) return <Redirect href="/(auth)/login" />

  return <Tabs />
}

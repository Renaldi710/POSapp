import { Redirect } from 'expo-router'
import { useAuthStore } from '../src/features/auth/store/useAuthStore'

export default function Index() {
  const { isAuthenticated, user, isHydrated } = useAuthStore()

  if (!isHydrated) return null
  if (!isAuthenticated) return <Redirect href="/(auth)/login" />
  if (user?.role === 'admin') return <Redirect href="/(tabs)/dashboard" />
  return <Redirect href="/(tabs)" />
}

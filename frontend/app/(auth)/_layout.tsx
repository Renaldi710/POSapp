import { Redirect, Stack } from 'expo-router'
import { useAuthStore } from '../../src/features/auth/store/useAuthStore'

export default function AuthLayout() {
  const { isAuthenticated, isHydrated } = useAuthStore()

  if (!isHydrated) return null
  if (isAuthenticated) return <Redirect href="/(tabs)" />

  return <Stack screenOptions={{ headerShown: false }} />
}

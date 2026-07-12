import { Redirect, Stack } from 'expo-router'
import { useAuthStore } from '../../src/features/auth/store/useAuthStore'

export default function AuthLayout() {
  const isHydrated = useAuthStore((s) => s.isHydrated)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  if (!isHydrated) return null
  if (isAuthenticated) return <Redirect href="/(tabs)" />

  return <Stack screenOptions={{ headerShown: false }} />
}

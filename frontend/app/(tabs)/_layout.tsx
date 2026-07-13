import { Redirect, Stack } from 'expo-router'
import { View, useWindowDimensions } from 'react-native'
import { useAuthStore } from '../../src/features/auth/store/useAuthStore'
import Sidebar from '../../src/components/layout/Sidebar'
import SidebarOverlay from '../../src/components/layout/SidebarOverlay'

export default function TabLayout() {
  const { width } = useWindowDimensions()
  const isTablet = width >= 768
  const isHydrated = useAuthStore((s) => s.isHydrated)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  if (!isHydrated) return null
  if (!isAuthenticated) return <Redirect href="/(auth)/login" />

  return (
    <View className="flex-1 flex-row bg-bg-page">
      {isTablet && <Sidebar />}
      <View className="flex-1">
        <Stack screenOptions={{ headerShown: false }} />
      </View>
      {!isTablet && <SidebarOverlay />}
    </View>
  )
}

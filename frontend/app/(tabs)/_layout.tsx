import { Redirect, Stack } from 'expo-router'
import { View, useWindowDimensions, StatusBar } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
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
    <View className="flex-1 bg-bg-page">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <SafeAreaView edges={['top']} className="flex-1 flex-row">
        {isTablet && <Sidebar />}
        <View className="flex-1">
          <Stack screenOptions={{ headerShown: false }} />
        </View>
      </SafeAreaView>
      {!isTablet && <SidebarOverlay />}
    </View>
  )
}

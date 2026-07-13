import '../global.css'
import { useEffect } from 'react'
import { Stack } from 'expo-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '../src/lib/queryClient'
import { useAuthStore } from '../src/features/auth/store/useAuthStore'
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter'
import { View, ActivityIndicator } from 'react-native'

export default function RootLayout() {
  const isHydrated = useAuthStore((s) => s.isHydrated)

  const [fontsLoaded] = useFonts({ Inter_400Regular, Inter_600SemiBold, Inter_700Bold })

  useEffect(() => { useAuthStore.getState().hydrate() }, [])

  if (!fontsLoaded || !isHydrated) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#004AC6" />
      </View>
    )
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }} />
    </QueryClientProvider>
  )
}

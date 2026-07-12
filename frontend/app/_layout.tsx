import '../global.css'
import { useEffect } from 'react'
import { Stack } from 'expo-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '../src/lib/queryClient'
import { useAuthStore } from '../src/features/auth/store/useAuthStore'

export default function RootLayout() {
  const isHydrated = useAuthStore((s) => s.isHydrated)

  useEffect(() => { useAuthStore.getState().hydrate() }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <Stack />
    </QueryClientProvider>
  )
}

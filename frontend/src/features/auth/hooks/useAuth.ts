import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import client from '../../../api/client'
import { ENDPOINTS } from '../../../api/endpoints'
import { setToken } from '../../../lib/storage'
import { useAuthStore } from '../store/useAuthStore'
import { captureLocation } from '../../../lib/location'
import type { LoginPayload, LoginResponse } from '../../../api/types'
import type { AxiosError } from 'axios'

export function useLogin() {
  const router = useRouter()
  const { setUser } = useAuthStore()

  return useMutation<LoginResponse, AxiosError<{ message: string }>, LoginPayload>({
    mutationFn: (payload) =>
      client.post<LoginResponse>(ENDPOINTS.AUTH.LOGIN, payload).then((r) => r.data),
    onSuccess: async (data) => {
      await setToken(data.token)
      const userRes = await client.get('/api/user')
      setUser(userRes.data)
      captureLocation()
      if (userRes.data.role === 'admin') {
        router.replace('/(tabs)/dashboard')
      } else {
        router.replace('/(tabs)')
      }
    },
  })
}

import { Alert } from 'react-native'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import client from '../../../api/client'
import { ENDPOINTS } from '../../../api/endpoints'
import { setToken as persistToken } from '../../../lib/storage'
import { useAuthStore } from '../store/useAuthStore'
import type { LoginPayload, LoginResponse } from '../../../api/types'
import type { AxiosError } from 'axios'

export function useLogin() {
  const router = useRouter()

  return useMutation<LoginResponse, AxiosError<{ message: string }>, LoginPayload>({
    mutationFn: (payload) =>
      client.post<LoginResponse>(ENDPOINTS.AUTH.LOGIN, payload).then((r) => r.data),
    onSuccess: async (data) => {
      await persistToken(data.token)
      const userRes = await client.get('/api/user')
      useAuthStore.getState().setToken(data.token)
      useAuthStore.getState().setUser(userRes.data)
      if (userRes.data.role === 'admin') {
        router.replace('/(tabs)/dashboard')
      } else {
        router.replace('/(tabs)')
      }
    },
    onError: (err) => {
      const msg =
        (err.response?.data as { detail?: string })?.detail ||
        (err.response?.data as { message?: string })?.message ||
        'Gagal terhubung ke server. Periksa koneksi internet.'
      Alert.alert('Login Gagal', msg)
    },
  })
}

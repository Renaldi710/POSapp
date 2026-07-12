import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import client from '../../../api/client'
import { ENDPOINTS } from '../../../api/endpoints'
import type { Product } from '../../../api/types'

function getMutationError(err: unknown): string | null {
  if (!isAxiosError(err)) return null
  if (err.response?.data && typeof err.response.data === 'object' && 'detail' in (err.response.data as Record<string, unknown>)) {
    return (err.response.data as { detail: string }).detail
  }
  return 'Terjadi kesalahan'
}

export function useCreateProduct() {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: (data: { category_id: number; name: string; price: number; stock?: number }) =>
      client.post<Product>(ENDPOINTS.PRODUCTS.CREATE, data).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
  return { ...mutation, mutationError: getMutationError(mutation.error) }
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<{ category_id: number; name: string; price: number; stock: number }> }) =>
      client.put<Product>(ENDPOINTS.PRODUCTS.UPDATE(id), data).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['product'] })
    },
  })
  return { ...mutation, mutationError: getMutationError(mutation.error) }
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: (id: number) => client.delete(ENDPOINTS.PRODUCTS.DELETE(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
  return { ...mutation, mutationError: getMutationError(mutation.error) }
}

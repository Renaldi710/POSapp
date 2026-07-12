import { useMutation, useQueryClient } from '@tanstack/react-query'
import client from '../../../api/client'
import { ENDPOINTS } from '../../../api/endpoints'
import type { Product } from '../../../api/types'

export function useStockMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ productId, stock }: { productId: number; stock: number }) =>
      client.put<Product>(ENDPOINTS.PRODUCTS.UPDATE(productId), { stock }).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['product'] })
    },
  })
}

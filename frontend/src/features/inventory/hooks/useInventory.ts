import { useQuery } from '@tanstack/react-query'
import client from '../../../api/client'
import { ENDPOINTS } from '../../../api/endpoints'
import type { Product } from '../../../api/types'

export function useInventory(search?: string) {
  return useQuery({
    queryKey: ['products', 'inventory', search],
    queryFn: () =>
      client.get<Product[]>(ENDPOINTS.PRODUCTS.LIST, { params: search ? { q: search } : {} }).then((r) => r.data),
  })
}

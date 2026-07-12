import { useQuery } from '@tanstack/react-query'
import client from '../../../api/client'
import { ENDPOINTS } from '../../../api/endpoints'
import type { Product } from '../../../api/types'

export function useProducts(search?: string) {
  return useQuery({
    queryKey: ['products', search],
    queryFn: () =>
      client.get<Product[]>(ENDPOINTS.PRODUCTS.LIST, { params: search ? { search } : {} }).then((r) => r.data),
  })
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => client.get<Product>(ENDPOINTS.PRODUCTS.DETAIL(id)).then((r) => r.data),
  })
}

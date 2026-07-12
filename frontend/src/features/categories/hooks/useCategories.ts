import { useQuery } from '@tanstack/react-query'
import client from '../../../api/client'
import { ENDPOINTS } from '../../../api/endpoints'
import type { Category } from '../../../api/types'

// ponytail: backend tidak punya endpoint /api/categories — fallback ke 4 kategori default
const FALLBACK_CATEGORIES: Category[] = [
  { id: 1, name: 'Makanan', products_count: 0 },
  { id: 2, name: 'Minuman', products_count: 0 },
  { id: 3, name: 'Snack', products_count: 0 },
  { id: 4, name: 'Lainnya', products_count: 0 },
]

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () =>
      client
        .get<Category[]>(ENDPOINTS.CATEGORIES.LIST)
        .then((r) => r.data)
        .catch(() => FALLBACK_CATEGORIES),
    staleTime: 5 * 60 * 1000,
  })
}

// ponytail: POST /api/categories belum ada di backend — skip dulu, deploy backend dulu baru aktifkan

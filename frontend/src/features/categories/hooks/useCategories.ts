import { useQuery } from '@tanstack/react-query'
import client from '../../../api/client'
import { ENDPOINTS } from '../../../api/endpoints'
import type { Category } from '../../../api/types'

// ponytail: fallback sampai backend /api/categories dideploy
const FALLBACK_CATEGORIES: Category[] = [
  { id: 1, name: 'Makanan', created_at: '', updated_at: '' },
  { id: 2, name: 'Minuman', created_at: '', updated_at: '' },
  { id: 3, name: 'Snack', created_at: '', updated_at: '' },
  { id: 4, name: 'Lainnya', created_at: '', updated_at: '' },
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

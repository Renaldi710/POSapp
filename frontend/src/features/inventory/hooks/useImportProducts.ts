import { useMutation, useQueryClient } from '@tanstack/react-query'
import client from '../../../api/client'

interface ImportResult {
  created: number
  skipped: number
  errors: string[]
}

export function useImportProducts() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (fileUri: string): Promise<ImportResult> => {
      const formData = new FormData()
      formData.append('file', {
        uri: fileUri,
        name: 'import.csv',
        type: 'text/csv',
      } as any)

      const res = await client.post<ImportResult>('/api/products/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

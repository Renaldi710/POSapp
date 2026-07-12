import { useCallback } from 'react'
import { Stack, router } from 'expo-router'
import { useCreateProduct } from '../../src/features/inventory/hooks/useProductMutation'
import ProductForm from '../../src/features/inventory/components/ProductForm'

export default function CreateProductScreen() {
  const createMutation = useCreateProduct()

  const handleSubmit = useCallback(
    (data: { category_id: number; name: string; price: number; stock?: number }) => {
      createMutation.mutate(data, { onSuccess: () => router.back() })
    },
    [createMutation],
  )

  return (
    <>
      <Stack.Screen options={{ title: 'Tambah Produk' }} />
      <ProductForm
        onSubmit={handleSubmit}
        loading={createMutation.isPending}
        error={createMutation.mutationError}
      />
    </>
  )
}

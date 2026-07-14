import { useEffect, useCallback } from 'react'
import { View, Text } from 'react-native'
import { router } from 'expo-router'
import { useAuthStore } from '../../src/features/auth/store/useAuthStore'
import { useCreateProduct } from '../../src/features/inventory/hooks/useProductMutation'
import ProductForm from '../../src/features/inventory/components/ProductForm'
import ScreenLayout from '../../src/components/layout/ScreenLayout'

export default function CreateProductScreen() {
  const user = useAuthStore((s) => s.user)
  const createMutation = useCreateProduct()

  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.replace('/(tabs)')
    }
  }, [user])

  const handleSubmit = useCallback(
    (data: { category_id: number; name: string; price: number; stock?: number }) => {
      createMutation.mutate(data, { onSuccess: () => router.back() })
    },
    [createMutation],
  )

  if (!user || user.role !== 'admin') return null

  return (
    <ScreenLayout title="Tambah Produk">
      <ProductForm
        onSubmit={handleSubmit}
        loading={createMutation.isPending}
        error={createMutation.mutationError}
      />
    </ScreenLayout>
  )
}

import { useEffect, useCallback } from 'react'
import { View, Text } from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { useAuthStore } from '../../../src/features/auth/store/useAuthStore'
import { useProduct } from '../../../src/features/products/hooks/useProducts'
import { useUpdateProduct } from '../../../src/features/inventory/hooks/useProductMutation'
import ProductForm from '../../../src/features/inventory/components/ProductForm'
import ScreenLayout from '../../../src/components/layout/ScreenLayout'

export default function EditProductScreen() {
  const user = useAuthStore((s) => s.user)
  const { id } = useLocalSearchParams<{ id: string }>()
  const productId = Number(id)
  const { data: product, isLoading } = useProduct(productId)
  const updateMutation = useUpdateProduct()

  const handleSubmit = useCallback(
    (data: { category_id: number; name: string; price: number; stock?: number }) => {
      updateMutation.mutate({ id: productId, data }, { onSuccess: () => router.back() })
    },
    [productId, updateMutation],
  )

  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.replace('/(tabs)')
    }
  }, [user])

  if (!user || user.role !== 'admin') return null

  if (isLoading) {
    return (
      <ScreenLayout title="Edit Produk">
        <View className="flex-1 items-center justify-center">
          <Text className="text-text-light">Memuat...</Text>
        </View>
      </ScreenLayout>
    )
  }

  if (!product) {
    return (
      <ScreenLayout title="Edit Produk">
        <View className="flex-1 items-center justify-center">
          <Text className="text-text-light">Produk tidak ditemukan</Text>
        </View>
      </ScreenLayout>
    )
  }

  return (
    <ScreenLayout title="Edit Produk">
      <ProductForm
        initial={product}
        onSubmit={handleSubmit}
        loading={updateMutation.isPending}
        error={updateMutation.mutationError}
      />
    </ScreenLayout>
  )
}

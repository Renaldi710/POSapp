import { useCallback } from 'react'
import { View, Text } from 'react-native'
import { Stack, useLocalSearchParams, router } from 'expo-router'
import { useProduct } from '../../../src/features/products/hooks/useProducts'
import { useUpdateProduct } from '../../../src/features/inventory/hooks/useProductMutation'
import ProductForm from '../../../src/features/inventory/components/ProductForm'

export default function EditProductScreen() {
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

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-400">Memuat...</Text>
      </View>
    )
  }

  if (!product) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-400">Produk tidak ditemukan</Text>
      </View>
    )
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Edit Produk' }} />
      <ProductForm
        initial={product}
        onSubmit={handleSubmit}
        loading={updateMutation.isPending}
        error={updateMutation.mutationError}
      />
    </>
  )
}

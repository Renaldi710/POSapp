import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native'
import { useLocalSearchParams, Stack, router } from 'expo-router'
import { useProduct } from '../../src/features/products/hooks/useProducts'
import { useStockMutation } from '../../src/features/inventory/hooks/useStockMutation'
import { useDeleteProduct } from '../../src/features/inventory/hooks/useProductMutation'
import Badge from '../../src/components/ui/Badge'
import Button from '../../src/components/ui/Button'
import { formatRupiah } from '../../src/utils/currency'

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const productId = Number(id)
  const { data: product, isLoading } = useProduct(productId)
  const stockMutation = useStockMutation()
  const deleteMutation = useDeleteProduct()
  const [restockAmount, setRestockAmount] = useState('')

  const handleDelete = () => {
    Alert.alert('Hapus Produk', `Yakin ingin menghapus "${product?.name}"?`, [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: () => deleteMutation.mutate(productId, { onSuccess: () => router.back() }),
      },
    ])
  }

  if (isLoading || !product) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-400">Memuat...</Text>
      </View>
    )
  }

  const stockVariant = product.stock === 0 ? 'danger' as const : product.stock < 10 ? 'warning' as const : 'success' as const

  const handleRestock = () => {
    const amount = Number(restockAmount)
    if (!amount || amount <= 0) return
    stockMutation.mutate({ productId, stock: product.stock + amount }, { onSuccess: () => setRestockAmount('') })
  }

  return (
    <ScrollView className="flex-1 bg-white">
      <Stack.Screen options={{ title: product.name }} />
      <View className="p-6">
        <Text className="text-2xl font-bold text-gray-900 mb-1">{product.name}</Text>
        {product.sku && <Text className="text-sm text-gray-500 mb-4">SKU: {product.sku}</Text>}

        <View className="bg-gray-50 rounded-xl p-4 mb-6">
          <View className="flex-row justify-between mb-3">
            <Text className="text-gray-600">Kategori</Text>
            <Text className="text-gray-900 font-medium">{product.category?.name || '-'}</Text>
          </View>
          <View className="flex-row justify-between mb-3">
            <Text className="text-gray-600">Harga</Text>
            <Text className="text-gray-900 font-medium">{formatRupiah(product.price)}</Text>
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="text-gray-600">Stok Saat Ini</Text>
            <Badge label={String(product.stock)} variant={stockVariant} />
          </View>
        </View>

        <Text className="text-base font-semibold text-gray-900 mb-3">Tambah Stok</Text>
        <View className="flex-row items-center gap-3 mb-6">
          <View className="flex-1">
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 text-base"
              placeholder="Jumlah tambahan"
              keyboardType="numeric"
              value={restockAmount}
              onChangeText={setRestockAmount}
            />
          </View>
          <Button
            title="Tambah"
            onPress={handleRestock}
            loading={stockMutation.isPending}
            disabled={!restockAmount || Number(restockAmount) <= 0}
          />
        </View>

        {restockAmount && Number(restockAmount) > 0 && (
          <View className="bg-blue-50 rounded-lg p-3">
            <Text className="text-blue-800 text-sm">
              Setelah restock: <Text className="font-bold">{product.stock + Number(restockAmount)}</Text> unit
            </Text>
          </View>
        )}

        <View className="flex-row gap-3 pt-4 border-t border-gray-200">
          <View className="flex-1">
            <Button title="Edit" onPress={() => router.push(`/product/edit/${product.id}`)} variant="primary" />
          </View>
          <View className="flex-1">
            <Button title="Hapus" onPress={handleDelete} variant="danger" loading={deleteMutation.isPending} />
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

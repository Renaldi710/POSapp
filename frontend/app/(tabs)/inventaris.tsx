import { useState, useCallback } from 'react'
import { View, TextInput, TouchableOpacity, Text } from 'react-native'
import { router } from 'expo-router'
import { useInventory } from '../../src/features/inventory/hooks/useInventory'
import DataTable from '../../src/components/ui/DataTable'
import Badge from '../../src/components/ui/Badge'
import { formatRupiah } from '../../src/utils/currency'
import type { Product } from '../../src/api/types'
import type { Column } from '../../src/components/ui/DataTable'

export default function InventarisScreen() {
  const [search, setSearch] = useState('')
  const { data: products, isLoading } = useInventory(search)

  const stockVariant = (stock: number) => {
    if (stock === 0) return 'danger' as const
    if (stock < 10) return 'warning' as const
    return 'success' as const
  }

  const handleRowPress = useCallback((item: Product) => {
    router.push(`/product/${item.id}`)
  }, [])

  const columns: Column<Product>[] = [
    { key: 'name', label: 'Nama', flex: 2 },
    { key: 'sku', label: 'SKU', flex: 1.2 },
    { key: 'category', label: 'Kategori', flex: 1.2, render: (item) => <Text className="text-sm text-gray-600">{item.category?.name || '-'}</Text> },
    { key: 'price', label: 'Harga', flex: 1, render: (item) => <Text className="text-sm text-gray-900">{formatRupiah(item.price)}</Text> },
    { key: 'stock', label: 'Stok', flex: 0.8, render: (item) => <Badge label={String(item.stock)} variant={stockVariant(item.stock)} /> },
  ]

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center px-4 pt-4 pb-2 gap-2">
        <TextInput
          className="flex-1 bg-gray-100 border border-gray-200 rounded-lg px-4 py-2.5 text-base"
          placeholder="Cari produk..."
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity className="bg-blue-600 px-4 py-2.5 rounded-lg" onPress={() => router.push('/product/create')}>
          <Text className="text-white font-medium text-sm">+</Text>
        </TouchableOpacity>
      </View>
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-400">Memuat...</Text>
        </View>
      ) : (
        <DataTable columns={columns} data={products || []} keyExtractor={(item) => String(item.id)} onRowPress={handleRowPress} />
      )}
    </View>
  )
}

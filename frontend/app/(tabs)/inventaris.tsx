import { useState, useCallback } from 'react'
import { View, TextInput, TouchableOpacity, Text, ScrollView, Alert } from 'react-native'
import { Search, Plus, Upload, Package, AlertTriangle, XCircle, TrendingUp } from 'lucide-react-native'
import { router, useLocalSearchParams } from 'expo-router'
import * as DocumentPicker from 'expo-document-picker'
import { useAuthStore } from '../../src/features/auth/store/useAuthStore'
import { useInventory } from '../../src/features/inventory/hooks/useInventory'
import { useImportProducts } from '../../src/features/inventory/hooks/useImportProducts'
import DataTable from '../../src/components/ui/DataTable'
import Badge from '../../src/components/ui/Badge'
import StatCard from '../../src/components/ui/StatCard'
import ProgressBar from '../../src/components/layout/ProgressBar'
import { formatRupiah } from '../../src/utils/currency'
import type { Product } from '../../src/api/types'
import type { Column } from '../../src/components/ui/DataTable'
import ScreenLayout from '../../src/components/layout/ScreenLayout'

export default function InventarisScreen() {
  const user = useAuthStore((s) => s.user)
  const isAdmin = user?.role === 'admin'
  const [search, setSearch] = useState('')
  const [filterKategori, setFilterKategori] = useState('')
  const { data: products, isLoading } = useInventory(search)
  const { highlight } = useLocalSearchParams<{ highlight?: string }>()
  const importMutation = useImportProducts()

  const handleImportCSV = useCallback(async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: 'text/csv' })
    if (result.canceled || !result.assets[0]) return
    importMutation.mutate(result.assets[0].uri, {
      onSuccess: (data) => {
        Alert.alert('Import Selesai', `Berhasil: ${data.created}\nSkipped: ${data.skipped}${data.errors.length ? `\nError:\n${data.errors.slice(0, 3).join('\n')}` : ''}`)
      },
      onError: () => Alert.alert('Gagal', 'Gagal mengimpor file'),
    })
  }, [importMutation])

  const stockColor = (stock: number) => {
    if (stock === 0) return '#EF4444'
    if (stock < 10) return '#F59E0B'
    return '#22C55E'
  }

  const stockVariant = (stock: number) => {
    if (stock === 0) return 'danger' as const
    if (stock < 10) return 'warning' as const
    return 'success' as const
  }

  const maxStock = Math.max(...(products?.map((p) => p.stock) || [1]), 1)

  const handleRowPress = useCallback((item: Product) => {
    router.push(`/product/${item.id}`)
  }, [])

  const columns: Column<Product>[] = [
    { key: 'sku', label: 'SKU', flex: 1, render: (item) => <Text className="text-xs text-text-light">{item.sku || '-'}</Text> },
    { key: 'name', label: 'Nama Barang', flex: 1.5 },
    { key: 'category', label: 'Kategori', flex: 1, render: (item) => <Text className="text-sm text-text-medium">{item.category?.name || '-'}</Text> },
    {
      key: 'stock', label: 'Level Stok', flex: 1.5,
      render: (item) => (
        <View className="flex-row items-center gap-2">
          <View className="flex-1">
            <ProgressBar value={item.stock} max={maxStock} color={stockColor(item.stock)} />
          </View>
          <Badge label={String(item.stock)} variant={stockVariant(item.stock)} />
        </View>
      ),
    },
    { key: 'buy_price', label: 'Harga Beli', flex: 1, render: (item) => <Text className="text-sm text-text-dark">{(item as any).buy_price ? formatRupiah((item as any).buy_price) : '-'}</Text> },
    { key: 'price', label: 'Harga Jual', flex: 1, render: (item) => <Text className="text-sm text-text-dark">{formatRupiah(item.price)}</Text> },
    ...(isAdmin ? [{
      key: 'actions' as const, label: 'Aksi', flex: 0.8,
      render: (item: Product) => (
        <TouchableOpacity onPress={() => router.push(`/product/${item.id}`)}>
          <Text className="text-primary text-sm font-medium">Edit</Text>
        </TouchableOpacity>
      ),
    }] : []),
  ]

  const totalSKU = products?.length || 0
  const stockHabis = products?.filter((p) => p.stock === 0).length || 0
  const stockMenipis = products?.filter((p) => p.stock > 0 && p.stock < 10).length || 0
  const barangTerjual = products?.reduce((s, p) => s + (p as any).sold_count || 0, 0) || 0

  return (
    <ScreenLayout title="Inventaris">
      <View className="px-4 pt-4">
        <View className="flex-row items-center gap-2 mb-4">
          <View className="flex-1 flex-row items-center bg-bg-search rounded-full px-4">
            <Search size={18} color="#737686" />
            <TextInput
              className="flex-1 ml-2 py-2.5 text-base text-text-dark"
              placeholder="Cari produk..."
              placeholderTextColor="#737686"
              value={search}
              onChangeText={setSearch}
            />
          </View>
          {isAdmin && (
            <>
              <TouchableOpacity className="bg-primary px-4 py-2.5 rounded-xl" onPress={() => router.push('/product/create')}>
                <Text className="text-white font-medium text-sm">+ Tambah Baru</Text>
              </TouchableOpacity>
              <TouchableOpacity className="border border-border px-4 py-2.5 rounded-xl flex-row items-center gap-1.5" onPress={handleImportCSV} disabled={importMutation.isPending}>
                <Upload size={16} color="#434655" />
                <Text className="text-text-medium font-medium text-sm">{importMutation.isPending ? 'Mengimpor...' : 'Import CSV'}</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <View className="flex-row gap-3 mb-4">
          <StatCard label="Total SKU" value={String(totalSKU)} icon={<Package size={18} color="#2563EB" />} />
          <StatCard label="Stok Habis" value={String(stockHabis)} icon={<XCircle size={18} color="#EF4444" />} />
        </View>
        <View className="flex-row gap-3 mb-4">
          <StatCard label="Stok Menipis" value={String(stockMenipis)} icon={<AlertTriangle size={18} color="#F59E0B" />} />
          <StatCard label="Barang Terjual" value={String(barangTerjual)} icon={<TrendingUp size={18} color="#22C55E" />} />
        </View>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-text-light">Memuat...</Text>
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ minWidth: 600 }}>
            <DataTable columns={columns} data={products || []} keyExtractor={(item) => String(item.id)} onRowPress={handleRowPress} highlightedKey={highlight} />
          </View>
        </ScrollView>
      )}
    </ScreenLayout>
  )
}

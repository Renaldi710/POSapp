import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native'
import { useLocalSearchParams, Stack, router } from 'expo-router'
import { ArrowLeft, Package } from 'lucide-react-native'
import { useProduct } from '../../src/features/products/hooks/useProducts'
import { useStockMutation } from '../../src/features/inventory/hooks/useStockMutation'
import { useDeleteProduct } from '../../src/features/inventory/hooks/useProductMutation'
import Badge from '../../src/components/ui/Badge'
import Button from '../../src/components/ui/Button'
import ProgressBar from '../../src/components/layout/ProgressBar'
import ScreenLayout from '../../src/components/layout/ScreenLayout'
import { formatRupiah } from '../../src/utils/currency'

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const productId = Number(id)
  const { data: product, isLoading } = useProduct(productId)
  const stockMutation = useStockMutation()
  const deleteMutation = useDeleteProduct()

  const [stockAmount, setStockAmount] = useState('')
  const [mutationType, setMutationType] = useState<'add' | 'sub'>('add')
  const [reason, setReason] = useState('')

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
      <View className="flex-1 items-center justify-center bg-bg-page">
        <Text className="text-text-light">Memuat...</Text>
      </View>
    )
  }

  const stockVariant = product.stock === 0 ? 'danger' as const : product.stock < 10 ? 'warning' as const : 'success' as const

  const handleMutation = () => {
    const amount = Number(stockAmount)
    if (!amount || amount <= 0) return
    const newStock = mutationType === 'add' ? product.stock + amount : Math.max(product.stock - amount, 0)
    stockMutation.mutate({ productId, stock: newStock }, { onSuccess: () => setStockAmount('') })
  }

  const REASONS = ['Pembelian', 'Retur', 'Rusak', 'Opname', 'Koreksi']

  return (
    <ScreenLayout title={product.name}>
      <ScrollView className="flex-1 px-4 pt-4">
        <View className="flex-row items-center gap-3 mb-4">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={22} color="#434655" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-lg font-bold text-text-dark">{product.name}</Text>
            {product.sku && <Text className="text-xs text-text-light">SKU: {product.sku}</Text>}
          </View>
          <TouchableOpacity className="border border-border px-4 py-2 rounded-xl" onPress={() => router.push(`/product/edit/${product.id}`)}>
            <Text className="text-text-dark text-sm font-medium">Edit</Text>
          </TouchableOpacity>
        </View>

        <View className="bg-white rounded-xl border border-border p-4 mb-4">
          <Text className="text-sm font-semibold text-text-dark mb-3">Item Information</Text>
          <View className="flex-row items-center gap-3 mb-3">
            <View className="w-16 h-16 rounded-xl bg-bg-search items-center justify-center">
              <Package size={28} color="#737686" />
            </View>
            <View className="flex-1">
              <Text className="text-sm text-text-light">Item Name</Text>
              <Text className="text-base font-semibold text-text-dark">{product.name}</Text>
            </View>
          </View>
          <View className="flex-row gap-4">
            <View className="flex-1">
              <Text className="text-xs text-text-light">Kategori</Text>
              <Text className="text-sm font-medium text-text-dark">{product.category?.name || '-'}</Text>
            </View>
            <View className="flex-1">
              <Text className="text-xs text-text-light">SKU / Kode</Text>
              <Text className="text-sm font-medium text-text-dark">{product.sku || '-'}</Text>
            </View>
          </View>
        </View>

        <View className="bg-white rounded-xl border border-border p-4 mb-4">
          <Text className="text-sm font-semibold text-text-dark mb-3">Stock Control</Text>
          <View className="flex-row items-center gap-4 mb-3">
            <View className="flex-1">
              <Text className="text-xs text-text-light">Current Stock</Text>
              <Text className="text-2xl font-bold text-text-dark">{product.stock}</Text>
            </View>
            <View className="flex-1">
              <Badge label={stockVariant === 'success' ? 'Aman' : stockVariant === 'warning' ? 'Menipis' : 'Habis'} variant={stockVariant} />
            </View>
          </View>
          <ProgressBar value={product.stock} max={Math.max(product.stock, 100)} color={stockVariant === 'success' ? '#22C55E' : stockVariant === 'warning' ? '#F59E0B' : '#EF4444'} />
        </View>

        <View className="bg-white rounded-xl border border-border p-4 mb-4">
          <Text className="text-sm font-semibold text-text-dark mb-3">Quick Stock Mutation</Text>
          <View className="flex-row gap-2 mb-3">
            <TouchableOpacity
              className={`flex-1 py-2 rounded-xl items-center ${mutationType === 'add' ? 'bg-primary' : 'bg-white border border-border'}`}
              onPress={() => setMutationType('add')}
            >
              <Text className={`text-sm font-medium ${mutationType === 'add' ? 'text-white' : 'text-text-medium'}`}>Tambah Stok</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-2 rounded-xl items-center ${mutationType === 'sub' ? 'bg-red-500' : 'bg-white border border-border'}`}
              onPress={() => setMutationType('sub')}
            >
              <Text className={`text-sm font-medium ${mutationType === 'sub' ? 'text-white' : 'text-text-medium'}`}>Kurangi Stok</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row gap-3 mb-3">
            <TextInput
              className="flex-1 border border-border rounded-xl px-4 py-3 text-base bg-bg-input text-text-dark"
              placeholder="Jumlah"
              placeholderTextColor="#737686"
              keyboardType="numeric"
              value={stockAmount}
              onChangeText={setStockAmount}
            />
            <TouchableOpacity
              className="bg-primary px-5 py-3 rounded-xl items-center justify-center"
              onPress={handleMutation}
              disabled={!stockAmount || Number(stockAmount) <= 0 || stockMutation.isPending}
            >
              <Text className="text-white font-semibold">Eksekusi Mutasi</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2">
            <View className="flex-row gap-2">
              {REASONS.map((r) => (
                <TouchableOpacity
                  key={r}
                  className={`px-3 py-1.5 rounded-full border ${reason === r ? 'bg-primary border-primary' : 'bg-white border-border'}`}
                  onPress={() => setReason(r)}
                >
                  <Text className={`text-xs font-medium ${reason === r ? 'text-white' : 'text-text-medium'}`}>{r}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
          {stockAmount && Number(stockAmount) > 0 && (
            <Text className="text-xs text-text-light mt-1">
              Setelah mutasi: <Text className="font-semibold text-text-dark">
                {mutationType === 'add' ? product.stock + Number(stockAmount) : Math.max(product.stock - Number(stockAmount), 0)}
              </Text> unit
            </Text>
          )}
        </View>

        <View className="bg-white rounded-xl border border-border p-4 mb-4">
          <Text className="text-sm font-semibold text-text-dark mb-3">Stock Stats</Text>
          <View className="flex-row gap-4">
            <View className="flex-1">
              <Text className="text-xs text-text-light">Last Stock Update</Text>
              <Text className="text-sm font-medium text-text-dark">Hari ini, 10:30</Text>
            </View>
            <View className="flex-1">
              <Text className="text-xs text-text-light">Daily Average</Text>
              <Text className="text-sm font-medium text-text-dark">12 unit/hari</Text>
            </View>
          </View>
        </View>

        <View className="bg-white rounded-xl border border-border p-4 mb-4">
          <Text className="text-sm font-semibold text-text-dark mb-3">Recent Mutations</Text>
          {[
            { date: '13 Jul 2026, 10:30', type: 'add', amount: '+50', reason: 'Pembelian' },
            { date: '12 Jul 2026, 14:15', type: 'sub', amount: '-3', reason: 'Terjual' },
            { date: '11 Jul 2026, 09:00', type: 'add', amount: '+100', reason: 'Pembelian' },
          ].map((m, i) => (
            <View key={i} className="flex-row items-start py-2 border-b border-border last:border-0">
              <View className={`w-2 h-2 rounded-full mt-1.5 mr-3 ${m.type === 'add' ? 'bg-green-500' : 'bg-red-500'}`} />
              <View className="flex-1">
                <View className="flex-row items-center justify-between">
                  <Text className={`text-sm font-medium ${m.type === 'add' ? 'text-green-700' : 'text-red-600'}`}>
                    {m.type === 'add' ? '+' : '-'}{m.amount}
                  </Text>
                  <Text className="text-xs text-text-light">{m.date}</Text>
                </View>
                <Text className="text-xs text-text-light">{m.reason}</Text>
              </View>
            </View>
          ))}
        </View>

        <View className="flex-row gap-3 pb-6">
          <View className="flex-1">
            <Button title="Edit Produk" onPress={() => router.push(`/product/edit/${product.id}`)} variant="outline" />
          </View>
          <View className="flex-1">
            <Button title="Hapus" onPress={handleDelete} variant="danger" loading={deleteMutation.isPending} />
          </View>
        </View>
      </ScrollView>
    </ScreenLayout>
  )
}

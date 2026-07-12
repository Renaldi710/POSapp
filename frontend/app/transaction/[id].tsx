import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import { useLocalSearchParams, Stack, router } from 'expo-router'
import { useTransaction } from '../../src/features/transactions/hooks/useTransactions'
import Badge from '../../src/components/ui/Badge'
import { formatRupiah } from '../../src/utils/currency'
import { formatDate, formatTime } from '../../src/utils/date'
import type { TransactionItem } from '../../src/api/types'

export default function TransactionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { data: t, isLoading } = useTransaction(Number(id))

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-400">Memuat...</Text>
      </View>
    )
  }

  if (!t) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-400">Transaksi tidak ditemukan</Text>
      </View>
    )
  }

  const statusVariant = t.status === 'completed' ? 'success' as const : 'warning' as const

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen options={{ title: `Transaksi #${t.id}` }} />

      <View className="p-4 border-b border-gray-200">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-lg font-bold text-gray-900">#{t.id}</Text>
          <Badge label={t.status} variant={statusVariant} />
        </View>
        <Text className="text-sm text-gray-500">
          {formatDate(t.created_at)} • {formatTime(t.created_at)}
        </Text>
        <Text className="text-2xl font-bold text-blue-600 mt-2">{formatRupiah(t.total_amount)}</Text>
      </View>

      <Text className="px-4 py-3 text-sm font-semibold text-gray-700">Item</Text>

      {t.items && t.items.length > 0 ? (
        <FlatList
          data={t.items}
          keyExtractor={(item: TransactionItem) => String(item.id)}
          renderItem={({ item }) => (
            <View className="flex-row items-center px-4 py-3 border-b border-gray-100">
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-900">{item.product.name}</Text>
                <Text className="text-xs text-gray-500 mt-0.5">
                  {formatRupiah(item.price)} x {item.quantity}
                </Text>
              </View>
              <Text className="text-sm font-semibold text-gray-900">{formatRupiah(item.subtotal)}</Text>
            </View>
          )}
          ListFooterComponent={
            <View className="flex-row justify-between px-4 py-4 border-t border-gray-200">
              <Text className="text-base font-bold text-gray-900">Total</Text>
              <Text className="text-base font-bold text-blue-600">{formatRupiah(t.total_amount)}</Text>
            </View>
          }
        />
      ) : (
        <Text className="px-4 text-gray-400">Tidak ada item</Text>
      )}

      <View className="p-4">
        <TouchableOpacity className="bg-gray-100 py-3 rounded-lg items-center" onPress={() => router.back()}>
          <Text className="text-gray-700 font-medium">Kembali</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

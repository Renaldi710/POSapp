import { View, Text, ScrollView } from 'react-native'
import { Stack } from 'expo-router'
import { useDailyReport } from '../../src/features/reports/hooks/useReports'
import StatCard from '../../src/components/ui/StatCard'
import { formatRupiah } from '../../src/utils/currency'

function todayString() {
  const d = new Date()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mm}-${dd}`
}

export default function DashboardScreen() {
  const { data: report, isLoading, error } = useDailyReport(todayString())

  return (
    <ScrollView className="flex-1 bg-white">
      <Stack.Screen options={{ title: 'Dashboard' }} />

      {isLoading ? (
        <View className="flex-1 items-center justify-center pt-20">
          <Text className="text-gray-400">Memuat...</Text>
        </View>
      ) : error || report === null ? (
        <View className="flex-1 items-center justify-center pt-20 px-6">
          <Text className="text-gray-400 text-base text-center">Laporan belum tersedia</Text>
        </View>
      ) : report ? (
        <>
          <View className="flex-row gap-3 px-4 pt-6 pb-4">
            <StatCard label="Penjualan Hari Ini" value={formatRupiah(report.total_revenue)} variant="blue" />
            <StatCard label="Transaksi" value={String(report.total_transactions)} variant="green" />
            <StatCard label="Item Terjual" value={String(report.total_items_sold)} variant="yellow" />
          </View>

          {report.top_products.length > 0 && (
            <View className="px-4">
              <Text className="text-base font-semibold text-gray-900 mb-3">Produk Terlaris</Text>
              {report.top_products.map((p, i) => (
                <View key={p.product_id} className="flex-row items-center py-3 border-b border-gray-100">
                  <Text className="w-8 text-sm font-bold text-gray-400">{i + 1}</Text>
                  <View className="flex-1">
                    <Text className="text-sm font-medium text-gray-900">{p.product.name}</Text>
                    <Text className="text-xs text-gray-500">{p.total_qty} terjual</Text>
                  </View>
                  <Text className="text-sm font-semibold text-gray-900">{formatRupiah(Number(p.total))}</Text>
                </View>
              ))}
            </View>
          )}
        </>
      ) : null}
    </ScrollView>
  )
}

import { useState } from 'react'
import { View, Text, TextInput, FlatList, ScrollView } from 'react-native'
import { useDailyReport } from '../../src/features/reports/hooks/useReports'
import StatCard from '../../src/components/ui/StatCard'
import { formatRupiah } from '../../src/utils/currency'
import type { DailyReport } from '../../src/api/types'

function todayString() {
  const d = new Date()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mm}-${dd}`
}

export default function LaporanScreen() {
  const [date, setDate] = useState(todayString())
  const { data: report, isLoading, error } = useDailyReport(date)

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="px-4 pt-4 pb-2">
        <TextInput
          className="bg-gray-100 border border-gray-200 rounded-lg px-4 py-2.5 text-base"
          placeholder="YYYY-MM-DD"
          value={date}
          onChangeText={setDate}
        />
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center pt-20">
          <Text className="text-gray-400">Memuat...</Text>
        </View>
      ) : error || report === null ? (
        <View className="flex-1 items-center justify-center pt-20 px-6">
          <Text className="text-gray-400 text-base text-center">
            Laporan belum tersedia
          </Text>
          <Text className="text-gray-400 text-sm text-center mt-2">
            Endpoint laporan belum aktif di backend
          </Text>
        </View>
      ) : report ? (
        <>
          <View className="flex-row gap-3 px-4 py-4">
            <StatCard
              label="Total Transaksi"
              value={String(report.total_transactions)}
              variant="blue"
            />
            <StatCard
              label="Total Pendapatan"
              value={formatRupiah(report.total_revenue)}
              variant="green"
            />
            <StatCard
              label="Item Terjual"
              value={String(report.total_items_sold)}
              variant="yellow"
            />
          </View>

          {report.top_products.length > 0 && (
            <View className="px-4">
              <Text className="text-sm font-semibold text-gray-700 mb-3">Produk Terlaris</Text>
              {report.top_products.map((p, i) => (
                <View key={p.product_id} className="flex-row items-center py-3 border-b border-gray-100">
                  <Text className="w-7 text-sm font-bold text-gray-400">{i + 1}</Text>
                  <View className="flex-1">
                    <Text className="text-sm font-medium text-gray-900">{p.product.name}</Text>
                    <Text className="text-xs text-gray-500">{p.total_qty} terjual • {formatRupiah(Number(p.total))}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </>
      ) : null}
    </ScrollView>
  )
}

import { View, Text, ScrollView } from 'react-native'
import { TrendingUp, Wallet, AlertTriangle, Users } from 'lucide-react-native'
import { useDailyReport } from '../../src/features/reports/hooks/useReports'
import StatCard from '../../src/components/ui/StatCard'
import ScreenLayout from '../../src/components/layout/ScreenLayout'
import { formatRupiah } from '../../src/utils/currency'
import type { DailyReport } from '../../src/api/types'

function todayString() {
  const d = new Date()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mm}-${dd}`
}

const DAYS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']

export default function DashboardScreen() {
  const { data, isLoading, error } = useDailyReport(todayString())
  const report = data as DailyReport | null

  return (
    <ScreenLayout title="Dashboard">
      <ScrollView className="flex-1 px-4 pt-4">
        {isLoading ? (
          <View className="flex-1 items-center justify-center pt-20">
            <Text className="text-text-light">Memuat...</Text>
          </View>
        ) : error || report === null ? (
          <View className="flex-1 items-center justify-center pt-20 px-6">
            <Text className="text-text-light text-base text-center">Laporan belum tersedia</Text>
          </View>
        ) : (
          <>
            <View className="flex-row gap-3 mb-4">
              <StatCard
                label="Total Penjualan"
                value={formatRupiah(report.total_revenue)}
                icon={<TrendingUp size={18} color="#22C55E" />}
                trend="12.5%"
                trendUp
                footnote="vs kemarin"
              />
              <StatCard
                label="Laba Bersih"
                value={formatRupiah(Math.round(report.total_revenue * 0.3))}
                icon={<Wallet size={18} color="#2563EB" />}
                trend="8.2%"
                trendUp
                footnote="vs kemarin"
              />
            </View>
            <View className="flex-row gap-3 mb-4">
              <StatCard
                label="Peringatan Stok"
                value="14 Items"
                icon={<AlertTriangle size={18} color="#F59E0B" />}
                trend="Stok Menipis"
              />
              <StatCard
                label="Total Pelanggan"
                value="248"
                icon={<Users size={18} color="#8B5CF6" />}
                footnote="New! +12 hari ini"
              />
            </View>

            <View className="bg-white rounded-xl border border-border p-4 mb-4">
              <Text className="text-sm font-semibold text-text-dark mb-3">Tren Penjualan 7 Hari</Text>
              <View className="flex-row items-end gap-2 h-24">
                {DAYS.map((day, i) => {
                  const h = 30 + Math.random() * 60
                  return (
                    <View key={day} className="flex-1 items-center gap-1">
                      <View
                        style={{ height: h, backgroundColor: i === 6 ? '#004AC6' : '#93C5FD', borderTopLeftRadius: 4, borderTopRightRadius: 4 }}
                        className="w-full"
                      />
                      <Text className="text-[10px] text-text-light">{day}</Text>
                    </View>
                  )
                })}
              </View>
            </View>

            <View className="bg-white rounded-xl border border-border p-4 mb-4">
              <Text className="text-sm font-semibold text-text-dark mb-3">Stok Kritis</Text>
              {report.top_products.slice(0, 4).map((p, i) => (
                <View key={p.product_id} className="flex-row items-center py-2 border-b border-border last:border-0">
                  <Text className="flex-1 text-sm text-text-dark">{p.product_name}</Text>
                  <Text className="text-xs font-medium text-red-500 mr-3">Stok: {p.total_quantity}</Text>
                  <View className="bg-primary px-3 py-1 rounded-lg">
                    <Text className="text-white text-xs font-medium">Restock</Text>
                  </View>
                </View>
              ))}
              {report.top_products.length === 0 && (
                <Text className="text-text-light text-sm text-center py-4">Tidak ada data stok kritis</Text>
              )}
            </View>

            <View className="bg-white rounded-xl border border-border p-4 mb-6">
              <Text className="text-sm font-semibold text-text-dark mb-3">Aktivitas Terbaru</Text>
              {report.top_products.slice(0, 3).map((p, i) => (
                <View key={i} className="flex-row items-start py-2 border-b border-border last:border-0">
                  <View className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-3" />
                  <View>
                    <Text className="text-sm text-text-dark">{p.product_name} — {p.total_quantity} terjual</Text>
                    <Text className="text-xs text-text-light">Transaksi terbaru hari ini</Text>
                  </View>
                </View>
              ))}
              {report.top_products.length === 0 && (
                <Text className="text-text-light text-sm text-center py-4">Belum ada aktivitas</Text>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </ScreenLayout>
  )
}

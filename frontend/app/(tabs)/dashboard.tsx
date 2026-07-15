import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { TrendingUp, Wallet, AlertTriangle, Users } from 'lucide-react-native'
import { router } from 'expo-router'
import { useProducts } from '../../src/features/products/hooks/useProducts'
import StatCard from '../../src/components/ui/StatCard'
import ScreenLayout from '../../src/components/layout/ScreenLayout'
import { formatRupiah } from '../../src/utils/currency'

const DAYS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']
const MOCK_REVENUE = 12_500_000

export default function DashboardScreen() {
  const { data: products, isLoading } = useProducts()

  const stockHabis = products?.filter((p) => p.stock === 0).length ?? 0
  const stockMenipis = products?.filter((p) => p.stock > 0 && p.stock < 10).length ?? 0
  const stokKritis = (products || [])
    .filter((p) => p.stock < 10)
    .sort((a, b) => a.stock - b.stock)

  return (
    <ScreenLayout title="Dashboard">
      <ScrollView className="flex-1 px-4 pt-4">
        <View className="flex-row gap-3 mb-4">
          <StatCard
            label="Total Penjualan"
            value={formatRupiah(MOCK_REVENUE)}
            icon={<TrendingUp size={18} color="#22C55E" />}
            trend="12.5%"
            trendUp
            footnote="vs kemarin"
          />
          <StatCard
            label="Laba Bersih"
            value={formatRupiah(Math.round(MOCK_REVENUE * 0.3))}
            icon={<Wallet size={18} color="#2563EB" />}
            trend="8.2%"
            trendUp
            footnote="vs kemarin"
          />
        </View>
        <View className="flex-row gap-3 mb-4">
          <StatCard
            label="Peringatan Stok"
            value={isLoading ? '\u2026' : String(stockHabis + stockMenipis) + ' Items'}
            icon={<AlertTriangle size={18} color="#F59E0B" />}
            trend={`${stockHabis} Habis, ${stockMenipis} Menipis`}
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
          <View className="flex-row items-end gap-2" style={{ height: 140 }}>
            {DAYS.map((day, i) => {
              const h = 30 + Math.random() * 50
              return (
                <View key={day} className="flex-1 items-center">
                  <View
                    style={{ height: h, backgroundColor: i === 6 ? '#004AC6' : '#93C5FD', borderTopLeftRadius: 4, borderTopRightRadius: 4 }}
                    className="w-full"
                  />
                  <Text className="text-[10px] text-text-light mt-1">{day}</Text>
                </View>
              )
            })}
          </View>
        </View>

        <View className="bg-white rounded-xl border border-border p-4 mb-4">
          <Text className="text-sm font-semibold text-text-dark mb-3">Stok Kritis</Text>
          {isLoading ? (
            <Text className="text-text-light text-sm text-center py-4">Memuat...</Text>
          ) : stokKritis.length === 0 ? (
            <Text className="text-text-light text-sm text-center py-4">Semua stok aman</Text>
          ) : (
            stokKritis.map((p) => (
              <TouchableOpacity
                key={p.id}
                className="flex-row items-center py-2 border-b border-border last:border-0"
                onPress={() => router.push(`/(tabs)/inventaris?highlight=${p.id}`)}
              >
                <Text className="flex-1 text-sm text-text-dark">{p.name}</Text>
                <Text className="text-xs font-medium mr-3" style={{ color: p.stock === 0 ? '#EF4444' : '#F59E0B' }}>
                  Stok: {p.stock}
                </Text>
                <View className="bg-primary px-3 py-1 rounded-lg">
                  <Text className="text-white text-xs font-medium">Restock</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        <View className="bg-white rounded-xl border border-border p-4 mb-6">
          <Text className="text-sm font-semibold text-text-dark mb-3">Aktivitas Terbaru</Text>
          <View className="flex-row items-start py-2 border-b border-border last:border-0">
            <View className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-3" />
            <View>
              <Text className="text-sm text-text-dark">Transaksi hari ini — 0 terjual</Text>
              <Text className="text-xs text-text-light">Belum ada transaksi</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenLayout>
  )
}

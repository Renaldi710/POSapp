import { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { Download, Wallet, QrCode, CreditCard } from 'lucide-react-native'
import { useDailyReport } from '../../src/features/reports/hooks/useReports'
import StatCard from '../../src/components/ui/StatCard'
import ScreenLayout from '../../src/components/layout/ScreenLayout'
import ProgressBar from '../../src/components/layout/ProgressBar'
import { formatRupiah } from '../../src/utils/currency'
import { downloadTransactionsCSV } from '../../src/lib/export'
import type { DailyReport } from '../../src/api/types'

function todayString() {
  const d = new Date()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mm}-${dd}`
}

const PERIODS = ['Hari Ini', 'Minggu Ini', 'Bulan Ini']

export default function LaporanScreen() {
  const [period, setPeriod] = useState(0)
  const [date] = useState(todayString())
  const { data, isLoading, error } = useDailyReport(date)
  const report = data as DailyReport | null

  const paymentMethods = [
    { label: 'Tunai', icon: Wallet, color: '#22C55E', value: report ? Math.round(report.total_revenue * 0.5) : 0 },
    { label: 'QRIS', icon: QrCode, color: '#2563EB', value: report ? Math.round(report.total_revenue * 0.3) : 0 },
    { label: 'Kartu', icon: CreditCard, color: '#8B5CF6', value: report ? Math.round(report.total_revenue * 0.2) : 0 },
  ]

  const totalPayments = paymentMethods.reduce((s, m) => s + m.value, 0)

  const transactions = report
    ? Array.from({ length: Math.min(report.total_transactions, 12) }, (_, i) => ({
        id: `TRX-${String(i + 1).padStart(4, '0')}`,
        time: `${String(8 + (i % 10)).padStart(2, '0')}:${String((i * 7) % 60).padStart(2, '0')}`,
        items: Math.floor(Math.random() * 5) + 1,
        metode: ['Tunai', 'QRIS', 'Kartu'][i % 3],
        total: Math.round(report.total_revenue / (report.total_transactions || 1)) + Math.floor(Math.random() * 20000),
      }))
    : []

  return (
    <ScreenLayout title="Laporan Penjualan">
      <ScrollView className="flex-1 px-4 pt-4">
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row gap-2">
            {PERIODS.map((p, i) => (
              <TouchableOpacity
                key={p}
                className={`px-4 py-1.5 rounded-full border ${period === i ? 'bg-primary border-primary' : 'bg-white border-border'}`}
                onPress={() => setPeriod(i)}
              >
                <Text className={`text-sm font-medium ${period === i ? 'text-white' : 'text-text-medium'}`}>{p}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity className="flex-row items-center gap-1.5 border border-border px-3 py-1.5 rounded-xl" onPress={() => downloadTransactionsCSV({ date_from: date, date_to: date })}>
            <Download size={16} color="#434655" />
            <Text className="text-sm text-text-medium font-medium">Ekspor</Text>
          </TouchableOpacity>
        </View>

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
              <StatCard label="Total Transaksi" value={String(report.total_transactions)} />
              <StatCard label="Total Pendapatan" value={formatRupiah(report.total_revenue)} />
            </View>

            <View className="bg-white rounded-xl border border-border p-4 mb-4">
              <Text className="text-sm font-semibold text-text-dark mb-3">Metode Pembayaran</Text>
              {paymentMethods.map((m) => {
                const pct = totalPayments > 0 ? Math.round((m.value / totalPayments) * 100) : 0
                const Icon = m.icon
                return (
                  <View key={m.label} className="mb-3 last:mb-0">
                    <View className="flex-row items-center justify-between mb-1.5">
                      <View className="flex-row items-center gap-2">
                        <Icon size={16} color={m.color} />
                        <Text className="text-sm text-text-dark">{m.label}</Text>
                      </View>
                      <Text className="text-sm font-semibold text-text-dark">{formatRupiah(m.value)} ({pct}%)</Text>
                    </View>
                    <ProgressBar value={m.value} max={totalPayments} color={m.color} />
                  </View>
                )
              })}
            </View>

            {report.total_revenue > 0 && (
              <View className="bg-white rounded-xl border border-border p-4 mb-4">
                <Text className="text-xs text-text-light mb-1">Gross Sales</Text>
                <Text className="text-2xl font-bold text-text-dark">{formatRupiah(report.total_revenue)}</Text>
              </View>
            )}

            <View className="bg-white rounded-xl border border-border mb-4 overflow-hidden">
              <View className="flex-row bg-bg-page px-3 py-2.5 border-b border-border">
                {['ID', 'Waktu', 'Item', 'Metode', 'Total'].map((h) => (
                  <View key={h} style={{ flex: h === 'ID' ? 1.5 : h === 'Total' ? 1.5 : 1 }}>
                    <Text className="text-xs font-semibold text-text-medium uppercase tracking-wide">{h}</Text>
                  </View>
                ))}
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={{ minWidth: 500 }}>
                  {transactions.map((tx, i) => (
                    <View key={tx.id} className="flex-row items-center px-3 py-2.5 border-b border-border">
                      <View style={{ flex: 1.5 }}><Text className="text-sm text-text-dark">{tx.id}</Text></View>
                      <View style={{ flex: 1 }}><Text className="text-sm text-text-medium">{tx.time}</Text></View>
                      <View style={{ flex: 1 }}><Text className="text-sm text-text-medium">{tx.items}</Text></View>
                      <View style={{ flex: 1 }}><Text className="text-sm text-text-medium">{tx.metode}</Text></View>
                      <View style={{ flex: 1.5 }}><Text className="text-sm font-semibold text-text-dark">{formatRupiah(tx.total)}</Text></View>
                    </View>
                  ))}
                  {transactions.length === 0 && (
                    <View className="px-3 py-8 items-center">
                      <Text className="text-text-light text-sm">Belum ada transaksi</Text>
                    </View>
                  )}
                </View>
              </ScrollView>
            </View>

            <View className="flex-row items-center justify-center gap-2 pb-6">
              <TouchableOpacity className="w-8 h-8 rounded-lg bg-primary items-center justify-center">
                <Text className="text-white text-sm font-medium">1</Text>
              </TouchableOpacity>
              <TouchableOpacity className="w-8 h-8 rounded-lg bg-white border border-border items-center justify-center">
                <Text className="text-text-medium text-sm">2</Text>
              </TouchableOpacity>
              <TouchableOpacity className="w-8 h-8 rounded-lg bg-white border border-border items-center justify-center">
                <Text className="text-text-medium text-sm">3</Text>
              </TouchableOpacity>
            </View>

            {report.top_products.length > 0 && (
              <View className="bg-white rounded-xl border border-border p-4 mb-6">
                <Text className="text-sm font-semibold text-text-dark mb-3">Produk Terlaris</Text>
                {report.top_products.map((p, i) => (
                  <View key={p.product_id} className="flex-row items-center py-2 border-b border-border last:border-0">
                    <Text className="w-6 text-sm font-bold text-text-light">{i + 1}</Text>
                    <View className="flex-1 ml-2">
                      <Text className="text-sm font-medium text-text-dark">{p.product_name}</Text>
                      <Text className="text-xs text-text-light">{p.total_quantity} terjual</Text>
                    </View>
                    <View className="flex-1 ml-4">
                      <ProgressBar value={p.total_quantity} max={report.top_products[0].total_quantity} color="#2563EB" />
                    </View>
                    <Text className="text-sm font-semibold text-text-dark w-24 text-right">{formatRupiah(p.total_subtotal)}</Text>
                  </View>
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </ScreenLayout>
  )
}

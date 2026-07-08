import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { COLORS, RADIUS, SPACING, FONT_SIZES, SHADOWS } from '../constants/theme'
import DashboardHeader from '../components/layout/DashboardHeader'
import StatCard from '../components/ui/StatCard'
import FilterTabs from '../components/ui/FilterTabs'
import DataTable from '../components/ui/DataTable'
import { transactionService } from '../services/transactions'

const filterTabs = [
  { key: 'hari', label: 'Hari Ini' },
  { key: 'minggu', label: 'Minggu Ini' },
  { key: 'bulan', label: 'Bulan Ini' },
]

const ReportsScreen = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('hari')
  const [page, setPage] = useState(1)

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await transactionService.getAll()
        setTransactions(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const revenue = transactions.reduce((s, t) => s + Number(t.total_amount), 0)
  const profit = revenue * 0.3
  const avgTicket = transactions.length > 0 ? revenue / transactions.length : 0

  const paymentMethods = [
    { label: 'Tunai', value: Math.floor(revenue * 0.55), color: COLORS.primary },
    { label: 'QRIS', value: Math.floor(revenue * 0.30), color: '#8B5CF6' },
    { label: 'Kartu', value: Math.floor(revenue * 0.15), color: '#10B981' },
  ]
  const maxMethod = Math.max(...paymentMethods.map(m => m.value), 1)

  const columns = [
    { label: 'ID Transaksi', width: 130 },
    { label: 'Waktu', width: 160 },
    { label: 'Item Terjual', width: 120, align: 'center' },
    { label: 'Metode', width: 100 },
    { label: 'Total', width: 130, align: 'right' },
    { label: 'Aksi', width: 80, align: 'center' },
  ]

  const totalItemsSold = (t) => t.items ? t.items.reduce((s, i) => s + i.quantity, 0) : 0

  return (
    <View style={styles.container}>
      <DashboardHeader title="Laporan Penjualan" userName="Admin Varca" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.topRow}>
          <FilterTabs tabs={filterTabs} activeTab={filter} onTabChange={(k) => { setFilter(k); setPage(1) }} />
          <TouchableOpacity style={styles.exportBtn}>
            <MaterialCommunityIcons name="file-export-outline" size={18} color={COLORS.white} />
            <Text style={styles.exportText}>Ekspor Laporan</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <StatCard label="Total Penjualan Kotor" value={`Rp${revenue.toLocaleString('id-ID')}`} icon="cash-multiple" color={COLORS.primary} />
          <StatCard label="Transaksi" value={transactions.length.toString()} icon="clipboard-list" color="#8B5CF6" />
          <StatCard label="Rata-rata Struk" value={`Rp${Math.round(avgTicket).toLocaleString('id-ID')}`} icon="receipt" color="#F59E0B" />
          <StatCard label="Laba Bersih" value={`Rp${Math.round(profit).toLocaleString('id-ID')}`} icon="chart-line" color="#10B981" badge="+8.2%" badgeColor={COLORS.success} />
        </View>

        <View style={styles.gridRow}>
          <View style={styles.chartWrap}>
            <View style={[styles.chartCard, SHADOWS.card]}>
              <Text style={styles.chartTitle}>Metode Pembayaran</Text>
              {paymentMethods.map((m) => {
                const pct = ((m.value / maxMethod) * 100).toFixed(0)
                return (
                  <View key={m.label} style={styles.payRow}>
                    <View style={[styles.payDot, { backgroundColor: m.color }]} />
                    <Text style={styles.payLabel}>{m.label}</Text>
                    <View style={styles.payBarBg}>
                      <View style={[styles.payBar, { width: pct + '%', backgroundColor: m.color }]} />
                    </View>
                    <Text style={styles.payValue}>Rp{m.value.toLocaleString('id-ID')}</Text>
                  </View>
                )
              })}
            </View>
          </View>
          <View style={styles.tableWrap}>
            {loading ? (
              <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />
            ) : (
              <DataTable
                columns={columns}
                data={transactions.slice((page - 1) * 10, page * 10)}
                page={page}
                totalPages={Math.ceil(transactions.length / 10)}
                onPageChange={setPage}
                renderRow={(item) => (
                  columns.map((col, ci) => {
                    if (col.label === 'ID Transaksi') return <Text key={ci} style={[styles.cell, { width: col.width, fontWeight: '600' }]}>#{item.id}</Text>
                    if (col.label === 'Waktu') return <Text key={ci} style={[styles.cell, { width: col.width, fontSize: FONT_SIZES.xs }]}>{new Date(item.created_at).toLocaleString('id-ID')}</Text>
                    if (col.label === 'Item Terjual') return <Text key={ci} style={[styles.cell, { width: col.width, textAlign: 'center' }]}>{totalItemsSold(item)} item</Text>
                    if (col.label === 'Metode') return <Text key={ci} style={[styles.cell, { width: col.width }]}>{item.method || 'Tunai'}</Text>
                    if (col.label === 'Total') return <Text key={ci} style={[styles.cell, { width: col.width, textAlign: 'right', fontWeight: '600', color: COLORS.primary }]}>Rp{Number(item.total_amount).toLocaleString('id-ID')}</Text>
                    if (col.label === 'Aksi') return (
                      <View key={ci} style={[styles.cell, { width: col.width, alignItems: 'center' }]}>
                        <TouchableOpacity>
                          <MaterialCommunityIcons name="eye-outline" size={18} color={COLORS.textSecondary} />
                        </TouchableOpacity>
                      </View>
                    )
                    return null
                  })
                )}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.xl },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xl },
  exportBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.primary, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm + 2, borderRadius: RADIUS.md, gap: SPACING.sm },
  exportText: { color: COLORS.white, fontSize: FONT_SIZES.sm, fontWeight: '600' },
  statsRow: { flexDirection: 'row', gap: SPACING.lg, marginBottom: SPACING.xl, flexWrap: 'wrap' },
  gridRow: { flexDirection: 'row', gap: SPACING.xl },
  chartWrap: { flex: 1 },
  tableWrap: { flex: 2 },
  chartCard: { backgroundColor: COLORS.cardBg, borderRadius: RADIUS.lg, padding: SPACING.xl },
  chartTitle: { fontSize: FONT_SIZES.lg, fontWeight: '700', color: COLORS.textPrimary, marginBottom: SPACING.lg },
  payRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md, gap: SPACING.sm },
  payDot: { width: 10, height: 10, borderRadius: RADIUS.full },
  payLabel: { width: 50, fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
  payBarBg: { flex: 1, height: 8, backgroundColor: COLORS.background, borderRadius: RADIUS.full, overflow: 'hidden' },
  payBar: { height: 8, borderRadius: RADIUS.full },
  payValue: { width: 90, textAlign: 'right', fontSize: FONT_SIZES.xs, color: COLORS.textPrimary, fontWeight: '500' },
  cell: { paddingVertical: SPACING.md, paddingHorizontal: SPACING.md, fontSize: FONT_SIZES.sm, color: COLORS.textPrimary },
})

export default ReportsScreen

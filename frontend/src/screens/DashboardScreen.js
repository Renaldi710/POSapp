import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { COLORS, RADIUS, SPACING, FONT_SIZES, SHADOWS } from '../constants/theme'
import StatCard from '../components/ui/StatCard'
import TimelineItem from '../components/ui/TimelineItem'
import DashboardHeader from '../components/layout/DashboardHeader'
import { productService } from '../services/products'
import { categoryService } from '../services/categories'
import { transactionService } from '../services/transactions'

const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']

const BarChart = ({ data }) => {
  const max = Math.max(...data, 1)
  return (
    <View style={chartStyles.container}>
      <Text style={chartStyles.title}>Tren Penjualan Mingguan</Text>
      <View style={chartStyles.chart}>
        {data.map((val, i) => {
          const height = Math.max((val / max) * 140, 4)
          return (
            <View key={i} style={chartStyles.barCol}>
              <Text style={chartStyles.barValue}>{val > 0 ? val : ''}</Text>
              <View style={[chartStyles.bar, { height }]} />
              <Text style={chartStyles.barLabel}>{days[i].slice(0, 3)}</Text>
            </View>
          )
        })}
      </View>
    </View>
  )
}

const chartStyles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    ...SHADOWS.card,
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xl,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 180,
  },
  barCol: {
    alignItems: 'center',
    flex: 1,
  },
  barValue: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  bar: {
    width: 28,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.sm,
    minHeight: 4,
  },
  barLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    marginTop: 6,
  },
})

const DashboardScreen = () => {
  const [stats, setStats] = useState({ products: 0, categories: 0, transactions: 0, revenue: 0 })
  const [recentTransactions, setRecentTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const [products, categories, transactions] = await Promise.all([
          productService.getAll(),
          categoryService.getAll(),
          transactionService.getAll(),
        ])
        const revenue = transactions.reduce((sum, t) => sum + Number(t.total_amount), 0)
        setStats({ products: products.length, categories: categories.length, transactions: transactions.length, revenue })
        setRecentTransactions(transactions.slice(0, 5).reverse())
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const salesData = [45, 72, 38, 65, 90, 55, 80]

  const activities = recentTransactions.map((t, i) => ({
    type: 'transaction',
    title: 'Transaksi Berhasil',
    description: `#${t.id} - Rp${Number(t.total_amount).toLocaleString('id-ID')}`,
    time: new Date(t.created_at).toLocaleString('id-ID'),
  }))

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <DashboardHeader title="Dashboard" userName="Admin Varca" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.statsRow}>
          <StatCard
            label="Total Penjualan"
            value={`Rp${stats.revenue.toLocaleString('id-ID')}`}
            icon="cash-multiple"
            color={COLORS.primary}
            badge="+12.5%"
            badgeColor={COLORS.success}
          />
          <StatCard
            label="Laba Bersih"
            value={`Rp${(stats.revenue * 0.3).toLocaleString('id-ID')}`}
            icon="chart-line"
            color="#8B5CF6"
            badge="+8.2%"
            badgeColor={COLORS.success}
          />
          <StatCard
            label="Peringatan Stok Menipis"
            value={stats.products > 0 ? Math.floor(stats.products * 0.15).toString() : '0'}
            icon="alert-circle-outline"
            color="#F59E0B"
          />
          <StatCard
            label="Total Pelanggan"
            value={stats.transactions > 0 ? Math.floor(stats.transactions * 0.7).toString() : '0'}
            icon="account-group"
            color="#10B981"
          />
        </View>

        <View style={styles.gridRow}>
          <View style={styles.gridLeft}>
            <BarChart data={salesData} />
          </View>
          <View style={styles.gridRight}>
            <View style={[styles.recentCard, SHADOWS.card]}>
              <Text style={styles.recentTitle}>Recent Activities</Text>
              {activities.length === 0 ? (
                <Text style={styles.emptyText}>Belum ada aktivitas</Text>
              ) : (
                activities.map((act, i) => (
                  <TimelineItem key={i} type={act.type} title={act.title} description={act.description} time={act.time} />
                ))
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.xl,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.lg,
    marginBottom: SPACING.xl,
    flexWrap: 'wrap',
  },
  gridRow: {
    flexDirection: 'row',
    gap: SPACING.xl,
  },
  gridLeft: {
    flex: 2,
  },
  gridRight: {
    flex: 1,
  },
  recentCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
  },
  recentTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZES.md,
    textAlign: 'center',
    paddingVertical: SPACING.xl,
  },
})

export default DashboardScreen

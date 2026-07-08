import React, { useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { COLORS, RADIUS, SPACING, FONT_SIZES, SHADOWS } from '../constants/theme'
import DashboardHeader from '../components/layout/DashboardHeader'
import DataTable from '../components/ui/DataTable'
import Badge from '../components/ui/Badge'
import TimelineItem from '../components/ui/TimelineItem'

const mockUsers = [
  { id: 1, name: 'Rafi Zikri', initials: 'RZ', role: 'admin', lastLogin: '2024-01-15 08:30', status: 'active' },
  { id: 2, name: 'Bunga Lestari', initials: 'BL', role: 'cashier', lastLogin: '2024-01-15 07:45', status: 'active' },
  { id: 3, name: 'Fadli Suta', initials: 'FS', role: 'cashier', lastLogin: '2024-01-14 16:20', status: 'active' },
  { id: 4, name: 'Dewi Sartika', initials: 'DS', role: 'cashier', lastLogin: '2024-01-13 12:00', status: 'inactive' },
  { id: 5, name: 'Citra Kirana', initials: 'CK', role: 'admin', lastLogin: '2024-01-15 09:00', status: 'active' },
]

const mockLogs = [
  { type: 'user', title: 'Admin mengubah izin Fadli Suta', description: 'Perubahan role Cashier', time: '10 menit yang lalu' },
  { type: 'user', title: 'Pengguna baru ditambahkan', description: 'Citra Kirana sebagai Admin', time: '1 jam yang lalu' },
  { type: 'login', title: 'Login berhasil', description: 'Bunga Lestari masuk shift pagi', time: '2 jam yang lalu' },
]

const UserManagementScreen = () => {
  const [users] = useState(mockUsers)

  const columns = [
    { label: 'Karyawan', width: 200 },
    { label: 'Role', width: 100 },
    { label: 'Last Login', width: 160 },
    { label: 'Status', width: 100 },
    { label: 'Aksi', width: 120, align: 'center' },
  ]

  return (
    <View style={styles.container}>
      <DashboardHeader title="Manajemen Pengguna" userName="Admin Varca" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.mainRow}>
          <View style={styles.tableWrap}>
            <DataTable
              columns={columns}
              data={users}
              renderRow={(item) => (
                columns.map((col, ci) => {
                  if (col.label === 'Karyawan') return (
                    <View key={ci} style={[styles.cell, { width: col.width, flexDirection: 'row', alignItems: 'center', gap: SPACING.md }]}>
                      <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{item.initials}</Text>
                      </View>
                      <View>
                        <Text style={{ fontWeight: '600', fontSize: FONT_SIZES.sm, color: COLORS.textPrimary }}>{item.name}</Text>
                        <Text style={{ fontSize: FONT_SIZES.xs, color: COLORS.textMuted }}>ID-{String(item.id).padStart(4, '0')}</Text>
                      </View>
                    </View>
                  )
                  if (col.label === 'Role') return (
                    <View key={ci} style={[styles.cell, { width: col.width }]}>
                      <Badge type={item.role} />
                    </View>
                  )
                  if (col.label === 'Last Login') return <Text key={ci} style={[styles.cell, { width: col.width, fontSize: FONT_SIZES.xs }]}>{item.lastLogin}</Text>
                  if (col.label === 'Status') return (
                    <View key={ci} style={[styles.cell, { width: col.width }]}>
                      <Badge type={item.status} />
                    </View>
                  )
                  if (col.label === 'Aksi') return (
                    <View key={ci} style={[styles.cell, { width: col.width, flexDirection: 'row', gap: SPACING.md, justifyContent: 'center' }]}>
                      <TouchableOpacity>
                        <MaterialCommunityIcons name="pencil" size={18} color={COLORS.primary} />
                      </TouchableOpacity>
                      <TouchableOpacity>
                        <MaterialCommunityIcons name="trash-can-outline" size={18} color={COLORS.danger} />
                      </TouchableOpacity>
                    </View>
                  )
                  return null
                })
              )}
            />
          </View>
          <View style={styles.sidePanel}>
            <View style={[styles.infoCard, SHADOWS.card]}>
              <View style={styles.infoHeader}>
                <MaterialCommunityIcons name="shield-account" size={24} color={COLORS.primary} />
                <Text style={styles.infoTitle}>Informasi Keamanan</Text>
              </View>
              <Text style={styles.infoDesc}>
                Hanya Admin Utama yang memiliki akses penuh ke manajemen pengguna. Password default untuk akun baru adalah "123".
              </Text>
            </View>
            <View style={[styles.logCard, SHADOWS.card]}>
              <Text style={styles.logTitle}>Log Aktivitas</Text>
              {mockLogs.map((log, i) => (
                <TimelineItem key={i} type={log.type} title={log.title} description={log.description} time={log.time} />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.xl },
  mainRow: { flexDirection: 'row', gap: SPACING.xl },
  tableWrap: { flex: 2 },
  sidePanel: { flex: 1, gap: SPACING.lg },
  cell: { paddingVertical: SPACING.md, paddingHorizontal: SPACING.md, fontSize: FONT_SIZES.sm, color: COLORS.textPrimary },
  avatar: { width: 36, height: 36, borderRadius: RADIUS.full, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: COLORS.white, fontSize: FONT_SIZES.xs, fontWeight: '700' },
  infoCard: { backgroundColor: COLORS.cardBg, borderRadius: RADIUS.lg, padding: SPACING.xl },
  infoHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  infoTitle: { fontSize: FONT_SIZES.lg, fontWeight: '700', color: COLORS.textPrimary },
  infoDesc: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, lineHeight: 20 },
  logCard: { backgroundColor: COLORS.cardBg, borderRadius: RADIUS.lg, padding: SPACING.xl },
  logTitle: { fontSize: FONT_SIZES.lg, fontWeight: '700', color: COLORS.textPrimary, marginBottom: SPACING.lg },
})

export default UserManagementScreen

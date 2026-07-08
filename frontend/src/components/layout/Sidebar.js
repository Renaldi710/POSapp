import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { COLORS, SHADOWS, SPACING, RADIUS, FONT_SIZES } from '../../constants/theme'

const menuItems = [
  { key: 'Dashboard', icon: 'view-dashboard', label: 'Dashboard' },
  { key: 'POS', icon: 'cart', label: 'POS' },
  { key: 'Reports', icon: 'chart-box', label: 'Laporan' },
  { key: 'Inventory', icon: 'package-variant-closed', label: 'Inventaris' },
  { key: 'Users', icon: 'account-group', label: 'User Management' },
]

const Sidebar = ({ activeRoute, onNavigate, onLogout }) => {
  return (
    <View style={[styles.container, SHADOWS.sidebar]}>
      <View style={styles.logoArea}>
        <View style={styles.logoIcon}>
          <MaterialCommunityIcons name="store" size={28} color={COLORS.white} />
        </View>
        <Text style={styles.logoTitle}>VarcaTech</Text>
        <Text style={styles.logoSub}>Kasir POS</Text>
      </View>

      <View style={styles.menuArea}>
        {menuItems.map((item) => {
          const isActive = activeRoute === item.key
          return (
            <TouchableOpacity
              key={item.key}
              style={[styles.menuItem, isActive && styles.menuItemActive]}
              onPress={() => onNavigate(item.key)}
            >
              <MaterialCommunityIcons
                name={item.icon}
                size={20}
                color={isActive ? COLORS.white : COLORS.textSecondary}
              />
              <Text style={[styles.menuLabel, isActive && styles.menuLabelActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>

      <View style={styles.bottomArea}>
        <TouchableOpacity style={styles.logoutItem} onPress={onLogout}>
          <MaterialCommunityIcons name="logout" size={20} color={COLORS.danger} />
          <Text style={styles.logoutLabel}>Keluar</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 240,
    backgroundColor: COLORS.sidebarBg,
    paddingTop: SPACING.xxxl,
    paddingBottom: SPACING.xl,
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
  },
  logoArea: {
    alignItems: 'center',
    paddingBottom: SPACING.xxl,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  logoIcon: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  logoTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  logoSub: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  menuArea: {
    flex: 1,
    paddingHorizontal: SPACING.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: 2,
  },
  menuItemActive: {
    backgroundColor: COLORS.primary,
  },
  menuLabel: {
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
    color: COLORS.textSecondary,
    marginLeft: SPACING.md,
  },
  menuLabelActive: {
    color: COLORS.white,
    fontWeight: '600',
  },
  bottomArea: {
    paddingHorizontal: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.md,
  },
  logoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  logoutLabel: {
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
    color: COLORS.danger,
    marginLeft: SPACING.md,
  },
})

export default Sidebar

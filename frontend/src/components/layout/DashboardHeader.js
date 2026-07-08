import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { COLORS, SHADOWS, SPACING, RADIUS, FONT_SIZES } from '../../constants/theme'
import SearchBar from '../ui/SearchBar'

const DashboardHeader = ({ title, searchValue, onSearchChange, userName, onMenuPress }) => {
  return (
    <View style={[styles.container, SHADOWS.header]}>
      <View style={styles.left}>
        <TouchableOpacity style={styles.menuBtn} onPress={onMenuPress}>
          <MaterialCommunityIcons name="menu" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.right}>
        <View style={styles.searchWrap}>
          <SearchBar value={searchValue} onChangeText={onSearchChange} placeholder="Cari..." />
        </View>
        <View style={styles.userArea}>
          <MaterialCommunityIcons name="bell-outline" size={22} color={COLORS.textSecondary} />
          <View style={styles.userAvatar}>
            <Text style={styles.avatarText}>
              {userName ? userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U'}
            </Text>
          </View>
          <Text style={styles.userName}>{userName || 'User'}</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.headerBg,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  menuBtn: {
    display: 'none',
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.lg,
  },
  searchWrap: {
    width: 240,
  },
  userArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
  },
  userName: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
})

export default DashboardHeader

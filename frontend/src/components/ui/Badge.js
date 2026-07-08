import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { COLORS, RADIUS, FONT_SIZES } from '../../constants/theme'

const statusConfig = {
  active: { bg: COLORS.successLight, text: COLORS.success, label: 'Active' },
  inactive: { bg: COLORS.dangerLight, text: COLORS.danger, label: 'Inactive' },
  habis: { bg: COLORS.dangerLight, text: COLORS.danger, label: 'Habis' },
  menipis: { bg: COLORS.warningLight, text: COLORS.warning, label: 'Menipis' },
  aman: { bg: COLORS.successLight, text: COLORS.success, label: 'Aman' },
  admin: { bg: COLORS.primaryLight, text: COLORS.primary, label: 'Admin' },
  cashier: { bg: COLORS.warningLight, text: COLORS.warning, label: 'Cashier' },
}

const Badge = ({ type, label, color, bgColor }) => {
  const config = statusConfig[type]
  const bg = bgColor || config?.bg || COLORS.infoBg
  const textColor = color || config?.text || COLORS.textSecondary
  const displayLabel = label || config?.label || type

  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.text, { color: textColor }]}>{displayLabel}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
  },
})

export default Badge

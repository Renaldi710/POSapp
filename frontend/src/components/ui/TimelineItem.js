import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { COLORS, SPACING, FONT_SIZES, RADIUS } from '../../constants/theme'

const iconMap = {
  login: { icon: 'login', color: COLORS.primary },
  stock: { icon: 'package-variant-closed', color: COLORS.warning },
  transaction: { icon: 'cash', color: COLORS.success },
  user: { icon: 'account', color: COLORS.textSecondary },
}

const TimelineItem = ({ type, title, description, time }) => {
  const config = iconMap[type] || { icon: 'circle-small', color: COLORS.textMuted }

  return (
    <View style={styles.container}>
      <View style={styles.lineContainer}>
        <View style={[styles.dot, { backgroundColor: config.color }]} />
        <View style={styles.line} />
      </View>
      <View style={styles.content}>
        <View style={styles.topRow}>
          <MaterialCommunityIcons name={config.icon} size={16} color={config.color} />
          <Text style={styles.title}>{title}</Text>
        </View>
        <Text style={styles.description}>{description}</Text>
        <Text style={styles.time}>{time}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: SPACING.xs,
  },
  lineContainer: {
    alignItems: 'center',
    width: 24,
    marginRight: SPACING.md,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: RADIUS.full,
    marginTop: 4,
  },
  line: {
    flex: 1,
    width: 2,
    backgroundColor: COLORS.border,
    marginTop: 4,
  },
  content: {
    flex: 1,
    paddingBottom: SPACING.lg,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  title: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  description: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginLeft: 22,
  },
  time: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    marginTop: 2,
    marginLeft: 22,
  },
})

export default TimelineItem

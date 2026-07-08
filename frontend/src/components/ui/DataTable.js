import React from 'react'
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { COLORS, RADIUS, SPACING, FONT_SIZES, SHADOWS } from '../../constants/theme'

const DataTable = ({ columns, data, renderRow, page = 1, totalPages = 1, onPageChange }) => {
  return (
    <View style={[styles.container, SHADOWS.card]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          <View style={styles.headerRow}>
            {columns.map((col, i) => (
              <Text key={i} style={[styles.headerCell, { width: col.width || 120, textAlign: col.align || 'left' }]}>
                {col.label}
              </Text>
            ))}
          </View>
          {data.length === 0 ? (
            <View style={styles.empty}>
              <MaterialCommunityIcons name="inbox-outline" size={40} color={COLORS.textMuted} />
              <Text style={styles.emptyText}>Tidak ada data</Text>
            </View>
          ) : (
            data.map((item, index) => (
              <View key={item.id || index} style={[styles.dataRow, index % 2 === 1 && styles.dataRowAlt]}>
                {renderRow(item, columns)}
              </View>
            ))
          )}
        </View>
      </ScrollView>
      {totalPages > 1 && (
        <View style={styles.pagination}>
          <TouchableOpacity
            style={[styles.pageBtn, page <= 1 && styles.pageBtnDisabled]}
            disabled={page <= 1}
            onPress={() => onPageChange(page - 1)}
          >
            <MaterialCommunityIcons name="chevron-left" size={18} color={page <= 1 ? COLORS.textMuted : COLORS.textPrimary} />
          </TouchableOpacity>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <TouchableOpacity
              key={p}
              style={[styles.pageNum, p === page && styles.pageNumActive]}
              onPress={() => onPageChange(p)}
            >
              <Text style={[styles.pageNumText, p === page && styles.pageNumTextActive]}>{p}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={[styles.pageBtn, page >= totalPages && styles.pageBtnDisabled]}
            disabled={page >= totalPages}
            onPress={() => onPageChange(page + 1)}
          >
            <MaterialCommunityIcons name="chevron-right" size={18} color={page >= totalPages ? COLORS.textMuted : COLORS.textPrimary} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerCell: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dataRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  dataRowAlt: {
    backgroundColor: COLORS.background + '50',
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxxl,
  },
  emptyText: {
    marginTop: SPACING.sm,
    fontSize: FONT_SIZES.md,
    color: COLORS.textMuted,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    gap: SPACING.xs,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  pageBtn: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageBtnDisabled: {
    opacity: 0.5,
  },
  pageNum: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageNumActive: {
    backgroundColor: COLORS.primary,
  },
  pageNumText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  pageNumTextActive: {
    color: COLORS.white,
  },
})

export default DataTable

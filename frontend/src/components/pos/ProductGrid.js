import React from 'react'
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { COLORS, RADIUS, SPACING, FONT_SIZES, SHADOWS } from '../../constants/theme'
import SearchBar from '../ui/SearchBar'

const categories = [
  { key: '', label: 'Semua' },
  { key: 'Makanan', label: 'Makanan' },
  { key: 'Minuman', label: 'Minuman' },
  { key: 'Sembako', label: 'Sembako' },
  { key: 'Rokok', label: 'Rokok' },
]

const ProductGrid = ({ products, search, onSearchChange, categoryFilter, onCategoryChange, onAddToCart }) => {
  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <SearchBar value={search} onChangeText={onSearchChange} placeholder="Cari nama produk..." />
      </View>
      <View style={styles.categoryRow}>
        {categories.map((cat) => {
          const isActive = categoryFilter === cat.key
          return (
            <TouchableOpacity
              key={cat.key}
              style={[styles.categoryChip, isActive && styles.categoryChipActive]}
              onPress={() => onCategoryChange(cat.key)}
            >
              <Text style={[styles.categoryText, isActive && styles.categoryTextActive]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.gridRow}
        renderItem={({ item }) => (
          <View style={[styles.productCard, SHADOWS.card]}>
            <View style={styles.productImagePlaceholder}>
              <MaterialCommunityIcons name="package-variant-closed" size={32} color={COLORS.textMuted} />
            </View>
            <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.productCategory}>{item.category?.name || 'Umum'}</Text>
            <Text style={styles.productPrice}>Rp{Number(item.price).toLocaleString('id-ID')}</Text>
            <TouchableOpacity
              style={[styles.addBtn, item.stock <= 0 && styles.addBtnDisabled]}
              disabled={item.stock <= 0}
              onPress={() => onAddToCart(item)}
            >
              <Text style={styles.addBtnText}>{item.stock <= 0 ? 'Habis' : '+ Tambah'}</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialCommunityIcons name="package-variant-closed" size={48} color={COLORS.textMuted} />
            <Text style={styles.emptyText}>Produk tidak ditemukan</Text>
          </View>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchRow: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.sm,
  },
  categoryRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
    gap: SPACING.sm,
    flexWrap: 'wrap',
  },
  categoryChip: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  categoryTextActive: {
    color: COLORS.white,
    fontWeight: '600',
  },
  grid: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  gridRow: {
    gap: SPACING.md,
  },
  productCard: {
    flex: 1,
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    alignItems: 'center',
  },
  productImagePlaceholder: {
    width: 64,
    height: 64,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  productName: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  productCategory: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  productPrice: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.primary,
    marginVertical: SPACING.sm,
  },
  addBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
  },
  addBtnDisabled: {
    backgroundColor: COLORS.textMuted,
  },
  addBtnText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyText: {
    marginTop: SPACING.sm,
    fontSize: FONT_SIZES.md,
    color: COLORS.textMuted,
  },
})

export default ProductGrid
